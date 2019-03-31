document.getElementById('bayes').onclick = function(){
    var modalBody = document.getElementById('bayes-modal-body')
    modalBody.innerHTML = ""
    $('#bayes-modal').modal('show')

    var cols = df.headers

    var form = createElement('form', {id: 'bayes-form'})
    for(var i in cols){
        form.innerHTML += '<div class="input-group input-group-sm mb-3">\
                                <div class="input-group-prepend">\
                                    <span class="input-group-text" id="inputGroup-sizing-sm">' + cols[i] + '</span>\
                                </div>\
                                <input id="' + cols[i] + '-bayes-input" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">\
                                <div class="form-control col-sm-1">\
                                    <i class="bayes-delete-attr fas fa-trash-alt"></i>\
                                </div>\
                            </div>'
    }

    var selectGroup = createElement('div', {className: "input-group mb-3"})
    var prepend = createElement('div', {className: "input-group-prepend"})
    prepend.appendChild(createElement('label', {className: "input-group-text", innerText: 'Predict'}))
    var select = createElement('select', {className: "custom-select", id: "bayes-predict"})
    
    for(var i in cols){
        select.appendChild(createElement('option', {value: cols[i], innerText: cols[i]}))
    }
    
    selectGroup.appendChild(prepend)
    selectGroup.appendChild(select)
    form.appendChild(selectGroup)
    modalBody.appendChild(form)
    
    $('.bayes-delete-attr').click(function(){
        var deleted = this.parentNode.parentNode.childNodes[3].id.split('-')[0]
        document.querySelector('option[value=' + deleted + ']').remove()
        this.parentNode.parentNode.remove()
    })
    
    $('#bayes-predict').change(function(){
        if(bayes_predict){
            document.getElementById(bayes_predict).disabled = false
        }
        document.getElementById(this.value + '-bayes-input').disabled = true
        bayes_predict = this.value + '-bayes-input'
    })
}

var bayes_predict

document.getElementById('bayes-modal-submit').onclick = function(){
    var X = {}
    var predict = document.getElementById('bayes-predict').value
    var inputs = document.getElementById('bayes-form').getElementsByTagName('input')

    for(var i = 0; i < inputs.length; i++){
        X[inputs[i].id.split('-')[0]] = inputs[i].value
    }

    delete X[predict]
    
    var predicted = bayes(df, X, predict)

    
    var row = createElement('div', {className: 'row', style: 'width: 100%;'})
    charts.prepend(row)

    var chart = createElement('div', {id: "chart" + chartNumber, className: 'chart'})
    chart.appendChild(createElement('h1', {innerText: predicted, style: 'text-align: center;'}))
    row.appendChild(chart)
    
    row.appendChild(createElement('button', {type: 'button', className: 'close remove-chart', innerHTML: "&times;", style: 'height: 10px;'}))

    $('.remove-chart').click(function(){
        if(this && this.previousSibling){
            this.previousSibling.remove()
            this.remove()
        }
    })

    chartNumber++
}

function bayes(df, X, predict){
    var predictValues = distinctVals(df[predict].data)

    var P = {}
    for(var i in predictValues){
        P[predict+'='+predictValues[i]] = count(df[predict].data, predictValues[i]) / df.length
    }

    for(var i in X){
        for(var j in predictValues){
            P[i+'='+X[i]+'|'+predict+'='+predictValues[j]] = condProbab(df[i].data, df[predict].data, X[i], predictValues[j])
        }
    }

    for(var i in predictValues){
        P['X|'+predict+'='+predictValues[i]] = 1
        for(var j in X){
            P['X|'+predict+'='+predictValues[i]] *= P[j+'='+X[j]+'|'+predict+'='+predictValues[i]]
        }
    }

    for(var i in predictValues){
        P[predictValues[i]] = P['X|'+predict+'='+predictValues[i]] * P[predict+'='+predictValues[i]]
    }

    var prob = 0, predicted
    for(var i in predictValues){
        if(P[predictValues[i]] > prob){
            predicted = predictValues[i]
        }
    }

    return predicted
}