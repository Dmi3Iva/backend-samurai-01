import request from "supertest";
import { app, ROUTER_PATHS } from "../../src/app";
import { constants } from "node:http2";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CreateCourseModel } from "../../src/features/courses/models/CreateCourseModel";

const getRequest = () => request(app);

const baseUrl = ROUTER_PATHS.courses;

describe("tests for /courses", () => {
  beforeAll(async () => {
    await getRequest().delete(`${ROUTER_PATHS.__test__}/data`);
  });

  it("should return 200 and empty array", async () => {
    await getRequest().get(baseUrl).expect(constants.HTTP_STATUS_OK, []);
  });

  it("should return 404 for not existing entity", async () => {
    await getRequest()
      .get(`${baseUrl}/1`)
      .expect(constants.HTTP_STATUS_NOT_FOUND);
  });

  it(`shouldn't create entity with incorrect input data`, async () => {
    const data: CreateCourseModel = { title: "" };

    await getRequest()
      .post(baseUrl)
      .send(data)
      .expect(constants.HTTP_STATUS_BAD_REQUEST);

    await getRequest().get(baseUrl).expect(constants.HTTP_STATUS_OK, []);
  });

  let createdEntity1: any = null;
  it(`should create Entity with correct input data`, async () => {
    const data: CreateCourseModel = { title: "Dymich" };

    const createResponse = await getRequest()
      .post(baseUrl)
      .send(data)
      .expect(constants.HTTP_STATUS_CREATED);

    createdEntity1 = createResponse.body;

    expect(createdEntity1).toEqual({
      id: expect.any(Number),
      title: data.title,
    });

    await getRequest()
      .get(baseUrl)
      .expect(constants.HTTP_STATUS_OK, [createdEntity1]);
  });

  let createdEntity2: any = null;
  it(`create one more entity`, async () => {
    const data: CreateCourseModel = { title: "Oleg" };

    const createResponse = await getRequest()
      .post(baseUrl)
      .send(data)
      .expect(constants.HTTP_STATUS_CREATED);

    createdEntity2 = createResponse.body;

    expect(createdEntity2).toEqual({
      id: expect.any(Number),
      title: data.title,
    });

    await getRequest()
      .get(baseUrl)
      .expect(constants.HTTP_STATUS_OK, [createdEntity1, createdEntity2]);
  });

  it(`shouldn't update entity with incorrect input data`, async () => {
    const data: CreateCourseModel = { title: "" };

    await getRequest()
      .put(`${baseUrl}/${createdEntity1.id}`)
      .send(data)
      .expect(constants.HTTP_STATUS_BAD_REQUEST);

    await getRequest()
      .get(baseUrl)
      .expect(constants.HTTP_STATUS_OK, [createdEntity1, createdEntity2]);
  });

  it(`shouldn't update entity that not exist`, async () => {
    await getRequest()
      .put(`${baseUrl}/${-100}`)
      .send({ userName: "IVAN" })
      .expect(constants.HTTP_STATUS_NOT_FOUND);
  });

  it(`should update entity with correct input data`, async () => {
    const data: CreateCourseModel = { title: "IVAN" };

    await getRequest()
      .put(`${baseUrl}/${createdEntity1.id}`)
      .send(data)
      .expect(constants.HTTP_STATUS_NO_CONTENT);

    await getRequest()
      .get(`${baseUrl}`)
      .expect(constants.HTTP_STATUS_OK, [
        {
          id: createdEntity1.id,
          title: data.title,
        },
        createdEntity2,
      ]);

    await getRequest()
      .get(`${baseUrl}/${createdEntity1.id}`)
      .expect(constants.HTTP_STATUS_OK, {
        id: createdEntity1.id,
        title: data.title,
      });

    await getRequest()
      .get(`${baseUrl}/${createdEntity2.id}`)
      .expect(constants.HTTP_STATUS_OK, createdEntity2);
  });

  it(`shpudl delete both courses`, async () => {
    await getRequest()
      .delete(`${baseUrl}/${createdEntity1.id}`)
      .expect(constants.HTTP_STATUS_NO_CONTENT);

    await getRequest()
      .get(`${baseUrl}/${createdEntity1.id}`)
      .expect(constants.HTTP_STATUS_NOT_FOUND);

    await getRequest()
      .delete(`${baseUrl}/${createdEntity2.id}`)
      .expect(constants.HTTP_STATUS_NO_CONTENT);

    await getRequest()
      .get(`${baseUrl}/${createdEntity2.id}`)
      .expect(constants.HTTP_STATUS_NOT_FOUND);

    await getRequest().get(baseUrl).expect(constants.HTTP_STATUS_OK, []);
  });

  afterAll(() => {});
});
