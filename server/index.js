const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const ORM = require('sequelize');
const connection = new ORM('postgres://meme_wars:guest@localhost:5432/meme_wars');

const modelsFactory = require('./models');
const { User, Meme, Vote } = modelsFactory(connection, ORM);

connection.authenticate()
  .then(()=> console.log('success'))
  .catch((err)=> console.log(err));


app.use( express.static('build') );
app.use( express.json() );

app.get('/hydrate', (req, res)=> {
  User.sync({ force: true })
    .then(()=> Meme.sync({ force: true }))
    .then(()=> Vote.sync({ force: true }))
    .then(()=> res.json({ message: 'success creating User, Meme, Vote tables' }))
    .catch(err => res.status(500).json({ message: JSON.stringify(err) }));
});

app.post('/user', (req, res)=>{
  User.create(req.body)
      .then(()=> res.json({ message: 'user created' }))
      .catch(err => {
        res.status(500).json({ message: JSON.stringify(err) })
      });
});

app.get('/user/:id', (req, res)=>{
  User.findByPk(1*req.params.id)
    .then(user => res.json(user));
});

app.post('/meme', (req, res)=>{
  Meme.create(req.body)
      .then(()=> res.json({ message: 'meme created' }))
      .catch(err => {
        res.status(500).json({ message: JSON.stringify(err) })
      });
});

app.get('/meme/:id', (req, res)=>{
  Meme.findByPk(1*req.params.id)
    .then(meme => res.json(meme));
});

app.post('/vote', (req, res)=>{
  Vote.create(req.body)
      .then(()=> res.json({ message: 'vote created' }))
      .catch(err => {
        res.status(500).json({ message: JSON.stringify(err) })
      });
});

app.get('/vote/:id', (req, res)=>{
  Vote.findByPk(1*req.params.id)
    .then(vote => res.json(vote));
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
