const express = require("express");
const { register } = require("prom-client");
const { metricsMiddleware } = require("./metrics");

const app = express();
/**
 * Fake api. Run
 * curl http://[host]:[port]/?status=[status]
 * to return a dummy response with the given status code
 */
function routes(){
  const router = new express.Router()
  
  router.get("/", (req, res, next) => {
    const statusCodeStr = req.query.status;
    let status = 200;
    if (statusCodeStr) {
      status = Number.parseInt(statusCodeStr, 10);
    }
    console.log(status);
    if (status >= 400) {
      res.status(status).json({msg: 'error!', status: status});
    } else {
      res.status(status).json({ msg: "hello world" });
    }
  });
  
  return router
}
// add simple middleware function to create an arbitrary
// response delay
app.use(function fakeSlowness(req, res, next) {
  const timeout = Math.random() * 1000;
  setTimeout(() => {
    next();
  }, timeout);
});
app.use(metricsMiddleware({}))
app.use(routes())

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});
module.exports = { app };
