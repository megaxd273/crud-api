import { IncomingMessage, ServerResponse } from 'http';
import { deleteUser, users } from '../db';
import { UserBody, User } from '../models/user';
import { v4 as uuidv4, validate } from 'uuid';
import {
  getBody,
  isValidEndpoint,
  containsRequestParam,
  notSupportedMethod,
} from '../utils/index';

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-type', 'application/json');

  try {
    if (isValidEndpoint(req) && !containsRequestParam(req)) {
      switch (req.method) {
        case 'GET':
          res.end(JSON.stringify(users));
          break;
        case 'POST':
          getBody<UserBody>(req)
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
          break;
        default:
          notSupportedMethod(res);
          break;
      }
    } else if (isValidEndpoint(req) && containsRequestParam(req)) {
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
            getBody<User>(req).then((newUser) => {
              users[idx] = { ...users[idx], ...newUser };
              res.end(JSON.stringify(users[idx]));
            });
          }
          break;
        default:
          notSupportedMethod(res);
          break;
      }
    } else {
      res.statusCode = 404;
      res.end(`Requested endpoint - ${req.url} doesn't exist`);
    }
  } catch (error) {
    console.error(`Internal server error: ${error}`);
    res.statusCode = 500;
    res.end(`Internal server error: ${error}`);
  }
}
