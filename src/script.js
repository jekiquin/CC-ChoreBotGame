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
    constructor(numChoices) {
        this.numChoices = numChoices;
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
        // removing previous children of parent doorRow
        for (let door of Array.prototype.slice.call(doorRow.childNodes, 1)) {
            doorRow.removeChild(door);
        }
        this.doors = [];
        
        for (let i=0; i<this.numChoices; i++) {
            const choice = document.createElement('img');
            choice.src = doorImage;
            choice.alt = 'Closed door';
            choice.id = `door${i+1}`;
            choice.className ='door-frame';
            choice.style.padding = '10px';
            doorRow.append(choice);
            this.doors.push(choice);
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

class ChoreBotControl {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.startGameButton();
        this.initDoorControl();
    }

    initDoorControl() {
        this.view.doors.forEach((door, idx) => {
            door.onclick = () => {
                if (this.model.isPlaying) {
                    if (!this.model.doorIsOpenedArray[idx]) {
                        console.log(`door${idx+1} is opening!`);
                        this.model.doorIsOpenedArray[idx] = !this.model.doorIsOpenedArray[idx];
                        if (this.model.doorPathArray[idx]) {
                            this.model.isWin = false;
                            this.model.isPlaying = false;
                        } 
                        else if (this.model.doorIsOpenedArray.reduce((acc, value) => acc + value) >= 2) {
                            this.model.isWin = true;
                            this.model.isPlaying = false;
                        }
                        this.view.updateView(idx, this.model.doorPathArray[idx]);
                        this.view.updateStats(this.model.isWin, this.model.isPlaying);
                    }
                    else {
                        console.log(`door${idx+1} is already opened`)
                    }
                }
            }
        })
    }

    startGameButton() {
        startGame.onclick = () => {
            if (!this.model.isPlaying) {
                console.log('restarting');
                this.model.initModel();
                this.view.initView();
                this.initDoorControl();
            }
        }
    }

}

const newGame = new ChoreBotControl(new ChoreBotModel(numDoors), new ChoreBotView(numDoors));


