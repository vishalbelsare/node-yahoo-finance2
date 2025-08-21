import {
  createTestYahooFinance,
  describe,
  expect,
  it,
  setupCache,
  testSymbols,
} from "../../tests/common.ts";

import insights from "./insights.ts";

const YahooFinance = createTestYahooFinance({ modules: { insights } });
const yf = new YahooFinance();

describe("insights", () => {
  setupCache();

  const symbols = testSymbols({
    add: [
      "ABBOTINDIA.NS", // field "upsell" with { "companyName", "upsellReportType" }
      "HIDV", //  instrumentInfo/keyTechnicals missingProperty: "stopLoss" (#663)
      "MPAY", // companySnapshot missingProperty: "sectorInfo" (#663)
      "RUSHA", // targetPriceStatus/enum "-" (#663)
    ],
  });

  it.each(symbols)(
    "passes validation for symbol '%s'",
    async (symbol, t, onFinish) => {
      await yf.insights(symbol, undefined, {
        devel: {
          id: `insights-${symbol}`,
          t,
          onFinish,
        },
      });
    },
  );

  it("throws on weird result", (t, onFinish) => {
    const devel = { id: "weirdJsonResult.fake", t, onFinish };
    return expect(yf.insights("A", {}, { devel })).rejects.toThrow(
      /^Unexpected result/,
    );
  });
});
