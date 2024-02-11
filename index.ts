import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';

const PORT = process.env.PORT;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.end('crud-api init');
});
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
