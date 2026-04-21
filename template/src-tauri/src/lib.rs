#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri_plugin_sql::{Migration, MigrationKind};

pub fn run() {
  tauri::Builder::default()
    .plugin(
      tauri_plugin_log::Builder::default()
        .level(log::LevelFilter::Info)
        .build(),
    )
    .plugin(tauri_plugin_shell::init())
    .plugin(
        tauri_plugin_sql::Builder::default()
            .add_migrations(
                "sqlite:app.db",
                vec![
                    Migration {
                        version: 1,
                        description: "create_tasks_table",
                        sql: r#"
                            CREATE TABLE IF NOT EXISTS tasks (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                title TEXT NOT NULL,
                                description TEXT,
                                completed INTEGER DEFAULT 0,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )
                        "#,
                        kind: MigrationKind::Up,
                    },
                    Migration {
                        version: 2,
                        description: "create_downloads_table",
                        sql: r#"
                            CREATE TABLE IF NOT EXISTS downloads (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                filename TEXT NOT NULL,
                                url TEXT,
                                save_path TEXT,
                                file_size TEXT,
                                status TEXT DEFAULT 'downloading',
                                progress INTEGER DEFAULT 0,
                                gid TEXT,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )
                        "#,
                        kind: MigrationKind::Up,
                    },
                ],
            )
            .build(),
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
