const supabaseClient = require('@supabase/supabase-js')
const express = require('express')
var bodyParser = require('body-parser')
const { isValidStateAbbreviation } = require("usa-state-validator")

const app = express()
const port = 3000;
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

const supabaseUrl = 'https://oclnxjuyapnhrtsvttnx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbG54anV5YXBuaHJ0c3Z0dG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyMTU3NDksImV4cCI6MjAxNDc5MTc0OX0.0dfIKKskm5t4zRmBLFelCsRMyuHoPYGljl4JkGzJtFM'
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey)

app.get('/', (req, res) => {
    res.sendFile('public/INST377-Week10-Customers.html', { root: __dirname })
})

app.post('/customer', async (req, res) => {
    console.log(`Adding Customer`)

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var state = req.body.state;
    if (!isValidStateAbbreviation(state)) {
        console.log(state, "InValid")
        res.statusCode = 400;
        res.header('Content-type', 'application/json')
        var errorJson = {
            "message": `${state} is not a Valid State`
        }
        res.send(JSON.stringify(errorJson))
        return;
    } else {
        console.log(state, "Valid")
        const { data, error } = await supabase
            .from('Customer')
            .insert([
                { 'cust_first_name': firstName, 'cust_last_name': lastName, 'cust_state': state },
            ])
            .select();

        console.log(data)
        if (error) {
            res.statusCode = 500;
            console.log(error)
            res.send(error);
            return;
        }
        res.header('Content-type', 'application/json');
        res.send(data)
    }
})

app.get('/customers', async (req, res) => {
    console.log('Attempting to GET all Customers')
    res.header('Content-type', 'application/json');
    const { data, error } = await supabase
        .from('Customer')
        .select();

    if (error) {
        console.log(error)
        res.send(error)
    } else if (data) {
        res.send(data)
    }
})

app.listen(port, () => {
    console.log('APP IS ALIVEEEEEE')
})