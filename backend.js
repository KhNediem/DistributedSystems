const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/retro_games', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const gameSchema = new mongoose.Schema({
    name: String,
    price: Number,
    rating: Number,
    releaseYear: Number,
    images: [String],
    description: String
});

const Game = mongoose.model('Game', gameSchema);

// GET all games
app.get('/games', async (req, res) => {
    const games = await Game.find({}, 'name price rating releaseYear');
    res.json(games);
});

// GET a specific game by ID
app.get('/games/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json(game);
    } catch (err) {
        res.status(400).json({ error: 'Invalid game ID' });
    }
});

// POST: Add a new game
app.post('/games', async (req, res) => {
    const newGame = new Game(req.body);
    await newGame.save();
    res.json({ message: 'Game added', id: newGame._id });
});

// POST: Update an existing game
app.post('/games/:gameId/update', async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.gameId, req.body, { new: true });
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json({ message: 'Game updated' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid game ID' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
