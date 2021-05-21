const doorRow = document.querySelector('.door-row');
const instructionsRow = document.querySelector('.instructions-row');
const startGame = document.querySelector('#start');
const currentStreakCard = document.getElementById('current-streak');
const bestStreakCard = document.getElementById('best-streak')

const startGameMessage = 'Good Luck!';
const numDoors = 3
var numClosedDoors, isOver, doors, winningStreak = 0, bestStreak = 0;

// const botDoorPath = 'https://content.codecademy.com/projects/chore-door/images/robot.svg';
// const beachDoorPath = 'https://content.codecademy.com/projects/chore-door/images/beach.svg';
// const spaceDoorPath = 'https://content.codecademy.com/projects/chore-door/images/space.svg';
const doorPaths = [
    'https://content.codecademy.com/projects/chore-door/images/robot.svg',
    'https://content.codecademy.com/projects/chore-door/images/beach.svg',
    'https://content.codecademy.com/projects/chore-door/images/space.svg'
] 
const doorImage = 'https://content.codecademy.com/projects/chore-door/images/closed_door.svg';
const instructionsArray = [
    'Hiding behind one of these doors is the ChoreBot.',
    'Your mission is to open all of the doors without running into the ChoreBot',
    'If you manage to avoid the ChoreBot until you open the very last door, you win!',
    'See if you can score a winning streak!',
]

function init() {
    numClosedDoors = numDoors;
    isOver = false;
    startGame.innerHTML = startGameMessage;
    doorRow.querySelectorAll('*').forEach(element => doorRow.removeChild(element));

    // door generators
    for (let row=0; row<numDoors; row++) {
        const door = document.createElement('img');
        door.className = 'door-frame';
        door.src = doorImage;
        door.alt = 'closed door';
        door.style.padding = '10px';
        doorRow.appendChild(door);
    }
    doors = Array.prototype.slice.call(doorRow.childNodes, 1);


    randomChoreDoorGenerator();
}

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

const gameOver = function(loser) {
    if (loser) {
        message = 'You lose!';
        winningStreak = 0;
        ;
    }
    else {
        message = 'You win!'
        winningStreak++;
        if (winningStreak > bestStreak) {
            bestStreak = winningStreak;
            bestStreakCard.innerHTML = bestStreak;
        }
    }
    currentStreakCard.innerHTML = winningStreak
    isOver = true;
    startGame.innerHTML = `${message}<br>Play again?`;
};

const playDoor = function(door, index) {
    if (!isOver) {
        if (door.src === doorImage) {
            door.src = doorPaths[index];
            door.alt = 'opened door';
            numClosedDoors--;
        }
    
        if (door.src.includes('robot.svg')) {
            gameOver(true);
        }
        else if (numClosedDoors === 1) {
            gameOver(false);
        }
    }
}

const randomChoreDoorGenerator = () => {
    for (let i = doorPaths.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = doorPaths[i];
        doorPaths[i] = doorPaths[j];
        doorPaths[j] = temp; 
    }
    doors.forEach((door, index) => { door.onclick = 
        () => {
            playDoor(door, index);

        }; 
    });

}

startGame.onclick = () => {
    if (startGame.innerHTML !== startGameMessage);
    init();
}

init();












