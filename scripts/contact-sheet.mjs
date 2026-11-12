import sharp from 'sharp'; import fs from 'node:fs';
const [dir, out, cols=4, cell=360] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f=>/\.(jpe?g|png|webp)$/i.test(f)).sort();
const C=+cols, S=+cell, rows=Math.ceil(files.length/C);
const comps = await Promise.all(files.map(async (f,i)=>{
  const img = await sharp(`${dir}/${f}`,{failOn:"none"}).resize(S,S,{fit:'contain',background:'#222'}).toBuffer();
  const label = Buffer.from(`<svg width="${S}" height="26"><rect width="100%" height="100%" fill="#000"/><text x="6" y="19" font-size="16" fill="#fff" font-family="Arial">${f}</text></svg>`);
  return [{input:img,left:(i%C)*S,top:Math.floor(i/C)*(S+26)},{input:label,left:(i%C)*S,top:Math.floor(i/C)*(S+26)+S}];
}));
await sharp({create:{width:C*S,height:rows*(S+26),channels:3,background:'#111'}}).composite(comps.flat()).jpeg({quality:80}).toFile(out);
console.log(files.length, out);
