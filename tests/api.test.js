const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../src/app');
const sequelize = require('../src/config/database');

// Create a server instance that we can close after tests
let server;

describe('API Endpoints', () => {
  let token;
  let imageId;
  // Generate a unique username for each test run
  const uniqueUser = `newuser_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  beforeAll(async () => {
    // Start server and keep a reference to close it later
    server = app.listen(0); // Use port 0 to get any available port
    
    // Register a user
    await request(app)
      .post('/api/v1/users/register')
      .send({ username: 'apitestuser', password: 'apitestpass' });

    // Login to get token
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ username: 'apitestuser', password: 'apitestpass' });
    token = res.body.token;
  });

  afterAll(async () => {
    // Close the server and database connections
    await new Promise(resolve => {
      server.close(resolve);
    });
    await sequelize.close();
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({ username: uniqueUser, password: 'newpass' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', uniqueUser);
    });

    it('should not register with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({ username: '' });
      expect(res.statusCode).toBe(400);
    });

    it('should not register duplicate usernames', async () => {
      await request(app)
        .post('/api/v1/users/register')
        .send({ username: 'dupuser', password: 'dup' });
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({ username: 'dupuser', password: 'dup2' });
      expect([400, 409]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ username: 'apitestuser', password: 'apitestpass' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with wrong credentials', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ username: 'apitestuser', password: 'wrongpass' });
      expect(res.statusCode).toBe(401);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ username: '' });
      expect([400, 401]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/images', () => {
    it('should upload an image', async () => {
      const res = await request(app)
        .post('/api/v1/images')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', path.join(__dirname, 'test-image.png'));
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('filename');
      imageId = res.body.id;
    });

    // This test is failing with EPIPE
    it('should fail to upload without auth', async () => {
      // Use a smaller test file to avoid EPIPE
      const res = await request(app)
        .post('/api/v1/images')
        .attach('image', path.join(__dirname, 'test-image.png'))
        .timeout(5000); // Add timeout to avoid hanging
      
      expect(res.statusCode).toBe(401);
    });

    it('should fail to upload without file', async () => {
      const res = await request(app)
        .post('/api/v1/images')
        .set('Authorization', `Bearer ${token}`);
      expect([400, 422]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/images/:id/transform', () => {
    it('should transform an image', async () => {
      const res = await request(app)
        .post(`/api/v1/images/${imageId}/transform`)
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: { resize: { width: 50, height: 50 } } });
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/image/);
    });

    it('should fail to transform without auth', async () => {
      const res = await request(app)
        .post(`/api/v1/images/${imageId}/transform`)
        .send({ operations: { resize: { width: 50, height: 50 } } });
      expect(res.statusCode).toBe(401);
    });

    it('should fail to transform non-existent image', async () => {
      const res = await request(app)
        .post('/api/v1/images/999999/transform')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: { resize: { width: 50, height: 50 } } });
      expect([404, 400]).toContain(res.statusCode);
    });
  });

  describe('GET /api/v1/images/:id', () => {
    it('should fetch image by id', async () => {
      const res = await request(app)
        .get(`/api/v1/images/${imageId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', imageId);
    });

    it('should return 404 for non-existent image', async () => {
      const res = await request(app)
        .get('/api/v1/images/999999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/v1/images', () => {
    it('should list images with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/images?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/images?page=1&limit=2');
      expect(res.statusCode).toBe(401);
    });
  });
});
