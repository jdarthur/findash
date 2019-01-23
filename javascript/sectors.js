/*
scripts for the All Sectors page

author: jdarthur
date: 19 Jan 2019
*/


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
    oReq.open("GET", "/api/sectors");
    oReq.send();
}

function create_table(data) {
    /*
    Create a table with stock data
    */

    //create the table itself
    let div = document.getElementById("main_div")
    let table = document.createElement("table")
    table.setAttribute("class", "tab")
    table.setAttribute("id", "sectors_table")


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
        const sector = data[i]
        for (key in sector) {
            cell = row.insertCell()
            cell.setAttribute("width", 100/headers.length + "%")
            cell.setAttribute("onclick", "make_editable(this)")
            cell.innerHTML = sector[key]
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

    const header_row = document.getElementById("sectors_table").tHead.rows[0]
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
            text_input = document.createElement("input")
            text_input.setAttribute("size", 10)
            text_input.value = cell.innerHTML
            cell.innerHTML = ""
            cell.appendChild(text_input)
        }

        //add "Save" button
        const button_cell = row.insertCell()
        const button = document.createElement("button")
        button.setAttribute("onclick", "save_row(this, '/api/sector', 'sector_id')")
        button.innerHTML = "Save"
        button_cell.appendChild(button)

        //mark this row as active
        row.setAttribute("active", true)
    }
}
