const request = require('supertest');
const app = require('../server');
const { initDatabase, query } = require('../config/db');
const bcrypt = require('bcryptjs');

let adminToken = '';
let testEnquiryId = null;

beforeAll(async () => {
  // Ensure database schema and default admin are ready
  await initDatabase();
});

describe('Tour Enquiry REST API Test Suite', () => {
  // 1. Health Check
  test('GET /api/health should return online status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
  });

  // 2. Enquiry Validation (Missing required fields)
  test('POST /api/enquiries should reject payload with missing required fields', async () => {
    const res = await request(app)
      .post('/api/enquiries')
      .send({
        full_name: '',
        email: 'invalid-email',
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.full_name).toBeDefined();
    expect(res.body.errors.email).toBeDefined();
  });

  // 3. Successful Enquiry Submission
  test('POST /api/enquiries should successfully create a new tour enquiry', async () => {
    const today = new Date();
    today.setDate(today.getDate() + 10);
    const futureDate = today.toISOString().split('T')[0];

    const res = await request(app)
      .post('/api/enquiries')
      .send({
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 555-019-2834',
        destination: 'Bali, Indonesia',
        travel_date: futureDate,
        travellers: 2,
        budget: '$1,500 - $3,000',
        message: 'Looking for a private villa with ocean view.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.status).toBe('Pending');
    expect(res.body.data.destination).toBe('Bali, Indonesia');

    testEnquiryId = res.body.data.id;
  });

  // 4. Admin Login - Failed attempt
  test('POST /api/auth/login should reject incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@wanderflow.com',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 5. Admin Login - Success
  test('POST /api/auth/login should authenticate admin and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@wanderflow.com',
        password: 'Admin@123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.admin.email).toBe('admin@wanderflow.com');

    adminToken = res.body.data.token;
  });

  // 6. Admin Session Check
  test('GET /api/auth/me should return current admin profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.admin.email).toBe('admin@wanderflow.com');
  });

  // 7. Protected Route Rejection without Token
  test('GET /api/enquiries should return 401 Unauthorized without auth token', async () => {
    const res = await request(app).get('/api/enquiries');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 8. Protected Route Access with Token
  test('GET /api/enquiries should list enquiries when authorized', async () => {
    const res = await request(app)
      .get('/api/enquiries')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.pagination).toBeDefined();
  });

  // 9. Update Enquiry Status
  test('PATCH /api/enquiries/:id/status should update status to Contacted', async () => {
    const res = await request(app)
      .patch(`/api/enquiries/${testEnquiryId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Contacted' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Contacted');
  });

  // 10. Update Complete Enquiry Details
  test('PUT /api/enquiries/:id should update enquiry details', async () => {
    const today = new Date();
    today.setDate(today.getDate() + 15);
    const futureDate = today.toISOString().split('T')[0];

    const res = await request(app)
      .put(`/api/enquiries/${testEnquiryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        full_name: 'John Doe Updated',
        email: 'john.updated@example.com',
        phone: '+1 555-999-8888',
        destination: 'Kyoto, Japan',
        travel_date: futureDate,
        travellers: 3,
        budget: '$3,000 - $5,000',
        message: 'Updated notes from call.',
        status: 'Contacted',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.full_name).toBe('John Doe Updated');
    expect(res.body.data.destination).toBe('Kyoto, Japan');
    expect(res.body.data.travellers).toBe(3);
  });

  // 11. Dashboard Stats
  test('GET /api/enquiries/stats should return counts by status', async () => {
    const res = await request(app)
      .get('/api/enquiries/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBeGreaterThan(0);
    expect(res.body.data.contacted).toBeGreaterThan(0);
  });

  // 12. Delete Enquiry
  test('DELETE /api/enquiries/:id should delete the enquiry', async () => {
    const res = await request(app)
      .delete(`/api/enquiries/${testEnquiryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone
    const fetchRes = await request(app)
      .get(`/api/enquiries/${testEnquiryId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(fetchRes.status).toBe(404);
  });
});
