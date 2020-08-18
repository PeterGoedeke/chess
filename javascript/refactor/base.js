const differentAndExists = x => y => x && y && x !== y

const getUnitVector = s => e => {
    const magnitude = Math.sqrt(Math.pow(e.i - s.i, 2) + Math.pow(e.j - s.j, 2))
    return [Math.round((e.i - s.i) / magnitude), Math.round((e.j - s.j) / magnitude)]
}
const pointEq = p1 => p2 => p1.i == p2.i && p1.j == p2.j
const pointDistance = p1 => p2 => Math.sqrt(Math.pow(p1.i - p2.i, 2) + Math.pow(p1.j - p2.j, 2))
const scalarDirection = x => !x
    ? false
    : x > 0
        ? 1
        : -1

const merge = o1 => o2 => Object.assign({}, o1, o2)
const prop = k => o => o[k]
const invProp = k => o => !o[k]
const pipe = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const objOf = k => v => ({ [k]: v })
const spec = o => x => Object.keys(o)
  .map(k => objOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o))

const atMatrixEnd = (i, j) => mat => i == mat.length && mat[0] && mat[0].length == j
const replace = arr => i => x => Object.assign([], arr, { [i]: x })
const replace2d = p => x => mat => Object.assign([], mat, { [p.i]: replace(mat[p.i])(p.j)(x) })

const replaceBetween = s => e => x => mat => {
    if(pointEq(s)(e)) return mat

    const v = getUnitVector(s)(e)
    return replaceBetween(i1 + v[0], j1 + v[1])(e)(x)(replace2d(s)(x)(mat))
}

const pipeLog = (x, ...y) => (console.log(x, ...y), x)
const andLog = (x, ...y) => (console.log(x, ...y), true)

module.exports = {
    differentAndExists,
    getUnitVector,
    pointEq,
    pointDistance,
    scalarDirection,
    
    merge,
    prop,
    invProp,
    pipe,
    objOf,
    spec,

    atMatrixEnd,
    replace,
    replace2d,
    replaceBetween,

    pipeLog,
    andLog
}