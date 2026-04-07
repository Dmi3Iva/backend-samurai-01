import type { CourseType, DBType } from "../db/db";
import express from "express";

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getCoursesRouter = (db: DBType) => {
  const router = express.Router();

  router.post(
    "/",
    (
      req: RequestWithBody<CreateCourseModel>,
      res: Response<CourseViewModel>,
    ) => {
      if (!req.body.title) {
        return res.status(400).json({ error: "title is required" });
      }

      const createdCourse: CourseType = {
        id: +new Date(),
        title: req.body.title,
        studentsCount: 0,
      };

      db.courses.push(createdCourse);

      res.status(201).json(getCourseViewModel(createdCourse));
    },
  );
};
