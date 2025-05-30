const client = require('prom-client');

const httpRequestDurationMicroseconds = new client.Histogram({
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in microseconds",
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
})

module.exports = { httpRequestDurationMicroseconds }