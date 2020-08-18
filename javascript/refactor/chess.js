const base = require('./base')
const board = require('./board')

const next = base.spec({
    teamMoving: base.invProp('teamMoving'),
    board: nextBoard,
    move: clear,
    enpassant: nextEnpassant,
    castlePossibilites: nextCastlePossibilities
})

const nextBoard = state => applyMove(state)(state.move[0])(state.move[1])
const clear = _ => null
const nextEnpassant = state => movingPawn(state) && base.pointDistance(state.move[0])(state.move[1]) === 2
    ? state.move[1]
    : null

const movingPawn = state => board.squareIsPawn(state.board)(state.move[0])

const playMove = state => s => e => validMove(state)(s)(e)
    ? next(base.merge(state)({ move }))
    : state


// move is valid if you are moving a piece of your team onto a location which it can reach and this does not cause a check on your king

const applyMove = state => s => e => base.pipe(
    base.replace2d(e)(board.getCodeAt(state)(s)),
    base.replace2d(s)(0),
    promotePawn(state)(e)
    // check for castling and apply it here
)(state.board)

const movablePiece = state => p => board.teamAtIs(state.board)(p)(state.teamMoving)
const moveChecksTeam = state => s => e => team => pieces.teamInCheck(applyMove(state)(s)(e))(team)

const validMove = state => s => e => movablePiece(state)(s)
    && pieces.canMoveFromTo(state)(s)(e) && !moveChecksTeam(state)(s)(e)(state.teamMoving)