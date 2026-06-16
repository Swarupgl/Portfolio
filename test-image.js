const fs = require('fs');

function checkFile(path) {
  const buffer = fs.readFileSync(path);
  console.log(`${path}: ${buffer.subarray(0, 8).toString('hex')}`);
}

checkFile('public/images/swarup_g_l.jpg');
checkFile('public/images/swarup.jpg');
checkFile('public/images/portrait.png');
