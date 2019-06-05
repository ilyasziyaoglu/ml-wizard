var misVals = createElement('tr')

document.getElementById('mis-val-count').onclick = function(){
    body.prepend(misVals)
    showMissValCounts()
}

document.getElementById('nan-novalue').onclick = async function(){
    await fillNanNoValue(df)
    await setTable(df)
    await showMissValCounts()
}

document.getElementById('nan-mode').onclick = async function(){
    await fillNanMode(df)
    await setTable(df)
    await showMissValCounts()
}

document.getElementById('nan-mean').onclick = async function(){
    await fillNanMean(df)
    await setTable(df)
    await showMissValCounts()
}

document.getElementById('nan-median').onclick = async function(){
    await fillNanMedian(df)
    await setTable(df)
    await showMissValCounts()
}

document.getElementById('nan-number-form').onsubmit = async function(e){
    e.preventDefault(); 
    await fillNanNumber(df, document.getElementById('nan-number').value)
    await setTable(df)
    await showMissValCounts()
}

document.getElementById('nan-text-form').onsubmit = async function(e){
    e.preventDefault(); 
    await fillNanText(df, document.getElementById('nan-text').value)
    await setTable(df)
    await showMissValCounts()
}

function showMissValCounts(){
    misVals.innerHTML = ""
    var cols = df.headers
    misVals.appendChild(createElement('th', {scope: 'row', innerText: 'Missing Value Counts:'}))
    for(var j = 0; j < cols.length; j++){
        var count = missingValCount(df[cols[j]].data)
        misVals.appendChild(createElement('td', {innerText: 'Missing: ' + count + ' / ' + df.length}))
    }
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

function fillNanNoValue(df){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'nominal' || df[cols[i]].type == 'ordinal' || df[cols[i]].type == 'simbinary' || df[cols[i]].type == 'asimbinary' || df[cols[i]].type == undefined){
            for(var j = 0; j < df.length; j++){
                if(df[cols[i]].data[j] === "" || df[cols[i]].data[j] === undefined){
                    df[cols[i]].data[j] = 'NoValue'
                }
            }
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types(integer) are not supported.\nThese features are: " + uneffectedCols.toString())
    }
}

async function fillNanMode(df){
    var cols = getSelectedCols()
    for(var i in cols){
        var modeVal = await mode(df[cols[i]].data)
        for(var j = 0; j < df.length; j++){
            if(df[cols[i]].data[j] === "" || df[cols[i]].data[j] === undefined){
                df[cols[i]].data[j] = modeVal
            }
        }
    }
}

function fillNanMean(df){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'numeric'){
            var meanVal = mean(df[cols[i]].data)
            for(var j = 0; j < df.length; j++){
                if(df[cols[i]].data[j] === "" || df[cols[i]].data[j] === undefined){
                    df[cols[i]].data[j] = meanVal
                }
            }
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not numeric.\nThese features are: " + uneffectedCols.toString())
    }
}

function fillNanMedian(df){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'numeric'){
            var medianVal = median(df[cols[i]].data)
            for(var j = 0; j < df.length; j++){
                if(df[cols[i]].data[j] === "" || df[cols[i]].data[j] === undefined){
                    df[cols[i]].data[j] = medianVal
                }
            }
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not numeric.\nThese features are: " + uneffectedCols.toString())
    }
}

function fillNanNumber(df, num){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'numeric'){
            for(var j = 0; j < df.length; j++){
                if(df[cols[i]].data[j] === "" || df[cols[i]].data[j] === undefined){
                    df[cols[i]].data[j] = num
                }
            }
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types are not numeric.\nThese features are: " + uneffectedCols.toString())
    }
}

function fillNanText(df, text){
    var cols = getSelectedCols()
    var uneffectedCols = []
    for(var i in cols){
        if(df[cols[i]].type == 'nominal' || df[cols[i]].type == 'ordinal' || df[cols[i]].type == 'simbinary' || df[cols[i]].type == 'asimbinary' || df[cols[i]].type == undefined){
            for(var j = 0; j < df.length; j++){
                if(df[cols[i]].data[j] === "" || df[cols[i]].data[j] === undefined){
                    df[cols[i]].data[j] = text
                }
            }
        }
        else {
            uneffectedCols.push(cols[i])
        }
    }
    if(uneffectedCols.length > 0){
        alert("Some features didn't effected! Because their types(integer) are not supported.\nThese features are: " + uneffectedCols.toString())
    }
}