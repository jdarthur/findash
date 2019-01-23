function save_row(button, api_endpoint, id_field=null) {
    /*
    Save a row to the database
    */
    const row = button.parentNode.parentNode
    let post = false
    let id = null
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
    if (!post) {
        id = data[id_field]
    }
    save_db(api_endpoint, data, id, post)
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
function save_db(endpoint, data, id=null, post=false) {
    /*
    save the data into the database via REST
    */
    console.log(data)
    let oReq = new XMLHttpRequest()
    oReq.addEventListener("load", putListener)
    if (post) {
        oReq.open("POST", endpoint)
    }
    else {
        oReq.open("PUT", endpoint + "/" + id)
    }

    oReq.setRequestHeader('Content-type','application/json; charset=utf-8');
    oReq.send(JSON.stringify(data))
}
