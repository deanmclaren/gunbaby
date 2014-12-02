var loadState = {
  preload: function () {
// Add a 'loading...' label on the screen
var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
        { font: '30px Arial', fill: '#ffffff' });
    loadingLabel.anchor.setTo(0.5, 0.5);
    // Display the progress bar
var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar'); progressBar.anchor.setTo(0.5, 0.5); game.load.setPreloadSprite(progressBar);
    // Load all our assets
    game.load.image('player', 'assets/tut/player.png');
    game.load.image('enemy', 'assets/tut/enemy.png');
    game.load.image('coin', 'assets/tut/coin.png');
    game.load.image('wallV', 'assets/tut/wallVertical.png');
    game.load.image('wallH', 'assets/tut/wallHorizontal.png');

    game.load.image('pipe', 'assets/star.png');
    // Load a new asset that we will use in the menu state
    game.load.image('background', 'assets/tut/background.png');
    // Dean: Load sound assets
    // Sound when the player jumps
    game.load.audio('jump', ['assets/tut/jump.ogg', 'assets/tut/jump.mp3']);
    game.load.audio('coin', ['assets/tut/coin.ogg', 'assets/tut/coin.mp3']);
    game.load.audio('dead', ['assets/tut/dead.ogg', 'assets/tut/dead.mp3']);
    game.load.audio('song', 'assets/TeknoAXE - Fluffy Eight Bit.mp3');
          },
create: function() {
// Go to the menu state
game.state.start('menu');
} };
