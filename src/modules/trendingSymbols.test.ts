import {
  createTestYahooFinance,
  describe,
  expect,
  it,
  setupCache,
} from "../../tests/common.ts";

import trendingSymbols from "./trendingSymbols.ts";

const YahooFinance = createTestYahooFinance({ modules: { trendingSymbols } });
const yf = new YahooFinance();

describe("trendingSymbols", () => {
  setupCache();

  it.each(["US", "GB", "IT", "AU"])(
    "passes validation for country '%s'",
    async (country, t, onFinish) => {
      await yf.trendingSymbols(country, undefined, {
        devel: { id: `trendingSymbols-${country}`, t, onFinish },
      });
    },
  );

  it("throws on weird result", (t, onFinish) => {
    const devel = { id: "weirdJsonResult.fake", t, onFinish };
    return expect(yf.trendingSymbols("GB", {}, { devel })).rejects.toThrow(
      /^Unexpected result/,
    );
  });
});
