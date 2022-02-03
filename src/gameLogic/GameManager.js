"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var board_1 = require("../constants/board");
var Side;
(function (Side) {
    Side["WHITE"] = "white";
    Side["BLACK"] = "black";
})(Side || (Side = {}));
var GameOutcome;
(function (GameOutcome) {
    GameOutcome[GameOutcome["PENDING"] = 0] = "PENDING";
    GameOutcome[GameOutcome["WHITE_VICTORY"] = 1] = "WHITE_VICTORY";
    GameOutcome[GameOutcome["BLACK_VICTORY"] = 2] = "BLACK_VICTORY";
    GameOutcome[GameOutcome["DRAW"] = 3] = "DRAW";
})(GameOutcome || (GameOutcome = {}));
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    Position.isValid = function (x, y) {
        return (x >= 0 && x <= 7) && (y >= 0 && y <= 7);
    };
    return Position;
}());
var GameManager = /** @class */ (function () {
    function GameManager() {
        this.moves = [];
        this.movingSide = Side.WHITE;
        this.board = new Board(this);
    }
    GameManager.prototype.finishMove = function () {
        this.movingSide = this.movingSide === Side.WHITE ? Side.BLACK : Side.WHITE;
    };
    GameManager.prototype.move = function (move) {
        var movingPiece = this.board.getPieceAtPosition(move.from);
        if ((movingPiece === null || movingPiece === void 0 ? void 0 : movingPiece.side) !== this.movingSide)
            return;
        var result = this.board.move(move);
        if (!(result === null || result === void 0 ? void 0 : result.hasChainCaptures)) {
            this.finishMove();
        }
        return result;
    };
    GameManager.prototype.isGameOver = function () {
        var remainingWhitePieces = this.board.piecesForSide(Side.WHITE);
        var remainingBlackPieces = this.board.piecesForSide(Side.BLACK);
        if (remainingWhitePieces.length <= 0 && remainingBlackPieces.length)
            return GameOutcome.BLACK_VICTORY;
        if (remainingBlackPieces.length <= 0 && remainingWhitePieces.length)
            return GameOutcome.WHITE_VICTORY;
        if (remainingWhitePieces.length <= 0 && remainingBlackPieces.length <= 0)
            return GameOutcome.DRAW;
        var remainingWhiteMoves = __spreadArray(__spreadArray([], this.board.pendingCapturesForSide(Side.WHITE), true), this.board.possibleMovesForSide(Side.WHITE), true);
        var remainingBlackMoves = __spreadArray(__spreadArray([], this.board.pendingCapturesForSide(Side.BLACK), true), this.board.possibleMovesForSide(Side.BLACK), true);
        if (this.movingSide === Side.WHITE && !remainingWhiteMoves.length)
            return GameOutcome.BLACK_VICTORY;
        if (this.movingSide === Side.BLACK && !remainingBlackMoves.length)
            return GameOutcome.WHITE_VICTORY;
        return GameOutcome.PENDING;
    };
    return GameManager;
}());
var Board = /** @class */ (function () {
    function Board(gameManager) {
        var _this = this;
        this.pieces = [];
        this.setup = function () {
            function isBlackCell(x, y) {
                return (y % 2 === 0 && x % 2 === 1) || (y % 2 === 1 && x % 2 === 0);
            }
            var placeRow = function (y, side) {
                for (var x = 0; x < 8; x += 1) {
                    if (isBlackCell(x, y)) {
                        var position = new Position(x, y);
                        _this.pieces.push(new Piece(side, _this, position));
                    }
                }
            };
            for (var y = 0; y < 3; y += 1) {
                placeRow(y, Side.WHITE);
            }
            for (var y = 5; y < 8; y += 1) {
                placeRow(y, Side.BLACK);
            }
        };
        this.getDiagonal = function (startPosition, diagonal, maxSteps) {
            if (maxSteps === void 0) { maxSteps = Infinity; }
            var result = [];
            var currentStep = 0;
            var currentX = startPosition.x + diagonal.x;
            var currentY = startPosition.y + diagonal.y;
            while (Position.isValid(currentX, currentY)) {
                if (maxSteps !== Infinity && currentStep >= maxSteps)
                    return result;
                result.push(new Position(currentX, currentY));
                currentStep += 1;
                currentX += diagonal.x;
                currentY += diagonal.y;
            }
            return result;
        };
        this.gameManager = gameManager;
        this.setup();
    }
    Board.prototype.piecesForSide = function (side) {
        return this.pieces.filter(function (piece) { return piece.side === side; });
    };
    Board.prototype.possibleMovesForSide = function (side) {
        var result = [];
        var pieces = this.piecesForSide(side);
        pieces.forEach(function (piece) {
            result = __spreadArray(__spreadArray([], result, true), piece.getAvailableMoves(), true);
        });
        return result;
    };
    ;
    Board.prototype.pendingCapturesForSide = function (side) {
        if (side === void 0) { side = this.gameManager.movingSide; }
        var result = [];
        var pieces = this.piecesForSide(side);
        pieces.forEach(function (piece) {
            result = __spreadArray(__spreadArray([], result, true), piece.getAvailableCaptures(), true);
        });
        return result;
    };
    Board.prototype.selectPiece = function (piece) {
        if (piece.side !== this.gameManager.movingSide)
            return [];
        var captures = this.pendingCapturesForSide();
        if (captures.length)
            return captures;
        return piece.getAvailableMoves();
    };
    ;
    Board.prototype.getPieceAtPosition = function (position) {
        return this.pieces.find(function (piece) { return piece.position.x === position.x && piece.position.y === position.y; });
    };
    Board.prototype.hasPiecePromoted = function (piece) {
        if (!piece)
            return false;
        var position = piece.position;
        return piece.isWhite() && position.y === 7 || piece.isBlack() && position.y === 0;
    };
    Board.prototype.movePiece = function (move) {
        var piece = this.getPieceAtPosition(move.from);
        if (!piece)
            return;
        piece.position = move.to;
    };
    Board.prototype.removePiece = function (target) {
        this.pieces = this.pieces.filter(function (piece) { return piece !== target; });
    };
    Board.prototype.promotePiece = function (target) {
        this.removePiece(target);
        this.pieces.push(new King(target.side, this, target.position));
    };
    Board.prototype.move = function (move) {
        var chainCaptures = [];
        var movingPiece = this.getPieceAtPosition(move.from);
        if (!movingPiece)
            return;
        this.movePiece(move);
        if (this.hasPiecePromoted(movingPiece))
            this.promotePiece(movingPiece);
        if (move.capturedPiecePosition) {
            var capturedPiece = this.getPieceAtPosition(move.capturedPiecePosition);
            if (capturedPiece) {
                this.removePiece(capturedPiece);
                chainCaptures = movingPiece.getAvailableCaptures();
            }
        }
        return { movedPiece: movingPiece, hasChainCaptures: chainCaptures.length };
    };
    return Board;
}());
var Piece = /** @class */ (function () {
    function Piece(side, board, position) {
        var _this = this;
        this.isWhite = function () {
            return _this.side === Side.WHITE;
        };
        this.isBlack = function () {
            return _this.side === Side.BLACK;
        };
        this.getAvailableMoves = function () {
            var result = [];
            var moveDiagonals = [
                { x: 1, y: _this.isWhite() ? 1 : -1 },
                { x: -1, y: _this.isWhite() ? 1 : -1 }
            ];
            moveDiagonals.forEach(function (diagonal) {
                var diagonalCells = _this.board.getDiagonal(_this.position, diagonal, 1);
                var validMoves = diagonalCells.filter(function (position) { return !_this.board.getPieceAtPosition(position); });
                result = __spreadArray(__spreadArray([], result, true), validMoves.map(function (position) { return ({ from: _this.position, to: position }); }), true);
            });
            return result;
        };
        this.side = side;
        this.board = board;
        this.position = position;
    }
    Piece.prototype.isKing = function () {
        return this instanceof King;
    };
    Piece.prototype.getAvailableCaptures = function () {
        var _a;
        var result = [];
        for (var i = 0; i < board_1.diagonals.length; i += 1) {
            var diagonal = board_1.diagonals[i];
            var cells = this.board.getDiagonal(this.position, diagonal);
            if (!cells.length)
                continue;
            var nextCell = cells[0], firstCellAfterPiece = cells[1];
            if (!this.board.getPieceAtPosition(nextCell) || ((_a = this.board.getPieceAtPosition(nextCell)) === null || _a === void 0 ? void 0 : _a.side) === this.side)
                continue;
            if (!firstCellAfterPiece || this.board.getPieceAtPosition(firstCellAfterPiece))
                continue;
            result.push({
                from: this.position,
                to: firstCellAfterPiece,
                capturedPiecePosition: nextCell
            });
        }
        return result;
    };
    return Piece;
}());
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getAvailableMoves = function () {
            var result = [];
            board_1.diagonals.forEach(function (diagonal) {
                var cells = _this.board.getDiagonal(_this.position, diagonal);
                var movesOnDiagonal = cells;
                var firstPieceIndex = cells.findIndex(function (cell) { return _this.board.getPieceAtPosition(cell); });
                if (firstPieceIndex !== -1) {
                    movesOnDiagonal = cells.slice(0, firstPieceIndex);
                }
                result = __spreadArray(__spreadArray([], result, true), movesOnDiagonal.map(function (move) { return ({ from: _this.position, to: move }); }), true);
            });
            return result;
        };
        _this.getAvailableCaptures = function () {
            var result = [];
            board_1.diagonals.forEach(function (diagonal) {
                var cells = _this.board.getDiagonal(_this.position, diagonal);
                if (!cells.length)
                    return;
                var currentEnemyPiece;
                for (var i = 0; i < cells.length; i += 1) {
                    var cell = cells[i];
                    var pieceOnCell = _this.board.getPieceAtPosition(cell);
                    if (pieceOnCell && pieceOnCell.side === _this.side)
                        return;
                    if (currentEnemyPiece && pieceOnCell)
                        return;
                    if (pieceOnCell) {
                        currentEnemyPiece = pieceOnCell;
                        continue;
                    }
                    if (currentEnemyPiece) {
                        result.push({
                            capturedPiecePosition: currentEnemyPiece.position,
                            from: _this.position,
                            to: cell
                        });
                    }
                }
            });
            return result;
        };
        return _this;
    }
    return King;
}(Piece));
exports["default"] = GameManager;
