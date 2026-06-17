#!/usr/bin/env node

import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Get project name from command line arguments
const args = process.argv.slice(2)
let projectName = args[0]

// If no project name provided, prompt user
if (!projectName) {
  const readline = await import('readline').then(m => m.default)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  projectName = await new Promise(resolve => {
    rl.question('Enter project name: ', answer => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

if (!projectName) {
  console.error('Error: Project name is required')
  process.exit(1)
}

// Validate project name (must be valid npm package name)
const validName = /^[a-z0-9-]+$/.test(projectName)
if (!validName) {
  console.error('Error: Project name must contain only lowercase letters, numbers, and hyphens')
  process.exit(1)
}

// Create project directory
const targetDir = join(process.cwd(), projectName)

if (existsSync(targetDir)) {
  console.error(`Error: Directory ${projectName} already exists`)
  process.exit(1)
}

console.log(`Creating project: ${projectName}...`)
mkdirSync(targetDir, { recursive: true })

// Copy template files
const templateDir = join(__dirname, 'template')
copyRecursive(templateDir, targetDir)

// 把 _gitignore 重命名为 .gitignore
const tempGitIgnore = join(targetDir, '_gitignore')
const realGitIgnore = join(targetDir, '.gitignore')
if (existsSync(tempGitIgnore)) {
  // 覆盖写入，防止已有.gitignore
  const buf = readFileSync(tempGitIgnore)
  writeFileSync(realGitIgnore, buf)
  // 可选：删掉临时 _gitignore 文件
  unlinkSync(tempGitIgnore)
}

// Replace placeholder with project name
replaceInFiles(targetDir, '{{PROJECT_NAME}}', projectName)

console.log(`Project ${projectName} created successfully!`)
console.log(`
Next steps:
  cd ${projectName}
  npm install
  npm run tauri dev
`)

function copyRecursive(src, dest) {
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true, dot: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      // Copy file as binary
      const content = readFileSync(srcPath)
      writeFileSync(destPath, content)
    }
  }
}

function replaceInFiles(dir, placeholder, replacement) {
  const entries = readdirSync(dir, { withFileTypes: true, dot: true })

  for (const entry of entries) {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      // Skip certain directories
      if (entry.name === 'node_modules' || entry.name === 'target' || entry.name === 'dist' || entry.name === '.git') {
        continue
      }
      replaceInFiles(path, placeholder, replacement)
    } else {
      // Skip binary files and certain extensions
      const ext = entry.name.split('.').pop()
      if (['png', 'jpg', 'jpeg', 'ico', 'icns', 'svg'].includes(ext)) {
        continue
      }

      try {
        let content = readFileSync(path, 'utf-8')

        // Only replace if placeholder exists
        if (content.includes(placeholder)) {
          content = content.split(placeholder).join(replacement)
          writeFileSync(path, content)
        }
      } catch (e) {
        // Skip files that can't be read as UTF-8
      }
    }
  }
}