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
      //  Cambiar implementacion a paso de filtro de busqueda 
      req.user = decodeToken.uid === '2TBSb8RFC5cfYm8yxw07cX7iQyr1' ? 
        {}
        :{ asesor_activo: decodeToken.uid };
      next();
    }).catch((_) => {
      res.status(400).json({ error: "Token invalido" });
    })
})

app.get('/', (req, res) => {
  res.status(200).send('Hello, monitor!').end()
});

app.get('/api/clientes/getList', (req, res) => {
  const dbConnect = dbo.getDb()
  dbConnect.collection('clientes')
    .find(req.user)
    .toArray()
    .then((resultado) => {
        res.status(200).json(resultado).send()
    }).catch(err => {
      console.log(err)
      res.status(400).json({ 
        error: "Error al obtener datos 2",
        data:err 
      }).send()
    }).finally(() => {
      //dbo.closeConnection()
    })
});


dbo.connectToServer(()=>{
  const PORT = parseInt(process.env.PORT) || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
})

module.exports = app;
