
// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// progress
		const progress = this.add.text(540, 960, "", {});
		progress.setOrigin(0.5, 0.5);
		progress.text = "0%";
		progress.setStyle({ "color": "#000", "fontFamily": "NewsCrewJNL", "fontSize": "100px" });

		// progress (components)
		new PreloadText(progress);

		this.progress = progress;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Text} */
	progress;

	/* START-USER-CODE */

	// Write your code here

	preload() {

		this.editorCreate();

		this.editorPreload();

		this.progress.setPosition(this.game.config.width / 2, this.game.config.height / 2);

		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Level"));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
