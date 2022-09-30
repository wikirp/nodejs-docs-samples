'use strict';

// [START gae_flex_quickstart]
const express = require('express');
const cors = require('cors')
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const dbo = require('./db/conn');

initializeApp()

const app = express();

app.use(cors({
  origin: '*'
}))

app.use('/api/clientes', (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  getAuth()
    .verifyIdToken(token)
    .then((decodeToken) => {
      req.user = decodeToken.uid;
      next();
    }).catch((_) => {
      res.status(400).json({ error: "Token invalido" });
    })
})

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/api/clientes/getList', (req, res) => {
  const dbConnect = dbo.getDb()

  dbConnect.collection('clientes')
    .find({})
    .limit(20)
    .toArray()
    .then((resultado, err) => {
      if (err) {
        res.status(400).json({ error: "Error al obtener datos" }).send()
      } else {
        res.status(200).json(resultado).send()
      }
    }).catch(err => {
      res.status(400).json({ error: "Error al obtener datos" }).send()
    })
});


dbo.connectToServer(()=>{
  const PORT = parseInt(process.env.PORT) || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
})




// Start the server

// [END gae_flex_quickstart]

module.exports = app;
