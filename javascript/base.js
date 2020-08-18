const getUnitVector = (i1, j1) => (i2, j2) => {
    const magnitude = Math.sqrt(Math.pow(i2 - i1, 2) + Math.pow(j2 - j1, 2))
    return [Math.round((i2 - i1) / magnitude), Math.round((j2 - j1) / magnitude)]
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
const replace2d = (i, j) => x => mat => Object.assign([], mat, { [i]: replace(mat[i])(j)(x) })

const replaceBetween = (i1, j1) => (i2, j2) => x => mat => {
    if(pointEq({i: i1, j: j1})({i: i2, j: j2})) return mat

    const v = getUnitVector(i1, j1)(i2, j2)
    return replaceBetween(i1 + v[0], j1 + v[1])(i2, j2)(x)(replace2d(i1, j1)(x)(mat))
}

const pipeLog = (x, ...y) => (console.log(x, ...y), x)
const andLog = (x, ...y) => (console.log(x, ...y), true)

module.exports = {
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