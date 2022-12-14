import kaboom from "kaboom";

// initialize context
kaboom();

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
loadSprite("bean", "sprites/bean.png")
loadSprite("stone", "sprites/StoneGround.png")
loadSprite("player", 'sprites/character.png', {
	sliceX: 4,
	sliceY: 0,
	anims: {
		idle: { from: 0, to: 0 },
		run: { from: 1, to: 3 }
	}
})
loadSprite("enemy", "sprites/floateye.png", {
  sliceX: 3,
  sliceY: 3,
  anims: {
    idle: { from: 0, to: 2 },
    run: { from: 3, to: 5 },
  },
})
loadSprite("boom", "sprites/explosion.png", {
  sliceX: 0,
  sliceY: 54,
	anims: {
		idle: { from: 0, to: 0 },
		explode: { from: 1, to: 53 }
	}
})

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
  "player",
	pos(180, 140),
  origin("center"),
	area(),
  scale(3),
  solid(),
])

function placeBomb(){
  add([
    // list of components
    sprite("bomb", {
        animSpeed: 5,
      }),
    pos(vec2(player.pos.x-3, player.pos.y+15)),
    area(5),
    scale(0.2),
    area({ width: 120, height: 120 }),
    origin(vec2(-0.2, 0.3)),
    //solid(),
    color(255, 0, 0),
    "bomb",
    {
      fuse:0,
    }
  ])
}

function explode(location){
  for(let i = 0; i < 4; i++){
    add([
      // list of components
      sprite("boom", {
          animSpeed: 5,
        }),
      "boom",
      pos(location),
      area({ width: 40, height: 20 }),
      origin(vec2(-0.3, 0.1)),
      scale(2),
      color(255, 200, 0),
      cleanup(),
      {
        angle: i*90,
        exploding: false
      }
    ])
  }
}

function pointAt(distance, angle) {
  let radians = -1*deg2rad(angle);
  return vec2(distance * Math.cos(radians), -distance * Math.sin(radians));
}

onUpdate("boom", (b) => {
  if(!b.exploding){
    b.play("explode")
    b.exploding = true
    b.time = 0;
  }
  else{
    b.time += 1
    if(b.time < 10){
      b.move(pointAt(300, b.angle))
    }
    else if(b.time > 30 && b.time < 140){
      b.scale.x = b.scale.x*0.9
      b.scale.y = b.scale.y*0.9
    }
    else if(b.time > 140){
      destroy(b)
    }
  }
})

let timer = 1
onUpdate("bomb", (b) => {
  console.log(b)
  if(timer === 60){
    timer = 1
  }
  timer += 1
  if(timer % 13 === 0){
    if(b.color.b === 255){
      b.color = {r:255, b:0, g:0}
    }
    else{
      b.color = {r:255, b:255, g:255}
    }
  }
  b.fuse += 1
  if(b.fuse > 80){
    explode(b.pos)
    destroy(b)
  }
})

let animationSpeed = 0

function animateMove(){
  //currently hardcoded
  if(animationSpeed % 5 === 0){
    if(player.frame < 3){
    player.frame += 1
    }
    else{
      player.frame = 1
    }
  }
  animationSpeed += 1
}

onKeyPress("space", () => {
  placeBomb()
})
onKeyDown("right", () => {
    player.move(100, 0)
    animateMove()
})
onKeyDown("left", () => {
    player.move(-100, 0)
    animateMove()
})
onKeyDown("up", () => {
    player.move(0, -100)
    animateMove()
})
onKeyDown("down", () => {
    player.move(0, 100)
    animateMove()
})
onKeyRelease("right", () => {
    player.play("idle")
})
onKeyRelease("left", () => {
    player.play("idle")
})
onKeyRelease("up", () => {
    player.play("idle")
})
onKeyRelease("down", () => {
    player.play("idle")
})

init();
