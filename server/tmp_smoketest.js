import http from 'http';
import { request } from 'http';
import fetch from 'node-fetch';

(async function() {
  try {
    const base = 'http://localhost:4000';
    // login
    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teste@teste.com', password: '123456' }),
      redirect: 'manual'
    });
    const loginBody = await loginRes.json().catch(() => null);
    console.log('login status', loginRes.status);
    console.log('login body', loginBody);
    console.log('set-cookie header:', loginRes.headers.get('set-cookie'));

    const accessToken = loginBody?.accessToken;
    if (!accessToken) {
      console.error('no accessToken, aborting smoke test');
      process.exit(1);
    }

    // Chamando o protetor do endpoint (criando produto)
    const prodResNoToken = await fetch(base + '/api/produtos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Teste', preco: 10 }) });
    console.log('create produto without token status', prodResNoToken.status);

    const prodRes = await fetch(base + '/api/produtos', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken }, body: JSON.stringify({ nome: 'Teste', preco: 10 }) });
    const prodBody = await prodRes.json().catch(() => null);
    console.log('create produto with token status', prodRes.status);
    console.log('create produto body', prodBody);

    process.exit(0);
  } catch (err) {
    console.error('smoke test error', err);
    process.exit(2);
  }
})();
