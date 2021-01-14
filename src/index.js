import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
        return (
          <Square 
              value={this.props.squares[i]} 
              onClick={()=>this.props.onClick(i)}
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
                squareNumber :0
            }],
            currentPlayer : 'X',
            stepNumber : 0,
            
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.currentPlayer;
        this.switchPlayer(this.state.stepNumber+1)
        this.setState({
            history: history.concat([{
                squares: squares,
                squareNumber : i
            }]),
            stepNumber : this.state.stepNumber+1,
            
        });
    }

    switchPlayer(move){
        if(move % 2 == 0){
            this.setState({currentPlayer:'X'})
        } else{
            this.setState({currentPlayer:'O'})
        }
    }

    jumpTo(move){
        this.switchPlayer(move);
        this.setState({stepNumber : move});
    }   

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const coords = [
            [0,0],
            [0,1],
            [0,2],
            [1,0],
            [1,1],
            [1,2],
            [2,0],
            [2,1],
            [2,2]
        ]
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ' at position(' + coords[step.squareNumber][0]+ ',' + coords[step.squareNumber][1] + ')' : 'Go to start';
                    if(this.state.stepNumber === move){
                        return(
                        <li key={move}>
                            <button style={{fontWeight : "bold"}} onClick={()=>this.jumpTo(move)}>{desc}</button>
                        </li>)
                    }
                    else{
                        return(
                        <li key={move}>
                        <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                        </li>)
                    }
        })

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + this.state.currentPlayer;
        }
        
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares} 
                onClick={(i)=>this.handleClick(i)}
                currentPlayer={this.state.currentPlayer}
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
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );