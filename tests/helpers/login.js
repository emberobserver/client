import { click, fillIn, visit } from '@ember/test-helpers';

export default async function login() {
  server.post('/authentication/login.json', function() {
    return {
      token: 'abc123'
    };
  });
  await visit('/login');
  await fillIn('.test-email', 'test@example.com');
  await fillIn('.test-password', 'password123');
  return click('.test-log-in');
}
