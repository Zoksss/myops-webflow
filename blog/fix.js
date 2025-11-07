const fs = require('fs');
const path = require('path');

const dir = __dirname;

// Regex za sve href="/nešto" osim ako već počinje sa /myops-webflow
const hrefRegex = /href="\/(?!myops-webflow)([^"]*)"/g;

// Uzimamo sve .html fajlove u trenutnom direktorijumu
const files = fs.readdirSync(dir).filter(file => file.endsWith('.html'));

if (files.length === 0) {
  console.log('⚠️  Nema .html fajlova u ovom direktorijumu.');
  process.exit(0);
}

files.forEach(file => {
  const filePath = path.join(dir, file);
  const backupPath = filePath + '.bak';

  // napravi backup
  fs.copyFileSync(filePath, backupPath);

  let html = fs.readFileSync(filePath, 'utf8');

  // prvo zameni prazan root link href="/"
  html = html.replace(/href="\//g, 'href="/myops-webflow/');

  // zatim dodaj /myops-webflow/ na sve ostale href-ove koji ga nemaju
  html = html.replace(/href="\/(?!myops-webflow)([^"]*)"/g, 'href="/myops-webflow/$1"');

  fs.writeFileSync(filePath, html, 'utf8');

  console.log(`✅ Ažuriran: ${file}`);
});

console.log('\n🎉 Svi HTML fajlovi su uspešno obrađeni.');