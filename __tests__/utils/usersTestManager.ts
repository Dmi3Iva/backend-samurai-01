import request from "supertest";
import type { CreateUserModel } from "../../src/features/users/models/CreateUserModel";
import { app, ROUTER_PATHS } from "../../src/app";
import { constants as HTTP_CODES } from "node:http2";
import type { UserViewModel } from "../../src/features/users/models/UserViewModel";
import { expect } from "vitest";

const basePath = ROUTER_PATHS.users;

type HttpStatusCode = (typeof HTTP_CODES)[keyof typeof HTTP_CODES];

export const usersTestManager = {
  async getEntities({
    statusCode = HTTP_CODES.HTTP_STATUS_OK,
    expectedValue = [],
  }: {
    statusCode?: HttpStatusCode;
    expectedValue?: (UserViewModel | null)[];
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
    expectedValue?: UserViewModel | null | undefined;
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
    data: CreateUserModel,
    statusCode: HttpStatusCode = HTTP_CODES.HTTP_STATUS_CREATED,
  ): Promise<{ createdEntity: UserViewModel; response: any }> {
    const res = await request(app).post(basePath).send(data).expect(statusCode);

    let createdEntity;

    if (statusCode === HTTP_CODES.HTTP_STATUS_CREATED) {
      createdEntity = res.body;
      expect(createdEntity).toEqual({
        id: expect.any(Number),
        userName: data.userName,
      });
    }

    return { response: res, createdEntity };
  },

  async updateEntity(
    id: number,
    data: CreateUserModel,
    statusCode: HttpStatusCode = HTTP_CODES.HTTP_STATUS_OK,
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
