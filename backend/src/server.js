require('dotenv').config();

const { createServer } = require('http');
const app = require('./app');
const { createSocketServer } = require('./socket');

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = createSocketServer(httpServer);

app.set('io', io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, httpServer, io };
