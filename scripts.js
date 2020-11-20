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
var active = false; //if the game is active, off until game starts
var hit = false; //if the block has been hit
var blockSpeed = 1; //speed the blocks move, in px/ms
var speed = 1.25; //speed of block in px/ms
var y = 0; //position of gamepiece vertically
var x = 0; //position of gp horizontally
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
function isTouching(r1, r2) { //returns true if the two parameter elements are touching each other
	var r1box = r1.getBoundingClientRect();
	var r2box = r2.getBoundingClientRect();
	return !(r2box.left > r1box.left + r1.offsetWidth ||
		r2box.left + r2.offsetWidth < r1box.left ||
		r2box.top > r1box.top + r1.offsetHeight ||
		r2box.top + r2.offsetHeight < r1box.top);
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
		y += forwardSpeed - backSpeed;
		x += rightSpeed - leftSpeed; //moves the block's position (x and y) by the movement speed in each direction


		gp.style.bottom = y + 'px';
		gp.style.left = x + 'px'; //actually sets the position from the vars
		for (i = 0; i < obs.length; i++) { //iterates through all obstacles
			if (isTouching(document.getElementsByClassName('obstacle')[i], document.getElementById('gamepiece'))) { //if the obstacle touches the gamepiece
				backSpeed = 0;
				forwardSpeed = 0;
				rightSpeed = 0;
				leftSpeed = 0;
			}
		}
		if (events) {
			if (isTouching(gp, document.getElementById("mulberries"))) {
				movement = false;
				document.getElementById("storefront").style.display = "block";
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
				document.getElementById("savagesays").innerText = "You're " + (-1 * time) + " milliseconds late. Take a " + penalty + "% reduction in your grade.";
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
						}, 1000); //Give the player one second to get out of the zone
					}
				}
			}
		}
	}
	if (inclass) {
		document.getElementById("powerUpsDisplay").innerHTML = "<p>Honors Chemistry Grade:" + grade + "% Passing Period Starts In: " + Math.floor(time / 1000) + "s</p>";
		time -= 10;
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
		backSpeed = speed;
	}
	if (event.key == 'w') { // same as 's'	
		forwardSpeed = speed;
	}
	if (event.key == 'a') { // same as 's'
		leftSpeed = speed;
	}
	if (event.key == 'd') { // same as 's'	
		rightSpeed = speed;
	}
});

document.addEventListener("keyup", function (event) { // stop when the key is released
	if (event.key == 's') { //same as keydown function, but stops the movement when the key is released
		backSpeed = 0;
		if (mode == 2) {
			backSpeed = 1;
		}
	}
	if (event.key == 'w') {
		forwardSpeed = 0;
		if (mode == 3) {
			forwardSpeed = 1;
		}
	}
	if (event.key == 'a') {
		leftSpeed = 0;
	}
	if (event.key == 'd') {
		rightSpeed = 0;
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

}

function buyPepper() {
	if (money < 5) {
		alert("Not Enough Money!");
	} else {
		pepper++;
		money -= 5;
	}

}

function buyButter() {
	if (money < 3) {
		alert("Not Enough Money!");
	} else {
		butterfingers++;
		money -= 3;
	}

}

function leaveMulberries() {
	document.getElementById("storefront").style.display = "none";
	y -= 10;
	movement = true;
}

function getSavaged(penalty) {
	grade -= penalty;
	//Start the next round
	if (day == days) {
		endGame();
	} else {
		day++;
		x = 0;
		y = 0;
		if (Math.floor(Math.random() * 2) == 0) {
			document.getElementById("sectionsDivider").innerHTML = "<h1>Passing Perriod</h1>";
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
					time = 60;
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
					time = 30;
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
			document.getElementById("savagesays").innerText = "Hmm... Maybe i'm being a bit too harsh. I'll let you go this time but just don't do it again.";
			document.getElementById("acceptGrade").innerText = "Say \"Thank You Mr. Savage\"";
			document.getElementById("acceptGrade").onclick = function () {
				getSavaged(0)
			};
		}
	} else if (time > 0) {
		alert("You can't bribe Mr. Savage unless you're late!")
	} else {
		alert("You don't have any Dr. Pepper!");
	}
}

function bribeButter() {
	if (butterfingers > 0) {
		butterfingers -= 1;
		if (Math.floor(Math.random() * 5) == 0) {
			//One in five chance he accepts the bribe
			document.getElementById("savagesays").innerText = "Hmm... Maybe i'm being a bit too harsh. I'll let you go this time but just don't do it again.";
			document.getElementById("acceptGrade").innerText = "Say \"Thank You Mr. Savage\"";
			document.getElementById("acceptGrade").onclick = function () {
				getSavaged(0)
			};
		}
	} else if (time > 0) {
		alert("You can't bribe Mr. Savage unless you're late!")
	} else {
		alert("you don't have any Butterfingers!");
	}
}

function pushThrough() {
	movement = true;
	document.getElementById("slowkidsactions").style.display = "none";
	setTimeout(function () {
		canBeSlowed = true;
	}, 3000);
	popularity -= 5;
}

function sellButter() {
	if (butterfingers > 0) {
		movement = true;
		document.getElementById("slowkidsactions").style.display = "none";
		setTimeout(function () {
			canBeSlowed = true;
		}, 3000);
		butterfingers -= 1;
		popularity += 1;
		money += 4;
		time -= 35000;
	} else {
		alert("You have no Butterfingers!")
	}
}

function walkBehind() {
	movement = true;
	document.getElementById("slowkidsactions").style.display = "none";
	setTimeout(function () {
		canBeSlowed = true;
	}, 3000);
	time -= -30000;
}
