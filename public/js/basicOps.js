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

function missingValCount(arr){
    var count = 0
    for(var i = 0; i < arr.length; i++){
        if(arr[i] === "" || arr[i] === undefined){
            count++
        }
    }
    return count
}

function distinctVals(arr){
    var distincts = []
    for(var i in arr){
        var temp = arr[i].trim()
        if(!distincts.includes(temp)){
            distincts.push(temp)
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

function binaryDisSim(df, col){
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

function euclideanDistance(obj1, obj2, weights){
    var sum = 0
    for(var i in obj1){
        sum += weights[i] * Math.pow(obj1[i] - obj2[i], 2)
    }
    return Math.sqrt(sum)
}

function euclideanDisSim(df){
    getWeights()
    df.numeric = []
    for(var i = 0; i < df.length; i++){
        df.numeric.push([])
        for(var j = 0; j < i; j++){
            var rowj = getRow(df, j)
            var rowi = getRow(df, i)
            var tempLength = df.headers.length
            var weights = []
            for(var k = 0; k < tempLength; k++){
                if(!df.types.numeric.includes(df.headers[k])){
                    delete rowi[df.headers[k]]
                    delete rowj[df.headers[k]]
                }
                else{
                    weights.push(df.weights[df.headers[k]])
                }
            }
            df.numeric[i].push(euclideanDistance(rowj, rowi, weights))
        }
    }
}

function disSim(df, cols){
    getWeights()
    df.disSim = []
    for(var i = 0; i < df.length; i++){
        df.disSim.push([])
        for(var j = 0; j < i; j++){
            var d = 0
            var sumOfSigma = 0
            for(var k = 0; k < cols.length; k++){
                var sigma = undefined
                if(df[cols[k]].type == 'asimbinary' && df[cols[k]].data[i] == 0 && df[cols[k]].data[j] == 0){
                    sigma = 0
                }
                else {
                    sigma = 1
                }
                d += df.weights[cols[k]] * sigma * df[cols[k]].disSim[i][j]
                sumOfSigma += sigma
            }
            df.disSim[i].push(d/sumOfSigma)
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