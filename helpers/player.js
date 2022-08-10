class Player {
    constructor(login, extraCardCounter, extraCardTurn, chosenCards, fieldCards, serverCards) {
        this.login = login;
        this.extraCardCounter = extraCardCounter;
        this.extraCardTurn = extraCardTurn;
        this.chosenCards = chosenCards;
        this.fieldCards = fieldCards;
        this.serverCards = serverCards;
    }

    showCardsInCardChooser (cards) {
        this.serverCards = cards.slice();
        let ul = document.createElement('ul');
        ul.setAttribute('id', 'cardchooser');
        document.querySelector(`#cardchooser-div`).appendChild(ul);
        document.querySelector(`#cardchooser-div`).style.display = 'block';
    
        cards.forEach((element, index, arr) => {
            let li = document.createElement('li');
            
            li.setAttribute('class','card');
            li.setAttribute('id', `${element.name}-chooser`);
            li.setAttribute('onclick', 'player.getChosenCard(this.id, opponent)')
    
            let cardart = document.createElement('img');
            cardart.setAttribute('id', `${element.name}-cardart`);
            let url = element.image.toString();
            cardart.src = url;
            li.appendChild(cardart);

            let rarity = document.createElement('span');
            rarity.setAttribute('id', `${element.name}-rarity`);
            rarity.textContent = element.rarity;
            li.appendChild(rarity);

            let description = document.createElement('span');
            description.setAttribute('id', `${element.name}-description`);
            description.textContent = element.name;
            li.appendChild(description);

            let damage = document.createElement('span');
            damage.setAttribute('id', `${element.name}-damage`);
            damage.textContent = element.damage;
            li.appendChild(damage);
    
            let healthpoints = document.createElement('span');
            healthpoints.setAttribute('id', `${element.name}-healthpoints`);
            healthpoints.textContent = element.healthpoints;
            li.appendChild(healthpoints);

            li.style.backgroundImage = `url(${element.image})`;
            li.style.backgroundSize = `100% 100%`;
            ul.appendChild(li);
        });
    }

    getChosenCard (cardName, opponent) {
        const heroName = cardName.split('-')[0];
        this.chosenCards.push(this.serverCards[indexOfByName(this.serverCards, heroName)]);
        this.chosenCards[indexOfByName(this.chosenCards, heroName)].name = `${heroName}-playerhand`;
    
        this.serverCards.splice(1, indexOfByName(this.serverCards, heroName));
        document.getElementById('cardchooser').removeChild(document.querySelector(`#${cardName}`));
    
        this.showCardsInHand(this.chosenCards[indexOfByName(this.chosenCards, `${heroName}-playerhand`)]);
    
        if (this.chosenCards.length >= 5) {
            document.querySelector(`#cardchooser-div`).removeChild(document.querySelector(`#cardchooser`));
            document.querySelector(`#cardchooser-div`).style.display = 'none';
            document.querySelector('#extraCards-div').style.display = 'block';
            this.serverCards = [];
    
            if (this.chosenCards.length == 5 && opponent.chosenCards.length == 5) {
                socket.send (JSON.stringify({
                    event : 'getFirst',
                    login : this.login,
                    opponentLogin : opponent.login,
                }))
            }  
        }
        
        socket.send (JSON.stringify({
            event : 'playerChooseOneCard',
            login : this.login,
            opponentLogin : opponent.login,
            cardsAmount : this.chosenCards.length
        }))
    }

    showCardsInHand (card) {
        let ul = document.querySelector('#cardhand');
    
        if (ul == null) {
            ul = document.createElement('ul');
            ul.setAttribute('id', 'cardhand');
            document.querySelector(`#myhand-div`).appendChild(ul);
        }
    
        let li = document.createElement('li');

        li.setAttribute('class','card');
        li.setAttribute('id', card.name);
        li.setAttribute('draggable', 'true');
        
        let cardart = document.createElement('img');
        cardart.setAttribute('id', `${card.name}-cardart`); 
        let ulr = card.image.toString();
        cardart.src = ulr;
        li.appendChild(cardart);

        let rarity = document.createElement('span');
        rarity.setAttribute('id', `${card.name}-rarity`);
        rarity.textContent = card.rarity;
        li.appendChild(rarity);

        let description = document.createElement('span');
        description.setAttribute('id', `${card.name}-description`);
        description.textContent = card.name.split('-')[0];
        li.appendChild(description);

        let damage = document.createElement('span');
        damage.setAttribute('id', `${card.name}-damage`);
        damage.textContent = card.damage;
        li.appendChild(damage);

        let healthpoints = document.createElement('span');
        healthpoints.setAttribute('id', `${card.name}-healthpoints`);
        healthpoints.textContent = card.healthpoints;
        li.appendChild(healthpoints);

        li.style.backgroundImage = `url(${card.image})`;

        ul.appendChild(li);
    };

    getExtraCard (card, turnCounter) {
        card.name = `${card.name}-playerhand`
        this.chosenCards.push(card);
        this.showCardsInHand(card);
        document.getElementById('extraCards-ul').removeChild(document.querySelector(`#extracard-${this.extraCardCounter + 1}`));
        this.extraCardCounter++;
        this.extraCardTurn = turnCounter;
    };

    reduceHeroHp (heroHP) {
        document.querySelector('#myheroHealthpoints').innerHTML = heroHP;
    };

    reduceCardHp (playerCard) {
        let index = indexOfByName(this.fieldCards, playerCard.name)
        if (index !== -1) {
            this.fieldCards[index] = playerCard;
        }

        if (playerCard.healthpoints <= 0) {
            document.querySelector(`#myfield-div`).removeChild(document.querySelector(`#${playerCard.name}`));
            this.fieldCards.splice(indexOfByName(this.fieldCards, playerCard.name), 1);
        }
        else {
            const playerCardHp = document.querySelector(`#${playerCard.name}-healthpoints`);
            playerCardHp.innerHTML = playerCard.healthpoints;
        }
    }
}

