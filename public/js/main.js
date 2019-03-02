/*

1 - Sınıflama:
2 - Kümeleme:
3 - Birliktelik Kuralları:
4 - Tahminleyici Modelleme:
5 - Veri Görselleştirme:
6 - Değişim ve Sapma Tespiti Analizi:

*/

var input = document.getElementById("file")
var printDf = document.getElementById("print-df")
var calcDissims = document.getElementById("calc-dissims")
var dissim = document.getElementById("dissim")

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