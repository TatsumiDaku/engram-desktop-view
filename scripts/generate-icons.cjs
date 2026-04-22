const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

const srcPng = path.join(__dirname, '../images/engram-logo.png');
const outIco = path.join(__dirname, '../build/icon.ico');

const sizes = [16, 32, 48, 256];

async function generateIco() {
  if (!fs.existsSync(srcPng)) {
    console.log('Source PNG not found, skipping icon generation');
    return;
  }

  const pngBuffer = fs.readFileSync(srcPng);
  
  const resizedBuffers = await Promise.all(
    sizes.map(size => 
      sharp(pngBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  
  const icoBuffer = await toIco(resizedBuffers);
  fs.writeFileSync(outIco, icoBuffer);
  
  console.log(`Generated ${outIco} with sizes: ${sizes.join(', ')}`);
}

generateIco().catch(console.error);
