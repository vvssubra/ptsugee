import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

const mocks = vi.hoisted(() => ({
  isValidSignature: vi.fn(),
  parseBody: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@sanity/webhook", () => ({isValidSignature: mocks.isValidSignature}));
vi.mock("next-sanity/webhook", () => ({parseBody: mocks.parseBody}));
vi.mock("next/cache", () => ({revalidateTag: mocks.revalidateTag}));

import {POST} from "./route";

const request = (body = "{}", signature?: string) =>
  new Request("https://ptsugee.com/api/revalidate", {
    method: "POST",
    body,
    headers: signature ? {"sanity-webhook-signature": signature} : undefined,
  });

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = "test-secret";
    mocks.isValidSignature.mockReset();
    mocks.parseBody.mockReset();
    mocks.revalidateTag.mockReset();
  });

  afterEach(() => {
    delete process.env.SANITY_REVALIDATE_SECRET;
  });

  it("returns 500 when the signing secret is not configured", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;

    const response = await POST(request());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ok: false, error: "Webhook is not configured."});
    expect(mocks.parseBody).not.toHaveBeenCalled();
  });

  it("returns 401 for an invalid signature", async () => {
    mocks.parseBody.mockResolvedValue({isValidSignature: false, body: null});

    const response = await POST(request());

    expect(response.status).toBe(401);
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 400 for a signed unsupported document body", async () => {
    mocks.parseBody.mockResolvedValue({isValidSignature: true, body: {_type: "post"}});

    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 401 when malformed JSON has an invalid signature", async () => {
    mocks.parseBody.mockRejectedValue(new SyntaxError("Unexpected end of JSON input"));
    mocks.isValidSignature.mockResolvedValue(false);

    const response = await POST(request("{", "invalid-signature"));

    expect(response.status).toBe(401);
    expect(mocks.isValidSignature).toHaveBeenCalledWith("{", "invalid-signature", "test-secret");
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 400 when correctly signed malformed JSON cannot be parsed", async () => {
    mocks.parseBody.mockRejectedValue(new SyntaxError("Unexpected end of JSON input"));
    mocks.isValidSignature.mockResolvedValue(true);

    const response = await POST(request("{", "valid-signature"));

    expect(response.status).toBe(400);
    expect(mocks.isValidSignature).toHaveBeenCalledWith("{", "valid-signature", "test-secret");
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates the gallery tag after a valid signed event", async () => {
    mocks.parseBody.mockResolvedValue({isValidSignature: true, body: {_type: "projectGallery"}});

    const response = await POST(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ok: true, revalidated: "projectGallery"});
    expect(mocks.parseBody).toHaveBeenCalledWith(expect.any(Request), "test-secret");
    expect(mocks.revalidateTag).toHaveBeenCalledWith("projectGallery", "max");
  });
});
