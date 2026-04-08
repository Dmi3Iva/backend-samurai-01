import request from "supertest";
import { app, ROUTER_PATHS } from "../../src/app";
import { constants as HTTP_CODES } from "node:http2";
import { expect } from "vitest";
import type { CourseViewModel } from "../../src/features/courses/models/CourseViewModel";
import type { CreateCourseModel } from "../../src/features/courses/models/CreateCourseModel";

const basePath = ROUTER_PATHS.courses;

type HttpStatusCode = (typeof HTTP_CODES)[keyof typeof HTTP_CODES];

export const coursesTestManager = {
  async getEntities({
    statusCode = HTTP_CODES.HTTP_STATUS_OK,
    expectedValue = [],
  }: {
    statusCode?: HttpStatusCode;
    expectedValue?: (CourseViewModel | null)[];
  }) {
    const res = await request(app)
      .get(basePath)
      .expect(statusCode, expectedValue);

    return res;
  },

  async getEntity({
    id,
    statusCode = HTTP_CODES.HTTP_STATUS_OK,
    expectedValue,
  }: {
    id: number | undefined;
    statusCode?: HttpStatusCode;
    expectedValue?: CourseViewModel | null | undefined;
  }) {
    if (expectedValue) {
      const res = await request(app)
        .get(`${basePath}/${id}`)
        .expect(statusCode, expectedValue);

      return res;
    }

    const res = await request(app).get(`${basePath}/${id}`).expect(statusCode);

    return res;
  },

  async createEntity(
    data: CreateCourseModel,
    statusCode: HttpStatusCode = HTTP_CODES.HTTP_STATUS_CREATED,
  ): Promise<{ createdEntity: CourseViewModel | null; response: any }> {
    const res = await request(app).post(basePath).send(data).expect(statusCode);

    let createdEntity;

    if (statusCode === HTTP_CODES.HTTP_STATUS_CREATED) {
      createdEntity = res.body;
      expect(createdEntity).toEqual({
        id: expect.any(Number),
        title: data.title,
      });
    }

    return { response: res, createdEntity };
  },

  async updateEntity(
    id: number,
    data: CreateCourseModel,
    statusCode: HttpStatusCode = HTTP_CODES.HTTP_STATUS_NO_CONTENT,
  ) {
    await request(app).put(`${basePath}/${id}`).send(data).expect(statusCode);
  },

  async deleteEntity({
    id,
    statusCode = HTTP_CODES.HTTP_STATUS_NO_CONTENT,
  }: {
    id: number | undefined;
    statusCode?: HttpStatusCode;
  }) {
    await request(app).delete(`${basePath}/${id}`).expect(statusCode);
  },
};
