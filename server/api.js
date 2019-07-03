module.exports = (app, { User, Meme, Vote })=>{
  app.post('/user', (req, res)=>{
    User.create(req.body)
        .then((response)=> {
          res.json({
            message: 'user created',
            userId: response.dataValues.id,
          })
        })
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

  app.get('/meme', (req, res)=>{
    Meme.findAll().then(memes => {
      res.json(memes);
    })
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

  app.get('/vote', (req, res)=>{
    Vote.findAll().then(votes => {
      res.json(votes);
    })
  });
}
