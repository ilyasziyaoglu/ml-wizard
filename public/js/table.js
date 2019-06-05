var rowCount = 0

var table = document.getElementById("table")
var head = document.getElementById("table-head")
var body = document.getElementById("table-body")
var enabletableCharts = document.getElementById("enable-charts")
var tableCharts = document.createElement("tr")

enabletableCharts.onchange = function(){
    settableCharts()
}

function settableCharts(){
    body.prepend(tableCharts)
    tableCharts.innerHTML = ""
    if(enabletableCharts.checked){
        var cols = df.headers
    
        tableCharts.appendChild(createElement('th', {scope: 'row', innerText: "Distribution of feature values:"}))
        var layout = {autosize: false, width: 200, height: 200, margin: { l: 50, r: 0, b: 50, t: 0, pad: 0 }, paper_bgcolor: '#dddddd', plot_bgcolor: '#c7c7c7' };
    
        for(var i = 0; i < cols.length; i++){
            tableCharts.appendChild(createElement('td', {id: cols[i] + '-chart'}))
            var trace = {
                x: df[cols[i]].data.slice().sort(function(a, b){return a - b}),
                type: 'histogram',
              };
            var hdata = [trace];
            Plotly.newPlot(cols[i] + '-chart', hdata, layout, {responsive: true});
        }
    }
}

function setTable(df){
    head.innerHTML = ""
    var cols = df.headers

    head.appendChild(createElement('th', {scope: 'col', innerHTML: '<th scope="row">\
        <label class="btn btn-secondary col-checks">\
            <input id="col-checks-all" type="checkbox" style="margin: 5px;"> <b>#</b>\
        </label>\
        <select id="all-attr-selects">\
            <option value="undefined">Select type...</option>\
            <option value="nominal">Nominal</option>\
            <option value="ordinal">Ordinal</option>\
            <option value="numeric">Numeric</option>\
        </select>\
    </th>'}))
    body.innerHTML = ""
    for(var i = 0; i < cols.length; i++){
        head.appendChild(createElement('th', {scope: 'col', innerHTML: '<label class="btn btn-secondary">\
            <input type="checkbox" class="col-checks" name="' + cols[i] + '"> <b>' + cols[i] + '</b></label>\
            <select id="' + cols[i] + '" class="attribute-type">\
                <option value="undefined">Select type...</option>\
                <option value="nominal">Nominal</option>\
                <option value="ordinal">Ordinal</option>\
                <option value="numeric">Numeric</option>\
            </select>'}))
        
        if(df[cols[i]].type){
            document.getElementById(cols[i]).value = df[cols[i]].type
        }
    }
    for(var i = 0; i < df.length && i < 20; i++){
        var tr = createElement('tr')
        var rh = createElement('th', {scope: 'row', innerText: i + ' '})
        rh.appendChild(createElement('input', {type: 'checkbox', className: 'row-check', value: i}))
        tr.appendChild(rh)
        body.appendChild(tr)
        for(var j = 0; j < df.headers.length; j++){
            tr.appendChild(createElement('td', {innerText: df[df.headers[j]].data[i]}))
        }
    }
    if(df.length > 20){
        var tr = createElement('tr')
        tr.appendChild(createElement('th', {scope: 'row', innerText: '...'}))
        body.appendChild(tr)
        for(var j = 0; j < cols.length; j++){
            tr.appendChild(createElement('td', {innerText: '...'}))
        }
        for(var i = df.length - 20; i < df.length; i++){
            var tr = createElement('tr')
            var rh = createElement('th', {scope: 'row', innerText: i + ' '})
            rh.appendChild(createElement('input', {type: 'checkbox', className: 'row-check', value: i}))
            tr.appendChild(rh)
            body.appendChild(tr)
            for(var j = 0; j < cols.length; j++){
                tr.appendChild(createElement('td', {innerText: df[cols[j]].data[i]}))
            }
        }
    }
    settableCharts()
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

$(document).on("change", "#all-attr-selects", function(){
    var cols = getSelectedCols()
    for(var i = 0; i < cols.length; i++){
        document.getElementById(cols[i]).value = this.value
        onChangeAttrType(cols[i], this.value)
    }
})

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