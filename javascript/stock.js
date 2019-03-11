/*
scripts for the One Stock page

Functionality:
    - Load all stock metadata from the database


author: jdarthur
date: 19 Feb 2019
*/
var types = [
    "stock",
]

var divs = {
    "stock" : "stocks_div",
}

var symbol = "AAPL"
function initialize() {

    const urlParams = new URLSearchParams(window.location.search);
    symbol = urlParams.get('symbol');

    get_stock()
}


function get_listener() {
    /*
    get list data via REST
    */
    let data = JSON.parse(this.responseText)
    //create_table(type, data)
    console.log(data)
    create_info(data)
}

function get_stock() {
    let oReq = new XMLHttpRequest()
    oReq.addEventListener("load", get_listener)
    oReq.open("GET", "/api/stock/" + symbol)
    oReq.send()
}

function create_info(data) {
    const main = document.getElementById("stock_div")
    const h2 = document.createElement("h2")
    h2.innerHTML = data['name'] + " (" + data['symbol'] + ")"
    main.appendChild(h2)

    const p = document.createElement("p")
    let summary = ""
    summary += "Sector: " + data['sector'] + "<br>"
    summary += "Exchange: " + data['exchange'] + "<br>"

    p.innerHTML = summary
    main.appendChild(p)
    main.appendChild(create_graph_section())
}

function create_graph_section() {
    const div = document.createElement("div")
    div.setAttribute("id", "graph")
    const start_date = date_select()
    const end_date = date_select()
    const submit = document.createElement("button")
    submit.innerHTML = "Submit"
    submit.setAttribute("onclick", "get_graph()")

    const image_holder = document.createElement("div")
    image_holder.setAttribute("id",  "image_holder")
    image_holder.setAttribute("style", "display: block;")

    div.appendChild(start_date)
    div.appendChild(end_date)
    div.appendChild(submit)
    div.appendChild(image_holder)
    return div
}

function graph_listener() {
    /*
    get list data via REST
    */
    let data = JSON.parse(this.responseText)
    const div = document.getElementById("image_holder")
    img = document.createElement("img")
    img.setAttribute("src", "/" + data['filename'])
    if (div.childNodes.length != 0) {
        div.removeChild(div.firstChild)
    }
    div.appendChild(img)
    console.log(data)
}

function get_graph() {

    graph_holder = document.getElementById("graph")
    data = {
        start_date: get_date(graph_holder.childNodes[0]),
        end_date: get_date(graph_holder.childNodes[1]),
        symbol: symbol
    }

    params = ""
    for (let key in data) {
        params += key + "=" + data[key] + "&"
    }
    params = params.substring(0, params.length - 1)

    console.log(params)
    let oReq = new XMLHttpRequest()
    oReq.addEventListener("load", graph_listener)
    oReq.open("GET", "/api/graph?" + params)
    oReq.send()
}
