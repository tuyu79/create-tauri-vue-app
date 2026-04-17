# create-tauri-vue-app

Scaffold a new Tauri + Vue desktop application.

## Usage

```bash
npm create tauri-vue-app@latest my-app
```

Or run directly with npx:

```bash
npx create-tauri-vue-app my-app
```

## Options

```bash
create-tauri-vue-app <project-name>
```

## Features

- Tauri 2.x + Vue 3
- Element Plus UI
- Vue Router
- Tauri plugins: log, shell

## Template Customization

Edit these files to customize the template:

- `template/package.json` - NPM dependencies
- `template/src-tauri/Cargo.toml` - Rust dependencies
- `template/src-tauri/tauri.conf.json` - App configuration
- `template/src/views/Home.vue` - Default view
- `template/src/router/index.js` - Router config