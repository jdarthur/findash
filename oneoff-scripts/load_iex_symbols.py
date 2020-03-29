import requests
from pprint import pprint

import json

URL = "https://api.iextrading.com/1.0/ref-data/symbols"
TYPES = {}

def get_clean(url):

    data = json.loads(requests.get(url).content)

    not_shit = []
    for item in data:
        enabled = item.get("isEnabled", False)
        if enabled:

            name = item.get("name")
            if name == "":
                increment_type("no_name")
            else:
                symbol_type = item.get("type")
                increment_type(symbol_type)

                if symbol_type != "crypto":
                    # if symbol is enabled, name is not empty, and is not crypto,, we will add to db
                    not_shit.append(item)
        else:
            increment_type("not_enabled")


    # pprint(data[-1])
    return not_shit

def load_db(cleaned_list):
    for item in cleaned_list:
        add_symbol(item)

def increment_type(type_str):
    if TYPES.get(type_str, None) is None:
        TYPES[type_str] = 1
    else:
        TYPES[type_str] += 1

def add_symbol(item):
    name = item.get("name")
    symbol = item.get("symbol")

    print("{} ({})".format(symbol, name))





if __name__ == "__main__":
    clean = get_clean(URL)
    load_db(clean)

    pprint(requests.get("https://www.marketwatch.com/investing/stock/AAPL").content)

    # pprint(TYPES)
