import ancientsData from '../data/ancients.js';
import difficulties from '../data/difficulties.js';

const ancientsContainer = document.querySelector('.ancients-container');
createAncientsList();
const ancientCards = document.querySelectorAll('.ancient-card');
const difficultyContainer = document.querySelector('.difficulty-container');
const deskContainer = document.querySelector('.desk-container');


ancientCards.forEach(element => element.addEventListener('click', createDifficultyList));
ancientCards.forEach(element => element.addEventListener('click', () => highLightAncient(element)));
ancientCards.forEach(element => element.addEventListener('click', () => selectAncient(element)));

difficultyContainer.addEventListener('click', createShuffleButton);
difficultyContainer.addEventListener('click', clearStageContainers);


let isDifficultyListCreated = false;
let isCreateShuffleButton = false;
let selectedAncient;

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
            div.addEventListener('click', () => highLightDifficulty(div));
            difficultyContainer.append(div);
        });
    }
}

function createShuffleButton() {
    if (!isCreateShuffleButton) {
        isCreateShuffleButton = true;
        const span = document.createElement("span");
        span.classList.add('shuffle-button');
        span.innerText = 'Замешать колоду';
        span.addEventListener("click", createCurrentState);
        deskContainer.append(span);
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
    clearStageContainers();
    createShuffleButton();
}

function selectAncient(element) {
    selectedAncient = ancientsData.find(ancient => ancient.id === element.id);
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
    createStageContainer(currentState, 'Первая стадия', selectedAncient.firstStage);
    createStageContainer(currentState, 'Вторая стадия', selectedAncient.secondStage);
    createStageContainer(currentState, 'Третья стадия', selectedAncient.thirdStage);
}

function createStageContainer(currentState, spanText, stage) {

    const stageContainer = document.createElement("div");
    stageContainer.classList.add('stage-container');
    currentState.append(stageContainer);

    const span = document.createElement("span");
    span.classList.add('stage-text');
    span.innerText = 'Третья стадия';
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
    const elements = document.querySelector('.current-state')
    elements.remove();
    const desk = document.querySelector('.desk')
    desk.remove();
    const lastCard = document.querySelector('.last-card')
    lastCard.remove();
}

function createDesk() {
    const div = document.createElement("div");
    div.classList.add('desk');
    deskContainer.append(div);
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

function playingGame() {


}