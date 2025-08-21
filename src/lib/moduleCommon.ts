// import type ModuleExec from "./moduleExec.js";

export interface ModuleOptions {
  /** If false, lib won't validate and will leave that to Yahoo */
  validateOptions?: boolean;
  /** If false, will pass back unvalidated / untyped result from Yahoo  */
  validateResult?: boolean;
  /** Controls for http cache
   *  {
   *    id: string;           // cache key
   *    t: Deno.TestContext;  // test context
   *    onFinish: (cb: (error?: unknown) => void) => void;
   *  }
   *  See `tests/common.ts` for how these are used for conditional caching.
   */
  devel?: {
    id: string;
    t: Deno.TestContext;
    onFinish: (cb: (error?: unknown) => void) => void;
  };
  /** An alternative fetch function to use just for this call */
  fetch?: typeof fetch;
  /** Any options to pass to fetch() just for this request. */
  fetchOptions?: Parameters<typeof fetch>[1];
}

export interface ModuleOptionsWithValidateFalse extends ModuleOptions {
  validateResult: false;
}

export interface ModuleOptionsWithValidateTrue extends ModuleOptions {
  validateResult?: true;
}

export interface ModuleThis {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
  // TODO: should be ModuleExec function but requiring functions breaks
  // schema generation because json-schema does not support functions.
  // deno-lint-ignore no-explicit-any
  _moduleExec: any;
  // _moduleExec: typeof ModuleExec;
  // _notices: Notices;
}

/**
 * test
 */
export type ModuleError = Error;
