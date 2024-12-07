const server = new WebSocket('wss://limechatt.derpygamer2142.com')
// const server = new WebSocket('ws://localhost:1050')

const msgInput = document.getElementById('msgInput')
const authorInput = document.getElementById('authorInput')
const sendBtn = document.getElementById("sendBtn")
const messageWall = document.getElementById('messageWall')

let connected = false

server.onmessage = msg => {

    if(!connected || server.readyState === WebSocket.CLOSED || server.readyState === WebSocket.CLOSING) return

    const parsedData = JSON.parse(msg.data)

    if(parsedData.type == 'message') {
        createMessage(parsedData.author, parsedData.content, msg.date ? new Date(msg.date) : new Date('11/13/1987'), parsedData.attachment ? parsedData.attachment : '')
    }

    if(parsedData.response) {
        parsedData.response.forEach(msg => {
            if(msg.type == 'message') {
                createMessage(msg.author, msg.content, msg.date ? new Date(msg.date) : new Date('11/13/1987'), parsedData.attachment ? parsedData.attachment : '')
            }
        })
    }
}

server.onclose = () => {
    connected = false
}

sendBtn.addEventListener('click', () => {
    if(!(msgInput.value).trim()) return
    try {
        server.send(JSON.stringify({"type": "sendMessage", "content": msgInput.value, "author": authorInput.value ? authorInput.value : 'User', 'date': new Date()}))
    } catch(error) {
        alert(error)
    }
})

server.onopen = () => {
    connected = true

    server.send(JSON.stringify({type: 'getMessages'}))
}

function createMessage(author, message, date = new Date('11/13/1987'), attachmentURI = '') {
    const messageElement = document.createElement('div')
    const titleHandler = document.createElement('div')
    const messageContent = document.createElement('h5')
    const dateTime = document.createElement('h6')
    const authorName = document.createElement('h4')

    dateTime.textContent = date.toLocaleTimeString()
    authorName.textContent = author
    messageContent.innerHTML = message

    messageElement.id = 'messageElement'
    titleHandler.id = 'titleHandler'

    titleHandler.appendChild(authorName)
    titleHandler.appendChild(dateTime)
    messageElement.prepend(messageContent)
    messageElement.prepend(titleHandler)

    if(attachmentURI) {
        const attachment = document.createElement('img')
        attachment.id = 'messageAttachment'
        attachment.src = attachmentURI
        messageElement.appendChild(attachment)
    }

    messageWall.prepend(messageElement)
}
