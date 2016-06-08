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
        Preloader.prototype.init = function (setting) {
            this.setting = setting;
        };
        Preloader.prototype.preload = function () {
            this.load.path = '/resources/ghost_mansion/';
            this.load.tilemap('map', 'test.json?r=' + Math.random(), null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'biomechamorphs_001.png');
        };
        Preloader.prototype.create = function () {
            this.game.state.start('Map1', true, false, this.setting);
        };
        return Preloader;
    }(Phaser.State));
    GhostMansion.Preloader = Preloader;
})(GhostMansion || (GhostMansion = {}));
var GhostMansion;
(function (GhostMansion) {
    var InputController = (function () {
        function InputController(sprite, game, keyMap) {
            this.sprite = sprite;
            this.game = game;
            this.keyMap = keyMap;
            this.velocity = 100;
            this.direction = Math.PI / 2;
        }
        InputController.prototype.update = function () {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            var vx = 0;
            var vy = 0;
            if (this.game.input.keyboard.isDown(this.keyMap.left)) {
                vx = -this.velocity;
            }
            else if (this.game.input.keyboard.isDown(this.keyMap.right)) {
                vx = this.velocity;
            }
            if (this.game.input.keyboard.isDown(this.keyMap.up)) {
                vy = -this.velocity;
            }
            else if (this.game.input.keyboard.isDown(this.keyMap.down)) {
                vy = this.velocity;
            }
            if (this.game.input.keyboard.isDown(this.keyMap.flashlight)
                && this.sprite.entityState == GhostMansion.EntityState.Normal) {
                this.sprite.getBehavior('flashlight').turnOn();
            }
            else {
                this.sprite.getBehavior('flashlight').turnOff();
            }
            this.sprite.move(vx, vy);
            var v = this.sprite.body.velocity;
            if (v.x != 0 || v.y != 0) {
                var newDir = Math.atan2(v.y, v.x);
                var d = Math.abs(newDir - this.direction);
                if (d < Math.PI) {
                    var mag = Math.min(d, Math.PI / 2);
                    var dir = (newDir - this.direction) / d;
                    this.direction += mag * dir * this.game.time.physicsElapsed * 10;
                }
                else {
                    var mag = Math.min(2 * Math.PI - d, Math.PI / 2);
                    var dir = -(newDir - this.direction) / d;
                    this.direction += mag * dir * this.game.time.physicsElapsed * 10;
                }
            }
        };
        return InputController;
    }());
    GhostMansion.InputController = InputController;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var ValueBar = (function (_super) {
        __extends(ValueBar, _super);
        function ValueBar(game, color, x, y, valueFunc, valueFuncContext) {
            _super.call(this, game, x, y, null);
            this.valueFunc = valueFunc;
            this.valueFuncContext = valueFuncContext;
            this.maxWidth = 20;
            var rect = game.make.graphics(0, 0);
            rect.beginFill(color);
            rect.drawRect(-10, -2, this.maxWidth, 4);
            rect.endFill();
            var texture = rect.generateTexture();
            this.loadTexture(texture);
            this.anchor.setTo(0.5);
        }
        ValueBar.prototype.postUpdate = function () {
            this.width = this.maxWidth * this.getValue() / 100;
        };
        ValueBar.prototype.getValue = function () {
            return this.valueFunc.call(this.valueFuncContext);
        };
        return ValueBar;
    }(Phaser.Sprite));
    GhostMansion.ValueBar = ValueBar;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./value_bar.ts"/>
var GhostMansion;
(function (GhostMansion) {
    (function (EntityState) {
        EntityState[EntityState["Normal"] = 0] = "Normal";
        EntityState[EntityState["Stunned"] = 1] = "Stunned";
        EntityState[EntityState["Panicked"] = 2] = "Panicked";
    })(GhostMansion.EntityState || (GhostMansion.EntityState = {}));
    var EntityState = GhostMansion.EntityState;
    var ControllableSprite = (function (_super) {
        __extends(ControllableSprite, _super);
        function ControllableSprite(g, x, y, k) {
            var _this = this;
            _super.call(this, g, x, y, k);
            this.behaviors = {};
            this.health = 100;
            this.tag = 'human';
            this.entityState = EntityState.Normal;
            this.healthBar = new GhostMansion.ValueBar(g, 0xff0000, 0, -this.height * 1.1, function () {
                return _this.health;
            }, this);
            this.addChild(this.healthBar);
        }
        ControllableSprite.prototype.setBehavior = function (key, behavior) {
            this.behaviors[key] = behavior;
        };
        ControllableSprite.prototype.getBehavior = function (key) {
            return this.behaviors[key];
        };
        ControllableSprite.prototype.purgeBehaviors = function () {
            this.behaviors = {};
        };
        ControllableSprite.prototype.deductHealth = function (amount) {
            if (this.entityState == EntityState.Panicked)
                return;
            this.health -= amount;
            if (this.health < 0)
                this.health = 0;
            if (this.health == 0 && this.onDeath)
                this.onDeath();
        };
        ControllableSprite.prototype.stun = function (seconds) {
            var _this = this;
            if (this.entityState != EntityState.Normal)
                return;
            this.entityState = EntityState.Stunned;
            if (this.onStun)
                this.onStun();
            this.loadTexture(this.game.state.states['Map1'].boxStunned);
            this.game.time.events.add(Phaser.Timer.SECOND * seconds, function () {
                _this.entityState = EntityState.Panicked;
                if (_this.onPanic)
                    _this.onPanic();
                _this.loadTexture(_this.game.state.states['Map1'].boxPanicked);
                _this.game.time.events.add(Phaser.Timer.SECOND * 3, function () {
                    _this.entityState = EntityState.Normal;
                    if (_this.onNormal)
                        _this.onNormal();
                    _this.loadTexture(_this.game.state.states['Map1'].box);
                });
            }, this);
        };
        ControllableSprite.prototype.fadeIn = function () {
            var tween = this.game.add.tween(this);
            tween.to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);
        };
        ControllableSprite.prototype.fadeOut = function () {
            var tween = this.game.add.tween(this);
            tween.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        };
        ControllableSprite.prototype.move = function (vx, vy) {
            if (this.entityState == EntityState.Stunned) {
                this.body.static = true;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
            else {
                this.body.static = false;
                this.body.velocity.x = vx;
                this.body.velocity.y = vy;
            }
        };
        return ControllableSprite;
    }(Phaser.Sprite));
    GhostMansion.ControllableSprite = ControllableSprite;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./controllable_sprite.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var AiController = (function () {
        function AiController(sprite, game) {
            this.sprite = sprite;
            this.game = game;
            this.path = [];
            this.step = 0;
            // this.debugLine = this.game.add.graphics(0, 0);
            this.updatePath();
        }
        AiController.prototype.update = function () {
            if (this.path.length == 0)
                return;
            var p0 = this.tileMapPos2WordPos(this.path[this.step]);
            var p1 = this.tileMapPos2WordPos(this.path[this.step + 1]);
            var p = p0;
            if (p1 && Phaser.Math.distanceSq(this.sprite.x, this.sprite.y, p0.x, p0.y) < 5) {
                this.step++;
                p = p1;
            }
            var angle = Phaser.Math.angleBetween(this.sprite.x, this.sprite.y, p.x, p.y);
            this.sprite.move(Math.cos(angle) * 50, Math.sin(angle) * 50);
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
            var targetTileIds;
            if (this.sprite.entityState != GhostMansion.EntityState.Normal) {
                targetTileIds = this.genTargetTileIdsEscape();
            }
            else {
                targetTileIds = this.genTargetTileIdsChaseLowFlashlight();
                if (Object.keys(targetTileIds).length == 0) {
                    targetTileIds = this.genTargetTileIdsLurk();
                }
            }
            if (Object.keys(targetTileIds).length == 0)
                return;
            var newPath = this.bfs(targetTileIds).path;
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
        AiController.prototype.genTargetTileIdsEscape = function () {
            var _this = this;
            var targetTileIds = {};
            var humans = [];
            this.game.controllables.forEachAlive(function (controllable) {
                if (controllable != _this.sprite) {
                    humans.push(_this.getTile(controllable));
                }
            });
            this.game.map.forEach(function (tile) {
                if (tile.index == -1) {
                    if (_this.furtherThan(tile, humans, 10) == humans.length) {
                        targetTileIds[_this.tile2id(tile)] = true;
                    }
                }
            }, this, 0, 0, this.game.map.width, this.game.map.height, this.game.walls);
            return targetTileIds;
        };
        AiController.prototype.furtherThan = function (tile, compareTiles, distance) {
            var count = 0;
            compareTiles.forEach(function (t) {
                var dx = tile.x - t.x;
                var dy = tile.y - t.y;
                if (dx * dx + dy * dy >= distance * distance)
                    count++;
            });
            return count;
        };
        AiController.prototype.closerThan = function (tile, compareTiles, distance) {
            return compareTiles.length - this.furtherThan(tile, compareTiles, distance);
        };
        AiController.prototype.genTargetTileIdsChaseLowFlashlight = function () {
            var _this = this;
            var targetTileIds = {};
            this.game.controllables.forEachAlive(function (controllable) {
                if (controllable != _this.sprite && controllable.getBehavior('flashlight').health < 20) {
                    targetTileIds[_this.tile2id(_this.getTile(controllable))] = true;
                }
            });
            return targetTileIds;
        };
        AiController.prototype.genTargetTileIdsLurk = function () {
            var _this = this;
            var targetTileIds = {};
            var humans = [];
            this.game.controllables.forEachAlive(function (controllable) {
                if (controllable != _this.sprite) {
                    humans.push(_this.getTile(controllable));
                }
            });
            this.game.map.forEach(function (tile) {
                if (tile.index == -1) {
                    if (_this.furtherThan(tile, humans, 4) == humans.length
                        && _this.closerThan(tile, humans, 6) > 0) {
                        targetTileIds[_this.tile2id(tile)] = true;
                    }
                }
            }, this, 0, 0, this.game.map.width, this.game.map.height, this.game.walls);
            return targetTileIds;
        };
        AiController.prototype.bfs = function (targetTileIds) {
            var myTile = this.getTile(this.sprite);
            var edges = [myTile];
            var prevTile = {};
            prevTile[this.tile2id(myTile)] = -1;
            while (true) {
                var newEdges = [];
                for (var i = 0; i < edges.length; i++) {
                    var e = edges[i];
                    var id = this.tile2id(e);
                    if (targetTileIds[id]) {
                        return { reached: e, path: this.computePath(e, prevTile) };
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
/// <reference path="./visibility_polygon.d.ts"/>
/// <reference path="./value_bar.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var FlashLight = (function () {
        function FlashLight(sprite, game) {
            var _this = this;
            this.sprite = sprite;
            this.game = game;
            this.activated = false;
            this.health = 100;
            this.rayWidth = 1.4;
            this.rayLength = 60;
            // Reference: http://www.emanueleferonato.com/2015/02/03/play-with-light-and-dark-using-ray-casting-and-visibility-polygons/
            this.polygons = [];
            this.polygons.push([
                [-1, -1],
                [game.world.width + 1, -1],
                [game.world.width + 1, game.world.height + 1],
                [-1, game.world.height + 1]
            ]);
            var m = this.game.map;
            m.forEach(function (t) {
                if (t.index != -1 && t.worldX !== undefined) {
                    _this.polygons.push([
                        [t.worldX, t.worldY],
                        [t.worldX + t.width, t.worldY],
                        [t.worldX + t.width, t.worldY + t.height],
                        [t.worldX, t.worldY + t.height]
                    ]);
                }
            }, this, 0, 0, m.width, m.height, this.game.walls);
            this.segments = VisibilityPolygon.convertToSegments(this.polygons);
            this.lightCanvas = this.game.add.graphics(0, 0);
            this.lightMask = this.game.add.graphics(0, 0);
            this.inputController = this.sprite.getBehavior('inputController');
            var lightBar = new GhostMansion.ValueBar(this.game, 0xffff00, 0, -this.sprite.height * 0.8, function () {
                return _this.health;
            }, this);
            this.sprite.addChild(lightBar);
        }
        FlashLight.prototype.update = function () {
            var position = [this.sprite.x, this.sprite.y];
            var a = this.inputController.direction;
            this.lightCanvas.clear();
            if (this.activated && this.health > 0) {
                var visibility = VisibilityPolygon.compute(position, this.segments);
                this.lightCanvas.lineStyle(2, 0xff8800, 0);
                var lightIntensity = 0.5 * (1 - Math.exp(-this.health / 10));
                this.lightCanvas.beginFill(0xffff00, lightIntensity);
                this.lightCanvas.moveTo(visibility[0][0], visibility[0][1]);
                for (var i = 1; i < visibility.length; i++) {
                    this.lightCanvas.lineTo(visibility[i][0], visibility[i][1]);
                }
                this.lightCanvas.endFill();
                this.lightMask.clear();
                this.lightMask.beginFill(0xffffff);
                this.lightMask.arc(this.sprite.x, this.sprite.y, this.rayLength, a + this.rayWidth / 2, a - this.rayWidth / 2, true);
                this.lightCanvas.mask = this.lightMask;
                this.health -= this.game.time.physicsElapsed * 10;
                var g = this.game.ghost;
                if (VisibilityPolygon.inPolygon([g.x, g.y], visibility) && this.inMask(g.x, g.y)) {
                    g.stun(3);
                    g.deductHealth(this.game.time.physicsElapsed * 30);
                }
            }
        };
        FlashLight.prototype.inMask = function (x, y) {
            var dx = x - this.sprite.x;
            var dy = y - this.sprite.y;
            var dsq = dx * dx + dy * dy;
            var a = Math.atan2(dy, dx);
            return a >= this.inputController.direction - this.rayWidth / 2 &&
                a <= this.inputController.direction + this.rayWidth / 2 &&
                dsq <= this.rayLength * this.rayLength;
        };
        FlashLight.prototype.turnOn = function () {
            this.activated = true;
        };
        FlashLight.prototype.turnOff = function () {
            this.activated = false;
        };
        return FlashLight;
    }());
    GhostMansion.FlashLight = FlashLight;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var VicinityRing = (function () {
        function VicinityRing(sprite, game) {
            this.sprite = sprite;
            this.game = game;
            var graphics = game.make.graphics(0, 0);
            graphics.lineStyle(2, 0x0000ff, 1);
            graphics.drawCircle(0, 0, 100);
            this.circle = new Phaser.Sprite(game, 0, 0, graphics.generateTexture());
            this.circle.anchor.setTo(0.5);
            this.sprite.addChild(this.circle);
            this.circle.alpha = 0;
        }
        VicinityRing.prototype.update = function () {
            var d = this.distanceToGhost();
            this.circle.alpha = (d < 150);
            this.circle.width = d;
            this.circle.height = d;
        };
        VicinityRing.prototype.distanceToGhost = function () {
            var d = Phaser.Point.distance(this.game.ghost.position, this.sprite.position) * 2;
            d = Math.max(30, d);
            return d;
        };
        return VicinityRing;
    }());
    GhostMansion.VicinityRing = VicinityRing;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./input_controller.ts"/>
/// <reference path="./ai_controller.ts"/>
/// <reference path="./flashlight.ts"/>
/// <reference path="./vicinity_ring.ts"/>
/// <reference path="./controllable_sprite.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var Map1 = (function (_super) {
        __extends(Map1, _super);
        function Map1() {
            _super.apply(this, arguments);
            this.lives = 3;
        }
        Map1.prototype.init = function (setting) {
            this.playerCount = setting.playerCount;
        };
        Map1.prototype.create = function () {
            var _this = this;
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.stage.backgroundColor = '#787878';
            this.box = this.makeBox(0xff700b);
            this.boxStunned = this.makeBox(0x666699);
            this.boxPanicked = this.makeBox(0xffff00);
            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('biomechamorphs_001', 'tiles');
            this.map.setCollision(404, true, 'walls');
            var background = this.map.createLayer('background');
            this.walls = this.map.createLayer('walls');
            background.resizeWorld();
            this.walls.resizeWorld();
            this.controllables = this.add.group();
            this.addPlayer({
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                flashlight: Phaser.KeyCode.ENTER
            });
            if (this.playerCount == 2) {
                this.addPlayer({
                    left: Phaser.KeyCode.A,
                    right: Phaser.KeyCode.D,
                    up: Phaser.KeyCode.W,
                    down: Phaser.KeyCode.S,
                    flashlight: Phaser.KeyCode.SPACEBAR
                });
            }
            var ghost = new GhostMansion.ControllableSprite(this.game, 0, 0, this.box);
            ghost.anchor.setTo(0.5);
            ghost.fadeOut();
            this.game.add.existing(ghost);
            this.physics.enable(ghost);
            ghost.body.collideWorldBounds = true;
            this.controllables.add(ghost);
            ghost.setBehavior('AI', new GhostMansion.AiController(ghost, this));
            ghost.tag = 'ghost';
            ghost.onStun = ghost.fadeIn;
            ghost.onNormal = ghost.fadeOut;
            ghost.onDeath = function () {
                _this.displayMessage('You win');
                _this.gameOver();
            };
            this.ghost = ghost;
        };
        Map1.prototype.addPlayer = function (keyMap) {
            var _this = this;
            var player = new GhostMansion.ControllableSprite(this.game, this.world.centerX, this.world.centerY, this.box);
            player.anchor.setTo(0.5);
            this.game.add.existing(player);
            this.physics.enable(player);
            player.body.collideWorldBounds = true;
            this.controllables.add(player);
            player.setBehavior('inputController', new GhostMansion.InputController(player, this, keyMap));
            player.setBehavior('flashlight', new GhostMansion.FlashLight(player, this));
            player.setBehavior('vicinityRing', new GhostMansion.VicinityRing(player, this));
            player.onDeath = function () {
                _this.lives--;
                if (_this.lives <= 0) {
                    _this.displayMessage('You lose');
                    _this.gameOver();
                }
                else {
                    var text = _this.displayMessage('You have ' + _this.lives + ' lives left');
                    var tween = _this.add.tween(text).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function () { text.destroy(); });
                    player.health = 100;
                    player.getBehavior('flashlight').health = 100;
                }
            };
            return player;
        };
        Map1.prototype.gameOver = function () {
            this.controllables.forEachAlive(function (c) {
                c.purgeBehaviors();
            }, this);
        };
        Map1.prototype.displayMessage = function (msg) {
            var style = { font: '32px Arial' };
            var text = this.add.text(this.world.centerX, this.world.centerY, msg, style);
            text.anchor.set(0.5);
            text.align = 'center';
            return text;
        };
        Map1.prototype.update = function () {
            this.controllables.forEachAlive(function (controllable) {
                for (var key in controllable.behaviors) {
                    try {
                        controllable.behaviors[key].update();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }, this);
            this.physics.arcade.collide(this.controllables, this.walls);
            this.physics.arcade.collide(this.controllables, this.controllables, this.collideCallback, this.processCallback, this);
        };
        Map1.prototype.makeBox = function (color) {
            var box = this.make.graphics(0, 0);
            box.lineStyle(8, color, 0.8);
            box.beginFill(color, 1);
            box.drawRect(-5, -5, 5, 5);
            box.endFill();
            return box.generateTexture();
        };
        Map1.prototype.collideCallback = function (a, b) {
            var human = null;
            var ghost = null;
            if (a.tag == 'ghost') {
                human = b;
                ghost = a;
            }
            else if (b.tag == 'ghost') {
                human = a;
                ghost = b;
            }
            if (human) {
                human.deductHealth(this.time.physicsElapsed * 100);
                human.stun(3);
                ghost.fadeIn();
                this.time.events.add(Phaser.Timer.SECOND * 3, function () {
                    ghost.fadeOut();
                });
            }
        };
        Map1.prototype.processCallback = function (a, b) {
            if ((a.tag == 'ghost' || a.tag == 'human') && a.entityState == GhostMansion.EntityState.Panicked) {
                return false;
            }
            if ((b.tag == 'ghost' || b.tag == 'human') && b.entityState == GhostMansion.EntityState.Panicked) {
                return false;
            }
            return true;
        };
        Map1.prototype.render = function () {
            // this.game.debug.spriteInfo(this.ghost, 32, 32);
        };
        return Map1;
    }(Phaser.State));
    GhostMansion.Map1 = Map1;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var Common = (function () {
        function Common() {
        }
        Common.addButton = function (game, x, y, text, newState, a1) {
            if (a1 === void 0) { a1 = null; }
            var style = { font: '32px Arial', fill: '#ffffff' };
            if (newState == null)
                style.fill = '#333333';
            var button = game.add.text(x, y, text, style);
            button.anchor.set(0.5);
            button.inputEnabled = true;
            button.events.onInputUp.add(function () {
                game.state.start(newState, true, false, a1);
            }, this);
            return button;
        };
        return Common;
    }());
    GhostMansion.Common = Common;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./common.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var NetworkSelection = (function (_super) {
        __extends(NetworkSelection, _super);
        function NetworkSelection() {
            _super.apply(this, arguments);
        }
        NetworkSelection.prototype.create = function () {
            GhostMansion.Common.addButton(this, this.world.centerX, this.world.centerY - 20, 'Local', 'LocalSelection');
            GhostMansion.Common.addButton(this, this.world.centerX, this.world.centerY + 20, 'Networked', null);
        };
        return NetworkSelection;
    }(Phaser.State));
    GhostMansion.NetworkSelection = NetworkSelection;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./common.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var LocalSelection = (function (_super) {
        __extends(LocalSelection, _super);
        function LocalSelection() {
            _super.apply(this, arguments);
        }
        LocalSelection.prototype.create = function () {
            GhostMansion.Common.addButton(this, this.world.centerX, this.world.centerY - 20, '1 Player', 'Preloader', { playerCount: 1 });
            GhostMansion.Common.addButton(this, this.world.centerX, this.world.centerY + 20, '2 Players', 'Preloader', { playerCount: 2 });
        };
        return LocalSelection;
    }(Phaser.State));
    GhostMansion.LocalSelection = LocalSelection;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./preloader.ts"/>
/// <reference path="./map1.ts"/>
/// <reference path="./network_selection.ts"/>
/// <reference path="./local_selection.ts"/>
var GhostMansion;
(function (GhostMansion) {
    function startGame() {
        var game = new Phaser.Game(320, 240, Phaser.AUTO, 'container');
        game.state.add('Preloader', GhostMansion.Preloader);
        game.state.add('Map1', GhostMansion.Map1);
        game.state.add('NetworkSelection', GhostMansion.NetworkSelection);
        game.state.add('LocalSelection', GhostMansion.LocalSelection);
        game.state.start('NetworkSelection');
    }
    GhostMansion.startGame = startGame;
})(GhostMansion || (GhostMansion = {}));
