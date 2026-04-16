const board = document.getElementById("board");

let currentPlayer = "white";
let selectedSquare = null;

let chessBoard = [
["♜","♞","♝","♛","♚","♝","♞","♜"],
["♟","♟","♟","♟","♟","♟","♟","♟"],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["♙","♙","♙","♙","♙","♙","♙","♙"],
["♖","♘","♗","♕","♔","♗","♘","♖"]
];

function createBoard(){

board.innerHTML="";

for(let row=0; row<8; row++){

for(let col=0; col<8; col++){

const square=document.createElement("div");

square.classList.add("square");

if((row+col)%2===0){
square.classList.add("light");
}else{
square.classList.add("dark");
}

square.textContent=chessBoard[row][col];

square.dataset.row=row;
square.dataset.col=col;

square.addEventListener("click",handleSquareClick);

board.appendChild(square);

}

}

}

function isWhitePiece(piece){
return ["♙","♖","♘","♗","♕","♔"].includes(piece);
}

function isBlackPiece(piece){
return ["♟","♜","♞","♝","♛","♚"].includes(piece);
}

function handleSquareClick(event){

const square=event.target;

const row=parseInt(square.dataset.row);
const col=parseInt(square.dataset.col);

const piece=chessBoard[row][col];

if(selectedSquare===null){

if(piece==="") return;

if(currentPlayer==="white" && !isWhitePiece(piece)) return;
if(currentPlayer==="black" && !isBlackPiece(piece)) return;

selectedSquare={row,col};

square.classList.add("selected");
}else{

const fromRow=selectedSquare.row;
const fromCol=selectedSquare.col;

const movingPiece=chessBoard[fromRow][fromCol];

if(!isValidMove(movingPiece,fromRow,fromCol,row,col)){
selectedSquare=null;
createBoard();
return;
}

chessBoard[row][col]=movingPiece;
chessBoard[fromRow][fromCol]="";

selectedSquare=null;

createBoard();
switchTurn();

}

}

function switchTurn(){

currentPlayer = currentPlayer==="white" ? "black":"white";

document.getElementById("turnDisplay").textContent =
"Turn: " + (currentPlayer==="white" ? "White" : "Black");

}


function isValidMove(piece,fr,fc,tr,tc){

switch(piece){

case "♙":
return validateWhitePawn(fr,fc,tr,tc);

case "♟":
return validateBlackPawn(fr,fc,tr,tc);

case "♖":
case "♜":
return validateRook(fr,fc,tr,tc);

case "♗":
case "♝":
return validateBishop(fr,fc,tr,tc);

case "♘":
case "♞":
return validateKnight(fr,fc,tr,tc);

case "♕":
case "♛":
return validateQueen(fr,fc,tr,tc);

case "♔":
case "♚":
return validateKing(fr,fc,tr,tc);

default:
return false;

}

}

function validateWhitePawn(fr,fc,tr,tc){

if(fc===tc && tr===fr-1 && chessBoard[tr][tc]==="") return true;

if(fr===6 && fc===tc && tr===fr-2 && chessBoard[tr][tc]==="") return true;

if(tr===fr-1 && Math.abs(tc-fc)===1 && chessBoard[tr][tc]!=="") return true;

return false;

}

function validateBlackPawn(fr,fc,tr,tc){

if(fc===tc && tr===fr+1 && chessBoard[tr][tc]==="") return true;

if(fr===1 && fc===tc && tr===fr+2 && chessBoard[tr][tc]==="") return true;

if(tr===fr+1 && Math.abs(tc-fc)===1 && chessBoard[tr][tc]!=="") return true;

return false;

}

function validateKnight(fr,fc,tr,tc){

const rowDiff=Math.abs(fr-tr);
const colDiff=Math.abs(fc-tc);

return (rowDiff===2 && colDiff===1) || (rowDiff===1 && colDiff===2);

}

function validateRook(fr,fc,tr,tc){

return fr===tr || fc===tc;

}

function validateBishop(fr,fc,tr,tc){

return Math.abs(fr-tr)===Math.abs(fc-tc);

}

function validateQueen(fr,fc,tr,tc){

return validateRook(fr,fc,tr,tc) || validateBishop(fr,fc,tr,tc);

}

function validateKing(fr,fc,tr,tc){

return Math.abs(fr-tr)<=1 && Math.abs(fc-tc)<=1;

}

function resetGame(){

chessBoard=[
["♜","♞","♝","♛","♚","♝","♞","♜"],
["♟","♟","♟","♟","♟","♟","♟","♟"],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["♙","♙","♙","♙","♙","♙","♙","♙"],
["♖","♘","♗","♕","♔","♗","♘","♖"]
];

currentPlayer="white";
selectedSquare=null;

createBoard();

}

createBoard();
