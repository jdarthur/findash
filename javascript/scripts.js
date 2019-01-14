function reqListener () {
    data = JSON.parse(this.responseText)
    create_table(data)
}

function initialize() {
    //console.log("test")
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/api/stocks");
    oReq.send();
}

function create_table(data) {
    let div = document.getElementById("main_div")
    let table = document.createElement("table")
    table.setAttribute("class", "tab")
    table.setAttribute("id", "stocks_table")
    headers = Object.keys(data[0])

    const thead = table.createTHead()
    const row = thead.insertRow()
    row.setAttribute("class", "tabheader")
    for (let i = 0; i < headers.length; i++) {
        cell = row.insertCell()
        cell.setAttribute("width", 100/headers.length + "%")
        cell.innerHTML = headers[i]
    }

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

    const new_row = tbody.insertRow(tbody.rows.length)
    const button_cell = new_row.insertCell()
    const button = document.createElement("button")
    button.setAttribute("onclick", "add_row(this)")
    button.innerHTML = "+"
    button_cell.appendChild(button)

    div.appendChild(table)
}

function add_row(element) {

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
    */
    
    const row = cell.parentNode
    if ((row.getAttribute("active") != "true")) {
        for (let i = 0; i < row.cells.length; i++) {
            const cell = row.cells[i]
            text_input = document.createElement("input")
            text_input.setAttribute("size", 10)
            text_input.value = cell.innerHTML
            cell.innerHTML = ""
            cell.appendChild(text_input)
        }
        //add plus button
        const button_cell = row.insertCell()
        const button = document.createElement("button")
        button.setAttribute("onclick", "save_row(this)")
        button.innerHTML = "Save"
        button_cell.appendChild(button)
        //mark this row as active
        row.setAttribute("active", true)
    }
}

function save_row(button) {
    const row = button.parentNode.parentNode
    let post = false
    if (row.getAttribute("new") == "true") {
        post = true
        row.setAttribute("new", "false")
    }

    //add plus button
    button.remove()
    row.deleteCell(row.cells.length - 1)
    row.setAttribute("active", false)

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
