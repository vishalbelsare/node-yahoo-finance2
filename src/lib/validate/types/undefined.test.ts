import { describe, expect, it } from "../../../../tests/common.ts";

import { _undefined } from "./undefined.ts";
import type { JSONSchema, ValidationCtx, ValidationError } from "../index.ts";

describe("undefined", () => {
  it("_undefined validator passes for undefined", () => {
    const errors: ValidationError[] = [];
    const ok = _undefined(
      undefined,
      {} as JSONSchema,
      {} as ValidationCtx,
      errors,
      "",
      undefined,
      "#",
    );
    expect(ok).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("_undefined validator fails for defined value", () => {
    const errors: ValidationError[] = [];
    const ok = _undefined(
      0,
      {} as JSONSchema,
      {} as ValidationCtx,
      errors,
      "/value",
      undefined,
      "#",
    );
    expect(ok).toBe(false);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      message: "Expected undefined",
      instancePath: "/value",
    });
  });
});
