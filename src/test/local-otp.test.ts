import { afterEach, describe, expect, it, vi } from "vitest";
import { localOtpTestCode } from "@/lib/local-otp";
afterEach(() => vi.unstubAllEnvs());
describe("local OTP preview", () => {
  it("shows a server test code only on a local development host", () => {
    vi.stubEnv("DEV", true);
    expect(localOtpTestCode("123456", "127.0.0.1")).toBe("123456");
    expect(localOtpTestCode("123456", "localhost")).toBe("123456");
    expect(localOtpTestCode("123456", "shop.example.test")).toBeNull();
    expect(localOtpTestCode(undefined, "localhost")).toBeNull();
  });
  it("never shows a test code in a production build", () => {
    vi.stubEnv("DEV", false);
    expect(localOtpTestCode("123456", "localhost")).toBeNull();
  });
});
