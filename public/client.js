const socket = io()
let name;
let textarea = document.querySelector('#textarea')
// let text= document.getElementById('textarea')
let messageArea = document.querySelector('.message__area')
let audio= new Audio('ringtone.mp3')
let send= document.getElementById('send')

audio.play();

// do {
    name = prompt('Please enter your name: ')
// } while(!name)

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

send.addEventListener('click', (e) => {
    if(textarea.value!=''){
        sendMessage(textarea.value)
}
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    if(type=='incoming'){
        audio.play();
        }
}

function joinChat(msg, type){
    let mainDiv = document.createElement('div')
    let className = type;
    mainDiv.classList.add(className, 'message')
    mainDiv.innerHTML = msg;
    messageArea.appendChild(mainDiv)



}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

socket.emit('new-user-joined', name)

socket.on('user-joined', name =>{
    joinChat(` ${name} joined the chat`, 'incoming');
    // console.log(`${name} joined the chat`)
})



socket.on('lefts', name =>{
    joinChat(`${name} left the chat`, 'incoming')
    // append(`${name} left the chat`, 'left');

})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



