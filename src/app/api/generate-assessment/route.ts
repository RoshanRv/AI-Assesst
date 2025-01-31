import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { QdrantVectorStore } from "@langchain/qdrant";
import { NextRequest, NextResponse } from "next/server";

const MAX_RETRIES = 3;
const NUM_QUESTIONS = 5;
const NUM_OPTIONS = 4;
const VECTOR_SEARCH_LIMIT = 4;

interface GenerateAssessmentRequest {
  topic: string;
  noOfQuestions: number;
}

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "ai-assest-1",
});

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
  noOfQuestions: Annotation<number>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  noOfQuestions: Annotation<number>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

const retrieve = async (state: typeof InputStateAnnotation.State) => {
  const retrievedDocs = await vectorStore.similaritySearch(
    state.question,
    VECTOR_SEARCH_LIMIT
  );
  console.log({ retrievedDocs });
  return { context: retrievedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
  const docsContent = state.context.map((doc) => doc.pageContent).join("\n");

  const template = `Based on the following context, generate {noOfQuestions} multiple choice questions. 
Each question should have ${NUM_OPTIONS} options with only one correct answer. 
Format your response as a JSON array of objects with the following structure:


  "question": "the question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "the correct option"


If the given question is not related to the context, return an empty array.

{context}

Question: Generate MCQ questions about {question}

Requirements:
1. Questions should be clear, specific, and directly related to the context
2. All options should be plausible but clearly distinguishable
3. Exactly one option should be correct
4. Return valid JSON format only
5. Generate exactly {noOfQuestions} questions
6. If the topic is not covered in the context, return []`;

  const promptTemplateCustom = ChatPromptTemplate.fromMessages([
    ["user", template],
  ]);

  const messages = await promptTemplateCustom.invoke({
    question: state.question,
    context: docsContent,
    noOfQuestions: state.noOfQuestions,
  });
  const response = await llm.invoke(messages);
  return { answer: response.content };
};

const validateQuestions = (questions: MCQQuestion[]): boolean => {
  if (!Array.isArray(questions)) return false;
  return questions.every(
    (q) =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === NUM_OPTIONS &&
      q.correctAnswer &&
      q.options.includes(q.correctAnswer)
  );
};

export async function POST(request: NextRequest) {
  try {
    const { topic, noOfQuestions } =
      (await request.json()) as GenerateAssessmentRequest;
    let retry = 0;
    while (retry < MAX_RETRIES) {
      const graph = new StateGraph(StateAnnotation)
        .addNode("retrieve", retrieve)
        .addNode("generate", generate)
        .addEdge("__start__", "retrieve")
        .addEdge("retrieve", "generate")
        .addEdge("generate", "__end__")
        .compile();

      let inputs = {
        question: topic,
        noOfQuestions,
      };
      const result = await graph.invoke(inputs);

      try {
        // Clean and parse the JSON response
        const cleanJson = result.answer
          .replace(/```json\s*|\s*```/g, "") // Remove markdown code blocks
          .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
          .trim(); // Remove whitespace

        const questions = JSON.parse(cleanJson);
        if (!validateQuestions(questions)) {
          if (retry === MAX_RETRIES - 1) {
            throw new Error("Invalid assessment format");
          }
          retry++;
          continue;
        }

        return NextResponse.json(
          { message: "Assessment generated", data: questions },
          { status: 200 }
        );
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.log("Raw answer:", result.answer);
        if (retry === MAX_RETRIES - 1) {
          return NextResponse.json(
            { message: "Assessment parsing failed", error: parseError },
            { status: 400 }
          );
        } else {
          retry++;
        }
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Assessment generation failed", error: error },
      { status: 400 }
    );
  }
}
