var chartNumber = 0
var prevSelected = undefined
var charts = document.getElementById("charts")
var layout = {height: 580};



var lineChart = function(Y, X, labels, types, modes){
    var row = createElement('div', {className: 'row', style: 'width: 100%;'})
    charts.prepend(row)
    row.appendChild(createElement('div', {id: "chart" + chartNumber, className: 'chart'}))
    

    var traces = []
    for(var i = 0; i < labels.length; i++){
        var trace = {
            x: X,
            y: Y[i],
            mode: modes[i],
            type: types[i],
            name: labels[i]
        }
        traces.push(trace)
    }
        
    Plotly.newPlot('chart' + chartNumber, traces, layout, {responsive: true});
    row.appendChild(createElement('button', {type: 'button', className: 'close remove-chart', innerHTML: "&times;", style: 'height: 10px;'}))

    $('.remove-chart').click(function(){
        if(this && this.previousSibling){
            this.previousSibling.remove()
            this.remove()
        }
    })

    chartNumber++
}

var histogram = function(X, labels){
    var row = createElement('div', {className: 'row', style: 'width: 100%;'})
    charts.prepend(row)
    row.appendChild(createElement('div', {id: "chart" + chartNumber, className: 'chart'}))
    

    var traces = []
    for(var i = 0; i < labels.length; i++){
        var trace = {
            x: X[i],
            histogram: 'count',
            name: labels[i],
            type: 'histogram'
        }
        traces.push(trace)
    }
        
    Plotly.newPlot('chart' + chartNumber, traces, layout, {responsive: true});
    row.appendChild(createElement('button', {type: 'button', className: 'close remove-chart', innerHTML: "&times;", style: 'height: 10px;'}))

    $('.remove-chart').click(function(){
        if(this && this.previousSibling){
            this.previousSibling.remove()
            this.remove()
        }
    })

    chartNumber++
}

document.getElementById('line-chart').onclick = function(){
    var modalBody = document.getElementById('line-chart-modal-body')
    modalBody.innerHTML = ""
    $('#line-chart-modal').modal('show')

    var cols = getSelectedCols()
    
    var x = createElement('div', {className: 'row', style: 'margin: 10px auto;'})
    x.appendChild(createElement('p', {innerText: "X: ", className: 'col-sm-4'}))
    var selectX = createElement('select', {id: 'line-chart-modal-x', className: 'col-sm-8'})
    selectX.appendChild(createElement('option', {value: 'rangeX', innerText: 'Range'}))
    for(var i = 0; i < cols.length; i++){
        selectX.appendChild(createElement('option', {value: cols[i], innerText: cols[i]}))
    }
    x.appendChild(selectX)
    modalBody.appendChild(x)
    selectX.onchange = function(){
        if(document.getElementById('line-chart-modal-' + prevSelected + '-type')){
            document.getElementById('line-chart-modal-' + prevSelected + '-type').disabled = false
            document.getElementById('line-chart-modal-' + prevSelected + '-mode').disabled = false
        }
        prevSelected = selectX.value
        document.getElementById('line-chart-modal-' + selectX.value + '-type').disabled = true
        document.getElementById('line-chart-modal-' + selectX.value + '-mode').disabled = true
    }
    
    var typeOptions = ['scatter']
    var modeOptions = ['lines', 'markers', 'lines+markers']
    for(var i = 0; i < cols.length; i++){
        var row = createElement('div', {className: 'row', style: 'margin: 10px auto;'})
        row.appendChild(createElement('p', {innerText: cols[i] + ": ", className: 'col-sm-6'}))
        var select = createElement('select', {id: 'line-chart-modal-' + cols[i] + '-type', className: 'col-sm-3'})
        var select2 = createElement('select', {id: 'line-chart-modal-' + cols[i] + '-mode', className: 'col-sm-3'})
        for(var j = 0; j < typeOptions.length; j++){
            select.appendChild(createElement('option', {value: typeOptions[j], innerText: typeOptions[j]}))
        }
        for(var j = 0; j < modeOptions.length; j++){
            select2.appendChild(createElement('option', {value: modeOptions[j], innerText: modeOptions[j]}))
        }
        row.appendChild(select)
        row.appendChild(select2)
        modalBody.appendChild(row)
    }
    
}

document.getElementById('line-chart-modal-submit').onclick = function(){
    var cols = getSelectedCols()

    var x = document.getElementById('line-chart-modal-x').value
    var types = []
    var modes = []
    var X = undefined
    var Y = []
    for(var i = 0; i < cols.length; i++){
        if(cols[i] !== x){
            types.push(document.getElementById('line-chart-modal-' + cols[i] + '-type').value)
            modes.push(document.getElementById('line-chart-modal-' + cols[i] + '-mode').value)
            Y.push(df[cols[i]].data)
        }
        else{
            cols.splice(i, 1)
            i--
            X = df[x].data
        }
    }
    if(x == 'rangeX'){
        X = [...Array(df.length).keys()]
    }
    //console.log('Y: ', Y, 'X: ', X, 'cols: ', cols, 'types: ', types)
    lineChart(Y, X, cols, types, modes)
}



document.getElementById('histogram-chart').onclick = function(){
    var cols = getSelectedCols()
    var X = []
    for(var i in cols){
        X.push(df[cols[i]].data)
    }
    histogram(X, cols)
}