var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./phaser.d.ts"/>
var Pinball;
(function (Pinball) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        Menu.prototype.preload = function () {
            this.load.path = '/resources/pinball/assets/';
            this.load.bitmapFont('04B_30', '04B_30.png', '04B_30.fnt');
            this.load.json('gameSetting', 'gameSetting.json?rand=' + Math.random());
            this.load.image('preloadBar', 'loader.png');
        };
        Menu.prototype.create = function () {
            var _this = this;
            this.setting = this.cache.getJSON('gameSetting');
            this.stage.backgroundColor = 0xc0c0c0;
            this.buttons = this.add.group();
            var spacing = 50;
            this.setting['boards'].forEach(function (boardSetting, idx) {
                var callback = function () {
                    _this.game.state.start('Loader', true, false, boardSetting);
                };
                var x = _this.world.centerX;
                var y = idx * spacing;
                var text = _this.add.bitmapText(x, y, '04B_30', boardSetting['name']);
                text.anchor.setTo(0.5);
                text.inputEnabled = true;
                text.events.onInputUp.add(callback);
                _this.buttons.addChild(text);
            });
            this.buttons.y = this.world.centerY - spacing * this.setting['boards'].length / 2;
        };
        return Menu;
    }(Phaser.State));
    Pinball.Menu = Menu;
})(Pinball || (Pinball = {}));
/// <reference path="./phaser.d.ts"/>
var Pinball;
(function (Pinball) {
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            _super.apply(this, arguments);
        }
        Loader.prototype.init = function (boardSetting) {
            this.boardSetting = boardSetting;
        };
        Loader.prototype.preload = function () {
            var _this = this;
            this.load.path = '/resources/pinball/assets/';
            this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
            this.preloadBar.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);
            this.boardSetting.assets.forEach(function (a) {
                switch (a.type) {
                    case "images":
                        _this.load.images(a.files);
                        break;
                    case "spritesheet":
                        _this.load.spritesheet(a.key, a.file, a.w, a.h);
                        break;
                    case "physics":
                        _this.load.physics(a.file);
                        break;
                    case "audio":
                        _this.load.audio(a.key, a.file);
                        break;
                }
            });
        };
        Loader.prototype.create = function () {
            var _this = this;
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this.game.state.start('Main', true, false, _this.boardSetting);
            }, this);
        };
        return Loader;
    }(Phaser.State));
    Pinball.Loader = Loader;
})(Pinball || (Pinball = {}));
/// <reference path="./phaser.d.ts"/>
var Pinball;
(function (Pinball) {
    var Flipper = (function (_super) {
        __extends(Flipper, _super);
        function Flipper() {
            _super.apply(this, arguments);
        }
        return Flipper;
    }(Phaser.Sprite));
    Pinball.Flipper = Flipper;
})(Pinball || (Pinball = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./p2.d.ts"/>
/// <reference path="./jquery.d.ts"/>
/// <reference path="./flipper.ts"/>
var game;
var Pinball;
(function (Pinball) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.apply(this, arguments);
        }
        Main.prototype.init = function (boardSetting) {
            this.boardSetting = boardSetting;
        };
        Main.prototype.create = function () {
            var _this = this;
            this.worldBoundOffsetY = 20;
            this.world.setBounds(0, 0, this.world.width, this.world.height + this.worldBoundOffsetY);
            this.stage.backgroundColor = 0xffffff;
            this.physics.startSystem(Phaser.Physics.P2JS);
            this.physics.p2.gravity.y = 100;
            this.physics.p2.setImpactEvents(true);
            this.ballMaterial = this.physics.p2.createMaterial('ballMaterial');
            this.tableMaterial = this.physics.p2.createMaterial('tableMaterial');
            this.bumperMaterial = this.physics.p2.createMaterial('bumperMaterial');
            this.slingShotMaterial = this.physics.p2.createMaterial('slingShotMaterial');
            this.table = this.addTable(this.boardSetting.table);
            this.ball = this.addBall(this.boardSetting.ball);
            this.leftArm = this.addArm(this.boardSetting.arm_left, true, Phaser.Keyboard.LEFT);
            this.rightArm = this.addArm(this.boardSetting.arm_right, false, Phaser.Keyboard.RIGHT);
            this.bumpers = this.add.physicsGroup(Phaser.Physics.P2JS);
            this.boardSetting.bumpers.positions.forEach(function (p) {
                _this.addBumper(p);
            });
            this.gun = this.addGun(this.boardSetting.gun, Phaser.Keyboard.SPACEBAR);
            this.dropHole = this.addDropHole();
            this.addSlingShots();
            this.ballVsTableMaterial = this.physics.p2.createContactMaterial(this.ballMaterial, this.tableMaterial);
            this.ballVsTableMaterial.restitution = 0.5;
            this.ballVsBumperMaterial = this.physics.p2.createContactMaterial(this.ballMaterial, this.bumperMaterial);
            this.ballVsBumperMaterial.restitution = 2.5;
            this.ballVsSlingShotMaterial = this.physics.p2.createContactMaterial(this.ballMaterial, this.slingShotMaterial);
            this.ballVsSlingShotMaterial.restitution = 5;
            this.score = 0;
            this.scoreText = this.add.bitmapText(0, this.world.height - this.worldBoundOffsetY, '04B_30', 'SCORE: 0', 12);
            this.scoreText.anchor.setTo(0, 1);
            this.lifes = 3;
            this.lifesText = this.add.bitmapText(0, this.world.height - 20 - this.worldBoundOffsetY, '04B_30', 'LIFES: 3', 12);
            this.lifesText.anchor.setTo(0, 1);
            this.soundQueue = [];
            this.playingSound = false;
            this.flippedUp = false;
            var button = this.game.add.button(this.world.width - 50, 10, 'fullscreen_button', this.gofull, this, 0, 0, 0);
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game = this;
        };
        Main.prototype.gofull = function () {
            if (game.scale.isFullScreen) {
                this.game.scale.stopFullScreen();
            }
            else {
                this.game.scale.startFullScreen(false);
            }
        };
        Main.prototype.addSlingShots = function () {
            var _this = this;
            var cs = this.boardSetting.slingShots;
            if (!cs)
                return;
            for (var i = 0; i < cs.length; i++) {
                var c = cs[i];
                (function () {
                    var slingShot = _this.add.sprite(c.x, c.y);
                    _this.physics.p2.enable(slingShot, _this.boardSetting.debug);
                    slingShot.body.clearShapes();
                    slingShot.body.addRectangle(c.w, c.h);
                    slingShot.body.rotation = c.rotation;
                    slingShot.body.static = true;
                    slingShot.body.setMaterial(_this.slingShotMaterial);
                    console.log(slingShot);
                })();
            }
        };
        Main.prototype.addTable = function (c) {
            var table = this.add.sprite(this.world.width / 2, this.world.height / 2 - this.worldBoundOffsetY / 2, c.key);
            this.physics.p2.enable(table);
            table.body.clearShapes();
            table.body.loadPolygon(c.physics, 'table');
            table.body.static = true;
            table.body.setMaterial(this.tableMaterial);
            return table;
        };
        Main.prototype.addGun = function (c, keyCode) {
            var rect = this.make.graphics(0, 0);
            rect.lineStyle(8, 0xFF0000, 0.8);
            rect.beginFill(0xFF700B, 1);
            rect.drawRect(-50, -50, c.w, c.h);
            rect.endFill();
            var gun = this.add.sprite(c.x + c.w / 2, c.y + c.h / 2, rect.generateTexture());
            this.physics.p2.enable(gun, this.boardSetting.debug);
            gun.body.static = true;
            var key = this.input.keyboard.addKey(keyCode);
            var moveDown = function () { gun.body.y += 20; };
            var moveUp = function () { gun.body.y -= 20; };
            key.onDown.add(moveDown);
            key.onUp.add(moveUp);
            gun.inputEnabled = true;
            gun.events.onInputDown.add(moveDown);
            gun.events.onInputUp.add(moveUp);
            gun.body.onEndContact.add(function (contactWithBody, a2, a3, a4) {
                contactWithBody.applyImpulseLocal([0, 50], 0, 0);
            });
            return gun;
        };
        Main.prototype.addBall = function (c) {
            var ball = this.add.sprite(c.x, c.y, c.key);
            ball.scale.set(2);
            this.physics.p2.enable(ball, this.boardSetting.debug);
            ball.body.clearShapes();
            ball.body.setCircle(8);
            ball.body.fixedRotation = true;
            ball.body.setMaterial(this.ballMaterial);
            // doensn't work, ball won't collide with anything
            // ball.body.collideWorldBounds = false;
            return ball;
        };
        Main.prototype.addArm = function (c, left, keyCode) {
            var _this = this;
            var arm = new Pinball.Flipper(this.game, c.x, c.y, c.key);
            this.game.add.existing(arm);
            //var arm:Flipper = this.add.sprite(c.x, c.y, c.key);
            this.physics.p2.enable(arm, this.boardSetting.debug);
            arm.body.clearShapes();
            if (left) {
                arm.body.loadPolygon(c.physics, 'arm_left');
            }
            else {
                arm.body.loadPolygon(c.physics, 'arm_right');
            }
            var offsetX = arm.width * 0.45;
            var offsetY = 0;
            var maxDegrees = c.maxDegrees;
            if (left) {
                offsetX = -offsetX;
                maxDegrees = -maxDegrees;
            }
            else {
                arm.scale.x *= -1;
            }
            var b = arm.body;
            var pivotPoint = this.game.add.sprite(arm.x + offsetX, arm.y + offsetY);
            this.physics.p2.enable(pivotPoint);
            pivotPoint.body.static = true;
            pivotPoint.body.clearCollision(true, true);
            var constraint = this.game.physics.p2.createRevoluteConstraint(arm, [offsetX, offsetY], pivotPoint, [0, 0]);
            this.setConstraintBound(constraint, maxDegrees);
            constraint.upperLimitEnabled = true;
            constraint.lowerLimitEnabled = true;
            constraint.setMotorSpeed(2);
            constraint.enableMotor();
            var key = this.input.keyboard.addKey(keyCode);
            var flipUp = function () { _this.setConstraintBound(constraint, -maxDegrees); };
            var flipDown = function () { _this.setConstraintBound(constraint, maxDegrees); };
            key.onDown.add(flipUp);
            key.onUp.add(flipDown);
            arm.inputEnabled = true;
            arm.events.onInputDown.add(flipUp);
            arm.events.onInputUp.add(flipDown);
            arm.flipUp = flipUp;
            arm.flipDown = flipDown;
            return arm;
        };
        Main.prototype.setConstraintBound = function (constraint, maxDegrees) {
            constraint.upperLimit = Phaser.Math.degToRad(maxDegrees);
            constraint.lowerLimit = Phaser.Math.degToRad(maxDegrees);
        };
        Main.prototype.addBumper = function (p) {
            var bumper = this.bumpers.create(p.x, p.y, this.boardSetting.bumpers.key, 0);
            bumper.originalX = p.x;
            bumper.scale.setTo(this.boardSetting.bumpers.scale);
            this.physics.p2.enable(bumper, this.boardSetting.debug);
            bumper.body.clearShapes();
            bumper.body.setCircle(bumper.width / 2);
            bumper.body.static = true;
            bumper.body.setMaterial(this.bumperMaterial);
            bumper.body.createBodyCallback(this.ball, this.hitBumper, this);
            return bumper;
        };
        Main.prototype.hitBumper = function (bumperBody, ballBody) {
            var _this = this;
            var s = bumperBody.sprite;
            var f = s.frame;
            s.frame = (f + 1) % 5;
            this.soundQueue.push('sound' + ((f + 1) % 5).toString());
            this.playSoundQueue();
            var sameBumersCount = 0;
            this.bumpers.forEach(function (bumper) {
                if (bumper.frame == s.frame) {
                    sameBumersCount++;
                    _this.animateBumper(bumper);
                }
            }, this);
            var offset = 5;
            if (Math.random() > 0.5)
                offset = -5;
            var shake = this.add.tween(bumperBody).to({ x: s.x + offset }, 50, Phaser.Easing.Bounce.InOut, false, 0, 4, true);
            // make sure it bumps back to the original position
            shake.onComplete.add(function () { bumperBody.x = bumperBody.sprite.originalX; });
            shake.start();
            this.score += 10 * Math.pow(2, sameBumersCount - 1);
            this.scoreText.text = 'SCORE: ' + this.score;
        };
        Main.prototype.playSoundQueue = function () {
            var _this = this;
            if (this.playingSound)
                return;
            this.playingSound = true;
            var playSound = function () {
                _this.add.audio(_this.soundQueue.shift()).play();
                setTimeout(function () {
                    if (_this.soundQueue.length > 0)
                        playSound();
                    else
                        _this.playingSound = false;
                }, 300);
            };
            playSound();
        };
        Main.prototype.animateBumper = function (bumper) {
            var copy = this.add.sprite(bumper.x, bumper.y, 'faces', bumper.frame);
            copy.anchor.setTo(0.5);
            var s = bumper.scale.x;
            copy.scale.setTo(s);
            var tween = this.add.tween(copy.scale).to({ x: s * 2, y: s * 2 }, 100, Phaser.Easing.Bounce.Out, true, 0, 0, true);
            this.add.tween(copy).to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out, true, 0, 0, true);
            tween.onComplete.add(function () {
                copy.destroy();
            });
        };
        Main.prototype.addDropHole = function () {
            var _this = this;
            var dropHole = this.add.sprite(this.world.centerX, this.world.height);
            this.physics.p2.enable(dropHole, this.boardSetting.debug);
            dropHole.body.static = true;
            dropHole.body.clearShapes();
            var body = dropHole.body;
            var c = this.boardSetting.dropHole;
            body.addRectangle(c.w, c.h, 0, c.yOffset);
            body.onBeginContact.add(function (contactWithBody) {
                if (contactWithBody == _this.ball.body) {
                    _this.ball.visible = false;
                    _this.lifes--;
                    if (_this.lifes > 0) {
                        _this.ball.visible = true;
                        _this.ball.body.x = _this.boardSetting.ball.x;
                        _this.ball.body.y = _this.boardSetting.ball.y;
                        _this.lifesText.text = 'LIFES: ' + _this.lifes;
                    }
                    else {
                        _this.lifesText.text = 'GAME OVER';
                    }
                }
            });
            var dropHoleCover = this.add.sprite(c.x, c.y, c.key);
            return dropHole;
        };
        Main.prototype.constrainVelocity = function (sprite, maxVelocity) {
            var body = sprite.body;
            var angle, currVelocitySqr, vx, vy;
            vx = body.data.velocity[0];
            vy = body.data.velocity[1];
            currVelocitySqr = vx * vx + vy * vy;
            if (currVelocitySqr > maxVelocity * maxVelocity) {
                angle = Math.atan2(vy, vx);
                vx = Math.cos(angle) * maxVelocity;
                vy = Math.cos(angle) * maxVelocity;
                body.data.velocity[0] = vx;
                body.data.velocity[1] = vy;
            }
        };
        Main.prototype.update = function () {
            if (this.boardSetting.debug && this.input.activePointer.isDown) {
                this.ball.body.x = this.input.activePointer.x;
                this.ball.body.y = this.input.activePointer.y;
                this.ball.body.velocity.x = 0;
                this.ball.body.velocity.y = 0;
            }
            if (this.input.activePointer.isDown) {
                var x = this.input.activePointer.x;
                var y = this.input.activePointer.y;
                if (x > 0 && x < 180 && y > 650 && y < 770) {
                    this.leftArm.flipUp();
                    this.flippedUp = true;
                }
                else if (x > 240 && x < 440 && y > 650 && y < 770) {
                    this.rightArm.flipUp();
                    this.flippedUp = true;
                }
            }
            if (this.flippedUp && this.input.activePointer.isUp) {
                this.leftArm.flipDown();
                this.rightArm.flipDown();
                this.flippedUp = false;
            }
            this.constrainVelocity(this.ball, 50);
        };
        Main.prototype.render = function () {
            //console.log(this.input.activePointer.x, this.input.activePointer.y);
            //this.game.debug.spriteInfo(this.ball, 32, 32);
            if (this.boardSetting.debug) {
                this.game.debug.pointer(this.input.activePointer);
            }
        };
        return Main;
    }(Phaser.State));
    Pinball.Main = Main;
})(Pinball || (Pinball = {}));
