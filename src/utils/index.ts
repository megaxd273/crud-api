import { IncomingMessage, ServerResponse } from 'http';

export function getBody<T>(req: IncomingMessage): Promise<T> {
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

export function isValidEndpoint(req: IncomingMessage) {
  const urlParts = req.url?.split('/');
  if (urlParts && urlParts.length >= 3) {
    return urlParts[1] === 'api' && urlParts[2] === 'users';
  }
  return false;
}

export function containsRequestParam(req: IncomingMessage): boolean {
  if (req.url?.split('/').filter((el) => el !== '').length === 2) {
    return false;
  }
  return true;
}

export function notSupportedMethod(res: ServerResponse) {
  res.statusCode = 405;
  res.end('Not allowed http method used');
}
