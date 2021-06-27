# BeyondJenBot

## Introduction

This is a Twitch Bot I made for [beyondtheed](https://www.twitch.tv/beyondtheed). She is a Splatoon 2
Salmon Run streamer, and we needed a bot mostly to keep track of viewers who want to play games with
her and the number of games remaining before we rotate out new viewers. I will update the bot as the
need for more commands show up, but currently, we have 8 main functions for the bot: Fun Counter,
Yawn Counter, Queue, Game Counter, Special Counter, Farm Counter, Swear Counter, and Miscellaneous.  

## Installation

Anybody is free to clone and use the bot, but all the functions made on this bot is specialized and mostly
likely will be of little use to you. If you still want to use it though, here are the steps below:  

1. Follow the instructions on running the bot locally [here](https://dev.twitch.tv/docs/irc).
2. Change the username and password on the beyondtheed.js file to your Twitch Bot username and oauth password.
3. Make other changes in the code as needed.
4. Run with `node beyondtheed.js`  

## Updates

### January 16, 2021 Update  

1. All yawn commands can be substititued with 'juan'.
2. Special commands added.  

### February 1, 2021 Update  

1. Added a farm and swear counter.
2. Added a reminder for when there are user(s) in the queue and an hourly status update.
3. All emotes are callable by commands, like !hi, !claus, !nap.
4. Added many hidden commands.
5. Several optimzation code in the back for a more pleasant experience.  

### February 6, 2021 Update  

1. Added an !on and !off for notifications.
2. Hopefully fixed timer desync bug from last update.
3. Added a misc help.

### February 20, 2021 Update  

1. Added 2 more greetings for certain user's first time on stream.
2. Shortened some text on waking and hourly update statement, and added the hour for hourly updates.
3. Added a !counter command to see all counters at a time.
4. Added a !random command to randomly selected a player from the queue.
5. Expanded !next to include number and have manually have person skip the queue. 
6. Added a universal !help.  

### March 1, 2021 Update

1. Added !infofarm sound w/ a 5 minute cooldown.
2. Added !w3stats and a counter for times !w3 has been used.
3. Added new !trolldie emote command.  

### March 4, 2021 Update

1. Added support for "@" in front of <user> in !next, !addplayer, !removeplayer, and !w3stats.
2. Added new command !w3top10.

### March 7, 2021 Update  

1. Added !shoot sound command. 

### March 29, 2021 Update  

1. No cooldown for !shoot and !infofarm when broadcaster uses the commands. 

### March 30, 2021 Update  

1. Cosy intro added.
2. !lurk command added to announce when people go into lurk mode.
3. Return message for lurkers saying how long they were lurking. 

### April 21, 2021 Update  

1. Added !cake and !baby sound commands. 

### June 26, 2021 Update

1. Added TTS and a bunch of TTS commands.
2. Added !cry for fifth emote.
3. Streamer added the !ohno earlier, now it's on my repo here.  



