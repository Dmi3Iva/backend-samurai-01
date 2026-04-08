import request from "supertest";
import { app, ROUTER_PATHS } from "../../src/app";
import { constants } from "node:http2";
import type { CreateUserModel } from "../../src/features/users/models/CreateUserModel";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { usersTestManager } from "../utils/usersTestManager";
import type { UserViewModel } from "../../src/features/users/models/UserViewModel";

const getRequest = () => request(app);

const baseUrl = ROUTER_PATHS.users;

const { getEntity, deleteEntity, getEntities, createEntity, updateEntity } =
  usersTestManager;

describe("tests for /users", () => {
  beforeAll(async () => {
    await getRequest().delete(`${ROUTER_PATHS.__test__}/data`);
  });

  it("should return 200 and empty array", async () => {
    await getEntities({});
  });

  it("should return 404 for not existing entity", async () => {
    await getEntity({
      id: 1,
      statusCode: constants.HTTP_STATUS_NOT_FOUND,
    });
  });

  it(`shouldn't create entity with incorrect input data`, async () => {
    const data: CreateUserModel = { userName: "" };

    await createEntity(data, constants.HTTP_STATUS_BAD_REQUEST);

    await getEntities({});
  });

  let createdEntity1: any = null;
  it(`should create Entity with correct input data`, async () => {
    const data: CreateUserModel = { userName: "Dymich" };

    const { createdEntity } = await createEntity(data);

    createdEntity1 = createdEntity;

    await getEntities({ expectedValue: [createdEntity1] });
  });

  let createdEntity2: UserViewModel | null | undefined = null;
  it(`create one more entity`, async () => {
    const data: CreateUserModel = { userName: "Oleg" };

    const { createdEntity } = await createEntity(data);

    createdEntity2 = createdEntity;

    await getEntities({
      expectedValue: [createdEntity1, createdEntity2],
    });
  });

  it(`shouldn't update entity with incorrect input data`, async () => {
    const data: CreateUserModel = { userName: "" };

    await updateEntity(
      createdEntity1.id,
      data,
      constants.HTTP_STATUS_BAD_REQUEST,
    );

    await getEntities({
      expectedValue: [createdEntity1, createdEntity2],
    });
  });

  it(`shouldn't update entity that not exist`, async () => {
    await updateEntity(
      -100,
      { userName: "IVAN" },
      constants.HTTP_STATUS_NOT_FOUND,
    );
  });

  it(`should update entity with correct input data`, async () => {
    const data: CreateUserModel = { userName: "IVAN" };

    await updateEntity(
      createdEntity1.id,
      data,
      constants.HTTP_STATUS_NO_CONTENT,
    );

    await getEntity({
      id: createdEntity1.id,
      expectedValue: {
        id: createdEntity1.id,
        userName: data.userName,
      },
    });

    await getEntity({
      id: createdEntity2?.id,
      expectedValue: createdEntity2,
    });

    await getEntity({
      id: createdEntity2?.id,
      expectedValue: createdEntity2,
    });
  });

  it(`shpudl delete both courses`, async () => {
    await deleteEntity({
      id: createdEntity1.id,
    });

    await getEntity({
      id: createdEntity1.id,
      statusCode: constants.HTTP_STATUS_NOT_FOUND,
    });

    await deleteEntity({
      id: createdEntity2?.id,
    });

    await getEntity({
      id: createdEntity2?.id,
      statusCode: constants.HTTP_STATUS_NOT_FOUND,
    });

    await getEntities({ expectedValue: [] });
  });

  afterAll(() => {});
});
