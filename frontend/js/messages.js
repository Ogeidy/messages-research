function send_message(event) {
    event.preventDefault();
    let id_token = sessionStorage.getItem("id_token")
    let formData = new FormData(send_form);
    let obj = {}
    formData.forEach((value, key) => obj[key] = value);
    console.log(obj);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "api/send-message");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", id_token);

    xhr.onload = function () {
        console.log('Answer: ' + this.responseText);
    }

    xhr.send(JSON.stringify(obj))
}

document.getElementById('send_form').addEventListener('submit', send_message);

function read_from_db() {
    let id_token = sessionStorage.getItem("id_token");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "api/read-from-db");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", id_token);

    xhr.onload = function () {
        console.log('Answer: ' + this.responseText);
        let resp = JSON.parse(this.responseText);
        document.getElementById("items_readed").innerHTML = ' Wrote items: ' + resp["n_items"];
    }

    xhr.send()
}

function read_from_sqs() {
    let id_token = sessionStorage.getItem("id_token")
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "api/read-from-sqs");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", id_token);

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
