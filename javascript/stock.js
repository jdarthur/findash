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
}

