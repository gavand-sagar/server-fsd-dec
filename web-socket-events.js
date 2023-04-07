import { EventEmitter } from "events";
import { WebSocketServer } from 'ws';

let wss;
let webSocket;
const wssEvents = new EventEmitter();

wssEvents.on('start', () => {
    console.log('started');
});

wssEvents.on('start-web-socket', (server) => {
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        webSocket = ws;
    });
})


wssEvents.on('send-message', (messageBody) => {
    wss.clients.forEach((client) => {        
        client.send(JSON.stringify(messageBody));
      });
})

export default wssEvents