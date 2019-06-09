var LEARNING_RATE = 0.5

document.getElementById('back-propagation').onclick = function(){
    var [modal, modal_body, modal_submit] = createModal('back-propagation-modal', 'Back Propagation')

    var form  = createElement('form')

    var learning_rate_input = createElement('input', {type: 'number', value: 0.5, placeholder: 'Learning Rate...'})
    form = createFormGroup(form, learning_rate_input, 'Learning Rate')

    var hidden_layer_neurons_input = createElement('input', {type: 'number', placeholder: 'Default equals input neurons...'})
    form = createFormGroup(form, hidden_layer_neurons_input, 'Hiddern layer neurons count')

    var epoch_input = createElement('input', {type: 'number', value: 10000, placeholder: 'Epoch count...'})
    form = createFormGroup(form, epoch_input, 'Epoch')
    
    var predict_select = createElement('select', {type: 'number', multiple: true, className: 'form-control'})
    var cols = df.headers
    for(var i in cols){
        predict_select.appendChild(createElement('option', {value: cols[i], innerText: cols[i]}))
    }
    form = createFormGroup(form, predict_select, 'Select predict feature')

    modal_body.appendChild(form)
    $(modal).modal('show')

    modal_submit.onclick = async function(){
        $(modal).modal('hide')
        LEARNING_RATE = learning_rate_input.value
        var hidden_layer_neurons = hidden_layer_neurons_input.value
        var epoch = epoch_input.value
        var predicts = predict_select.value
        modal.remove()

        var cols = getSelectedCols()

        var uneffectedCols = []
        var effectedCols = []
        for(var i in cols){
            if(df[cols[i]].type == 'numeric' && !predicts.includes(cols[i])){
                effectedCols.push(cols[i])
            }
            else {
                uneffectedCols.push(cols[i])
            }
        }
        if(uneffectedCols.length > 0){
            alert("Some features didn't effected! Because they may be target feature or their types are not numeric.\nThese features are: " + uneffectedCols.toString())
        }

        var [raw_X_train, raw_X_test] = trainTestSplit(df)
        var cols = effectedCols.concat(predicts)
        raw_X_train = df2matrix(raw_X_train, cols)
        raw_X_test = df2matrix(raw_X_test, cols)

        var X_train = []
        var X_test = []
        for(var i = 0; i < raw_X_train._size[0]; i++){
            X_train.push([raw_X_train._data[i].slice(0, effectedCols.length), raw_X_train._data[i].slice(effectedCols.length, cols.length)])
        }
        for(var i = 0; i < raw_X_test._size[0].length; i++){
            X_test.push([raw_X_test._data[i].slice(0, effectedCols.length), raw_X_test._data[i].slice(effectedCols.length, cols.length)])
        }

        if(!hidden_layer_neurons){
            hidden_layer_neurons = effectedCols.length
        }
        var length = X_train.length
        nn = new NeuralNetwork(effectedCols.length, hidden_layer_neurons, predicts.length)
        for(var i = 0; i < epoch; i++){
            r = getRandomInt(0, length)
            training_inputs = X_train[r][0]
            training_outputs = X_train[r][1]
            console.log(training_inputs, training_outputs)
            nn.train(training_inputs, training_outputs)
            console.log(i, nn.calculate_total_error(X_train))
        }
        
        var results = []
        var result
        for(var i = 0; i < X_test.length; i++){
            result = await nn.feed_forward(X_test[i][0])
            await results.push([X_test[i][1], result])
        }
        console.log(results)

        var sayi = 0
        for(var a in results){
            if(results[a][0].toString() == results[a][1].toString()){
                sayi++
            }
        }
        console.log(sayi)
    }
}

function treePredict(root, record){
    if(root.branches){
        treePredict(root.branches[record[root.name]])
    }
    else {
        return root
    }
}

// Blog post example:
/*

nn = new NeuralNetwork(2, 2, 2, hidden_layer_weights=[0.15, 0.2, 0.25, 0.3], hidden_layer_bias=0.35, output_layer_weights=[0.4, 0.45, 0.5, 0.55], output_layer_bias=0.6)
for(var i = 0; i < 10000; i++){
    nn.train([0.05, 0.1], [0.01, 0.99])
    console.log(i, nn.calculate_total_error([[[0.05, 0.1], [0.01, 0.99]]]))
}

*/

// XOR example:
/*

training_sets = [[[0, 0], [0]],[[0, 1], [1]],[[1, 0], [1]],[[1, 1], [0]]]

 nn = new NeuralNetwork(training_sets[0][0].length, 5, training_sets[0][1].length)
 for(var i = 0; i < 10000; i++){
     r = getRandomInt(0, 4)
     training_inputs = training_sets[r][0]
     training_outputs = training_sets[r][1]
     nn.train(training_inputs, training_outputs)
     console.log(i, nn.calculate_total_error(training_sets))
}

*/




var Neuron = class {
    constructor(bias) {
        this.bias = bias
        this.weights = []
    }
    
    calculate_output(inputs){
        this.inputs = inputs
        this.output = this.squash(this.calculate_total_net_input())
        return this.output
    }

    calculate_total_net_input(){
        var total = 0
        for(var i = 0; i < this.inputs.length; i++){
            total += this.inputs[i] * this.weights[i]
        }
        return total + this.bias
    }

    // Apply the logistic function to squash the output of the neuron
    // The result is sometimes referred to as 'net' [2] or 'net' [1]
    squash(total_net_input){
        return 1 / (1 + Math.exp(-total_net_input))
    }

    // Determine how much the neuron's total input has to change to move closer to the expected output
    
    // Now that we have the partial derivative of the error with respect to the output (∂E/∂yⱼ) and
    // the derivative of the output with respect to the total net input (dyⱼ/dzⱼ) we can calculate
    // the partial derivative of the error with respect to the total net input.
    // This value is also known as the delta (δ) [1]
    // δ = ∂E/∂zⱼ = ∂E/∂yⱼ * dyⱼ/dzⱼ
    
    calculate_pd_error_wrt_total_net_input(target_output){
        return this.calculate_pd_error_wrt_output(target_output) * this.calculate_pd_total_net_input_wrt_input()
    }

    // The error for each neuron is calculated by the Mean Square Error method:
    calculate_error(target_output){
        return 0.5 * (target_output - this.output) ** 2
    }

    // The partial derivate of the error with respect to actual output then is calculated by:
    // = 2 * 0.5 * (target output - actual output) ^ (2 - 1) * -1
    // = -(target output - actual output)
    
    // The Wikipedia article on backpropagation [1] simplifies to the following, but most other learning material does not [2]
    // = actual output - target output
    
    // Alternative, you can use (target - output), but then need to add it during backpropagation [3]
    
    // Note that the actual output of the output neuron is often written as yⱼ and target output as tⱼ so:
    // = ∂E/∂yⱼ = -(tⱼ - yⱼ)
    calculate_pd_error_wrt_output(target_output){
        return -(target_output - this.output)
    }

    // The total net input into the neuron is squashed using logistic function to calculate the neuron's output:
    // yⱼ = φ = 1 / (1 + e^(-zⱼ))
    // Note that where ⱼ represents the output of the neurons in whatever layer we're looking at and ᵢ represents the layer below it
    
    // The derivative (not partial derivative since there is only one variable) of the output then is:
    // dyⱼ/dzⱼ = yⱼ * (1 - yⱼ)
    calculate_pd_total_net_input_wrt_input(){
        return this.output * (1 - this.output)
    }

    // The total net input is the weighted sum of all the inputs to the neuron and their respective weights:
    // = zⱼ = netⱼ = x₁w₁ + x₂w₂ ...
    
    // The partial derivative of the total net input with respective to a given weight (with everything else held constant) then is:
    // = ∂zⱼ/∂wᵢ = some constant + 1 * xᵢw₁^(1-0) + some constant ... = xᵢ
    calculate_pd_total_net_input_wrt_weight(index){
        return this.inputs[index]
    }
}

var NeuronLayer = class{
    constructor(num_neurons, bias){
        // Every neuron in a layer shares the same bias
        this.bias = ((bias) ? bias : Math.random())

        this.neurons = []
        for(var i = 0; i < num_neurons; i++){
            this.neurons.push(new Neuron(this.bias))
        }
    }


    inspect(){
        console.log('Neurons: ', this.neurons.length)
        for(var n = 0; n < this.neurons.length; n++){
            console.log('Neuron: ', n)
            for(var w = 0; w < this.neurons[n].weights.length; w++){
                console.log('Weight: ', this.neurons[n].weights[w])
            }
            console.log('Bias:', this.bias)
        }
    }

    feed_forward(inputs){
        var outputs = []
        for(var i = 0; i < this.neurons.length; i++){
            outputs.push(this.neurons[i].calculate_output(inputs))
        }
        return outputs
    }

    get_outputs(){
        outputs = []
        for(var i = 0; i < this.neurons.length; i++){
            outputs.push(this.neurons[i].output)
        }
        return outputs
    }
}

var NeuralNetwork = class{
    constructor(num_inputs, num_hidden, num_outputs, hidden_layer_weights = null, hidden_layer_bias = null, output_layer_weights = null, output_layer_bias = null){
        this.num_inputs = num_inputs

        this.hidden_layer = new NeuronLayer(num_hidden, hidden_layer_bias)
        this.output_layer = new NeuronLayer(num_outputs, output_layer_bias)

        this.init_weights_from_inputs_to_hidden_layer_neurons(hidden_layer_weights)
        this.init_weights_from_hidden_layer_neurons_to_output_layer_neurons(output_layer_weights)
    }

    init_weights_from_inputs_to_hidden_layer_neurons(hidden_layer_weights){
        var weight_num = 0
        for(var h = 0; h < this.hidden_layer.neurons.length; h++){
            for(var i = 0; i < this.num_inputs; i++){
                if(!hidden_layer_weights){
                    this.hidden_layer.neurons[h].weights.push(Math.random())
                }
                else{
                    this.hidden_layer.neurons[h].weights.push(hidden_layer_weights[weight_num])
                }
                weight_num++
            }
        }
    }

    init_weights_from_hidden_layer_neurons_to_output_layer_neurons(output_layer_weights){
        var weight_num = 0
        for(var o = 0; o < this.output_layer.neurons.length; o++){
            for(var h = 0; h < this.hidden_layer.neurons.length; h++){
                if(!output_layer_weights){
                    this.output_layer.neurons[o].weights.push(Math.random())
                }
                else{
                    this.output_layer.neurons[o].weights.push(output_layer_weights[weight_num])
                }
                weight_num += 1
            }
        }
    }

    inspect(){
        console.log('------')
        console.log('* Inputs: ', this.num_inputs)
        console.log('------')
        console.log('Hidden Layer ')
        this.hidden_layer.inspect()
        console.log('------')
        console.log('* Output Layer ')
        this.output_layer.inspect()
        console.log('------')
    }

    feed_forward(inputs){
        var hidden_layer_outputs = this.hidden_layer.feed_forward(inputs)
        return this.output_layer.feed_forward(hidden_layer_outputs)
    }

    // Uses online learning, ie updating the weights after each training case
    train(training_inputs, training_outputs){
        this.feed_forward(training_inputs)

        // 1. Output neuron deltas
        var pd_errors_wrt_output_neuron_total_net_input = new Array(this.output_layer.neurons.length).fill(0)
        
        for(var o = 0; o < this.output_layer.neurons.length; o++){
            // ∂E/∂zⱼ
            pd_errors_wrt_output_neuron_total_net_input[o] = this.output_layer.neurons[o].calculate_pd_error_wrt_total_net_input(training_outputs[o])
        }

        // 2. Hidden neuron deltas
        var pd_errors_wrt_hidden_neuron_total_net_input = new Array(this.hidden_layer.neurons.length).fill(0)
        for(var h = 0; h < this.hidden_layer.neurons.length; h++){
            // We need to calculate the derivative of the error with respect to the output of each hidden layer neuron
            // dE/dyⱼ = Σ ∂E/∂zⱼ * ∂z/∂yⱼ = Σ ∂E/∂zⱼ * wᵢⱼ
            var d_error_wrt_hidden_neuron_output = 0
            for(var o = 0; o < this.output_layer.neurons.length; o++){
                d_error_wrt_hidden_neuron_output += pd_errors_wrt_output_neuron_total_net_input[o] * this.output_layer.neurons[o].weights[h]
            }

            // ∂E/∂zⱼ = dE/dyⱼ * ∂zⱼ/∂
            pd_errors_wrt_hidden_neuron_total_net_input[h] = d_error_wrt_hidden_neuron_output * this.hidden_layer.neurons[h].calculate_pd_total_net_input_wrt_input()
        }

        // 3. Update output neuron weights
        for(var o = 0; o < this.output_layer.neurons.length; o++){
            for(var w_ho = 0; w_ho < this.output_layer.neurons[o].weights.length; w_ho++){
                // ∂Eⱼ/∂wᵢⱼ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢⱼ
                var pd_error_wrt_weight = pd_errors_wrt_output_neuron_total_net_input[o] * this.output_layer.neurons[o].calculate_pd_total_net_input_wrt_weight(w_ho)

                // Δw = α * ∂Eⱼ/∂wᵢ
                this.output_layer.neurons[o].weights[w_ho] -= LEARNING_RATE * pd_error_wrt_weight
            }
        }

        // 4. Update hidden neuron weights
        for(var h = 0; h < this.hidden_layer.neurons.length; h++){
            for(var w_ih = 0; w_ih < this.hidden_layer.neurons[h].weights.length; w_ih++){
                // ∂Eⱼ/∂wᵢ = ∂E/∂zⱼ * ∂zⱼ/∂wᵢ
                pd_error_wrt_weight = pd_errors_wrt_hidden_neuron_total_net_input[h] * this.hidden_layer.neurons[h].calculate_pd_total_net_input_wrt_weight(w_ih)

                // Δw = α * ∂Eⱼ/∂wᵢ
                this.hidden_layer.neurons[h].weights[w_ih] -= LEARNING_RATE * pd_error_wrt_weight
            }
        }
    }

    calculate_total_error(training_sets){
        var total_error = 0
        for(var t = 0; t < training_sets.length; t++){
            var io = training_sets[t]
            var training_inputs = io[0]
            var training_outputs = io[1]
            this.feed_forward(training_inputs)
            for(var o = 0; o < training_outputs.length; o++){
                total_error += this.output_layer.neurons[o].calculate_error(training_outputs[o])
            }
        }
        return total_error
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

