var playState = {
    create: function() {
        var _this = this;
        if (googleFontReady) {
            this.createText();
        } else {
            setTimeout(this.createText, 1000);
        }

        this.flaggedAtLeastOnce = false;
        this.textStyle = { font: "28px VT323", fill: "#000000" };

        width = mode.width;
        height = mode.height;
        mineCount = mode.mineCount;
        game.stage.backgroundColor = '#e8e8e8';
        if (tileGroup) {
            tileGroup.pendingDestroy = true;
        }

        tileGroup = game.add.group();

        mineMap = this.genEmptyMineMap(width, height);
        knownCount = 0;
        flaggedCount = 0;
        gameOver = false;
        firstClick = true;
        this.gameStartTimestamp = null;

        face = game.add.sprite(game.width/2, 90, 'face', 0);
        face.scale.setTo(2,2);
        face.anchor.setTo(0.5, 0.5);
        face.inputEnabled = true;
        face.input.priorityID = 0;
        face.events.onInputDown.add(function() {
            face.frame = 0;
            game.state.start('play');
        }, this);

        wrench = game.add.sprite(game.width - 50, 50, 'wrench');
        wrench.scale.setTo(2,2);
        wrench.anchor.setTo(0.5, 0.5);
        wrench.inputEnabled = true;
        wrench.events.onInputDown.add(function() {
            if (configDialog) {
                configDialog.pendingDestroy = true;
                configDialog = null;
            } else {
                var w = game.width - 120;
                var h = game.height - 120;
                configDialog = game.add.group();
                var graphics = game.add.graphics(0, 0);
                configDialog.add(graphics);

                // background
                // greyBg is used to cover up the board
                graphics.beginFill(game.stage.backgroundColor);
                var greyBg = graphics.drawRect(0, (wrench.y+wrench.height/2), game.width, game.height);
                greyBg.inputEnabled = true;
                greyBg.input.priorityID = 1;

                graphics.beginFill(0xFFFFFF);
                var whiteBg = graphics.drawRoundedRect((game.width-w)/2, (game.height-h)/2, w, h, 50);
                whiteBg.inputEnabled = true;
                whiteBg.input.priorityID = 1;

                // buttons
                var bw = 200;
                var bh = 60;
                var createButton = function(x, y, newMode) {
                    var graphics = game.add.graphics(0, 0);
                    graphics.beginFill(game.stage.backgroundColor);
                    var button = graphics.drawRoundedRect(x, y, bw, bh, 10);

                    var text = game.add.text(x+bw/2, y+bh/2, 0, _this.textStyle);
                    text.anchor.setTo(0.5, 0.5);
                    text.text = newMode.name;

                    configDialog.add(button);
                    configDialog.add(text);
                    button.inputEnabled = true;
                    button.input.priorityID = 2;
                    button.events.onInputDown.add(function() {
                        mode = newMode;
                        configDialog.pendingDestroy = true;
                        configDialog = null;
                        game.state.start('play');
                    }, this);
                };

                createButton((game.width-bw)/2, (game.height-bh)/2 - 100, MODES.BEGINNER);
                createButton((game.width-bw)/2, (game.height-bh)/2,       MODES.INTERMEDIATE);
                createButton((game.width-bw)/2, (game.height-bh)/2 + 100, MODES.ADVANCED);
            }
        }, this);

        trophy = game.add.sprite(50, 50, 'trophy');
        trophy.scale.setTo(2,2);
        trophy.anchor.setTo(0.5, 0.5);
        trophy.inputEnabled = true;
        trophy.events.onInputDown.add(function() {
            game.state.start('achievements');
        }, this);

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var onClickHandler = (function() {
                    var tile = mineMap[i][j];

                    return function(sprite, pointer) {
                        if (gameOver) return;

                        // make sure it's within the same tile
                        var p1 = pointer.position;
                        var p2 = tile.sprite.worldPosition;
                        if (p1.x < p2.x || p1.x > p2.x+30 || p1.y < p2.y || p1.y > p2.y+30) return;

                        curClickTime = this.input.mouse.event.timeStamp;

                        var doubleClicked = false;
                        if (curClickTime - previousClickTime < 500 && previousClickTile == sprite) {
                            doubleClicked = true;
                        }

                        if (this.leftAndRight(pointer)) {
                            doubleClicked = true;
                        }

                        previousClickTime = curClickTime;
                        previousClickTile = sprite;
                        frame = this.getFrame(tile);

                        if (firstClick) {
                            firstClick = false;
                            mineMap = this.populateMineMap(mineMap, mineCount, tile.x, tile.y);
                            tile.sprite.frame = FRAME.KNOWN;
                            this.expandTile(tile.x, tile.y, mineMap);
                            gapiEventManager.increment('Actions - Reveal');
                        } else if (tile.known) {
                            if (doubleClicked) {
                                gapiEventManager.increment('Actions - Expand');
                                var neighborFlagCount = this.getNeighborFlagCount(tile.x, tile.y);
                                if (neighborFlagCount == tile.neighborMineCount) {
                                    try {
                                        this.expandTile(tile.x, tile.y, mineMap);
                                    } catch (e) {
                                        this.revealAll();
                                    }
                                }
                            } else {
                                gapiEventManager.increment('Actions - Invalid');
                            }
                        } else if (this.input.mouse.event.button === Phaser.Mouse.RIGHT_BUTTON) {
                            if (tile.sprite.frame == FRAME.FLAG) {
                                gapiEventManager.increment('Actions - Unflag');
                                tile.unflag();
                            } else {
                                gapiEventManager.increment('Actions - Flag');
                                tile.flag();
                            }
                        } else if (tile.sprite.frame == FRAME.FLAG) {
                            gapiEventManager.increment('Actions - Invalid');
                        } else if (tile.mine) {
                            gapiEventManager.increment('Actions - Reveal');
                            tile.sprite.frame = FRAME.BOOM;
                            this.revealAll();
                        } else {
                            gapiEventManager.increment('Actions - Reveal');
                            if (tile.neighborMineCount == 0) {
                                if (!tile.known) {
                                    tile.sprite.frame = frame;
                                    this.expandTile(tile.x, tile.y, mineMap);
                                }
                            } else {
                                tile.sprite.frame = frame;
                                tile.makeKnown();
                            }
                        }
                    }
                })();

                var tileSprite = tileGroup.create(j*10*tileScale, i*10*tileScale, 'tile', FRAME.UNKNOWN);
                tileSprite.frame = FRAME.UNKNOWN;
                tileSprite.scale.setTo(tileScale, tileScale);
                tileSprite.inputEnabled = true;
                tileSprite.input.priorityID = 0;
                tileSprite.events.onInputUp.add(onClickHandler, this);
                mineMap[i][j].sprite = tileSprite;
            }
        }

        var xOffset = (game.width - width*tileScale*10)/2;
        tileGroup.x = xOffset;
        tileGroup.y = 120;
    },

    leftAndRight: function(pointer) {
        // left and right button were both down at some point 
        // iff their down->up time period has an intersection
        var a0 = pointer.leftButton.timeDown; 
        var a1 = pointer.leftButton.timeUp;
        var b0 = pointer.rightButton.timeDown; 
        var b1 = pointer.rightButton.timeUp;
        return !((a1 < b0) || (b1 < a0));
    },

    update: function() {
        if (gameOver) return;

        if (textTimeElapsed) {
            if (this.gameStartTimestamp) {
                textTimeElapsed.text = Math.floor(((new Date()).getTime() - this.gameStartTimestamp) / 1000) || 0;
            } else {
                textTimeElapsed.text = 0;
            }

            textMinesLeft.text = mineCount - flaggedCount;
        }

        if (game.input.activePointer.leftButton.isDown) {
            face.frame = 3;
        } else {
            face.frame = 0;
        }
    },

    createText: function() {
        var style = { font: "28px VT323", fill: "#FF0000" };
        textTimeElapsed = game.add.text(315, 30, 0, style);
        textMinesLeft = game.add.text(585, 30, 0, style);
        textMinesLeft.anchor.setTo(1, 0);
    },

    revealAll: function() {
        gameOver = true;
        face.frame = 1;

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var tile = mineMap[i][j];
                if (tile.sprite.frame == FRAME.FLAG) {
                    if (!tile.mine) {
                        tile.sprite.frame = FRAME.WRONG_FLAG;
                    }
                } else if (!tile.known && tile.sprite.frame != FRAME.BOOM) {
                    tile.sprite.frame = this.getFrame(tile);
                    tile.makeKnown();
                }
            }
        }

        this.showToast('Busted!');
        this.incrementGameEvent();
    },

    incrementGameEvent: function() {
        switch(mode.name) {
            case 'Beginner':
                gapiEventManager.increment('Games - Beginner');
                break;
            case 'Intermediate':
                gapiEventManager.increment('Games - Intermediate');
                break;
            case 'Advanced':
                gapiEventManager.increment('Games - Advanced');
                break;
        }
    },

    getFrame: function(tile) {
        if (tile.mine) {
            return FRAME.MINE;
        } else if (tile.neighborMineCount == 0) {
            return FRAME.KNOWN;
        } else {
            return tile.neighborMineCount+3;
        }
    },

    genEmptyMineMap: function(width, height) {
        var map = [];
        var _this = this;

        for (var i = 0; i < height; i++) {
            map.push([]);
            for (var j = 0; j < width; j++) {
                map[i].push({ 
                    x: j,
                    y: i,
                    mine: true,
                    neighborMineCount: 0,
                    known: false,
                    makeKnown: function() {
                        if (this.known) return;

                        this.known = true;
                        knownCount++;

                        if (knownCount >= width*height-mineCount && !gameOver) {
                            gameOver = true;
                            face.frame = 2;

                            _this.recordWin((new Date()).getTime() - _this.gameStartTimestamp);
                            console.log('won in ', ((new Date()).getTime() - _this.gameStartTimestamp) / 1000, ' seconds');
                        }
                    },
                    flag: function() {
                        if (this.sprite.frame == FRAME.FLAG) return;
                        this.sprite.frame = FRAME.FLAG;
                        flaggedCount++;
                        _this.flaggedAtLeastOnce = true;
                    },
                    unflag: function() {
                        if (this.sprite.frame != FRAME.FLAG) return;
                        this.sprite.frame = FRAME.UNKNOWN;
                        flaggedCount--;
                    }
                });
            }
        }

        return map;
    },

    recordWin: function(elapsedMicroSeconds) {
        if (!googleServiceReady) return;

        this.recordScore(elapsedMicroSeconds);
        var achievementIds = [mode.onCompleteAchievementId];

        if (mode.name == 'Advanced') {
            if (!this.flaggedAtLeastOnce) {
                achievementIds.push(mode.daredevilAchievementId);
            }

            if (elapsedMicroSeconds / 1000 < 200) {
                achievementIds.push(mode.godzillaAchievmentId);
            }
        }

        this.recordAchievements(achievementIds);

        this.incrementGameEvent();
        switch(mode.name) {
            case 'Beginner':
                gapiEventManager.increment('Wins - Beginner');
                break;
            case 'Intermediate':
                gapiEventManager.increment('Wins - Intermediate');
                break;
            case 'Advanced':
                gapiEventManager.increment('Wins - Advanced');
                break;
        }
    },

    recordScore: function(elapsedMicroSeconds) {
        var _this = this;
        var request = gapi.client.games.scores.submit({ 
            leaderboardId: mode.leaderboardId,
            score: elapsedMicroSeconds
        });
        request.execute(function(response) {
            // Check to see if this is a new high score
            if (!response.beatenScoreTimeSpans) return;

            if (response.beatenScoreTimeSpans.indexOf('ALL_TIME') != -1) {
                _this.showToast('You got a new all-time high score!');
            } else if (response.beatenScoreTimeSpans.indexOf('WEEKLY') != -1) {
                _this.showToast('You got a new weekly high score!');
            } else if (response.beatenScoreTimeSpans.indexOf('DAILY') != -1) {
                _this.showToast('You got a new daily high score!');
            }
        })
    },

    recordAchievements: function(achievementIds) {
        var _this = this;

        var updates = [];
        for (var i = 0; i < achievementIds.length; i++) {
            updates.push({
                kind: 'games#achievementUpdateRequest',
                achievementId: achievementIds[i],
                updateType: 'UNLOCK',
            });
        }
        var request = gapi.client.games.achievements.updateMultiple({
            kind: "games#achievementUpdateMultipleRequest",
            updates: updates
        });
        request.execute(function(response) {
            var newlyUnlockedCount = 0;
            for (var i = 0; i < response.updatedAchievements.length; i++) {
                if (response.updatedAchievements[i].newlyUnlocked) {
                    newlyUnlockedCount++;
                }
            }

            if (newlyUnlockedCount > 0) {
                _this.showToast('You unlocked ' + newlyUnlockedCount + ' new achievements');
            }
        });
    },

    showToast: function(msg) {
        var w = 15*msg.length+100;
        var h = 120;
        var dialog = game.add.group();

        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFFFFFF);
        graphics.drawRoundedRect((game.width-w)/2, (game.height-h)/2, w, h, 50);
        dialog.add(graphics);

        var text = game.add.text(game.width/2, game.height/2, 0, this.textStyle);
        text.anchor.setTo(0.5, 0.5);
        text.text = msg;
        dialog.add(text);

        var tween = game.add.tween(dialog).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 1000);
        tween.onComplete.add(function() {
            dialog.destroy();
        }, this);
    },

    populateMineMap: function(emptyMap, mineCount, initialClickX, initialClickY) {
        var map = emptyMap;
        var width = map[0].length;
        var height = map.length;
        this.gameStartTimestamp = (new Date()).getTime();

        var minesPositions = [];
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                minesPositions.push([j, i]);
            }
        }

        // using strictly decreasing order so we can easily remove item from minesPositions
        for (var dy = 1; dy >= -1; dy--) {
            for (var dx = 1; dx >= -1; dx--) {
                var x = initialClickX+dx;
                var y = initialClickY+dy;

                if (x >= 0 && x < width && y >= 0 && y < height) {
                    map[y][x].mine = false;
                    minesPositions.splice(y*width+x, 1);
                }
            }
        }

        // shuffle the positions
        var minesToUncheckCount = minesPositions.length - mineCount;
        var minesToUncheck = this.getNRandomItems(minesPositions, minesToUncheckCount);

        for (var i = 0; i < minesToUncheck.length; i++) {
            var x = minesToUncheck[i][0];
            var y = minesToUncheck[i][1];
            map[y][x].mine = false;
        }

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                if (map[i][j].mine) {
                    for (var dx = -1; dx <= 1; dx++) {
                        for (var dy = -1; dy <= 1; dy++) {
                            var x = j+dx;
                            var y = i+dy;

                            if (!(dx == 0 && dy == 0) && x >= 0 && x < width && y >= 0 && y < height) {
                                map[y][x].neighborMineCount++;
                            }
                        }
                    }
                }
            }
        }

        return map;
    },

    getNRandomItems: function(items, n) {
        var bucket = [];

        for (var i = 0; i < n; i++) {
            var rndIdx = i + Math.floor(Math.random()*(items.length-i));
            bucket.push(items[rndIdx]);
            items[rndIdx] = items[i];
        }

        return bucket;
    },

    expandTile: function(x, y, mineMap) {
        var tile = mineMap[y][x];
        tile.makeKnown();

        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (!(dx == 0 && dy == 0) && x+dx >= 0 && x+dx < width && y+dy >= 0 && y+dy < height) {
                    var t = mineMap[y+dy][x+dx];
                    if (!t.known && t.sprite.frame != FRAME.FLAG) {
                        if (t.mine) {
                            t.sprite.frame = FRAME.BOOM;
                            throw 'Boom!';
                        }

                        var frame = this.getFrame(t);
                        t.sprite.frame = frame;
                        t.makeKnown();
                        if (t.neighborMineCount == 0) {
                            this.expandTile(x+dx, y+dy, mineMap);
                        }
                    }
                }
            }
        }
    },

    getNeighborFlagCount: function(x0, y0) {
        var flagCount = 0;

        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                var x = x0+dx;
                var y = y0+dy;

                if (x >= 0 && x < width && y >= 0 && y < height && mineMap[y][x].sprite.frame == FRAME.FLAG) {
                    flagCount++;
                }
            }
        }

        return flagCount;
    },
};
