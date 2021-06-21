const express = require("express")
const app = express()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const PORT = process.env.POST || 3000

http.listen(PORT, () => {
  console.log("server is running on:" + PORT)
  //   console.log(__dirname)
})
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})
app.use(express.static("public"))
io.on("connection", function (socket) {
  console.log("client connected at:" + socket.id)
  // getting data from client and send back to all client
  socket.on("userMessage", (data) => {
    io.sockets.emit("userMessage", data)
  })
  socket.on("userTyping", (data) => {
    socket.broadcast.emit("userTyping", data)
  })
})
