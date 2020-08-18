module Pieces where

import Types
import Board

import Data.List

getRookPossible :: Point -> [Point]
getRookPossible (x,y) = sortBy (closestTo (x,y)) [(i,j) | i <- [1..8], j <- [1..8], i == x || j == y]


-- getRookActual :: Board -> Point -> [Point]
-- getRookActual board from = let possibles = getRookPossible from in
--     filter (\to -> getCloserPointTo from to `elem` possibles) possibles

-- rookMoveValid :: Board -> Point -> Point -> Bool
-- rookMoveValid board from to = 

-- the closer one needs to be in the array and the index of the board at the closer one needs to be empty and the index at the new one needs to be empty or the opposing team

getRookActual :: Board -> Point -> [Point] -> [Point] -> [Point]
getRookActual board from acc (x:xs)
    | squareIsEmpty board (getCloserPointTo from x) = getRookActual board from (x : acc) xs
    | otherwise = getRookActual board from acc xs
getRookActual board from acc [] = acc

getRookActual' = getRookActual initialBoard (3,3) [] (getRookPossible (3,3))

-- >>> getRookPossible (3, 3)
-- [(3,3),(2,3),(3,2),(3,4),(4,3),(1,3),(3,1),(3,5),(5,3),(3,6),(6,3),(3,7),(7,3),(3,8),(8,3)]

-- >>> import Data.List
-- >>> groupBy (equalDistance (3, 3)) $ getRookPossible (3, 3)
-- [[(3,3)],[(2,3),(3,2),(3,4),(4,3)],[(1,3),(3,1),(3,5),(5,3)],[(3,6),(6,3)],[(3,7),(7,3)],[(3,8),(8,3)]]
--

getCloserPointTo :: Point -> Point -> Point
getCloserPointTo (x,y) (a,b)
    | x == a && y == b = (x,y)
    | x == a = (a, b + unit y b)
    | y == b = (a + unit x a, b)
    | otherwise = error "Called in non-rectangular manner"

unit :: Int -> Int -> Int
unit x y = round $ fromIntegral (x - y) / (fromIntegral $ abs (x - y))

closestTo :: Point -> Point -> Point -> Ordering
closestTo (x,y) (a,b) (c,d)
    | firstDistance < secondDistance = LT
    | firstDistance > secondDistance = GT
    | otherwise = EQ
    where
        firstDistance  = (x - a)^2 + (x - b)^2
        secondDistance = (x - c)^2 + (x - d)^2

equalDistance :: Point -> Point -> Point -> Bool
equalDistance p1 p2 p3 = closestTo p1 p2 p3 == EQ

-- pawnMoves board point = map (map $ pawnAttacksSquare board point)


-- checkForwardTiles :: Board -> Point -> Int -> MoveBoard -> MoveBoard
-- checkForwardTiles board (x,y) dir
--     | squareIsEmpty board (x,y+1) = 

-- teamInCheck