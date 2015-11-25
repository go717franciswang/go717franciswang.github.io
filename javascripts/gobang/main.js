var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GobangOnline;
(function (GobangOnline) {
    GobangOnline.patternScore = [
        {
            name: "连五",
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
            rivalScore: 2100
        },
        {
            name: "冲四",
            patterns: [
                "011112",
                "10111",
                "101110",
                "11011"
            ],
            score: 2101,
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
                "0100110",
                "0101010",
                "2011102"
            ],
            score: 600,
            rivalScore: 480
        },
        {
            name: "活二",
            patterns: [
                "001100",
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
                "0100010",
                "2010102",
                "2011002"
            ],
            score: 100,
            rivalScore: 80
        },
    ];
    var alternativeScore = [
        {
            "patternNames": { "连五": 1 },
            "score": 100000
        },
        {
            "patternNames": { "活四": 1 },
            "score": 10000
        },
        {
            "patternNames": { "冲四": 2 },
            "score": 10000
        },
        {
            "patternNames": { "冲四": 1, "活三": 1 },
            "score": 10000
        },
        {
            "patternNames": { "冲四": 1 },
            "score": 8000
        },
        {
            "patternNames": { "活三": 2 },
            "score": 5000
        },
        {
            "patternNames": { "活三": 1, "眠三": 1 },
            "score": 1000
        },
        {
            "patternNames": { "活三": 1 },
            "score": 800
        },
        {
            "patternNames": { "活二": 2 },
            "score": 100
        },
        {
            "patternNames": { "眠三": 1 },
            "score": 50
        },
        {
            "patternNames": { "活二": 1, "眠二": 1 },
            "score": 10
        },
        {
            "patternNames": { "活二": 1 },
            "score": 5
        },
        {
            "patternNames": { "眠二": 1 },
            "score": 3
        },
    ];
    console.log(alternativeScore);
    function countPatternNames(patterNames) {
        var count = {};
        for (var i = 0; i < patterNames.length; i++) {
            var name = patterNames[i];
            if (count[name] == undefined) {
                count[name] = 0;
            }
            count[name] += 1;
        }
        return count;
    }
    function isPatternSubset(subsetPatterns, parentPatterns) {
        for (var name in subsetPatterns) {
            if (parentPatterns[name] == undefined || parentPatterns[name] < subsetPatterns[name]) {
                return false;
            }
        }
        return true;
    }
    function alternativePatternsToScore(patternNames) {
        var count = countPatternNames(patternNames);
        for (var i = 0; i < alternativeScore.length; i++) {
            if (isPatternSubset(alternativeScore[i].patternNames, count)) {
                return alternativeScore[i].score;
            }
        }
        return 0;
    }
    GobangOnline.alternativePatternsToScore = alternativePatternsToScore;
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
            this.name = null;
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
                    node.name = patternData.name;
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
                    node.name = patternData.name;
                }
            }
        }
    }
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
    function buildSquareMatrix(size, defaultValue) {
        var matrix = [];
        for (var i = 0; i < size; i++) {
            matrix[i] = [];
            for (var j = 0; j < size; j++) {
                matrix[i][j] = defaultValue;
            }
        }
        return matrix;
    }
    GobangOnline.buildSquareMatrix = buildSquareMatrix;
    function move2position(move) {
        return {
            x: move.column * (GobangOnline.Settings.BOARD_X_END - GobangOnline.Settings.BOARD_X_START) / (GobangOnline.Settings.BOARD_SIZE - 1) + GobangOnline.Settings.BOARD_X_START,
            y: move.row * (GobangOnline.Settings.BOARD_Y_END - GobangOnline.Settings.BOARD_Y_START) / (GobangOnline.Settings.BOARD_SIZE - 1) + GobangOnline.Settings.BOARD_Y_START
        };
    }
    GobangOnline.move2position = move2position;
    function position2move(position) {
        return {
            row: Math.round((position.y - GobangOnline.Settings.BOARD_Y_START) / ((GobangOnline.Settings.BOARD_Y_END - GobangOnline.Settings.BOARD_Y_START) / (GobangOnline.Settings.BOARD_SIZE - 1))),
            column: Math.round((position.x - GobangOnline.Settings.BOARD_X_START) / ((GobangOnline.Settings.BOARD_X_END - GobangOnline.Settings.BOARD_X_START) / (GobangOnline.Settings.BOARD_SIZE - 1)))
        };
    }
    GobangOnline.position2move = position2move;
    var Board = (function () {
        function Board(size) {
            this.size = size;
            this.table = buildSquareMatrix(size, Color.Empty);
            this.moveLog = [];
        }
        Board.prototype.getMoveAt = function (id) {
            return this.moveLog[id];
        };
        Board.prototype.getMoveCount = function () {
            return this.moveLog.length;
        };
        Board.prototype.getLastMove = function () {
            return this.moveLog[this.getMoveCount() - 1];
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
        Board.prototype.isGameOver = function (playerColor) {
            var run;
            for (var i = 0; i < this.size; i++) {
                run = 0;
                for (var j = 0; j < this.size; j++) {
                    if (this.colorAt({ row: i, column: j }) == playerColor) {
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
                    if (this.colorAt({ row: j, column: i }) == playerColor) {
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
                    if (this.colorAt({ row: r, column: c }) == playerColor) {
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
                    if (this.colorAt({ row: r, column: c }) == playerColor) {
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
        return Board;
    })();
    GobangOnline.Board = Board;
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
    function computeHeuristicOfBoardOld(playerColor, board) {
        var heuristics = 0;
        var heuristicsRival = 0;
        var h = [];
        var hr = [];
        for (var i = 0; i < board.size; i++) {
            for (var j = 0; j < board.size; j++) {
                var m = { row: i, column: j };
                heuristics += computeHeuristicAt(playerColor, m, board, false);
                heuristicsRival += computeHeuristicAt(playerColor, m, board, true);
            }
        }
        return heuristics - heuristicsRival;
    }
    GobangOnline.computeHeuristicOfBoardOld = computeHeuristicOfBoardOld;
    function matchPatternsAt(playerColor, move, board, searched) {
        var patternNames = [];
        var directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (var i = 0; i < directions.length; i++) {
            var node = GobangOnline.root;
            var dx = directions[i][0];
            var dy = directions[i][1];
            var edgePatternName = null;
            var j = 0;
            while (true) {
                var m = { row: move.row + dy * j, column: move.column + dx * j };
                if (board.isOutOfBound(m)) {
                    break;
                }
                var ownership = color2ownership(board.colorAt(m), playerColor);
                if (node.children[ownership]) {
                    node = node.children[ownership];
                    if (node.name) {
                        edgePatternName = node.name;
                        for (var k = 0; k <= j; k++) {
                            searched[move.row + dy * k][move.column + dx * k] = true;
                        }
                    }
                }
                else {
                    break;
                }
                j++;
            }
            if (edgePatternName) {
                patternNames.push(node.name);
            }
        }
        return patternNames;
    }
    GobangOnline.matchPatternsAt = matchPatternsAt;
    function computeHeuristicOfBoard(playerColor, board) {
        var playerPatterns = [];
        var opponentPatterns = [];
        var searched = GobangOnline.buildSquareMatrix(board.size, false);
        var searchedOpponent = GobangOnline.buildSquareMatrix(board.size, false);
        for (var i = 0; i < board.size; i++) {
            for (var j = 0; j < board.size; j++) {
                var m = { row: i, column: j };
                if (!searched[i][j]) {
                    playerPatterns = playerPatterns.concat(this.matchPatternsAt(playerColor, m, board, searched));
                }
                if (!searchedOpponent[i][j]) {
                    opponentPatterns = opponentPatterns.concat(this.matchPatternsAt(GobangOnline.getOpponentColor(playerColor), m, board, searchedOpponent));
                }
            }
        }
        return GobangOnline.alternativePatternsToScore(playerPatterns) - GobangOnline.alternativePatternsToScore(opponentPatterns) * 1.251;
    }
    GobangOnline.computeHeuristicOfBoard = computeHeuristicOfBoard;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    (function (Algo) {
        Algo[Algo["Minimax"] = 0] = "Minimax";
        Algo[Algo["Alphabeta"] = 1] = "Alphabeta";
    })(GobangOnline.Algo || (GobangOnline.Algo = {}));
    var Algo = GobangOnline.Algo;
    ;
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
            var solver = new Solver(this.color, this.depth, this.maxCandidates, Algo.Alphabeta);
            var maximizingMove = solver.solve(context.board);
            console.log(maximizingMove);
            console.log('end turn');
            if (maximizingMove == null)
                context.forfeit(this);
            else
                context.registerMove(this, maximizingMove);
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
    var Solver = (function () {
        function Solver(color, depth, maxCandidates, algo) {
            this.color = color;
            this.depth = depth;
            this.maxCandidates = maxCandidates;
            this.algo = algo;
        }
        Solver.prototype.solve = function (node) {
            this.maximizingMove = null;
            if (this.algo == Algo.Minimax)
                this.minimax(node, this.depth, true);
            else if (this.algo == Algo.Alphabeta)
                this.alphabeta(node, this.depth, -Infinity, Infinity, true);
            return this.maximizingMove;
        };
        Solver.prototype.minimax = function (node, depth, maximizingPlayer) {
            if (node.isGameOver(GobangOnline.getOpponentColor(this.color)))
                return -Infinity;
            if (node.isGameOver(this.color))
                return Infinity;
            if (depth == 0)
                return GobangOnline.computeHeuristicOfBoard(this.color, node);
            if (maximizingPlayer) {
                var moves = this.getTopCandidates(node, this.maxCandidates, true);
                var v = -Infinity;
                for (var i = 0; i < moves.length; i++) {
                    var m = moves[i];
                    node.setColorAt(m, this.color);
                    var v1 = this.minimax(node, depth - 1, !maximizingPlayer);
                    if (depth == this.depth && v1 > v) {
                        this.maximizingMove = m;
                    }
                    v = Math.max(v, v1);
                    node.revertLastMove();
                }
                return v;
            }
            else {
                var moves = this.getTopCandidates(node, this.maxCandidates, false);
                var v = Infinity;
                for (var i = 0; i < moves.length; i++) {
                    var m = moves[i];
                    node.setColorAt(m, GobangOnline.getOpponentColor(this.color));
                    v = Math.min(v, this.minimax(node, depth - 1, !maximizingPlayer));
                    node.revertLastMove();
                }
                return v;
            }
        };
        Solver.prototype.alphabeta = function (node, depth, alpha, beta, maximizingPlayer) {
            if (node.isGameOver(GobangOnline.getOpponentColor(this.color)))
                return -Infinity;
            if (node.isGameOver(this.color))
                return Infinity;
            if (depth == 0)
                return GobangOnline.computeHeuristicOfBoard(this.color, node);
            if (maximizingPlayer) {
                var v = alpha;
                var maximizingMove;
                var moves = this.getTopCandidates(node, this.maxCandidates, true);
                for (var i = 0; i < moves.length; i++) {
                    var m = moves[i];
                    node.setColorAt(m, this.color);
                    var tmp = this.alphabeta(node, depth - 1, v, beta, !maximizingPlayer);
                    if (depth == this.depth && tmp > v) {
                        this.maximizingMove = m;
                    }
                    v = Math.max(v, tmp);
                    node.revertLastMove();
                    if (beta <= v) {
                        return v;
                    }
                }
                return v;
            }
            else {
                var v = beta;
                var moves = this.getTopCandidates(node, this.maxCandidates, false);
                for (var i = 0; i < moves.length; i++) {
                    var m = moves[i];
                    node.setColorAt(m, GobangOnline.getOpponentColor(this.color));
                    var tmp = this.alphabeta(node, depth - 1, alpha, v, !maximizingPlayer);
                    v = Math.min(v, tmp);
                    node.revertLastMove();
                    if (v <= alpha) {
                        return v;
                    }
                }
                return v;
            }
        };
        Solver.prototype.getTopCandidates = function (board, maxCandidates, maximizingPlayer) {
            var candidates = this.getCandidates(board);
            if (candidates.length <= maxCandidates)
                return candidates;
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
        Solver.prototype.getCandidates = function (board) {
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
        return Solver;
    })();
    GobangOnline.Solver = Solver;
})(GobangOnline || (GobangOnline = {}));
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
            this.load.audio('click', '/resources/gobang/click.mp3');
            this.load.audio('beep', '/resources/gobang/beep.mp3');
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
    function addMenuButton(game) {
        addButton(game, game.width / 2, game.height / 2 + 150, 'MENU', function () {
            game.state.start('MainMenu', true, false, 3, 50);
        });
    }
    GobangOnline.addMenuButton = addMenuButton;
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
                _this.game.state.start('SinglePlayer', true, false, 1, 100);
            });
            GobangOnline.addButton(this.game, this.game.width / 2, this.game.height / 2, 'MEDIUM', function () {
                _this.game.state.start('SinglePlayer', true, false, 2, 100);
            });
            GobangOnline.addButton(this.game, this.game.width / 2, this.game.height / 2 + 150, 'HARD', function () {
                _this.game.state.start('SinglePlayer', true, false, 3, 100);
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
        Gobang.prototype.forfeit = function (player) {
            this.gameOver = true;
            player.lose();
            this.nonPendingPlayer.win();
            if (this.onGameOver) {
                this.onGameOver();
            }
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
            if (this.onRegisterMove) {
                this.onRegisterMove(player, move);
            }
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
        };
        Gobang.prototype.swapPlayingPendingState = function () {
            var tmp = this.pendingPlayer;
            this.pendingPlayer = this.nonPendingPlayer;
            this.nonPendingPlayer = tmp;
        };
        Gobang.prototype.isGameOver = function (checkPlayer) {
            return this.board.isGameOver(checkPlayer.color);
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
    GobangOnline.Settings = {
        API_KEY: 'swe48rh5c9l1h5mi',
        ROOMID: 'server',
        BOARD_SIZE: 19,
        BOARD_X_START: 128 - 9,
        BOARD_Y_START: 26 - 9,
        BOARD_X_END: 689 - 9,
        BOARD_Y_END: 590 - 9,
        MAX_SECONDS_PER_GAME: 300,
    };
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var SinglePlayer = (function (_super) {
        __extends(SinglePlayer, _super);
        function SinglePlayer() {
            _super.apply(this, arguments);
        }
        SinglePlayer.prototype.init = function (aiDepth, maxCandidates) {
            this.aiDepth = aiDepth;
            this.maxCandidates = maxCandidates;
        };
        SinglePlayer.prototype.create = function () {
            var _this = this;
            this.click = this.add.audio('click');
            this.board = this.add.sprite(this.game.width / 2, this.game.height / 2, 'board');
            this.board.anchor.setTo(0.5, 0.5);
            var scale = this.game.height / this.board.height;
            this.board.scale.setTo(scale, scale);
            this.humanPlayer = new GobangOnline.HumanPlayer();
            this.humanPlayer.onWinCallback = function () {
                var msg = _this.game.add.bitmapText(_this.game.width / 2, _this.game.height / 2, 'Castaway', 'YOU WON!');
                msg.anchor.setTo(0.5, 0.5);
                GobangOnline.addMenuButton(_this.game);
            };
            this.humanPlayer.onLossCallback = function () {
                var msg = _this.game.add.bitmapText(_this.game.width / 2, _this.game.height / 2, 'Castaway', 'YOU LOST!');
                msg.anchor.setTo(0.5, 0.5);
                GobangOnline.addMenuButton(_this.game);
            };
            this.aiPlayer = new GobangOnline.AiPlayer(this.aiDepth, this.maxCandidates);
            this.engine = new GobangOnline.Gobang(GobangOnline.Settings.BOARD_SIZE, this.humanPlayer, this.aiPlayer);
            this.engine.setOnRegisterMove(function (player, move) {
                var pos = GobangOnline.move2position(move);
                var piece = _this.add.sprite(pos.x, pos.y, 'piece');
                if (player.color == GobangOnline.Color.White) {
                    piece.frame = 1;
                }
                piece.anchor.setTo(0.5, 0.5);
                piece.scale.setTo(30 / piece.width);
                _this.click.play();
            });
            this.engine.startGame();
        };
        SinglePlayer.prototype.update = function () {
            if (this.humanPlayer.takingTurn) {
                var move = GobangOnline.position2move(this.game.input.activePointer);
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
        MsgType[MsgType["Timer"] = 5] = "Timer";
    })(GobangOnline.MsgType || (GobangOnline.MsgType = {}));
    var MsgType = GobangOnline.MsgType;
    ;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var RemotePlayer = (function () {
        function RemotePlayer(conn) {
            this.conn = conn;
            this.milliSecLeft = GobangOnline.Settings.MAX_SECONDS_PER_GAME * 1000;
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
            this.onTakeTurnCallback(this.context.board.getMoveCount(), this.milliSecLeft);
            this.turnBeganAt = new Date().getTime();
        };
        RemotePlayer.prototype.makeMove = function (move) {
            this.context.registerMove(this, move);
            this.milliSecLeft -= new Date().getTime() - this.turnBeganAt;
        };
        RemotePlayer.prototype.getSecondsLeft = function () {
            return Math.ceil(this.milliSecLeft / 1000);
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
            this.click = this.add.audio('click');
            this.beep = this.add.audio('beep');
            this.board = this.add.sprite(this.game.width / 2, this.game.height / 2, 'board');
            this.board.anchor.setTo(0.5, 0.5);
            var scale = this.game.height / this.board.height;
            this.board.scale.setTo(scale, scale);
            this.createServerIfNotExist();
            this.localBoard = new GobangOnline.Board(GobangOnline.Settings.BOARD_SIZE);
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.timer1 = this.add.text(this.game.width - 25, 0, GobangOnline.Settings.MAX_SECONDS_PER_GAME.toString(), style);
            this.timer1.anchor.setTo(1, 0);
            this.timer2 = this.add.text(this.game.width - 25, 30, GobangOnline.Settings.MAX_SECONDS_PER_GAME.toString(), style);
            this.timer2.anchor.setTo(1, 0);
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
                            _this.engine.blackPlayer.onTakeTurnCallback = function (moveCountBeforeTurn, milliSecLeft) {
                                _this.broadCast({ type: GobangOnline.MsgType.Timer, milliSecLeft: milliSecLeft, color: GobangOnline.Color.Black });
                                setTimeout(function () {
                                    if (moveCountBeforeTurn == _this.engine.board.getMoveCount()) {
                                        _this.declareWinner(GobangOnline.Color.White);
                                    }
                                }, milliSecLeft + 1000);
                            };
                            _this.engine.whitePlayer.onTakeTurnCallback = function (moveCountBeforeTurn, milliSecLeft) {
                                _this.broadCast({ type: GobangOnline.MsgType.Timer, milliSecLeft: milliSecLeft, color: GobangOnline.Color.White });
                                setTimeout(function () {
                                    if (moveCountBeforeTurn == _this.engine.board.getMoveCount()) {
                                        _this.declareWinner(GobangOnline.Color.Black);
                                    }
                                }, milliSecLeft + 1000);
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
                    case GobangOnline.MsgType.Timer:
                        _this.turnBeganAt = (new Date()).getTime();
                        if (data.color == GobangOnline.Color.Black) {
                            _this.milliSecLeft1 = data.milliSecLeft;
                            _this.milliSecLeft2 = null;
                        }
                        else {
                            _this.milliSecLeft2 = data.milliSecLeft;
                            _this.milliSecLeft1 = null;
                        }
                        break;
                    case GobangOnline.MsgType.TakeTurn:
                        _this.takingTurn = true;
                        break;
                    case GobangOnline.MsgType.Move:
                        var move = data.move;
                        var pos = GobangOnline.move2position(move);
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
                        _this.click.play();
                        break;
                    case GobangOnline.MsgType.GameOver:
                        var txt = data.winnerColor == GobangOnline.Color.Black ? 'BLACK WINS' : 'WHITE WINS';
                        var msg = _this.game.add.bitmapText(_this.game.width / 2, _this.game.height / 2, 'Castaway', txt);
                        msg.anchor.setTo(0.5, 0.5);
                        GobangOnline.addMenuButton(_this.game);
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
            if (this.milliSecLeft1) {
                var secondsLeft = Math.max(0, Math.ceil((this.milliSecLeft1 - (new Date().getTime() - this.turnBeganAt)) / 1000));
                if (secondsLeft != parseInt(this.timer1.text) && secondsLeft < 30) {
                    this.beep.play();
                }
                this.timer1.setText(secondsLeft.toString());
            }
            if (this.milliSecLeft2) {
                var secondsLeft = Math.max(0, Math.ceil((this.milliSecLeft2 - (new Date().getTime() - this.turnBeganAt)) / 1000));
                if (secondsLeft != parseInt(this.timer2.text) && secondsLeft < 30) {
                    this.beep.play();
                }
                this.timer2.setText(secondsLeft.toString());
            }
            if (this.takingTurn) {
                var move = GobangOnline.position2move(this.game.input.activePointer);
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
var GobangOnline;
(function (GobangOnline) {
    function loadBoard(data) {
        var size = data.length;
        var board = new GobangOnline.Board(size);
        var acceptableAnwsers = [];
        for (var i = 0; i < size; i++) {
            var row = data[i].trim();
            for (var j = 0; j < size; j++) {
                var m = { row: i, column: j };
                if (row[j] == "x") {
                    board.setColorAt(m, GobangOnline.Color.Black);
                }
                else if (row[j] == "o") {
                    board.setColorAt(m, GobangOnline.Color.White);
                }
                else if (row[j] == "?") {
                    acceptableAnwsers.push(m);
                }
            }
        }
        return { board: board, acceptableAnwsers: acceptableAnwsers };
    }
    function assertAcceptableAnser(answer, acceptableAnwsers, data, testTitle) {
        for (var i = 0; i < acceptableAnwsers.length; i++) {
            var validAnswer = acceptableAnwsers[i];
            if (answer.row == validAnswer.row && answer.column == validAnswer.column) {
                printBoard(answer, data);
                console.log(testTitle + " passed");
                return;
            }
        }
        printBoard(answer, data);
        throw "Assertion failed for " + testTitle + ": expected " + JSON.stringify(acceptableAnwsers) + ", got " + JSON.stringify(answer);
    }
    function printBoard(answer, data) {
        for (var i = 0; i < data.length; i++) {
            var id = "" + i + "|";
            if (answer.row == i) {
                var row = data[i].substr(0, answer.column) + "A" + data[i].substr(answer.column + 1, data[i].length - answer.column - 1);
                console.log(id + row);
            }
            else {
                console.log(id + data[i]);
            }
        }
    }
    function test1() {
        var data = [".......",
            ".......",
            ".o.o.?.",
            "..oxx..",
            ".xox...",
            "..x....",
            ".?....."];
        var info = loadBoard(data);
        var m1 = new GobangOnline.Solver(GobangOnline.Color.White, 1, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m1, info.acceptableAnwsers, data, "T1, Easy AI");
        var m2 = new GobangOnline.Solver(GobangOnline.Color.White, 2, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T1, Intermediate AI");
        var m3 = new GobangOnline.Solver(GobangOnline.Color.White, 3, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T1, Advanced AI");
    }
    GobangOnline.test1 = test1;
    function test2() {
        var data = [".......",
            "..o?o.o",
            "..oxxx.",
            "..oox..",
            "..?xx..",
            "..xx?..",
            ".o..?.."];
        var info = loadBoard(data);
        var m1 = new GobangOnline.Solver(GobangOnline.Color.White, 1, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m1, info.acceptableAnwsers, data, "T2, Easy AI");
        var m2 = new GobangOnline.Solver(GobangOnline.Color.White, 2, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T2, Intermediate AI");
        var m3 = new GobangOnline.Solver(GobangOnline.Color.White, 3, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T2, Advanced AI");
    }
    GobangOnline.test2 = test2;
    function test3() {
        var data = ["........",
            "........",
            "........",
            "...x....",
            "....x...",
            "...?ooo?",
            "......x.",
            "........"];
        var info = loadBoard(data);
        var m1 = new GobangOnline.Solver(GobangOnline.Color.Black, 1, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m1, info.acceptableAnwsers, data, "T3, Easy AI");
        var m2 = new GobangOnline.Solver(GobangOnline.Color.Black, 2, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T3, Intermediate AI");
        var m3 = new GobangOnline.Solver(GobangOnline.Color.Black, 3, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T3, Advanced AI");
    }
    GobangOnline.test3 = test3;
    function test4() {
        var data = ["..xxx...",
            ".....o..",
            ".....o..",
            ".....o..",
            ".....?..",
            ".....o..",
            "........",
            "........"];
        var info = loadBoard(data);
        var m1 = new GobangOnline.Solver(GobangOnline.Color.Black, 1, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m1, info.acceptableAnwsers, data, "T4, Easy AI");
        var m2 = new GobangOnline.Solver(GobangOnline.Color.Black, 2, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T4, Intermediate AI");
        var m3 = new GobangOnline.Solver(GobangOnline.Color.Black, 3, 100, GobangOnline.Algo.Alphabeta).solve(info.board);
        assertAcceptableAnser(m2, info.acceptableAnwsers, data, "T4, Advanced AI");
    }
    GobangOnline.test4 = test4;
    function testAll() {
        test1();
        test2();
        test3();
        test4();
    }
    GobangOnline.testAll = testAll;
})(GobangOnline || (GobangOnline = {}));
