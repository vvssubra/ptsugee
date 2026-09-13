import { expect, it } from "vitest";
import config from "../../playwright.config";

it("starts the local app before end-to-end tests", () => {
  expect(config.webServer).toMatchObject({
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
  });
});
