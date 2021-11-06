import React from 'react';
import './Game.css';

//Game cointains the full tic-tac-toe game
class Game extends React.Component{
    constructor(props){
        super(props);
        this.startPlayer=()=> Math.floor(Math.random()*2+1);
        let currPlayer=this.startPlayer();
        this.state = {
            history: [
              {
                squares: [...Array(3)].map(e => Array(3).fill(null))
              }
            ],
            stepNumber: 0,
            player1Symbol: 1,
            player2Symbol: 2,
            currPlayer: currPlayer,
            startPlayer: currPlayer,
            gameWon:false,
            gameText: this.getGameText(0,currPlayer),
          };
        this.symbols=
          {
              1:<i key={"time"} className="fa fa-times"></i>,
              2:<i key={"circle"} className="fa fa-circle"></i>,
              3:<i key={"twitter"} className="fa fa-twitter"></i>,
              4:<i key={"car"} className="fa fa-car"></i>,
              5:<i key={"hashtag"} className="fa fa-hashtag"></i>,
              6:<i key={"square_symbol"} className="fa fa-square"></i>,
              7:<i key={"apple"} className="fa fa-apple"></i>,
              8:<i key={"bolt"} className="fa fa-bolt"></i>,
              9:<i key={"fire"} className="fa fa-fire"></i>,
              10:<i key={"star"} className="fa fa-star"></i>
          }
    }

    gameClick(i,j){
        let currPlayer=this.state.currPlayer;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const currSquares = current.squares.map(function(arr){
            return arr.slice();
        });

        if (currSquares[i][j] || checkWin(currSquares)){
            return;
        }
        currSquares[i][j]=currPlayer;
        this.setState({
            history: history.concat([
                {
                  squares: currSquares
                }
              ]),
        });

        if (checkWin(currSquares)){
            this.setState({
                gameWon: true,
                gameText: this.getGameText(this.state.stepNumber,currPlayer,true),
                stepNumber: this.state.stepNumber+1,
            });
            return;
        }else{
            currPlayer=(currPlayer===1?2:1);
        }

        this.setState({
            stepNumber: this.state.stepNumber+1,
            currPlayer: currPlayer,
          });
        this.setState({gameText: this.getGameText(this.state.stepNumber+1,currPlayer),});
    }

    resetClicked(){
        let currPlayer=this.startPlayer();
        this.setState({
            history: [
              {
                squares: [...Array(3)].map(e => Array(3).fill(null))
              }
            ],
            stepNumber: 0,
            currPlayer: currPlayer,
            startPlayer: currPlayer,
            gameWon:false,
          });
          this.setState({gameText: this.getGameText(0,currPlayer),});
    }

    symbolClick(i,name){
        i++;
        if (this.state.player1Symbol ===i || this.state.player2Symbol ===i){
            return;
        }

        if (name ===1){
            this.setState({
                player1Symbol: i,
            });
        }else{
            this.setState({
                player2Symbol: i,
            });
        }
    }

    jumpTo(step) {
        const currSquares=this.state.history[step].squares.map(function(arr){
            return arr.slice();
        });
        let winState = checkWin(currSquares);
        let currPlayer=((step% 2) === 0?this.state.startPlayer:(this.state.startPlayer===1?2:1));
        if (step===this.state.history.length-1 && winState){
            currPlayer=(currPlayer===1?2:1)
        }
        this.setState({
          stepNumber: step,
          currPlayer: currPlayer,
        });
        this.setState({gameText: this.getGameText(step,currPlayer, winState),});
      }

    
    getGameText(step, currPlayer,gameWon=false){
        let endText="";
        if (step===9){
            return "1 & 2 Draw";
        }

        if (step===0){
            endText = " start";
        }else if(gameWon){
            endText = " win!";
        }else{
            endText= " turn";
        }

        return currPlayer + endText;
    }

    render (){
        const currSquares=this.state.history[this.state.stepNumber].squares.map(function(arr){
            return arr.slice();
        });
        currSquares.forEach((e1)=>{
                e1.forEach((e2,i2,arr) => {
                    if (e2===1){
                        arr[i2]=this.symbols[this.state.player1Symbol]
                    }else if(e2===2){
                        arr[i2]=this.symbols[this.state.player2Symbol]
                    }else{
                        arr[i2]=null;
                    }
                });
            });
        
        
        const moves = this.state.history.map((step, move) => {
        const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
          });
        
        const symbol1=Object.values(this.symbols).slice();
        const symbol2=Object.values(this.symbols).slice(); 
        symbol1[this.state.player2Symbol-1]=" ";
        symbol2[this.state.player1Symbol-1]=" ";
        return(
        <div className="row">
        <div className="column"></div>
        <div className="game-board column">
            <h1>TIC TAC TOE</h1>
            Player {this.state.gameText}
            <br></br>
            <br></br>
          <Grid 
            name={"board"}
            squares={currSquares}
            onClick={(i,j) => this.gameClick(i,j)}
            />
            <br></br>
            <h3>Player 1 Symbol: {this.symbols[this.state.player1Symbol]} </h3>
            <Grid 
                name={1}
                squares={symbol1}
                onClick={(i,name) => this.symbolClick(i,name)}
            />
            <br></br>
            <br></br>
            <br></br>
            <h3>Player 2 Symbol: {this.symbols[this.state.player2Symbol]} </h3>
            <Grid 
                name={2}
                squares={symbol2}
                onClick={(i,name) => this.symbolClick(i,name)}
            />
        </div>
            <div className="game-info column">
            <button onClick={()=>this.resetClicked()}>Reset Game</button>
              <ol>{moves}</ol>
            </div>
            <div className="column"></div>
        </div>

        
        
        )
    }
}



class Grid extends React.Component{
    renderSquare() {
        const items=[]
        this.props.squares.forEach((e1,i1)=>{
            if (e1.length<=1 || !e1.length){
                items.push(<Square key={this.props.name + i1 + "_square"}
                    value={e1}
                    onClick={() => this.props.onClick(i1,this.props.name)}
                />)
            }else{
                const rowItems=[]
                e1.forEach((e2,i2) => {
                    rowItems.push(<Square key={this.props.name + "_" + i1 + "_" +i2}
                        value={e2}
                        onClick={() => this.props.onClick(i1,i2,this.props.name)}
                    />)
                });
                items.push(<div key={this.props.name + i1 +"_Grid"} className="gridRow">{rowItems}</div>)
            }
            
        })
        
        return items;
      }

    render(){
        return(
            <div key={"square"}>
                {this.renderSquare()}
            </div>
        );
    }
}


//Square is the interactable box used for both the tic-tac-toe game as well as the player character selection
function Square(props){
    return(
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );
}

function checkWin(squares) {
    if(squares[1][1]!==null){
        if ((squares[0][0] === squares[1][1] && squares[1][1] === squares[2][2]) ||
                    (squares[2][0] === squares[1][1] && squares[1][1] === squares[0][2])) {
                      return true;
                    } 
    }
    for (let i = 0; i < squares.length; i++) {
            if ((squares[i][0]!==null && squares[i][0] === squares[i][1] && squares[i][1] === squares[i][2]) ||
            (squares[0][i]!==null && squares[0][i] === squares[1][i] && squares[1][i] === squares[2][i])) {
              return true;
            }
        }
    return false;
}

export default Game;