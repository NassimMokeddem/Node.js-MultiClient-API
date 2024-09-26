/*
const express = require('express')
const app = express()
const port = 3000

app.get('/info', (req, res) => {
  res.send('jsau-apiserver-1.0.0')
})

import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
*/

const express = require('express')
const app = express()
const port = 8080

app.get('/search', (req, res) => {
  const recherche = req.query.text;
  res.send(`Le paramètre text est : ${recherche}`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

