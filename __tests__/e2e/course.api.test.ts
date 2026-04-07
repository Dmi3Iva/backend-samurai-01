import request from "supertest";
import { CreateCourseModel } from "../../src/features/courses/models/CreateCourseModel";
import { UpdateCourseModel } from "../../src/features/courses/models/UpdateCourseModel";
import { app } from "../../src/app";
import { HTTP_STATUSES } from "../../src/utils";

const getRequest = () => request(app);

describe("/course", () => {
  beforeAll(async () => {
    await getRequest().delete("/__test__/data");
  });

  it("should return 200 and empty array", async () => {
    await getRequest().get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  it("shpuld return 404 for not existing course", async () => {
    await getRequest().get("/courses/1").expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it(`shouldn't create course with incorrect input data`, async () => {
    const data: CreateCourseModel = { title: "" };

    await getRequest()
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await getRequest().get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  let createdCourss1: any = null;
  it(`should create course with correct input data`, async () => {
    const data: CreateCourseModel = { title: "it-incubator course" };

    const createResponse = await getRequest()
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);

    await getRequest().get("/courses").expect(HTTP_STATUSES.OK_200, [data]);
  });
});
