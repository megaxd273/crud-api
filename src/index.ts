import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { deleteUser, users } from './db';
import { UserBody } from './models/user';
import { v4 as uuidv4, validate } from 'uuid';

const PORT = process.env.PORT;
function post<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const arr: Buffer[] = [];
    req.on('data', (chunk) => {
      arr.push(chunk);
    });
    req.on('end', () => {
      const user = JSON.parse(Buffer.concat(arr).toString());
      if (
        typeof user.username === 'string' &&
        typeof user.age === 'number' &&
        Array.isArray(user.hobbies)
      ) {
        resolve(user);
      } else {
        reject('missing fields');
      }
    });
  });
}
function containsRequestParam(req: IncomingMessage): boolean {
  if (req.url?.split('/').filter((el) => el !== '').length === 2) {
    return false;
  }
  return true;
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Content-type', 'application/json');

  if (req.url?.includes('/api/users') && !containsRequestParam(req)) {
    switch (req.method) {
      case 'GET':
        res.end(JSON.stringify(users));
        break;
      case 'POST':
        post<UserBody>(req)
          .then((user) => {
            users.push({ id: uuidv4(), ...user });
            res.statusCode = 201;
            res.end(JSON.stringify(user));
          })
          .catch((reason) => {
            res.statusCode = 400;
            res.statusMessage = reason;
            res.end('There are missing field in Request body');
          });
      default:
        break;
    }
  } else if (req.url?.includes('/api/users') && containsRequestParam(req)) {
    const reqParam = req.url?.split('/').at(-1) as string;
    if (!validate(reqParam)) {
      res.statusCode = 400;
      res.end(`${reqParam} is not a valid uuid`);
      return;
    }
    switch (req.method) {
      case 'GET':
        const userById = users.filter((el) => el.id === reqParam);
        if (userById.length === 0) {
          res.statusCode = 404;
          res.end(`User with id ${reqParam} doesn't exist`);
        } else {
          res.end(JSON.stringify(userById));
        }
        break;
      case 'DELETE':
        const deleted = deleteUser(reqParam);
        if (!deleted) {
          res.statusCode = 404;
          res.end(`User with id ${reqParam} doesn't exist`);
        } else {
          res.statusCode = 204;
          res.statusMessage = 'Successfully deleted';
          res.end();
        }
        break;
      case 'PUT':
        const idx = users.findIndex((el) => el.id === reqParam);
        if (idx === -1) {
          res.statusCode = 404;
          res.end(`User with id ${reqParam} doesn't exist`);
        } else {
          post<UserBody>(req).then((newUser) => {
            users[idx] = { ...users[idx], ...newUser };
            res.end(JSON.stringify(users[idx]));
          });
        }
        break;
      default:
        break;
    }
  } else {
    res.statusCode = 404;
    res.end(`Requested endpoint - ${req.url} doesn't exist`);
  }
});
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
