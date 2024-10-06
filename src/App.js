//Deploy tại đường dẫn https://hungtruong03.github.io/Tutorial_TicTacToe

import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'winning' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const {winner, winningLine} = calculateWinner(squares);

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => (
    <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinningSquare={winningLine && winningLine.includes(i)}/>
  );

  const rows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      squaresInRow.push(renderSquare(row * 3 + col));
    }
    rows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), index: -1}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, index: i}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleDisplayOrder() {
    setAscending(!isAscending);
  }

  const moves = history.map((turnInfo, move) => {
    let description;
    if (move > 0) {
      const row = Math.floor(turnInfo.index / 3) + 1;
      const col = turnInfo.index % 3 + 1;
      const symbol = move % 2 === 0 ? 'O' : 'X';
      description = 'Go to move #' + move + ' - ' + symbol + '(' + row + ', ' + col + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
      {move === currentMove ? (
          <>You are at move #{move}</>
      ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
      )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleDisplayOrder}>{isAscending ? 'Sort Descending' : 'Sort Ascending'}</button>
        <ol>{isAscending ? moves : [...moves].reverse()}</ol>
      </div>
    </div>
  );
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
      return { 
        winner: squares[a],
        winningLine: lines[i]
      };
    }
  }
  return {
    winner: null,
    winningLine: null
  };
}
