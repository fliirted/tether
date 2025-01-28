const http = require('http');
const WebSocket = require('ws');
const PORT = 8080;

const logs = []

const server = http.createServer((res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.send(JSON.stringify({ type: 'history', logs }));

  ws.on('message', (data) => {
    const parsed = JSON.parse(data);
    const { user, message } = parsed;

    const newMessage = { user, message };
    logs.push(newMessage);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({type: 'message', newMessage}));
      }
    })
  });

  ws.on('close', () => {
    console.log('A client has disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
