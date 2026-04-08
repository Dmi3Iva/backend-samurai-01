export interface UserType {
  id: number;
  userName: string;
}

export interface CourseType {
  id: number;
  title: string;
  studentsCount: number;
}

export interface UserCourseBinding {
  userId: number;
  courseId: number;
  date: Date;
}

export type DBType = {
  courses: CourseType[];
  users: UserType[];
  userCourseBindings: UserCourseBinding[];
};

export const db: DBType = {
  courses: [
    { id: 1, title: "front-end", studentsCount: 10 },
    { id: 2, title: "back-end", studentsCount: 10 },
    { id: 3, title: "automation qa", studentsCount: 10 },
    { id: 4, title: " devops", studentsCount: 10 },
  ],
  users: [
    { id: 1, userName: "dimych" },
    { id: 2, userName: "ivan" },
  ],
  userCourseBindings: [
    { userId: 1, courseId: 1, date: new Date(2022, 10, 1) },
    { userId: 1, courseId: 2, date: new Date(2022, 10, 1) },
    { userId: 2, courseId: 2, date: new Date(2022, 10, 1) },
  ],
};
