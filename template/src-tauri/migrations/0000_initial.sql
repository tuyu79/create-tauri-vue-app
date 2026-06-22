-- Phase 1: drop old scaffolding tables, create archive tool schema

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS downloads;

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_type TEXT NOT NULL,
    source_paths TEXT NOT NULL,
    target_path TEXT NOT NULL,
    format TEXT NOT NULL,
    compression_level INTEGER DEFAULT 6,
    password TEXT,
    options TEXT,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    total_size INTEGER DEFAULT 0,
    processed_size INTEGER DEFAULT 0,
    current_file TEXT,
    error_message TEXT,
    started_at TEXT,
    finished_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS task_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    format TEXT NOT NULL,
    compression_level INTEGER DEFAULT 6,
    password TEXT,
    options TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_task_logs_task_id ON task_logs(task_id);
