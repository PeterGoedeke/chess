const base = require('./base')

const zeroBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

const flip = mat => mat.reverse().forEach(arr => arr.reverse())

const getCodeAt = state => (i, j) => state.board[i] && state.board[i][j]
const squareIsEmpty = state => (i, j) => getCodeAt(state)(i, j) === 0
const getTeamCode = x => x && x.toUpperCase
    ? x.toUpperCase() == x
    : undefined
const getOpposingTeamCode = x => x && x.toUpperCase
    ? x.toUpperCase() != x
    : undefined
const getTeamAt = state => (i, j) => getTeamCode(getCodeAt(state)(i, j))
const getOpposingTeamAt = state => (i, j) => getOpposingTeamCode(getCodeAt(state)(i, j))
const teamAtIs = state => (i, j) => teamCode => getTeamAt(state)(i, j) == teamCode
const pawnMoveDirectionForTeam = state => (i, j) => teamAtIs(state)(i, j)(1)
    ? 1
    : -1
const pawnStartingLocationForTeam = state => (i, j) => teamAtIs(state)(i, j)(1)
    ? 1
    : 6
const pawnPromotionRowForTeam = state => (i, j) => teamAtIs(state)(i, j)(1)
    ? 7
    : 0

const pawnMustPromote = state => (i, j) => pawnPromotionRowForTeam(state)(i, j) == j

const isPiece = x => y => (typeof x) === 'string' && x.toUpperCase() === y
const isPieceAt = y => state => (i, j) => isPiece(getCodeAt(state)(i, j))(y)
const is = {
    pawn: isPieceAt('P'),
    rook: isPieceAt('R'),
    knight: isPieceAt('N'),
    bishop: isPieceAt('B'),
    king: isPieceAt('K'),
    queen: isPieceAt('Q'),
}

const findKing = state => teamCode => state.board.reduce((acc, cur, j) =>
    cur.reduce((rowAcc, __, i) => is.king(state)(i, j) && teamAtIs(state)(i, j)(teamCode) ? {i,j} : rowAcc, false) || acc, { i: -1, j: - 1})

// const which = state => (i, j) => Object.getOwnPropertyNames(is).find(func => func(state)(i, j))

const pieceToMove = state => getCodeAt(state)(state.move[0].i, state.move[0].j)
const pieceAtMoveEnd = state => getCodeAt(state)(...state.move[1])

const areSameTeam = state => (i1, j1) => (i2, j2) => getTeamCode(getCodeAt(state)(i1, j1)) == getTeamCode(getCodeAt(state)(i2, j2))
const areDifferentTeam = state => (i1, j1) => (i2, j2) => {
    const c1 = getTeamAt(state)(i1, j1)
    const c2 = getTeamAt(state)(i2, j2)
    // console.log(i1, j1, i2, j2, c1, c2)
    if(c1 == undefined || c2 == undefined) return false

    return c1 != c2
}

const isWhite = x => x.toUpperCase() == x
const isBlack = x => x.toLowerCase() == x
const convertToTeam = x => y => y && y.toLowerCase && getTeamCode(x)
    ? y.toUpperCase()
    : y.toLowerCase()

module.exports = {
    ZEROS: zeroBoard,
    
    flip,
    getCodeAt,
    squareIsEmpty,
    getTeamCode,
    getOpposingTeamCode,
    getTeamAt,
    getOpposingTeamAt,
    teamAtIs,
    pawnMoveDirectionForTeam,
    pawnStartingLocationForTeam,
    isPiece,
    isPieceAt,
    is,
    findKing,
    pawnMustPromote,
    
    pieceToMove,
    pieceAtMoveEnd,

    areSameTeam,
    areDifferentTeam,

    isWhite,
    isBlack,
    convertToTeam
}