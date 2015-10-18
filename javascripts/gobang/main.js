var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GobangOnline;
(function (GobangOnline) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', '/resources/gobang/loader.png');
        };
        Boot.prototype.create = function () {
            this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
            this.scale.refresh();
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    GobangOnline.Boot = Boot;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('menu', '/resources/gobang/menu.jpg');
            this.load.image('singlePlayerButton', '/resources/gobang/Play-button.gif');
            this.load.image('button', '/resources/gobang/blue-button-hi.png');
            this.load.image('board', '/resources/gobang/board.png');
            this.load.spritesheet('piece', '/resources/gobang/pieces.png', 100, 100, 2);
            this.load.bitmapFont('Castaway', '/resources/gobang/fonts/Castaway.png', '/resources/gobang/fonts/Castaway.xml');
            this.stage.smoothed = false;
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    GobangOnline.Preloader = Preloader;
    function addButton(game, x, y, text, callback) {
        var button = game.add.button(x, y, 'button', callback);
        button.anchor.setTo(0.5, 0.5);
        button.scale.setTo(0.5, 0.5);
        var bitmapText = game.add.bitmapText(x, y, 'Castaway', text);
        bitmapText.anchor.setTo(0.5, 1);
        var group = game.add.group();
        group.addChild(button);
        group.addChild(bitmapText);
        return group;
    }
    GobangOnline.addButton = addButton;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var DifficultyMenu = (function (_super) {
        __extends(DifficultyMenu, _super);
        function DifficultyMenu() {
            _super.apply(this, arguments);
        }
        DifficultyMenu.prototype.create = function () {
            var _this = this;
            this.background = this.add.sprite(0, 0, 'menu');
            this.background.alpha = 0;
            this.background.scale.x = this.game.width / this.background.width;
            this.background.scale.y = this.game.height / this.background.height;
            this.add.tween(this.background).to({ alpha: 1.0 }, 2000, Phaser.Easing.Bounce.InOut, true);
            GobangOnline.addButton(this.game, this.game.width / 2, this.game.height / 2 - 150, 'EASY', function () {
                _this.game.state.start('SinglePlayer', true, false, 1);
            });
            GobangOnline.addButton(this.game, this.game.width / 2, this.game.height / 2, 'MEDIUM', function () {
                _this.game.state.start('SinglePlayer', true, false, 2);
            });
            GobangOnline.addButton(this.game, this.game.width / 2, this.game.height / 2 + 150, 'HARD', function () {
                _this.game.state.start('SinglePlayer', true, false, 3);
            });
        };
        return DifficultyMenu;
    })(Phaser.State);
    GobangOnline.DifficultyMenu = DifficultyMenu;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            var _this = this;
            this.background = this.add.sprite(0, 0, 'menu');
            this.background.alpha = 0;
            this.background.scale.x = this.game.width / this.background.width;
            this.background.scale.y = this.game.height / this.background.height;
            this.add.tween(this.background).to({ alpha: 1.0 }, 2000, Phaser.Easing.Bounce.InOut, true);
            GobangOnline.addButton(this.game, this.game.width / 2, this.game.height / 2 - 100, 'SINGLE PLAYER', function () {
                _this.game.state.start('DifficultyMenu');
            });
            GobangOnline.addButton(this.game, this.game.width / 2, this.game.height / 2 + 100, 'MULTI PLAYER', function () {
                _this.game.state.start('MultiPlayer');
            });
        };
        return MainMenu;
    })(Phaser.State);
    GobangOnline.MainMenu = MainMenu;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    (function (Color) {
        Color[Color["Empty"] = 0] = "Empty";
        Color[Color["Black"] = 1] = "Black";
        Color[Color["White"] = 2] = "White";
    })(GobangOnline.Color || (GobangOnline.Color = {}));
    var Color = GobangOnline.Color;
    ;
    function getOpponentColor(color) {
        return color == Color.Black ? Color.White : Color.Black;
    }
    GobangOnline.getOpponentColor = getOpponentColor;
    var Board = (function () {
        function Board(size) {
            this.size = size;
            this.table = [];
            this.moveLog = [];
            for (var i = 0; i < size; i++) {
                this.table[i] = [];
                for (var j = 0; j < size; j++) {
                    this.table[i][j] = Color.Empty;
                }
            }
        }
        Board.prototype.getMoveAt = function (id) {
            return this.moveLog[id];
        };
        Board.prototype.getMoveCount = function () {
            return this.moveLog.length;
        };
        Board.prototype.colorAt = function (move) {
            return this.table[move.row][move.column];
        };
        Board.prototype.setColorAt = function (move, color) {
            this.table[move.row][move.column] = color;
            this.moveLog.push(move);
        };
        Board.prototype.revertLastMove = function () {
            var lastMove = this.moveLog.pop();
            this.table[lastMove.row][lastMove.column] = Color.Empty;
        };
        Board.prototype.isMoveValid = function (move) {
            return !this.isOutOfBound(move) && this.colorAt(move) == Color.Empty;
        };
        Board.prototype.isOutOfBound = function (move) {
            return move.row < 0
                || move.row >= this.size
                || move.column < 0
                || move.column >= this.size;
        };
        Board.prototype.hasNeighbor = function (move) {
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    var neighbor = { row: move.row + dy, column: move.column + dx };
                    if (!(dx == 0 && dy == 0) && !this.isOutOfBound(neighbor) && this.colorAt(neighbor) != Color.Empty) {
                        return true;
                    }
                }
            }
            return false;
        };
        return Board;
    })();
    GobangOnline.Board = Board;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var Gobang = (function () {
        function Gobang(size, player1, player2) {
            this.size = size;
            this.player1 = player1;
            this.player2 = player2;
            this.gameOver = false;
            this.board = new GobangOnline.Board(size);
            if (Math.floor(Math.random() * 2) == 0) {
                console.log('player 1\'s turn');
                this.pendingPlayer = player1;
                this.nonPendingPlayer = player2;
            }
            else {
                console.log('player 2\'s turn');
                this.nonPendingPlayer = player1;
                this.pendingPlayer = player2;
            }
            this.pendingPlayer.setColor(GobangOnline.Color.Black);
            this.nonPendingPlayer.setColor(GobangOnline.Color.White);
            this.blackPlayer = this.pendingPlayer;
            this.whitePlayer = this.nonPendingPlayer;
        }
        Gobang.prototype.startGame = function () {
            this.pendingPlayer.takeTurn(this, null);
        };
        Gobang.prototype.setOnRegisterMove = function (callback) {
            this.onRegisterMove = callback;
        };
        Gobang.prototype.registerMove = function (player, move) {
            if (this.gameOver || player != this.pendingPlayer) {
                return;
            }
            if (this.board.colorAt(move) != GobangOnline.Color.Empty) {
                player.badMove(this, move);
                return;
            }
            this.board.setColorAt(move, player.color);
            if (this.isGameOver(player)) {
                this.gameOver = true;
                player.win();
                this.nonPendingPlayer.lose();
                if (this.onGameOver) {
                    this.onGameOver();
                }
                return;
            }
            this.swapPlayingPendingState();
            this.pendingPlayer.takeTurn(this, move);
            if (this.onRegisterMove) {
                this.onRegisterMove(player, move);
            }
        };
        Gobang.prototype.swapPlayingPendingState = function () {
            var tmp = this.pendingPlayer;
            this.pendingPlayer = this.nonPendingPlayer;
            this.nonPendingPlayer = tmp;
        };
        Gobang.prototype.isGameOver = function (checkPlayer) {
            var run;
            for (var i = 0; i < this.size; i++) {
                run = 0;
                for (var j = 0; j < this.size; j++) {
                    if (this.board.colorAt({ row: i, column: j }) == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                }
            }
            for (var i = 0; i < this.size; i++) {
                run = 0;
                for (var j = 0; j < this.size; j++) {
                    if (this.board.colorAt({ row: j, column: i }) == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                }
            }
            for (var i = 0; i < (this.size - 4) * 2 - 1; i++) {
                run = 0;
                var r = Math.max(this.size - 5 - i, 0);
                var c = Math.max(i - (this.size - 5), 0);
                while (r < this.size && c < this.size) {
                    if (this.board.colorAt({ row: r, column: c }) == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                    r++;
                    c++;
                }
            }
            for (var i = 0; i < (this.size - 4) * 2 - 1; i++) {
                run = 0;
                var r = Math.min(i + 4, this.size - 1);
                var c = Math.max(i - (this.size - 5), 0);
                while (r >= 0 && c < this.size) {
                    if (this.board.colorAt({ row: r, column: c }) == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                    r--;
                    c++;
                }
            }
            return false;
        };
        return Gobang;
    })();
    GobangOnline.Gobang = Gobang;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var HumanPlayer = (function () {
        function HumanPlayer() {
            this.takingTurn = false;
        }
        HumanPlayer.prototype.setColor = function (color) {
            this.color = color;
        };
        HumanPlayer.prototype.takeTurn = function (context, lastMove) {
            this.takingTurn = true;
            this.context = context;
        };
        HumanPlayer.prototype.makeMove = function (move) {
            this.takingTurn = false;
            this.context.registerMove(this, move);
        };
        HumanPlayer.prototype.badMove = function (context, badMove) {
        };
        HumanPlayer.prototype.win = function () {
            this.onWinCallback();
        };
        HumanPlayer.prototype.lose = function () {
            this.onLossCallback();
        };
        return HumanPlayer;
    })();
    GobangOnline.HumanPlayer = HumanPlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    GobangOnline.patternScore = [
        {
            name: "长连",
            patterns: [
                "11111"
            ],
            score: 100000,
            rivalScore: 10000
        },
        {
            name: "活四",
            patterns: [
                "011110"
            ],
            score: 5000,
            rivalScore: 3000
        },
        {
            name: "冲四",
            patterns: [
                "011112",
                "0101110",
                "0110110"
            ],
            score: 2100,
            rivalScore: 1800
        },
        {
            name: "活三",
            patterns: [
                "01110",
                "010110"
            ],
            score: 1800,
            rivalScore: 1200
        },
        {
            name: "眠三",
            patterns: [
                "001112",
                "010112",
                "011012",
                "10011",
                "10101",
                "2011102"
            ],
            score: 600,
            rivalScore: 480
        },
        {
            name: "活二",
            patterns: [
                "00110",
                "01010",
                "010010"
            ],
            score: 300,
            rivalScore: 240
        },
        {
            name: "眠二",
            patterns: [
                "000112",
                "001012",
                "010012",
                "10001",
                "2010102",
                "2011002"
            ],
            score: 100,
            rivalScore: 80
        },
    ];
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    (function (PieceOwnership) {
        PieceOwnership[PieceOwnership["None"] = 0] = "None";
        PieceOwnership[PieceOwnership["Mine"] = 1] = "Mine";
        PieceOwnership[PieceOwnership["Opponent"] = 2] = "Opponent";
        PieceOwnership[PieceOwnership["Root"] = 3] = "Root";
    })(GobangOnline.PieceOwnership || (GobangOnline.PieceOwnership = {}));
    var PieceOwnership = GobangOnline.PieceOwnership;
    ;
    var Node = (function () {
        function Node(ownership) {
            this.ownership = ownership;
            this.children = {};
            this.score = 0;
            this.rivalScore = 0;
        }
        return Node;
    })();
    GobangOnline.root = new Node(PieceOwnership.Root);
    GobangOnline.maxDepth = 0;
    for (var i = 0; i < GobangOnline.patternScore.length; i++) {
        var patternData = GobangOnline.patternScore[i];
        for (var j = 0; j < patternData.patterns.length; j++) {
            var pattern = patternData.patterns[j];
            var node = GobangOnline.root;
            GobangOnline.maxDepth = Math.max(GobangOnline.maxDepth, pattern.length);
            for (var k = 0; k < pattern.length; k++) {
                var ownership = parseInt(pattern[k]);
                if (!node.children[ownership]) {
                    node.children[ownership] = new Node(ownership);
                }
                node = node.children[ownership];
                if (k == pattern.length - 1) {
                    node.score = patternData.score;
                    node.rivalScore = patternData.rivalScore;
                }
            }
            node = GobangOnline.root;
            for (var k = pattern.length - 1; k >= 0; k--) {
                var ownership = parseInt(pattern[k]);
                if (!node.children[ownership]) {
                    node.children[ownership] = new Node(ownership);
                }
                node = node.children[ownership];
                if (k == 0) {
                    node.score = patternData.score;
                    node.rivalScore = patternData.rivalScore;
                }
            }
        }
    }
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    function color2ownership(pieceColor, playerColor) {
        if (pieceColor == playerColor) {
            return GobangOnline.PieceOwnership.Mine;
        }
        else if (pieceColor == GobangOnline.Color.Empty) {
            return GobangOnline.PieceOwnership.None;
        }
        else {
            return GobangOnline.PieceOwnership.Opponent;
        }
    }
    ;
    function computeHeuristicAt(playerColor, move, board, getRivalScore) {
        var heuristics = 0;
        var directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (var i = 0; i < directions.length; i++) {
            var node = GobangOnline.root;
            var dx = directions[i][0];
            var dy = directions[i][1];
            for (var j = 0; j < GobangOnline.maxDepth; j++) {
                var m = { row: move.row + dy * j, column: move.column + dx * j };
                if (board.isOutOfBound(m)) {
                    break;
                }
                var ownership;
                if (getRivalScore) {
                    ownership = color2ownership(board.colorAt(m), GobangOnline.getOpponentColor(playerColor));
                }
                else {
                    ownership = color2ownership(board.colorAt(m), playerColor);
                }
                if (node.children[ownership]) {
                    node = node.children[ownership];
                    heuristics = Math.max(heuristics, !getRivalScore ? node.rivalScore : node.score);
                }
                else {
                    break;
                }
            }
        }
        return heuristics;
    }
    GobangOnline.computeHeuristicAt = computeHeuristicAt;
    function computeHeuristicOfBoard(playerColor, board) {
        var heuristics = 0;
        var heuristicsRival = 0;
        for (var i = 0; i < board.size; i++) {
            for (var j = 0; j < board.size; j++) {
                var m = { row: i, column: j };
                heuristics = Math.max(heuristics, computeHeuristicAt(playerColor, m, board, false));
                heuristicsRival = Math.max(heuristicsRival, computeHeuristicAt(playerColor, m, board, true));
            }
        }
        return heuristics - heuristicsRival;
    }
    GobangOnline.computeHeuristicOfBoard = computeHeuristicOfBoard;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var AiPlayer = (function () {
        function AiPlayer(depth, maxCandidates) {
            this.depth = depth;
            this.maxCandidates = maxCandidates;
            console.log(this.depth, this.maxCandidates);
        }
        AiPlayer.prototype.setColor = function (color) {
            this.color = color;
        };
        AiPlayer.prototype.takeTurn = function (context, lastMove) {
            var v = this.alphabeta(context.board, this.depth, -Infinity, Infinity, true);
            console.log(v, this.maximizingMove);
            context.registerMove(this, this.maximizingMove);
        };
        AiPlayer.prototype.alphabeta = function (node, depth, alpha, beta, maximizingPlayer) {
            if (depth == 0) {
                return GobangOnline.computeHeuristicOfBoard(this.color, node);
            }
            if (maximizingPlayer) {
                var v = -Infinity;
                var maximizingMove;
                var moves = this.getTopCandidates(node, this.maxCandidates, true);
                for (var i = 0; i < moves.length; i++) {
                    var m = moves[i];
                    node.setColorAt(m, this.color);
                    var tmp = this.alphabeta(node, depth - 1, alpha, beta, !maximizingPlayer);
                    if (depth == this.depth && tmp > v) {
                        this.maximizingMove = m;
                    }
                    v = Math.max(v, tmp);
                    node.revertLastMove();
                    alpha = Math.max(alpha, v);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return v;
            }
            else {
                var v = Infinity;
                var moves = this.getTopCandidates(node, this.maxCandidates, false);
                for (var i = 0; i < moves.length; i++) {
                    var m = moves[i];
                    node.setColorAt(m, GobangOnline.getOpponentColor(this.color));
                    var tmp = this.alphabeta(node, depth - 1, alpha, beta, !maximizingPlayer);
                    v = Math.min(v, tmp);
                    node.revertLastMove();
                    beta = Math.min(beta, v);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return v;
            }
        };
        AiPlayer.prototype.getTopCandidates = function (board, maxCandidates, maximizingPlayer) {
            var candidates = this.getCandidates(board);
            var candidateHeuristics = [];
            for (var i = 0; i < candidates.length; i++) {
                var move = candidates[i];
                board.setColorAt(move, this.color);
                candidateHeuristics.push([move, GobangOnline.computeHeuristicOfBoard(this.color, board)]);
                board.revertLastMove();
            }
            if (maximizingPlayer) {
                candidateHeuristics.sort(function (a, b) { return b[1] - a[1]; });
            }
            else {
                candidateHeuristics.sort(function (a, b) { return a[1] - b[1]; });
            }
            var topCandidates = [];
            for (var i = 0; i < Math.min(maxCandidates, candidateHeuristics.length); i++) {
                topCandidates.push(candidateHeuristics[i][0]);
            }
            return topCandidates;
        };
        AiPlayer.prototype.getCandidates = function (board) {
            var candidates = [];
            for (var i = 0; i < board.size; i++) {
                for (var j = 0; j < board.size; j++) {
                    var move = { row: i, column: j };
                    if (board.colorAt(move) == GobangOnline.Color.Empty && board.hasNeighbor(move)) {
                        candidates.push(move);
                    }
                }
            }
            if (candidates.length == 0) {
                var mid = Math.round(board.size / 2);
                candidates.push({ row: mid, column: mid });
            }
            return candidates;
        };
        AiPlayer.prototype.badMove = function (context, badMove) {
        };
        AiPlayer.prototype.win = function () {
        };
        AiPlayer.prototype.lose = function () {
        };
        return AiPlayer;
    })();
    GobangOnline.AiPlayer = AiPlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    GobangOnline.Settings = {
        API_KEY: 'swe48rh5c9l1h5mi',
        ROOMID: 'server',
        BOARD_SIZE: 19,
        MAX_WAIT_PER_MOVE: 10,
        BOARD_X_START: 128 - 9,
        BOARD_Y_START: 26 - 9,
        BOARD_X_END: 689 - 9,
        BOARD_Y_END: 590 - 9,
    };
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var SinglePlayer = (function (_super) {
        __extends(SinglePlayer, _super);
        function SinglePlayer() {
            _super.apply(this, arguments);
            this.worldScale = 1;
        }
        SinglePlayer.prototype.init = function (aiDepth) {
            this.aiDepth = aiDepth;
        };
        SinglePlayer.prototype.create = function () {
            var _this = this;
            this.stageGroup = this.game.add.group();
            this.board = this.add.sprite(this.game.width / 2, this.game.height / 2, 'board');
            this.stageGroup.add(this.board);
            this.board.anchor.setTo(0.5, 0.5);
            var scale = this.game.height / this.board.height;
            this.board.scale.setTo(scale, scale);
            this.humanPlayer = new GobangOnline.HumanPlayer();
            this.humanPlayer.onWinCallback = function () {
                var msg = _this.game.add.bitmapText(_this.game.width / 2, _this.game.height / 2, 'Castaway', 'YOU WON!');
                msg.anchor.setTo(0.5, 0.5);
            };
            this.humanPlayer.onLossCallback = function () {
                var msg = _this.game.add.bitmapText(_this.game.width / 2, _this.game.height / 2, 'Castaway', 'YOU LOST!');
                msg.anchor.setTo(0.5, 0.5);
            };
            this.aiPlayer = new GobangOnline.AiPlayer(this.aiDepth, 100);
            this.engine = new GobangOnline.Gobang(GobangOnline.Settings.BOARD_SIZE, this.humanPlayer, this.aiPlayer);
            this.engine.setOnRegisterMove(function (player, move) {
                var pos = _this.move2position(move);
                var piece = _this.add.sprite(pos.x, pos.y, 'piece');
                if (player.color == GobangOnline.Color.White) {
                    piece.frame = 1;
                }
                piece.anchor.setTo(0.5, 0.5);
                piece.scale.setTo(30 / piece.width);
                _this.stageGroup.add(piece);
            });
            this.engine.startGame();
        };
        SinglePlayer.prototype.move2position = function (move) {
            return {
                x: move.column * (GobangOnline.Settings.BOARD_X_END - GobangOnline.Settings.BOARD_X_START) / (GobangOnline.Settings.BOARD_SIZE - 1) + GobangOnline.Settings.BOARD_X_START,
                y: move.row * (GobangOnline.Settings.BOARD_Y_END - GobangOnline.Settings.BOARD_Y_START) / (GobangOnline.Settings.BOARD_SIZE - 1) + GobangOnline.Settings.BOARD_Y_START
            };
        };
        SinglePlayer.prototype.position2move = function (position) {
            return {
                row: Math.round((position.y - GobangOnline.Settings.BOARD_Y_START) / ((GobangOnline.Settings.BOARD_Y_END - GobangOnline.Settings.BOARD_Y_START) / (GobangOnline.Settings.BOARD_SIZE - 1))),
                column: Math.round((position.x - GobangOnline.Settings.BOARD_X_START) / ((GobangOnline.Settings.BOARD_X_END - GobangOnline.Settings.BOARD_X_START) / (GobangOnline.Settings.BOARD_SIZE - 1)))
            };
        };
        SinglePlayer.prototype.update = function () {
            if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
                this.oldCenter = this.center;
                this.center = { x: (this.input.pointer1.x + this.input.pointer2.x) / 2, y: (this.input.pointer1.y + this.input.pointer2.y) / 2 };
                this.oldDistance = this.distance;
                this.distance = Phaser.Math.distance(this.input.pointer1.x, this.input.pointer1.y, this.input.pointer2.x, this.input.pointer2.y);
                var delta = Math.abs(this.oldDistance - this.distance);
                if (delta > 4) {
                    if (this.oldDistance < this.distance) {
                        this.worldScale -= 0.02;
                    }
                    else {
                        this.worldScale += 0.02;
                    }
                    this.worldScale = Phaser.Math.clamp(this.worldScale, 0.5, 1.5);
                    this.stageGroup.scale.set(this.worldScale);
                }
                else {
                    if (Math.abs(this.center.x - this.oldCenter.x) > 4) {
                        if (this.center.x > this.oldCenter.x) {
                            this.camera.x += 4;
                        }
                    }
                    if (Math.abs(this.center.y - this.oldCenter.y) > 4) {
                        if (this.center.y > this.oldCenter.y) {
                            this.camera.y += 4;
                        }
                    }
                }
            }
            else if (this.humanPlayer.takingTurn) {
                var move = this.position2move(this.game.input.activePointer);
                if (this.game.input.activePointer.isDown) {
                    if (this.engine.board.isMoveValid(move) && !this.pendingMove) {
                        this.pendingMove = move;
                    }
                }
                else {
                    if (this.pendingMove && this.pendingMove.row == move.row && this.pendingMove.column == move.column) {
                        this.humanPlayer.makeMove(move);
                    }
                    this.pendingMove = null;
                }
            }
        };
        return SinglePlayer;
    })(Phaser.State);
    GobangOnline.SinglePlayer = SinglePlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    (function (MsgType) {
        MsgType[MsgType["TakeTurn"] = 0] = "TakeTurn";
        MsgType[MsgType["Move"] = 1] = "Move";
        MsgType[MsgType["GameOver"] = 2] = "GameOver";
        MsgType[MsgType["NewPlayer"] = 3] = "NewPlayer";
        MsgType[MsgType["PopupText"] = 4] = "PopupText";
    })(GobangOnline.MsgType || (GobangOnline.MsgType = {}));
    var MsgType = GobangOnline.MsgType;
    ;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var RemotePlayer = (function () {
        function RemotePlayer(conn) {
            this.conn = conn;
        }
        RemotePlayer.prototype.send = function (msg) {
            this.conn.send(msg);
        };
        RemotePlayer.prototype.setColor = function (color) {
            this.color = color;
        };
        RemotePlayer.prototype.takeTurn = function (context, lastMove) {
            this.context = context;
            this.conn.send({ type: GobangOnline.MsgType.TakeTurn, lastMove: lastMove });
            this.onTakeTurnCallback(this.context.board.getMoveCount());
        };
        RemotePlayer.prototype.makeMove = function (move) {
            this.context.registerMove(this, move);
        };
        RemotePlayer.prototype.badMove = function (context, badMove) {
        };
        RemotePlayer.prototype.win = function () {
        };
        RemotePlayer.prototype.lose = function () {
        };
        return RemotePlayer;
    })();
    GobangOnline.RemotePlayer = RemotePlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var MultiPlayer = (function (_super) {
        __extends(MultiPlayer, _super);
        function MultiPlayer() {
            _super.apply(this, arguments);
            this.takingTurn = false;
        }
        MultiPlayer.prototype.create = function () {
            this.board = this.add.sprite(this.game.width / 2, this.game.height / 2, 'board');
            this.board.anchor.setTo(0.5, 0.5);
            var scale = this.game.height / this.board.height;
            this.board.scale.setTo(scale, scale);
            this.createServerIfNotExist();
            this.localBoard = new GobangOnline.Board(GobangOnline.Settings.BOARD_SIZE);
        };
        MultiPlayer.prototype.createServerIfNotExist = function () {
            var _this = this;
            this.server = new Peer(GobangOnline.Settings.ROOMID, { key: GobangOnline.Settings.API_KEY });
            this.server.on('error', function (e) {
                console.log(e);
                if (e.toString().match(/ID.*is taken/)) {
                    _this.createClient();
                }
            });
            this.server.on('open', function () {
                _this.connToClients = [];
                console.log('server created!');
                _this.createClient();
                _this.server.on('connection', function (conn) {
                    console.log('someone joined');
                    _this.connToClients.push(conn);
                    _this.handleConnectionToClient(conn);
                    if (_this.connToClients.length == 2) {
                        console.log('got enough players');
                        console.log('game start in 1 second');
                        setTimeout(function () {
                            _this.remotePlayer1 = new GobangOnline.RemotePlayer(_this.connToClients[0]);
                            _this.remotePlayer2 = new GobangOnline.RemotePlayer(_this.connToClients[1]);
                            _this.engine = new GobangOnline.Gobang(GobangOnline.Settings.BOARD_SIZE, _this.remotePlayer1, _this.remotePlayer2);
                            _this.engine.blackPlayer.send({ type: GobangOnline.MsgType.PopupText, text: 'GAME BEGAN\nYOU ARE BLACK' });
                            _this.engine.whitePlayer.send({ type: GobangOnline.MsgType.PopupText, text: 'GAME BEGAN\nYOU ARE WHITE' });
                            _this.engine.blackPlayer.onTakeTurnCallback = function (moveCountBeforeTurn) {
                                setTimeout(function () {
                                    if (moveCountBeforeTurn == _this.engine.board.getMoveCount()) {
                                        _this.declareWinner(GobangOnline.Color.White);
                                    }
                                }, (GobangOnline.Settings.MAX_WAIT_PER_MOVE + 1) * 1000);
                            };
                            _this.engine.whitePlayer.onTakeTurnCallback = function (moveCountBeforeTurn) {
                                setTimeout(function () {
                                    if (moveCountBeforeTurn == _this.engine.board.getMoveCount()) {
                                        _this.declareWinner(GobangOnline.Color.Black);
                                    }
                                }, (GobangOnline.Settings.MAX_WAIT_PER_MOVE + 1) * 1000);
                            };
                            _this.engine.startGame();
                            _this.engine.onGameOver = function () {
                                _this.declareWinner(_this.engine.pendingPlayer.color);
                            };
                        }, 1000);
                    }
                });
            });
        };
        MultiPlayer.prototype.declareWinner = function (winnerColor) {
            var _this = this;
            this.broadCast({ type: GobangOnline.MsgType.GameOver, winnerColor: winnerColor });
            setTimeout(function () {
                _this.server.destroy();
            }, 1000);
        };
        MultiPlayer.prototype.broadCast = function (msg) {
            this.connToClients.forEach(function (conn) {
                conn.send(msg);
            });
        };
        MultiPlayer.prototype.handleConnectionToClient = function (conn) {
            var _this = this;
            conn.on('open', function () {
            });
            conn.on('data', function (data) {
                console.log('server got message: ', data);
                switch (data.type) {
                    case GobangOnline.MsgType.Move:
                        var move = data.move;
                        _this.broadCast({ type: GobangOnline.MsgType.Move, move: move, moveId: _this.engine.board.getMoveCount() });
                        _this.engine.pendingPlayer.makeMove(move);
                        break;
                    case GobangOnline.MsgType.NewPlayer:
                        if (_this.isFirstClient(conn)) {
                            _this.connToClients[0].send({ type: GobangOnline.MsgType.PopupText, text: 'WAITING FOR ANOTHER PLAYER' });
                        }
                        else if (_this.isSecondClient(conn)) {
                            _this.broadCast({ type: GobangOnline.MsgType.PopupText, text: 'GAME IS READY' });
                        }
                        else {
                            _this.broadCast({ type: GobangOnline.MsgType.PopupText, text: 'AN OBSERVER HAS ENTERED' });
                            setTimeout(function () {
                                for (var i = 0; i < _this.engine.board.getMoveCount(); i++) {
                                    conn.send({ type: GobangOnline.MsgType.Move, move: _this.engine.board.getMoveAt(i), moveId: i });
                                }
                            }, 1000);
                        }
                        break;
                }
            });
        };
        MultiPlayer.prototype.isFirstClient = function (conn) {
            return conn.peer == this.connToClients[0].peer;
        };
        MultiPlayer.prototype.isSecondClient = function (conn) {
            return conn.peer == this.connToClients[1].peer;
        };
        MultiPlayer.prototype.createClient = function () {
            var _this = this;
            this.client = new Peer({ key: GobangOnline.Settings.API_KEY });
            this.client.on('error', function () {
            });
            this.client.on('open', function () {
                _this.connToServer = _this.client.connect(GobangOnline.Settings.ROOMID, { reliable: true });
                _this.connToServer.on('open', function () {
                    _this.handleConnectionToServer();
                    _this.client.disconnect();
                    _this.connToServer.send({ type: GobangOnline.MsgType.NewPlayer });
                });
            });
        };
        MultiPlayer.prototype.handleConnectionToServer = function () {
            var _this = this;
            this.connToServer.on('error', function () {
            });
            this.connToServer.on('data', function (data) {
                console.log('client got message: ', data);
                switch (data.type) {
                    case GobangOnline.MsgType.TakeTurn:
                        _this.takingTurn = true;
                        _this.turnBeganAt = (new Date()).getTime();
                        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
                        _this.timer = _this.add.text(_this.game.width - 25, 0, GobangOnline.Settings.MAX_WAIT_PER_MOVE.toString(), style);
                        _this.timer.anchor.setTo(1, 0);
                        break;
                    case GobangOnline.MsgType.Move:
                        var move = data.move;
                        var pos = _this.move2position(move);
                        var piece = _this.add.sprite(pos.x, pos.y, 'piece');
                        var blackTurn = data.moveId % 2 == 0;
                        if (!blackTurn) {
                            piece.frame = 1;
                        }
                        piece.anchor.setTo(0.5, 0.5);
                        piece.scale.setTo(30 / piece.width);
                        if (blackTurn) {
                            _this.localBoard.setColorAt(move, GobangOnline.Color.Black);
                        }
                        else {
                            _this.localBoard.setColorAt(move, GobangOnline.Color.White);
                        }
                        break;
                    case GobangOnline.MsgType.GameOver:
                        var txt = data.winnerColor == GobangOnline.Color.Black ? 'BLACK WINS' : 'WHITE WINS';
                        var msg = _this.game.add.bitmapText(_this.game.width / 2, _this.game.height / 2, 'Castaway', txt);
                        msg.anchor.setTo(0.5, 0.5);
                        break;
                    case GobangOnline.MsgType.PopupText:
                        var msg = _this.game.add.bitmapText(_this.game.width / 2, _this.game.height / 2, 'Castaway', data.text);
                        msg.anchor.setTo(0.5, 0.5);
                        _this.add.tween(msg).to({ alpha: 0 }, 700, null, true, 1000);
                        break;
                }
            });
        };
        MultiPlayer.prototype.update = function () {
            if (this.takingTurn) {
                var move = this.position2move(this.game.input.activePointer);
                var secondsLeft = Math.max(0, GobangOnline.Settings.MAX_WAIT_PER_MOVE - Math.floor((new Date().getTime() - this.turnBeganAt) / 1000));
                this.timer.setText(secondsLeft.toString());
                if (this.game.input.activePointer.isDown) {
                    if (this.localBoard.isMoveValid(move) && !this.pendingMove) {
                        this.pendingMove = move;
                    }
                }
                else {
                    if (this.pendingMove && this.pendingMove.row == move.row && this.pendingMove.column == move.column) {
                        this.connToServer.send({ type: GobangOnline.MsgType.Move, move: move });
                        this.takingTurn = false;
                    }
                    this.pendingMove = null;
                }
            }
            else if (this.timer) {
                this.timer.destroy();
                this.timer = null;
            }
        };
        MultiPlayer.prototype.move2position = function (move) {
            return {
                x: move.column * (GobangOnline.Settings.BOARD_X_END - GobangOnline.Settings.BOARD_X_START) / (GobangOnline.Settings.BOARD_SIZE - 1) + GobangOnline.Settings.BOARD_X_START,
                y: move.row * (GobangOnline.Settings.BOARD_Y_END - GobangOnline.Settings.BOARD_Y_START) / (GobangOnline.Settings.BOARD_SIZE - 1) + GobangOnline.Settings.BOARD_Y_START
            };
        };
        MultiPlayer.prototype.position2move = function (position) {
            return {
                row: Math.round((position.y - GobangOnline.Settings.BOARD_Y_START) / ((GobangOnline.Settings.BOARD_Y_END - GobangOnline.Settings.BOARD_Y_START) / (GobangOnline.Settings.BOARD_SIZE - 1))),
                column: Math.round((position.x - GobangOnline.Settings.BOARD_X_START) / ((GobangOnline.Settings.BOARD_X_END - GobangOnline.Settings.BOARD_X_START) / (GobangOnline.Settings.BOARD_SIZE - 1)))
            };
        };
        return MultiPlayer;
    })(Phaser.State);
    GobangOnline.MultiPlayer = MultiPlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', GobangOnline.Boot, false);
            this.state.add('Preloader', GobangOnline.Preloader, false);
            this.state.add('MainMenu', GobangOnline.MainMenu, false);
            this.state.add('DifficultyMenu', GobangOnline.DifficultyMenu, false);
            this.state.add('MultiPlayer', GobangOnline.MultiPlayer, false);
            this.state.add('SinglePlayer', GobangOnline.SinglePlayer, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    GobangOnline.Game = Game;
})(GobangOnline || (GobangOnline = {}));
window.onload = function () {
    var game = new GobangOnline.Game();
};
