import request from "supertest";
import { app, ROUTER_PATHS } from "../../src/app";
import { constants } from "node:http2";
import type { CreateUserModel } from "../../src/features/users/models/CreateUserModel";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { usersCoursesBindingsManager } from "../utils/usersCoursesBindingsManager";
import type { UserViewModel } from "../../src/features/users/models/UserViewModel";
import type { CreateUsersCoursesBindingsModel } from "../../src/features/users-courses-bindings/models/CreateUsersCoursesBindingsModel";
import { usersTestManager } from "../utils/usersTestManager";
import { coursesTestManager } from "../utils/coursesTestManager";
import { constants as HTTP_CODES } from "node:http2";

const getRequest = () => request(app);

const { createBinding, getEntities } = usersCoursesBindingsManager;

const { createEntity: createUser } = usersTestManager;
const { createEntity: createCourse } = coursesTestManager;

describe("tests for /users-courses-bindings", () => {
  beforeAll(async () => {
    await getRequest().delete(`${ROUTER_PATHS.__test__}/data`);
  });

  it(`should create entity with correct input data`, async () => {
    const user = await createUser({
      userName: "test user",
    });
    const course = await createCourse({
      title: "test course",
    });

    const data: CreateUsersCoursesBindingsModel = {
      userId: user.createdEntity.id,
      courseId: course.createdEntity.id,
    };

    await createBinding({ data });

    await getEntities({
      expectedValue: [
        {
          ...data,
          userName: user.createdEntity.userName,
          courseTitle: course.createdEntity.title,
        },
      ],
    });
  });

  it(`shouldn't create binding because it already exists`, async () => {
    const user = await createUser({
      userName: "test user dup",
    });
    const course = await createCourse({
      title: "test course dup",
    });

    const data: CreateUsersCoursesBindingsModel = {
      userId: user.createdEntity.id,
      courseId: course.createdEntity.id,
    };

    await createBinding({ data });

    await createBinding({
      data,
      statusCode: HTTP_CODES.HTTP_STATUS_BAD_REQUEST,
    });
  });

  afterAll(() => {});
});
