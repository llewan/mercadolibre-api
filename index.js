import Server from './lib/server';

const server = new Server();
server.configure();
server.loadRoutes();
server.listen();