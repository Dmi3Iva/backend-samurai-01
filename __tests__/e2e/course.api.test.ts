import request from "supertest";
import { app, ROUTER_PATHS } from "../../src/app";
import { constants } from "node:http2";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CreateCourseModel } from "../../src/features/courses/models/CreateCourseModel";
import { coursesTestManager } from "../utils/coursesTestManager";

const getRequest = () => request(app);

const baseUrl = ROUTER_PATHS.courses;

const { createEntity, getEntities, getEntity, updateEntity, deleteEntity } =
  coursesTestManager;

describe("tests for /courses", () => {
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
    const data: CreateCourseModel = { title: "" };

    await createEntity(data, constants.HTTP_STATUS_BAD_REQUEST);
    await getEntities({});
  });

  let createdEntity1: any = null;
  it(`should create Entity with correct input data`, async () => {
    const data: CreateCourseModel = { title: "Dymich" };

    const { createdEntity } = await createEntity(data);

    createdEntity1 = createdEntity;

    await getEntities({ expectedValue: [createdEntity1] });
  });

  let createdEntity2: any = null;
  it(`create one more entity`, async () => {
    const data: CreateCourseModel = { title: "Oleg" };

    const { createdEntity } = await createEntity(data);

    createdEntity2 = createdEntity;

    await getEntities({ expectedValue: [createdEntity1, createdEntity2] });
  });

  it(`shouldn't update entity with incorrect input data`, async () => {
    const data: CreateCourseModel = { title: "" };
    await updateEntity(
      createdEntity1.id,
      data,
      constants.HTTP_STATUS_BAD_REQUEST,
    );

    await getEntities({ expectedValue: [createdEntity1, createdEntity2] });
  });

  it(`shouldn't update entity that not exist`, async () => {
    await updateEntity(
      -100,
      { title: "IVAN" },
      constants.HTTP_STATUS_NOT_FOUND,
    );
  });

  it(`should update entity with correct input data`, async () => {
    const data: CreateCourseModel = { title: "IVAN" };

    await getRequest()
      .put(`${baseUrl}/${createdEntity1.id}`)
      .send(data)
      .expect(constants.HTTP_STATUS_NO_CONTENT);

    await updateEntity(createdEntity1.id, data);

    await getEntities({
      expectedValue: [
        {
          id: createdEntity1.id,
          title: data.title,
        },
        createdEntity2,
      ],
    });

    await getEntity({
      id: createdEntity1.id,
      expectedValue: {
        id: createdEntity1.id,
        title: data.title,
      },
    });

    await getEntity({
      id: createdEntity2.id,
      expectedValue: createdEntity2,
    });
  });

  it(`shpudl delete both courses`, async () => {
    await deleteEntity({ id: createdEntity1.id });

    await getEntity({
      id: createdEntity1.id,
      statusCode: constants.HTTP_STATUS_NOT_FOUND,
    });

    await deleteEntity({ id: createdEntity2.id });

    await getEntity({
      id: createdEntity2.id,
      statusCode: constants.HTTP_STATUS_NOT_FOUND,
    });

    await coursesTestManager.getEntities({});
  });

  afterAll(() => {});
});
