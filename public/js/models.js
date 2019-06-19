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

function score(prediction){
    var count = 0
    for(var i = 0; i < prediction.target.length; i++){
        if(prediction.target[i] == prediction.predicted[i]){
            count++
        }
    }
    //console.log(count/prediction.target.length)
    return count/prediction.target.length
}

function confusionMatrix(prediction){
    var classes = distinctVals(prediction.target)
    var confMat = {classes: classes, matrix: math.zeros(classes.length, classes.length)}
    var tempMat = {}
    
    for(var i = 0; i < prediction.target.length; i++){
        if(tempMat[prediction.target[i] + '_' + prediction.predicted[i]]){
            tempMat[prediction.target[i] + '_' + prediction.predicted[i]]++
        }
        else{
            tempMat[prediction.target[i] + '_' + prediction.predicted[i]] = 1
        }
    }

    //console.log(tempMat)
    for(var i = 0; i < classes.length; i++){
        for(var j = 0; j < classes.length; j++){
            if(tempMat[classes[i] + '_' + classes[j]]){
                confMat.matrix._data[i][j] = tempMat[classes[i] + '_' + classes[j]]
            }
            else{
                confMat.matrix._data[i][j] = 0
            }
        }
    }

    //console.log(confMat)
    return confMat
}

function showScore(confMat){

    var score = calculateScores(confMat)

    var table = createElement('table', {className: 'table table-bordered'})
    var thead = createElement('thead')
    var tbody = createElement('tbody')

    //Setting heads
    var head_row = createElement('tr')
    head_row.appendChild(createElement('th', {scope: 'col', innerText: 'Actual\\Predicted'}))
    for(var i = 0; i < confMat.classes.length; i++){
        head_row.appendChild(createElement('th', {scope: 'col', innerText: confMat.classes[i]}))
    }
    thead.appendChild(head_row)
    table.appendChild(thead)

    //Setting rows
    for(var i = 0; i < confMat.classes.length; i++){
        var body_row = createElement('tr')
        body_row.appendChild(createElement('td', {scope: 'row', innerText: confMat.classes[i]}))
        for(var j = 0; j < confMat.classes.length; j++){
            if(i == j){
                var td = createElement('td', {innerText: confMat.matrix._data[i][j], style: 'background-color: green; color: white;'})
                $(td).attr('data-toggle', 'popover')
                $(td).attr('title', 'Class Score')
                var scoreStr = "Accuracy: " + Math.round(10000 * score.classes[i].a)/100 + "%\nPrecision: " + Math.round(10000 * score.classes[i].p)/100 + "%\nRecall: " + Math.round(10000 * score.classes[i].r)/100 + "%\nSpecificity: " + Math.round(10000 * score.classes[i].s)/100 + "%\nF-score: " + Math.round(10000 * score.classes[i].F)/100 + "%"
                $(td).attr('data-content', scoreStr)
                body_row.appendChild(td)
            }
            else {
                body_row.appendChild(createElement('td', {innerText: confMat.matrix._data[i][j], style: 'background-color: red; color: white;'}))
            }
        }
        tbody.appendChild(body_row)
    }
    table.appendChild(tbody)

    var row = createElement('div', {className: 'row', style: 'width: 100%;'})
    charts.prepend(row)
    var chart = createElement('div', {id: "chart" + chartNumber, className: 'chart'})
    row.appendChild(chart)
    chart.appendChild(table)

    var scoreStr = "<b>Accuracy: " + Math.round(10000 * score.totalScore.a)/100 + "%</br>Precision: " + Math.round(10000 * score.totalScore.p)/100 + "%</br>Recall: " + Math.round(10000 * score.totalScore.r)/100 + "%</br>Specificity: " + Math.round(10000 * score.totalScore.s)/100 + "%</br>F-score: " + Math.round(10000 * score.totalScore.F)/100 + "%</b>"
    var totalScore = createElement('p', {innerHTML: scoreStr})
    chart.appendChild(totalScore)

    row.appendChild(createElement('button', {type: 'button', className: 'close remove-chart', innerHTML: "&times;", style: 'height: 10px;'}))
    $('.remove-chart').click(function(){
        if(this && this.previousSibling){
            this.previousSibling.remove()
            this.remove()
        }
    })

    $(function () {
        $('[data-toggle="popover"]').popover()
    })

    chartNumber++
}

function calculateScores(confMat){
    var mat = confMat.matrix._data
    var tpc = []
    var tnc = []
    var fpc = []
    var fnc = []

    for(var i = 0; i < mat.length; i++){
        var tp = mat[i][i]
        var tn = 0
        for(var j = 0; j < mat.length; j++){
            if(j != i){
                tn += mat[j][j]
            }
        }
        var fp = 0
        for(var j = 0; j < mat.length; j++){
            if(j != i){
                fp += mat[j][i]
            }
        }
        var fn = 0
        for(var j = 0; j < mat.length; j++){
            if(j != i){
                fp += mat[i][j]
            }
        }
        tpc.push(tp)
        tnc.push(tn)
        fpc.push(fp)
        fnc.push(fn)
    }

    var total = 0
    for(var i = 0; i < mat.length; i++){
        total += innerSum(mat[i])
    }
    var tp_tn = 0
    for(var i = 0; i < mat.length; i++){
        tp_tn += mat[i][i]
    }
    var sum_fp = innerSum(fpc)
    var sum_fn = innerSum(fnc)

    var score = {totalScore: {a: 0, p: 0, r: 0, s: 0, F: 0}, classes: []}
    score.totalScore.a = accuracy(total, tp_tn)
    score.totalScore.p = precision(tp_tn, sum_fp)
    score.totalScore.r = recall(tp_tn, sum_fn)
    score.totalScore.s = specifity(tp_tn, sum_fp)
    score.totalScore.F = fScore(tp_tn, sum_fp, sum_fn)

    for(var i = 0; i < mat.length; i++){
        var sc = {a: 0, p: 0, r: 0, s: 0, F: 0}
        sc.a = accuracy(tpc[i] + tnc[i] + fpc[i] + fnc[i], tpc[i] + tnc[i])
        sc.p = precision(tpc[i], fpc[i])
        sc.r = recall(tpc[i], fnc[i])
        sc.s = specifity(tnc[i], fpc[i])
        sc.F = fScore(tpc[i], fpc[i], fnc[i])
        score.classes.push(sc)
    }

    return score
}

function accuracy(total, trues){
    return trues/total
}

function precision(tp, fp){
    return tp/(tp + fp)
}

function recall(tp, fn){
    return tp/(tp + fn)
}

function specifity(tn, fp){
    return tn/(fp + tn)
}

function fScore(tp, fp, fn){
    return 2*tp/(2*tp + fp + fn)
}