const ws = new WebSocket('ws://localhost:8080');
let previousUser = '';
let pressed = false;

document.getElementById('message').addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !pressed) {
    sendMessage();
    pressed = true;
  }
});

document.getElementById('message').addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    pressed = false;
  }
});

function sendMessage() {
  if (document.getElementById('message').value.replace(/\s/g, '') != '' && document.getElementById('user').value.replace(/\s/g, '') != '') {
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;
    ws.send(JSON.stringify({message, user}));
    document.getElementById('message').value = '';
  }
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'message') {
    const { user, message } = data.newMessage;
    rendMessage(user, message);
  } else if (data.type === 'history') {
    data.logs.forEach(({ user, message }) => {
      rendMessage(user, message);
    });
  }
};

function rendMessage(user, message) {
  const chatWrapper = document.createElement('div');
  const chatUser = document.createElement('p');
  const chatMessage = document.createElement('p');

  if (user === document.getElementById('user').value) {
    if (previousUser != user) {
      chatMessage.classList.add('mymessage');
    } else {
      chatMessage.classList.add('rmymessage');
    };
    chatWrapper.appendChild(chatMessage);
    chatMessage.innerText = message;
  } else {
    if (previousUser != user) {
      chatUser.classList.add('chatuser');
      chatWrapper.appendChild(chatUser);
      chatUser.innerText = user;

      chatMessage.classList.add('chatmessage');
      chatWrapper.appendChild(chatMessage);
      chatMessage.innerText = message;
    } else {
      chatMessage.classList.add('rchatmessage');
      chatMessage.innerText = message;
      chatWrapper.appendChild(chatMessage);
    };
  };

  previousUser = user

  if (user === document.getElementById('user').value) {
    chatWrapper.classList.add('mywrapper');
  } else {
    chatWrapper.classList.add('chatwrapper');
  };
  document.getElementById('messagewrapper').appendChild(chatWrapper);
  document.getElementById('messagewrapper').scrollTop = document.getElementById('messagewrapper').scrollHeight;
};