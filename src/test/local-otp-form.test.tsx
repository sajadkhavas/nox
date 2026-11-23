import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
vi.mock("@/lib/backend-session", () => ({ ensureBackendCsrf: vi.fn(async () => {}) }));
vi.mock("@/lib/backend-api", () => ({
 requestOtp: vi.fn(async () => ({ data: { challengeId: "challenge", debugCode: "654321" } })),
 verifyOtp: vi.fn(), backendErrorMessage: () => "error",
}));
import { CustomerOtpAuth } from "@/components/lbb/CustomerOtpAuth";
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });
it("shows the actual Laravel debugCode in the local login form", async () => {
 vi.stubEnv("DEV", true);
 render(<CustomerOtpAuth onAuthenticated={() => {}} />);
 fireEvent.change(screen.getByLabelText("شماره موبایل"), { target: { value: "09123456789" } });
 fireEvent.click(screen.getByRole("button", { name: "دریافت کد ورود" }));
 expect(await screen.findByText("654321")).toBeInTheDocument();
 expect(screen.getByText("ورود آزمایشی محلی؛ پیامکی ارسال نشده است.")).toBeInTheDocument();
});
