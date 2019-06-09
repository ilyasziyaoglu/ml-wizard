function trainTestSplit(df, testSize=0.33){
    var sA = shuffle(range(df.length)) //shuffledArray
    var matrix = df2matrix(df)
    var newmatrix = math.zeros(0,0)
    newmatrix._size[0] = df.length
    newmatrix._size[1] = df.headers.length
    for(var i in sA){
        newmatrix._data.push(matrix._data[sA[i]].slice())
    }
    var splitter = Math.floor(testSize*df.length)
    var X_train = matrix2df(math.matrix(newmatrix._data.slice(splitter, df.length)), df.headers, df.template)
    var X_test = matrix2df(math.matrix(newmatrix._data.slice(0, splitter)), df.headers, df.template)
    return [X_train, X_test]
}

function shuffleDf(df){
    var sA = shuffle(range(df.length)) //shuffledArray
    var matrix = df2matrix(df)
    var newmatrix = math.zeros(0,0)
    newmatrix._size[0] = df.length
    newmatrix._size[1] = df.headers.length
    for(var i in sA){
        newmatrix.data.push(matrix._data[sA[i]].slice())
    }
    return matrix2df(newmatrix, df.headers)
}