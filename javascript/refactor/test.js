const arr = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
]
const m = 3

const list = []

const dotterProto = {
    dot() {
        list.push(`(${this.x},${this.y})`)
        // arr[this.x][this.y] = `(${this.x},${this.y})`
        this.x += this.dx
        this.y += this.dy
    },
    dots(n) {
        for(let i = 0; i < n; i++) {
            this.dot()
        }
    },
    startCycle() {
        list.push(`(${this.x},${this.y})`)
        this.y --
        this.turn()
    },
    turn() {
        this.direction ++
        this.dx = this.directions[this.direction % 4][0]
        this.dy = this.directions[this.direction % 4][1]
    }
}
function createDotter() {
    const dotter = Object.create(dotterProto)
    dotter.val = 1
    dotter.x = m
    dotter.y = m
    dotter.dx = 0
    dotter.dy = 0
    dotter.direction = -1
    dotter.directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    return dotter
}

const printArr = x => x.map(y => y.map(z => z < 10 ? z + ' ' : z + '')).map(y => y.join(' ')).join('\n')
arr[1][5] = 5


const dotter = createDotter()

function generateSpiral(cycles) {
    for(let i = 0; i < cycles; i++) {
        addCycle(i)
    }
}

generateSpiral(4)
console.log(printArr(arr))
console.log(list)
// addCycle(3)

function addCycle(cycleNumber) {
    const size = cycleNumber * 2 - 1

    const cycleStart = m - cycleNumber - 1
    // if cycle is 1, then hit the cycle start point
    // go out one to the left of the start, go up by size, go right by size + 1, go down by size + 1, go left by size + 1
    if(cycleNumber == 0) {
        dotter.dot()
        return
    }
    dotter.startCycle()
    dotter.dots(size)
    dotter.turn()
    dotter.dots(size + 1)
    dotter.turn()
    dotter.dots(size + 1)
    dotter.turn()
    dotter.dots(size + 1)
}

// try and do something with the hypotenuse?