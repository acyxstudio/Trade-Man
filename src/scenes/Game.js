import Phaser from '../lib/phaser.js'
import Star from '../game/Star.js'

 export default class Game extends Phaser.Scene
 {
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    walls;

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    blocks;

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors;

    /** @type {Phaser.Physics.Arcade.Group} */
    stars;
    
    /** @type {Phaser.Physics.Arcade.Group} */
    bombs;
    
    /** @type {Phaser.Physics.Arcade.Group} */
    ghosts;
    
    /** @type {Phaser.Physics.Arcade.Group} */
    stamina;
    
    /** @type {Phaser.GameObjects.Text} */
    scoreText;

    /**
     * General vars
     */
    score = 0;
    spawnEnemies = false;
    scaleRate = window.devicePixelRatio / 3;
    
    constructor()
    {
        super('playScene')  /* UID of Scene */
    }

    /**
     * Init() is called before preload() so is a good place to init vars 
     */
    init() {
        this.score = 0;
    }

    /**
     * All assets needs to be preload before be used in the scene
     */
    preload()
    {
        /**
         * background Image
         */        
        this.load.image('background', 'assets/Background/Maze_layer1.png');
        /**
         * Plaforms Icon
         */
        this.load.image('platform', 'assets/Environment/Platform_empty.png');
        /**
         * Plaforms Icon
         */
        this.load.image('block', 'assets/Environment/Block_empty.png');
        /**
         * Player
         */
        this.load.image('player', 'assets/Players/Hero.png');
        /**
         * Get Stars
         */
        this.load.image('star', 'assets/Items/Star.png');
        /**
         * Get Ghost
         */
        this.load.image('ghost', 'assets/Enemies/Ghost.png');
        /**
         * Get stamina
         */
        this.load.image('stamina', 'assets/Items/Red-Vitamin.png');
        /**
         * Get Touch areas
         */
        this.load.image('horizontalTouch', 'assets/HUD/BtnH.png');
        this.load.image('verticalTouch', 'assets/HUD/BtnV.png');
        /**
         * load audio
         */
        this.load.audio('jump', 'assets/Sfx/audio/phaseJump1.ogg');
         /**
          * Get keyboard keys
          */
        this.cursors = this.input.keyboard.createCursorKeys();
   

    }
    /**
    * Only assets loaded before will be hooked  by create()  
    */
    create()
    {
        /** Add background and keep it from scroll down with the camera */
        this.add.image(360, 640, 'background').setScrollFactor(0,0);
 
        /**
         * Create a Group of walls 
         */
        this.walls = this.physics.add.staticGroup();
        /**
         * Create n walls from the group
         */
        this.walls.create(360,27,'platform').setScale(2).refreshBody();
        this.walls.create(360,700,'platform').setScale(2).refreshBody();
        /**
         * Create a Group of Blocks 
         */
        this.blocks = this.physics.add.staticGroup(); 
        /**
         * Create Blocks 
         */
        const columnX=[95,210,330,450,510,580,710];

        this.blocks.create(columnX[0], 210, 'block');
        this.blocks.create(columnX[0], 465, 'block');
        this.blocks.create(columnX[0], 720, 'block');
  
        this.blocks.create(columnX[1], 210, 'block');
        this.blocks.create(columnX[1], 465, 'block');
        this.blocks.create(columnX[1], 720, 'block');
  
        this.blocks.create(columnX[2], 210, 'block');
        this.blocks.create(columnX[2], 465, 'block');
        this.blocks.create(columnX[2], 720, 'block');    
   
        this.blocks.create(columnX[3], 200, 'block');
        this.blocks.create(columnX[3], 465, 'block');
        this.blocks.create(columnX[3], 725, 'block');  
  
        this.blocks.create(columnX[4], 210, 'block');
        this.blocks.create(columnX[4], 465, 'block');
        this.blocks.create(columnX[4], 720, 'block');   

        this.blocks.create(columnX[5], 210, 'block');
        this.blocks.create(columnX[5], 465, 'block');
        this.blocks.create(columnX[5], 720, 'block');   

        this.blocks.create(columnX[6], 190, 'block');
        this.blocks.create(columnX[6], 360, 'block');
        this.blocks.create(columnX[6], 520, 'block'); 
        this.blocks.create(columnX[6], 680, 'block');
        this.blocks.create(columnX[6], 840, 'block');
 
        /**
         * Add player and set colliders with walls and check the corners
         */
        this.player = this.physics.add.sprite(30,850,'player');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.walls,this.player);
        this.physics.add.collider(this.blocks,this.player);
        /**
         * Create stars 
         */
        this.stars = this.physics.add.group({
            classType: Star
        });

        const starLine=[80,335,590];

        for (let i=0; i<starLine.length; i++){
          
            const repetion = 15;
            let starCol = 30;
        
            for (let x=0; x<repetion; x++){
                this.stars.get(starCol, starLine[i] , 'star');
                starCol+=44;    
            }    
        }

        this.stars.children.iterate(function(child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        /**
         * Set the overlap of player with stars to collect them
         */        
        this.physics.add.overlap(
            this.player,
            this.stars,
            this.handleCollectStars, /* called on overlap */
            null,
            this
        );
        
        /**
        * Create bombs
        */
        this.bombs = this.physics.add.group();

        /**
        * Create stamina
        */
        this.stamina = this.physics.add.group();
        
        /**
         * Creating the UI 
         */
        const style = { color: '#000', fontSize: 32 , fontFamily:'Arial'};
        this.scoreText = this.add.text(100 , 1200, 'Points: 0', style).setScrollFactor(0).setOrigin(0.5, 0);
       
    } 

     update(){
        
       
        // left and right input logic
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(200);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-200);
        }  
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(200);
        }
        else
        {
        // stop movement if not left or right
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        }

        this.walls.children.iterate(child => {
            
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;
            
            const scrollY = this.cameras.main.scrollY;
            
            if (platform.y >= scrollY + 700){
                platform.y = scrollY - Phaser.Math.Between(50, 100);
                platform.body.updateFromGameObject();
                
            }
        });

        /**
         * check game over
         */
      //  if (this.player.y > bottomPlatform.y + 200){
          //  this.scene.start('game-over');
        //}
     }

     /**
      * 
      * @param {Phaser.GameObjects.Sprite} sprite 
      */
     horizontalWrap(sprite) {

        const halfWidth = sprite.displayWidth * 0.5;
        const gameWidth = this.scale.width;

        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
         }
    }

    /**
    * @param {Phaser.Physics.Arcade.Sprite} player
    * @param {Carrot} carrot
    */
    handleCollectStars(player,star) {
        // hide from display
        this.stars.killAndHide(star);
        // disable from physics world
        this.physics.world.disableBody(star.body);
        // display collected
        this.scoreText.text = `Points: ${this.score}`;
        // add collected
        this.score++;
    }
    /**
     * 
     * @returns bottomPlatform
     */
    findBottomMostPlatform() {
        const walls = this.walls.getChildren();
        let bottomPlatform = walls[0];

        for (let i = 1; i < walls.length; ++i) {
            const platform = walls[i];
            // discard any walls that are above current
            if (platform.y < bottomPlatform.y){
                continue;
            }
            bottomPlatform = platform;
        }
        return bottomPlatform;
    }
 }