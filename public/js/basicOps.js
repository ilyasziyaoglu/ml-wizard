function min(arr){
    if(arr[0] != undefined && typeof(arr[0]) == "number"){
        var min = {val: Infinity}
        for(var i = 0; i < arr.length; i++){
            if(arr[i] < min.val){
                min.val = arr[i]
                min.index = i
            }
        }
        return min
    }
    else {
        return undefined
    }
}

function max(arr){
    if(arr[0]!= undefined && typeof(arr[0]) == "number"){
        var max = {val: -Infinity}
        for(var i = 0; i < arr.length; i++){
            if(arr[i] > max.val){
                max.val = arr[i]
                max.index = i
            }
        }
        return max
    }
    else {
        return undefined
    }
}

function count(arr, val){
    var count = 0
    for(var i = 0; i < arr.length; i++){
        if(arr[i] === val){
            count++
        }
    }
    return count
}

function distinctVals(arr){
    var distincts = []
    for(var i in arr){
        if(!distincts.includes(arr[i])){
            distincts.push(arr[i])
        }
    }
    return distincts
}

function getIndexes(arr, val){
    var indexes = []
    for(var i = 0; i < arr.length; i++){
        if(arr[i] === val){
            indexes.push(i)
        }
    }
    return indexes
}

function getRow(df, index){
    var row = {}
    for(var i in df.headers){
        row[df.headers[i]] = df[df.headers[i]].data[index]
    }
    return row
}

function deleteCols(df, cols){
    for(var i in cols){
        delete df[cols[i]]
        df.headers.splice(getIndexes(df.headers, cols[i])[0], 1)
    }
    setTable(df)
}

function deleteRows(df, rows){
    for(var i in rows){
        for(var j in df.headers){
            df[df.headers[j]].data.splice(rows[i], 1)
        }
        df.length--
    }
    setTable(df)
}

function nominalDisSim(df, col){
    df[col].disSim = []
    for(var i = 0; i < df.length; i++){
        df[col].disSim.push([])
        for(var j = 0; j < i; j++){
            if(df[col].data[i] == df[col].data[j]){
                df[col].disSim[i].push(0)
            }
            else {
                df[col].disSim[i].push(1)
            }
        }
    }
}

function numericDisSim(df, col){
    df[col].disSim = []
    for(var i = 0; i < df.length; i++){
        df[col].disSim.push([])
        for(var j = 0; j < i; j++){
            df[col].disSim[i].push(Math.abs(df[col].data[i] - df[col].data[j]))
        }
    }
}

function euclideanDistance(obj1, obj2){
    var sum = 0
    for(var i in obj1){
        sum += Math.pow(obj1[i] - obj2[i], 2)
    }
    return Math.sqrt(sum)
}

function euclideanDisSim(df){
    df.numeric = []
    for(var i = 0; i < df.length; i++){
        df.numeric.push([])
        for(var j = 0; j < i; j++){
            var rowj = getRow(df, j)
            var rowi = getRow(df, i)
            var tempLength = df.headers.length
            for(var k = 0; k < tempLength; k++){
                if(!df.types.numeric.includes(df.headers[k])){
                    delete rowi[df.headers[k]]
                    delete rowj[df.headers[k]]
                }
            }
            df.numeric[i].push(euclideanDistance(rowj, rowi))
        }
    }
}

function disSim(df, cols){
    df.disSim = []
    for(var i = 0; i < df.length; i++){
        df.disSim.push([])
        for(var j = 0; j < i; j++){
            var d = 0
            for(var k = 0; k < cols.length; k++){
                d += df[cols[k]].disSim[i][j]
            }
            df.disSim[i].push(d/cols.length)
        }
        df.disSim[i].push(0)
    }
}

function sort(df, col, direction){
    var temp
    if(direction == 'asc'){
        for(var i = 1; i < df.length; i++){
            var state = 1
            for(var j = 0; j < df.length-1; j++){
                if(df[col].data[j] > df[col].data[j+1]){
                    state = 0
                    for(var k = 0; k < df.headers.length; k++){
                        temp = df[df.headers[k]].data[j]
                        df[df.headers[k]].data[j] = df[df.headers[k]].data[j+1]
                        df[df.headers[k]].data[j+1] = temp
                    }
                }
            }
            if(state){
                return df
            }
        }
    }
    else if(direction == 'desc'){
        for(var i = 1; i < df.length; i++){
            var state = 1
            for(var j = 0; j < df.length-1; j++){
                if(df[col].data[j] < df[col].data[j+1]){
                    state = 0
                    for(var k = 0; k < df.headers.length; k++){
                        temp = df[df.headers[k]].data[j]
                        df[df.headers[k]].data[j] = df[df.headers[k]].data[j+1]
                        df[df.headers[k]].data[j+1] = temp
                    }
                }
            }
            if(state){
                return df
            }
        }
    }
    return df
}

function innerProduct(arr){
    var product = 1
    for(var i = 0; i < arr.length; i++){
        if($.isNumeric(arr[i])){
            product *= arr[i]
        }
    }
    return product
}

function outerProduct(arr1, arr2){
    if(arr1.length == arr2.length){
        var product = []
        for(var i = 0; i < arr1.length; i++){
            product.push(arr1[i] * arr2[i])
        }
        return product
    }
    else {
        console.log("Array lengths are not equals!")
    }
}

function innerSum(arr){
    var sum = 0
    for(var i = 0; i < arr.length; i++){
        if($.isNumeric(arr[i])){
            sum += arr[i]
        }
    }
    return sum
}

function outerSum(arr1, arr2){
    if(arr1.length == arr2.length){
        var sum = []
        for(var i = 0; i < arr1.length; i++){
            sum.push(arr1[i] + arr2[i])
        }
        return sum
    }
    else {
        console.log("Array lengths are not equals!")
    }
}

function condProbab(X, Y, x, y){
    var xycount = 0, ycount = 0
    for(var i in Y){
        if(x == X[i] && y == Y[i]){
            xycount++
        }
        if(y == Y[i]){
            ycount++
        }
    }
    
    return (xycount / ycount)
}

function mode(arr){
    var values = {}
    for(var i = 0; i < arr.length; i++){
        if(arr[i] !== "" && arr[i] !== undefined){
            if(values[arr[i]]){
                values[arr[i]]++
            }
            else {
                values[arr[i]] = 1
            }
        }
    }

    var maxCnt = 0
    var maxVal
    for(var val in values){
        if(values[val] > maxCnt){
            maxCnt = values[val]
            maxVal = val
        }
    }
    return maxVal
}

function mean(arr){
    var sum = 0
    var count = 0
    for(var i  = 0; i < arr.length; i++){
        if(arr[i] != "" && arr[i] != undefined){
            sum += arr[i]
            count++
        }
    }
    return sum/count
}

function median(arr){
    var middle = Math.round((arr.length +  (arr.length-missingValCount(arr)))/2)
    return arr.slice().sort(function(a, b){return a - b})[middle]
}

function variance(arr){
    var meanVal = mean(arr)
    var sqrSum = 0
    for(var i in arr){
        if(arr[i] != "" && arr[i] != undefined){
            sqrSum += (arr[i] - meanVal)**2
        }
    }
    return sqrSum/(arr.length - missingValCount(arr))
}

function std(arr){
    return Math.sqrt(variance(arr))
}

function df2matrix(df, transpose=false){
    var cols = df.headers
    var dfMatrix

    if(transpose){
        dfMatrix = math.zeros(cols.length, df.length)
        for(var i in cols){
            for(var j = 0; j < df.length; j++){
                dfMatrix._data[i][j] = df[cols[i]].data[j]
            }
        }
    }
    else {
        dfMatrix = math.zeros(df.length, cols.length)
        for(var i = 0; i < df.length; i++){
            for(var j in cols){
                dfMatrix._data[i][j] = df[cols[j]].data[i]
            }
        }
    }
    return dfMatrix
}

function matrix2df(matrix, cols){
    var newdf = {types: {nominal: [], numeric: [], ordinal: []}}
    newdf.headers = cols
    newdf.length = matrix._size[0]

    for(var j in cols){
        newdf[cols[j]] = {data: [], type: undefined}
        for(var i = 0; i < matrix._size[0]; i++){
            newdf[cols[j]].data.push(matrix._data[i][j])
        }
    }
    return newdf
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};