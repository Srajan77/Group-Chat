const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinRoom', {username, room});


// get room users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users); 
})


socket.on('message', message =>{
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});


chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

   
    const msg = e.target.elements.msg.value;
    console.log(msg);

    socket.emit('chatMessage', msg);


    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})


function outputMessage(message){
    console.log(message);

    // we created a new div and output the message 
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span> </p>
    <p class="text">
			${message.text}
		</p>`;
    document.querySelector('.chat-messages').appendChild(div);                    

}


// Add room name to sidebar through DOM
function outputRoomName(room)
{
    roomName.innerText = room;

}

// Add room name to sidebar through DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;

}


document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});