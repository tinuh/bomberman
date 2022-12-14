import kaboom from "kaboom";

// initialize context
kaboom();

//focus page if not focused
if (!isFocused()) {
	canvas.focus();
}

//load the background image and set as background
const loadBg = async () => {
	let bgImage = await loadSprite("background", "/sprites/grass.png");

	let background = add([
		sprite("background"),
		// Make the background centered on the screen
		pos(width() / 2, height() / 2),
		origin("center"),
		// Allow the background to be scaled
		scale(1),
		// Keep the background position fixed even when the camera moves
		fixed(),
	]);

	await background.scaleTo(
		Math.max(width() / bgImage.tex.width, height() / bgImage.tex.height)
	);
};

const init = async () => {
	await loadBg();

	// load assets
	loadSprite("bean", "sprites/bean.png");
	loadSprite("stone", "sprites/StoneGround.png");
	loadSprite("player", "sprites/character.png", {
		sliceX: 4,
		sliceY: 0,
		anims: {
			idle: { from: 0, to: 0 },
			run: { from: 1, to: 3 },
		},
	});

	let level1 = [
		"===============",
		"=  =       =  =",
		"=    =        =",
		"===       =   =",
		"=      =      =",
		"=  =       =  =",
		"=      =     ==",
		"=      =  =   =",
		"===============",
	];

	addLevel(level1, {
		width: 70,
		height: 70,
		"=": () => [sprite("stone"), pos(80, 40), area(), scale(2.3), solid()],
	});

	// add a character to screen
	const player = add([
		// list of components
		sprite("player", {
			animSpeed: 0.1,
		}),
		pos(160, 120),
		area(),
		scale(3),
		solid(),
	]);
	let animationSpeed = 0;

	function animateMove() {
		//currently hardcoded
		if (animationSpeed % 5 === 0) {
			if (player.frame < 3) {
				player.frame += 1;
			} else {
				player.frame = 1;
			}
		}
		animationSpeed += 1;
	}

	onKeyDown("right", () => {
		player.move(100, 0);
		animateMove();
	});
	onKeyDown("left", () => {
		player.move(-100, 0);
		animateMove();
	});
	onKeyDown("up", () => {
		player.move(0, -100);
		animateMove();
	});
	onKeyDown("down", () => {
		player.move(0, 100);
		animateMove();
	});
	onKeyRelease("right", () => {
		player.play("idle");
	});
	onKeyRelease("left", () => {
		player.play("idle");
	});
	onKeyRelease("up", () => {
		player.play("idle");
	});
	onKeyRelease("down", () => {
		player.play("idle");
	});
};

init();
