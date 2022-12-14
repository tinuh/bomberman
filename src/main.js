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
	loadSprite("death", "sprites/characterDeath.png", {
		sliceX: 4,
		sliceY: 0,
		anims: {
			death: { from: 0, to: 3 },
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
	loadSprite("tankDeath", "sprites/tankDeath.png", {
		sliceX: 4,
		sliceY: 1,
		anims: {
			death: { from: 0, to: 3 },
		},
	});
	loadSprite("breakableStone", "sprites/brick1.png");
	loadSprite("bombs", "sprites/bomb.png");
	loadSprite("laser", "sprites/laser.png");
	loadSprite("heart", "sprites/heart.png");
	loadSprite("tank", "sprites/tank.png")
	scene("game", async ({level, scoreNum, playerHP}) => {
	//Wrap things inside the game
	await loadBg();

	console.log("NewHP", playerHP)

	const score = add([
		pos(90, 10),
		z(1),
		text("Score:" + scoreNum, {
			size: 24, // 48 pixels tall
			width: 320, // it'll wrap to next line when width exceeds this value
			font: "sink", // there're 4 built-in fonts: "apl386", "apl386o", "sink", and "sinko"
		}),
		{ value: scoreNum },
	]);
	add([sprite("bombs"), scale(0.175), pos(250, 0)]);
	const bombs = add([
		pos(290, 10),
		z(1),
		text("3", {
			size: 24,
			width: 320,
			font: "sink",
		}),
		{ value: 3 },
	]);
	add([sprite("heart"), scale(2), pos(315, -15)]);
	const playerHealth = add([
		pos(370, 10),
		z(1),
		text(playerHP, {
			size: 24,
			width: 320,
			font: "sink",
		}),
		{ value: playerHP },
	]);
	setInterval(() => {
		if (bombs.value < 3) {
			bombs.value++;
			bombs.text = bombs.value;
		}
	}, 2000);

	let levels = [[
		"===============",
		"=   =    =    =",
		"=^^  ==^ ^ s  =",
		"= = = ^  ^^==^=",
		"= s   ^s  ^   =",
		"==   ==  ^   ^=",
		"=^^s ^   ^  = =",
		"=     =^= s   =",
		"===============",
	],[
		"===============",
		"=  =  = ^  = x=",
		"=    ^=       =",
		"===    s  ^^=^=",
		"=s    ==  ^   =",
		"=  =^ s    =  =",
		"=    ^ =  s  ==",
		"= ^    =s =  s=",
		"===============",
	],[
		"===============",
		"=   =      ^  =",
		"=     = ^=   ^=",
		"==    =   ^  ^=",
		"= ^^  =    x  =",
		"=    =^  ==   =",
		"==  x    =  ^ =",
		"=   =^   ^ x  =",
		"===============",
	],[
		"===============",
		"=  ^ ^ ^  s^^^=",
		"=  ^ ^ ^^^^^ ^=",
		"=^^^ ^s^  ^  ^=",
		"= s  ^ ^  ^s^^=",
		"=^^^^^^^ s^ ^ =",
		"=  s   ^^^^^^ =",
		"=  ^^^^^s^   x=",
		"===============",
	],[
		"===============",
		"=     =       =",
		"=== === == == =",
		"=    s= =s  =s=",
		"= =====x=== ===",
		"= =  s==      =",
		"=   ===  = = ==",
		"= =     =s = s=",
		"===============",
	]]

	addLevel(levels[level], {
		width: 70,
		height: 70,
		"=": () => [
			sprite("stone"),
			"wall",
			pos(80, 40),
			area(),
			scale(2.3),
			solid(),
		],
		"^": () => [
			sprite("breakableStone"),
			"breakableStone",
			"wall",
			pos(80, 40),
			area(),
			scale(0.16, 0.17),
			solid(),
		],
		"s": () => [
			sprite("slime", {
				animSpeed: 1,
			}),
			"enemy",
			"slime",
			"pain",
			"mobile",
			pos(100, 100),
			z(3),
			origin("center"),
			area({ width: 15, height: 12 }),
			origin(vec2(0, 0.25)),
			scale(3),
			solid(),
			{
				moveDir: RIGHT,
				dead: false,
				oneMove: 0,
				moving: true,
				frame_max: 4,
				anim_timer: 0,
				move_anim_speed: 8,
			},
		],
		"x": () => [
			sprite("tank", {
				animSpeed: 1,
			}),
			"enemy",
			"turret",
			"pain",
			pos(120, 80),
			z(3),
			origin("center"),
			area({ width: 200, height: 200 }),
			origin(vec2(0, 0.25)),
			scale(0.2),
			solid(),
			{
				moveDir: RIGHT,
				dead: false,
				oneMove: 0,
				moving: true,
				frame_max: 4,
				anim_timer: 0,
				move_anim_speed: 8,
				shoot_time: 0,
				shoot_speed: 100,
			},
		],
	});

	onCollide("turret", "boom", (turret) => {
		if (turret.dead === false) {
			turret.dead = true;
			enemyCount -= 1
			const tankDeath = add([
				// list of components
				sprite("tankDeath", {
					animSpeed: 1,
				}),
				"turret",
				pos(turret.pos.x, turret.pos.y),
				health(10),
				origin(vec2(0, 0.25)),
				area(),
				scale(0.2),
				{
					moving: true,
					frame_max: 3,
					anim_timer: 0,
					move_anim_speed: 4,
				},
			]);
			destroy(turret)
			tankDeath.play("death");
			wait(0.8, () => {
				destroy(tankDeath);
			});
			score.value += 3;
			score.text = `Score:${score.value}`;
		}
	});

	let enemyCount = 0
	for(let i = 0; i<levels[level].length; i++){
		enemyCount += levels[level][i].split("s").length - 1
		enemyCount += levels[level][i].split("x").length - 1
	}
	console.log(enemyCount)

	//Direction function, from Replit Kaboom Guide
	function pointAt(distance, angle) {
		let radians = -1 * deg2rad(angle);
		return vec2(distance * Math.cos(radians), -distance * Math.sin(radians));
	}

	// add a character to screen
	const player = add([
		// list of components
		sprite("player", {
			animSpeed: 0.1,
		}),
		"player",
		"mobile",
		pos(180, 140),
		health(playerHP),
		origin("center"),
		area(),
		scale(3),
		solid(),
		{
			moving: false,
			frame_max: 4,
			anim_timer: 0,
			move_anim_speed: 10,
			damage_down: 0,
		},
	]);

	const addSlime = (x, y) => {
		enemyCount += 1
		add([
			sprite("slime", {
				animSpeed: 1,
			}),
			"enemy",
			"slime",
			"pain",
			"mobile",
			pos(x, y),
			z(3),
			origin("center"),
			area({ width: 15, height: 12 }),
			origin(vec2(0, 0.25)),
			scale(3),
			solid(),
			{
				moveDir: RIGHT,
				dead: false,
				oneMove: 0,
				moving: true,
				frame_max: 4,
				anim_timer: 0,
				move_anim_speed: 8,
			},
		]);
	};

	//Setinterval method for if slimes spawn constantly
	setInterval(() => {
		let x = Math.random() * 1000;
		let y = Math.random() * 600;

		//check if x and y are within 100 of player.pos.x and player.pos.y
		//if they are, generate new x and y
		while (
			(x > player.pos.x - 100 && x < player.pos.x + 100) ||
			(y > player.pos.y - 100 && y < player.pos.y + 100)
		) {
			x = Math.random() * 1000;
			y = Math.random() * 600;
		}
		//addSlime(200 + Math.random() * 400, 200 + Math.random() * 200);
	}, 8000);

	//addSlime(1000, 600);

	function placeBomb() {
		if (bombs.value <= 0) return;
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
		bombs.value--;
		bombs.text = bombs.value;
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

	onCollide("player", "boom", () => {
		console.log("death");
	});

	onCollide("boom", "breakableStone", (boom, breakableStone) => {
		destroy(breakableStone);
	});

	onCollide("slime", "wall", (slime) => {
		if (slime.oneMove <= 0) {
			slime.oneMove += 1;
			switch (slime.moveDir) {
				case LEFT:
					slime.moveDir = RIGHT;
					slime.move(RIGHT.scale(100));
					break;
				case RIGHT:
					slime.moveDir = LEFT;
					slime.move(RIGHT.scale(100));
					break;
				case DOWN:
					slime.moveDir = UP;
					slime.move(UP.scale(100));
					break;
				case UP:
					slime.moveDir = DOWN;
					slime.move(DOWN.scale(100));
					break;
			}
		}
		slime.oneMove -= 0.1;
	});

	onCollide("slime", "boom", (slime) => {
		if (slime.dead === false) {
			slime.dead = true;
			enemyCount -= 1
			slime.play("death");
			score.value += 1;
			score.text = `Score:${score.value}`;
			wait(0.8, () => {
				destroy(slime);
			});
		}
	});

	player.onCollide("pain", (pain) => {
		if(player.damage_down <= 0){
			playerHealth.value -= 1
			playerHealth.text = playerHealth.value
			player.hurt(1);
			player.color = { r: 255, b: 0, g: 0 };
			player.damage_down = 1
			wait(0.2, () => {
				player.color = { r: 255, b: 255, g: 255 }
				player.damage_down = 0
			});
		}
		if(pain.is("laser")){
			destroy(pain)
		}
	});

	player.on("death", () => {
		destroy(player);
		const death = add([
			// list of components
			sprite("death", {
				animSpeed: 1,
			}),
			pos(player.pos.x, player.pos.y),
			health(10),
			origin("center"),
			area(),
			scale(3),
			{
				moving: true,
				frame_max: 4,
				anim_timer: 0,
				move_anim_speed: 4,
			},
		]);
		death.play("death");
		const NICE = add([
			pos(300, 240),
			z(1),
			text("GAME OVER", {
				size: 100,
				width: 700,
				font: "sink",
			}),
		]);
		wait(3, async () => {await go("game", {level: 0, scoreNum:0, playerHP:10})})
	});

	onUpdate(() => {
		if(enemyCount <= 0){
			enemyCount = 10000
			const NICE = add([
				pos(290, 240),
				z(1),
				text(" MISSION COMPLETED", {
					size: 100,
					width: 700,
					font: "sink",
				}),
			]);
			let NextLvl = level + 1 < levels.length ? level + 1 : 0
			wait(3, async () => {
				console.log("Score", scoreNum)
				await go("game", {level: NextLvl, scoreNum:score.value, playerHP:playerHealth.value})
			})
		}
	})

	onUpdate("turret", (t) => {
		let a = Math.atan2(player.pos.y - t.pos.y, player.pos.x - t.pos.x)*(180/Math.PI)
		t.angle = a+90
		t.shoot_time -= 1
		if(t.shoot_time <= 0 && !t.dead){
			t.shoot_time = t.shoot_speed
			add([
				// list of components
				sprite("laser", {
					animSpeed: 5,
				}),
				"laser",
				"pain",
				pos(t.pos.x, t.pos.y),
				area({ width: 5, height: 5 }),
				origin("center"),
				scale(2),
				cleanup(),
				{
					angle: a,
					bulletSpeed: 200,
				},
			]);
		}
	})

	onUpdate("laser", (laser) => {
		laser.move(pointAt(laser.bulletSpeed, laser.angle))
	})

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
			} else if (b.time > 30 && b.time < 60) {
				b.scale.x = b.scale.x * 0.9;
				b.scale.y = b.scale.y * 0.9;
			} else if (b.time > 60) {
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
			s.move(s.moveDir.scale(40));
			if (Math.random() < 0.005) {
				dirs = [RIGHT, LEFT, UP, DOWN];
				s.moveDir = dirs[Math.floor(Math.random() * dirs.length)];
			}
		}
	});

	onUpdate("mobile", (obj) => {
		if (!obj.dead) {
			if (obj.moving && obj.anim_timer <= 0) {
				if (obj.frame < obj.frame_max - 1) {
					obj.frame += 1;
				} else {
					obj.frame = 0;
				}
				obj.anim_timer = obj.move_anim_speed;
			}
			obj.anim_timer -= 1;
		}
	});

	onKeyPress("space", () => {
		if(playerHealth.value > 0){
			placeBomb();
		}
	});
	onKeyDown("right", () => {
		player.move(100, 0);
		player.moving = true;
	});
	onKeyDown("left", () => {
		player.move(-100, 0);
		player.moving = true;
	});
	onKeyDown("up", () => {
		player.move(0, -100);
		player.moving = true;
	});
	onKeyDown("down", () => {
		player.move(0, 100);
		player.moving = true;
	});
	onKeyRelease("right", () => {
		player.play("idle");
		player.moving = false;
	});
	onKeyRelease("left", () => {
		player.play("idle");
		player.moving = false;
	});
	onKeyRelease("up", () => {
		player.play("idle");
		player.moving = false;
	});
	onKeyRelease("down", () => {
		player.play("idle");
		player.moving = false;
	});
})
go("game", {level: 0, scoreNum:0, playerHP:10})
};
init();
