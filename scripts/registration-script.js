document.querySelector("#regForm").addEventListener('submit', (event) => {
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

    if (formObj.password != formObj.confirmPassword) {
        span.textContent = "Passwords are not the same"
        return;
    }

    fetch("/register", { 
        method: "POST", 
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formObj)
    })
    .then(response => {
        if(!response.ok){
            console.error(response);
        } else {
            return response.text();
        }
    })
    .then(data => {
        if (data != "created") {
            document.querySelector("span").textContent = data;
        }
        else {
            alert('SUCCESSFULLY CREATED USER');
        }
    })
    .catch(error => {
        console.error(error);
    });
})