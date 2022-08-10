class Mana {
    constructor (mana) {
        this.timerId = null;
        this.mana = mana;
        this.manaCounter = this.mana.innerHTML.split('/')[0];
    }

    addMana () {
        if (this.timerId != null) {
            return;
        }
        this.timerId = setInterval(this.raiseCounter, 5000);
    };
    
    raiseCounter () {
        let manaArr = this.mana.innerHTML.split('/');
        this.manaCounter = manaArr[0];
        if (this.manaCounter == manaArr[1]) {
            clearInterval(this.timerId);
            this.timerId = null;
            return;
        }

        this.manaCounter++;
        manaArr[0] = this.manaCounter;
        this.mana.innerHTML = manaArr.join('/');
    };

    reduceCounter (val) {
        let manaArr = this.mana.innerHTML.split('/');
        this.manaCounter = manaArr[0] - val;
        manaArr[0] = this.manaCounter;
        this.mana.innerHTML = manaArr.join('/');
    };
}

