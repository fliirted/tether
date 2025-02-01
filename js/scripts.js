const ws = new WebSocket('ws://localhost:8080');
let previousUser = '';
let pressed = false;
let messageid = 0;

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
    ws.send(JSON.stringify({message, user, messageid}));
    document.getElementById('message').value = '';
  }
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);

  if (data.type === 'message') {
    const { user, message, messageid } = data.newMessage;
    rendMessage(user, message, messageid);
  } else if (data.type === 'history') {
    data.logs.forEach(({ user, message, messageid}) => {
      rendMessage(user, message, messageid);
    });
  }
};

function rendMessage(user, message, messageid) {
  const chatWrapper = document.createElement('div');
  const chatUser = document.createElement('p');
  const chatMessage = document.createElement('p');
  const reply = document.createElement('button')
  console.log(messageid)

  if (user === document.getElementById('user').value) {
    //my messages
    if (previousUser != user) {
      chatMessage.classList.add('mymessage');
    } else {
      chatMessage.classList.add('rmymessage');
    };
    chatWrapper.appendChild(chatMessage);
    chatMessage.innerText = message;
  } else {
    if (previousUser != user) {
      //others messages
      chatUser.classList.add('chatuser');
      chatWrapper.appendChild(chatUser);
      chatUser.innerText = user;

      chatMessage.classList.add('chatmessage');
      chatWrapper.appendChild(chatMessage);
      chatMessage.innerText = message;

      reply.classList.add('reply');
      chatMessage.appendChild(reply);
      reply.innerText = 'reply';
    } else {
      //repeat messages
      chatMessage.classList.add('rchatmessage');
      chatMessage.innerText = message;
      chatWrapper.appendChild(chatMessage);

      reply.classList.add('reply');
      chatMessage.appendChild(reply);
      reply.innerText = 'reply';
    };
  };

  previousUser = user

  if (user === document.getElementById('user').value) {
    chatWrapper.classList.add('mywrapper');
    chatWrapper.id = (`msg${messageid}`);
  } else {
    chatWrapper.classList.add('chatwrapper');
    chatWrapper.id = (`msg${messageid}`);
  };
  document.getElementById('messagewrapper').appendChild(chatWrapper);
  document.getElementById('messagewrapper').scrollTop = document.getElementById('messagewrapper').scrollHeight;
};