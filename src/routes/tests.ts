import type { CourseType, DBType } from "../db/db";
import express from "express";

// export const getUserViewModel = (dbCourse: CourseType): UserViewModel => {
//   return {
//     id: dbCourse.id,
//     title: dbCourse.title,
//   };
// };

export const getTestsRouter = (db: DBType) => {
  const router = express.Router();

  router.delete("/data", (req, res) => {
    db.courses = [];
    db.users = [];
    db.studentCourseBindings = [];

    res.status(204).send();
  });

  // router.post(
  //   "/",
  //   (
  //     req: RequestWithBody<CreateCourseModel>,
  //     res: Response<CourseViewModel>,
  //   ) => {
  //     if (!req.body.title) {
  //       return res.status(400).json({ error: "title is required" });
  //     }

  //     const createdCourse: CourseType = {
  //       id: +new Date(),
  //       title: req.body.title,
  //       studentsCount: 0,
  //     };

  //     db.courses.push(createdCourse);

  //     res.status(201).json(getCourseViewModel(createdCourse));
  //   },
  // );

  return router;
};
