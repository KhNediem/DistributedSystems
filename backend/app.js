const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

// Enable strictQuery to false to suppress deprecation warnings
mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/retro-games', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for games
const gameSchema = new mongoose.Schema({
    title: String,
    year: String,
    price: Number,
    rating: Number,
});

const Game = mongoose.model('Game', gameSchema);

// GET all games
app.get('/games', async (req, res) => {
    try {
        const filters = {};
        if (req.query.year) filters.year = req.query.year;
        if (req.query.price) {
            if (req.query.price === 'under20') filters.price = { $lt: 20 };
            else if (req.query.price === '20to50') filters.price = { $gte: 20, $lte: 50 };
            else if (req.query.price === 'over50') filters.price = { $gt: 50 };
        }
        if (req.query.rating) {
            if (req.query.rating === '4stars') filters.rating = { $gte: 4 };
            else if (req.query.rating === '3stars') filters.rating = { $gte: 3 };
            else if (req.query.rating === '2stars') filters.rating = { $gte: 2 };
        }

        const games = await Game.find(filters);
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific game by ID
app.get('/games/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new game
app.post('/games', async (req, res) => {
    const game = new Game({
        title: req.body.title,
        year: req.body.year,
        price: req.body.price,
        rating: req.body.rating,
    });

    try {
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST update a game by ID
app.post('/games/update/:id', async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedGame) return res.status(404).json({ message: 'Game not found' });
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});