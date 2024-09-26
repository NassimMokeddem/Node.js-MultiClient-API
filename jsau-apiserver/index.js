


const express = require('express')
const app = express()
const port = 3000

app.get('/info', (req, res) => {
  app.listen(port, () => {
    const { readFile } = require('node:fs/promises');
    const { resolve } = require('node:path');
    async function logFile() {
      try {
        const filePath = resolve('./package.json');
        const contents = await readFile(filePath, { encoding: 'utf8' });
        res.send(contents)
      } catch (err) {
        console.error(err.message);
      }
    }
  })

})