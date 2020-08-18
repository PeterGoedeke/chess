import Data.List
import System.IO

streamThing :: Int -> [Int] -> Int
streamThing = (sum .) . takeWhile . flip (<)

streamThing2 :: Int -> [Int] -> Int
streamThing2 limit = foldl1 (\acc x -> let val = acc + x in (if val <= limit then val else acc))

streamThing3 (x:xs) acc limit
    | acc + x <= limit = streamThing3 xs (acc + x) limit
    | otherwise = acc
streamThing3 [] acc limit = acc