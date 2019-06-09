var query = document.getElementById('query')
document.getElementById('query-form').onsubmit = function(e){
    e.preventDefault()

    var queryStr = query.value
    var fdf = filterDf(df, queryStr)
    setTable(fdf)
}

function filterDf(df, query){
    var df_matrix = df2matrix(df)
    var new_df_matrix = math.zeros(0, 0)
    new_df_matrix._size[1] = df.headers.length

    var q_tree = getQueryTree(query)

    for(var i = 0; i < df.length; i++){
        if(checkQuery(q_tree, df_matrix._data[i], df.headers)){
            new_df_matrix._data.push(df_matrix._data[i].slice())
            new_df_matrix._size[0]++
        }
    }

    return matrix2df(new_df_matrix, df.headers)
}

function checkQuery(q_tree, row, cols){
    if(q_tree.op == 'or' || q_tree.op == 'and'){
        return queryOperate(checkQuery(q_tree.f1, row, cols), q_tree.op, checkQuery(q_tree.f2, row, cols))
    }
    else {
        if(cols.includes(q_tree.f1) && cols.includes(q_tree.f2)){
            return queryOperate(row[cols.indexOf(q_tree.f1)], q_tree.op, row[cols.indexOf(q_tree.f2)])
        }
        else if(cols.includes(q_tree.f1) && !cols.includes(q_tree.f2)){
            return queryOperate(row[cols.indexOf(q_tree.f1)], q_tree.op, q_tree.f2)
        }
        else if(!cols.includes(q_tree.f1) && cols.includes(q_tree.f2)){
            return queryOperate(q_tree.f1, q_tree.op, row[cols.indexOf(q_tree.f2)])
        }
        else {
            return queryOperate(q_tree.f1, q_tree.op, q_tree.f2)
        }
    }
}

function findSubQueries(query){
    var queries = {}
    var start = 0
    var open_count = 0
    for(var i = 0; i < query.length; i++){
        if(query[i] == '('){
            open_count++
            if(open_count == 1){
                start = i
            }
        }
        if(query[i] == ')'){
            open_count--
            if(open_count == 0){
                queries.push(query.slice(start+1, i))
            }
        }
    }
    return queries
}

function getQueryTree(query){
    var trimmed_query = query.split(' ').join('')
    if(trimmed_query.includes(')or(') || trimmed_query.includes(')and(')){
        var queries = []
        var start = 0
        var end = 0
        var open_count = 0
        for(var i = 0; i < query.length; i++){
            if(query[i] == '('){
                open_count++
                if(open_count == 1){
                    start = i
                }
            }
            if(query[i] == ')'){
                open_count--
                if(open_count == 0){
                    if(end == 0){
                        end = i
                    }
                    queries.push(query.slice(start+1, i))
                }
            }
        }
        console.log(start, end, query)
        return {f1: getQueryTree(queries[0]), op: query.slice(end+1, start).trim(), f2: getQueryTree(queries[1])}
    }
    else if(query.includes(' and ')){
        var conditions = query.split(' and ')
        return {f1: getQueryTree(conditions[0]), op: 'and', f2: getQueryTree(conditions[1])}
    }
    else if(query.includes(' or ')){
        var conditions = query.split(' or ')
        return {f1: getQueryTree(conditions[0]), op: 'or', f2: getQueryTree(conditions[1])}
    }
    else {
        var [f1, op, f2] = query.split(' ')
        return {f1: f1, op: op, f2: f2}
    }
}

function queryOperate(f1, op, f2){
    switch(op){
        case '==': return f1 == f2;
        case '!=': return f1 != f2;
        case '>': return f1 > f2;
        case '<': return f1 < f2;
        case 'and': return (f1 && f2);
        case 'or': return (f1 || f2);
    }
}