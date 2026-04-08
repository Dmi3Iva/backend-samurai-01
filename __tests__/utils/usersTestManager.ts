import request from "supertest";
import type { CreateUserModel } from "../../src/features/users/models/CreateUserModel";
import { app, ROUTER_PATHS } from "../../src/app";
import { constants as HTTP_CDOES } from "node:http2";

const basePath = ROUTER_PATHS.users;

export const usersTestManager = {
  async createEntity(data: CreateUserModel) {
    const res = await request(app)
      .post(basePath)
      .send(data)
      .expect(HTTP_CDOES.HTTP_STATUS_CREATED);

    return res;
  },
  async updateEntity(id: string, data: CreateUserModel) {
    await request(app)
      .put(`${basePath}/${id}`)
      .send(data)
      .expect(HTTP_CDOES.HTTP_STATUS_OK);
  },
  async getEntities() {},
};
