const fs = require('fs')
const sharp = require('sharp')

;(async () => {
  const dir = fs.readdirSync('./assets')
  const imgs = new Map()
  const load = []
  for (const filename of dir) {
    if (/^(\w+)\.png$/.test(filename)) {
      const [, id] = filename.match(/^(\w+)\.png$/)
      load.push(
        new Promise((resolve, reject) => {
          fs.readFile(`./assets/${filename}`, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve()
              imgs.set(id, data)
            }
          })
        })
      )
    }
  }

  await Promise.all(load)

  console.log('loaded imgs:', imgs.size)

  const list = fs.readFileSync('./filenames.csv').toString().split('\n')

  for (let i = 0; i < list.length; i++) {
    const M = list[i].split('-')
    let mode = 'G'
    const ghIdx = Number(M[6].substring(2))
    let gh = 'G' + ghIdx
    if (ghIdx > 8) {
      mode = 'H'
      gh = 'H' + (ghIdx - 8)
    }
    M[6] = gh

    const inputs = [
      imgs.get(M[0]), // A
      ...(mode === 'H' ? [imgs.get(gh)] : []), // H
      imgs.get(M[1]), // B
      imgs.get(M[3]), // D
      ...(mode === 'G' ? [imgs.get(gh)] : []), // G
      ...(M[4] === 'E4' ? [imgs.get('E4a')] : []), // E4a
      imgs.get(M[5]), // F
      imgs.get(M[4]), // E
      imgs.get(M[2]), // C
      ...(M[2] === 'C12' ? [imgs.get('C12a')] : []), // C12a
    ]

    if (inputs.findIndex((item) => !item) !== -1) {
      console.error(inputs)
      throw new Error(`empty con id: ${i}, name: ${list[i]}`)
    }

    const output = await sharp({
      create: {
        width: 2000,
        height: 2000,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(inputs.map((b) => ({ input: b })))
      .png()
      .toBuffer()

    fs.writeFileSync(`./output/${M.join('-')}.png`, output)
  }
})()
