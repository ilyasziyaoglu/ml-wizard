document.getElementById("to-binary").onclick = function(){
    var cols = df.types.simbinary.concat(df.types.asimbinary)
    var modalBody = document.getElementById("to-binary-modal-body")
    modalBody.innerHTML = ""
    var modal = document.getElementById("to-binary-modal")
    $(modal).modal("show")
    for(var j in cols){
        var distincts = distinctVals(df[cols[j]].data)
        if(distincts.length == 2 || distincts.length == 1){
            modalBody.innerHTML += '<p>Set binary equivalents for ' + cols[j] + ': </p><div class="input-group mb-3"><div class="input-group-prepend"><label class="input-group-text">0</label></div><select class="custom-select to-binary-modal-select" ><option values="' + distincts[0] + '">' + distincts[0] + '</option><option values="' + distincts[1] + '">' + distincts[1] + '</option></select></div><div class="input-group mb-3"><div class="input-group-prepend"><label class="input-group-text">1</label></div><select class="custom-select  to-binary-modal-select"><option values="' + distincts[0] + '">' + distincts[0] + '</option><option values="' + distincts[1] + '">' + distincts[1] + '</option></select></div>'
        }
        else {
            modalBody.innerHTML += '<p>' + cols[j] + ' column contains more than 2 distinct values</p>'
        }
    }
    document.getElementById("to-binary-modal-submit").onclick = function(){
        $(modal).modal("hide")
        var selecteds = document.getElementsByClassName("to-binary-modal-select")
        for(var i = 0; i < selecteds.length; i += 2){
            if(selecteds[i].value != selecteds[i+1].value){
                toBinary(df[cols[i/2]].data, selecteds[i].value, selecteds[i+1].value)
            }
            else {
                alert("You must select different values for column " + cols[i/2] + "!")
            }
        }
        setTable(df)
    }
}

function toBinary(arr, bin0, bin1){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == bin0){
            arr[i] = 0
        }
        else if(arr[i] == bin1){
            arr[i] = 1
        }
    }
    return arr
}

document.getElementById("ordinal-to-numeric").onclick = function(){
    var cols = df.types.ordinal
    var modalBody = document.getElementById("ordinal-to-numeric-modal-body")
    modalBody.innerHTML = ""
    var modal = document.getElementById("ordinal-to-numeric-modal")
    $(modal).modal("show")
    for(var i in cols){
        modalBody.appendChild(createElement('p',{innerText: 'Set ordinal equivalents for ' + cols[i]}))
        var distincts = distinctVals(df[cols[i]].data)
        for(var j in distincts){
            var wrapper = createElement('div', {className: 'input-group mb-3'})
            modalBody.appendChild(wrapper)
            wrapper.appendChild(createElement('div',{className: 'input-group-prepend'}).appendChild(createElement('label', {innerText: j, className:'input-group-text'})))
            var select = createElement('select', {className: cols[i] + 'custom-select ordinal-to-numeric-modal-select'})
            wrapper.appendChild(select)
            for(var k in distincts){
                select.appendChild(createElement('option', {value: distincts[k], innerText: distincts[k]}))
            }
        }
    }

    document.getElementById("ordinal-to-numeric-modal-submit").onclick = function(){
        for(var i in cols){
            var selects = document.getElementsByClassName(cols[i] + 'custom-select ordinal-to-numeric-modal-select')
            var values = []
            var equivalents = {}
            for(var j = 0; j < selects.length; j++){
                values.push(selects[j].value)
                equivalents[selects[j].value] = j
            }
            if(values.length == distinctVals(values).length){
                ordinalToNumeric(df[cols[i]].data, equivalents)
            }
            else{
                alert("You must select different values for column " + cols[i] + "!")
            }
            document.getElementById(cols[i]).value = 'numeric'
            df[cols[i]].type = 'numeric'
            df.types.numeric.push(cols[i])
        }
        df.types.ordinal = []
        setTable(df)
    }
}

function ordinalToNumeric(arr, equivalents){
    for(var i in arr){
        arr[i] = equivalents[arr[i]]
    }
    return arr
}

document.getElementById("normalize").onclick = function(){
    var cols = df.types.numeric
    for(var i in cols){
        normalize(df[cols[i]].data, 0, 1)
        setTable(df)
    }
}

function normalize(arr, nmin, nmax){
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
        arr[i] = c * (arr[i] - omin.val) + nmin
    }
    return arr
}