const doorRow = document.querySelector('.door-row');
const instructionsRow = document.querySelector('.instructions-row');
const startGame = document.querySelector('#start');
const currentStreakCard = document.getElementById('current-streak');
const bestStreakCard = document.getElementById('best-streak');

var currentStreak = 0, bestStreak = 0;
const startGameMessage = 'Good Luck!';
const numDoors = 3
const botDoorPath = 'https://content.codecademy.com/projects/chore-door/images/robot.svg';
// const goodDoorPaths = [
//     'https://content.codecademy.com/projects/chore-door/images/beach.svg',
//     'https://content.codecademy.com/projects/chore-door/images/space.svg'
// ] 
const goodDoorpath = 'https://content.codecademy.com/projects/chore-door/images/space.svg'
const doorImage = 'https://content.codecademy.com/projects/chore-door/images/closed_door.svg';
const instructionsArray = [
    'Hiding behind one of these doors is the ChoreBot.',
    'Your mission is to open all of the doors without running into the ChoreBot',
    'If you manage to avoid the ChoreBot until you open the very last door, you win!',
    'See if you can score a winning streak!',
]

class ChoreBotModel {
    constructor(numChoices) {
        this.numChoices = numChoices;
        this.initModel();
    }

    initModel() {
        console.log('initializing model');
        this.doorIsOpenedArray = Array(this.numChoices).fill(false);
        this.doorPathArray = (function(numChoices) {
            const gameArray = Array(numChoices).fill(false);
            const randomIdx = Math.floor(Math.random()*numChoices);
            gameArray[randomIdx] = true;
            return gameArray;
        })(this.numChoices);
        this.isPlaying = true;
        this.isWin = null;
    }
    
}

class ChoreBotView {
    constructor() {
        this.instructions();
        this.initView();
    }

    instructions() {
        const instructionsTable = document.createElement('table');
        instructionsArray.forEach((instruction, index) => {
            const row = document.createElement('tr');
            const col1 = document.createElement('td');
            const col2 = document.createElement('td');
            col1.className = 'instructions-number';
            col2.className = 'instructions-text';
            col1.innerHTML = `${index + 1}`;
            col2.innerHTML = instruction;
            row.appendChild(col1);
            row.appendChild(col2);
            instructionsTable.appendChild(row)
        });
        instructionsRow.appendChild(instructionsTable);
    }

    initView() {
        console.log('initializing view');
        this.doors = document.querySelectorAll('.door-frame');
        
        for (let door of this.doors) {
            door.src = doorImage;
            door.alt = 'Closed door';
        }
        startGame.innerText = 'Good Luck!';
        currentStreakCard.innerText = currentStreak;
        bestStreakCard.innerText = bestStreak;
    }

    updateView(idx, doorPath) {
        if (doorPath) {
            this.doors[idx].src = botDoorPath;
            this.doors[idx].alt ='This is the bot. You lose';
        }
        else {
            this.doors[idx].src = goodDoorpath;
            this.doors[idx].alt = 'Space. All good!';
        }
    } 
    
    updateStats(isWin, isPlaying) {
        if (!isPlaying) {
            if (isWin) {
                currentStreak++;
                bestStreak = currentStreak > bestStreak ? currentStreak : bestStreak;
                startGame.innerText = 'You win!\nPlay again?'

            }
            else {
                currentStreak = 0;
                startGame.innerText = 'You lose!\nPlay again?'
            }
            currentStreakCard.innerText = currentStreak;
            bestStreakCard.innerText = bestStreak;   
        }
    }

}

(function(model, view) {
    view.doors.forEach((door, idx) => {
        door.onclick = () => {
            if (model.isPlaying) {
                if (!model.doorIsOpenedArray[idx]) {
                    console.log(`door${idx+1} is opening!`);
                    model.doorIsOpenedArray[idx] = true;
                    if (model.doorPathArray[idx]) {
                        model.isWin = false;
                        model.isPlaying = false;
                    } 
                    else if (model.doorIsOpenedArray.reduce((acc, value) => acc + value) >= 2) {
                        model.isWin = true;
                        model.isPlaying = false;
                    }
                    view.updateView(idx, model.doorPathArray[idx]);
                    view.updateStats(model.isWin, model.isPlaying);
                }
                else {
                    console.log(`door${idx+1} is already opened`)
                }
            }
        }
    })
    startGame.onclick = () => {
        if (!model.isPlaying) {
            console.log('restarting');
            model.initModel();
            view.initView();
        }
    }
})(new ChoreBotModel(3), new ChoreBotView)
