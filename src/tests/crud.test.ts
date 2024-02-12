import request from 'supertest';
import { initServer } from '../server';
import { Server } from 'http';
import { UserBody } from 'models/user';
import { v4 } from 'uuid';

let server: Server;

beforeAll(() => {
  server = initServer();
});
afterAll((done) => {
  server.close(done);
});
describe('GET /api/users', () => {
  test('should return empty array with status code 200', async () => {
    const res = await request(server).get('/api/users');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual(JSON.stringify([]));
  });
});
describe('POST /api/users', () => {
  test('A new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
    const newUser: UserBody = {
      username: 'stas',
      age: 12,
      hobbies: [],
    };
    const res = await request(server).post('/api/users').send(newUser);
    expect(res.status).toEqual(201);
    expect(res.body).toEqual(newUser);
  });
});
describe('delete /api/users/{id}', () => {
  test('DELETE api/users/{userId} deletes the object by id and returns confirmation', async () => {
    const newUser = {
      id: v4(),
      username: 'testUserToDelete',
      age: 10,
      hobbies: ['running', 'cooking'],
    };
    const res = await request(server).post('/api/users').send(newUser);
    const userIdToDelete = res.body.id;
    const deleteRes = await request(server).delete(
      `/api/users/${userIdToDelete}`
    );
    console.log(deleteRes.status);

    expect(deleteRes.status).toEqual(204);
  });
});
