<h1 align='center'> CardGame </h1>

### Description
This program is a simple card game in Marvel thematics.  
   
It is a game about battles between Marvel characters. It starts from registration and login, that enable the user to take part in battle.  

Gameplay:   
- each match is a battle between two opponents against each other
- gameplay is turn-based
- each player has points of Health at the begining of the match
- each player has ability to choose 5 cards from random at the begining of the match
- during the match every player can take several extra random cards to add them into deck
- once Health is reduced to zero or no cards left the match is over with corresponding message for each player
- each player's turn is time-limited, but the change turn button is also available   

Cards:
- was implemented 20 different cards
- each card has a few parameters:
  - points of attack
  - points of defense
  - card's cost
- all cards display the avatar and all parameters   

Battlefield: 
- game board is a board where each player is represented and the action take place
- avatars are displayed near the bottom and top respectively
- bord is divided into to parts: for the player's and the opponent's active cards

Used packages:
- cookie-parser - for parcing cookies
- express - for creating server in Node.js
- jsonwebtoken - for implementing authentification
- mysql2 - for working with database
- ws - websockets for realising real-time actions for several users

#### Examples of working    
![изображение](https://user-images.githubusercontent.com/108219165/184618737-eae5b561-e9be-41ac-a14e-a83663f184a3.png)   

### How to start
In folder with cloned project start server with `node server.js` and then open `http://localhost:8000/` in your browser.  
