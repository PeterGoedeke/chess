const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

const base = require('./base')
const board = require('./board')

const pieces = require('./pieces')

const initialState = {
    board: [
        ['R', 'P', 0, 0, 0, 0, 'P', 0],
        ['N', 'P', 0, 0, 0, 0, 'p', 'n'],
        ['B', 'P', 0, 0, 0, 0, 'p', 'b'],
        ['Q', 'P', 0, 0, 0, 'N', 'r', 'q'],
        ['K', 'P', 0, 0, 0, 0, 'p', 'k'],
        ['B', 'P', 0, 0, 0, 0, 'p', 'b'],
        ['N', 'P', 0, 0, 0, 0, 'p', 'n'],
        ['R', 'P', 0, 0, 0, 0, 'p', 'r'],
    ],
    whoseMove: 1,
    castlePossibilites: {
        whiteKingside: true,
        whiteQueenside: true,
        blackKingside: true,
        blackQueenside: true
    },
    enpassant: null,
    gameState: {
        whiteWin: false,
        blackWin: false,
        draw: false
    }
}

const nextBoard = state => validMove(state)(state.move)
    ? applyMove(state)(state.move)
    : state.board

const clear = _ => null
const nextEnpassant = state => state.move && validMove(state)(state.move)
    ? board.pieceToMove(state) && board.pieceToMove(state).toLowerCase() == 'p' // piece to move is a pawn
        && base.pointDistance(state.move[0])(state.move[1]) == 2 // piece is being moved two places
        ? state.move[1]
        : null
    : state.enpassant

    // && state.move[0].j == 1 && state.whoseMove == 1 || state.move[0].j == 6 && state.whoseMove == 0 // 

const validMove = state => move => !!move
    ? !board.squareIsEmpty(state)(move[0].i, move[0].j) && !base.pointEq(move[0])(move[1])
    && board.teamAtIs(state)(move[0].i, move[0].j)(state.whoseMove) && pieces.at(state)(move[0].i, move[0].j)(board.ZEROS)[move[1].i][move[1].j] == 1
        ? !pieces.kingOfTeamChecked(base.merge(state)({board: applyMove(state)(move)}))(state.whoseMove)
        : false
    : false

// check if black and if black then flip before pipeing otherwise just pipe

const promotePawn = state => (i, j) => mat => board.pawnMustPromote({ board: mat })(i, j)
    ? base.replace2d(i, j)(board.convertToTeam(board.getCodeAt({ board: mat })(i, j))('q'))(mat)
    : mat

const applyMove = state => move => base.pipe(
    base.replace2d(move[1].i, move[1].j)(board.getCodeAt(state)(move[0].i, move[0].j)),
    base.replace2d(move[0].i, move[0].j)(0),
    promotePawn(state)(move[1].i, move[1].j)
    // check for en passant and apply it here
    // check for castling and apply it here
    // check for queening and apply it here
)(state.board)

const nextWhoseMove = state => validMove(state)(state.move)
    ? !state.whoseMove
    : state.whoseMove

const nextCastlePossibilities = state => {
    const cp = state.castlePossibilites
    return state.whoseMove
    ? {
        whiteKingside: cp.whiteKingside && !(state.move[0].i == 0 && state.move[0].j == 0) && !(state.move[0].i == 3 && state.move[0].j == 0),
        whiteQueenside: cp.whiteQueenside && !(state.move[0].i == 7 && state.move[0].j == 0) && !(state.move[0].i == 3 && state.move[0].j == 0),
        blackKingside: cp.blackKingside,
        blackQueenside: cp.blackKingside
    }
    : {
        whiteKingside: cp.whiteKingside,
        whiteQueenside: cp.whiteQueenside,
        blackKingside: cp.blackKingside && !(state.move[0].i == 0 && state.move[0].j == 7) && !(state.move[0].i == 3 && state.move[0].j == 7),
        blackQueenside: cp.blackKingside && !(state.move[0].i == 7 && state.move[0].j == 7) && !(state.move[0].i == 3 && state.move[0].j == 7)
    }
}

const next = base.spec({
    whoseMove: nextWhoseMove,
    board: nextBoard,
    move: clear,
    enpassant: nextEnpassant,
    castlePossibilites: nextCastlePossibilities
})

const enqueueMove = state => move => validMove(state)(move)
    ? base.merge(state)({ move })
    : state


const getBoardString = board => '----------------------\n' + board.map(row => row.join(', ')).join('\n') + '\n' + '----------------------\n'
const printBoard = board => console.log(getBoardString(board))

// printBoard(initialState.board)

// console.log(initialState.board)
// console.log(board.areDifferentTeam(initialState)(0, 0)(0, 6))
// printBoard(pieces.king(initialState)(2, 3)(board.ZEROS))
// printBoard(pieces.getAttackedSquares(initialState)(0))
// console.log(board.findKing(initialState)(1))
// pawnCheckForwardTiles(initialState)(2, 1)(zeroBoard)

// const read = currentState => {
//     const move = readline.question('hi')
//     // read(next(enqueueMove(currentState)(move)))
// }
// read(initialState)

// readline.question('hi')

const removeWhitespace = x => x.replace(/ /g, '')

const moveFromTerminal = text => {
    const arr = removeWhitespace(text).split(',')
    return [ {i: parseInt(arr[0]), j: parseInt(arr[1])}, {i: parseInt(arr[2]), j: parseInt(arr[3])} ]
}
const read = currentState => {
    console.log(getBoardString(currentState.board), 'a ', currentState.whoseMove, 'b ', currentState.enpassant, 'c ', currentState.move)
    readline.question('q' + getBoardString(currentState.board), moveRaw => {
        const move = moveFromTerminal(moveRaw)
        read(next(enqueueMove(currentState)(move)))
    })
}
read(initialState)

// readline.question('hi', answer => {
//     console.log('hello')
// })