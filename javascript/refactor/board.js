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
const team = Object.freeze({
    WHITE: 1,
    BLACK: 2
})

const codeAt = board => p => board[p.i] && board[p.i][p.j]
const squareIsEmpty = board => p => codeAt(board)(p.i, p.j) === 0

const teamOfVal = x => x && x.toUpperCase
    ? x.toUpperCase() == x
        ? team.WHITE
        : team.BLACK
    : undefined
const opposingTeamOfVal = x => x && x.toUpperCase
? x.toUpperCase() == x
    ? team.BLACK
    : team.WHITE
: undefined

const squareIsPawn = board => p => codeAt(board)(p).toUpperCase && codeAt(board)(p).toUpperCase() === 'P'

const teamOfSquare = board => p => teamOfVal(codeAt(board)(p))
const opponentOfSquare = board => p => opposingTeamOfVal(codeAt(board)(p))
const teamAtIs = board => p => team => teamOfSquare(board)(p) === team
const areSameTeam = board => s => e => teamOfSquare(board)(s) === teamOfSquare(board)(e)
const areDifferentTeam = board => s => e => base.differentAndExists(teamOfSquare(board)(s))(teamOfSquare(board)(e))

module.exports = {
    zeroBoard,
    team,
    codeAt,
    squareIsEmpty,
    teamOfVal,
    opposingTeamOfVal,
    squareIsPawn,
    teamOfSquare,
    opponentOfSquare,
    teamAtIs,
    areSameTeam,
    areDifferentTeam
}