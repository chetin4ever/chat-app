const socket = io()

// getting id
const message = document.getElementById("message")
const handle = document.getElementById("handle")
const output = document.getElementById("output")
const button = document.getElementById("button")
const typing = document.getElementById("typing")

socket.on("userTyping", (data) => {
  typing.innerHTML = "<p> <em>" + data + "is typing...</em></p>"
})

//emiting envent on button click and send to the server socket.io
button.addEventListener("click", (e) => {
  e.preventDefault()
  socket.emit("userMessage", {
    handle: handle.value,
    message: message.value,
  })
  document.getElementById("message").value = ""
})
// showing user is typing

message.addEventListener("keypress", () => {
  typing.innerHTML = ""
  socket.emit("userTyping", handle.value)
})

// outputing the chat data from client\
socket.on("userMessage", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.handle + " :</strong></p>" + data.message + "</p>"
})
