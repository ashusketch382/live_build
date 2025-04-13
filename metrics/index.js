const { activeRequestsGauge } = require("./Gauge_activeRequests");
const { requestCounter } = require('./Counter_requestCount');
const { httpRequestDurationMicroseconds } = require("./histogram_http_req_duration_ms");


const metricsMiddleware = (req, res ,next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms}`);
        activeRequestsGauge.inc();
        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.status_code
        });
        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.status_code
        }, endTime - startTime);
        activeRequestsGauge.dec();
    });
    next();
}

module.exports = { metricsMiddleware }