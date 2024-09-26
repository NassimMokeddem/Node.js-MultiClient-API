//test
const express = require('express')
const app = express()
const port = 3000

app.get('/info', (req, res) => {
  res.send('jsau-apiserver-1.0.0')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
