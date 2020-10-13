async function loginUser(username, password) {
  const reply = await fetch('http://localhost:3000/api/login_user/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await reply.json();

  return json;
}

async function callAPI() {
  const username = 'testuser';
  const password = 'testpassword';
  const token = await loginUser(username, password);
  const header = `${username}:${token}`;
  const reply = await fetch('http://localhost:3000/api/hello_world/', {
    method: 'GET',
    headers: { Authorization: header },
  });

  const json = await reply.json();
  console.log(json);

  return json;
}
