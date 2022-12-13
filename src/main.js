import kaboom from "kaboom";

kaboom({
	background: [51, 151, 255], // The RGB code
});

loadSprite("bean", "sprites/bean.png");

const bean = add([pos(120, 80), sprite("bean"), area()]);

onClick(() => addKaboom(mousePos()));

onKeyDown("right", () => {
	bean.move(100, 0);
});

onKeyDown("left", () => {
	bean.move(-100, 0);
});

onKeyDown("down", () => {
	bean.move(0, 100);
});

onKeyDown("up", () => {
	bean.move(0, -100);
});
