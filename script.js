const board = document.getElementById("board");

let pWhiteName = sessionStorage.getItem('chess_whitePlayer') || "Player 1";
let pBlackName = sessionStorage.getItem('chess_blackPlayer') || "Player 2";

const whiteDisplay = document.getElementById('whitePlayerDisplay');
const blackDisplay = document.getElementById('blackPlayerDisplay');
if (whiteDisplay) whiteDisplay.textContent = "White: " + pWhiteName;
if (blackDisplay) blackDisplay.textContent = "Black: " + pBlackName;

let currentPlayer = "white";
let selectedSquare = null;
let draggedPieceSquare = null;

let whiteCaptured = [];
let blackCaptured = [];
let moveHistory = [];

let chessBoard = [
["br","bn","bb","bq","bk","bb","bn","br"],
["bp","bp","bp","bp","bp","bp","bp","bp"],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["wp","wp","wp","wp","wp","wp","wp","wp"],
["wr","wn","wb","wq","wk","wb","wn","wr"]
];

function createBoard() {
    board.innerHTML = "";
    let validMoves = [];

if(selectedSquare){
    const piece = chessBoard[selectedSquare.row][selectedSquare.col];
    validMoves = getValidMoves(piece, selectedSquare.row, selectedSquare.col);
}

    const isCurrentPlayerInCheck = isInCheck(currentPlayer, chessBoard);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");
            square.classList.add("square");

            if ((row + col) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }

            const piece = chessBoard[row][col];

            if (piece !== "") {
                const img = document.createElement("img");
                img.src = "pieces/" + piece + ".svg";
                img.classList.add("piece");

                if (isWhitePiece(piece)) {
                    img.classList.add("white-piece");
                }

                img.draggable = true;
                img.addEventListener("dragstart", handleDragStart);
                img.addEventListener("dragend", handleDragEnd);

                square.appendChild(img);
            }

            square.dataset.row = row;
            square.dataset.col = col;

            square.addEventListener("click", handleSquareClick);
            square.addEventListener("dragover", handleDragOver);
            square.addEventListener("dragenter", handleDragEnter);
            square.addEventListener("dragleave", handleDragLeave);
            square.addEventListener("drop", handleDrop);

            if (
                selectedSquare &&
                selectedSquare.row == row &&
                selectedSquare.col == col
            ) {
                square.classList.add("selected");
            }

            if (piece === "wk" && currentPlayer === "white" && isCurrentPlayerInCheck) {
                square.classList.add("in-check");
            } else if (piece === "bk" && currentPlayer === "black" && isCurrentPlayerInCheck) {
                square.classList.add("in-check");
            }
            if(validMoves.some(m => m.row === row && m.col === col)){
    const dot = document.createElement("div");
    dot.classList.add("move-dot");
    square.appendChild(dot);
}

            board.appendChild(square);
        }
    }

    updatePanels();
}

function isWhitePiece(piece) {
    return ["wp","wr","wn","wb","wq","wk"].includes(piece);
}

function isBlackPiece(piece) {
    return ["bp","br","bn","bb","bq","bk"].includes(piece);
}

function handleSquareClick(event) {

    const square = event.target.closest(".square");

    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    const piece = chessBoard[row][col];

    if (selectedSquare === null) {

        if (piece === "") return;

        if (currentPlayer === "white" && !isWhitePiece(piece)) return;
        if (currentPlayer === "black" && !isBlackPiece(piece)) return;

        selectedSquare = { row, col };
        createBoard();

    } else {
        const fromRow = selectedSquare.row;
        const fromCol = selectedSquare.col;

        if (!attemptMove(fromRow, fromCol, row, col)) {
            selectedSquare = null;
            createBoard();
        }
    }
}

function attemptMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow === toRow && fromCol === toCol) return false;

    const movingPiece = chessBoard[fromRow][fromCol];

    if (!isValidMove(movingPiece, fromRow, fromCol, toRow, toCol)) {
        return false;
    }

    const targetPiece = chessBoard[toRow][toCol];

    if (targetPiece !== "") {
        if (isWhitePiece(targetPiece)) {
            whiteCaptured.push(targetPiece);
        } else {
            blackCaptured.push(targetPiece);
        }
    }

    chessBoard[toRow][toCol] = movingPiece;
    chessBoard[fromRow][fromCol] = "";

    moveHistory.push(
        getPieceName(movingPiece) +
        ": " +
        getSquareName(fromRow, fromCol) +
        " → " +
        getSquareName(toRow, toCol)
    );

    selectedSquare = null;

    createBoard();
    switchTurn();
    return true;
}

function handleDragStart(event) {
    const square = event.target.closest(".square");
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = chessBoard[row][col];

    if (currentPlayer === "white" && !isWhitePiece(piece)) {
        event.preventDefault();
        return;
    }
    if (currentPlayer === "black" && !isBlackPiece(piece)) {
        event.preventDefault();
        return;
    }

    draggedPieceSquare = { row, col };
    event.target.classList.add("dragging");
}

function handleDragEnd(event) {
    event.target.classList.remove("dragging");
    draggedPieceSquare = null;
    document.querySelectorAll('.square').forEach(s => s.classList.remove('drag-over'));
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDragEnter(event) {
    event.preventDefault();
    const square = event.target.closest(".square");
    if(square) {
        square.classList.add("drag-over");
    }
}

function handleDragLeave(event) {
    const square = event.target.closest(".square");
    if(square && event.relatedTarget && !square.contains(event.relatedTarget)) {
        square.classList.remove("drag-over");
    }
}

function handleDrop(event) {
    event.preventDefault();
    const square = event.target.closest(".square");
    if(square) {
        square.classList.remove("drag-over");
    }

    if (!draggedPieceSquare) return;

    const fromRow = draggedPieceSquare.row;
    const fromCol = draggedPieceSquare.col;
    
    if (!square) return;

    const toRow = parseInt(square.dataset.row);
    const toCol = parseInt(square.dataset.col);

    attemptMove(fromRow, fromCol, toRow, toCol);
}


function switchTurn() {
    currentPlayer = currentPlayer === "white" ? "black" : "white";
    const turnColorName = currentPlayer === "white" ? "White (" + pWhiteName + ")" : "Black (" + pBlackName + ")";
    document.getElementById("turnDisplay").textContent = "Turn: " + turnColorName;
    checkGameOver();
}

function isPathClear(fr, fc, tr, tc, board) {
    const rowStep = tr === fr ? 0 : Math.sign(tr - fr);
    const colStep = tc === fc ? 0 : Math.sign(tc - fc);
    
    let r = fr + rowStep;
    let c = fc + colStep;
    
    while (r !== tr || c !== tc) {
        if (board[r][c] !== "") {
            return false;
        }
        r += rowStep;
        c += colStep;
    }
    return true;
}

function getPiecePatternValid(piece, fr, fc, tr, tc, board) {
    if (fr === tr && fc === tc) return false;

    const target = board[tr][tc];

    if (target !== "") {
        if (isWhitePiece(piece) && isWhitePiece(target)) return false;
        if (isBlackPiece(piece) && isBlackPiece(target)) return false;
    }

    switch (piece) {
        case "wp": return validateWhitePawn(fr, fc, tr, tc, board);
        case "bp": return validateBlackPawn(fr, fc, tr, tc, board);
        case "wr": case "br": return validateRook(fr, fc, tr, tc, board);
        case "wb": case "bb": return validateBishop(fr, fc, tr, tc, board);
        case "wn": case "bn": return validateKnight(fr, fc, tr, tc, board);
        case "wq": case "bq": return validateQueen(fr, fc, tr, tc, board);
        case "wk": case "bk": return validateKing(fr, fc, tr, tc, board);
        default: return false;
    }
}

function isValidMove(piece, fr, fc, tr, tc) {
    if (!getPiecePatternValid(piece, fr, fc, tr, tc, chessBoard)) {
        return false;
    }
    
    const tempBoard = chessBoard.map(row => [...row]);
    tempBoard[tr][tc] = piece;
    tempBoard[fr][fc] = "";
    
    const myColor = isWhitePiece(piece) ? "white" : "black";
    if (isInCheck(myColor, tempBoard)) {
        return false;
    }
    
    return true;
}

function validateWhitePawn(fr, fc, tr, tc, board) {
    if (fc === tc && tr === fr - 1 && board[tr][tc] === "") return true;
    if (fr === 6 && fc === tc && tr === fr - 2 && board[fr - 1][fc] === "" && board[tr][tc] === "") return true;
    if (tr === fr - 1 && Math.abs(tc - fc) === 1 && board[tr][tc] !== "" && isBlackPiece(board[tr][tc])) return true;
    return false;
}

function validateBlackPawn(fr, fc, tr, tc, board) {
    if (fc === tc && tr === fr + 1 && board[tr][tc] === "") return true;
    if (fr === 1 && fc === tc && tr === fr + 2 && board[fr + 1][fc] === "" && board[tr][tc] === "") return true;
    if (tr === fr + 1 && Math.abs(tc - fc) === 1 && board[tr][tc] !== "" && isWhitePiece(board[tr][tc])) return true;
    return false;
}

function validateKnight(fr, fc, tr, tc, board) {
    const rowDiff = Math.abs(fr - tr);
    const colDiff = Math.abs(fc - tc);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function validateRook(fr, fc, tr, tc, board) {
    if (fr !== tr && fc !== tc) return false;
    return isPathClear(fr, fc, tr, tc, board);
}

function validateBishop(fr, fc, tr, tc, board) {
    if (Math.abs(fr - tr) !== Math.abs(fc - tc)) return false;
    return isPathClear(fr, fc, tr, tc, board);
}

function validateQueen(fr, fc, tr, tc, board) {
    if (fr !== tr && fc !== tc && Math.abs(fr - tr) !== Math.abs(fc - tc)) return false;
    return isPathClear(fr, fc, tr, tc, board);
}

function validateKing(fr, fc, tr, tc, board) {
    return Math.abs(fr - tr) <= 1 && Math.abs(fc - tc) <= 1;
}

function findKing(color, board) {
    const kingPiece = color === "white" ? "wk" : "bk";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === kingPiece) return { r, c };
        }
    }
    return null;
}

function isSquareAttacked(row, col, attackerColor, board) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece !== "") {
                const isAttacker = attackerColor === "white" ? isWhitePiece(piece) : isBlackPiece(piece);
                if (isAttacker) {
                    if (getPiecePatternValid(piece, r, c, row, col, board)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function isInCheck(color, board) {
    const kingPos = findKing(color, board);
    if (!kingPos) return false;
    const attackerColor = color === "white" ? "black" : "white";
    return isSquareAttacked(kingPos.r, kingPos.c, attackerColor, board);
}

function getAllValidMoves(color) {
    let moves = [];
    for (let fr = 0; fr < 8; fr++) {
        for (let fc = 0; fc < 8; fc++) {
            const piece = chessBoard[fr][fc];
            if (piece !== "") {
                const isMyPiece = color === "white" ? isWhitePiece(piece) : isBlackPiece(piece);
                if (isMyPiece) {
                    for (let tr = 0; tr < 8; tr++) {
                        for (let tc = 0; tc < 8; tc++) {
                            if (isValidMove(piece, fr, fc, tr, tc)) {
                                moves.push({ fr, fc, tr, tc });
                            }
                        }
                    }
                }
            }
        }
    }
    return moves;
}

function getValidMoves(piece, row, col) {
    let moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(piece, row, col, r, c)) {
                moves.push({ row: r, col: c });
            }
        }
    }
    return moves;
}

function checkGameOver() {
    const validMoves = getAllValidMoves(currentPlayer);
    if (validMoves.length === 0) {
        if (isInCheck(currentPlayer, chessBoard)) {
            const winnerName = currentPlayer === "white" ? pBlackName : pWhiteName;
            const winnerColor = currentPlayer === "white" ? "Black" : "White";
            showGameOverModal("Checkmate!", `${winnerColor} (${winnerName}) wins by checkmate!`);
            document.getElementById("checkWarning").classList.add("hidden");
        } else {
            showGameOverModal("Stalemate!", "The game is a draw by stalemate.");
        }
    } else {
        if (isInCheck(currentPlayer, chessBoard)) {
            document.getElementById("checkWarning").classList.remove("hidden");
        } else {
            document.getElementById("checkWarning").classList.add("hidden");
        }
    }
}

function showGameOverModal(title, message) {
    document.getElementById("gameOverTitle").textContent = title;
    document.getElementById("gameOverMessage").textContent = message;
    document.getElementById("gameOverModal").classList.remove("hidden");
}

function closeModalAndReset() {
    document.getElementById("gameOverModal").classList.add("hidden");
    resetGame();
}

function updatePanels() {
    document.getElementById("whiteCaptured").innerHTML = whiteCaptured.map(p => `<img src="pieces/${p}.svg" class="captured-icon">`).join("");
    document.getElementById("blackCaptured").innerHTML = blackCaptured.map(p => `<img src="pieces/${p}.svg" class="captured-icon">`).join("");
    document.getElementById("moveList").innerHTML = moveHistory.map(m => `<div>${m}</div>`).join("");
}

function resetGame() {
    chessBoard = [
        ["br","bn","bb","bq","bk","bb","bn","br"],
        ["bp","bp","bp","bp","bp","bp","bp","bp"],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["wp","wp","wp","wp","wp","wp","wp","wp"],
        ["wr","wn","wb","wq","wk","wb","wn","wr"]
    ];

    currentPlayer = "white";
    selectedSquare = null;
    draggedPieceSquare = null;
    whiteCaptured = [];
    blackCaptured = [];
    moveHistory = [];

    document.getElementById("turnDisplay").textContent = "Turn: White (" + pWhiteName + ")";
    document.getElementById("checkWarning").classList.add("hidden");

    createBoard();
}

function getSquareName(row, col) {
    const files = ["a","b","c","d","e","f","g","h"];
    return files[col] + (8 - row);
}

function getPieceName(piece) {
    switch(piece){
        case "wp": case "bp": return "Pawn";
        case "wr": case "br": return "Rook";
        case "wn": case "bn": return "Knight";
        case "wb": case "bb": return "Bishop";
        case "wq": case "bq": return "Queen";
        case "wk": case "bk": return "King";
        default: return "Piece";
    }
}

createBoard();
if(document.getElementById("turnDisplay")) {
    document.getElementById("turnDisplay").textContent = "Turn: White (" + pWhiteName + ")";
}