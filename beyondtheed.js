var counter = 0; 		//fun counter
var queue = [];			//current queue
var game = 1;			//current game
var queueOpen = true;	//queue open/closed status
var fs = require('fs')	//read and write required stuff
var yawncounter = 0;	//yawn counter

//checks if string is an integer
function isInt(value) {
  var x;
  return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

//save fun counter
function saveFun(){
	var dt = new Date().toLocaleString();
	var str = dt + " = " + counter + ' \n';
	fs.appendFile('fun.txt', str, function (err) {
		if (err) {
			// save failed
			console.log("fun.text save failed.");
		} 
	})
	//save for next time usage
	fs.writeFile('prev.txt', parseInt(counter, 10).toString(), (err) => {
		if (err){
			console.log("prev.text save failed.");
		} 
	});
	return 0;
}

//save yawn counter
function saveYawn(){
	var dt = new Date().toLocaleString();
	var str = dt + " = " + yawncounter + ' \n';
	fs.appendFile('yawn.txt', str, function (err) {
		if (err) {
			// save failed
			console.log("yawn.text save failed.");
		}
	})
	//save for next time usage
	fs.writeFile('prevyawn.txt', parseInt(yawncounter, 10).toString(), (err) => {
		if (err){
			console.log("prevyawn.text save failed.");
		}
	});
	return 0;
}

//used to check if a user has badges, otherwise will crash the bot. 
function isRealValue(obj)
{
	return obj && obj !== 'null' && obj !== 'undefined';
}

const tmi = require('tmi.js');

const options = {
	options: {
		debug: true,
	},
	connection: {
		cluster: 'aws',
		reconnect: true,
	},
	identity: {
		username: 'xxxxxxxxxxxxx',
		password: 'oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	},
	channels: ['beyondtheed'],
};

const client = new tmi.client(options);

client.connect();

client.on('connected', (address, port) => {
	//change username color
	client.say('beyondtheed', `/color Green`);
	
	//check previous fun and yawn counters
	var prev = false;
	if(fs.existsSync('prev.txt')) {
		var content = fs.readFileSync('prev.txt', 'utf-8');
		if(isInt(content)){
			counter = parseInt(content);
			prev = true;
		}
	}
	var prevyawn = false;
	if(fs.existsSync('prevyawn.txt')) {
		var content = fs.readFileSync('prevyawn.txt', 'utf-8');
		if(isInt(content)){
			yawncounter = parseInt(content);
			prevyawn = true;
		}
	}
	
	if(prev && prevyawn){
		client.say('beyondtheed', 'The BeyondJenBot Is Awake. The previous fun counter of ' + counter + ' and yawn counter of ' + yawncounter + ' have been loaded successfully. The list of commands for the Fun Bot are in: "!help". The list of commands for the Queue Bot are in: "!help2". The list of commands for the Game Bot are in "!help3". The list of commands for the Yawn Bot are in "!help4".');
	}
	else if(prev){
		client.say('beyondtheed', 'The BeyondJenBot Is Awake. The previous fun counter of ' + counter + ' has been successfully loaded, but the yawn counter cannot be loaded and is thus set to 0. The list of commands for the Fun Bot are in: "!help". The list of commands for the Queue Bot are in: "!help2". The list of commands for the Game Bot are in "!help3". The list of commands for the Yawn Bot are in "!help4".');
	}
	else if(prevyawn){
		client.say('beyondtheed', 'The BeyondJenBot Is Awake. The previous yawn counter of ' + yawncounter + ' has been successfully loaded, but the fun counter cannot be loaded and is thus set to 0. The list of commands for the Fun Bot are in: "!help". The list of commands for the Queue Bot are in: "!help2". The list of commands for the Game Bot are in "!help3". The list of commands for the Yawn Bot are in "!help4".');
	}
	else{
		client.say('beyondtheed', 'The BeyondJenBot Is Awake. The previous fun counter and yawn counter cannot be loaded, so both are set to 0. The list of commands for the Fun Bot are in: "!help". The list of commands for the Queue Bot are in: "!help2". The list of commands for the Game Bot are in "!help3". The list of commands for the Yawn Bot are in "!help4".');
	}
	
});

client.on('chat', (channel, user, message, self) => {
	
	//everybody, Fun Bot Commands
	if(message === '!help'){
		client.say('beyondtheed', 'Type "!fun" to add the fun counter by 1. Type "!fun <value>" to add the fun counter with a specific value. (Example: Type "!fun 2" to increment the counter by 2.) Type "!resetfun" to reset the fun counter to 0. Type "!setfun <value>" to set the fun counter to a specific value. (Example: Type "!setfun 6" to set the counter to 6.) Type "!currfun" to see the current fun counter. Type "!save" to manually save the fun counter. Type "!help2" to see more commands.');
	}
	
	//all Fun Bot commands
	
	//VIP and Jen, increments fun counter
	if (message.startsWith("!fun")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!fun' && isInt(input) && input >= 0){
				counter += parseInt(input);
				saveFun();
				client.say('beyondtheed', 'The fun counter has been incremented by ' + input + '. Fun Counter is now: ' + counter + '.');
			}
			else if(command === '!fun' && !input){
				counter++;
				saveFun();
				client.say('beyondtheed', 'The fun counter has been incremented. Fun Counter is now: ' + counter + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !fun command.");
		}
	}
	
	//VIP and Jen, resets fun counter
	if(message === '!resetfun'){
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			counter = 0;
			saveFun();
			client.say('beyondtheed', 'The fun counter has been reset. Fun Counter is now: ' + counter + '.');
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !resetfun command.");
		}
	}
	
	//VIP and Jen, manually sets fun counter
	if (message.startsWith("!setfun")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!setfun' && isInt(input) && input >= 0){
				counter = parseInt(input);
				saveFun();
				client.say('beyondtheed', 'The fun counter has been set to ' + input + '. Fun Counter is now: ' + counter + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !setfun command.");
		}
	}
	
	//Everybody, get current fun counter value
	if(message === '!currfun'){
		client.say('beyondtheed', 'Currently, the Fun Counter is at: ' + counter + '.');
	}
	
	//Jen only, save the fun and yawn counter
	if(message === '!save'){
		if(user["display-name"] === "beyondtheed"){
			//save to history
			saveFun();
			saveYawn();
			client.say("beyondtheed", "Saved.");
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !savefun command.");
		}
	}
	
	//All Queue Bot Commands
	
	//Everybody, Queue Bot Commands
	if(message === '!help2'){
		client.say('beyondtheed', 'Type "!add" to add yourself to the queue. Type "!remove" to remove yourself from the queue. Type "!queue" to see the current queue. Type "!next" to get the next player on the queue. Type "!removeall" to empty the queue. Type "!close" to close the queue and "!open" to open the queue. Type "!help3" to see more commands.');
	}
	
	//Everybody, Add User to Queue
	if(message === '!add'){
		if(queueOpen === true){
			if(!queue.includes(user["display-name"])){
				queue.push(user["display-name"]);
				client.say('beyondtheed', '@' + user["display-name"] + ' has been added to the queue in position ' + queue.length + '.');
			}
			else{
				client.say('beyondtheed', '@' + user["display-name"] + ' is already on the list.');
			}
		}
		else{
			client.say('beyondtheed', 'Sorry @' + user["display-name"] + ', the queue is currently closed.');
		}
	}
	
	//Everybody, Remove User From Queue
	if(message === '!remove'){
		if(queue.includes(user["display-name"])){
			queue = queue.filter(e => e !== user["display-name"]); 
			client.say('beyondtheed', '@' + user["display-name"] + ' has been removed from the queue.');
		}
		else{
			client.say('beyondtheed', '@' + user["display-name"] + ' is not in the queue.');
		}

	}
	
	//Everybody, Look at the current Queue.
	if(message === '!queue'){
		if(queue.length == 0){
			client.say('beyondtheed', 'The queue is currently empty.');			
		}
		else if(queue.length >= 1 && queue.length <= 10){
			client.say('beyondtheed', 'There are currently ' + queue.length + ' user(s) in the queue. The next user(s) on the queue are ' + queue.join(', ') + '.');
		}
		else{
			var spliced_queue = queue.slice(0, 10);
			client.say('beyondtheed', 'There are currently ' + queue.length + ' user(s) in the queue. The next 10 users on the queue are ' + spliced_queue.join(', ') + ' and more user(s) not listed.');
		}
	}
	
	//Jen only. Get next player. 
	if(message === '!next'){
		if(user["display-name"] === "beyondtheed"){
			if(queue.length == 0){
				client.say('beyondtheed', 'There is nobody else in the queue.');			
			}
			else{
				var newUser = queue.shift();
				client.say('beyondtheed', '@' + newUser + ' is up next on the queue.');
			}			
		}
		else{
			client.say('beyondtheed', 'Sorry, the !next command is only available to the broadcaster.');
		}
	}
	
	//Jen only. Remove all players from the queue.
	if(message === '!removeall'){
		if(user["display-name"] === "beyondtheed"){
			if(queue.length == 0){
				client.say('beyondtheed', 'The queue is already empty.');			
			}
			else{
				queue.length = 0;
				client.say('beyondtheed', 'The queue has been emptied.');
			}			
		}
		else{
			client.say('beyondtheed', 'Sorry, the !removeall command is only available to the broadcaster.');
		}
	}
	
	//Jen only. Open the queue to viewers.
	if(message === '!open'){
		if(user["display-name"] === "beyondtheed"){
			if(queueOpen === true){
				client.say('beyondtheed', 'The queue is already open.');			
			}
			else{
				queueOpen = true;
				client.say('beyondtheed', 'The queue has been opened.');
			}			
		}
		else{
			client.say('beyondtheed', 'Sorry, the !open is only available to the broadcaster.');
		}
	}
	
	//Jen only. Close the queue to viewers. New players cannot add themselves to the queue anymore. 
	if(message === '!close'){
		if(user["display-name"] === "beyondtheed"){
			if(queueOpen === false){
				client.say('beyondtheed', 'The queue is already closed.');			
			}
			else{
				queueOpen = false;
				client.say('beyondtheed', 'The queue has been closed.');
			}			
		}
		else{
			client.say('beyondtheed', 'Sorry, the !close command is only available to the broadcaster.');
		}
	}
	
	//All Game Bot Commands
	
	//Everybody, Game Bot Commands
	if(message === '!help3'){
		client.say('beyondtheed', 'Type "!addgame" to add one to the game number. Type "!setgame <value>" to set the game number in the rotation. Type "!currgame" to see the current game set in the rotation. Type "!resetgame" to reset the game counter to 0.');
	}
	
	//Jen only. Add Game Count
	if(message === '!addgame'){
		if(user["display-name"] === "beyondtheed"){
			game++;
			client.say('beyondtheed', 'The game counter has been incremented. Game Counter is now: ' + game + '.');
		}
		else{
			client.say('beyondtheed', 'Sorry, the !addgame command is only available to the broadcaster.');
		}
	}
	
	//Jen only. Set Game Count Manually
	if (message.startsWith("!setgame")) {
		if(user["display-name"] === "beyondtheed"){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!setgame' && isInt(input) && input >= 0){
				game = parseInt(input);
				client.say('beyondtheed', 'The game counter has been set to ' + input + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say('beyondtheed', 'Sorry, the !setgame command is only available to the broadcaster.');
		}
	}
	
	//everybody, Get Current Game
	if(message === '!currgame'){
		client.say('beyondtheed', 'Currently, the Game Counter is at: ' + game + '.');
	}
	
	//Jen only, Reset Game
	if(message === '!resetgame'){
		if(user["display-name"] === "beyondtheed"){
			game = 1;
			client.say('beyondtheed', 'The game counter has been reset. Game Counter is now: ' + game + '.');
		}
		else{
			client.say('beyondtheed', 'Sorry, the !resetgame command is only available to the broadcaster.');
		}
	}
	
	//all Yawn Bot commands
	
	//Everybody, all Yawn Bot Commands
	if(message === '!help4'){
		client.say('beyondtheed', 'Type "!yawn" to add the yawn counter by 1. Type "!yawn <value>" to add the yawn counter with a specific value. (Example: Type "!yawn 2" to increment the counter by 2.) Type "!resetyawn" to reset the yawn counter to 0. Type "!setyawn <value>" to set the yawn counter to a specific value. (Example: Type "!setyawn 6" to set the counter to 6.) Type "!save" to manually save the yawn counter. Type "!curryawn" to see the current yawn counter.');
	}
	
	//VIP and Jen, increment yawn counter
	if (message.startsWith("!yawn")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!yawn' && isInt(input) && input >= 0){
				yawncounter += parseInt(input);
				saveYawn();
				client.say('beyondtheed', 'The yawn counter has been incremented by ' + input + '. Yawn Counter is now: ' + yawncounter + '. beyond88SmallNap');
			}
			else if(command === '!yawn' && !input){
				yawncounter++;
				saveYawn();
				client.say('beyondtheed', 'The yawn counter has been incremented. Yawn Counter is now: ' + yawncounter + '. beyond88SmallNap');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid. beyond88SmallNap");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !yawn command. beyond88SmallNap");
		}
	}
	
	//VIP and Jen, reset yawn counter
	if(message === '!resetyawn'){
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			yawncounter = 0;
			saveYawn();
			client.say('beyondtheed', 'The yawn counter has been reset. Yawn Counter is now: ' + yawncounter + '. beyond88SmallNap');
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !resetyawn command. beyond88SmallNap");
		}
	}
	
	//VIP and Jen, manually set yawn counter
	if (message.startsWith("!setyawn")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!setyawn' && isInt(input) && input >= 0){
				yawncounter = parseInt(input);
				saveYawn();
				client.say('beyondtheed', 'The yawn counter has been set to ' + input + '. Yawn Counter is now: ' + yawncounter + '. beyond88SmallNap');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid. beyond88SmallNap");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !setyawn command. beyond88SmallNap");
		}
	}
	
	//Everybody, get current yawn counter
	if(message === '!curryawn'){
		client.say('beyondtheed', 'Currently, the Yawn Counter is at: ' + yawncounter + '. beyond88SmallNap');
	}
	
	//Easter Egg, Everybody
	if(message === '!egg'){
		client.say('beyondtheed', 'Egg.');
	}
	
	//Easter Egg, Everybody
	if(message === '!hi'){
		client.say('beyondtheed', 'beyond88SmallHi');
	}
});