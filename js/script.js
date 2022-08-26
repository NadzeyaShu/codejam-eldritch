import ancientsData from '../data/ancients.js';
import difficulties from '../data/difficulties.js';
import blueCardsData from '../data/mythicCards/blue/index.js';
import brownCardsData from '../data/mythicCards/brown/index.js';
import greenCardsData from '../data/mythicCards/green/index.js';

const ancientsContainer = document.querySelector('.ancients-container');
createAncientsList();
const ancientCards = document.querySelectorAll('.ancient-card');
const difficultyContainer = document.querySelector('.difficulty-container');
const deskContainer = document.querySelector('.desk-container');

ancientCards.forEach(element => element.addEventListener('click', () => highLightAncient(element)));
ancientCards.forEach(element => element.addEventListener('click', createShuffleButton));
ancientCards.forEach(element => element.addEventListener('click', createDifficultyList));
ancientCards.forEach(element => element.addEventListener('click', clearStageContainers));
ancientCards.forEach(element => element.addEventListener('click', () => selectAncient(element.id)));
ancientCards.forEach(element => element.addEventListener('click', resetStates));

difficultyContainer.addEventListener('click', createShuffleButton);
difficultyContainer.addEventListener('click', clearStageContainers);

let isDifficultyListCreated = false;
let isCreateShuffleButton = false;
let selectedAncient;
let selectedDifficulty;

let blueCardArray;
let greenCardArray;
let brownCardArray;

let firstStepCardArray = [];
let secondStepCardArray = [];
let thirdStepCardArray = [];

let isFirstStageComplete;
let isSecondStageComplete;
let isThirdStageComplete;

let gameDeskCardArray = [];

function createAncientsList() {
    ancientsData.forEach(ancient => {
        const div = document.createElement("div");
        div.classList.add("ancient-card");
        div.classList.add(ancient.id);
        div.id = ancient.id;
        ancientsContainer.append(div);
    });
}

function createDifficultyList() {
    if (!isDifficultyListCreated) {
        isDifficultyListCreated = true;
        difficulties.forEach(difficulty => {
            const div = document.createElement("div");
            div.classList.add("difficulty");
            div.textContent = difficulty.name;
            div.id = difficulty.id;
            div.addEventListener('click', () => highLightDifficulty(div));
            div.addEventListener('click', () => selectDifficulty(div));
            div.addEventListener('click', resetStates);
            difficultyContainer.append(div);
        });
    }
}

function selectDifficulty(div) {
    selectedDifficulty = div.id;
}

function createShuffleButton() {
    if (!isCreateShuffleButton && isDifficultyListCreated) {
        isCreateShuffleButton = true;
        const span = document.createElement("span");
        span.classList.add('shuffle-button');
        span.innerText = 'Замешать колоду';
        span.addEventListener("click", createCurrentState);
        span.addEventListener("click", shuffleCards);
        deskContainer.append(span);
    }
}

function shuffleCards() {
    shuffleBlueCards();
    shuffleGreenCards();
    shuffleBrownCards();
}

function shuffleBlueCards() {
    let copyCardsData = [...blueCardsData];
    shuffleArray(copyCardsData);
    let firstDesk = selectedAncient.firstStage.blueCards;
    let secondDesk = selectedAncient.secondStage.blueCards;
    let thirdDesk = selectedAncient.thirdStage.blueCards;
    let totalBlueCards = firstDesk + secondDesk + thirdDesk;
    copyCardsData = filterByDifficulty(copyCardsData, totalBlueCards);
    blueCardArray = copyCardsData.slice(0, totalBlueCards);
}

function shuffleGreenCards() {
    let copyCardsData = [...greenCardsData];
    shuffleArray(copyCardsData);
    let firstDesk = selectedAncient.firstStage.greenCards;
    let secondDesk = selectedAncient.secondStage.greenCards;
    let thirdDesk = selectedAncient.thirdStage.greenCards;
    let totalGreenCards = firstDesk + secondDesk + thirdDesk;
    copyCardsData = filterByDifficulty(copyCardsData, totalGreenCards);
    greenCardArray = copyCardsData.slice(0, totalGreenCards);
}

function shuffleBrownCards() {
    let copyCardsData = [...brownCardsData];
    shuffleArray(copyCardsData);
    let firstDesk = selectedAncient.firstStage.brownCards;
    let secondDesk = selectedAncient.secondStage.brownCards;
    let thirdDesk = selectedAncient.thirdStage.brownCards;
    let totalBrownCards = firstDesk + secondDesk + thirdDesk;
    copyCardsData = filterByDifficulty(copyCardsData, totalBrownCards);
    brownCardArray = copyCardsData.slice(0, totalBrownCards);
}

function filterVeryEasy(cardsArray, totalCards) {
    let veryEasyCards = cardsArray.filter(card => card.difficulty === 'easy');
    if (veryEasyCards.length < totalCards) {
        let normalCards = cardsArray.filter(card => card.difficulty === 'normal')
            .slice(0, totalCards - veryEasyCards.length);
        veryEasyCards = veryEasyCards.concat(normalCards);
    }
    shuffleArray(veryEasyCards);
    return veryEasyCards;
}

function filterEasy(cardsArray) {
    let easyCards = cardsArray.filter(card => card.difficulty !== 'hard');
    shuffleArray(easyCards);
    return easyCards;
}

function filterNormal(cardsArray) {
    return cardsArray;
}

function filterHard(cardsArray) {
    let hardCards = cardsArray.filter(card => card.difficulty !== 'easy');
    shuffleArray(hardCards);
    return hardCards;
}

function filterVeryHard(cardsArray, totalCards) {
    let veryHardCards = cardsArray.filter(card => card.difficulty === 'hard');
    if (veryHardCards.length < totalCards) {
        let normalCards = cardsArray.filter(card => card.difficulty === 'normal')
            .slice(0, totalCards - veryHardCards.length);
        veryHardCards = veryHardCards.concat(normalCards);
    }
    shuffleArray(veryHardCards);
    return veryHardCards;
}

function filterByDifficulty(cardsArray, totalCards) {
    switch (selectedDifficulty) {
        case 'very easy' :
            return filterVeryEasy(cardsArray, totalCards);
        case 'easy' :
            return filterEasy(cardsArray, totalCards);
        case 'normal' :
            return filterNormal(cardsArray);
        case 'hard' :
            return filterHard(cardsArray, totalCards);
        case 'very hard' :
            return filterVeryHard(cardsArray, totalCards);
    }
}

function highLightDifficulty(element) {
    let difficultyItems = document.querySelectorAll('.difficulty')
    difficultyItems.forEach(cards => cards.classList.remove('activeDifficulty'));
    element.classList.add('activeDifficulty');
}

function highLightAncient(element) {
    ancientCards.forEach(cards => cards.classList.remove('active'));
    element.classList.add('active');
}

function selectAncient(ancientId) {
    let ancient = ancientsData.find(ancient => ancient.id === ancientId);
    selectedAncient = JSON.parse(JSON.stringify(ancient));
}

function resetStates() {
    selectAncient(selectedAncient.id);

    blueCardArray = [];
    greenCardArray = [];
    brownCardArray = [];

    firstStepCardArray = [];
    secondStepCardArray = [];
    thirdStepCardArray = [];

    isFirstStageComplete = false;
    isSecondStageComplete = false;
    isThirdStageComplete = false;

    gameDeskCardArray = [];
}

function createCurrentState() {
    const currentState = document.createElement("div");
    currentState.classList.add('current-state');
    addStageContainersToCurrentState(currentState);
    deskContainer.append(currentState);
    createDesk();
    createLastCard();
}

function addStageContainersToCurrentState(currentState) {
    hiddenShuffleButton();
    createStageContainer(currentState, 'Первая стадия', 'stage_container_first', selectedAncient.firstStage);
    createStageContainer(currentState, 'Вторая стадия', 'stage_container_second', selectedAncient.secondStage);
    createStageContainer(currentState, 'Третья стадия', 'stage_container_third', selectedAncient.thirdStage);
}

function createStageContainer(currentState, spanText, stageContainerClass, stage) {

    const stageContainer = document.createElement("div");
    stageContainer.classList.add('stage-container');
    stageContainer.classList.add(stageContainerClass);

    currentState.append(stageContainer);

    const span = document.createElement("span");
    span.classList.add('stage-text');
    span.innerText = spanText;
    stageContainer.append(span);

    const divDotsContainer = document.createElement('div');
    divDotsContainer.classList.add('dots-container');
    stageContainer.append(divDotsContainer);

    const greenDot = document.createElement("div");
    greenDot.classList.add("dot");
    greenDot.classList.add("green");
    greenDot.textContent = stage.greenCards;
    divDotsContainer.append(greenDot);

    const brownDot = document.createElement("div");
    brownDot.classList.add("dot");
    brownDot.classList.add("brown");
    brownDot.textContent = stage.brownCards;
    divDotsContainer.append(brownDot);

    const blueDot = document.createElement("div");
    blueDot.classList.add("dot");
    blueDot.classList.add("blue");
    blueDot.textContent = stage.blueCards;
    divDotsContainer.append(blueDot);

}

function clearStageContainers() {
    const currentState = document.querySelector('.current-state')
    if (currentState) {
        currentState.remove();
    }
    const desk = document.querySelector('.desk')
    if (desk) {
        desk.remove();
    }
    const lastCard = document.querySelector('.last-card')
    if (lastCard) {
        lastCard.remove();
    }
}

function createDesk() {
    const div = document.createElement("div");
    div.classList.add('desk');
    div.addEventListener("click", getCard)
    div.addEventListener("click", updateDots)
    div.addEventListener("click", removeDeskWhenFinish)
    deskContainer.append(div);
}

function removeDeskWhenFinish() {
    if (isFirstStageComplete && isSecondStageComplete && isThirdStageComplete) {
        document.querySelector(".desk").remove();
        console.log(gameDeskCardArray);
    }
}

function updateDots() {
    updateFirstStageDots();
    updateSecondStageDots();
    updateThirdStageDots();
}

function updateFirstStageDots() {
    let firstStageDots = document.querySelector(".stage_container_first")
        .getElementsByClassName("dots-container")[0]
        .getElementsByClassName("dot");

    for (let dotElement of firstStageDots) {
        if (dotElement.classList.contains("green")) {
            dotElement.textContent = selectedAncient.firstStage.greenCards;
        }
        if (dotElement.classList.contains("brown")) {
            dotElement.textContent = selectedAncient.firstStage.brownCards;
        }
        if (dotElement.classList.contains("blue")) {
            dotElement.textContent = selectedAncient.firstStage.blueCards;
        }
    }
}

function updateSecondStageDots() {
    let secondStageDots = document.querySelector(".stage_container_second")
        .getElementsByClassName("dots-container")[0]
        .getElementsByClassName("dot");

    for (let dotElement of secondStageDots) {
        if (dotElement.classList.contains("green")) {
            dotElement.textContent = selectedAncient.secondStage.greenCards;
        }
        if (dotElement.classList.contains("brown")) {
            dotElement.textContent = selectedAncient.secondStage.brownCards;
        }
        if (dotElement.classList.contains("blue")) {
            dotElement.textContent = selectedAncient.secondStage.blueCards;
        }
    }
}

function updateThirdStageDots() {
    let thirdStageDots = document.querySelector(".stage_container_third")
        .getElementsByClassName("dots-container")[0]
        .getElementsByClassName("dot");

    for (let dotElement of thirdStageDots) {
        if (dotElement.classList.contains("green")) {
            dotElement.textContent = selectedAncient.thirdStage.greenCards;
        }
        if (dotElement.classList.contains("brown")) {
            dotElement.textContent = selectedAncient.thirdStage.brownCards;
        }
        if (dotElement.classList.contains("blue")) {
            dotElement.textContent = selectedAncient.thirdStage.blueCards;
        }
    }
}

function getCard() {
    let card;
    if (!isFirstStageComplete) {
        card = getFirstStageCard();
    } else if (!isSecondStageComplete) {
        card = getSecondStageCard();
    } else if (!isThirdStageComplete) {
        card = getThirdStageCard();
    }
    showCard(card);
}

function showCard(card) {
    if (card) {
        let lastCard = document.querySelector(".last-card");
        lastCard.style.backgroundImage = "url(" + card.imgSource + ")";
    }
}

function getFirstStageCard() {
    let card;
    if (selectedAncient.firstStage.greenCards > 0) {
        card = greenCardArray.pop();
        firstStepCardArray.push(card);
        selectedAncient.firstStage.greenCards = selectedAncient.firstStage.greenCards - 1;
    } else if (selectedAncient.firstStage.blueCards > 0) {
        card = blueCardArray.pop();
        firstStepCardArray.push(card);
        selectedAncient.firstStage.blueCards = selectedAncient.firstStage.blueCards - 1;
    } else if (selectedAncient.firstStage.brownCards > 0) {
        card = brownCardArray.pop();
        firstStepCardArray.push(card);
        selectedAncient.firstStage.brownCards = selectedAncient.firstStage.brownCards - 1;
    }
    if (selectedAncient.firstStage.greenCards === 0 && selectedAncient.firstStage.blueCards === 0 && selectedAncient.firstStage.brownCards === 0) {
        isFirstStageComplete = true;
        shuffleArray(firstStepCardArray);
        gameDeskCardArray.unshift(...firstStepCardArray);
        let stageText = document.querySelector(".stage_container_first").getElementsByClassName('stage-text')[0];
        stageText.classList.add("red");
    }
    return card;
}

function getSecondStageCard() {
    let card;
    if (selectedAncient.secondStage.greenCards > 0) {
        card = greenCardArray.pop();
        secondStepCardArray.push(card);
        selectedAncient.secondStage.greenCards = selectedAncient.secondStage.greenCards - 1;
    } else if (selectedAncient.secondStage.blueCards > 0) {
        card = blueCardArray.pop();
        secondStepCardArray.push(card);
        selectedAncient.secondStage.blueCards = selectedAncient.secondStage.blueCards - 1;
    } else if (selectedAncient.secondStage.brownCards > 0) {
        card = brownCardArray.pop();
        secondStepCardArray.push(card);
        selectedAncient.secondStage.brownCards = selectedAncient.secondStage.brownCards - 1;
    }
    if (selectedAncient.secondStage.greenCards === 0 && selectedAncient.secondStage.blueCards === 0 && selectedAncient.secondStage.brownCards === 0) {
        isSecondStageComplete = true;
        shuffleArray(secondStepCardArray);
        gameDeskCardArray.unshift(...secondStepCardArray);

        let stageText = document.querySelector(".stage_container_second").getElementsByClassName('stage-text')[0];
        stageText.classList.add("red");
    }
    return card;
}

function getThirdStageCard() {
    let card;
    if (selectedAncient.thirdStage.greenCards > 0) {
        card = greenCardArray.pop();
        thirdStepCardArray.push(card);
        selectedAncient.thirdStage.greenCards = selectedAncient.thirdStage.greenCards - 1;
    } else if (selectedAncient.thirdStage.blueCards > 0) {
        card = blueCardArray.pop();
        thirdStepCardArray.push(card);
        selectedAncient.thirdStage.blueCards = selectedAncient.thirdStage.blueCards - 1;
    } else if (selectedAncient.thirdStage.brownCards > 0) {
        card = brownCardArray.pop();
        thirdStepCardArray.push(card);
        selectedAncient.thirdStage.brownCards = selectedAncient.thirdStage.brownCards - 1;
    }
    if (selectedAncient.thirdStage.greenCards === 0 && selectedAncient.thirdStage.blueCards === 0 && selectedAncient.thirdStage.brownCards === 0) {
        isThirdStageComplete = true;
        shuffleArray(thirdStepCardArray);
        gameDeskCardArray.unshift(...thirdStepCardArray);
        let stageText = document.querySelector(".stage_container_third").getElementsByClassName('stage-text')[0];
        stageText.classList.add("red");
    }
    return card;
}

function createLastCard() {
    const div = document.createElement("div");
    div.classList.add('last-card');
    deskContainer.append(div);
}

function hiddenShuffleButton() {
    const element = document.querySelector(".shuffle-button");
    element.remove();
    isCreateShuffleButton = false;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}