var input = document.getElementById("file")
var printDf = document.getElementById("print-df")
var calcDissims = document.getElementById("calc-dissims")
var dissim = document.getElementById("dissim")
var kmeans = document.getElementById("kmeans")

function createElement(tag, prop){
    var element = document.createElement(tag)
    for(var i in prop){
        element[i] = prop[i]
    }
    return element
}

var df = undefined

input.onchange = function(){
    readCsv(input, function(data){
        df = data
    })
}

printDf.onclick = function(){
    setTable(df)
}

calcDissims.onclick = function(){
    for(var i in df.headers){
        switch(df[df.headers[i]].type){
            case 'nominal': nominalDisSim(df, df.headers[i]); break;
            case 'simbinary': binaryDisSim(df, df.headers[i]); break;
            case 'asimbinary' : binaryDisSim(df, df.headers[i]); break;
            case 'numeric' : numericDisSim(df, df.headers[i]); break;
            default : console.log(df.headers[i]); break;
        }
        //console.log(df.headers[i] + " is ok")
    }
    console.log("all ok")
}

dissim.onclick = function(){
    var cols = getSelectedCols()
    if(cols.length){
        disSim(df, cols)
        console.log(df.disSim)
    }
    else {
        alert("You must choose columns for this operation!")
    }
}

var classes = []
kmeans.onclick = function(){
    $("#kmeans-modal").modal("show")
}

document.getElementById("kmeans-modal-submit").onclick = function(){
    var classCount = Math.floor(document.getElementById("kmeans-modal-class-count").value)
    var tolerance = Math.floor(document.getElementById("kmeans-modal-tolerance").value)
    classes = prepareClasses(df.length, classCount)
    //element counts for per center at the begining
    elementCounts = new Array(classCount).fill(1)

    kmeans(df, classes, classCount, elementCounts, tolerance)
}

headSelectOnChange = function(){
    var cols = getSelectedCols()
    for(var i = 0; i < cols.length; i++){
        document.getElementById(cols[i]).value = this.value
        onChangeAttrType(cols[i], this.value)
    }
}

document.getElementById('sort').onclick = function(){
    var col = getSelectedCols()[0]
    sort(df, col, 'asc')
    setTable(df)
}

document.getElementById('del-cols').onclick = function(){
    var cols = getSelectedCols()
    deleteCols(df, cols)
    setTable(df)
}

document.getElementById('del-rows').onclick = function(){
    var rows = getSelectedRows()
    deleteRows(df, rows)
    setTable(df)
}

document.getElementById('classes').onclick = function(){
    var cols = getSelectedCols()
    getClassifiedDf(df, classes, cols[0])
}