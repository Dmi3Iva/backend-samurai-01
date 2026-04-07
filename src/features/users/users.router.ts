import type { DBType, UserType } from "../../db/db";
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

export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
  return {
    id: dbEntity.id,
    userName: dbEntity.userName,
  };
};

export const getUsersRouter = (db: DBType) => {
  const router = express.Router();

  router.post(
    "/",
    (req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel>) => {
      if (!req.body.userName) {
        return res.sendStatus(400);
      }

      const createdEntity: UserType = {
        id: +new Date(),
        userName: req.body.userName,
      };

      db.users.push(createdEntity);

      res
        .status(HTTP_CONSTANTS.HTTP_STATUS_CREATED)
        .json(mapEntityToViewModel(createdEntity));
    },
  );

  router.get(
    "/",
    (
      req: RequestWithQuery<QueryUsersModel>,
      res: Response<UserViewModel[]>,
    ) => {
      let foundEntities: UserType[] = db.users;
      if (req.query.userName) {
        foundEntities = foundEntities.filter((u) =>
          u.userName.includes(req.query.userName!),
        );
      }
      res.json(foundEntities.map(mapEntityToViewModel));
    },
  );

  router.get(
    "/:id",
    (req: RequestWithParams<{ id: string }>, res: Response<UserViewModel>) => {
      const foundEntity = db.users.find((u) => u.id === +req.params.id);
      if (!foundEntity) {
        return res.sendStatus(HTTP_CONSTANTS.HTTP_STATUS_NOT_FOUND);
      }
      res.json(mapEntityToViewModel(foundEntity));
    },
  );

  router.delete(
    "/:id",
    (req: RequestWithParams<URIParamsUserIdModel>, res: Response) => {
      db.users = db.users.filter((user) => user.id !== Number(req.params.id));

      res.sendStatus(HTTP_CONSTANTS.HTTP_STATUS_NO_CONTENT);
    },
  );

  router.put(
    "/:id",
    (req: RequestWithParams<UpdateUserModel>, res: Response) => {
      const newUserName = req.body.userName;
      if (!newUserName) {
        return res.sendStatus(HTTP_CONSTANTS.HTTP_STATUS_BAD_REQUEST);
      }

      const foundEntity = db.users.find((u) => u.id === +req.params.id);
      if (!foundEntity) {
        return res.sendStatus(HTTP_CONSTANTS.HTTP_STATUS_NOT_FOUND);
      }

      foundEntity.userName = newUserName;
      res
        .status(HTTP_CONSTANTS.HTTP_STATUS_NO_CONTENT)
        .json(mapEntityToViewModel(foundEntity));
    },
  );

  return router;
};
