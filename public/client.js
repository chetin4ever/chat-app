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
/* viedo chat*/
// get the local video and display it with permission
function getLVideo(callbacks) {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
  var contriants = {
    audio: true,
    video: true,
  }
  navigator.getUserMedia(contriants, callbacks.success, callbacks.error)
}
function recStream(stream, elemid) {
  var video = document.getElementById(elemid)
  video.srcObject = stream
  window.peer_stream = stream
}
getLVideo({
  success: function (stream) {
    window.localstream = stream
    recStream(stream, "lVideo")
  },
  error: function (err) {
    alert("cannot acess your camera")
    console.log(err)
  },
})

var conn
var peer_id
// create peer connection with peer object

var peer = new Peer()

// display peer id on dom
// here open and connection are event
peer.on("open", function () {
  document.getElementById("disID").innerHTML = peer.id
  console.log(peer.id)
})
peer.on("connection", function (connection) {
  conn = connection
  peer_id = connection.peer
  document.getElementById("connId").value = peer_id
})
peer.on("error", function (err) {
  alert("an error happened" + err)
  console.log(err)
})
//  onclick with connection button === expose ice info
document.getElementById("conn_button").addEventListener("click", function (e) {
  e.preventDefault()
  peer_id = document.getElementById("connId").value

  if (peer_id) {
    conn = peer.connect(peer_id)
    // conn = peer.connect(peer_id)
    console.log(conn + "heloo")
  } else {
    alert("enter an ID")
    return false
  }
})
// call on click (create and answer the call)
peer.on("call", function (call) {
  var acceptCall = confirm("Do you want answer the call???")
  if (acceptCall) {
    call.answer(window.localstream)
    call.on("stream", function (stream) {
      window.peer_stream = stream
      recStream(stream, "rVideo")
    })
    call.on("close", function () {
      alert("the call has behind")
    })
  } else {
    console.log("call deined")
  }
})
// ask for call
document.getElementById("call_button").addEventListener("click", function (e) {
  e.preventDefault()
  console.log("calling a peer" + peer_id)
  console.log(peer)

  var call = peer.call(peer_id, window.localstream)
  call.on("stream", function (stream) {
    window.peer_stream = stream
    recStream(stream, "rVideo")
  })
})
