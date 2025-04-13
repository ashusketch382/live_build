const client = require('prom-client');
const activeRequestsGauge = new client.Gauge({
    name: 'live_dashboard_backend_active_requests',
    help: 'Number of active requests to the live dashboard API'
});
module.exports = { activeRequestsGauge }