let socket = new WebSocket(`ws://${location.host}`);

function randomBattle() {
    socket.send(JSON.stringify({
        event : 'randomBattle',
        login : getCookie('login')
    }));
    document.querySelector('#loading-div').style.display = 'block';
}

socket.addEventListener('open', (event) => {
    socket.send(JSON.stringify({
        event : 'loggedIn',
        login : getCookie('login')
    }));
    console.log("Connected to the main page");
});

socket.addEventListener('close', (event) => {
    console.log("Disconnected from a main page");
});

socket.addEventListener('message', (answer) => {
    let message = JSON.parse(answer.data);

        switch(message.event){
            case 'findOpponent':
                document.querySelector('#loading-div').style.display = 'none';
                document.location = `/battlePage?login=${getCookie('login')}&opponentLogin=${message.opponentLogin}`;
            break;

            default:
            break;
        }
});
