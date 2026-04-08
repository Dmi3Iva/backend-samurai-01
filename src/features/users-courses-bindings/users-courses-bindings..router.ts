import type {
  CourseType,
  DBType,
  StudentCourseBinding,
  UserCourseBinding,
  UserType,
} from "../../db/db";
import express from "express";
import type { Request, Response } from "express";
import type { UserViewModel } from "./models/UserViewModel";
import type { CreateUserModel } from "./models/CreateUserModel";
import type { QueryUsersModel } from "./models/QueryUsersModel";
import { constants as HTTP_CONSTANTS } from "node:http2";
import type { URIParamsUserIdModel } from "./models/URIParamsUserIdModel";
import type { UpdateUserModel } from "./models/UpdateUserModel";
import type {
  RequestWithParams,
  RequestWithQuery,
  RequestWithBody,
} from "../../types/requests.types";
import type { UsersCoursesBindingViewModel } from "./models/UsersCoursesBindingViewModel";
import type { CreateUsersCoursesBindingsModel } from "./models/CreateUsersCoursesBindingsModel";

export const mapEntityToViewModel = (
  dbEntity: UserCourseBinding,
  user: UserType,
  course: CourseType,
): UsersCoursesBindingViewModel => {
  return {
    userId: dbEntity.userId,
    userName: user.userName,
    courseId: dbEntity.courseId,
    courseTitle: course.title,
  };
};

export const getUsersCoursesBindingsRouter = (db: DBType) => {
  const router = express.Router();

  router.get(
    "/",
    (req: Request, res: Response<UsersCoursesBindingViewModel[]>) => {
      const bindings = db.userCourseBindings.map((b) => {
        const user = db.users.find((u) => u.id === b.userId);
        const course = db.courses.find((c) => c.id === b.courseId);

        if (!user || !course) {
          return null;
        }

        return mapEntityToViewModel(b, user, course);
      });

      res.json(bindings.filter((b) => b !== null));
    },
  );

  router.post(
    "/",
    (
      req: RequestWithBody<CreateUsersCoursesBindingsModel>,
      res: Response<UsersCoursesBindingViewModel>,
    ) => {
      if (!req.body.userId || !req.body.courseId) {
        return res.sendStatus(400);
      }

      const foundUser = db.users.find((u) => u.id === req.body.userId);
      const foundCourse = db.courses.find((c) => c.id === req.body.courseId);

      if (!foundUser || !foundCourse) {
        return res.sendStatus(HTTP_CONSTANTS.HTTP_STATUS_BAD_REQUEST);
      }

      const alreadyExistsBinding = db.userCourseBindings.some(
        (b) => b.userId === foundUser.id && b.courseId === foundCourse.id,
      );

      if (!!alreadyExistsBinding) {
        return res.sendStatus(HTTP_CONSTANTS.HTTP_STATUS_BAD_REQUEST);
      }

      const createdEntity: UserCourseBinding = {
        userId: foundUser.id,
        courseId: foundCourse.id,
        date: new Date(),
      };

      db.userCourseBindings.push(createdEntity);

      res
        .status(HTTP_CONSTANTS.HTTP_STATUS_CREATED)
        .json(mapEntityToViewModel(createdEntity, foundUser, foundCourse));
    },
  );
  return router;
};
