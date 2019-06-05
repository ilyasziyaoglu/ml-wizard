var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

http.listen(5000, function(){
  console.log('listening on *:5000')
});

/*
io.on('connection', function(socket){
  socket.emit('print', "merhaba dünya!")

  socket.on('print-reply', function(reply){
      console.log(reply)
  })
})
*/