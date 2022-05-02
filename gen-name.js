// C-E-F-G-D-B-H-A

const fs = require('fs')
const path = require('path')

function initPart(nums) {
  const result = Array.prototype.concat(
    ...nums.map((count, i) => new Array(count).fill(i))
  )
  if (result.length !== 10000) {
    throw new Error('E1')
  }
  return result.sort(() => (Math.random() < 0.5 ? -1 : 1))
}

const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'GH']
const con = [
  initPart([
    700, 700, 700, 735, 800, 800, 800, 800, 800, 800, 350, 350, 350, 350, 355,
    255, 355,
  ]),
  initPart([
    1050, 1050, 1050, 1050, 1050, 200, 200, 200, 1050, 200, 850, 850, 300, 300,
    200, 200, 200,
  ]),
  initPart([
    800, 800, 800, 800, 800, 220, 900, 280, 200, 200, 200, 200, 900, 200, 900,
    900, 900,
  ]),
  initPart([
    320, 200, 200, 680, 680, 680, 880, 200, 200, 900, 900, 900, 900, 880, 880,
    200, 200, 200,
  ]),
  initPart([
    1050, 1050, 200, 300, 250, 200, 900, 1050, 1050, 1050, 1050, 200, 200, 200,
    200, 1050,
  ]),
  initPart([
    900, 900, 900, 1050, 900, 900, 200, 300, 950, 250, 900, 200, 900, 200, 250,
    150, 150,
  ]),
  initPart([
    800, 1000, 1050, 1050, 1050, 1050, 1050, 1050, 100, 200, 200, 200, 200, 200,
    200, 200, 200, 200,
  ]),
]

const genName = (i) => {
  const name = []
  for (const idx in keys) {
    name.push(keys[idx] + (con[idx][i] + 1))
  }
  return name.join('-')
}

const toggle = (i) => {
  const key = Math.floor(Math.random() * keys.length)
  for (let j = 0; j < 10000; j++) {
    if (con[key][i] !== con[key][j]) {
      const temp = con[key][i]
      con[key][i] = con[key][j]
      con[key][j] = temp
      break
    }
  }
}

const set = new Set()

for (let i = 0; i < 10000; i++) {
  const name = genName(i)
  if (set.has(name)) {
    toggle(i)
    i--
  } else {
    set.add(name)
  }
}

fs.writeFileSync(
  path.join(__dirname, './filenames.csv'),
  Array.from(set.values()).join('\n')
)
