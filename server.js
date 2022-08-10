const express = require('express')
const path = require('path');
var cookieParser = require('cookie-parser');
const WebSocket = require('ws');

const loginRouter = require('./routes/login-routes');
const logoutRouter = require('./routes/logout-routes');
const mainPageRouter = require('./routes/mainPage-routes');
const battlePageRouter = require('./routes/battlePage-routes');
const registrationRouter = require('./routes/registration-routes');
const remindRouter = require('./routes/remind-routes');
const Hero = require('./models/hero.js');
const { getFromArrByName } = require('./helpers/arrayFuncs');
const { getRandomFromArrWithoutCurrent, getRandomArrFromArr, getRandomInt } = require('./helpers/getRandom');

const app = express();
const port = 8000;
const server = require('http').createServer(app);
const wss = new WebSocket.Server({server:server});

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json())
app.use(cookieParser())

app.use(loginRouter);
app.use(logoutRouter);
app.use(mainPageRouter);
app.use(battlePageRouter);
app.use(registrationRouter);
app.use(remindRouter);

let loggedInUseres = new Map();
let findingRandomBattlePlayers = [];
let heroesFromDb = [];
let first = getRandomInt(2);

let heroDb = new Hero('heroes'); 
async function getHeroes () {
    let amount = await heroDb.getRaws('id');
    for (let i = 1; i <= amount; i++) {
        const hero = await heroDb.find(i, 'id');
        heroesFromDb.push(hero);
    }

    for (const heroObj of heroesFromDb) {
        heroObj.dropped = -1;    //turn when card was dropped
        heroObj.attacked = -1;   //turn when card attacked last time
    }
    
    console.log('DB IS LOADED');
}
getHeroes();

wss.on('connection', (ws) => {
    // console.log('someone connected!');

    ws.send(JSON.stringify({
        message : 'connected'
    }));

    ws.on('message', async (message) => {
        message = JSON.parse(message);

        switch(message.event){
            case 'loggedIn':
                loggedInUseres.set(message.login, Array.from(wss.clients.values()).pop());
            break;

            case 'loggedInBattlePage':
                loggedInUseres.set(message.login, Array.from(wss.clients.values()).pop());                

                loggedInUseres.get(message.login).send(JSON.stringify({
                    event : "chooseCards",
                    randomCards : getRandomArrFromArr(8, heroesFromDb)
                }));
            break;
        
            case 'randomBattle':
                if (!findingRandomBattlePlayers.includes(message.login)) {
                    findingRandomBattlePlayers.push(message.login);
                }

                let opponent = '';

                if (findingRandomBattlePlayers.length >= 2 ) {
                    opponent = getRandomFromArrWithoutCurrent(message.login, findingRandomBattlePlayers);
                }
                console.log('finding opponent for ' + message.login);

                if (opponent !== '') {
                    loggedInUseres.get(opponent).send(JSON.stringify({
                        event : "findOpponent",
                        opponentLogin : message.login
                    }));

                    loggedInUseres.get(message.login).send(JSON.stringify({
                        event : "findOpponent",
                        opponentLogin : opponent
                    }));
                
                    findingRandomBattlePlayers.splice(findingRandomBattlePlayers.indexOf(message.login));
                    findingRandomBattlePlayers.splice(findingRandomBattlePlayers.indexOf(opponent));
                }
            break;

            case 'playerChooseOneCard':
                loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                    event : 'opponentChooseOneCard',
                    cardsAmount : message.cardsAmount
                }))
            break;

            case 'getExtraCard':
                loggedInUseres.get(message.login).send(JSON.stringify({
                    event : 'randomExtraCard',
                    card : heroesFromDb[getRandomInt(heroesFromDb.length)]
                }));

                loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                    event : 'opponentGetExtraCard',
                    cardsAmount : message.cardsAmount
                }))
            break;

            case 'playerPutCardOnField':
                loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                    event : 'opponentPutCardOnField',
                    card : getFromArrByName(heroesFromDb, message.cardName),
                    cardNumber : message.cardNumber
                }))
            break;

            case 'getFirst':
                if (first) {
                    loggedInUseres.get(message.login).send(JSON.stringify({
                        event : 'isFirst',
                        first : first,
                        login : message.login,
                        opponentLogin : message.opponentLogin
                    }));
    
                    loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                        event : 'isntFirst',
                        first : 0,
                        login : message.opponentLogin,
                        opponentLogin : message.login
                    }))
                }
                else {
                    loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                        event : 'isFirst',
                        first : 1,
                        login : message.opponentLogin,
                        opponentLogin : message.login
                    }));
    
                    loggedInUseres.get(message.login).send(JSON.stringify({
                        event : 'isntFirst',
                        first : first,
                        login : message.login,
                        opponentLogin : message.opponentLogin
                    }))
                }
                
            break;

            case 'changeTurn':
                loggedInUseres.get(message.login).send(JSON.stringify({
                    event : 'notPlayerTurn',
                    turn : 0,
                    login : message.login,
                    opponentLogin : message.opponentLogin 
                }))

                loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                    event : 'playerTurn',
                    turn : 1,
                    login : message.opponentLogin,
                    opponentLogin : message.login
                }))
            break;

            case 'hitOpponent':
                message.opponentCard.healthpoints = message.opponentCard.healthpoints - message.playerCard.damage;

                loggedInUseres.get(message.login).send(JSON.stringify({
                    event : 'hitedOpponent',
                    playerCard : message.playerCard,
                    opponentCard : message.opponentCard
                }))
                
                message.playerCard.name = `${message.playerCard.name.split('-')[0]}-enemyfield`;
                message.opponentCard.name = `${message.opponentCard.name.split('-')[0]}-playerfield`;
                loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                    event : 'hitedByOpponent',
                    playerCard : message.opponentCard,
                    opponentCard : message.playerCard
                }))
                
            break;

            case 'finish':
                loggedInUseres.get(message.winner).send(JSON.stringify({
                    event : 'win',
                    winner : message.winner,
                    looser : message.looser
                }))

                loggedInUseres.get(message.looser).send(JSON.stringify({
                    event : 'loose',
                    winner : message.winner,
                    looser : message.looser
                }))
            break;

            case 'hitHero':
                message.enemyheroHealthpoints = message.enemyheroHealthpoints - message.playerCard.damage;
                
                loggedInUseres.get(message.login).send(JSON.stringify({
                    event : 'hitedOpponentHero',
                    heroHealthpoints : message.enemyheroHealthpoints
                }))
                
                loggedInUseres.get(message.opponentLogin).send(JSON.stringify({
                    event : 'hitedByOpponentHero',
                    heroHealthpoints : message.enemyheroHealthpoints
                }))
            break;

            default:
            break;
        }
        
        
    })
});

app.get('/', (req, res) => {
    // return res.sendFile(path.join(__dirname+'/views/mainPage.html'));

    if (req.cookies.status == undefined) {
        return res.sendFile(path.join(__dirname+'/views/login.html'));
    }
    else {
        return res.redirect('/mainPage');
    }
})
  
app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname+'/views/404.html'));
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


