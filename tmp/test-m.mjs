const html = `
<button id="mobile-menu-btn" class="md:hidden p-2 flex items-center justify-center" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
  <span class="material-symbols-outlined text-3xl text-slate-900">menu</span>
</button>
<div id="mobile-menu" class="hidden md:hidden bg-slate-50/95 backdrop-blur-xl border-t border-slate-200 px-8 py-6 space-y-4"></div>
`;
import { JSDOM } from 'jsdom';
const dom = new JSDOM(html);
const document = dom.window.document;

function initNavbar() {
  const mBtn = document.getElementById('mobile-menu-btn')
  const mMenu = document.getElementById('mobile-menu')

  if (mBtn && mMenu) {
    mBtn.addEventListener('click', () => {
      const isOpen = !mMenu.classList.contains('hidden')
      if (isOpen) {
        mMenu.classList.add('hidden')
        mBtn.setAttribute('aria-expanded', 'false')
        mBtn.querySelector('.material-symbols-outlined').textContent = 'menu'
      } else {
        mMenu.classList.remove('hidden')
        mBtn.setAttribute('aria-expanded', 'true')
        mBtn.querySelector('.material-symbols-outlined').textContent = 'close'
      }
    })
  }
}
initNavbar();

const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

console.log('Before click:', Array.from(menu.classList));
btn.click();
console.log('After 1 click:', Array.from(menu.classList));
btn.click();
console.log('After 2 clicks:', Array.from(menu.classList));
