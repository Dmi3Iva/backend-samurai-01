import express from "express";
import { getCoursesRouter } from "./features/courses/courses.router";
import { getUsersRouter } from "./features/users/users.router";
import { db } from "./db/db";
import { getTestsRouter } from "./routes/tests";
import { getUsersCoursesBindingsRouter } from "./features/users-courses-bindings/users-courses-bindings..router";

export const app = express();

export const jsonMiddleware = express.json();

app.use(jsonMiddleware);

export const ROUTER_PATHS = {
  courses: "/courses",
  users: "/users",
  usersCoursesBindings: "/users-courses-bindings",
  interesting: "/interesting",

  __test__: "/__test__",
};

app.use(ROUTER_PATHS.courses, getCoursesRouter(db));
app.use(ROUTER_PATHS.users, getUsersRouter(db));
app.use(ROUTER_PATHS.usersCoursesBindings, getUsersCoursesBindingsRouter(db));
app.use(ROUTER_PATHS.__test__, getTestsRouter(db));
