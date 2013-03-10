var http = require("http");
var express = require("express");
var app = express();

app.set('views', __dirname + '/');
app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.session({secret:"some secret"}));

var online = 0;
var innerid = 0;

//List of users
var users = {};

//Post data received on /update uri
app.post("/update", function(req, res){
  console.log("Update req");
	checkSessionData(req);
	//Composing resulting json
	res.json({
		online : online
	});
});

//page opened
app.use("/", function(req, res){
	checkSessionData(req);
	res.render("index");
});

function checkSessionData( req ){
	//Check that we have user
	if(!req.session.userid){ //New user detected
		//New user data
		var id = innerid++;
		console.log("new user ", id);
		//User id add to session
		req.session.userid = id;
		online++;	
		//Set users self-destruction after 5 sec
		users[id] = setTimeout(function(){
			delete users[id];
			online--;
			console.log("deleting user ", id);
			req.session.destroy();
		}, 10*1000);
	}else{
		//User that we already had
		console.log("old user ", req.session.userid);
		clearTimeout(users[req.session.userid]);
		//Update self-destruction time
		users[req.session.userid] = setTimeout(function(){
			delete users[id];
			online--;
			console.log("deleting user ", req.session.userid);
			req.session.destroy();
		}, 10*1000);
	}
};	

//Create server
http.createServer(app).listen(80);
