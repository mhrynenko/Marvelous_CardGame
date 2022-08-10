document.querySelector("#remForm").addEventListener('submit', (event) => {
    event.preventDefault();

    let errorSpan = document.querySelector('#errorSpan');
    if (errorSpan.textContent != '') {
        errorSpan.textContent = '';
    }
    let messageSpan = document.querySelector('#messageSpan');
    if (messageSpan.textContent != '') {
        messageSpan.textContent = '';
    }

    let inputs = new FormData(event.target);
    let formObj = Object.fromEntries(inputs);

    for (const key in formObj) {
        if (formObj[key] === "") {
            errorSpan.textContent = "There is an empty field";
            return;
        }
    }

    fetch("/remind", { 
        method: "POST", 
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formObj)
    })
    .then(response => {
        if (!response.ok){
            console.error(response);
        } 
        else {
            return response.json();
        }
    })
    .then(data => {
        if (data.result) {
            messageSpan.textContent = data.message;
        }
        else {
            errorSpan.textContent = data.message;
        }
    })
    .catch(error => {
        console.error(error);
    });
})
