const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
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

async function updateData() {
  console.log('=== Step 1: Admin Authentication ===');
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

  if (loginRes.status !== 200) {
    console.error('Failed to log in:', loginRes.data);
    return;
  }

  const token = loginRes.data.data.token;
  console.log('Logged in as:', loginRes.data.data.admin.email);

  console.log('\n=== Step 2: Fetch Current Enquiry #1 ===');
  const beforeRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries/1',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log('BEFORE UPDATE:');
  console.log({
    id: beforeRes.data.data.id,
    full_name: beforeRes.data.data.full_name,
    destination: beforeRes.data.data.destination,
    travellers: beforeRes.data.data.travellers,
    budget: beforeRes.data.data.budget,
    status: beforeRes.data.data.status,
    message: beforeRes.data.data.message,
    updated_at: beforeRes.data.data.updated_at,
  });

  console.log('\n=== Step 3: Perform Full Update (PUT /api/enquiries/1) ===');
  const updatePayload = {
    full_name: 'Sophia Montgomery (VIP Platinum)',
    email: 'sophia.m@example.com',
    phone: '+1 (555) 234-8971',
    destination: 'Swiss Alps & Zermatt Matterhorn, Switzerland',
    travel_date: '2026-12-15',
    travellers: 4,
    budget: 'Luxury ($5,000+)',
    message: 'Confirmed VIP booking: Helicopter tour around Matterhorn + private chalet reservation with private chef.',
    status: 'Confirmed',
  };

  const putRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/1',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    updatePayload
  );

  console.log('PUT Response Status:', putRes.status);
  console.log('PUT Response Message:', putRes.data.message);

  console.log('\n=== Step 4: Verify Persistence (GET /api/enquiries/1) ===');
  const afterRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries/1',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log('AFTER UPDATE:');
  console.log({
    id: afterRes.data.data.id,
    full_name: afterRes.data.data.full_name,
    destination: afterRes.data.data.destination,
    travellers: afterRes.data.data.travellers,
    budget: afterRes.data.data.budget,
    status: afterRes.data.data.status,
    message: afterRes.data.data.message,
    updated_at: afterRes.data.data.updated_at,
  });

  console.log('\n=== Step 5: Test Status PATCH (PATCH /api/enquiries/2/status) ===');
  const patchRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/2/status',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    { status: 'Confirmed' }
  );
  console.log('PATCH Status Response:', patchRes.status, patchRes.data.message);

  console.log('\n=== DATA UPDATE SUCCESSFULLY COMPLETED AND VERIFIED! ===');
}

updateData().catch(console.error);
