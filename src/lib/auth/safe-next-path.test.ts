import { describe, expect, it } from "vitest";
import { parseSafeNextPath } from "./safe-next-path";

describe("parseSafeNextPath", () => {
  it("accepts internal absolute paths", () => {
    expect(parseSafeNextPath("/dashboard")).toBe("/dashboard");
    expect(parseSafeNextPath("/asesmen/abc/keahlian")).toBe(
      "/asesmen/abc/keahlian",
    );
    expect(parseSafeNextPath("  /admin  ")).toBe("/admin");
  });

  it("rejects open redirects", () => {
    expect(parseSafeNextPath("//evil.com")).toBeNull();
    expect(parseSafeNextPath("https://evil.com")).toBeNull();
    expect(parseSafeNextPath("http://evil.com/x")).toBeNull();
    expect(parseSafeNextPath("dashboard")).toBeNull();
    expect(parseSafeNextPath("")).toBeNull();
    expect(parseSafeNextPath(null)).toBeNull();
    expect(parseSafeNextPath("/\\evil")).toBeNull();
  });
});
