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
var startingX = 500;
var startingY = 500;


var playState = {
// var main = function(){ };
// main.prototype = {



preload: function(){

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('baby', 'assets/dude.png', 32, 48);
    game.load.image('bullet', 'assets/bullet.png');
    //game.load.image('gun', 'assets/gun.png');
    game.load.image('gun', 'assets/gunbaby.gif');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.spritesheet('missle', 'assets/missles.gif', 77, 36);


    //oldarcade
    //game.load.spritesheet('gunbaby','assets/gunbaby.gif',100,50);

},




create: function() {
   //  We're going to be using physics, so enable the Arcade Physics system
    //game.physics.startSystem(Phaser.Physics.ARCADE);

    // um this physics I think I need for the missles
    //mistest
    //game.physics.startSystem(Phaser.Physics.P2JS);






    //dean: set the boundaries of the world
    //game.world.setBounds(0, 0, 800, 600);
    game.world.setBounds(0, 0, 3400, 1000)


    //  A simple background for our game
    //game.add.sprite(0, 0, 'sky');
    land = game.add.tileSprite(0, 0, 800, 600, 'sky');
    land.fixedToCamera = true;

    //Dean: the flappy pipes
    this.pipes = game.add.group(); // Create a group
    this.pipes.enableBody = true;  // Add physics to the group
    this.pipes.createMultiple(200, 'pipe'); // Create 20 pipes




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
    //oldarcade
    //player = game.add.sprite(startingX, startingY, 'baby');
    player = game.add.sprite(startingX, startingY, 'gunbaby');
    //player.scale.setTo(.01,.1);

    //set anchor to middle of player
    player.anchor.setTo(0.5, 1);


    //  We need to enable physics on the player

    //game.physics.arcade.enable(player);
    //mistest

    //arcadephysics

    game.physics.arcade.enableBody(player);

    //DEAN: get camera to follow
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

    // Dean: The Gun!!
    gun = game.add.sprite(startingX, startingY, 'gun', 'baby');


    //gun.scale.x = .1;
    //gun.scale.y = .1;
    gun.anchor.setTo(.5, .5);
    //gun.anchor.setTo(-1, -1);



    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;

    //gravity
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    //oldarcade
    //player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);



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
    this.music = game.add.audio('songREMOVE'); // Add the music. Remove REMOVE to play
    this.music.loop = true; // Make it loop
    this.music.play(); // Start the music

    //call pipes every 15 seconds
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(this.exploAnimation, this);




    ///////////////////////
    //MISSLE CODE HERE. MCODE mcode
    //missles.animations.add();


    this.missles = game.add.group();
    //mistest Missile animation

    for (var i = 0; i < 10; i++) {
        var missle = this.missles.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'missle');
        //
        game.physics.arcade.enable(missle,true);
        //game.physics.p2.enable(missle,false);


        missle.animations.add('spin', [0,1,2,3,4,5,4,3,2,1] , 10, true);

        missle.animations.play('spin');

    }

    //missles.create
    //cursors = game.input.keyboard.createCursorKeys();
    //ship = game.add.sprite(32, game.world.height - 150, 'car');
    //game.physics.p2.enable(ship);


},


// Only for the explosion effect
exploAnimation: function(thing) {

    thing.anchor.x = 0.5;
    thing.anchor.y = 0.5;
    thing.animations.add('kaboom');

},

update: function() {

   //  Collide the player and the stars with the platforms

    //arcadephysics
    game.physics.arcade.collide(player, platforms);


    // mistest
    game.physics.arcade.collide(player, this.missles);

    //game.physics.arcade.collide(bullets, this.missles);

    game.physics.arcade.collide(this.missles, this.missles);


     //  Reset the players velocity (movement)
    //player.body.velocity.x = 0;

    //arcadephysics

    ////////////////////////////////


    // if (player.body.touching.down)
    // {
    //     player.body.velocity.x = 0;

    //     //player.body.drag.set(.2);
    // }

    //mistest
    //missles.animations.play('spin');

    // if (cursors.left.isDown)
    // {
    //     //  Move to the left
    //     player.body.velocity.x = -150;

    //     player.animations.play('left');
    // }
    // else if (cursors.right.isDown)
    // {
    //     //  Move to the right
    //     player.body.velocity.x = 150;

    //     player.animations.play('right');
    // }
    // else
    // {
    //     //  Stand still
    //     player.animations.stop();

    //     player.frame = 4;
    // }

    // //  Allow the player to jump if they are touching the ground.
    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.body.velocity.y = -350;
    //     this.jumpSound.play();

    // }



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

    // hit a pipe and die
    game.physics.arcade.overlap(player, this.pipes, this.playerDie, null, this);

    //shoot a pipe and boom it explodes
    game.physics.arcade.overlap(bullets, this.pipes, this.collisionHandler, null, this);

    //shoot a missile and boom it explodes
    game.physics.arcade.overlap(bullets, this.missles, this.collisionHandler, null, this);



    //make missles accelerate to the baby
    this.missles.forEachAlive(this.moveMissles,this);  //make bullets accelerate to ship


    //use hack check overlap function to collide bullets and missles since missles are
    //currently p2 physics

    // if (this.checkOverlap(bullets, missles))
    // {
    //     text.text = 'Drag the sprites. Overlapping: true';
    // }
    // else
    // {
    //     text.text = 'Drag the sprites. Overlapping: false';
    // }


},



//mistest
moveMissles: function(missle) {
     this.accelerateToObject(missle,player,30);  //start accelerateToObject on every bullet
},

accelerateToObject: function(obj1, obj2, speed) {
    if (typeof speed === 'undefined') { speed = 60; }

    //mistest
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);

    //P2 obj1.body.rotation ARCADE obj1.rotation

    //rotation off for now
    //obj1.rotation = angle + game.math.degToRad(0);  // correct angle of angry bullets (depends on the sprite used)

    // arcade physics
    obj1.body.velocity.x = speed * Math.cos(angle);
    obj1.body.velocity.y = speed * Math.sin(angle);

    // P2 physics
    //obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
    //obj1.body.force.y = Math.sin(angle) * speed;


},



addOnePipe: function(x, y) {
    // Get the first dead pipe of our group
    var pipe = this.pipes.getFirstDead();

    // Set the new position of the pipe

    //currently has a bug with if over 200 pipes spawn it crashes
    pipe.reset(x, y);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -100;

    // Kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

},

addRowOfPipes: function() {
    // Pick where the hole will be
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1)
            this.addOnePipe(1000, i * 60 + 100);
},

playerDie: function() {
// When the player dies, we go to the menu
game.state.start('menu');

this.deadSound.play();
this.music.stop();

},

fire: function() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        //Dean: Sound of the gun
        this.coinSound.play();

        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        //shootsfrom

        bullet.reset(gun.x, gun.y);

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


        //works#############################################
        angleToPointer = game.physics.arcade.angleToPointer(player, game.input);
        //game.debug.text(angleToPointer,320, 450, "white");
        game.physics.arcade.velocityFromRotation(angleToPointer-3.14159, 300, player.body.velocity);
        //########################################################


        //game.debug.text(3.141593 + angleToPointer,320,450);

        //game.physics.arcade.velocityFromRotation(3.141593 + angleToPointer, 300, player.body.velocity);


        //game.physics.arcade.velocityFromAngle(angleToPointer -180, 300, player.body.velocity);

        //game.physics.arcade.moveToPointer(player, bulletSpeed);

    }

},

collisionHandler: function(bullet, object) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    object.kill();

    //  Increase the score
    //score += 20;
    //scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(object.body.x, object.body.y);
    explosion.play('kaboom', 30, false, true);


    this.deadSound.play();
    // if (alien.countLiving() == 0)
    // {
    //     score += 1000;
    //     scoreText.text = scoreString + score;

    //     enemyBullets.callAll('kill',this);
    //     stateText.text = " You Won, \n Click to restart";
    //     stateText.visible = true;

    //     //the "click to restart" handler
    //     game.input.onTap.addOnce(restart,this);
    // }

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

    game.debug.body(player);

    this.missles.forEachAlive(this.renderGroup, this);
},

renderGroup: function(member) {
    game.debug.body(member);
},

checkOverlap: function(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

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
