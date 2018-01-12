var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('port',process.env.PORT || 3000);

var clients = [];
var id = 0;
io.on("connection",function(socket){
	var currentUser;

	socket.on("USER_CONNECT",function(){
		console.log("User connected");
		for(var i =0;i<clients.length;i++)
		{
			socket.emit("USER_CONNECTED",{id:id, name: clients[i].name, position : clients[i].position});
			console.log("User name "+clients[i].name+ "is connected");
		}
		
	});

	socket.on("PLAY",function(data)
	{

		console.log(data);
		currentUser = {
			id: id,
			name:data.name,
			position:data.position,
			yRotation:0,
			cameraAngle:0
		}
		id++;
		clients.push(currentUser);
		socket.emit("PLAY",currentUser);
		
		socket.broadcast.emit("USER_CONNECTED",currentUser);

	});

	socket.on("MOVE",function(data){

		//socket.emit("MOVE", data);
		socket.broadcast.emit("MOVE",data);
	});

	socket.on("disconnect",function(){
		socket.broadcast.emit("USER_DISCONNECTED",currentUser);
		for(var i = 0 ; i< clients.length;i++){
			if(clients[i].name == currentUser.name)
			{
				console.log("User "+clients[i].name+" disconnected");
				clients.splice(i,1);
			}
		}
	});

	socket.on("HIT",function(data)
	{
		
		socket.broadcast.emit("HIT",data);
		//console.log(data);
	});

	socket.on("KILL",function(data)
	{
		socket.broadcast.emit("KILL",data);
		
	});

	socket.on("SPAWN",function(data)
	{
		
		socket.broadcast.emit("SPAWN",data);
		console.log(data);
	});

});


server.listen(app.get('port'),function(){
	console.log("-------- SERVER IS RUNNING -------------");
});