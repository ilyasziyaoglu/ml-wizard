document.getElementById('decision-tree').onclick = function(){
    var [modal, modal_body, modal_submit] = createModal('decision-tree-modal', 'Decision Tree')

    var form  = createElement('form')

    var form_group_tolerance = createFormGroup('Tolerance')
    var tolerance_input = createElement('input', {type: 'number', value: 0.01, placeholder: 'Tolerance...', className: 'form-control'})
    form_group_tolerance.appendChild(tolerance_input)
    form.appendChild(form_group_tolerance)
    
    var form_group_predict_select = createFormGroup('Select predict feature')
    var predict_select = createElement('select', {type: 'number', className: 'form-control'})
    var cols = df.headers
    for(var i in cols){
        predict_select.appendChild(createElement('option', {value: cols[i], innerText: cols[i]}))
    }
    form.appendChild(form_group_predict_select)
    form_group_predict_select.appendChild(predict_select)


    modal_body.appendChild(form)
    $(modal).modal('show')

    modal_submit.onclick = async function(){
        $(modal).modal('hide')
        var tolerance = tolerance_input.value
        var predict = predict_select.value
        modal.remove()

        var cols = getSelectedCols()

        var uneffectedCols = []
        var effectedCols = []
        for(var i in cols){
            if((df[cols[i]].type == 'nominal' || df[cols[i]].type == 'ordinal') && cols[i] != predict){
                effectedCols.push(cols[i])
            }
            else {
                uneffectedCols.push(cols[i])
            }
        }
        if(uneffectedCols.length > 0){
            alert("Some features didn't effected! Because they may be target feature or their types are not nominal or ordinal .\nThese features are: " + uneffectedCols.toString())
        }

        var [X_train, X_test] = trainTestSplit(df)
        var deepest = distinctVals(df[predict].data).length
        var t = tree(X_train, effectedCols, predict, tolerance, deepest)
        //console.log('tree', t)
        
        var results = {target: X_test[predict].data.slice(), predicted: []}
        var result
        for(var i = 0; i < X_test.length; i++){
            var record = getRow(X_test, i)
            result = treePredict(t, record)
            results.predicted.push(result)
        }
        //console.log(results)
        
        var confMat = confusionMatrix(results)
        showScore(confMat)
    }
}

function treePredict(root, record){
    //console.log(root, record)
    if(root.branches){
        return treePredict(root.branches[record[root.name]], record)
    }
    else {
        return root
    }
}

function tree(df, cols, predict, deepest){
    var predictValues = distinctVals(df[predict].data)
    var n_classes = predictValues.length

    if(deepest > 0 && n_classes > 1 && cols.length > 0){
    
        var entropy_S = systemEntropy(df[predict].data, predictValues)
    
        var maxgain = {val: 0}
        var tempgain
        for(var i = 0; i < cols.length; i++){
            tempgain = entropy_S - gain(df[cols[i]].data, df[predict].data, predictValues)
            //console.log(cols[i], ': ', tempgain)
            if(tempgain > maxgain.val){
                maxgain.val = tempgain
                maxgain.col = cols[i]
            }
        }

        var root = {name: maxgain.col, branches: {}}
        cols.splice(cols.indexOf(maxgain.val), 1)
        var distinctValues = distinctVals(df[maxgain.col].data)
        for(var i = 0; i < distinctValues.length; i++){
            //console.log('\n', distinctValues[i])
            root.branches[distinctValues[i]] = tree(filter(df, [maxgain.col], [distinctValues[i]]), cols, predict, deepest-1)
        }
        //console.log(root)
        return root
    }
    else{
        if(n_classes == 1){
            return predictValues[0]
        }
        else{
            var max = 0, counta = 0, maxValue = ''
            for(var i in predictValues){
                counta = count(df[predict].data, predictValues[i])
                if(counta > max){
                    max = counta
                    maxValue = predictValues[i]
                }
            }
            return maxValue
        }
    }
}

function systemEntropy(predictArr, predictValues){
    //probablities
    var P = {}
    for(var i in predictValues){
        P[predictValues[i]] = count(predictArr, predictValues[i]) / predictArr.length
    }
    
    //entropy
    var ent = 0 
    for(var i in P){
        ent -= P[i] * Math.log2(P[i])
    }
    return ent
}

function gain(arr, predictArr, predictValues){

    var count = {}
    for(var i = 0; i < arr.length; i++){
        if(count[arr[i]]){
            count[arr[i]]++
        }
        else{
            count[arr[i]] = 1
        }

        if(count[arr[i] + '-' + predictArr[i]]){
            count[arr[i] + '-' + predictArr[i]]++
        }
        else{
            count[arr[i] + '-' + predictArr[i]] = 1
        }
    }

    //console.log(count)

    var distinctValues = distinctVals(arr)
    var gain = 0
    var info
    for(var i = 0; i < distinctValues.length; i++){
        info = 0
        for(var j = 0; j < predictValues.length; j++){
            if(count[distinctValues[i] + '-' + predictValues[j]]){
                var p = count[distinctValues[i] + '-' + predictValues[j]]/count[distinctValues[i]]
                info -= p * Math.log2(p)
            }
        }
        gain += (count[distinctValues[i]]/arr.length) * info
    }
    return gain
}