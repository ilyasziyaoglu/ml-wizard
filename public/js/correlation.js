document.getElementById('correlation').onclick = function(){
    var cols = getSelectedCols()

    var corrMatrix = []
    for(var i in cols){
        corrMatrix.push([])
        for(var j in cols){
            corrMatrix[i].push(correlation(df[cols[i]].data, df[cols[j]].data))
        }
    }

    cmap(corrMatrix, cols, cols)
}

// correltion function ...
function correlation(X, Y){
    if(X.length == Y.length){
        // preparing to calculating ...
        var N = X.length

        var sumX = innerSum(X)
        var sumY = innerSum(Y)
        var XSq = outerProduct(X, X)
        var YSq = outerProduct(Y, Y)
        var XY = outerProduct(X, Y)
        var sumXY = innerSum(XY)
        var sumXSq = innerSum(XSq)
        var sumYSq = innerSum(YSq)
        
        // calculating correlation ...
        var corr = (N * sumXY - (sumX * sumY)) / Math.sqrt((N * sumXSq - Math.pow(sumX, 2)) * (N * sumYSq - Math.pow(sumY, 2)))
        return corr
    }
    else {
        console.log("The lengths of X and Y doesnt match!")
    }
}
