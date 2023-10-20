// You can write more code here
/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */
	setColors = () => {
		this.nCurrentColorIndex++;
		if (this.nCurrentColorIndex >= this.aBGColor.length) {
			this.nCurrentColorIndex = 0;
		}
		document.body.style.backgroundColor = this.aBGColor[this.nCurrentColorIndex];
		this.gameWalls.forEach(wall => {
			wall.setTint(this.aSpikeColor[this.nCurrentColorIndex]);
		})
		this.topSpikes.forEach(spike => {
			spike.setTint(this.aSpikeColor[this.nCurrentColorIndex]);
		});
		this.bottomSpikes.forEach(spike => {
			spike.setTint(this.aSpikeColor[this.nCurrentColorIndex]);
		});
		this.leftSpikes.forEach(spike => {
			spike.setTint(this.aSpikeColor[this.nCurrentColorIndex]);
		});
		this.rightSpikes.forEach(spike => {
			spike.setTint(this.aSpikeColor[this.nCurrentColorIndex]);
		});
		this.txt_score.setColor(this.aBGColor[this.nCurrentColorIndex]);
	}
	birdParticles = () => {
		const particle = this.add.particles("particle");
		const emitter = particle.createEmitter({
			scale: { start: 0.3, end: 0 },
			lifespan: 500,
			frequency: 100,
			quantity: 1,
			particleBringToTop: false,
		})
		emitter.startFollow(this.bird);
		this.bird.emitter = emitter;
	}
	setScoreUI = () => {
		const score_bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, "circle");
		this.txt_score = this.add.text(score_bg.x, score_bg.y, "00", {
			fontSize: 180,
			fontFamily: "NewsCrewJNL",
			align: "center",
		}).setOrigin(0.5).setAlpha(0);
	}
	setHomeUI = () => {
		const center = { x: this.game.config.width / 2, y: this.game.config.height / 2 };
		const txt_info = this.add.text(center.x, center.y - 100, "TAP\nTO JUMP", {
			"color": "#FF3464",
			"fontFamily": "NewsCrewJNL",
			"fontSize": "44px",
			"align": "center",
		}).setOrigin(0.5);
		this.container_home.add(txt_info);

		const txt_title = this.add.text(center.x, center.y / 3.5, "DON'T TOUCH\nTHE SPIKES", {
			"color": "#697F8A",
			"fontFamily": "NewsCrewJNL",
			"fontSize": "60px",
			"align": "center",
		}).setOrigin(0.5);
		this.container_home.add(txt_title);

		this.nBestScore = localStorage.getItem(gameOptions.bestScoreKey) || 0;
		const txt_best_score = this.add.text(center.x, center.y + center.y / 1.5, "BEST SCORE : " + this.nBestScore, {
			"color": "#697F8A",
			"fontFamily": "NewsCrewJNL",
			"fontSize": "40px",
			"align": "center",
		}).setOrigin(0.5);
		this.container_home.add(txt_best_score);
		this.container_home.setAlpha(0);
		this.tweens.add({
			targets: this.container_home,
			alpha: 1,
			duration: 600,
		});
	}
	startGame = () => {
		this.isGameStarted = true;
		this.birdTween.stop();
		this.matter.world.setGravity(0, 1);
		this.bird.setVelocity(gameOptions.birdSpeed, 0);
		this.birdParticles();
		this.tweens.add({
			targets: this.container_home,
			alpha: 0,
			duration: 600,
			onComplete: () => {
				this.container_home.setVisible(false);
			}
		});
		this.tweens.add({
			targets: this.txt_score,
			alpha: 1,
			duration: 600,
		});
	}
	gameOver = () => {
		if (this.nScore > this.nBestScore) {
			localStorage.setItem(gameOptions.bestScoreKey, this.nScore);
		}
		this.isGameOver = true;
		this.bird.emitter.remove();
		this.tweens.add({
			targets: this.bird,
			alpha: 0,
			duration: 500,
			onComplete: () => {
				this.scene.restart("Level");
			}
		})
	}
	updateScore = () => {
		this.nScore++;
		this.txt_score.setText(this.nScore < 10 ? "0" + this.nScore : this.nScore);
		if (this.nScore % 3 == 0) this.setColors();
	}
	create() {
		this.editorCreate();
		this.aSpikeColor = [0x697F8A, 0x898C89, 0x8B786C, 0x73708A, 0x7D896B, 0xFDFFFD, 0x42B7EF, 0x83DB00];
		this.aBGColor = ["#DFECEF", "#EBEDEB", "#F5ECE1", "#E8E6F5", "#E8F1DF", "#7A7D7A", "#236C8F", "#267F00"];
		this.setScoreUI();
		this.container_home = this.add.container(0, 0);
		this.setHomeUI();
		const spikeDistance = gameOptions.triangleBase * 1.25;
		this.nCurrentColorIndex = -1;
		this.isGameStarted = false;
		this.isGameOver = false;
		this.nScore = 0;
		this.leftSpikes = [];
		this.rightSpikes = [];
		this.topSpikes = [];
		this.bottomSpikes = [];
		this.gameWalls = [];
		for (let i = 0; i < 11; i++) {
			if (i < 7) {
				this.bottomSpikes.push(this.addSpike(gameOptions.triangleBase + i * spikeDistance, this.game.config.height - gameOptions.triangleBase / 2));
				this.topSpikes.push(this.addSpike(gameOptions.triangleBase + i * spikeDistance, gameOptions.triangleBase / 2));
			}
			this.leftSpikes.push(this.addSpike(- gameOptions.triangleBase / 4, gameOptions.triangleBase * 1.5 + i * spikeDistance));
			this.rightSpikes.push(this.addSpike(this.game.config.width + gameOptions.triangleBase / 4, gameOptions.triangleBase * 1.5 + i * spikeDistance));
		}
		this.addWall(gameOptions.triangleBase / 4, this.game.config.height / 2, gameOptions.triangleBase / 2, this.game.config.height, "leftwall");
		this.addWall(this.game.config.width - gameOptions.triangleBase / 4, this.game.config.height / 2, gameOptions.triangleBase / 2, this.game.config.height, "rightwall");
		this.addWall(this.game.config.width / 2, gameOptions.triangleBase / 4, this.game.config.width - gameOptions.triangleBase, gameOptions.triangleBase / 69, "");
		this.addWall(this.game.config.width / 2, this.game.config.height - gameOptions.triangleBase / 4, this.game.config.width - gameOptions.triangleBase, gameOptions.triangleBase / 69, "");

		this.setColors();

		const ballTexture = this.textures.get("bird");
		this.bird = this.matter.add.sprite(this.game.config.width / 2, (this.game.config.height / 2) - 30, "bird", 1, { label: "ball" });
		this.bird.setDepth(1);
		this.bird.setScale(gameOptions.triangleBase / (ballTexture.source[0].width / 2.5));
		this.bird.setBody({
			type: "circle",
			radius: gameOptions.triangleBase / 2,
		});
		this.birdTween = this.tweens.add({
			targets: this.bird,
			y: (this.game.config.height / 2) + 30,
			yoyo: true,
			duration: 500,
			repeat: -1
		})

		this.input.on("pointerdown", this.jump, this);
		this.input.on("pointerup", () => {
			// this.bird.setTexture('bird', 0);
		}, this);

		this.matter.world.on("collisionstart", (e, b1, b2) => {
			if (b1.label == "spike" || b2.label == "spike") {
				this.gameOver();
			}
			if (b1.label == "leftwall" || b2.label == "leftwall") {
				this.updateScore();
				this.setSpikes(true);
				this.bird.setVelocity(gameOptions.birdSpeed, this.bird.body.velocity.y);
				this.bird.flipX = false;
			}
			if (b1.label == "rightwall" || b2.label == "rightwall") {
				this.updateScore();
				this.setSpikes(false);
				this.bird.setVelocity(-gameOptions.birdSpeed, this.bird.body.velocity.y);
				this.bird.flipX = true;
			}
		}, this);
	}
	addWall = (x, y, w, h, label) => {
		const wallTexture = this.textures.get("wall");
		const wall = this.matter.add.image(x, y, "wall", null, {
			isStatic: true,
			label: label
		});
		this.gameWalls.push(wall);
		wall.setScale(w / wallTexture.source[0].width, h / wallTexture.source[0].width);
	}
	addSpike = (x, y) => {
		const spikeTexture = this.textures.get("spike");
		const squareSize = gameOptions.triangleBase / Math.sqrt(2);
		const squareScale = squareSize / spikeTexture.source[0].width;
		const spike = this.matter.add.image(x, y, "spike", null, {
			isStatic: true,
			label: "spike"
		});
		spike.setScale(squareScale);
		spike.rotation = Math.PI / 4;
		return spike;
	}
	setSpikes = (isRight) => {
		for (let i = 0; i < 11; i++) {
			if (isRight) {
				this.rightSpikes[i].x = this.game.config.width + gameOptions.triangleBase / 4;
			}
			else {
				this.leftSpikes[i].x = -gameOptions.triangleBase / 4;
			}
		}
		const randomPositions = Phaser.Utils.Array.NumberArray(0, 10);
		const numberOfSpikes = Phaser.Math.Between(3, 6);
		for (let i = 0; i < numberOfSpikes; i++) {
			let randomSpike = Phaser.Utils.Array.RemoveRandomElement(randomPositions);
			if (isRight) {
				this.rightSpikes[randomSpike].x = this.game.config.width - gameOptions.triangleBase / 2;
			}
			else {
				this.leftSpikes[randomSpike].x = gameOptions.triangleBase / 2;
			}
		}
	}
	jump = () => {
		if (!this.isGameStarted) {
			this.startGame();
		}
		if (!this.isGameOver) {
			this.bird.setVelocity((this.bird.body.velocity.x > 0) ? gameOptions.birdSpeed : -gameOptions.birdSpeed, -gameOptions.jumpForce);
		}
	}
	update() {
		if (!this.isGameOver) this.bird.setAngularVelocity(0);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
