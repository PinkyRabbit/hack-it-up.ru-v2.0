const app = require('../app');
const db = require('../db');

describe('App tests:', () => {
  beforeAll(async () => {
    await app.start();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });
});
