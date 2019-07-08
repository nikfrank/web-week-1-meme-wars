module.exports = (connection, ORM)=> {
  const User = connection.define('user', {
    id: {
      type: ORM.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: ORM.TEXT,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: ORM.TEXT,
      allowNull: false,
    },
  }, { freezeTableName: true });

  const Meme = connection.define('meme', {
    id: {
      type: ORM.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imgUrl: {
      type: ORM.TEXT,
      allowNull: false,
    },
    author: {
      type: ORM.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  }, { freezeTableName: true });

  const Vote = connection.define('vote', {
    id: {
      type: ORM.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    winner: {
      type: ORM.INTEGER,
      allowNull: false,
      references: {
        model: 'meme',
        key: 'id',
      },
    },
    loser: {
      type: ORM.INTEGER,
      allowNull: false,
      references: {
        model: 'meme',
        key: 'id',
      },
    },
    voter: {
      type: ORM.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  }, { freezeTableName: true });

  return { User, Meme, Vote };
};
