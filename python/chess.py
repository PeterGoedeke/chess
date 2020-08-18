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
    def __init__(self, row, col, team):
        self.row = row
        self.col = col
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
