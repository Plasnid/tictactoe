import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { isNullOrUndefined, isNull } from 'util';

function Square(props) {
    return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            moves:[{}],
        };
    }
    handleClick(i){
        //take a copy of the history
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        //takea copy of the moves history
        const movesHistory = this.state.moves.slice(0, this.state.stepNumber + 1);
        //get the length of the history
        const historyLength = history.length;
        //find the most recent move
        const current = history[historyLength - 1];
        //take a copy of squares
        const squares = current.squares.slice();
        //if there is a winner or the square is taken, do nothing
        if(calculateWinner(squares)||squares[i]){
            return;
        }
        //if xIsNext is true, make the square X, otherwise make it O
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        //set the new state with history adding the new move
        //the step, and what player moves next

        //do a diff on the current squares vs the last turns squares;
        const turnAction = arrayDif(squares, current.squares);
            
        //make a copy of the movesList from the beginning up to the currentMove
        const gameMoves = [...movesHistory, turnAction];

        
        //end of new entry

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            moves: gameMoves,
        });
    }
    jumpTo(step){
        //set the state for step and xIsNext
        //the step becomes whatever value we passed in
        //the next player is X if even, O if odd
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    
    render() {
        //get the history, current step and winner
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const tie = checkForTie(current.squares);
        

        /*
        map over the steps.  if the step number is greater than 0, the phrasing is "go to move #"
        */
        const moves = history.map((step, move) => {
            const stepMove = this.state.moves[move];
            const desc = move ? 
                `Go to move #  ${move.toString()} ${stepMove.val.toString()} at row ${stepMove.row.toString()} col ${stepMove.column.toString()}` :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        }else if(!winner && tie){
            status = `It's a tie!`;
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i)=> this.handleClick(i)}
                    />

                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

  // ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function arrayDif(arr1, arr2){
    let arr1Leng = arr1.length;
    let difData = (function(){
        for(let i=0;i<arr1Leng;i++){
            if(arr1[i]!==arr2[i]){
                return {pos: i, val: arr1[i]};
            }
        }
    })();
    difData.row = getRow(difData.pos, 3);
    difData.column = getColumn(difData.pos, 3);
    return difData;
}
function getRow(arrPos, width){
    return Math.floor(arrPos/width);
}
function getColumn(arrPos, width){
    return Math.floor(arrPos%width);
}
function checkForTie(squares){
    let isTie = squares.every(function(square, i) {return square;});
    return isTie;
}
function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for(let i = 0; i < lines.length;i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a]===squares[c]){
            return squares[a];
        }
    }
    return null;
}