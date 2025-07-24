import { POST } from "../login/route";
import { loginUser } from "@/lib/firebaseAuth";

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

// Mock loginUser
jest.mock("@/lib/firebaseAuth", () => ({
  loginUser: jest.fn(),
}));

describe("POST /api/auth/login", () => {
  const makeReq = (data) => ({
    json: async () => data,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and uid when loginUser succeeds", async () => {
    loginUser.mockResolvedValue({ uid: "user123" });

    const req = makeReq({ email: "a@b.com", password: "secret" });
    const res = await POST(req);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      success: true,
      uid: "user123",
    });
    expect(loginUser).toHaveBeenCalledWith("a@b.com", "secret");
  });

  it("returns 401 and error message when loginUser throws", async () => {
    loginUser.mockRejectedValue(new Error("Invalid credentials"));

    const req = makeReq({ email: "x@y.com", password: "wrong" });
    const res = await POST(req);

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: "Invalid credentials",
    });
    expect(loginUser).toHaveBeenCalledWith("x@y.com", "wrong");
  });
});
