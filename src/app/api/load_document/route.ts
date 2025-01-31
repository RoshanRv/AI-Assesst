import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextRequest, NextResponse } from "next/server";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "ai-assest-1",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    // get the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // convert the file to an array buffer
    const arrayBuffer = await file.arrayBuffer();
    // convert the array buffer to a blob
    const blob = new Blob([arrayBuffer]);

    // load the file into a loader
    const loader = new PDFLoader(blob);

    // load the file into a document
    const docs = await loader.load();

    // define the splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    // split the document into chunks
    const allSplits = await splitter.splitDocuments(docs);
    console.log(`Split blog post into ${allSplits.length} sub-documents.`);

    // delete all documents in the vector store
    await vectorStore.delete({
      filter: {}, // Empty filter to delete all documents
    });
    // add the chunks to the vector store
    await vectorStore.addDocuments(allSplits);
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { message: "Error processing PDF file", error: error },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "PDF loaded successfully" });
}
