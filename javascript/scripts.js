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

//These are used to fill dropdowns when you edit a stock.
var dropdowns = {
    "sector" : [],
    "exchange" : []
}

function reqListener () {
    /*
    parse stock data and use it to create a table
    */
    let data = JSON.parse(this.responseText)
    create_table(data)
}

function initialize() {
    /*
    run functions we need to set up this page
    */
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/api/stocks");
    oReq.send();

    get_all("sector")
    get_all("exchange")
}

function get_all_listener() {
    /*
    get list data via REST (all exchanges, all sectors, etc)
    */
    const type = this.datatype
    let data = JSON.parse(this.responseText)
        for (let i = 0; i < data.length; i ++){
        const name = data[i]['name']
        dropdowns[type].push(name)
    }
}

function get_all(type) {
    let oReq = new XMLHttpRequest()
    oReq.addEventListener("load", get_all_listener)
    oReq.open("GET", "/api/" + type + "s")
    oReq.send()

    //use this field to know where we save data in the listener
    oReq.datatype = type
}

function create_table(data) {
    /*
    Create a table with stock data
    */

    //create the table itself
    let div = document.getElementById("main_div")
    let table = document.createElement("table")
    table.setAttribute("class", "tab")
    table.setAttribute("id", "stocks_table")


    //create headers
    headers = Object.keys(data[0])
    const thead = table.createTHead()
    const row = thead.insertRow()
    row.setAttribute("class", "tabheader")
    for (let i = 0; i < headers.length; i++) {
        cell = row.insertCell()
        cell.setAttribute("width", 100/headers.length + "%")
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
            cell.setAttribute("onclick", "make_editable(this)")
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
    row.setAttribute("new", "true")

    const header_row = document.getElementById("stocks_table").tHead.rows[0]
    for (let i = 1; i < header_row.cells.length; i++) {
        const cell = row.insertCell()
        cell.setAttribute("onclick", "make_editable(this)")
    }
    row.cells[0].innerHTML = ""
    make_editable(row.cells[0])
}

function make_editable(cell) {
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
        button.setAttribute("onclick", "save_row(this)")
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

function save_row(button) {
    /*
    Save a row to the database
    */
    const row = button.parentNode.parentNode
    let post = false
    if (row.getAttribute("new") == "true") {
        post = true
        row.setAttribute("new", "false")
    }

    //remove plus button
    button.remove()
    row.deleteCell(row.cells.length - 1)
    row.setAttribute("active", false)

    //chaange all inputs back into text
    for (let i = 0; i < row.cells.length; i++) {
        const cell = row.cells[i]
        child = cell.childNodes[0]
        cell.innerHTML = child.value
    }
    data = row2dict(row)
    save_db(data, post)
}

function row2dict(row) {
    /*
     take a row and convert it into a dictionary
    */
    const table = row.parentNode.parentNode
    const header_row = table.tHead.rows[0]
    dict = {}
    for (let i = 0; i < row.cells.length; i++) {
        const key = header_row.cells[i].innerHTML
        const cell_value = row.cells[i].innerHTML
        dict[key] = cell_value
    }
    return dict
}

function putListener () {
    data = JSON.parse(this.responseText)
}
function save_db(data, post=false) {
    /*
    save the data into the database via REST
    */
    let oReq = new XMLHttpRequest()
    oReq.addEventListener("load", putListener)
    if (post) {
        oReq.open("POST", "/api/stock")
    }
    else {
        oReq.open("PUT", "/api/stock/" + data["symbol"])
    }

    oReq.setRequestHeader('Content-type','application/json; charset=utf-8');
    oReq.send(JSON.stringify(data))
}
