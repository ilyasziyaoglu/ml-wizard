var rowCount = 0

var table = document.getElementById("table")
var head = document.getElementById("table-head")
var body = document.getElementById("table-body")
var enableCharts = document.getElementById("enable-charts")

function setTable(df){
    head.innerHTML = ""
    head.appendChild(createElement('th', {scope: 'col', innerText: '#'}))
    body.innerHTML = ""
    for(var i = 0; i < df.headers.length; i++){
        head.appendChild(createElement('th', {scope: 'col', innerText: df.headers[i]}))
    }
    for(var i = 0; i < df.length && i < 100; i++){
        var tr = createElement('tr')
        var rh = createElement('th', {scope: 'row', innerText: i + ' '})
        rh.appendChild(createElement('input', {type: 'checkbox', className: 'row-check', value: i}))
        tr.appendChild(rh)
        body.appendChild(tr)
        for(var j = 0; j < df.headers.length; j++){
            tr.appendChild(createElement('td', {innerText: df[df.headers[j]].data[i]}))
        }
    }
    rowCount = 100

    //CHARTS
    var charts = document.createElement("tr")
    if(enableCharts.checked){
        body.prepend(charts)
        charts.appendChild(createElement('th', {scope: 'row', innerText: "Row: " + df.length + "\nCol: " + df.headers.length}))
    }

    var layout = {autosize: false, width: 200, height: 200, margin: { l: 50, r: 0, b: 50, t: 0, pad: 0 }, paper_bgcolor: '#dddddd', plot_bgcolor: '#c7c7c7' };
    
    //SELECTS
    var selects = document.createElement("tr")
    body.prepend(selects)
    var th = createElement('th', {scope: 'row', innerText: 'Attribute types: '})
    th.appendChild(createElement('input', {id: 'col-checks-all', type: 'checkbox', style: 'margin: 5px;'}))
    var headSelect = createElement('select', {id: "all-selects", onchange: headSelectOnChange})
    var headSelectOptions = {undefined: 'Select type...', simbinary: 'Symmetric Binary', asimbinary: 'Asymmetric Binary', nominal: 'Nominal', ordinal: 'Ordinal', numeric: 'Numeric'}
    for(var j in headSelectOptions){
        headSelect.appendChild(createElement('option', {value: j, innerText: headSelectOptions[j]}))
    }
    headSelect.value = "undefined"
    th.appendChild(headSelect)
    selects.appendChild(th)

    for(var i = 0; i < df.headers.length; i++){
        //CHARTS
        if(enableCharts.checked){
            charts.appendChild(createElement('td', {id: df.headers[i], innerText: "\nMissing: " + missingValCount(df[df.headers[i]].data, "") + " / " + df.length}))
            var trace = {
                x: df[df.headers[i]].data.slice().sort(function(a, b){return a - b}),
                type: 'histogram',
              };
            var hdata = [trace];
            Plotly.newPlot(df.headers[i], hdata, layout, {responsive: true});
        }

        //SELECTS
        var select = createElement('select', {id: df.headers[i], className: 'attribute-type'})
        var td = document.createElement('td')
        selects.appendChild(td)
        var checkbox = createElement('input', {name: df.headers[i], className: 'col-checks', type: 'checkbox', style: 'margin: 5px;'})
        td.appendChild(checkbox)
        var options = {undefined: 'Select type...', simbinary: 'Symmetric Binary', asimbinary: 'Asymmetric Binary', nominal: 'Nominal', ordinal: 'Ordinal', numeric: 'Numeric'}
        for(var j in options){
            select.appendChild(createElement('option', {value: j, innerText: options[j]}))
        }
        select.value = df[df.headers[i]].type
        td.appendChild(select)

        //WEIGHTS
        var weight = createElement('div', {className: 'input-group input-group-sm mb-3'})
        var weightPrepend = createElement('div', {className:"input-group-prepend"})
        weightPrepend.appendChild(createElement('span', {className: "input-group-text", innerText: 'Weight:'}))
        weight.appendChild(weightPrepend)
        weight.appendChild(createElement('input', {type: 'text', className: 'form-control weight', value: 1}))
        td.appendChild(weight)
    }
}

document.getElementById("more-data").onclick = function(){
    setMoreData(df)
}

function setMoreData(df){
    for(var i = rowCount; i < df.length && i < rowCount + 100; i++){
        var tr = document.createElement("tr")
        body.appendChild(tr)
        var rh = createElement('th', {scope: 'row', innerText: i + ' '})
        rh.appendChild(createElement('input', {type: 'checkbox', className: 'row-check', value: i}))
        tr.appendChild(rh)
        for(var j = 0; j < df.headers.length; j++){
            tr.appendChild(createElement('td', {innerText: df[df.headers[j]].data[i]}))
        }
    }
    rowCount += 100
}

$(document).on("change", ".attribute-type", function(){
    onChangeAttrType(this.id, this.value)
})

var onChangeAttrType = function(col, type){
    df[col].type = type
    var selects = $('.attribute-type')
    df.types = {nominal: [], simbinary: [], asimbinary: [], numeric: [], ordinal: [], undefined: []}
    for(var i = 0; i < selects.length; i++){
        if(selects[i].value != "Select type.."){
            df.types[selects[i].value].push(selects[i].id)
        }
    }
}

$(document).on("change", "#col-checks-all", function(){
    var allColChecks = $(".col-checks")
    if(this.checked){
        for(var i in allColChecks){
            allColChecks[i].checked = true
        }
    }
    else {
        for(var i in allColChecks){
            allColChecks[i].checked = false
        }
    }
})

function getWeights(){
    df.weights = {}
    var inputs = document.getElementsByClassName('weight')
    for(var i in df.headers){
        df.weights[df.headers[i]] = parseFloat(inputs[i].value)
    }
}

function getSelectedCols(){
    var selecteds = $(".col-checks:checked")
    var cols = []
    for(var i = 0; i < selecteds.length; i++){
        cols.push(selecteds[i].name)
    }
    return cols
}

function getSelectedRows(){
    var selecteds = $(".row-check:checked")
    var rows = []
    for(var i = 0; i < selecteds.length; i++){
        rows.push(selecteds[i].value)
    }
    return rows
}