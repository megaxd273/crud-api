import { createServer, Server } from 'http';
import 'dotenv/config';
import { handleRequest } from './hadlers/requestHandler';

const PORT = process.env.PORT || 3000;

export const initServer = (): Server => {
  const server = createServer(handleRequest);

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  return server;
};
