module Board where

import Types

import Data.List
import Data.Char
import Control.Bool
import System.Process

teamlessBackRow = [Piece Rook, Piece Knight, Piece Bishop, Piece Queen, Piece King, Piece Bishop, Piece Knight, Piece Rook]
teamlessPawnRow = replicate 8 (Piece Pawn)

initialBoard = transpose $ [map ($ White) teamlessBackRow, map ($ White) teamlessPawnRow]
    ++ (replicate 4 $ replicate 8 (None))
    ++ [map ($ Black) teamlessPawnRow, map ($ Black) teamlessBackRow]

showBoard :: Board -> String
-- merge the two maps
showBoard = unlines . map (intercalate " ") . map (map show)

codeAt :: Board -> Point -> PieceOf
codeAt board (x, y) = board !! x !! y

teamAt, teamNotAt :: Board -> Point -> Maybe Team
teamAt board point = case codeAt board point of
    Piece _ t -> Just t
    None -> Nothing

teamNotAt board point = teamAt board point >>= otherTeam
-- is there a nicer way to do this point free?
-- teamNotAt = flip flip otherTeam . ((>>=) .) . teamAt

squareIsPawn, squareIsEmpty :: Board -> Point -> Bool
squareIsPawn board point = case (codeAt board point) of
    Piece Pawn _ -> True
    _ -> False

squareIsEmpty board point = case codeAt board point of
    Piece _ _ -> False
    None -> True

-- teamAtIs :: Board -> Point -> Team -> Bool
-- teamAtIs board p team = case ((codeAt board p) t) of
--     White -> True
--     Black -> False

-- teamIs :: PieceOf -> Maybe a
teamIs, teamIsnt :: PieceOf -> Team -> Maybe Bool
teamIs (Piece _ t) team = Just $ t == team
teamIs (None) team = Nothing

teamIsnt p t = (pure not) <*> (teamIs p t)

pawnDirection :: (Num a) => PieceOf -> Maybe a
pawnDirection (Piece _ t) = Just (if t == White then 1 else -1)
pawnDirection (None) = Nothing

pawnStart :: (Num a) => Team -> a
pawnStart team = if team == White then 1 else 6

boardFind :: Board -> PieceOf -> [Point]
boardFind board piece = [(x,y) | (y,line) <- zip [0..] board, x <- elemIndices piece line]

kingFind :: Board -> Team -> Maybe Point
kingFind board team = case boardFind board (Piece King team) of
    x:xs -> Just x
    _ -> Nothing