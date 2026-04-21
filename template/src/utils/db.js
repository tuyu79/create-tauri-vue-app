import Database from '@tauri-apps/plugin-sql'

let db = null

export async function getDb() {
  if (!db) {
    db = await Database.load('sqlite:app.db')
  }
  return db
}

// CRUD operations for tasks
export async function getTasks() {
  const database = await getDb()
  return await database.select('SELECT * FROM tasks ORDER BY created_at DESC')
}

export async function addTask(title, description = '') {
  const database = await getDb()
  await database.execute(
    'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
    [title, description, 0]
  )
}

export async function updateTask(id, title, description, completed) {
  const database = await getDb()
  await database.execute(
    'UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, completed ? 1 : 0, id]
  )
}

export async function deleteTask(id) {
  const database = await getDb()
  await database.execute('DELETE FROM tasks WHERE id = ?', [id])
}

export async function toggleTask(id, completed) {
  const database = await getDb()
  await database.execute(
    'UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [completed ? 1 : 0, id]
  )
}