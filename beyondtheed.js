// TODO LIST: 
// Maybe reset timer for queue reminder?
// Music for infofarm? 

var hour = 0;						//hour of playing the game
var queue = [];						//current queue
var game = 1;						//current game
var queueOpen = true;				//queue open/closed status
var fs = require('fs')				//read and write required stuff
var kheelsFirstTime = true;			//if Kheels has not talked yet
var forestFirstTime = true; 		//if Forest has not talked yet
var clashFirstTime = true;			//if Clash has not talked yet
var queueTime = 360000;				//360000 = 6 minutes
var hourlyTime = 3600000; 			//3600000 = 1 hour
var varQueueInterval = setInterval(queueInterval, queueTime); 
var varHourlyInterval = setInterval(hourlyInterval, hourlyTime); 

var notification = true;

function queueInterval() {
	if(queue.length !== 0){
		client.say('beyondtheed', '@beyondtheed Just a friendly reminder there is currently ' + queue.length + ' user(s) still waiting in the queue.');
	}
}

function hourlyInterval() {
	hour++;
	client.action('beyondtheed', 'is here with the hour ' + hour + ' update. Fun Counter: ' + counters.fun + ', Yawn Counter: ' + counters.yawn + ', Special Counter: ' + counters.special + ', Farm Counter: ' + counters.farm + ', Swear Counter: ' + counters.swear + '.');
}

//counters that can be saved
var counters = {fun: 0, yawn: 0, special: 0, farm: 0, swear: 0}

//get rid of !, capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(1).toUpperCase() + string.slice(2);
}

//checks if string is an integer
function isInt(value) {
  var x;
  return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

//save counter
function saveCounters(type){
	var dt = new Date().toLocaleString();
	var str = dt + " = " + counters[type] + ' \n';
	fs.appendFile(type + '.txt', str, function (err) {
		if (err) {
			// save failed
			console.log(type + ".text save failed.");
		} 
	})
	//save for next time usage
	fs.writeFile('counters.txt', JSON.stringify(counters), (err) => {
		if (err){
			console.log("counters.text save failed.");
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
	if(fs.existsSync('counters.txt')) {
		var content = fs.readFileSync('counters.txt', 'utf-8');
		try {
			counters = JSON.parse(content);
			client.action('beyondtheed', 'is now awake. Fun Counter: ' + counters.fun + ', Yawn Counter: ' + counters.yawn + ', Special Counter: ' + counters.special + ', Farm Counter: ' + counters.farm + ', Swear Counter: ' + counters.swear + '. You can find a list of commands by typing "!help <type>", where <type> can be "fun", "queue", "game", "yawn", "special", "farm", "swear", or "misc". (Example: "!help yawn").');

		} catch (e) {
			client.action('beyondtheed' , 'is now awake. The previous sava data cannot be loaded, so all counters are thus set at zero. You can find a list of commands by typing "!help <type>", where <type> can be "fun", "queue", "game", "yawn", "special", "farm", "swear", or "misc". (Example: "!help yawn").');
		}
	}
	else{
		client.action('beyondtheed' , 'is now awake. There is no previous save data, so all counters are thus set at zero. You can find a list of commands by typing "!help <type>", where <type> can be "fun", "queue", "game", "yawn", "special", "farm", "swear", or "misc". (Example: "!help yawn").');
	}
	
});

client.on('chat', (channel, user, message, self) => {
	
	//everybody, Fun Bot Commands
	if(message === '!help1' || message === '!help fun'){
		client.say('beyondtheed', 'Type "!fun" to add the fun counter by 1. Type "!fun <value>" to add the fun counter with a specific value. (Example: Type "!fun 2" to increment the counter by 2.) Type "!resetfun" to reset the fun counter to 0. Type "!setfun <value>" to set the fun counter to a specific value. (Example: Type "!setfun 6" to set the counter to 6.) Type "!currfun" to see the current fun counter.');
	}
	
	//all Fun Bot commands
	
	//VIP and Jen, increments fun counter
	if (message.startsWith("!fun")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!fun' && isInt(input) && input >= 0){
				counters.fun += parseInt(input);
				saveCounters('fun');
				client.say('beyondtheed', 'The fun counter has been incremented by ' + input + '. Fun Counter is now: ' + counters.fun + '.');
			}
			else if(command === '!fun' && !input){
				counters.fun++;
				saveCounters('fun');
				client.say('beyondtheed', 'The fun counter has been incremented. Fun Counter is now: ' + counters.fun + '.');
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
			counters.fun = 0;
			saveCounters('fun');
			client.say('beyondtheed', 'The fun counter has been reset. Fun Counter is now: ' + counters.fun + '.');
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
				counters.fun = parseInt(input);
				saveCounters('fun');
				client.say('beyondtheed', 'The fun counter has been set to ' + input + '. Fun Counter is now: ' + counters.fun + '.');
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
		client.say('beyondtheed', 'Currently, the Fun Counter is at: ' + counters.fun + '.');
	}
	
	//All Queue Bot Commands
	
	//Everybody, Queue Bot Commands
	if(message === '!help2' || message === '!help queue'){
		client.say('beyondtheed', 'Type "!add" to add yourself to the queue. Type "!remove" to remove yourself from the queue. Type "!queue" to see the queue. Type "!next" for the next player, "!next <number>" for the next <number> players, or "!next <user>" to have a user skip the queue. Type "!random" for a random player. Type "!close" to close and "!open" to open the queue. Type "!addplayer <user>" to add user to the queue. Type "!removeplayer <user>" to remove user from the queue. Type "!removeall <user>" to empty the queue.');
	}
	
	//Everybody, Add User to Queue
	if(message === '!add' || message === '!join'){
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
	if(message === '!remove' || message === '!leave'){
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
	if(message.startsWith("!next")){
		if(user["display-name"] === "beyondtheed"){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if(command === '!next' && isInt(input) && input >= 1){
				//!next <number>
				if(queue.length == 0){
					client.say('beyondtheed', 'There is nobody else in the queue.');			
				}
				else if(queue.length < input){
					client.say('beyondtheed', 'There is less than ' + input + ' user(s) currently in the queue. The current size of the queue is ' + queue.length + '.' );
				}
				else{
					var next_queue = queue.slice(0, input);
					next_queue = next_queue.map(i => '@' + i);
					queue = queue.slice(input);
					client.say('beyondtheed' , next_queue.join(', ') + ' are up next on the queue.');
				}
			}
			else if(command === '!next' && !input){
				//!next
				if(queue.length == 0){
					client.say('beyondtheed', 'There is nobody else in the queue.');			
				}
				else{
					var newUser = queue.shift();
					client.say('beyondtheed', '@' + newUser + ' is up next on the queue.');
				}
			}
			else if(command === '!next' && queue.includes(input)){
				//!next <username>
				queue = queue.filter(e => e !== input); 
				client.say('beyondtheed', '@' + input + ' is up next on the queue.');
			}
			else{
				//error message
				client.say('beyondtheed', 'Error. The command you typed is invalid.');
			}
		}
		else{
			client.say('beyondtheed', 'Sorry, the !next command is only available to the broadcaster.');
		}
	}
	
	//Jen only, gets random player on the queue.
 	if(message === '!random'){
		if(user["display-name"] === "beyondtheed"){
			if(queue.length == 0){
				client.say('beyondtheed', 'There is nobody in the queue.');			
			}
			else{
				var randomPosition = Math.floor(Math.random() * queue.length);
				var randomPerson = queue[randomPosition];
				queue = queue.filter(e => e !== randomPerson); ;
				client.say('beyondtheed', '@' + randomPerson + ' is randomly selected from the queue.');
				
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
	
	//Jen only. Manually add someone to the queue. Command still works even if queue is closed.
	if(message.startsWith("!addplayer")){
		if(user["display-name"] === "beyondtheed"){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!addplayer' && isRealValue(input) && message.split(' ').length == 2){
				if(!queue.includes(input)){
					queue.push(input);
					client.say('beyondtheed', '@' + input + ' has been added to the queue in position ' + queue.length + '.');
				}
				else{
					client.say('beyondtheed', '@' + input + ' is already on the list.');
				}
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say('beyondtheed', 'Sorry, the !addplayer command is only available to the broadcaster.');
		}
	}
	
	//Jen only. Manually remove someone to the queue.
	if(message.startsWith("!removeplayer")){
		if(user["display-name"] === "beyondtheed"){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!removeplayer' && isRealValue(input) && message.split(' ').length == 2){
				if(queue.includes(input)){
					queue = queue.filter(e => e !== input); 
					client.say('beyondtheed', '@' + input + ' has been removed from the queue.');
				}
				else{
					client.say('beyondtheed', '@' + input + ' is not in the queue.');
				}
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say('beyondtheed', 'Sorry, the !removeplayer command is only available to the broadcaster.');
		}
	}
	
	//All Game Bot Commands
	
	//Everybody, Game Bot Commands
	if(message === '!help3' || message === '!help game'){
		client.say('beyondtheed', 'Type "!addgame" to add one to the game number. Type "!setgame <value>" to set the game number in the rotation. Type "!currgame" to see the current game set in the rotation. Type "!resetgame" to reset the game counter to 1.');
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
	if(message === '!help4' || message === '!help yawn'){
		client.say('beyondtheed', 'Type "!yawn" to add the yawn counter by 1. Type "!yawn <value>" to add the yawn counter with a specific value. (Example: Type "!yawn 2" to increment the counter by 2.) Type "!resetyawn" to reset the yawn counter to 0. Type "!setyawn <value>" to set the yawn counter to a specific value. (Example: Type "!setyawn 6" to set the counter to 6.) Type "!curryawn" to see the current yawn counter.');
	}
	
	//VIP and Jen, increment yawn counter
	if (message.startsWith("!yawn") || message.startsWith("!juan")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if ((command === '!yawn' || command === '!juan') && isInt(input) && input >= 0){
				counters.yawn += parseInt(input);
				saveCounters('yawn');
				client.say('beyondtheed', 'The ' + capitalizeFirstLetter(command) + ' counter has been incremented by ' + input + '. ' + capitalizeFirstLetter(command) + ' Counter is now: ' + counters.yawn + '. beyond88SmallNap');
			}
			else if((command === '!yawn' || command === '!juan')&& !input){
				counters.yawn++;
				saveCounters('yawn');
				client.say('beyondtheed', 'The ' + capitalizeFirstLetter(command) + ' counter has been incremented. ' + capitalizeFirstLetter(command) + ' Counter is now: ' + counters.yawn + '. beyond88SmallNap');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid. beyond88SmallNap");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the " + message.split(' ')[0] + " command. beyond88SmallNap");
		}
	}
	
	//VIP and Jen, reset yawn counter
	if(message === '!resetyawn' || message === '!resetjuan'){
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			counters.yawn = 0;
			saveCounters('yawn');
			client.say('beyondtheed', 'The Yawn counter has been reset. Yawn Counter is now: ' + counters.yawn + '. beyond88SmallNap');
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !resetyawn command. beyond88SmallNap");
		}
	}
	
	//VIP and Jen, manually set yawn counter
	if (message.startsWith("!setyawn") || message.startsWith("!setjuan")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if ((command === '!setyawn' || command === '!setjuan') && isInt(input) && input >= 0){
				counters.yawn = parseInt(input);
				saveCounters('yawn');
				client.say('beyondtheed', 'The Yawn counter has been set to ' + input + '. Yawn Counter is now: ' + counters.yawn + '. beyond88SmallNap');
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
	if(message === '!curryawn' || message === '!currjuan'){
		client.say('beyondtheed', 'Currently, the Yawn Counter is at: ' + counters.yawn + '. beyond88SmallNap');
	}
	
	//all Special Counter commands
	
	//Everybody, all Special Bot Commands
	if(message === '!help5' || message === '!help special'){
		client.say('beyondtheed', 'Type "!special" to add the special counter by 1. Type "!special <value>" to add the special counter with a specific value. (Example: Type "!special 2" to increment the counter by 2.) Type "!resetspecial" to reset the special counter to 0. Type "!setspecial <value>" to set the special counter to a specific value. (Example: Type "!setspecial 6" to set the counter to 6.) Type "!currspecial" to see the current special counter.');
	}
	
	//VIP and Jen, increment special counter
	if (message.startsWith("!special")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!special' && isInt(input) && input >= 0){
				counters.special += parseInt(input);
				saveCounters('special');
				client.say('beyondtheed', 'The special counter has been incremented by ' + input + '. ' + 'Special Counter is now: ' + counters.special + '.');
			}
			else if(command === '!special' && !input){
				counters.special++;
				saveCounters('special');
				client.say('beyondtheed', 'The special counter has been incremented. Special Counter is now: ' + counters.special + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !special command.");
		}
	}
	
	//VIP and Jen, reset special counter
	if(message === '!resetspecial'){
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			counters.special = 0;
			saveCounters('special');
			client.say('beyondtheed', 'The special counter has been reset. Special Counter is now: ' + counters.special + '.');
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !resetspecial command.");
		}
	}
	
	//VIP and Jen, manually set special counter
	if (message.startsWith("!setspecial")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!setspecial' && isInt(input) && input >= 0){
				counters.special = parseInt(input);
				saveCounters('special');
				client.say('beyondtheed', 'The special counter has been set to ' + input + '. Special Counter is now: ' + counters.special + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !setspecial command.");
		}
	}
	
	//Everybody, get current special counter
	if(message === '!currspecial'){
		client.say('beyondtheed', 'Currently, the Special Counter is at: ' + counters.special + '.');
	}
	
	//All Farm Counter Commands
	
	//Everybody, all Farm Bot Commands
	if(message === '!help6' || message === '!help farm'){
		client.say('beyondtheed', 'Type "!farm" to add the farm counter by 1. Type "!farm <value>" to add the farm counter with a specific value. (Example: Type "!farm 3" to increment the counter by 3.) Type "!resetfarm" to reset the farm counter to 0. Type "!setfarm <value>" to set the farm counter to a specific value. (Example: Type "!setfarm 6" to set the counter to 6.) Type "!currfarm" to see the current farm counter.');
	}
	
	//VIP and Jen, increment farm counter
	if (message.startsWith("!farm")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!farm' && isInt(input) && input >= 0){
				counters.farm += parseInt(input);
				saveCounters('farm');
				client.say('beyondtheed', 'The farm counter has been incremented by ' + input + '. ' + 'Farm Counter is now: ' + counters.farm + '.');
			}
			else if(command === '!farm' && !input){
				counters.farm++;
				saveCounters('farm');
				client.say('beyondtheed', 'The farm counter has been incremented. Farm Counter is now: ' + counters.farm + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !farm command.");
		}
	}
	
	//VIP and Jen, reset farm counter
	if(message === '!resetfarm'){
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			counters.farm = 0;
			saveCounters('farm');
			client.say('beyondtheed', 'The farm counter has been reset. Farm Counter is now: ' + counters.farm + '.');
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !resetfarm command.");
		}
	}
	
	//VIP and Jen, manually set farm counter
	if (message.startsWith("!setfarm")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!setfarm' && isInt(input) && input >= 0){
				counters.farm = parseInt(input);
				saveCounters('farm');
				client.say('beyondtheed', 'The farm counter has been set to ' + input + '. Farm Counter is now: ' + counters.farm + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !setfarm command.");
		}
	}
	
	//Everybody, get current farm counter
	if(message === '!currfarm'){
		client.say('beyondtheed', 'Currently, the Farm Counter is at: ' + counters.farm + '.');
	}
	
	//Swear Counter
	
	//Everybody, all Swear Bot Commands
	if(message === '!help7' || message === '!help swear'){
		client.say('beyondtheed', 'Type "!swear" to add the Swear Counter by 1. Type "!swear <value>" to add the Swear Counter with a specific value. (Example: Type "!swear 3" to increment the counter by 3.) Type "!resetswear" to reset the Swear Counter to 0. Type "!setswear <value>" to set the Swear Counter to a specific value. (Example: Type "!setswear 6" to set the counter to 6.) Type "!currswear" to see the current Swear Counter.');
	}
	
	//VIP and Jen, increment Swear Counter
	if (message.startsWith("!swear")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!swear' && isInt(input) && input >= 0){
				counters.swear += parseInt(input);
				saveCounters('swear');
				client.say('beyondtheed', 'The Swear Counter has been incremented by ' + input + '. ' + 'Swear Counter is now: ' + counters.swear + '.');
			}
			else if(command === '!swear' && !input){
				counters.swear++;
				saveCounters('swear');
				client.say('beyondtheed', 'The Swear Counter has been incremented. Swear Counter is now: ' + counters.swear + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !swear command.");
		}
	}
	
	//VIP and Jen, reset Swear Counter
	if(message === '!resetswear'){
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			counters.swear = 0;
			saveCounters('swear');
			client.say('beyondtheed', 'The Swear Counter has been reset. Swear Counter is now: ' + counters.swear + '.');
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !resetswear command.");
		}
	}
	
	//VIP and Jen, manually set Swear Counter
	if (message.startsWith("!setswear")) {
		if(user["display-name"] === "beyondtheed" || (isRealValue(user["badges"]) && ('vip' in user["badges"]))){
			var command = message.split(' ')[0];
			var input = message.split(' ')[1];
			if (command === '!setswear' && isInt(input) && input >= 0){
				counters.swear = parseInt(input);
				saveCounters('swear');
				client.say('beyondtheed', 'The Swear Counter has been set to ' + input + '. Swear Counter is now: ' + counters.swear + '.');
			}
			else{
				client.say("beyondtheed", "Error. The command you typed is invalid.");
			}
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !setswear command.");
		}
	}
	
	//Everybody, get current Swear Counter
	if(message === '!currswear'){
		client.say('beyondtheed', 'Currently, the Swear Counter is at: ' + counters.swear + '.');
	}
	
	//Miscellaneous commands
	//Everybody, all miscellaneous commands
	if(message === '!help8' || message === '!help misc'){
		client.say('beyondtheed', 'Type "!hi" to use beyond88SmallHi. Type "!nap" to use beyond88SmallNap. Type "!claus" to use beyond88SmallClaus. Type "!off" to turn off notifications. Type "!on" to turn on notifications. Type "!counter" to see all the current counters.');
	}
	
	//Emote of hi
	if(message === '!hi'){
		client.say('beyondtheed', 'beyond88SmallHi');
	}
	
	//Emote of nap
	if(message === '!nap'){
		client.say('beyondtheed', 'beyond88SmallNap');
	}
	
	//Emote of claus
	if(message === '!claus'){
		client.say('beyondtheed', 'beyond88SmallClaus');
	}
	
	//turn off notifications
	if(message === '!off'){
		if(user["display-name"] === "beyondtheed"){
			if(notification === false){
				client.say('beyondtheed', 'Notifications are already turned off.');
			}
			else{
				clearInterval(varQueueInterval);
				clearInterval(varHourlyInterval);
				notification = false;
				client.say('beyondtheed', 'Notifications are now off.');
			}
		}
		else{
			client.say('beyondtheed', 'Sorry, the !off command is only available to the broadcaster.');
		}
	}
	
	//turn on notifications
	if(message === '!on'){
		if(user["display-name"] === "beyondtheed"){
			if(notification === true){
				client.say('beyondtheed', 'Notifications are already turned on.');
			}
			else{
				varQueueInterval = setInterval(queueInterval, queueTime); //360000 = 6 minutes
				varHourlyInterval = setInterval(hourlyInterval, hourlyTime); //3600000 = 1 hour
				notification = true;
				client.say('beyondtheed', 'Notifications are now on.');
			}
		}
		else{
			client.say('beyondtheed', 'Sorry, the !on command is only available to the broadcaster.');
		}
	}
	
	//show a list of all the counters
	if(message === '!counter' || message === '!counters'){
		client.say('beyondtheed', 'Fun Counter: ' + counters.fun + ', Yawn Counter: ' + counters.yawn + ', Special Counter: ' + counters.special + ', Farm Counter: ' + counters.farm + ', Swear Counter: ' + counters.swear + '.');
	}
		
	//Hidden commands not shown in the !help. 
	if(message === '!help'){
		client.say('beyondtheed', 'You can find a list of commands by typing "!help <type>", where <type> can be "fun", "queue", "game", "yawn", "special", "farm", "swear", or "misc". (Example: "!help yawn").');
	}
	
	if(message === '!egg'){
		client.say('beyondtheed', 'Egg.');
	}
	
	if(message === '!w3'){
		client.say('beyondtheed', "@beyondtheed IT'S WAVE 3. USE YOUR SPECIALS!");
	}
	
	if(message === '!remind'){
		client.say('beyondtheed', "~USE YOUR SPECIALS JEN~");
	}
	
	if(message === '!break'){
		client.say('beyondtheed', '~TAKE A BREAK JEN~');
	}
	
	if(message === '!save'){
		if(user["display-name"] === "beyondtheed"){
			//save to history
			saveCounters('fun');
			saveCounters('yawn');
			saveCounters('special');
			saveCounters('farm');
			saveCounters('swear');
			client.say("beyondtheed", "Saved.");
		}
		else{
			client.say("beyondtheed", "Sorry, you do not have the permissions to use the !save command.");
		}
	}
	
	//bot commands for people talking in chat first time. 
	if(user["display-name"] === "ForestGrump8" && forestFirstTime){
		forestFirstTime = false;
		client.say('beyondtheed', '@ForestGrump8 How was your day today Forest? beyond88SmallHi');
	}
	
	if(user["display-name"] === "Clash_Spl" && clashFirstTime){
		clashFirstTime = false;
		client.say('beyondtheed', 'beyond88SmallClaus');
	}
	
	if(user["display-name"] === "Killerheels" && kheelsFirstTime){
		kheelsFirstTime = false;
		client.say('beyondtheed', '👁️ 👄 👁️ ');
	}
});