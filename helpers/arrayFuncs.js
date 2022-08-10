const indexOfByName = (array, name) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === name) {
            return i;
        }   
    }
    return -1;
}

const includesInArrByName = (array, name) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === name) {
            return true;
        }   
    }
    return false;
}

const getFromArrByName = (array, name) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === name) {
            return array[i];
        }
    }
    return -1;
}

if (module) module.exports = {
    indexOfByName,
    includesInArrByName,
    getFromArrByName
}