const getRandomFromArrWithoutCurrent = (current, arr) => {    
    let randomOpponent = getRandomInt(arr.length);
    while (arr[randomOpponent] === current) {
        randomOpponent = getRandomInt(arr.length);
    } 

    return arr[randomOpponent];
}

const getRandomArrFromArr = (amount, arr) => {
    let newArr = [];
    for (let i = 0; i < amount; i++) {
        let randomCard = getRandomInt(arr.length);
        while (newArr.includes(arr[randomCard])) {
            randomCard = getRandomInt(arr.length);
        } 
        newArr.push(arr[randomCard]);
    }
    return newArr;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

if (module) module.exports = {
    getRandomFromArrWithoutCurrent,
    getRandomArrFromArr,
    getRandomInt
}