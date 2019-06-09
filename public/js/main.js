var openFile = document.getElementById("open-file-modal-submit")
var file = document.getElementById('file')
var calcDissims = document.getElementById("calc-dissims")
var dissim = document.getElementById("dissim")
var kmeans = document.getElementById("kmeans")
var setTableButton = document.getElementById("set-table")

function createElement(tag, prop){
    var element = document.createElement(tag)
    for(var i in prop){
        element[i] = prop[i]
    }
    return element
}

var df = undefined

openFile.onclick = function(){
    readCsv(file, function(data){
        df = data
    })
}

setTableButton.onclick = function(){
    setTable(df)
}

var classes = []
kmeans.onclick = function(){
    var cols = df.headers
    var select = document.getElementById('kmeans-modal-predict')
    
    for(var i in cols){
        select.appendChild(createElement('option', {value: cols[i], innerText: cols[i]}))
    }
    $("#kmeans-modal").modal("show")
}

document.getElementById("kmeans-modal-submit").onclick = async function(){
    var classCount = Math.floor(document.getElementById("kmeans-modal-class-count").value)
    var tolerance = Math.floor(document.getElementById("kmeans-modal-tolerance").value)
    var kmeansPredict = document.getElementById('kmeans-modal-predict').value
    //element counts for per center at the begining
    elementCounts = new Array(classCount).fill(1)

    await calcDissims()
    await dissim()
    classes = await prepareClasses(df.length, classCount)
    await kmeans(df, classes, classCount, elementCounts, tolerance)
    await getClassifiedDf(df, classes, kmeansPredict)
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

function createModal(modal_id, modal_title){
    var modal = createElement('div', {id: modal_id, className: 'modal', tabindex: "-1", role: "dialog"})
        var modal_dialog = createElement('div', {className: 'modal-dialog', role: 'document'})
            var modal_content = createElement('div', {className: 'modal-content'})
                var modal_header = createElement('div', {className: 'modal-header'})
                    modal_header.appendChild(createElement('h5', {innerText: modal_title, className: 'modal-title'}))
                    modal_header.appendChild(createElement('button', {type: 'butoon', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close', innerHTML: '<span aria-hidden="true">&times;</span>'}))
                var modal_body = createElement('div', {className: 'modal-body'})
                var modal_footer = createElement('div', {className: 'modal-footer'})
                    var modal_submit = createElement('button', {type: 'button', 'data-dismiss': 'modal', className: 'btn btn-primary', innerText: 'Ok'})
                    modal_footer.appendChild(modal_submit)

                modal.appendChild(modal_dialog)
                modal_dialog.appendChild(modal_content)
                modal_content.appendChild(modal_header)
                modal_content.appendChild(modal_body)
                modal_content.appendChild(modal_footer)
    return [modal, modal_body, modal_submit]
}

function createFormGroup(form, input, labelText){
    var form_group = createElement('div', {className: 'form-group'})
    var label = createElement('label', {innerText: labelText})
    form_group.appendChild(label)
    input.className = 'form-control'
    form_group.appendChild(input)
    form.appendChild(form_group)
    return form
}