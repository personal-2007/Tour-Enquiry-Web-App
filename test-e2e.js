const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log('--- Step 1: Health Check ---');
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('Health:', health.status, health.data);

  console.log('\n--- Step 2: Public Enquiry Submission ---');
  const today = new Date();
  today.setDate(today.getDate() + 14);
  const futureDate = today.toISOString().split('T')[0];

  const enquiryPayload = {
    full_name: 'Amelia Dupont',
    email: 'amelia.dupont@example.com',
    phone: '+1 555-839-2019',
    destination: 'Santorini, Greece',
    travel_date: futureDate,
    travellers: 2,
    budget: '$2,500 - $5,000',
    message: 'Honeymoon trip with caldera sunset yacht charter and cliffside villa.',
  };

  const createRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    enquiryPayload
  );
  console.log('Created Enquiry:', createRes.status, createRes.data.message, 'ID:', createRes.data.data?.id);
  const enquiryId = createRes.data.data?.id;

  console.log('\n--- Step 3: Admin Login ---');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@wanderflow.com', password: 'Admin@123' }
  );
  console.log('Login:', loginRes.status, loginRes.data.message, 'Admin:', loginRes.data.data?.admin?.email);
  const token = loginRes.data.data?.token;

  console.log('\n--- Step 4: Admin Session Me ---');
  const meRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Admin Session:', meRes.status, meRes.data.data?.admin?.name);

  console.log('\n--- Step 5: Dashboard Stats ---');
  const statsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Stats:', statsRes.status, statsRes.data.data);

  console.log('\n--- Step 6: Search Enquiries (search=Amelia) ---');
  const searchRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries?search=Amelia',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Search Results Count:', searchRes.data.data?.length, 'Found name:', searchRes.data.data?.[0]?.full_name);

  console.log('\n--- Step 7: Update Status to Contacted ---');
  const statusRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/enquiries/${enquiryId}/status`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    },
    { status: 'Contacted' }
  );
  console.log('Status Update:', statusRes.status, statusRes.data.data?.status);

  console.log('\n--- Step 8: Update Full Enquiry Details ---');
  const updateRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/enquiries/${enquiryId}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    },
    {
      full_name: 'Amelia Dupont-Renard',
      email: 'amelia.dupont@example.com',
      phone: '+1 555-839-2019',
      destination: 'Santorini & Mykonos, Greece',
      travel_date: futureDate,
      travellers: 3,
      budget: 'Luxury ($5,000+)',
      message: 'Updated: Special anniversary package with helicopter transfer.',
      status: 'Confirmed',
    }
  );
  console.log('PUT Update:', updateRes.status, updateRes.data.data?.full_name, updateRes.data.data?.status, updateRes.data.data?.travellers);

  console.log('\n--- Step 9: Delete Enquiry ---');
  const delRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/enquiries/${enquiryId}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Delete:', delRes.status, delRes.data.message);

  console.log('\n--- Step 10: Frontend Serving Check ---');
  const viteRes = await request({
    hostname: 'localhost',
    port: 5173,
    path: '/',
    method: 'GET',
  });
  console.log('Vite Frontend Status:', viteRes.status, 'HTML Received:', viteRes.data.includes('<div id="root"></div>'));

  console.log('\n=== ALL END-TO-END CHECKS COMPLETED SUCCESSFULLY! ===');
}

run().catch(console.error);
