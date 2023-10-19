const gameOptions = {
	triangleBase: 70,
	birdSpeed: 7,
	jumpForce: 10,
	bestScoreKey: 'spikesBestScore',
}
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: gameOptions.triangleBase * 9.5,
		height: gameOptions.triangleBase * 15.5,
		type: Phaser.AUTO,
		transparent: true,
		parent: 'game-division',
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
		audio: {
			disableWebAudio: false
		},
		dom: {
			createContainer: true
		},
		physics: {
			default: 'matter',
			matter: {
				debug: false,
				gravity: {
					y: 0
				},
			}
		}
	});

	const resize = () => {
		var canvas = document.querySelector("canvas");
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var windowRatio = windowWidth / windowHeight;
		var gameRatio = game.config.width / game.config.height;
		if (windowRatio < gameRatio) {
			canvas.style.width = windowWidth + "px";
			canvas.style.height = (windowWidth / gameRatio) + "px";
		}
		else {
			canvas.style.width = (windowHeight * gameRatio) + "px";
			canvas.style.height = windowHeight + "px";
		}
	}

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);

	window.focus();
	resize();
	window.addEventListener("resize", resize, false);
});

class Boot extends Phaser.Scene {

	preload() {

		this.load.pack("pack", "assets/preload-asset-pack.json");

		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
	}
}