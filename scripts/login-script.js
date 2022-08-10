document.querySelector("#logForm").addEventListener('submit', (event) => {
    event.preventDefault();

    let span = document.querySelector('span');
    if (span.textContent != '') {
        span.textContent = '';
    }

    let inputs = new FormData(event.target);
    let formObj = Object.fromEntries(inputs);

    for (const key in formObj) {
        if (formObj[key] === "") {
            span.textContent = "There is an empty field";
            return;
        }
    }

    fetch("/login", { 
        method: "POST", 
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formObj)
    })
    .then(data => {
        if (!data.redirected) {
            data.json().then(answer => {
                document.querySelector("span").textContent = answer.result;
            });
        }
        else {
            document.location = '/mainPage';
        }
    })
    .catch(error => {
        console.error(error);
    });
})
