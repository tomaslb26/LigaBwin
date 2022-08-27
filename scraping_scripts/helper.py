from selenium import webdriver
import json
from bs4 import BeautifulSoup
import re
import pandas as pd
from webdriver_manager.opera import OperaDriverManager
from calcs import fix_types, get_xt, clean_df, get_statistics


def get_opera_driver():
    options = webdriver.ChromeOptions()
    opera_profile = r"/home/tomas/.config/opera"
    options.add_argument("user-data-dir=" + opera_profile)
    options._binary_location = r"/usr/lib/x86_64-linux-gnu/opera/opera"
    driver = webdriver.Opera(executable_path=OperaDriverManager().install(), options=options)
    return driver


def get_data(link, teamId):
    driver = get_opera_driver()
    driver.get(link)

    soup = BeautifulSoup(driver.page_source, "lxml")
    driver.quit()

    re.compile("var matchCentreData = ({.*?})")

    data = soup.find("div", {"id": "multiplex-parent"}).find_next("script")

    event_data = str(data)

    dicte = event_data.split("matchCentreData: ")
    dicte = dicte[1].splitlines()
    x = dicte[0][:-1]

    matchdata = json.loads(x)
    x = pd.DataFrame.from_dict(matchdata["events"])
    home = pd.DataFrame.from_dict(matchdata["home"], orient="index")
    away = pd.DataFrame.from_dict(matchdata["away"], orient="index")

    if home[0]["teamId"] == teamId:
        players_dict = home[0]["players"]

    if away[0]["teamId"] == teamId:
        players_dict = away[0]["players"]

    title = home[0]["name"] + " - " + away[0]["name"]

    players = pd.DataFrame.from_dict(players_dict)
    players_numbers = players[["playerId", "shirtNo", "name"]].copy()

    x = x.join(players_numbers.set_index("playerId"), on="playerId")

    x = fix_types(x)
    x = clean_df(x, home[0]["name"], away[0]["name"], teamId)
    x = get_xt(x)

    get_statistics(x, teamId)

    driver.quit()

    return x, title
