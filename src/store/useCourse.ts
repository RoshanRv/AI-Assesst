import { create } from "zustand";

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
}

const useCourse = create<CourseState>((set) => ({
  courses: [],
  currentCourse: null,
  setCourses: (courses) => set({ courses, currentCourse: courses[0] || null }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
}));

export default useCourse;
