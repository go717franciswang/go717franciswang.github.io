
var game = new Phaser.Game(900, 600, Phaser.AUTO, 'container');
var googleFontReady = false;

WebFontConfig = {

  //  'active' means all requested fonts have finished loading
  //  We set a 1 second delay before calling 'createText'.
  //  For some reason if we don't the browser cannot render the text the first time it's created.
  //active: function() { game.time.events.add(Phaser.Timer.SECOND / 2, createText, this); },
  active: function() { googleFontReady = true },

  //  The Google Fonts we want to load (specify as many as you like in the array)
  google: {
    families: ['VT323']
  }

};

game.state.add('load', loadState);
game.state.add('play', playState);
game.state.add('achievements', achievementState);
game.state.start('load');

var MODES = {
    TEST: { width: 9, height: 9, mineCount: 3 },
    BEGINNER: { 
        name: 'Beginner',
        width: 9,
        height: 9,
        mineCount: 10,
        leaderboardId: 'CgkI5MXwiscWEAIQAA',
        onCompleteAchievementId: 'CgkI5MXwiscWEAIQBA',
    },
    INTERMEDIATE: { 
        name: 'Intermediate',
        width: 16, 
        height: 16,
        mineCount: 40,
        leaderboardId: 'CgkI5MXwiscWEAIQAQ',
        onCompleteAchievementId: 'CgkI5MXwiscWEAIQBQ',
    },
    ADVANCED: { 
        name: 'Advanced',
        width: 30,
        height: 16,
        mineCount: 99,
        leaderboardId: 'CgkI5MXwiscWEAIQAg',
        onCompleteAchievementId: 'CgkI5MXwiscWEAIQBg',
        daredevilAchievementId: 'CgkI5MXwiscWEAIQBw',
        godzillaAchievmentId: 'CgkI5MXwiscWEAIQCA',
    },
};

var GAPI_EVENTS = {
    'Wins - Beginner': 'CgkI5MXwiscWEAIQCQ',
    'Wins - Intermediate': 'CgkI5MXwiscWEAIQCw',
    'Wins - Advanced': 'CgkI5MXwiscWEAIQDQ',
    'Games - Beginner': 'CgkI5MXwiscWEAIQCg',
    'Games - Intermediate': 'CgkI5MXwiscWEAIQDA',
    'Games - Advanced': 'CgkI5MXwiscWEAIQDg',
    'Actions - Flag': 'CgkI5MXwiscWEAIQDw',
    'Actions - Unflag': 'CgkI5MXwiscWEAIQEA',
    'Actions - Expand': 'CgkI5MXwiscWEAIQEQ',
    'Actions - Reveal': 'CgkI5MXwiscWEAIQEg',
    'Actions - Invalid': 'CgkI5MXwiscWEAIQEw',
};
var gapiEventManager = new GapiEventManager(gapi, { intervalMS: 60*1000, eventNameToId: GAPI_EVENTS });

var mode = MODES.BEGINNER;
var width;
var height;
var mineCount;
var mineMap;
var tileScale = 3;
var firstClick;
var previousClickTime = 0;
var previousClickTile = null;
var tileGroup;
var knownCount;
var flaggedCount;
var gameOver = false;
var face;
var wrench;

var textTimeElapsed;
var textMinesLeft;

var FRAME = {
  KNOWN: 0,
  UNKNOWN: 1,
  FLAG: 2,
  MINE: 3,
  WRONG_FLAG: 13,
  BOOM: 14
};

var userSignedIn = false;
var googleServiceReady = false;
var configDialog;

$('#leaderBoard').gapiGameLeaderBoard(gapi, {});
