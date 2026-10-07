import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const dir = 'src/assets/images'
const photos = new Set(['kv.png'])
const precise = new Set(['qr.png'])

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`
}

const files = fs.readdirSync(dir).filter((file) => file.endsWith('.png')).sort()

for (const file of files) {
  const input = path.join(dir, file)
  const output = input.replace(/\.png$/, '.webp')
  const before = fs.statSync(input).size
  const meta = await sharp(input).metadata()
  let mode = 'icon-q93'

  if (photos.has(file)) {
    mode = 'photo-q85'
    await sharp(input).webp({ quality: 85, effort: 6, alphaQuality: 100 }).toFile(output)
  } else if (precise.has(file)) {
    mode = 'lossless'
    await sharp(input).webp({ lossless: true, effort: 6 }).toFile(output)
  } else {
    await sharp(input).webp({ quality: 93, alphaQuality: 100, effort: 6 }).toFile(output)
  }

  const after = fs.statSync(output).size
  const src = await sharp(input).ensureAlpha().raw().toBuffer()
  const dst = await sharp(output).ensureAlpha().raw().toBuffer()
  let mismatch = 0
  let samples = 0
  const step = Math.max(4, Math.floor(src.length / 32000) * 4)
  for (let i = 3; i < src.length; i += step) {
    samples += 1
    if (src[i] < 16 !== dst[i] < 16) mismatch += 1
  }

  const smaller = after < before
  if (smaller) fs.unlinkSync(input)
  else fs.unlinkSync(output)
  const saved = before === 0 ? 0 : Math.round((1 - after / before) * 100)
  console.log(
    [
      file,
      fmt(before),
      smaller ? fmt(after) : 'PNG kept',
      smaller ? `${saved}%` : 'larger',
      mode,
      `${meta.width}x${meta.height}`,
      `alpha:${Boolean(meta.hasAlpha)}`,
      `mismatch:${mismatch}/${samples}`,
    ].join(' | '),
  )
}
