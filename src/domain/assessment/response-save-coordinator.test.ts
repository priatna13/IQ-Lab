import { describe, expect, it } from "vitest";
import {
  applyOptimisticAnswer,
  isSaveStillCurrent,
  mergeServerResponsesWithPending,
} from "./response-save-coordinator";

describe("response-save-coordinator", () => {
  it("applyOptimisticAnswer counts unique items", () => {
    const a = applyOptimisticAnswer(3, {}, "i1", "a");
    expect(a.answeredCount).toBe(1);
    expect(a.canEarlyFinish).toBe(false);

    const b = applyOptimisticAnswer(3, a.responses, "i2", "b");
    expect(b.answeredCount).toBe(2);

    const c = applyOptimisticAnswer(3, b.responses, "i1", "c");
    expect(c.answeredCount).toBe(2);
    expect(c.responses.i1).toBe("c");

    const d = applyOptimisticAnswer(3, c.responses, "i3", "d");
    expect(d.canEarlyFinish).toBe(true);
  });

  it("merge keeps in-flight optimistic answers not yet on server (pilot wipe bug)", () => {
    // Server only knows i1; user already answered i2 optimistically while i1 save+refresh raced
    const server = { i1: "a" };
    const latest = { i1: "a", i2: "b" };
    const inFlight = new Set(["i2"]);
    const merged = mergeServerResponsesWithPending(server, latest, inFlight);
    expect(merged).toEqual({ i1: "a", i2: "b" });
  });

  it("merge prefers latest intended for in-flight item over stale server", () => {
    const server = { i1: "a" };
    const latest = { i1: "c" };
    const inFlight = new Set(["i1"]);
    expect(mergeServerResponsesWithPending(server, latest, inFlight)).toEqual({
      i1: "c",
    });
  });

  it("isSaveStillCurrent rejects superseded answers", () => {
    const latest = { i1: "b" };
    expect(isSaveStillCurrent(latest, "i1", "a")).toBe(false);
    expect(isSaveStillCurrent(latest, "i1", "b")).toBe(true);
  });
});
