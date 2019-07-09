const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const crypto = require('crypto');

const ORM = require('sequelize');

const connectionString = process.env.DATABASE_URL || 'postgres://memewars:guest@localhost:5432/memewars';
const connection = new ORM(connectionString, { logging: false });

const modelsFactory = require('./models');
const { User, Meme, Vote } = modelsFactory(connection, ORM);

app.use( express.static('build') );
app.use( express.json() );

const api = require('./api')(app, { User, Meme, Vote });

connection.authenticate()
  .then(()=> console.log('success'))
  .catch((err)=> console.log(err));


app.get('/hydrate', (req, res, next)=>{
  res.status(404).end('GET /hydrate not found');
}, (req, res)=> {
  const passwordHash = crypto.pbkdf2Sync('guest', 'secret code', 100, 64, 'sha512')
                             .toString('hex');

  let users = [
    { name: 'nik', passwordHash },
    { name: 'avi', passwordHash },
    { name: 'dan', passwordHash },
  ];

  let memes = [
    'http://theawkwardyeti.com/wp-content/uploads/2015/01/0121_Heartwatchesthenews.png',
    'https://media.discordapp.net/attachments/576550326509764619/589870367968067584/Snapchat-1663181687.jpg?width=725&height=666',
    'https://cdn.discordapp.com/attachments/576550326509764619/588542078460362753/Snapchat-1743849407.jpg',
    'https://cdn.discordapp.com/attachments/576550326509764619/587878048087539713/image0.jpg',
    'https://cdn.discordapp.com/attachments/576550326509764619/593075547815280661/bobbhlkash631.png',
    'https://images-ext-2.discordapp.net/external/G_e-rxPLhczo-uGCM2W0O85uPyRaZ26AQyv6LCGBdCk/https/bit.ly/2Xd9RnB?width=589&height=619',
  ];

  User.sync({ force: true })
    .then(()=> Meme.sync({ force: true }))
    .then(()=> Vote.sync({ force: true }))
    .then(()=> User.bulkCreate(users, { returning: true }))
    .then((userResponse)=> {
      users = userResponse.map(user => user.dataValues);
    })
    .then(()=> memes.map((imgUrl, i)=> ({
      imgUrl, author: users[i % users.length].id,
    })))
    .then((memesWithAuthor)=> Meme.bulkCreate(memesWithAuthor, { returning: true }))
    .then(memesResponse=> {
      memes = memesResponse.map(meme => meme.dataValues);
    })
    .then(()=>{
      let votes = [];
      for(let i=0; i<100; i++){
        votes.push({
          winner: memes[Math.floor(Math.random()*memes.length)].id,
          loser: memes[Math.floor(Math.random()*memes.length)].id,
          voter: users[i % users.length].id,
        });
      }
      return Vote.bulkCreate(votes);
    })
    .then(()=> res.json({ message: 'success creating User, Meme, Vote tables' }))
    .catch(err => res.status(500).json({ message: JSON.stringify(err) }));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
