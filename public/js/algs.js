var prepareClasses = function(length, classCount){
    //preparing classes distributedly for effective begining
    var classes = []
    for(i = 0; i < classCount; i++){
        classes.push({index: Math.floor(i * length/classCount)})
    }
    return classes
}

var kmeans = function(df, classes, classCount, ec, tolerance){
    //creating arrays for per class to store class elements
    for(var i = 0; i < classCount; i++){
        classes[i].elements = []
    }

    //finding per object nearest class
    for(var i = 0; i < df.length; i++){
        // setting firs eleman neares class as the first class to compare other dissimilarities next steps
        var temp
        if(classes[0].index > i){ //this is because the Dissimilarity matrix is threeangular and 'df.disSim[classes[0].index][i]' may be null
            temp = df.disSim[classes[0].index][i]
        }
        else{
            temp = df.disSim[i][classes[0].index]
        }
        var minIndex =0 //to store nearest class index temporarly
        for(var k = 1; k < classCount; k++){
            if(i < classes[k].index){// this is because the Dissimilarity matrix is threeangular and 'df.disSim[classes[k].index][i]' may be null
                var d = df.disSim[classes[k].index][i]
                if(temp > d){ // if class k near than all of previous classes
                    minIndex = k
                    temp = d
                }
            }
            else{
                var d = df.disSim[i][classes[k].index]
                if(temp > d){// if class k near than all of previous classes
                    minIndex = k
                    temp = d
                }
            }
        }
        classes[minIndex].elements.push(i) // set this objet to list of nearest class elements 
    }

    var status = 0 // state for checking end of alg.
    var diffs = []  // this is for differencies of this classes element count and the previous iteration to show some information to user
    var sc = []
    // checking class element counts differencies with previous iteration to stop algorithm with user defined tolerance percentage
    for(var i = 0; i < classCount; i++){
        if(Math.abs(classes[i].count - ec[i]) > df.length * tolerance){
            status = 1
        }
        diffs.push(Math.abs(classes[i].count - ec[i]))
        sc[i] = classes[i].count
    }
    ec = Object.assign({}, sc)

    // if classes are not as required elements list
    if(status == 1){
        // updating new class centers
        // they are defining by getting min dissim average of per class element to others in the same class.
        for(var i = 0; i < classes.length; i++){
            var minAverage = Infinity
            for(var j = 0; j < classes[i].elements.length; j++){
                var sum = 0
                for(var k = 0; k < classes[i].elements.length; k++){ // getting sum of dissims for classes[i].elements[j] to others
                    if(classes[i].elements[j] > classes[i].elements[k]){
                        sum += df.disSim[classes[i].elements[j]][classes[i].elements[k]]
                    }
                    else{
                        sum += df.disSim[classes[i].elements[k]][classes[i].elements[j]]
                    }
                }
                if(sum/classes[i].elements.length < minAverage){ //checking if it is minimum of averages
                    minAverage = sum/classes[i].elements.length
                    classes[i].index = classes[i].elements[j]
                }
            }
        }
        kmeans(df, classes, classCount, ec, tolerance) // continue recursively
    }
    else{
        console.log("finished")
    }
}

var getClassifiedDf = function(df, classes, classCol){
    var classifieddf = {}
    var classLabels = distinctVals(df[classCol].data)

    for(var i = 0; i < classes.length; i++){
        var tempdf = {headers: df.headers, types: df.types}
        for(var m = 0; m < df.headers.length; m++){
            tempdf[df.headers[m]] = {data: [], }
        }
        for(var j = 0; j < classes[i].elements.length; j++){
            for(var k = 0; k < df.headers.length; k++){
                tempdf[df.headers[k]].data.push(df[df.headers[k]].data[classes[i].elements[j]])
            }
        }
        var labelCounts = []
        for(var n in classLabels){
            labelCounts.push(count(tempdf[classCol].data, classLabels[n]))
            if(labelCounts[n] == max(labelCounts).val){
                tempdf.class = classLabels[n]
                tempdf.length = classes[i].elements.length
            }
        }
        classifieddf[tempdf.class] = tempdf
        histogram([tempdf[classCol].data], classCol)
    }
    return classifieddf
}