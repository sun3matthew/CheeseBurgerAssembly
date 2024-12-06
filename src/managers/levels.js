
export class Levels {
    static Levels = {};

    static async loadLevels(levelCount) {
        for (let i = 1; i <= levelCount; i++) {
            await Levels.loadLevel(i);
        }
    }

    static async loadLevel(levelNumber) {
        try {
            const response = await fetch(`../levels/${levelNumber}.txt`);
            const text = await response.text();

            const rows = text.trim().split('\n');

            let playerGrid = [];

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i].split(' ');
                let newRow = [];

                for (let j = 0; j < row.length; j++) 
                    newRow.push(row[j])

                playerGrid.push(newRow);
            }

            // Store the level in the Levels object
            Levels.Levels[levelNumber] = playerGrid;

            console.log(`Level ${levelNumber} loaded successfully.`);
        } catch (error) {
            console.error(`Failed to load level ${levelNumber}:`, error);
        }
    }
}