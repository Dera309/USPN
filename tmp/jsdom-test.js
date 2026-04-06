import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

const dom = new JSDOM(html, { runScripts: 'dangerously' });
const window = dom.window;
const document = window.document;

// Mock some main.js logic since we won't execute module directly
const mBtn = document.getElementById('mobile-menu-btn');
const mMenu = document.getElementById('mobile-menu');

console.log('mBtn found:', !!mBtn);
console.log('mMenu found:', !!mMenu);
console.log('Initial classList mMenu:', Array.from(mMenu.classList));

mBtn.addEventListener('click', () => {
    const isOpen = !mMenu.classList.contains('hidden');
    if (isOpen) {
        mMenu.classList.add('hidden');
        mBtn.setAttribute('aria-expanded', 'false');
        mBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
    } else {
        mMenu.classList.remove('hidden');
        mBtn.setAttribute('aria-expanded', 'true');
        mBtn.querySelector('.material-symbols-outlined').textContent = 'close';
    }
});

console.log('Clicking mBtn...');
mBtn.click();
console.log('ClassList after click mMenu:', Array.from(mMenu.classList));

