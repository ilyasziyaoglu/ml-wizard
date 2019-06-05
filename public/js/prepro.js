document.getElementById("min-max-scaler").onclick = function(){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'numeric'){
            df[cols[i]].data = minMaxScaler(df[cols[i]].data, 0, 1)
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not numeric.\nThese features are: " + uneffectedCols.toString())
    }
    setTable(df)
}

function minMaxScaler(arr, nmin, nmax){
    omin = min(arr)
    omax = max(arr)
    var diff = omax.val - omin.val
    var c = (nmax - nmin)/diff
    if(nmin == 0 && nmax == 1){
        for(var i in arr){
            arr[i] = (arr[i] - omin.val)/diff
        }
    }
    else {
        for(var i in arr){
            arr[i] = c * (arr[i] - omin.val) + nmin
        }
    }
    return arr
}

function scale(val, omax, omin, nmin, nmax){
    return (nmax - nmin) * (val - omin) / (omax - omin) + nmin
}

document.getElementById('std-scaler').onclick = function(){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'numeric'){
            df[cols[i]].data = stdScaler(df[cols[i]].data)
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not numeric.\nThese features are: " + uneffectedCols.toString())
    }
    setTable(df)
}

function stdScaler(arr){
    var meanVal = mean(arr)
    var stdVal = std(arr)
    for(var i in arr){
        if(arr[i] != "" && arr[i] != undefined){
            arr[i] = (arr[i] - meanVal)/stdVal
        }
    }
    return arr
}

document.getElementById('nominal-encoder').onclick = function(){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'nominal'){
            df[cols[i]].labelEncoderMap = distinctVals(df[cols[i]].data)
            df[cols[i]].encodeType = 'nominal'
            df[cols[i]].type = 'numeric'
            df[cols[i]].data = labelEncoder(df[cols[i]].data, df[cols[i]].labelEncoderMap)
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not Nominal.\nThese features are: " + uneffectedCols.toString())
    }
    setTable(df)
}

document.getElementById("ordinal-encoder").onclick = function(){
    var modalBody = document.getElementById("ordinal-to-numeric-modal-body")
    modalBody.innerHTML = ""
    var modal = document.getElementById("ordinal-to-numeric-modal")
    $(modal).modal("show")

    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'ordinal'){
            modalBody.appendChild(createElement('p',{innerText: 'Set ordinal equivalents for ' + cols[i]}))
            var distincts = distinctVals(df[cols[i]].data)
            for(var j in distincts){
                var wrapper = createElement('div', {className: 'input-group mb-3'})
                modalBody.appendChild(wrapper)
                wrapper.appendChild(createElement('div',{className: 'input-group-prepend'}).appendChild(createElement('label', {innerText: j, className:'input-group-text'})))
                var select = createElement('select', {className: cols[i] + '-ordinal-encoder-modal-select'})
                wrapper.appendChild(select)
                for(var k in distincts){
                    select.appendChild(createElement('option', {value: distincts[k], innerText: distincts[k]}))
                }
            }
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not encoded numeric.\nThese features are: " + uneffectedCols.toString())
    }
}

document.getElementById("ordinal-encoder-modal-submit").onclick = function(){
    var cols = getSelectedCols()
    for(var i in cols){
        if(df[cols[i]].type == 'ordinal'){
            var selects = document.getElementsByClassName(cols[i] + '-ordinal-encoder-modal-select')
            df[cols[i]].labelEncoderMap = []
            for(var j = 0; j < selects.length; j++){
                df[cols[i]].labelEncoderMap.push(selects[j].value)
            }
            if(df[cols[i]].labelEncoderMap.length == distinctVals(df[cols[i]].labelEncoderMap).length){
                df[cols[i]].encodeType = 'ordinal'
                df[cols[i]].type = 'numeric'
                df[cols[i]].data = labelEncoder(df[cols[i]].data, df[cols[i]].labelEncoderMap)
            }
            else{
                alert("You must select different values for feature " + cols[i] + "!")
            }
        }
    }
    setTable(df)
}

document.getElementById('label-decoder').onclick = function(){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].labelEncoderMap){
            if(df[cols[i]].encodeType == 'nominal'){
                df[cols[i]].type = 'nominal'
            }
            else if(df[cols[i]].encodeType == 'ordinal'){
                df[cols[i]].type = 'ordinal'
            }
            df[cols[i]].data = labelDecoder(df[cols[i]].data, df[cols[i]].labelEncoderMap)
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not encoded numeric.\nThese features are: " + uneffectedCols.toString())
    }
    setTable(df)
}

function labelDecoder(arr, map){
    for(var i in arr){
        arr[i] = map[arr[i]]
    }
    return arr
}

function labelEncoder(arr, map){
    for(var i in arr){
        arr[i] = map.indexOf(arr[i])
    }
    return arr
}

document.getElementById('one-hot-encoder').onclick = function(){
    var cols = getSelectedCols()
    for(var i in cols){
        if(df[cols[i]].type == 'nominal' || df[cols[i]].type == 'ordinal'){
            df = oneHotEncoder(df, cols[i])
        }
    }
    setTable(df)
    setFeatureList(df.headers)
}

function oneHotEncoder(df, col){
    var distincts = distinctVals(df[col].data)
    for(var j in distincts){
        df[col + '-' + distincts[j]] = {data: [], type: 'numeric'}
        df.headers.push(col + '-' + distincts[j])
    }
    for(var j in df[col].data){
        for(var k in distincts){
            if(df[col].data[j] == distincts[k]){
                df[col + '-' + distincts[k]].data.push(1)
            }
            else{
                df[col + '-' + distincts[k]].data.push(0)
            }
        }
    }
    if(df[col]){
        deleteCols(df, [col])
    }
    return df
}

document.getElementById('categorization').onclick = function(){
    var [modal, modal_body, modal_submit] = createModal('categorization-modal', 'Categorization')
    var form  = createElement('form')
    var form_group = createElement('div', {className: 'form-group'})
    var category_count_label = createElement('label', {innerText: 'Enter category count:'})
    var category_count = createElement('input', {type: 'number', className: 'form-control', placeholder: 'Enter category count here...'})
    modal_body.appendChild(form)
    form.appendChild(form_group)
    form_group.appendChild(category_count_label)
    form_group.appendChild(category_count)
    $(modal).modal('show')

    modal_submit.onclick = function(){
        $(modal).modal('hide')
        var cat_count = category_count.value
        modal.remove()

        var cols = getSelectedCols()
        var uneffectedCols = []
        for(var i in cols){
            if(df[cols[i]].type == 'numeric'){
                df[cols[i]].data = categorization(df[cols[i]].data, cat_count)
                df[cols[i]].type = 'ordinal'
            }
            else {
                uneffectedCols.push(cols[i])
            }
        }
        if(uneffectedCols.length > 0){
            alert("Some features didn't effected! Because their types are not numeric.\nThese features are: " + uneffectedCols.toString())
        }
        setTable(df)
    }
}

function categorization(arr, category_count=10){
    var minVal = min(arr)
    var maxVal = max(arr)
    var labels = prepareLabels(minVal.val, maxVal.val, category_count)
    var arr = minMaxScaler(arr, 0, category_count)
    var categorizedArray = []

    for(var i in arr){
        if(arr[i] != category_count){
            categorizedArray.push(labels[Math.floor(arr[i])])
        }
        else {
            categorizedArray.push(labels[Math.floor(arr[i])-1])
        }
    }
    return categorizedArray
}

function prepareLabels(minVal, maxVal, category_count){
    var step = (maxVal - minVal)/category_count
    var labels = []
    while(minVal < maxVal){
        labels.push(Math.round(100*(minVal))/100 + '<=X<' + Math.round(100*(minVal + step))/100)
        minVal += step
    }
    return labels
}