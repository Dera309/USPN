const fs = require('fs');

// 1x1 transparent ICO
const icoData = Buffer.from('AAABAAEAAQEAAAEAIAAwAAAAFgAAACgAAAABAAAAAgAAAAEAIAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==', 'base64');
fs.writeFileSync('favicon.ico', icoData);
fs.writeFileSync('public/favicon.ico', icoData);
console.log('Created favicon.ico');
