let socket = new WebSocket(`ws://${location.host}`);
const urlParams = new URLSearchParams(window.location.search);

let timerId;
let turnIs;

const mana = new Mana (document.querySelector('#mana'));
const player = new Player(urlParams.get('login'), 0, 0, [], [], []);
const opponent = new Opponent(urlParams.get('opponentLogin'), [], [], []);
const turn = new Turns(timerId, 0, 0, turnIs);

//leaves only name in form "heroname-where", without damage, hp, etc
const leaveOnlyName = (nameArr) => {
    if (nameArr.length >= 2) {
        return `${nameArr[0]}-${nameArr[1]}`;
    }
    return null;
}

window.addEventListener('mousedown', (event) => {
    let clear_name = leaveOnlyName(event.target.id.split('-'));
    
    // Drop cards in gamefield
    if (includesInArrByName(player.chosenCards, clear_name) && turn.turnIs === 1) {
        const cardToMove = document.querySelector(`#${clear_name}`);

        if (cardToMove && (mana.mana.innerHTML.split('/')[0] - getFromArrByName(player.chosenCards, clear_name).rarity >= 0)) {
            const myField = document.querySelector('#myfield-div');

            cardToMove.ondragstart = (ev) => {
                if (cardToMove.id.split('-')[1] === 'playerhand' && turn.turnIs === 1) {
                    myField.classList.add("border");
                }
            };
            cardToMove.ondragend = (ev) => {
                if (cardToMove.id.split('-'[1] === 'playerhand')) {
                    myField.classList.remove("border");
                }
            };

            myField.ondragover = (ev) => {
                if (ev.target.id === 'myfield-div' && includesInArrByName(player.chosenCards, cardToMove.id) && turn.turnIs === 1) {
                    ev.preventDefault();
                }
            };

            myField.ondrop = (ev) => {
                if (ev.target.id === 'myfield-div' && includesInArrByName(player.chosenCards, cardToMove.id) && turn.turnIs === 1) {
                    mana.reduceCounter (getFromArrByName(player.chosenCards, clear_name).rarity);
                    
                    player.fieldCards.push(structuredClone(player.chosenCards[indexOfByName(player.chosenCards, clear_name)]));
                    player.fieldCards[indexOfByName(player.fieldCards, clear_name)].dropped = turn.amountOfTurns;
                    player.fieldCards[indexOfByName(player.fieldCards, clear_name)].name = `${clear_name.split('-')[0]}-playerfield`;

                    //rename middle part for hp, damage, rarity
                    for (let i = 0; i < cardToMove.children.length; i++) {
                        let newId = cardToMove.children[i].id.split('-');
                        newId.splice(1, 1, 'playerfield');
                        cardToMove.children[i].id = newId.join('-');
                    }
                    cardToMove.id = `${clear_name.split('-')[0]}-playerfield`;

                    myField.append(cardToMove);

                    cardToMove.animate([
                        { transform:'scale(0.1)', opacity: 0, color: "#fff"},
                          { transform:'scale(1)',opacity: 1, color: "#000"}
                        ], {duration: 700,});

                    socket.send (JSON.stringify({
                        event : 'playerPutCardOnField',
                        login : player.login,
                        opponentLogin : opponent.login,
                        cardName : cardToMove.id.split('-')[0],
                        cardNumber : (indexOfByName(player.chosenCards, `${cardToMove.id.split('-')[0]}-playerhand`) + 1)
                    }))
                    player.chosenCards.splice(indexOfByName(player.chosenCards, `${cardToMove.id.split('-')[0]}-playerhand`), 1, 'deleted');
                }
                
            };
        }
    }

    //Bite enemy cards 
    if (includesInArrByName(player.fieldCards, clear_name)) {
        const playerCard = player.fieldCards[indexOfByName(player.fieldCards, clear_name)];

        document.querySelector(`#${clear_name}`).ondragstart = (ev) => {
            if (document.querySelector(`#${clear_name}`).id.split('-')[1] === 'playerfield' &&
                turn.turnIs == 1 && playerCard.dropped !== turn.amountOfTurns &&
                playerCard.attacked !== turn.amountOfTurns) {
                if (opponent.fieldCards.length === 0) {
                    document.querySelector(`#enemyheroHealthpoints`).classList.add("border");
                }
                else {
                    opponent.fieldCardsName.forEach((element, index, arr) => {
                        document.querySelectorAll(`#${element}`).forEach((el, ind, arr) => {
                            el.classList.add("border");
                        });
                    });
                }
            }
        };
        document.querySelector(`#${clear_name}`).ondragend = (ev) => {
            if (document.querySelector(`#${clear_name}`).id.split('-')[1] === 'playerfield') {
                if (opponent.fieldCards.length === 0) {
                    document.querySelector(`#enemyheroHealthpoints`).classList.remove("border");
                }
                else {
                    opponent.fieldCardsName.forEach((element, index, arr) => {
                        document.querySelectorAll(`#${element}`).forEach((el, ind, arr) => {
                            el.classList.remove("border");
                        });
                    });
                }
            }
        };
        
        opponent.fieldCardsName.forEach((element, index, arr) => {
            document.querySelectorAll(`#${element}`).forEach((el, ind, arr) => {
                el.ondragover = (ev) => {
                    if (turn.turnIs == 1 &&
                        playerCard.dropped !== turn.amountOfTurns &&
                        playerCard.attacked !== turn.amountOfTurns){
                        ev.preventDefault();
                    }
                };
                
            });

            document.querySelectorAll(`#${element}`).forEach((el, index, arr) => {
                el.ondrop = (ev) => {
                    if (turn.turnIs == 1 &&
                        playerCard.dropped !== turn.amountOfTurns &&
                        playerCard.attacked !== turn.amountOfTurns) {

                        playerCard.attacked = turn.amountOfTurns;
                        let opponentCardName = leaveOnlyName(ev.target.id.split('-'));
                        const opponentCard = getFromArrByName(opponent.fieldCards, opponentCardName);

                        document.querySelector(`#${opponentCardName}`).animate([
                            { transform:'translate3d(-30px, 0, 0)'},
                            { transform:'translate3d(30px, 0, 0)'},
                            { transform:'translate3d(0px, 0, 0)'}
                            ], {duration: 300,});
                        socket.send(JSON.stringify({
                            event : 'hitOpponent',
                            login : player.login,
                            opponentLogin : opponent.login,
                            playerCard : getFromArrByName(player.fieldCards, clear_name),
                            opponentCard : opponentCard,
                        }));
                    }
                }
            });
        });

        // Bite enemy hero
        const enemyhero = document.querySelector(`#enemyhero`);
        enemyhero.ondragover = (ev) => {
            if (turn.turnIs == 1 && opponent.fieldCards.length === 0 &&
                playerCard.dropped !== turn.amountOfTurns &&
                playerCard.attacked !== turn.amountOfTurns) {
                ev.preventDefault();
            }
        };

        enemyhero.ondrop = (ev) => {
            if (turn.turnIs == 1 && opponent.fieldCards.length === 0 &&
                playerCard.dropped !== turn.amountOfTurns &&
                playerCard.attacked !== turn.amountOfTurns) {

                playerCard.attacked = turn.amountOfTurns;
                document.querySelector(`#enemyheroHealthpoints`).animate([
                    { transform:'translate3d(-30px, 0, 0)'},
                    { transform:'translate3d(30px, 0, 0)'},
                    { transform:'translate3d(0px, 0, 0)'}
                    ], {duration: 300,});

                socket.send(JSON.stringify({
                    event : 'hitHero',
                    login : player.login,
                    opponentLogin : opponent.login,
                    playerCard : getFromArrByName(player.fieldCards, clear_name),
                    enemyheroHealthpoints : document.querySelector(`#enemyheroHealthpoints`).innerHTML
                }));
            }
        };
    }
});

window.addEventListener('click', (event) => {
    if (turn.turnIs !== 1) {
        return;
    }

    if (event.target.id === `extracard-${player.extraCardCounter + 1}`) {
        if (player.extraCardTurn === turn.amountOfTurns) {
            return;
        }
        socket.send(JSON.stringify({
            event : 'getExtraCard',
            login : player.login,
            opponentLogin : opponent.login,
            cardsAmount : player.chosenCards.length + 1
        }));
    }
});

socket.addEventListener('open', (event) => {
    socket.send(JSON.stringify({
        event : 'loggedInBattlePage',
        login : player.login
    }));

    console.log("Connected to a battle page");
});

socket.addEventListener('message', (answer) => {
    let message = JSON.parse(answer.data);

    switch(message.event){
        case 'hitedOpponent':
            opponent.reduceCardHp(message.opponentCard, player.login);
        break;

        case 'hitedByOpponent':
            player.reduceCardHp(message.playerCard);
        break

        case 'hitedOpponentHero':
            opponent.reduceHeroHp(message.heroHealthpoints, player.login);
        break;

        case 'hitedByOpponentHero':
            player.reduceHeroHp(message.heroHealthpoints);
        break

        case 'chooseCards':
            player.showCardsInCardChooser(message.randomCards);
        break;

        case 'randomExtraCard':
            player.getExtraCard(message.card, turn.amountOfTurns);
        break;

        case 'opponentChooseOneCard':
            opponent.showCardsInHand(message.cardsAmount, player);
        break;

        case 'opponentGetExtraCard':
            opponent.showCardsInHand(message.cardsAmount, player);
        break;

        case 'opponentPutCardOnField':
            opponent.showCardInField(message.card, message.cardNumber);
        break;

        case 'isFirst':
            turn.setTurn(message.first, message.login, message.opponentLogin, mana);
        break;

        case 'isntFirst':
            turn.setTurn(message.first, message.login, message.opponentLogin, mana);
        break;

        case 'notPlayerTurn':
            turn.setTurn(message.turn, message.login, message.opponentLogin, mana);
        break;

        case 'playerTurn':
            turn.setTurn(message.turn, message.login, message.opponentLogin, mana);
        break;

        case 'win':
            finishAsWinner();
        break;

        case 'loose':
            finishAsLooser();
        break;

        default:
        break;
    }
});

socket.addEventListener('close', (event) => {
    console.log("Disconnected from a battle page");
});

function finishAsWinner() {
    clearInterval(turn.timerId);
    clearInterval(mana.timerId);
    document.querySelector('#timer').innerHTML = '';
    document.querySelector('#mana').innerHTML = '';
    document.querySelector('#finishing-div').style.display = 'block';
    document.querySelector('#gameResult').innerHTML = "YOU WIN!!!!!!!!";
    document.querySelector('#gameResult').classList.add("animate-win");
}

function finishAsLooser() {
    clearInterval(turn.timerId);
    clearInterval(mana.timerId);
    document.querySelector('#timer').innerHTML = '';
    document.querySelector('#mana').innerHTML = '';
    document.querySelector('#finishing-div').style.display = 'block';
    document.querySelector('#gameResult').innerHTML = "You Lose((((</br>But The Fight Goes On";
    document.querySelector('#gameResult').classList.add("animate-lose");

}

function returnToMainPage() {
    document.location = `/mainPage`;
}
