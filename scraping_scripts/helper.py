from selenium import webdriver
import json
from json import JSONDecoder
from bs4 import BeautifulSoup
import re
import os
import pandas as pd
from selenium.webdriver.chrome.options import Options
from webdriver_manager.opera import OperaDriverManager
from webdriver_manager.chrome import ChromeDriverManager
from calcs import fix_types, get_fotmob_stats, get_xt, clean_df, get_statistics


def get_opera_driver():
    options = webdriver.ChromeOptions()
    opera_profile = r"/home/tomas/.config/opera"
    options.add_argument("user-data-dir=" + opera_profile)
    options._binary_location = r"/usr/lib/x86_64-linux-gnu/opera/opera"
    # driver = webdriver.Opera(executable_path=OperaDriverManager().install(), options=options)
    driver = webdriver.Opera(executable_path="/home/tomas/operadriver_linux64/operadriver", options=options)
    return driver


def get_chrome_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(executable_path="/home/tomas/Desktop/chromedriver", options=chrome_options)
    return driver


def get_whoscored(team_dict, games_list):

    for team, team_id in team_dict.items():

        if os.path.exists("/home/tomas/Desktop/test/" + team) == False:
            os.mkdir("/home/tomas/Desktop/test/" + team)

        website = "https://www.whoscored.com"

        if team not in games_list["whoscored"].keys():
            games_list["whoscored"][team] = []

        # Create opera driver in selenium - we use opera instead of chrome due to its vpn
        driver = get_opera_driver()

        links = []
        while links == []:
            driver.get("https://www.whoscored.com/Teams/" + str(team_id) + "/Fixtures/Portugal-" + team)
            soup = BeautifulSoup(driver.page_source, "html.parser")

            for link in soup.find_all("a"):
                arrOfString = link.get("href").split("Live/Portugal-Liga-Portugal-2022-2023")
                if len(arrOfString) != 1:
                    if links == []:
                        links += [link.get("href")]
                    if links[len(links) - 1] != link.get("href"):
                        links += [link.get("href")]
            print(links)
            driver.quit()

        for link in links:
            if link in games_list["whoscored"][team]:
                continue
            else:
                df, title = get_data(website + link, team_id, team)
                df.to_csv("/home/tomas/Desktop/test/" + team + "/" + title + ".csv", index=False)
                games_list["whoscored"][team] += [link]

            with open("scraped-games-22-23.json", "w") as outfile:
                json.dump(games_list, outfile)


def get_fotmob(games_list):

    driver = get_chrome_driver()

    driver.get("https://www.fotmob.com/leagues/61/matches/liga-portugal/by-round")
    soup = BeautifulSoup(driver.page_source, "html.parser")
    buttons = driver.find_elements_by_css_selector("button[type='button']")

    i = 34
    links = []
    while i > 0:
        buttons[2].click()
        soup = BeautifulSoup(driver.page_source, "html.parser")
        for link in soup.find_all("a"):
            arrOfString = link.get("href").split("match/")
            if len(arrOfString) != 1:
                links += [link.get("href")]
        i -= 1

    driver.quit()
    links = list(dict.fromkeys(links))

    for link in links:
        print(link)
        if link in games_list["fotmob"]:
            continue
        else:
            games_list["fotmob"] += [link]
            error = get_data_fotmob(link)
            if error == "error":
                continue
            with open("scraped-games-22-23.json", "w") as outfile:
                json.dump(games_list, outfile)


def extract_json_objects(text, decoder=JSONDecoder()):
    """Find JSON objects in text, and yield the decoded JSON data

    Does not attempt to look for JSON arrays, text, or other JSON types outside
    of a parent JSON object.

    """
    pos = 0
    while True:
        match = text.find("{", pos)
        if match == -1:
            break
        try:
            result, index = decoder.raw_decode(text[match:])
            yield result
            pos = match + index
        except ValueError:
            pos = match + 1


def get_data_fotmob(link):

    try:
        allShots = pd.read_csv("/home/tomas/Desktop/test/allShots2223.csv")
    except:
        allShots = pd.DataFrame()

    driver = get_chrome_driver()

    driver.get("https://www.fotmob.com" + link)

    pageSource = driver.page_source
    fileToWrite = open("page_source.html", "w", encoding="utf-8")
    fileToWrite.write(pageSource)
    fileToWrite.close()
    fileToRead = open("page_source.html", "r", encoding="utf-8")
    data = str(fileToRead.read())

    for result in extract_json_objects(data):
        continue

    driver.quit()

    get_fotmob_stats(result)

    try:
        data = result["props"]["pageProps"]["initialState"]["matchFacts"]["data"]
    except:
        return "error"

    teams = data["general"]
    round = data["general"]["matchRound"]
    data = data["content"]["shotmap"]["shots"]

    home = teams["homeTeam"]
    away = teams["awayTeam"]

    teams = [teams["homeTeam"]] + [teams["awayTeam"]]
    teams = pd.DataFrame(teams)
    shots = pd.DataFrame(data)
    shots = shots.join(teams.set_index("id"), on="teamId")
    shots["name"] = shots["name"].replace(" CP", "").replace("FC ", "")
    shots["homeTeam"] = home["name"].replace(" CP", "").replace("FC ", "")
    shots["awayTeam"] = away["name"].replace(" CP", "").replace("FC ", "")
    shots["round"] = round

    allShots = pd.concat([allShots, shots])
    allShots.to_csv("/home/tomas/Desktop/test/allShots2223.csv", index=False)


def get_data(link, teamId, team):
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

    get_statistics(x, teamId, team)

    driver.quit()

    return x, title
