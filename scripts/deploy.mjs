// Publica dist/ en la rama gh-pages (GitHub Pages "Deploy from a branch").
// No necesita Actions: build + check locales y push forzado de una rama sin historia.
// Uso: npm run deploy
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const sh = (c, opts = {}) => execSync(c, { stdio: 'inherit', ...opts });
const remote = execSync('git remote get-url origin').toString().trim();

sh('node scripts/build.mjs');
sh('node scripts/check.mjs');

const cwd = 'dist';
fs.rmSync(`${cwd}/.git`, { recursive: true, force: true });
const msg = `Publicar ${execSync('git rev-parse --short HEAD').toString().trim()}`;
sh('git init -q -b gh-pages', { cwd });
sh('git add -A', { cwd });
sh(`git -c user.name="${execSync('git config user.name').toString().trim()}" -c user.email="${execSync('git config user.email').toString().trim()}" commit -q -m "${msg}"`, { cwd });
sh(`git push -f -q ${remote} gh-pages`, { cwd });
fs.rmSync(`${cwd}/.git`, { recursive: true, force: true });
console.log('Publicado en gh-pages');
