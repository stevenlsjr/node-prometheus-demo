const client = require("prom-client");
const _ = require("lodash");
const { STATUS_CODES } = require("http");
class Counters {
  constructor(options = {}) {
    const { labelNames, statusCodeBuckets } = _.defaults(options, {
      statusCodeBuckets: Object.keys(STATUS_CODES),
      labelNames: [],
      registers: undefined,
    });
    this.options = options;
    this.requestsCounter = new client.Counter({
      name: "express_request_count",
      help: "number of http requests",
      labelNames,
      registers: options.registers,
    });
    this.requestTimeCounter = new client.Counter({
      name: "express_request_time",
      help: "sum of http request time",
      labelNames,
      registers: options.registers,
    });

    this.sucessfulResponse = new client.Counter({
      name: "express_response_sucessful",
      help: "number of successful http requests",
      labelNames,
      registers: options.registers,
    });

    this.failedResponse = new client.Counter({
      name: "express_response_failed",
      help: "number or http errors",
      labelNames,
      registers: options.registers,
    });
    this.responseStatusHist = new client.Histogram({
      buckets: statusCodeBuckets,
      help: "Number of responses by status code",
      name: "express_response_by_status",
      labelNames,
      registers: options.registers,
    });
  }
}

/**
 * Middleware which collects metrics on node middleware.
 * Here, we can count the total number of requests,
 * number of requests by status code,
 * request elapsed time, and other per-request metrics.
 * By default, we use the options.skipPaths field to opt out the
 * /metrics route, so we aren't observing non-app code
 *
 * @param {Object} [options]
 * @param {Record<string, string>} [options.labels] Labels to apply to default
 * // metrics
 * @returns {import('express').Handler}
 */
function metricsMiddleware(options = {}) {
  options = _.defaults(options, {
    labels: {},
    statusCodesLookup: STATUS_CODES,
  });
  const counters = new Counters({
    statusCodeBuckets: Object.keys(options.statusCodesLookup),
  });
  client.collectDefaultMetrics({ labels: options.labels });

  return (req, res, next) => {
    const requestStartTime = new Date().getTime();

    counters.requestsCounter.inc(1);
    res.on("finish", () => {
      const requestEndTime = new Date().getTime();
      counters.requestTimeCounter.inc(requestEndTime - requestStartTime);
      // check response codes here
      if (res.statusCode < 400) {
        counters.sucessfulResponse.inc(1);
      } else {
        counters.failedResponse.inc(1);
      }
      counters.responseStatusHist.observe(res.statusCode);
    });
    next();
  };
}

module.exports = { client, metricsMiddleware, Counters };
