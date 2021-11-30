export default function testUserAndPassword(username:any, password:any):boolean {
    if (typeof username !== 'string') { return false; }
    if (typeof password !== 'string') { return false; }
    if (username.length < 6) { return false; }
    if (password.length < 6) { return false; }
    return true;
  }