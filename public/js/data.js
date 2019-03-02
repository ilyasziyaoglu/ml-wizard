function readCsv(input, cb){
    if(document.getElementById("df-type").value == "row-based"){
        var df = []
        if(input.files && input.files[0]){
            var reader = new FileReader();
            reader.onload = function (e) {  
                var lines=e.target.result.split('\n');
                if(lines.length > 0){
                    var headers = []
                    var head = lines[0].trim().split(',')
                    for(var i = 0; i < head.length; i++){
                        headers.push(head[i].split(' ').join('_'))
                    }
                    for(var i = 1; i < lines.length; i++){
                        var record = {}
                        var features = lines[i].split(',')
                        for(var j = 0; j < headers.length; j++){
                            if($.isNumeric(features[j])){
                                features[j] = parseFloat(features[j])
                            }
                            record[headers[j]] = features[j]
                        }
                        df.push(record)
                    }
                }
            };
            reader.readAsText(input.files[0]);
        }
        cb(df)
    }
    else {
        var df = {types: {nominal: [], simbinary: [], asimbinary: [], numeric: [], ordinal: []}}
        if(input.files && input.files[0]){
            var reader = new FileReader();
            reader.onload = function (e) {  
                var lines=e.target.result.split('\n');
                if(lines.length > 0){
                    var headers = []
                    var head = lines[0].trim().split(',')
                    for(var i = 0; i < head.length; i++){
                        headers.push(head[i].split(' ').join('_'))
                        df[headers[i]] = {data: []}
                    }
                    df.headers = headers
                    for(var i = 1; i < lines.length; i++){
                        var features = lines[i].trim().split(',')
                        for(var j = 0; j < headers.length; j++){
                            if($.isNumeric(features[j])){
                                features[j] = parseFloat(features[j])
                            }
                            df[headers[j]].data.push(features[j])
                        }
                    }
                    df.length = i-1
                }
            };
            reader.readAsText(input.files[0]);
        }
        cb(df)
    }
}

function areTypesOk(){
    for(var i in df.headers){
        if(!df[df.headers[i]].type){
            return false
        }
    }
    return true
}