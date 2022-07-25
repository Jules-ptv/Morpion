//Just start by initialize some variableq
const size = 3;

const AI_TURN = 2;


const DEPTH = 4;

let board = Array(size);
for (let i = 0; i < size; i++) {
  board[i] = Array(size).fill(0);
}

let playerTurn = 1;

let iterations = 2;

let gameOver = false;

//Initialize the board
window.onload = ()=>{
	
	let boardElement = document.getElementById('board');

	for (let i = 0; i < size; i++) {
		for(let j=0; j<size; j++){

			let g = document.createElement('div');

			g.setAttribute('class','grid--element');
			g.setAttribute('id', 3*i + j);
			g.setAttribute('x',i);
			g.setAttribute('y',j);
			g.setAttribute('onclick',"checkMove(this.getAttribute('x'),this.getAttribute('y'),1)");
			
			boardElement.appendChild(g);
		}
		
	}

	CallAI();
	
}

function isMoveValid(x,y,position){
	if(position[x][y]==0 /*&& interactor==playerTurn*/ && !gameOver){
		return true;
	} else{
		return false;
	}

}




//Check whether or not a move is valid.
function checkMove(x,y,interactor){
	//Can only play if this is to player1 (human) to play and if the cell is empyu.


	if(board[x][y]==0 && interactor==playerTurn && !gameOver){



		addPiece(x,y,playerTurn);
		

		//If 1, return 2, if 2, return 1 ! (incredibly simple!!)
		playerTurn = 3-playerTurn;

		//calls AI
		//--------TO DO---------
		if(playerTurn==AI_TURN){
			CallAI();
		}
		
		
	}
	
}

function CallAI(){
	let result = minimax(board,DEPTH,false)

		console.log("MINIMAX : ", result);
		
		checkMove(PlacementToCoord(result[1])[0],PlacementToCoord(result[1])[1],AI_TURN);

		console.log("I PLAYED --- "+result[1]);
}


//Add a piece to the board and to the interface (can only be called by checkMove function.)
function addPiece(x,y,player){

	let cell = document.getElementById(CoordToPlacement(x,y));

	board[x][y]=player;


	if(player==1){
		let icon = document.createElement('i');
		icon.setAttribute('class','fa-solid fa-xmark');
		cell.appendChild(icon);
		
	} else if(player==2){

		let icon = document.createElement('i');
		icon.setAttribute('class','fa-regular fa-circle');
		cell.appendChild(icon);
	}

	if(checkVictory(board)[0]){
		alert("Player "+checkVictory(board)[1]+" won!");
		gameOver = true;
	}
}


//Check if there is a winner.
function checkVictory(myBoard){
	const victoryConditions = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	]

	let isWinning = [false,undefined];
	victoryConditions.forEach(element =>{

		let cell0 = myBoard[PlacementToCoord(element[0])[0]][PlacementToCoord(element[0])[1]];
		let cell1 = myBoard[PlacementToCoord(element[1])[0]][PlacementToCoord(element[1])[1]];
		let cell2 = myBoard[PlacementToCoord(element[2])[0]][PlacementToCoord(element[2])[1]];

		if(cell0==cell1 && cell1==cell2 && cell0 != 0){
			isWinning = [true,cell0];
			return;
			
		}
	})

	if(isWinning[0]){
		return [true,isWinning[1]]
	}else{
		return [false,undefined]
	}
	
}


//----------------------------AI PART---------------------------
//(using the minimax algorithm)



function minimax(position, depth, maximizingPlayer,move){
	if(depth==0 || checkVictory(position)[0]){
		console.log("Depth = 0",depth==0,", so evaluation for : "+position);
		return [evaluate(position),move];
	}
	console.log("Hi,depth!=0");

	if(maximizingPlayer){
		let maxEval = -Infinity;

		let bestMove = null;

		for(let i =0; i<size; i++){
			for(let j = 0; j<size; j++){
				if(isMoveValid(i,j,position)){
					console.log("Possible valid move for Player, ",i,j);
					let childPosition = [[],[],[]];

					for(let x=0; x<size; x++){
						childPosition[x] = position[x].slice();
					}

					childPosition[i][j]=3-AI_TURN;
					
					let eval = minimax(childPosition,depth-1,false,CoordToPlacement(i,j))[0];

					if(eval>=maxEval){
						maxEval = Math.max(maxEval,eval);
						bestMove = CoordToPlacement(i,j);
					}
					

					
				}
			}
		}

		return [maxEval,bestMove];


	} else{

		let minEval = +Infinity;
		let bestMove = null;

		for(let i = 0; i < size; i++){
			for(let j = 0; j<size; j++){
				if(isMoveValid(i,j,position)){

					console.log("Possible valid move for AI, ",i,j);
					let childPosition = [[],[],[]];

					for(let x=0; x<size; x++){
						childPosition[x] = position[x].slice();
					}

					childPosition[i][j]=AI_TURN;
					let eval = minimax(childPosition,depth-1,true,CoordToPlacement(i,j))[0];
					console.log("Eval for move ",i,j," : ",eval);
					if(eval<=minEval){
						minEval = Math.min(minEval,eval);
						bestMove = CoordToPlacement(i,j);
					}
				}
			}
		}

		return [minEval,bestMove];

	}


}


function evaluate(myBoard){
	const evaluationConditions = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	]


	let x1 = 0;
	let x2 = 0;
	let x3 = 0;

	let o1 = 0;
	let o2 = 0;
	let o3 = 0;
	

	evaluationConditions.forEach(element =>{

		let elem0 = myBoard[PlacementToCoord(element[0])[0]][PlacementToCoord(element[0])[1]];
		let elem1 = myBoard[PlacementToCoord(element[1])[0]][PlacementToCoord(element[1])[1]];
		let elem2 = myBoard[PlacementToCoord(element[2])[0]][PlacementToCoord(element[2])[1]];

		//3 alined
		if(elem0==elem1 && elem1==elem2 && elem2==1){
			console.log("Yes x3++, because",elem0,elem1,elem2,elem0==elem1==elem2==1);
			x3++;
			x3 = Infinity;
		} else if(elem0==elem1 && elem1==elem2 && elem2==2){

			o3++;
			o3 = Infinity;
		}else if((elem0==elem1 && elem1==1 && elem2==0)||(elem0==elem2 && elem2==1 && elem1==0)||(elem1==elem2 && elem2==1 && elem0==0)){
			x2++;
		}else if((elem0==elem1 && elem1==2 && elem2==0)||(elem0==elem2 && elem2==2 && elem1==0)||(elem1==elem2 && elem2==2 && elem0==0)){
			o2++;
		} else if((elem0==1 && elem1==elem2 && elem2==0)||(elem1==1 && elem0==elem2 && elem2==0)||(elem2==1 && elem0==elem1 && elem1==0)){
			x1++;
		}else if((elem0==2 && elem1==elem2 && elem2==0)||(elem1==2 && elem0==elem2 && elem2==0)||(elem2==2 && elem0==elem1 && elem1==0)){	
			o1++;
		}	

	});





	let value = (10 * x3 + 3 * x2 + x1) - (10 * o3 + 3 * o2 + o1);

	console.log(x1,x2,x3,o1,o2,o3, "value : ",value);

	return value;

}














//Just some helper functions.
function CoordToPlacement(x,y){
	return (3*parseInt(x) +parseInt(y))
}

function PlacementToCoord(i){
	return [(~~(i/size)), (parseInt(i)%size)]
}


function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }