const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/retro-games', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB initialized'))
  .catch(err => console.error('MongoDB initialization error:', err));

const gameSchema = new mongoose.Schema({
    title: String,
    year: String,
    price: Number,
    rating: Number,
});

const Game = mongoose.model('Game', gameSchema);

// Insert test data
const games = [
    { title: 'Super Mario Bros', year: '1980s', price: 15, rating: 5 },
    { title: 'The Legend of Zelda', year: '1980s', price: 20, rating: 4.5 },
    { title: 'Final Fantasy VII', year: '1990s', price: 30, rating: 4.8 },
    { title: 'Halo', year: '2000s', price: 50, rating: 4.7 },
];

Game.insertMany(games)
    .then(() => console.log('Test data inserted successfully'))
    .catch(err => console.error('Error inserting test data:', err))
    .finally(() => mongoose.connection.close());