import { factory } from "../factory";

export const noindex = factory.createMiddleware(async (c, next) => {
  await next();
  c.header("X-Robots-Tag", "noindex");
});
