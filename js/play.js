// New name for the state

//     // Removed the preload function
// create: function() {
// // Removed background color and physics system
// this.cursor = game.input.keyboard.createCursorKeys();
// this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
// this.player.anchor.setTo(0.5, 0.5);
// game.physics.arcade.enable(this.player);
// this.player.body.gravity.y = 500;
// this.enemies = game.add.group();
// this.enemies.enableBody = true;
// this.enemies.createMultiple(10, 'enemy');
// this.coin = game.add.sprite(60, 140, 'coin');
// game.physics.arcade.enable(this.coin);
// this.coin.anchor.setTo(0.5, 0.5);
// this.scoreLabel = game.add.text(30, 30, 'score: 0',
//   { font: '18px Arial', fill: '#ffffff' });


var bullets;
//higher = slower
var fireRate = 1000;
var nextFire = 0;
var bulletSpeed = 300;
var maxAmountOfBulletsOnScreen = 100;
var startingX = 100;
var startingY = 100;


var playState = {
// var main = function(){ };
// main.prototype = {



preload: function(){

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('baby', 'assets/dude.png', 32, 48);
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('gun', 'assets/gun.png');


},




create: function() {
   //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //dean: set the boundaries of the world
    //game.world.setBounds(0, 0, 800, 600);
    game.world.setBounds(0, 0, 3400, 1000)


    //  A simple background for our game
    //game.add.sprite(0, 0, 'sky');

    //

    land = game.add.tileSprite(0, 0, 800, 600, 'sky');
    land.fixedToCamera = true;




    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(1000, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(0, 0, 'ground');

    //dean: double size
    ledge.scale.setTo(2, 2);

    ledge.body.immovable = true;

    ledge = platforms.create(0, 250, 'ground');
    //ledge.body.rotation(1);


    ledge.body.immovable = true;




    // The player and its settings
    //player = game.add.sprite(32, game.world.height - 150, 'dude');
    player = game.add.sprite(startingX, startingY, 'baby');
    //set anchor to middle of player
    player.anchor.setTo(0.5, 1);


    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //DEAN: get camera to follow
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

    // Dean: The Gun!!
    gun = game.add.sprite(startingX, startingY, 'gun', 'baby');


    gun.scale.x = .1;
    gun.scale.y = .1;
    gun.anchor.setTo(.15, .9);
    //gun.anchor.setTo(-1, -1);



    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;

    //gravity
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    //Dean: My Code to allow for shooting.
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(maxAmountOfBulletsOnScreen, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);


    //Dean: Adding sounds / audio
    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.deadSound = game.add.audio('dead');

    //Dean: Background Music
    this.music = game.add.audio('song'); // Add the music
    this.music.loop = true; // Make it loop
    this.music.play(); // Start the music



},

update: function() {

   //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);





     //  Reset the players velocity (movement)
    //player.body.velocity.x = 0;
    if (player.body.touching.down)
    {
        //player.body.velocity.x = 0;

        //player.body.drag.set(.2);
    }



    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
        this.jumpSound.play();
    }



    //has baby holding the gun
    gun.x = player.x;
    gun.y = player.y;
    //points the gun
    gun.rotation = game.physics.arcade.angleToPointer(gun, game.input);

      //pew pew

// /*

     if (game.input.activePointer.isDown)
    {
        this.fire();



    }
// */

},

fire: function() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        //Dean: Sound of the gun
        this.coinSound.play();

        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(gun.x  , gun.y );

        game.physics.arcade.moveToPointer(bullet, bulletSpeed);

        bullet.rotation = game.physics.arcade.angleToPointer(player, game.input);

        //game.debug.text(bullet.rotation,120,150+"bullet rotation");

        //recoil

        //player.body.velocity.y = player.body.y-game.input.y;
        //player.body.velocity.x = player.body.x-game.input.x;

        //game.physics.arcade.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);

        //Xvector = (player.x - game.input.x);
        //Yvector = (player.y - game.input.y);

        //player.body.velocity.setTo(Xvector, Yvector);

        //game.physics.arcade.angleBetween(player, game.input)


        //below kind of works#############################################
        angleToPointer = game.physics.arcade.angleToPointer(player, game.input);
        game.debug.text(angleToPointer,320, 450, "white");
        game.physics.arcade.velocityFromRotation(angleToPointer-3.14159, 600, player.body.velocity);
        //########################################################


        //game.debug.text(3.141593 + angleToPointer,320,450);

        //game.physics.arcade.velocityFromRotation(3.141593 + angleToPointer, 300, player.body.velocity);


        //game.physics.arcade.velocityFromAngle(angleToPointer -180, 300, player.body.velocity);

        //game.physics.arcade.moveToPointer(player, bulletSpeed);

    }

},

render: function() {

    //game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    //game.debug.spriteInfo(player, 320, 450, "white");

    //game.debug.text(player.x - game.input.x, 320, 450, "white");
    //game.debug.text(player.y - game.input.y, 320, 500, "white");
    //game.debug.text('pointerx' + game.input.x,32,32);
    //game.debug.text('pointery' + game.input.y,32,64);
    //game.debug.text('guyx' + player.body.x,164,32);
    //game.debug.text('guyy' + player.body.y,164,64);
},

playerDie: function() {
// When the player dies, we go to the menu
game.state.start('menu');

//this.deadSound.play();
this.music.stop();

},

};


//var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// Add the 'mainState' to Phaser, and call it 'main'
//game.state.add('main', main);

//game.state.start('main');















  // New score variable
              //game.global.score = 0;
//this.createWorld();
// game.time.events.loop(2200, this.addEnemy, this); },
// No changes
// takeCoin: function(player, coin) {
// // New score variable
// game.global.score += 5;
// this.scoreLabel.text = 'score: ' + game.global.score;
// this.updateCoinPosition(); },
// // No changes
// playerDie: function() {
// // When the player dies, we go to the menu
// game.state.start('menu');
// this.music.stop();

// }, };
      // Removed Phaser and states initialisation
