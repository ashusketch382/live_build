const client = require("prom-client");

const requestCounter = new client.Counter({
    name: "live_dashboard_backend_requests",
    help: "Number of requests to the live dashboard API",
    labelNames: ["method", "route", "status_code"]
});

module.exports = { requestCounter }