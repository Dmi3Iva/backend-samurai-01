import { app } from "./app";

const APP_PORT = 3000;

const server = app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
