import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'

function Square(props) {
  let style={}
  if(props.winner && props.winner.includes(props.squareNumber)){
    style={color: '#ff0000c9'};
  }else{
    style={color: '#ffffffc9'};
  }   
  return (
        <button style={style}
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
              key={i}
              value={this.props.squares[i]} 
              onClick={()=>this.props.onClick(i)}
              winner={this.props.winner}
              squareNumber={i}
          />
          );
      }
    render() {
        let board = []

        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(3*i+j));
            }
            board.push(<div className="board-row" key={i}>
                            {row}
                        </div>);
        }

        return(
            <div className="board-game">
                {board}
            </div>
        )
    }
  }

  class Toggle extends React.Component{
    handleToggle = (e) => {
      this.props.handleToggle(e.target.checked);
    }

    render() {
      return (
        <div className="ui slider checkbox">
          <input
            type="checkbox"
            name="name"
            onChange={this.handleToggle}>
          </input>
          <label><h5>Show moves from last to first</h5></label>
        </div>
      )
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
            toggleSelected : false     
        };
    }

    handleToggle(selected) {
      console.log(selected);
      this.setState({
        toggleSelected : selected
      })
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
        if(move % 2 === 0){
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
        const history = this.state.toggleSelected ? this.state.history.slice(0).reverse() : this.state.history;
        // const current = history[this.state.stepNumber];
        const stepNumber = this.state.toggleSelected ? (history.length-1) - this.state.stepNumber : this.state.stepNumber;
        const current = history[stepNumber];
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
            move = this.state.toggleSelected ? Math.abs(move-(history.length-1)) : move;
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
            status = 'Winner: ' + current.squares[winner[0]];
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
                winner={winner}
                />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <Toggle handleToggle={(e) => this.handleToggle(e)}></Toggle>
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
        return [a, b, c];
      }
    }
    return null;
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );