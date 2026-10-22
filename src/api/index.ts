import { app } from "./app";

const worker = { fetch: app.fetch };

export default worker;
