import kaboom from "kaboom"

// initialize context
kaboom({
  background: [145, 137, 137], // The RGB code
})

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
]

addLevel(level1, 
         {width: 70,
        height: 70,
        "=": () => [
          sprite("stone"),
	        pos(80, 40),
        	area(),
          scale(2.3),
          solid(),
        ]}
      )

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
])
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


// add a kaboom on mouse click and move the player
onClick(() => {
	addKaboom(mousePos())
  player.moveTo(mousePos())
})

// burp on "b"
onKeyPress("b", burp)
