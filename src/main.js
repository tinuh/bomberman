import kaboom from "kaboom";

// initialize context
kaboom({
	scale: 1,
});

//focus page if not focused
if (!isFocused()) {
	canvas.focus();
}

//load the background image and set as background
const loadBg = async () => {
	let bgImage = await loadSprite("background", "sprites/grass.png");

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
	loadSprite("bomb", "sprites/bomb.png");
	loadSprite("player", "sprites/character.png", {
		sliceX: 4,
		sliceY: 0,
		anims: {
			idle: { from: 0, to: 0 },
			run: { from: 1, to: 3 },
		},
	});
	loadSprite("boom", "sprites/explosion.png", {
		sliceX: 0,
		sliceY: 54,
		anims: {
			idle: { from: 0, to: 0 },
			explode: { from: 1, to: 53 },
		},
	});

	loadSprite("slime", "sprites/slime.png", {
		sliceX: 7,
		sliceY: 5,
		anims: {
			idle: { from: 0, to: 4 },
			death: { from: 28, to: 32 },
		},
	});
	loadSprite("breakableStone", "sprites/brick1.png");

	let level1 = [
		"====^==========",
		"=  =       =  =",
		"=    ^        =",
		"===       ^   =",
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
		"^": () => [
			sprite("breakableStone"),
			"breakableStone",
			pos(80, 40),
			area(),
			scale(0.16, 0.17),
			solid(),
		],
	});

	// add a character to screen
	const player = add([
		// list of components
		sprite("player", {
			animSpeed: 0.1,
		}),
		"player",
		pos(180, 140),
		health(10),
		origin("center"),
		area(),
		scale(3),
		solid(),
	]);

	const addSlime = () => {
		add([
			sprite("slime", {
				animSpeed: 1,
			}),
			"enemy",
			"slime",
			"pain",
			pos(180, 180),
			origin("center"),
			area({ width: 15, height: 12 }),
			origin(vec2(0, 0.25)),
			scale(3),
			solid(),
			{
				moveDir: RIGHT,
				dead: false,
			},
		]);
	};

	setInterval(() => {
		addSlime();
	}, 15000);

	addSlime();

	function placeBomb() {
		add([
			// list of components
			sprite("bomb", {
				animSpeed: 5,
			}),
			pos(vec2(player.pos.x - 3, player.pos.y + 15)),
			area(5),
			scale(0.2),
			area({ width: 120, height: 120 }),
			origin(vec2(-0.2, 0.3)),
			//solid(),
			color(255, 0, 0),
			"bomb",
			{
				fuse: 0,
			},
		]);
	}

	function explode(location) {
		for (let i = 0; i < 4; i++) {
			add([
				// list of components
				sprite("boom", {
					animSpeed: 5,
				}),
				"boom",
				"pain",
				pos(location.add(Math.sin(i * 90) * -10, -10 + Math.cos(i * 90) * 10)),
				area(
					i % 2 === 0 ? { width: 40, height: 10 } : { width: 10, height: 40 }
				),
				scale(2),
				origin(vec2(-0.3, 0.1)),
				color(255, 200, 0),
				cleanup(),
				{
					angle: i * 90,
					exploding: false,
				},
			]);
		}
	}

	function pointAt(distance, angle) {
		let radians = -1 * deg2rad(angle);
		return vec2(distance * Math.cos(radians), -distance * Math.sin(radians));
	}

	onCollide("player", "boom", () => {
		console.log("death");
	});

	onCollide("boom", "breakableStone", (boom, breakableStone) => {
		destroy(breakableStone);
	});

	onCollide("slime", "boom", (slime) => {
		slime.dead = true;
		slime.play("death");
		wait(0.8, () => {
			destroy(slime);
		});
	});

	player.onCollide("pain", () => {
		player.hurt(1);
		player.color = { r: 255, b: 0, g: 0 };
		wait(0.2, () => (player.color = { r: 255, b: 255, g: 255 }));
	});

	player.on("death", () => {
		destroy(player);
	});

	onUpdate("boom", (b) => {
		if (!b.exploding) {
			b.play("explode");
			if (b.angle === 180) {
				b.pos.x -= 10;
				b.area.offset.x -= 20;
				b.area.offset.y += 10;
			}
			if (b.angle === 90) {
				b.area.offset.y += 20;
			}
			b.exploding = true;
			b.time = 0;
		} else {
			b.time += 1;
			if (b.time < 10) {
				b.move(pointAt(300, b.angle));
			} else if (b.time > 30 && b.time < 80) {
				b.scale.x = b.scale.x * 0.9;
				b.scale.y = b.scale.y * 0.9;
			} else if (b.time > 80) {
				destroy(b);
			}
		}
	});

	let timer = 1;
	onUpdate("bomb", (b) => {
		if (timer === 60) {
			timer = 1;
		}
		timer += 1;
		if (timer % 13 === 0) {
			if (b.color.b === 255) {
				b.color = { r: 255, b: 0, g: 0 };
			} else {
				b.color = { r: 255, b: 255, g: 255 };
			}
		}
		b.fuse += 1;
		if (b.fuse > 80) {
			explode(b.pos);
			destroy(b);
		}
	});

	onUpdate("slime", (s) => {
		if (!s.dead) {
			animateMove(s, 7, 4);
			s.move(s.moveDir.scale(40));
			if (Math.random() < 0.005) {
				dirs = [RIGHT, LEFT, UP, DOWN];
				s.moveDir = dirs[Math.floor(Math.random() * dirs.length)];
			}
		}
	});

	let animationCount = 0;

	function animateMove(obj, animationSpeed, max) {
		//currently hardcoded
		if (animationCount % animationSpeed === 0) {
			if (obj.frame < max - 1) {
				obj.frame += 1;
			} else {
				obj.frame = 0;
			}
		}
		animationCount += 1;
	}

	onKeyPress("space", () => {
		placeBomb();
	});
	onKeyDown("right", () => {
		player.move(100, 0);
		animateMove(player, 5, 4);
	});
	onKeyDown("left", () => {
		player.move(-100, 0);
		animateMove(player, 5, 4);
	});
	onKeyDown("up", () => {
		player.move(0, -100);
		animateMove(player, 5, 4);
	});
	onKeyDown("down", () => {
		player.move(0, 100);
		animateMove(player, 5, 4);
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
