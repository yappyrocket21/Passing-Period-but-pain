
const WELCOME_MESSAGE = "<h1>Welcome to the Passing Period Alpha</h1><br><h2>Known Issues</h2><br>- When you are all the way on the edge of the map and you are colliding with something, it is possible to glitch the gamepiece off the edgo of the map.<br>- Mr. Savage doesn't know that this game exists<br>- styles.css contains LOTS of unused rules from my other game, Wild Goose Chase, which I based this off of.<h2>I Need Your Help!</h2>I need a good picture of Mr. Savage's classroom, preferably without Mr. Savage in it. I am talking about his old classroom in the 20s building, not the new one in the STEM building. If you have a picture please contact me at <a href='mailto:scanuprooductions@gmail.com'>scanuprodutions@gmail.com</a><h2>Suggestions?</h2>Contact me at <a href='mailto:scanuprooductions@gmail.com'>scanuprodutions@gmail.com</a> or submit an Issue on my <a href='https://github.com/ScanuNicco/Passing-Period' target='_blank'>GitHub page.</a>";
const CREDITS_MESSAGE = "<h1>Credits</h1>Game by Nicco Scanu with some programming help from Charlie Clowes.<h2>Thanks To:</h2><ul><li>Charlie Clowes for helping me troubleshoot my code</li><li>Mr. Savage for being a great teacher and inspiring this game</li><li>The Inkscape Project for making the software I used for nearly all of the game art</li><li>Jack McInnis for inspiring his character</li>";
notify(WELCOME_MESSAGE);

var horizontalPos = 0; //horizontal position of player
var verticalPos = 0; //vertical position of player
var grade = 0; //The honors chemistry grade out of 100%
var time = 0; //The remaining in ms.
var highScore = 0; //the highest score the player has achieved
var passingperiod = false; //whether it is a passing period or in class
var inclass = false;
var forwardSpeed = 0; //speed in px/ms (pixels per millisecond) to move forward (up)
var backSpeed = 0; //speed in px/ms to move back (down)
var leftSpeed = 0; //speed in px/ms to move left
var rightSpeed = 0; //speed in px/ms to move right
var forwardSpeedMap = 0; //speed in px/ms (pixels per millisecond) to move forward (up)
var backSpeedMap = 0; //speed in px/ms to move back (down)
var leftSpeedMap = 0; //speed in px/ms to move left
var rightSpeedMap = 0; //speed in px/ms to move right
var active = false; //if the game is active, off until game starts
var hit = false; //if the block has been hit
var blockSpeed = 1; //speed the blocks move, in px/ms
var speed = 3; //speed of block in px/ms
var y = 0; //position of gamepiece vertically
var x = 0; //position of gp horizontally
var mapY = 0; //mapX
var mapX = 0; //mapY
var movement = false; //if movement is allowed
var battery = 70; //Amount of battery that the drone has (0 - 70)
var hsLocal = false; //Store highscore locally instead of on your Scanu Productions account.
var money = 0;
var popularity = 0;
var pepper = 0;
var butterfingers = 0;
var events = true; //Can the player trigger an event
var days = 0;
var day = 0;
var canBeSlowed = true; //Wether or not the player can get stuck behind slow kids
var partnership = false; //Wether or not the player has formed a partnership with Jack
var never = false; //Wether or not the player has said "never" to jack
var inTutorial = false;
/* Set the boundaries of the map */
const MAP_MAX_X = 0;
const MAP_MIN_X = window.innerWidth * -.5;
const MAP_MIN_Y = window.innerHeight * -.5;
const MAP_MAX_Y = window.innerHeight * .5;

//If the user has previously toggled the local highscore switch, set hsLocal to true
if (localStorage.getItem('useHSL') == "true") {
	hsLocal = true;
}

//move to start position and set number of lives to 3 and the score to 0000
document.getElementById("gamepiece").style.bottom = verticalPos;
document.getElementById("gamepiece").style.left = horizontalPos;
//According to W3Schools, acessing the HTML DOM is one of the slowest things in JavaScript so accesing it only once when the page loads is faster.
var obs = document.getElementsByClassName('obstacle');
var livesDisplay = document.getElementById('aliveDisplay');
var hitMenuLivesDisplay = document.getElementById('hitAliveDisplay');
var gp = document.getElementById('gamepiece'); //gets the gamepiece item
var mp = document.getElementById('mapContainer');

function isTouching(r1, r2) { //returns true if the two parameter elements are touching each other
	var r1box = r1.getBoundingClientRect();
	var r2box = r2.getBoundingClientRect();
	return !(r2box.left > r1box.left + r1.offsetWidth ||
		r2box.left + r2.offsetWidth < r1box.left ||
		r2box.top > r1box.top + r1.offsetHeight ||
		r2box.top + r2.offsetHeight < r1box.top);
}

function isColliding(r1, r2) { //The same as isTouching(), but returns a number to tell which way the gamepiece needs to move.
	var r1box = r1.getBoundingClientRect();
	var r2box = r2.getBoundingClientRect();
	if (!(r2box.left > r1box.left + r1.offsetWidth || r2box.left + r2.offsetWidth < r1box.left || r2box.top > r1box.top + r1.offsetHeight || r2box.top + r2.offsetHeight < r1box.top)) {
		/*if (r2box.left <= r1box.right) {
			//console.log("left");
			//leftSpeed = 0;
			console.log("direction 1");
			//x += 10;
		} 
		if (r2box.right >= r1box.left) {
			rightSpeed = 0;
			console.log("direction 2");
			x -= 3;
		} 
		if (r2box.top <= r1box.bottom) {
			//console.log("top");
			//forwardSpeed = 0;
			console.log("direction 3");
			//y -= 10;
		} 
		if (r2box.bottom >= r1box.top) {
			//backSpeed = 0;
			console.log("direction 4");
			//y += 10;
		} */
		let left = r1box.left > r2box.left && r1box.left < r2box.right;
		let right = r1box.right < r2box.right && r1box.right > r2box.left;
		let top = r1box.top > r2box.top && r1box.top < r2box.bottom;
		let bottom = r1box.bottom < r2box.bottom && r1box.bottom > r2box.top;

		return [left, top, right, bottom].indexOf(true);
	} else {
		return -1;
	}
}

function update() { //runs every ten milliseconds
	if (movement) {
		if (gp.offsetTop + gp.offsetHeight > window.innerHeight) {
			backSpeed = 0;
		}
		if (gp.offsetTop < 0) {
			forwardSpeed = 0;
		}
		if (gp.offsetLeft < 0) {
			leftSpeed = 0;
		}
		if (gp.offsetLeft + gp.offsetWidth > window.innerWidth) { //these ifs check if the gamepiece is touching the sides and stops it
			rightSpeed = 0;
		}
		if (mapY > MAP_MAX_Y) {
			backSpeedMap = 0;
		}
		if (mapY < MAP_MIN_Y) {
			forwardSpeedMap = 0;
		}
		if (mapX > MAP_MAX_X) {
			leftSpeedMap = 0;
		}
		if (mapX < MAP_MIN_X) { //these ifs check if the gamepiece is touching the sides and stops it
			rightSpeedMap = 0;
		}
		y += forwardSpeed - backSpeed;
		x += rightSpeed - leftSpeed; //moves the block's position (x and y) by the movement speed in each direction
		mapY -= forwardSpeedMap - backSpeedMap;
		mapX -= rightSpeedMap - leftSpeedMap; //moves the block's position (x and y) by the movement speed in each direction


		gp.style.bottom = y + 'px';
		gp.style.left = x + 'px'; //actually sets the position from the vars
		mp.style.bottom = mapY + 'px';
		mp.style.left = mapX + 'px'; //actually sets the position from the vars
		for (i = 0; i < obs.length; i++) { //iterates through all obstacles
			var collision = isColliding(document.getElementsByClassName('obstacle')[i], document.getElementById('gamepiece'));
			if (collision == -1) {
				//Not touching, do nothing
			} else if (collision == 0) {
				//Touching on the right, move left
				rightSpeed = 0;
				x -= rightSpeedMap; //If the map is moving, move the gamepiece the opposite direction
				x -= 3;
			} else if (collision == 1) {
				//Touching on the bottom, move up
				backSpeed = 0;
				y += backSpeedMap; //If the map is moving, move the gamepiece the opposite direction
				y += 3;
			} else if (collision == 2) {
				//Touching on the left, move right
				leftSpeed = 0;
				x += leftSpeedMap; //If the map is moving, move the gamepiece the opposite direction
				x += 3;
			} else if (collision == 3) {
				//Touching on the bottom, move down
				forwardSpeed = 0;
				y -= forwardSpeedMap; //If the map is moving, move the gamepiece the opposite direction
				y -= 3;
			}
		}
		if (events) {
			if (isTouching(gp, document.getElementById("mulberries"))) {
				movement = false;
				document.getElementById("storefront").style.display = "block";
			} else if (isTouching(gp, document.getElementById("bathroom"))) {
				movement = false;
				document.getElementById("survivalofthefittest").style.display = "block";
			} else if (isTouching(gp, document.getElementById("jackinnis"))) {
				if (!never && !partnership) { //If the player is not already in a partnership with jack and they haven't said "never to him"
					movement = false;
					events = false;
					document.getElementById("jackinnisInvite").style.display = "block";
				}
			}
		}

	}
	if (passingperiod) { //if the game is started
		document.getElementById("powerUpsDisplay").innerHTML = "<p>Honors Chemistry Grade:" + grade + "% Time Remaining in Passing Period: " + Math.floor(time / 1000) + "s</p>";
		time -= 10;
		if (isTouching(gp, document.getElementById("savage"))) {
			movement = false;
			passingperiod = false;
			document.getElementById("savageroom").style.display = "block";
			if (time < 0) {
				var rand = Math.floor(Math.random() * 3);
				var penalty = 0;
				if (rand == 0) {
					penalty = 10;
				} else if (rand == 1) {
					penalty = 5;
				} else {
					penalty = 1;
				}
				document.getElementById("savagesays").innerHTML = "You're " + (-1 * time) + " milliseconds late.<br> Take a " + penalty + "% reduction in your grade.";
				document.getElementById("acceptGrade").innerText = "Accept a " + penalty + "% grade reduction";
				document.getElementById("acceptGrade").onclick = function () {
					getSavaged(penalty)
				};
			} else {
				document.getElementById("savagesays").innerText = "You're on time!";
				document.getElementById("acceptGrade").onclick = function () {
					getSavaged(0)
				};
			}
		}
		if (isTouching(gp, document.getElementsByClassName("slowkids")[0]) || isTouching(gp, document.getElementsByClassName("slowkids")[1])) {
			if (canBeSlowed) {
				if (time > -5) {
					console.log("Slow zone triggered");
					var rand = Math.floor(Math.random() * 3);
					if (rand == 0 || rand == 1) {
						console.log("Slowing down user");
						canBeSlowed = false;
						movement = false;
						document.getElementById("slowkidsactions").style.display = "block";
					} else {
						console.log("They got lucky");
						canBeSlowed = false;
						setTimeout(function () {
							canBeSlowed = true;
						}, 4000); //Give the player one second to get out of the zone
					}
				}
			}
		}
	}
	if (inclass) {
		if (!inTutorial) {
			time -= 10;
			document.getElementById("powerUpsDisplay").innerHTML = "<p>Honors Chemistry Grade:" + grade + "% Passing Period Starts In: " + Math.floor(time / 1000) + "s</p>";
		} else {
			document.getElementById("powerUpsDisplay").innerHTML = "<p>Honors Chemistry Grade:" + grade + "% Passing Period Starts When Tutorial Is Completed.</p>";
		}
		if (time < 1) {
			document.getElementById("sectionsDivider").innerHTML = "<h1>Passing Period</h1>";
			document.getElementById("sectionsDivider").style.display = "block";
			document.getElementById("sectionsDivider").classList.remove("outro");
			document.getElementById("sectionsDivider").classList.add("intro");
			time = 60000;
			inclass = false;
			leaveMulberries();
			x = 0;
			y = 0;
			mapX = 0;
			mapY = 0;
			movement = false;
			setTimeout(function () {
				document.getElementById("sectionsDivider").classList.remove("intro");
				document.getElementById("sectionsDivider").classList.add("outro");
				setTimeout(function () {
					movement = true;
					passingperiod = true;
					document.getElementById("sectionsDivider").style.display = "none";
				}, 1000);
			}, 4000);
		}
	}
	document.getElementById("aliveDisplayContainer").innerHTML = "<p>Money: $" + money + " Popularity: " + popularity + "% Butterfingers: " + butterfingers + " Dr. Pepper: " + pepper + " Day: " + day + "</p>";
}
setInterval(update, 10); //run the update function from earlier every ten milliseconds (100fps)

document.addEventListener("keydown", function (event) { // runs when any key is down (not released) when the key is pressed, set the speed to 1 px/ms
	if (event.key == 's') { // if 's' is pressed, doesnt work on some browsers (!), maybe switch to event.which in future update?
		if (y > 100 || mapY > MAP_MAX_Y) {
			backSpeed = speed;
		} else {
			backSpeedMap = speed;
		}
	}
	if (event.key == 'w') { // same as 's'	
		if (y < window.innerHeight - 100 || mapY < MAP_MIN_Y) {
			forwardSpeed = speed;
		} else {
			forwardSpeedMap = speed;
		}
	}
	if (event.key == 'a') { // same as 's'
		if (x > 100 || mapX > MAP_MAX_X) {
			leftSpeed = speed;
		} else {
			leftSpeedMap = speed;
		}

	}
	if (event.key == 'd') { // same as 's'	
		if (x < window.innerWidth - 100 || mapX < MAP_MIN_X) {
			rightSpeed = speed;
		} else {
			rightSpeedMap = speed;
		}
	}
});

document.addEventListener("keyup", function (event) { // stop when the key is released
	if (event.key == 's') { //same as keydown function, but stops the movement when the key is released
		backSpeed = 0;
		backSpeedMap = 0;
		if (mode == 2) {
			backSpeed = 1;
		}
	}
	if (event.key == 'w') {
		forwardSpeed = 0;
		forwardSpeedMap = 0;
		if (mode == 3) {
			forwardSpeed = 1;
		}
	}
	if (event.key == 'a') {
		leftSpeed = 0;
		leftSpeedMap = 0;
	}
	if (event.key == 'd') {
		rightSpeed = 0;
		rightSpeedMap = 0;
	}
});

var mode = 1;

function startGame() {
	document.getElementById("sectionsDivider").innerHTML = "<h1>Ms. Guillen gave your class a descanso.</h1><h2>You have 30 seconds to prepare for passing period.</h2>";
	document.getElementById("sectionsDivider").style.display = "block";
	document.getElementById("sectionsDivider").classList.remove("outro");
	document.getElementById("sectionsDivider").classList.add("intro");
	setTimeout(function () {
		document.getElementById("mainMenu").style.display = "none";
		document.getElementById("sectionsDivider").classList.remove("intro");
		document.getElementById("sectionsDivider").classList.add("outro");
		setTimeout(function () {
			document.getElementById("sectionsDivider").style.display = "none";
			inclass = true;
			passingperiod = false;
			time = 30000;
			movement = true;
			popularity = 50;
			money = 20;
			grade = 100;
			days = 3;
			day = 1;
		}, 1000)
	}, 4000);
}

function endGame() {
	movement = false;
	events = false;
	passingperiod = false;
	inclass = false;
	document.getElementById("mainMenu").style.display = "block";
	var finalgrade = 0;
	if (grade >= 90) {
		finalgrade++;
	}
	if (popularity >= 50) {
		finalgrade++;
		//Bonus point for every 10% popularity over the original 50%
		finalgrade += Math.floor((popularity - 50) / 10);
	}
	//Bonus point for each dollar over the original $20 you earned
	if (money > 20) {
		finalgrade += money - 20;
	}


	document.getElementById("gradeContainer").innerHTML = "<h2>GRADE: </h2><h1 style='font-size: 48pt; font-weight: lighter'>" + finalgrade + "/2</h1>;"
	document.getElementById("results").style.display = "table";
	document.getElementById("results").innerHTML += "<tr><td>$" + money + "</td><td>" + popularity + "%</td><td>" + grade + "%</td><td>" + butterfingers + "</td><td>" + pepper + "</td><td>" + finalgrade + "/2</td></tr>";
}

function buyPepper() {
	if (money < 5) {
		notify("Not Enough Money!");
	} else {
		pepper++;
		money -= 5;
	}

}

function buyButter() {
	if (money < 3) {
		notify("Not Enough Money!");
	} else {
		butterfingers++;
		money -= 3;
	}
	if (inTutorial) {
		if (butterfingers == 1) {
			/* If tutorial is active and this is the first Butterfinger */
			notify("<h2>Keeping Track of your Stats</h2><br>On the top and bottom of your screen, you can see statistics about your game such as your popularity and your Honors Chemistry grade. It's important to keep track of these as they influence your score. To win the game, you need to have an A in Honors Chemistry, and 50% popularity at the end of 3 days. In addition, you get a bonus point for every 10% popularity above 50% and for every dollar over the original $20.");
		}
	}

}

function leaveMulberries() {
	document.getElementById("storefront").style.display = "none";
	y -= 100;
	movement = true;
	if (inTutorial) {
		notify("<h2>Earning More Money</h2><br>There are many ways to earn money in this game. To start, how about you form a strategic partnership with Jack McInnis. By doing this, you will lose 10% popularity, but you will gain $5 at the beginning of each day (don't ask where he gets it.). You need to give Jack one Butterfinger to do this, so make sure you have one!<h2>Gaining Popularity</h2>Similarly to making money, there are many ways to gain popularity. You can gain popularity (and a few bucks) by selling Butterfingers to the kids in the hallway or Dr. Pepper to the kids in the 20s Building bathroom. If you need a bigger boost in popularity, you can vape in the bathroom but there is a 10% chance of getting caught and suspended.<br><b>Goal: Talk to Jack McInnis in the 30s building</b>");
		document.getElementById("mulberries").classList.remove("tutorialElement");
		document.getElementById("jackinnis").classList.add("tutorialElement");
	}
}

function getSavaged(penalty) {
	grade -= penalty;
	//Start the next round
	if (day == days) {
		endGame();
	} else {
		day++;
		if (partnership) {
			money += 5;
		}
		x = 0;
		y = 0;
		if (Math.floor(Math.random() * 2) == 0) {
			document.getElementById("sectionsDivider").innerHTML = "<h1>Passing Period</h1>";
			document.getElementById("sectionsDivider").style.display = "block";
			document.getElementById("sectionsDivider").classList.remove("outro");
			document.getElementById("sectionsDivider").classList.add("intro");
			setTimeout(function () {
				document.getElementById("mainMenu").style.display = "none";
				document.getElementById("sectionsDivider").classList.remove("intro");
				document.getElementById("sectionsDivider").classList.add("outro");
				setTimeout(function () {
					document.getElementById("sectionsDivider").style.display = "none";
					passingperiod = true;
					inclass = false;
					movement = true;
					time = 60000;
				}, 1000)
			}, 4000);
		} else {
			document.getElementById("sectionsDivider").innerHTML = "<h1>Ms. Guillen gave your class a descanso.</h1><h2>You have 30 seconds to prepare for passing period.</h2>";
			document.getElementById("sectionsDivider").style.display = "block";
			document.getElementById("sectionsDivider").classList.remove("outro");
			document.getElementById("sectionsDivider").classList.add("intro");
			setTimeout(function () {
				document.getElementById("mainMenu").style.display = "none";
				document.getElementById("sectionsDivider").classList.remove("intro");
				document.getElementById("sectionsDivider").classList.add("outro");
				setTimeout(function () {
					document.getElementById("sectionsDivider").style.display = "none";
					passingperiod = false;
					inclass = true;
					movement = true;
					time = 30000;
				}, 1000)
			}, 4000);
		}
		document.getElementById("savageroom").style.display = "none";
	}
}

function bribePepper() {
	if (pepper > 0) {
		pepper -= 1;
		if (Math.floor(Math.random() * 3) == 0) {
			//One in three chance he accepts the bribe
			document.getElementById("savagesays").innerHTML = "Hmm... Maybe i'm being a bit too harsh.<br> I'll let you go this time but just don't do it again.";
			document.getElementById("acceptGrade").innerText = "Say \"Thank You Mr. Savage\"";
			document.getElementById("acceptGrade").onclick = function () {
				getSavaged(0)
			};
		} else {
			document.getElementById("savagepicture").classList.add("savageShake");
			setTimeout(function () {
				document.getElementById("savagepicture").classList.remove("savageShake");
			}, 500)
		}
	} else if (time > 0) {
		notify("You can't bribe Mr. Savage unless you're late!")
	} else {
		notify("You don't have any Dr. Pepper!");
	}
}

function bribeButter() {
	if (butterfingers > 0) {
		butterfingers -= 1;
		if (Math.floor(Math.random() * 5) == 0) {
			//One in five chance he accepts the bribe
			document.getElementById("savagesays").innerHTML = "Hmm... Maybe i'm being a bit too harsh.<br> I'll let you go this time but just don't do it again.";
			document.getElementById("acceptGrade").innerText = "Say \"Thank You Mr. Savage\"";
			document.getElementById("acceptGrade").onclick = function () {
				getSavaged(0)
			};
		} else {
			document.getElementById("savagepicture").classList.add("savageShake");
			setTimeout(function () {
				document.getElementById("savagepicture").classList.remove("savageShake");
			}, 500)
		}
	} else if (time > 0) {
		notify("You can't bribe Mr. Savage unless you're late!")
	} else {
		notify("you don't have any Butterfingers!");
	}
}

function pushThrough() {
	movement = true;
	document.getElementById("slowkidsactions").style.display = "none";
	setTimeout(function () {
		canBeSlowed = true;
	}, 4000);
	popularity -= 5;
}

function sellButter() {
	if (butterfingers > 0) {
		movement = true;
		document.getElementById("slowkidsactions").style.display = "none";
		setTimeout(function () {
			canBeSlowed = true;
		}, 4000);
		butterfingers -= 1;
		popularity += 1;
		money += 4;
		time -= 35000;
	} else {
		notify("You have no Butterfingers!")
	}
}

function walkBehind() {
	movement = true;
	document.getElementById("slowkidsactions").style.display = "none";
	setTimeout(function () {
		canBeSlowed = true;
	}, 4000);
	time -= 30000;
}

function naturalSelection() {
	if (Math.floor(Math.random() * 10) == 0) {
		//10% chance of being suspended
		notify("<h2>Mr. Savage caught you vaping!</h2> You have been suspended. Game Over.");
		endGame();
	} else {
		popularity += 10;
		time -= 20000;
	}
}

function sellPepper() {
	if (pepper < 1) {
		notify("You don't have any Dr. Pepper!");
	} else {
		pepper -= 1;
		money += 8;
		time -= 15000;
	}
}

function leaveBathroom() {
	x -= 20;
	document.getElementById("survivalofthefittest").style.display = "none";
	movement = true;
}

function createPartnership() {
	if (butterfingers > 0) {
		butterfingers -= 1;
		popularity -= 10;
		time -= 10000;
		partnership = true;
		movement = true;
		document.getElementById("jackinnisInvite").style.display = "none";
		setTimeout(function () {
			events = true;
		}, 5000);
		if (inTutorial) {
			notify("<h2>Getting to Class On Time</h2><br><b>Passing period starts in 30 seconds.</b> Mr. Savage has a pet peeve with people not being on-time to his class, and he may lower your grade if you are late! The safest way to maintain an A in Honors Chem is to get to Mr. Savage's class by the end of passing period. Choose your route charefully, because you can get caught behind slow kids and have a hard time getting to class on time. If you end up late to class, don't worry. If you give Mr. Savage Butterfingers and/or a Dr. Pepper, he has a chance of changing his mind and not duducting your grade.");
			document.getElementById("jackinnis").classList.remove("tutorialElement");
			inTutorial = false;
			time = 30000;
		}
	} else {
		notify("You don't have enough Butterfingers!");
		if (inTutorial) {
			notify("Go back to mulberries and buy some Butterfinger.");
		}
	}
}

function noJack() {
	movement = true;
	document.getElementById("jackinnisInvite").style.display = "none";
	setTimeout(function () {
		events = true;
	}, 5000);
}

function neverJack() {
	never = true;
	movement = true;
	document.getElementById("jackinnisInvite").style.display = "none";
	setTimeout(function () {
		events = true;
	}, 5000);
}

function notify(notification) {
	document.getElementById("popup").style.display = "block";
	document.getElementById("notificationContent").innerHTML = notification;
}

function closeNotification() {
	document.getElementById("popup").style.display = "none";
}

function tutorial() {
	startGame();
	inTutorial = true;
	document.getElementById("mulberries").classList.add("tutorialElement");
	notify("<h2>Welcome to Passing Period</h2><br>You are currently in a descanso, an in-class break. You can use this time to prepare for Passing Period, how about heading to Mulberry's to pick up some Butterfingers and Dr. Pepper. You can find Mulberry's in the top right corner of the map. Use W, A, S, and D to move your game piece around.<br><b>Goal: Get to Mulberry's and purchase a Butterfinger.</b>");
}

function test() {
	notify('<iframe width="100%" height="100%" style="position: absolute; left: 0px; top: 0px;" src="https://www.youtube.com/embed/oHg5SJYRHA0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>');
}
