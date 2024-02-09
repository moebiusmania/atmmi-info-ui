import { loadingClass, mockLine, mockNews } from "../utils";

import { describe, expect, test } from "vitest";

describe("utils.ts", () => {
  test("loadingClass()", () => {
    const value = loadingClass();
    expect(value).toMatch(/h-4 bg-gray-400 rounded w-[1-4]/);
  });

  test("mockLine()", () => {
    const value = mockLine();
    expect(value).toHaveLength(10);
  });

  test("mockNews()", () => {
    const value = mockNews();
    expect(value).toHaveLength(10);
  });
});
