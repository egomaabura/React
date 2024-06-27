import { useState } from "react"

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return
    }
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = "X"
    } else {
      nextSquares[i] = "O"
    }
    onPlay(nextSquares)
  }

  const winner =  calculateWinner(squares)
  let status
  if (winner) {
    status = "Winner: " + winner
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  // 参考：https://qiita.com/sisi0808/items/b9a8073356d75db78293
  function renderSquare(i) {
    return(
      <Square 
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
      />
    )
  }

  function renderSquares() {
    let rows = []
    for(let i = 0; i < 3; i++) {
      let squares = []
      for(let j = 0; j < 3; j++) {
        squares.push(renderSquare(i * 3 + j))
      }
      rows.push(<div className="board-row">{squares}</div>)
    }
    return rows
  }

  return (
    <>
      <div className="status">{status}</div>
      {renderSquares()}
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  const [sort, setSort] = useState(true) // true:昇順

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history
    .map((squares, move) => {
      let description
      if (move === 0){
        description = "Go to game start"
      } else if (move === currentMove) {
        description = "You are at move#" + move
      } else {
        description = "Go to move #" + move
      }

      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      )
    })

  // 参考：https://qiita.com/Ryukuu0919/items/f22b4d6d13095b305cd3
  function handleClickSort() {
    setSort(!sort)
  }

  const sortedMoves = sort ? moves : [...moves].reverse()

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol><button onClick={handleClickSort}>{sort ? "up" : "down"}</button></ol>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  )
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}