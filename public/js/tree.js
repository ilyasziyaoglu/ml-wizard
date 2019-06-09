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
        console.log('tree', t)
        
        var record = {}
        var results = []
        var result
        for(var i = 0; i < X_test.length; i++){
            for(var j in effectedCols){
                record[effectedCols[j]] = X_test[effectedCols[j]].data[i]
            }
            result = await treePredict(X_train, record)
            await results.push([X_test[predict].data[i], result])
        }
        console.log(results)

        var sayi = 0
        for(var a in results){
            if(results[a][0] == results[a][0]){
                sayi++
            }
        }
        console.log(sayi)
    }
}

function treePredict(root, record){
    if(root.branches){
        treePredict(root.branches[record[root.name]])
    }
    else {
        return root
    }
}

function tree(df, cols, predict, tolerance, deepest){
    var predictValues = distinctVals(df[predict].data)
    var len = df.length
    var n = predictValues.length

    if(deepest && n > 1){
        var P = {}
        for(var i in predictValues){
            P[predictValues[i]] = count(df[predict].data, predictValues[i]) / len
        }
    
        var gaindf = entropy(P)
    
        var maxgain = {val: 0}
        var tempgain
        for(var i in cols){
            tempgain = gaindf - info(df[cols[i]].data, df[predict].data, predictValues)
            //console.log(cols[i], ': ', tempgain)
            if(tempgain > maxgain.val){
                maxgain.val = tempgain
                maxgain.col = cols[i]
            }
        }

        var root = {name: maxgain.col, branches: {}}
    
        var distinctValues = distinctVals(df[maxgain.col].data)
        for(var i in distinctValues){
            //console.log('\n', distinctValues[i])
            root.branches[distinctValues[i]] = tree(filter(df, [maxgain.col], [distinctValues[i]]), cols, predict, tolerance, deepest-1)
        }
        //console.log(root)
        return root
    }
    else{
        if(n == 1){
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

function entropy(P){
    var ent = 0 //entropy
    for(var i in P){
        ent -= P[i] * Math.log2(P[i])
    }
    return ent
}

function info(arr, predictArr, predictValues){
    var distinctValues = distinctVals(arr)
    var n = predictValues.length
    var len = arr.length
    var gain = 0

    var count = {}
    for(var i in arr){
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

    var info
    for(var i in distinctValues){
        info = 0
        for(var j in predictValues){
            if(count[distinctValues[i] + '-' + predictValues[j]]){
                info -= (count[distinctValues[i] + '-' + predictValues[j]]/count[distinctValues[i]]) * Math.log2(count[distinctValues[i] + '-' + predictValues[j]]/count[distinctValues[i]])
            }
        }
        gain += (count[distinctValues[i]]/len) * info
    }
    return gain
}