import Types
import Board
import Pieces

import Data.Char
test = map (map (\(a,b) -> if a `mod` 2 == 0 then toUpper b else b) . (zip [1..])) . words

convertToFunky :: [Char] -> [Char]
convertToFunky (x:y:xs) = x : toUpper y : convertToFunky xs
convertToFunky [x] = [x]
convertToFunky [] = []

main = do
    print $ kingFind initialBoard White