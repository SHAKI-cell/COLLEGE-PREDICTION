const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '..', 'prisma', 'seed.ts');
let content = fs.readFileSync(seedPath, 'utf-8');

// We have 8 campus banner images: /colleges/campus1.png through campus8.png
// Cycle through them for all colleges
let bannerIdx = 0;
content = content.replace(/banner: '[^']+'/g, () => {
  bannerIdx++;
  const imgNum = ((bannerIdx - 1) % 8) + 1;
  return `banner: '/colleges/campus${imgNum}.png'`;
});

// For logos, use local path too - we'll generate logos as initials in CSS
// Set logo to empty string so SafeImage generates beautiful initials
let logoIdx = 0;
content = content.replace(/logo: '[^']+'/g, () => {
  logoIdx++;
  return `logo: ''`;
});

fs.writeFileSync(seedPath, content);
console.log(`Replaced ${bannerIdx} banner URLs and ${logoIdx} logo URLs with local paths`);
