// Gera public/og-image.jpg (1200×630) com o logótipo.
import sharp from 'sharp'
const logo = await sharp('public/assets/logo.png').resize(440).toBuffer()
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><radialGradient id="g" cx="78%" cy="50%" r="55%"><stop offset="0" stop-color="#3b3226"/><stop offset=".5" stop-color="#1F2A3A"/><stop offset="1" stop-color="#0E141D"/></radialGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<text x="70" y="270" font-family="Georgia,serif" font-weight="900" font-size="104" letter-spacing="-3" fill="#EDE3CC">BARBEARIA</text>
<text x="70" y="380" font-family="Georgia,serif" font-weight="900" font-size="104" letter-spacing="-3" fill="#EDE3CC">ORLANDO</text>
<text x="74" y="450" font-family="Georgia,serif" font-style="italic" font-size="38" fill="#B8925A">Porto · Desde 2015</text>
<rect x="74" y="490" width="80" height="2" fill="#A8322D"/></svg>`)
await sharp(bg).composite([{ input: logo, left: 700, top: 95 }]).jpeg({ quality: 84 }).toFile('public/og-image.jpg')
console.log('✓ og-image.jpg')
