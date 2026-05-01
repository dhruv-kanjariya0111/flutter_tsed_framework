import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 load test — run: k6 run test/load/load-test.js
// Pass criteria: p95 < 500ms, error rate < 1%
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m',  target: 20 },  // Steady state
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
    http_req_failed:   ['rate<0.01'],  // < 1% error rate
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api/v1';

export default function () {
  // Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, { 'health OK': (r) => r.status === 200 });

  // Login endpoint
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: 'test@example.com', password: 'Test1234!' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  check(loginRes, {
    'login status 200 or 401': (r) => [200, 401].includes(r.status),
    'login response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
