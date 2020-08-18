module Types where

import Data.Char

data Team = Black | White deriving (Show, Eq)

otherTeam :: Team -> Maybe Team
otherTeam Black = Just White
otherTeam White = Just Black

data PieceType = Pawn
    | Rook
    | Knight
    | Bishop
    | King
    | Queen deriving (Eq)

data PieceOf = Piece PieceType Team | None deriving (Eq)

instance Show PieceOf where
    show (Piece t team)
        | t == Pawn = case' "p"
        | t == Rook = case' "r"
        | t == Knight = case' "n"
        | t == Bishop = case' "b"
        | t == King = case' "k"
        | otherwise = case' "q"
        where case' = caseFromTeam team
    show None = "0"

caseFromTeam :: Team -> String -> String
caseFromTeam White = map toUpper
caseFromTeam Black = map toLower

type Board = [[PieceOf]]
type MoveBoard = [[Bool]]
type Point = (Int, Int)