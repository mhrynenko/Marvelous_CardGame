class Opponent {
    constructor (login, chosenCards, fieldCards, fieldCardsName) {
        this.login = login;
        this.chosenCards = chosenCards;
        this.fieldCards = fieldCards;
        this.fieldCardsName = fieldCardsName;
    }

    showCardsInHand (cardNumber, player) {
        let ul;
        if (cardNumber == 1) {
            ul = document.createElement('ul');
            ul.setAttribute('id', 'enemycardhand');
            document.querySelector(`#enemyhand-div`).appendChild(ul);
        }
        else {
            ul = document.querySelector('#enemycardhand');
        }
        
        let li = document.createElement('li');
        li.setAttribute('class','enemyCard');
        li.setAttribute('id', cardNumber);
        li.textContent = cardNumber;
    
        ul.appendChild(li);
        this.chosenCards.push(cardNumber);
    
        if (player.chosenCards.length == 5 && this.chosenCards.length == 5) {
            socket.send (JSON.stringify({
                event : 'getFirst',
                login : player.login,
                opponentLogin : this.login,
            }))
        }
    };

    showCardInField (card, cardNumber) {
        let li = document.createElement('li');
        li.setAttribute('class','card');
        li.setAttribute('id', `${card.name}-enemyfield`);    
        
        let cardart = document.createElement('img');
        cardart.setAttribute('id', `${card.name}-enemyfield-cardart`);
        let ulr = card.image.toString();
        cardart.src = ulr;
        li.appendChild(cardart);

        let rarity = document.createElement('span');
        rarity.setAttribute('id', `${card.name}-enemyfield-rarity`);
        rarity.textContent = card.rarity;
        li.appendChild(rarity);

        let description = document.createElement('span');
        description.setAttribute('id', `${card.name}-enemyfield-description`);
        description.textContent = card.name;
        li.appendChild(description);

        let damage = document.createElement('span');
        damage.setAttribute('id', `${card.name}-enemyfield-damage`);
        damage.textContent = card.damage;
        li.appendChild(damage);
    
        let healthpoints = document.createElement('span');
        healthpoints.setAttribute('id', `${card.name}-enemyfield-healthpoints`);
        healthpoints.textContent = card.healthpoints;
        li.appendChild(healthpoints);

        li.style.backgroundImage = `url(${card.image})`;
     
        document.querySelector('#enemycardhand').removeChild(document.getElementById(cardNumber));
        this.chosenCards.splice(this.chosenCards.indexOf(cardNumber), 1, 'deleted');
        document.querySelector('#enemyfield-div').appendChild(li);

        card.name = `${card.name}-enemyfield`;
        this.fieldCards.push(card);
        this.fieldCardsName.push(card.name);
    }

    reduceHeroHp (heroHP, playerLogin) {
        document.querySelector('#enemyheroHealthpoints').innerHTML = heroHP;
    
        if (document.querySelector('#enemyheroHealthpoints').innerHTML <= 0) {
            socket.send(JSON.stringify({
                event : 'finish',
                winner : playerLogin,
                looser : this.login
            }));
        }
    }

    checkDeleted () {
        for (let i = 0; i < this.chosenCards.length; i++) {
            if (this.chosenCards[i] !== 'deleted') {
                return false;
            }
        }
        return true;
    }

    reduceCardHp (opponentCard, playerLogin) {
        let index = indexOfByName(this.fieldCards, opponentCard.name)
        if (index !== -1) {
            this.fieldCards[index] = opponentCard;
        }

        if (opponentCard.healthpoints <= 0) {
            document.querySelector(`#enemyfield-div`).removeChild(document.querySelector(`#${opponentCard.name}`));
            this.fieldCards.splice(indexOfByName(this.fieldCards, opponentCard.name), 1);
            this.fieldCardsName.splice(this.fieldCardsName.indexOf(opponentCard.name), 1);
            if (this.chosenCards.length === 12 && this.checkDeleted() && this.fieldCardsName.length === 0) {
                socket.send(JSON.stringify({
                    event : 'finish',
                    winner : playerLogin,
                    looser : this.login
                }));
            }
        }
        else {
            const opponentCardHp = document.querySelector(`#${opponentCard.name}-healthpoints`);
            opponentCardHp.innerHTML = opponentCard.healthpoints;
        }
    }

}

