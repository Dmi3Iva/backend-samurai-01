import type { CourseType, DBType } from "../../db/db";
import express from "express";
import type { Response, Request } from "express";
import type {
  RequestWithBody,
  RequestWithParams,
} from "../../types/requests.types";
import type { CreateCourseModel } from "./models/CreateCourseModel";
import type { CourseViewModel } from "./models/CourseViewModel";
import { constants as HTTP_CODES } from "node:http2";
import type { URIParamsCourseIdModel } from "./models/URIParamsCourseIdModel";

export const mapEntityToViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getCoursesRouter = (db: DBType) => {
  const router = express.Router();

  router.get("/", (req: Request, res: Response<CourseViewModel[]>) => {
    const courses = db.courses;
    res.json(courses.map(mapEntityToViewModel));
  });

  router.get(
    "/:id",
    (
      req: RequestWithParams<URIParamsCourseIdModel>,
      res: Response<CourseViewModel>,
    ) => {
      const course = db.courses.find((c) => c.id === +req.params.id);
      if (!course) {
        return res.sendStatus(404);
      }
      res.json(mapEntityToViewModel(course));
    },
  );

  router.post(
    "/",
    (
      req: RequestWithBody<CreateCourseModel>,
      res: Response<CourseViewModel>,
    ) => {
      if (!req.body.title) {
        return res.sendStatus(400);
      }

      const createdCourse: CourseType = {
        id: +new Date(),
        title: req.body.title,
        studentsCount: 0,
      };

      db.courses.push(createdCourse);

      res.status(201).json(mapEntityToViewModel(createdCourse));
    },
  );

  router.put(
    "/:id",
    (
      req: RequestWithParams<RequestWithBody<CreateCourseModel>>,
      res: Response<CourseViewModel>,
    ) => {
      const courseId = +req.params.id;
      const course = db.courses.find((c) => c.id === courseId);

      if (!course) {
        return res.sendStatus(HTTP_CODES.HTTP_STATUS_NOT_FOUND);
      }
      if (!req.body.title) {
        return res.sendStatus(HTTP_CODES.HTTP_STATUS_BAD_REQUEST);
      }

      course.title = req.body.title;
      res
        .status(HTTP_CODES.HTTP_STATUS_NO_CONTENT)
        .json(mapEntityToViewModel(course));
    },
  );

  router.delete(
    "/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
      const courseId = +req.params.id;
      const courseIndex = db.courses.findIndex((c) => c.id === courseId);

      if (courseIndex === -1) {
        return res.sendStatus(404);
      }

      db.courses.splice(courseIndex, 1);
      res.sendStatus(HTTP_CODES.HTTP_STATUS_NO_CONTENT);
    },
  );

  return router;
};
