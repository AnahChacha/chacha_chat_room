let usernamePage = document.querySelector('#username-page');
let chatPage = document.querySelector('#chat-page');
let usernameForm = document.querySelector('#usernameForm');
let messageForm = document.querySelector('#messageForm');
let messageInput = document.querySelector('#message');
let messageArea = document.querySelector('#messageArea');
let connectingElement = document.querySelector('.connecting');

let stompClient = event;
let username = null;

let colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'

]

//connecting
function connect(event) {
    event.preventDefault();
    username = document.querySelector('#name').value.trim();

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');


        document.querySelector('.sendBtn').click(function (e) {

            e.preventDefault();
            console.log("dfgdfgdfg");
            var sock = new SockJS('http://localhost:1111/topic/public');
            sock.onopen = function () {
                console.log('open');
                sock.send('test');
            };

            sock.onmessage = function (e) {
                console.log('message', e.data);
                sock.close();
            };

            sock.onclose = function () {
                console.log('close');
            };
        });

        stompClient.connect({}, onConnected(), onError());


    }
}

var sock = new SockJS('https://localhost:1111/web');
sock.onopen = function () {
    console.log('open');
    sock.send('test');
};

sock.onmessage = function (e) {
    console.log('message', e.data);
    sock.close();
};

sock.onclose = function () {
    console.log('close');
};


function onConnected(stompClient) {
//    subscribing to the public topic
    stompClient.subscribe('/topic/public', onMessageReceived);


    console.log("sdfghjkfd")
//    introducing your username to the server/why is this app on my nerves!!
    stompClient.send("/app/chat.addUser",
        {}, JSON.stringify({sender: username, messageType: 'JOIN'}))

    connectingElement.classList.add('hidden');
}

//errors
function onError(error) {
    error.preventDefault()
    connectingElement.textContent = 'Could not connect to the application.Please refresh this page to try again ';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    event.preventDefault();
    let messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageInput.value,
            messageType: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body);

    let messageElement = document.createElement('li');

    if (message.messageType === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + 'joined!';
    } else if (message.messageType === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + 'left!';
    } else {
        messageElement.classList.add('chat-message');

        let avatarElement = document.createElement('i');
        let avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        let usernameElement = document.createElement('span');
        let usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

    }

    let textElement = document.createElement('p');
    let messageText = document.createTextNode(message.content);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;

}

function getAvatarColor(messageSender) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    let index = Math.abs(hash % colors.length);
    return colors[index];
}


usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
