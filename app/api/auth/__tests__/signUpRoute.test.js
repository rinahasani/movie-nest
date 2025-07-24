import { POST } from "../signup/route";
import { registerUser } from "@/lib/firebaseAuth";

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

jest.mock("@/lib/firebaseAuth", () => ({
  registerUser: jest.fn(),
}));

describe("POST /api/auth/signup", () => {
  const makeReq = (data) => ({
    json: async () => data,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and uid when registerUser succeeds", async () => {
    registerUser.mockResolvedValue({ uid: "new-user-123" });

    const req = makeReq({
      name: "Alice",
      email: "alice@example.com",
      password: "strongPass1",
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      success: true,
      uid: "new-user-123",
    });
    expect(registerUser).toHaveBeenCalledWith(
      "Alice",
      "alice@example.com",
      "strongPass1"
    );
  });

  it("returns 400 and error when registerUser throws", async () => {
    registerUser.mockRejectedValue(new Error("Email already in use"));

    const req = makeReq({
      name: "Bob",
      email: "bob@example.com",
      password: "weak",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: "Email already in use",
    });
    expect(registerUser).toHaveBeenCalledWith("Bob", "bob@example.com", "weak");
  });
});
