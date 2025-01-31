import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

interface UserState {
  teacher: User | null;
  student: User | null;
  currentUser: User | null;
  setTeacherAndStudent: (teacher: User | null, student: User | null) => void;
  switchUser: (role: Role) => void;
}

const useUser = create<UserState>((set) => ({
  teacher: null,
  student: null,
  currentUser: null,
  setTeacherAndStudent: (teacher, student) => set({ teacher, student }),
  switchUser: (role) =>
    set((state) => ({
      currentUser: role === "teacher" ? state.teacher : state.student,
    })),
}));

export default useUser;
