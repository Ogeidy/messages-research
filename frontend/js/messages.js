function send_message(event) {
    event.preventDefault();
    let access_token = sessionStorage.getItem("access_token")
    let formData = new FormData(send_form);
    let obj = {}
    formData.forEach((value, key) => obj[key] = value);
    console.log(obj);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://e5uuaxgb1e.execute-api.us-east-2.amazonaws.com/send_message_function");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", access_token);

    xhr.onload = function () {
        console.log('Answer: ' + this.responseText);
    }

    xhr.send(JSON.stringify(obj))
}

document.getElementById('send_form').addEventListener('submit', send_message);

function read_from_db() {
    let access_token = sessionStorage.getItem("access_token");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://e5uuaxgb1e.execute-api.us-east-2.amazonaws.com/read_from_db_function");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", access_token);

    xhr.onload = function () {
        console.log('Answer: ' + this.responseText);
        let resp = JSON.parse(this.responseText);
        document.getElementById("items_readed").innerHTML = ' Wrote items: ' + resp["n_items"];
    }

    xhr.send()
}

function read_from_sqs() {
    let access_token = sessionStorage.getItem("access_token")
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://e5uuaxgb1e.execute-api.us-east-2.amazonaws.com/read_from_sqs_function");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", access_token);

    xhr.onload = function () {
        let messages_list = document.getElementById("messages_list");
        console.log('Answer: ' + this.responseText);
        let resp = JSON.parse(this.responseText);
        for (let msg of resp["messages"]) {
            console.log(msg);
            let item = document.createElement("li");
            let text = document.createTextNode(msg);
            item.appendChild(text);
            messages_list.appendChild(item)
        }
    }

    xhr.send()
}

function clear_ui() {
    let messages_list = document.getElementById("messages_list");
    while (messages_list.firstChild) {
        messages_list.removeChild(messages_list.firstChild);
    }
    document.getElementById("message").value = ""
    if (document.getElementById("items_readed").firstChild) {
        document.getElementById("items_readed").firstChild.remove()
    }
}
