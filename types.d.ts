interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  assessments?: Assessment[];
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

type Role = "teacher" | "student";

interface Assessment {
  _id: string;
  title: string;
  description?: string;
  questions: MCQQuestion[];
  startDate?: Date;
  endDate?: Date;
  course?: Course;
  topic?: string;
}
