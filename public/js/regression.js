document.getElementById('regression').onclick = function(){
    var modalBody = document.getElementById('regression-modal-body')
    modalBody.innerHTML = ""
    $('#regression-modal').modal('show')

    var cols = getSelectedCols()

    var predict = createElement('div', {className: 'row', style: 'margin: 10px auto;'})
    predict.appendChild(createElement('p', {innerText: "Predict: ", className: 'col-sm-4'}))
    var selectPredict = createElement('select', {id: 'regression-modal-predict', className: 'col-sm-8'})
    for(var i = 0; i < cols.length; i++){
        selectPredict.appendChild(createElement('option', {value: cols[i], innerText: cols[i]}))
    }
    predict.appendChild(selectPredict)
    modalBody.appendChild(predict)

    var regType = createElement('div', {className: 'row', style: 'margin: 10px auto;'})
    regType.appendChild(createElement('p', {innerText: "Regression type: ", className: 'col-sm-4'}))
    var selectRegType = createElement('select', {id: 'regression-modal-regtype', className: 'col-sm-8'})
    var regTypes = ['Linear Regression']
    for(var i = 0; i < regTypes.length; i++){
        selectRegType.appendChild(createElement('option', {value: regTypes[i], innerText: regTypes[i]}))
    }
    regType.appendChild(selectRegType)
    modalBody.appendChild(regType)
}

document.getElementById('regression-modal-submit').onclick = function(){
    var predict = document.getElementById('regression-modal-predict').value
    var regType = document.getElementById('regression-modal-regtype').value

    var cols = getSelectedCols()
    cols.splice( cols.indexOf(predict), 1 );

    if(cols.length == 1){
        if(regType == 'Linear Regression'){

            var [X_train, X_test] = trainTestSplit(df)

            var coef = lineerReg(X_train[cols[0]].data, X_train[predict].data)

            var results = {target: X_test[predict].data.slice(), predicted: []}
            var result
            for(var i = 0; i < X_test.length; i++){
                var record = getRow(X_test, i)
                result = regPredict(coef, X_test[cols[0]].data[i])
                results.predicted.push(result)
            }
            console.log(results)

            var labels = [cols[0] + ' - ' + predict, 'Regression']
            lineChart([results.target, results.predicted], X_test[cols[0]].data, labels, ['scatter'], ['markers', 'lines'])
            
            var score = getRSquared(regPredict, results.target, X_test[cols[0]].data, coef)
            var scoreStr = ''
            for(var i in score){
                scoreStr += i + ': ' + score[i] + '</br>'
            }
            alertModal(scoreStr, 'success')
        }
    }
}

function regPredict(x, coef){
    return coef.a + coef.b * x
}

function lineerRegression(X, Y){
    //getting coefficients ...
    coef = lineerReg(X, Y)

    // getting regression line ...
    regression = []
    for(i in X){
        regression.push()
    }

    return {coefficients: coef, regression: regression}
}

// function for calculate slope and intercept ...
function lineerReg(X, Y){
    if(X.length == Y.length){
        var N = X.length
        // finding XY, X^2 ...
        var XY = outerProduct(X, Y)
        var XSq = outerProduct(X, X)

        // finding ΣX, ΣY, ΣXY, ΣX^2 ...
        var sumX = innerSum(X)
        var sumY = innerSum(Y)
        var sumXY = innerSum(XY)
        var sumXSq = innerSum(XSq)

        // substitute in the above slope formula given: Slope(b) = (NΣXY - (ΣX)(ΣY)) / (NΣX^2 - (ΣX)^2) ...
        var b = (N * sumXY - sumX * sumY) / (N * sumXSq - Math.pow(sumX, 2))

        // now, again substitute in the above intercept formula given: intercept(a) = (ΣY - b(ΣX)) / N ...
        var a = (sumY - b * sumX) / N
        
        return {a: a, b: b}
    }
    else {
        console.log("The lengths of X and Y doesnt match!") 
    }

}

function getRSquared(predict, target, data, coef) {
    var rPrediction = [];

    var meanValue = innerSum(target)/target.length // MEAN VALUE
    var SStot = 0; // THE TOTAL SUM OF THE SQUARES
    var SSres = 0; // RESIDUAL SUM OF SQUARES
    var rSquared = 0;
    
    for (var n = 0; n < data.length; n++) { 
        // CALCULATE THE SSTOTAL    
        SStot += Math.pow(target[n] - meanValue, 2); 
        // REGRESSION PREDICTION
        rPrediction.push(predict(data[n], coef));
        // CALCULATE THE SSRES
        SSres += Math.pow(rPrediction[n] - target[n], 2);
    }

    // R SQUARED
    rSquared = 1 - (SSres / SStot);

    return {
        meanValue: meanValue,
        SStot: SStot,
        SSres: SSres,
        rSquared: rSquared
    };
}