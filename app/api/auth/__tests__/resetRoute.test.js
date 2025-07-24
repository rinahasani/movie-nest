import { POST } from "../reset-password/route";
import { getAuth } from "firebase-admin/auth";

class MockResponse {
  constructor(body, init) {
    this._body = body;
    this.status = init.status;
    this.headers = init.headers;
  }
  async json() {
    return JSON.parse(this._body);
  }
}
global.Response = MockResponse;

jest.mock("firebase-admin/auth", () => ({
  getAuth: jest.fn(),
}));

describe("POST /api/auth/reset-password", () => {
  const makeReq = (data) => ({
    json: async () => data,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 on successful link generation", async () => {
    const mockGenerate = jest.fn().mockResolvedValue("link");
    getAuth.mockReturnValue({ generatePasswordResetLink: mockGenerate });

    const req = makeReq({ email: "user@example.com" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(getAuth).toHaveBeenCalled();
    expect(mockGenerate).toHaveBeenCalledWith("user@example.com");
  });

  it("returns 400 and error on failure", async () => {
    const mockGenerate = jest.fn().mockRejectedValue(new Error("No such user"));
    getAuth.mockReturnValue({ generatePasswordResetLink: mockGenerate });

    const req = makeReq({ email: "bad@example.com" });
    const res = await POST(req);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: "No such user",
    });
    expect(getAuth).toHaveBeenCalled();
    expect(mockGenerate).toHaveBeenCalledWith("bad@example.com");
  });
});
