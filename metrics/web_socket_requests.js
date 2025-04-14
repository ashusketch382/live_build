const activeConnections = new client.Gauge({
    name: 'frontend_ws_active_clients',
    help: 'Current number of WebSocket clients connected',
});
const totalConnections = new client.Counter({
    name: 'frontend_ws_total_connections',
    help: 'Total number of WebSocket connections established',
});
const messagesSent = new client.Counter({
    name: 'frontend_ws_messages_sent_total',
    help: 'Total messages sent to clients',
});
const messagesReceived = new client.Counter({
    name: 'frontend_ws_messages_received_total',
    help: 'Total messages received from clients',
});


module.exports = {
    activeConnections,
    totalConnections,
    messagesSent,
    messagesReceived
}