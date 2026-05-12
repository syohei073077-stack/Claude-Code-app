import sharp from 'sharp'
import { readFileSync } from 'fs'

const svg = readFileSync('./public/icon.svg', 'utf8')
const buf = Buffer.from(svg)

await sharp(buf).resize(192, 192).png().toFile('./public/icon-192.png')
console.log('icon-192.png done')

await sharp(buf).resize(512, 512).png().toFile('./public/icon-512.png')
console.log('icon-512.png done')
