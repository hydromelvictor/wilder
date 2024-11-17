/* module native */
const http = require('http');
const launch = require('./launch')
require('dotenv').config();


/* module perso */
const app = require('./app');


const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

launch.serverEvents.on('serverStarted', () => {
    launch.secure()
})

server.listen(port, process.env.HOST, () => {
    console.log(`Start Server http://${process.env.HOST}:${port}`);
    console.log(`Documentation Swagger disponible à http://127.0.0.1:3000/docs`);
    launch.serverEvents.emit('serverStarted');
});
