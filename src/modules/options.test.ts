import {
  createTestYahooFinance,
  describe,
  expect,
  it,
  setupCache,
  testSymbols,
} from "../../tests/common.ts";

import options from "./options.ts";

const YahooFinance = createTestYahooFinance({ modules: { options } });
const yf = new YahooFinance();

describe("options", () => {
  setupCache();

  const symbols = testSymbols({
    skip: [
      // Missing OptionType for {contract: BRKS220414C00097500 }, {tickerSymbol: BRKS },
      //   {strike: 97.5 }, {expirationDate: 1649894400 }
      "BRKS",
    ],
    add: [
      "EBAY", // Missing "ask" (#560)
      "PYPL", // Missing currency, percentChange (#561)
    ],
  });

  it.each(symbols)(
    "passes validation for symbol '%s'",
    async (symbol, t, onFinish) => {
      const devel = { id: `options-${symbol}`, t, onFinish };
      await yf.options(symbol, undefined, { devel });
    },
  );

  it("throws on weird result", (t, onFinish) => {
    const devel = { id: "weirdJsonResult.fake", t, onFinish };
    return expect(yf.options("A", {}, { devel })).rejects.toThrow(
      /^Unexpected result/,
    );
  });

  describe("date queryOpt should accept `date` as Date, number, string`", () => {
    // NB: fetchDevel will confirm that all options below map to same request params.
    // (because we re-use same devel filename)
    const id = "options-AAPL-expire-2022-03-01";

    it("accepts a Date", (t, onFinish) => {
      const modOpts = { devel: { id, t, onFinish } };
      return expect(
        yf.options("AAPL", { date: new Date("2022-03-01") }, modOpts),
      ).resolves.not.toThrow();
    });

    it("accepts a number", (t, onFinish) => {
      const modOpts = { devel: { id, t, onFinish } };
      return expect(
        yf.options("AAPL", { date: 1646092800 /* 2022-03-01 */ }, modOpts),
      ).resolves.not.toThrow();
    });

    it("accepts a string", (t, onFinish) => {
      const modOpts = { devel: { id, t, onFinish } };
      return expect(
        yf.options("AAPL", { date: "2022-03-01T00:00:00.000Z" }, modOpts),
      ).resolves.not.toThrow();
    });

    it("throws on invalid", () => {
      return expect(
        yf.options("AAPL", { date: "something yfDate can't parse" }),
      ).rejects.toThrow(/^Unsupported date type/);
    });
  });
});
