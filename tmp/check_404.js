import fs from 'fs';
import path from 'path';

async function check() {
  const pages = [
    '/',
    '/pages/login.html',
    '/pages/register.html',
    '/pages/forgot-password.html',
    '/pages/dashboard.html',
    '/pages/admin/dashboard.html'
  ];

  for (const p of pages) {
    try {
      const res = await fetch('http://localhost:3001' + p);
      const text = await res.text();

      const regex1 = /src="([^"]+)"/g;
      const regex2 = /href="([^"]+)"/g;
      
      let match;
      const urls = new Set();
      while ((match = regex1.exec(text)) !== null) urls.add(match[1]);
      while ((match = regex2.exec(text)) !== null) urls.add(match[1]);

      for (const url of urls) {
        if (url.startsWith('/')) {
          const resURL = await fetch('http://localhost:3001' + url);
          if (resURL.status === 404) {
            console.log(`[404] Found on ${p}: ${url}`);
          }
        }
      }
    } catch (e) {
      console.log('Error', p, e.message);
    }
  }
  
  // also check favicon
  const fav = await fetch('http://localhost:3001/favicon.ico');
  if (fav.status === 404) console.log(`[404] favicon.ico is missing!`);

  console.log("Check complete.");
}
check();
