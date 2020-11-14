const { Counters, metricsMiddleware } = require("./metrics");
const { Registry } = require("prom-client");
describe("counters", () => {
  let counters;
  let registry;
  beforeEach(async () => {
    registry = new Registry();
    counters = new Counters({ registers: [registry] });
  });
  test("exposes a request counter", () => {
    counters.requestsCounter.inc();
    counters.failedResponse.inc();
    counters.failedResponse.inc();
    counters.failedResponse.inc();

  });
});

describe("metricsMiddleware", () => {
  test.todo("something");
});
