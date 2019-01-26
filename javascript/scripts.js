/*
scripts for the All Stocks page

Functionality:
    - Load all stocks from the database
    - Edit information (date founded, name, exchange, active/inactive, etc.)
    - Save to database

Todo:
    - Link to other pages (e.g. /daily?symbol=aapl)
    - tabbed view to navigate between pages

author: jdarthur
date: 19 Jan 2019
*/
var types = [
    "stock",
    "sector",
    "exchange"
]

var divs = {
    "stock" : "stocks_div",
    "sector" : "sectors_div",
    "exchange" : "exchanges_div"
}

var dropdowns = {
    "sector" : [],
    "exchange" : []
}

var id_fields = {
    "sector" : "sector_id",
    "stock" : "symbol",
    "exchange" : "exchange_id"
}

function initialize() {

    for(let i = 0; i < types.length; i++) {
        get_all(types[i])
    }
}


function listify(dict_list, key) {
    /*\
    consume dictlist + key combo, produce a list

    dict_list = [
        {key1: 1, key2: 1, key3: 3}
        {key1: 2, key2: 1, key3: 3}
        {key1: 3, key2: 2, key3: 3}
        {key1: 4, key2: 2, key3: 3}
    ]
        listify(dict_list, key2) == [1, 1, 2, 2]

    */
    retlist = []
    for (let i = 0; i< dict_list.length; i++) {
        retlist.push(dict_list[i][key])
    }
    return retlist
}

function get_all_listener() {
    /*
    get list data via REST (all exchanges, all sectors, etc)
    */
    const type = this.datatype
    let data = JSON.parse(this.responseText)
    if (type == "sector") {
        console.log(data)
        dropdowns["sector"] = listify(data, "name")
    }
    if (type == "exchange") {
        dropdowns["exchange"] = listify(data, "name")
    }
    create_table(type, data)
}

function get_all(type) {
    let oReq = new XMLHttpRequest()
    oReq.addEventListener("load", get_all_listener)
    oReq.open("GET", "/api/" + type + "s")
    oReq.send()

    //use this field to know where we save data in the listener
    oReq.datatype = type
}

function create_table(type, data) {
    /*
    Create a table with stock data
    */

    //create the table itself
    let div = document.getElementById(divs[type])
    let table = document.createElement("table")
    table.setAttribute("class", "tab")
    table.setAttribute("id",  types + "_table")
    table.setAttribute("data_type", type)


    //create headers
    headers = Object.keys(data[0])
    const thead = table.createTHead()
    const row = thead.insertRow()
    row.setAttribute("class", "tabheader")
    for (let i = 0; i < headers.length; i++) {
        cell = row.insertCell()
        cell.setAttribute("width", 100 / headers.length + "%")
        cell.innerHTML = headers[i]
    }

    //create data rows
    const tbody = table.createTBody()
    for (let i = 0; i < data.length; i++) {
        const row = tbody.insertRow()
        const stock = data[i]
        for (key in stock) {
            cell = row.insertCell()
            cell.setAttribute("width", 100/headers.length + "%")
            cell.setAttribute("onclick", "make_editable(this, '" +  type + "')")
            cell.innerHTML = stock[key]
        }
    }

    //create "New Row" button
    const new_row = tbody.insertRow(tbody.rows.length)
    const button_cell = new_row.insertCell()
    const button = document.createElement("button")
    button.setAttribute("onclick", "add_row(this)")
    button.innerHTML = "+"
    button_cell.appendChild(button)

    div.appendChild(table)
}

function add_row(element) {
    /*
    pop a new row into the table
    */

    const row = element.parentNode.parentNode
    const table = row.parentNode.parentNode
    const type = table.getAttribute("data_type")
    row.setAttribute("new", "true")

    const header_row = row.parentNode.parentNode.tHead.rows[0]
    for (let i = 1; i < header_row.cells.length; i++) {
        const cell = row.insertCell()
        cell.setAttribute("onclick", "make_editable(this, '" + type + "')")
    }
    row.cells[0].innerHTML = ""
    make_editable(row.cells[0])
}

function make_editable(cell, type) {
    /*
    make a row editable i.e. change text data into input boxes

    columns like `exchange` & `sector` will be turned into a dropdown, rather than
    a free text input.
    */

    const row = cell.parentNode
    const table = row.parentNode.parentNode
    const thead_row = table.tHead.rows[0]

     //only do all this if this row is not already selected
    if ((row.getAttribute("active") != "true")) {

        //run through all rows and turn them into inputs
        for (let i = 0; i < row.cells.length; i++) {
            let text_input = null
            const cell = row.cells[i]
            if (thead_row.cells[i].innerHTML == "sector") {
                text_input = create_dropdown(cell, "sector")
            }
            else if (thead_row.cells[i].innerHTML == "exchange") {
                text_input = create_dropdown(cell, "exchange")
            }

            else {
                text_input = document.createElement("input")
                text_input.setAttribute("size", 10)
                text_input.value = cell.innerHTML

            }
            cell.innerHTML = ""
            cell.appendChild(text_input)

        }

        //add "Save" button
        const button_cell = row.insertCell()
        const button = document.createElement("button")
        const api_endpoint = "/api/" + type
        button.setAttribute("onclick", "save_row(this, '" + api_endpoint + "', '" + id_fields[type] + "')")
        button.innerHTML = "Save"
        button_cell.appendChild(button)
        //mark this row as active
        row.setAttribute("active", true)
    }
}

function create_dropdown(cell, type) {
    /*
    create a dropdown whose options are specified in the database
    */
    const dropdown = document.createElement("select")
    for (let j = 0; j < dropdowns[type].length; j++) {
        const option = document.createElement("option")
        option.value = dropdowns[type][j]
        option.text = dropdowns[type][j]

        if (cell.innerHTML == dropdowns[type][j]) {
            option.setAttribute("selected", "true")
        }
        dropdown.appendChild(option)
    }
    return dropdown
}
