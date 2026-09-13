import { expect, it } from "vitest";
import config from "../../playwright.config";

it("starts the local app before end-to-end tests", () => {
  expect(config.webServer).toMatchObject({
    command: "npm run build && npm start -- --hostname 127.0.0.1 --port 3107",
    url: "http://127.0.0.1:3107",
    reuseExistingServer: false,
    timeout: 120_000,
  });
  expect(config.use?.baseURL).toBe("http://127.0.0.1:3107");
});
