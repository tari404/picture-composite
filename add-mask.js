const fs = require('fs')
const sharp = require('sharp')

;(async () => {
  const mask = fs.readFileSync('./mask.png')

  const dir = fs.readdirSync('./output')
  for (const filename of dir) {
    if (!/\.png$/.test(filename)) {
      continue
    }

    const output = await sharp('./output/' + filename)
      .resize(800)
      .composite([{ input: mask }])
      .jpeg({ quality: 40 })
      .toBuffer()

    fs.writeFileSync(`./output-2/${filename.replace('png', 'jpg')}`, output)
  }
})()
