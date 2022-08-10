class Turns {
    constructor (timerId, time, amountOfTurns, turnIs) {
        this.timerId = timerId;
        this.time = time;
        this.amountOfTurns = amountOfTurns;
        this.turnIs = turnIs;// 1 - player, 0 - opponent
    }

    countSeconds(duration, playerLogin, opponentLogin) {
        this.timerId = setInterval(() => {
            document.querySelector('#timer').innerHTML = this.time;
    
            if (this.time === duration) {
                clearInterval(timerId);
                this.time = 0;
                
                socket.send(JSON.stringify({
                    event : 'changeTurn',
                    login : playerLogin,
                    opponentLogin : opponentLogin,
                    turn : this.turnIs
                }));
            }
            this.time++;
        }, 1000);
    };

    setTurn (turn, playerLogin, opponentLogin, manaOb) {
        this.turnIs = turn;
        this.time = 0;

        if (this.turnIs == 1) {
            this.amountOfTurns++;
            if (this.amountOfTurns <= 10) {
                let manaArr = manaOb.mana.innerHTML.split('/');
                manaArr[0] = this.amountOfTurns;
                manaArr[1] = this.amountOfTurns;
                manaOb.mana.innerHTML = manaArr.join('/');
            }
            else {
                let manaArr = manaOb.mana.innerHTML.split('/');
                manaArr[0] = 10;
                manaArr[1] = 10;
                manaOb.mana.innerHTML = manaArr.join('/');
            }
            document.querySelector('#turn-btn').innerHTML = 'Finish turn';
            this.countSeconds(10, playerLogin, opponentLogin);
            
        }
        else {
            document.querySelector('#turn-btn').innerHTML = 'Enemy turn';
            clearInterval(this.timerId);
            document.querySelector('#timer').innerHTML = '';
        }
        manaOb.addMana();
    };

    changeTurn (playerLogin, opponentLogin) {
        if (!this.turnIs) {
            return;
        }
        
        clearInterval(this.timerId);
        this.time = 0;
        this.turnIs = 0;
        socket.send(JSON.stringify({
            event : 'changeTurn',
            login : playerLogin,
            opponentLogin : opponentLogin,
            turn : this.turnIs
        }));
    };
}

