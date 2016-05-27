var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.load.path = '/resources/ghost_mansion/';
            this.load.tilemap('map', 'test.json?r=' + Math.random(), null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'biomechamorphs_001.png');
        };
        Preloader.prototype.create = function () {
            this.game.state.start('Map1');
        };
        return Preloader;
    }(Phaser.State));
    GhostMansion.Preloader = Preloader;
})(GhostMansion || (GhostMansion = {}));
var GhostMansion;
(function (GhostMansion) {
    var InputController = (function () {
        function InputController(sprite, game, keyMap, action) {
            this.sprite = sprite;
            this.game = game;
            this.keyMap = keyMap;
            this.action = action;
            this.velocity = 100;
        }
        InputController.prototype.update = function () {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            if (this.game.input.keyboard.isDown(this.keyMap.left)) {
                this.sprite.body.velocity.x = -this.velocity;
            }
            else if (this.game.input.keyboard.isDown(this.keyMap.right)) {
                this.sprite.body.velocity.x = this.velocity;
            }
            if (this.game.input.keyboard.isDown(this.keyMap.up)) {
                this.sprite.body.velocity.y = -this.velocity;
            }
            else if (this.game.input.keyboard.isDown(this.keyMap.down)) {
                this.sprite.body.velocity.y = this.velocity;
            }
            if (this.game.input.keyboard.isDown(this.keyMap.action)) {
                this.action();
            }
        };
        return InputController;
    }());
    GhostMansion.InputController = InputController;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var AiController = (function () {
        function AiController(sprite, game) {
            this.sprite = sprite;
            this.game = game;
            this.debugLine = this.game.add.graphics(0, 0);
            this.step = 0;
            this.updatePath();
        }
        AiController.prototype.update = function () {
            var p0 = this.tileMapPos2WordPos(this.path[this.step]);
            var p1 = this.tileMapPos2WordPos(this.path[this.step + 1]);
            var p = p0;
            if (p1 && Phaser.Math.distanceSq(this.sprite.x, this.sprite.y, p0.x, p0.y) < 5) {
                this.step++;
                p = p1;
            }
            var angle = Phaser.Math.angleBetween(this.sprite.x, this.sprite.y, p.x, p.y);
            this.sprite.body.velocity.x = Math.cos(angle) * 50;
            this.sprite.body.velocity.y = Math.sin(angle) * 50;
        };
        AiController.prototype.tileMapPos2WordPos = function (tilePos) {
            if (tilePos === undefined)
                return null;
            return {
                x: (tilePos.x + 0.5) * this.game.map.tileWidth,
                y: (tilePos.y + 0.5) * this.game.map.tileHeight
            };
        };
        AiController.prototype.updatePath = function () {
            var _this = this;
            var newPath = this.bfs().path;
            if (this.path && this.path[this.step] != newPath[0])
                this.step = 1;
            this.path = newPath;
            if (this.path.length == 1)
                this.step = 0; // in case target is in the same tile
            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.updatePath, this);
            if (this.debugLine) {
                var worldPath = this.path.map(function (p) { return _this.tileMapPos2WordPos(p); });
                this.debugLine.clear();
                this.debugLine.lineStyle(3, 0xffd900, 0.5);
                this.debugLine.moveTo(worldPath[0].x, worldPath[1]);
                for (var i = 1; i < worldPath.length; i++) {
                    this.debugLine.lineTo(worldPath[i].x, worldPath[i].y);
                }
            }
        };
        AiController.prototype.bfs = function () {
            var _this = this;
            var myTile = this.getTile(this.sprite);
            var targetTiles = [];
            this.game.controllables.forEachAlive(function (controllable) {
                if (controllable != _this.sprite) {
                    targetTiles.push(_this.getTile(controllable));
                }
            });
            var edges = [myTile];
            var prevTile = {};
            prevTile[this.tile2id(myTile)] = -1;
            while (true) {
                var newEdges = [];
                for (var i = 0; i < edges.length; i++) {
                    var e = edges[i];
                    var id = this.tile2id(e);
                    for (var j = 0; j < targetTiles.length; j++) {
                        if (targetTiles[j].x == e.x && targetTiles[j].y == e.y) {
                            return { reached: e, path: this.computePath(e, prevTile) };
                        }
                    }
                    var tiles = [
                        this.game.map.getTileAbove(this.game.walls.index, e.x, e.y),
                        this.game.map.getTileBelow(this.game.walls.index, e.x, e.y),
                        this.game.map.getTileLeft(this.game.walls.index, e.x, e.y),
                        this.game.map.getTileRight(this.game.walls.index, e.x, e.y)
                    ];
                    for (var j = 0; j < tiles.length; j++) {
                        var tile = tiles[j];
                        if (tile == null)
                            continue;
                        var tileId = this.tile2id(tile);
                        if (prevTile[tileId] === undefined && tile.index != 404) {
                            prevTile[tileId] = id;
                            newEdges.push(tile);
                        }
                    }
                }
                edges = newEdges;
            }
        };
        AiController.prototype.computePath = function (reached, prevTile) {
            var path = [];
            var id = this.tile2id(reached);
            while (id != -1) {
                if (id === undefined) {
                    throw 'No path';
                }
                path.push(this.id2pos(id));
                id = prevTile[id];
            }
            return path.reverse();
        };
        AiController.prototype.tile2id = function (tile) {
            return tile.x + tile.y * this.game.map.width;
        };
        AiController.prototype.id2pos = function (id) {
            var y = Math.floor(id / this.game.map.width);
            var x = id - y * this.game.map.width;
            return { x: x, y: y };
        };
        AiController.prototype.getTile = function (sprite) {
            var m = this.game.map;
            return m.getTileWorldXY(sprite.x, sprite.y, m.tileWidth, m.tileHeight, this.game.walls, true);
        };
        return AiController;
    }());
    GhostMansion.AiController = AiController;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var ControllableSprite = (function (_super) {
        __extends(ControllableSprite, _super);
        function ControllableSprite() {
            _super.apply(this, arguments);
        }
        return ControllableSprite;
    }(Phaser.Sprite));
    GhostMansion.ControllableSprite = ControllableSprite;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./input_controller.ts"/>
/// <reference path="./ai_controller.ts"/>
/// <reference path="./controllable_sprite.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var Map1 = (function (_super) {
        __extends(Map1, _super);
        function Map1() {
            _super.apply(this, arguments);
        }
        Map1.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.stage.backgroundColor = '#787878';
            var box = this.make.graphics(0, 0);
            box.lineStyle(8, 0xFF0000, 0.8);
            box.beginFill(0xFF700B, 1);
            box.drawRect(-5, -5, 5, 5);
            box.endFill();
            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('biomechamorphs_001', 'tiles');
            this.map.setCollision(404, true, 'walls');
            var background = this.map.createLayer('background');
            this.walls = this.map.createLayer('walls');
            background.resizeWorld();
            this.walls.resizeWorld();
            var player = new GhostMansion.ControllableSprite(this.game, this.world.centerX, this.world.centerY, box.generateTexture());
            player.anchor.setTo(0.5);
            this.game.add.existing(player);
            this.physics.enable(player);
            player.body.collideWorldBounds = true;
            this.controllables = this.add.group();
            this.controllables.add(player);
            player.controller = new GhostMansion.InputController(player, this, {
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                action: Phaser.KeyCode.ENTER
            }, function () { console.log('action'); });
            var ghost = new GhostMansion.ControllableSprite(this.game, 0, 0, box.generateTexture());
            ghost.anchor.setTo(0.5);
            this.game.add.existing(ghost);
            this.physics.enable(ghost);
            ghost.body.collideWorldBounds = true;
            this.controllables.add(ghost);
            ghost.controller = new GhostMansion.AiController(ghost, this);
            this.ghost = ghost;
        };
        Map1.prototype.update = function () {
            this.controllables.forEachAlive(function (controllable) {
                controllable.controller.update();
            }, this);
            this.physics.arcade.collide(this.controllables, this.walls);
            this.physics.arcade.collide(this.controllables, this.controllables);
        };
        Map1.prototype.render = function () {
            // this.game.debug.spriteInfo(this.ghost, 32, 32);
        };
        return Map1;
    }(Phaser.State));
    GhostMansion.Map1 = Map1;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./preloader.ts"/>
/// <reference path="./map1.ts"/>
var GhostMansion;
(function (GhostMansion) {
    function startGame() {
        var game = new Phaser.Game(320, 240, Phaser.AUTO, 'container');
        game.state.add('Preloader', GhostMansion.Preloader);
        game.state.add('Map1', GhostMansion.Map1);
        game.state.start('Preloader');
    }
    GhostMansion.startGame = startGame;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./visibility_polygon.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var FlashLight = (function () {
        function FlashLight(playerSprite, game) {
            this.playerSprite = playerSprite;
            this.game = game;
            // TODO: http://www.emanueleferonato.com/2015/02/03/play-with-light-and-dark-using-ray-casting-and-visibility-polygons/
        }
        return FlashLight;
    }());
    GhostMansion.FlashLight = FlashLight;
})(GhostMansion || (GhostMansion = {}));
