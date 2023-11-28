async function generatePuzzle(imageBuffer) {
    try {
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
    } catch (error) {
        console.error('Error generating puzzle:', error);
        throw error; // Propagate the error
    }
}
