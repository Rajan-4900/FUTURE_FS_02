import fs from 'fs/promises';
import path from 'path';

const STORE_PATH = path.resolve(process.cwd(), 'server', 'dev_users.json');

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeStore(users) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(users, null, 2), 'utf8');
}

export async function addDevUser(user) {
  const users = await readStore();
  // avoid duplicates by email
  if (users.some((u) => u.email === user.email)) return;
  users.push(user);
  await writeStore(users);
}

export async function getDevUsers() {
  return await readStore();
}

export default { addDevUser, getDevUsers };
