/*
scripts for the wwhittle page

Functionality:
    - Load available metrics
    - populate the page with inputs
    - Submit whittle to server to run analysis

Todo:
    - Link to other pages (e.g. /daily?symbol=aapl)
    - tabbed view to navigate between pages

author: jdarthur
date: 5 Feb 2019
*/

var YEAR_RANGE = [2000, 2018]
var MONTH_RANGE = [1, 12]
var DAY_RANGE = [1, 31]

var HEADERS = [
    "Year",
    "Month",
    "Day",
    "Length",
    "Whittle Amount"
]


function initialize() {
    console.log("init")
    create_inputs()
}
// function get_all(type) {
//     let oReq = new XMLHttpRequest()
//     oReq.addEventListener("load", get_all_listener)
//     oReq.open("GET", "/api/" + type + "s")
//     oReq.send()

//     //use this field to know where we save data in the listener
//     oReq.datatype = type
// }

function create_inputs() {
    /*
    Create a table with stock data
    */

    const div = document.getElementById("main_div")
    const table = document.createElement("table")
    table.setAttribute("class", "tab")
    table.setAttribute("id",  "inputs_table")
    div.appendChild(table)

    const thead = table.createTHead()
    let row = thead.insertRow()
    row.setAttribute("class", "tabheader")
    for (let i = 0; i < HEADERS.length; i++) {
        cell = row.insertCell()
        cell.setAttribute("width", 100 / HEADERS.length + "%")
        cell.innerHTML = HEADERS[i]
    }


    const tbody = table.createTBody()
    row = tbody.insertRow()

    cell = row.insertCell()
    const year = range_dropdown(YEAR_RANGE[0], YEAR_RANGE[1])
    year.setAttribute("id", "year_select")
    cell.appendChild(year)

    cell = row.insertCell()
    const month = range_dropdown(MONTH_RANGE[0], MONTH_RANGE[1])
    month.setAttribute("id", "month_select")
    cell.appendChild(month)

    cell = row.insertCell()
    const day = range_dropdown(DAY_RANGE[0], DAY_RANGE[1])
    day.setAttribute("id", "day_select")
    cell.appendChild(day)

    cell = row.insertCell()
    const len = document.createElement("input")
    len.setAttribute("id", "length_select")
    len.setAttribute("size", "10")
    cell.appendChild(len)

    cell = row.insertCell()
    const amt = document.createElement("input")
    amt.setAttribute("id", "amount_select")
    amt.setAttribute("size", "10")
    cell.appendChild(amt)

    cell = row.insertCell()
    const submit_button = document.createElement("BUTTON")
    submit_button.innerHTML = "Submit"
    submit_button.setAttribute("onclick", "submit()")
    cell.appendChild(submit_button)

}

function range_dropdown(start, end) {
    const select = document.createElement("SELECT")
    for (let i = start; i <= end; i++) {
        option = document.createElement("OPTION")
        option.value = i
        option.text = i
        select.appendChild(option)
    }
    return select
}

function submit() {
    year = document.getElementById("year_select").value
    month = document.getElementById("month_select").value
    day = document.getElementById("day_select").value

    date = year + "-" + month + "-" + day

    len = parseInt(document.getElementById("length_select").value)
    amt = parseInt(document.getElementById("amount_select").value)

    dict = {
        "date" : date,
        "length" : len,
        "whittle_amount" : amt
    }

    console.log(dict)
}

// function add_row(element) {
//     /*
//     pop a new row into the table
//     */

//     const row = element.parentNode.parentNode
//     const table = row.parentNode.parentNode
//     const type = table.getAttribute("data_type")
//     row.setAttribute("new", "true")

//     const header_row = row.parentNode.parentNode.tHead.rows[0]
//     for (let i = 1; i < header_row.cells.length; i++) {
//         const cell = row.insertCell()
//         cell.setAttribute("onclick", "make_editable(this, '" + type + "')")
//     }
//     row.cells[0].innerHTML = ""
//     make_editable(row.cells[0])
// }
