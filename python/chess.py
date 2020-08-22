import numpy as np
from enum import Enum
from abc import ABC, abstractmethod
from itertools import takewhile

indBoardArr = [(x,y) for x in range(8) for y in range(8)]
indBoard = np.empty(len(indBoardArr), dtype=object)
indBoard[:] = indBoardArr
indBoard.shape = 8,8

class Team(Enum):
    WHITE = 1
    BLACK = 2

class Piece(ABC):
    def __init__(self, team):
        self.team = team

    def getMoveset(self, board, sections):
        moveset = set()

        for section in sections:
            newSection = set(takewhile(lambda x: board[x] is None, section[1:]))
 
            if(len(newSection) < len(section) - 1):
                firstDroppedInd = section[len(newSection) + 1]
                firstDropped = board[firstDroppedInd]

                if(firstDropped is not None and not firstDropped.isTeam(self.team)):
                    newSection.add(firstDroppedInd)
            moveset = moveset.union(newSection)
        return moveset

    def display(self, a):
        return (a.upper() if self.team == Team.WHITE else a.lower())

    def isTeam(self, team):
        return self.team == team

    def canMoveTo(self, move, board):
        if not (0 <= move[0] < 8 and 0 <= move[1] < 8): return False

        piece = board[move]
        return piece is None or not piece.isTeam(self.team)
    
    def getDirection(self):
        return 1 if self.team == Team.WHITE else -1

def getOrthogonalSections(row, col):
    return [
        indBoard[row, col:],
        indBoard[row, col::-1],
        indBoard[row:, col],
        indBoard[row::-1, col]
    ]

def getDiagonalSections(row, col):
    return [
        indBoard[row:, col:].diagonal(),
        indBoard[row::-1, col::-1].diagonal(),
        np.fliplr(indBoard)[row:,7-col:].diagonal(),
        np.fliplr(indBoard)[row::-1,7-col::-1].diagonal(),
    ]

class Rook(Piece):
    def getMoveset(self, board, row, col):
        sections = getOrthogonalSections(row, col)
        return super().getMoveset(board, sections)
    
    def __repr__(self):
        return super().display('r')

class Bishop(Piece):
    def getMoveset(self, board, row, col):
        sections = getDiagonalSections(row, col)
        return super().getMoveset(board, sections)
    
    def __repr__(self):
        return super().display('b')

class Queen(Piece):
    def getMoveset(self, board, row, col):
        sections = getOrthogonalSections(row, col) + getDiagonalSections(row, col)
        return super().getMoveset(board, sections)
    
    def __repr__(self):
        return super().display('q')

class Pawn(Piece):
    def getMoveset(self, board, row, col):
        moveset = set()

        moveForwardOneInd = (row, col + self.getDirection())
        if board[moveForwardOneInd] is None:
            moveset.add(indBoard[moveForwardOneInd])
            
            moveForwardTwoInd = (row, col + self.getDirection() * 2)
            if self.canLongMove(row, col) and board[moveForwardTwoInd] is None:
                moveset.add(indBoard[moveForwardTwoInd])

        upperDiagonalInd = (row-1,col+self.getDirection())
        lowerDiagonalInd = (row+1,col+self.getDirection())

        for ind in [upperDiagonalInd, lowerDiagonalInd]:
            if not self.isEnemyPiece(board[ind]):
                moveset.add(indBoard[ind])
        return moveset
    
    def __repr__(self):
        return super().display('p')
    
    def canLongMove(self, row, col):
        return True if self.team == Team.WHITE and col == 1 or self.team == Team.BLACK and col == 6 else False

    def isEnemyPiece(self, piece):
        return piece is not None and self.team != piece.team

class Knight(Piece):
    def getMoveset(self, board, row, col):
        spaces = [1,-1,2,-2]
        return { (x + row, y + col) for x in spaces for y in spaces if abs(x) != abs(y)
            and self.canMoveTo((x + row, y + col), board) }

    def __repr__(self):
        return super().display('n')

class King(Piece):
    def getMoveset(self, board, row, col):
        spaces = [0,1,-1]
        return { (x + row, y + col) for x in spaces for y in spaces if not x == y == 0
            and self.canMoveTo((x + row, y + col), board)}
    
    def isChecked(self, board, row, col):
        for attack in [(row-1,col+self.getDirection()), (row+1,col+self.getDirection())]:
            if isinstance(board[attack], Pawn) and not board[attack].isTeam(self.team):
                return True

        for attack in Knight.getMoveset(self, board, row, col):
            if isinstance(board[attack], Knight) and not board[attack].isTeam(self.team):
                return True

        for arr in getOrthogonalSections(row, col):
            if self.threatenedOnSequence(arr, board):
                return True
        for arr in getDiagonalSections(row, col):
            if self.threatenedOnSequence(arr, board, orth=False):
                return True
        return False
    
    def threatenedOnSequence(self, seq, board, orth=True):
        for e in seq[1:]:
            if board[e] is None: continue
            return not board[e].isTeam(self.team) and (isinstance(board[e], (Rook if orth else Bishop)) or isinstance(board[e], Queen))
    
    def __repr__(self):
        return super().display('k')
def getPrintableBoard(board):
    return np.array([list(map(lambda x: 0 if x is None else x, subboard)) for subboard in board])

def getPrintableBoardWithPossibleMoves(board, row, col):
    printableBoard = getPrintableBoard(board)
    for move in board[row, col].getMoveset(board):
        printableBoard[move] = Hit() if printableBoard[move] == 0 else (printableBoard[move])
