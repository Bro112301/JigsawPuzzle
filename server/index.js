const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;
        const puzzleLink = await generatePuzzle(imageBuffer);

        res.json({ link: puzzleLink });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/puzzles/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'puzzles', filename);

    // Serve the puzzle image
    res.sendFile(filePath);
});

async function generatePuzzle(imageBuffer) {
    const originalImage = await Jimp.read(imageBuffer);
    const resizedImage = originalImage.clone().resize(300, 200);

    const puzzleImage = new Jimp(300, 200, 0xFFFFFFFF);

    const gridSize = 3;
    const pieceWidth = resizedImage.getWidth() / gridSize;
    const pieceHeight = resizedImage.getHeight() / gridSize;

    const pieces = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const piece = resizedImage.clone().crop(x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight);
            pieces.push(piece);
        }
    }

    pieces.sort(() => Math.random() - 0.5);

    let currentX = 0;
    let currentY = 0;

    for (const piece of pieces) {
        puzzleImage.blit(piece, currentX, currentY);
        currentX += pieceWidth;

        if (currentX >= puzzleImage.getWidth()) {
            currentX = 0;
            currentY += pieceHeight;
        }
    }

    const puzzlePath = path.join(__dirname, 'puzzles', 'puzzle.png');
    await puzzleImage.writeAsync(puzzlePath);

    return `/puzzles/puzzle.png`;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

