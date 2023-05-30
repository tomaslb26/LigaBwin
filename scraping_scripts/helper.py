from selenium import webdriver
import json
from json import JSONDecoder
from bs4 import BeautifulSoup
import re
from unidecode import unidecode
import os
import pandas as pd
from selenium.webdriver.chrome.options import Options
from calcs import fix_types, get_fotmob_stats, get_xt, clean_df, get_statistics, plot_pass_network


def get_opera_driver():
    options = webdriver.ChromeOptions()
    opera_profile = r"/home/tomas/.config/opera"
    options.add_argument("user-data-dir=" + opera_profile)
    options._binary_location = r"/usr/lib/x86_64-linux-gnu/opera/opera"
    driver = webdriver.Opera(executable_path="/home/tomas/Desktop/operadriver_linux64/operadriver", options=options)
    return driver


def get_chrome_driver():
    chrome_options = Options()
    #chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(executable_path="/home/tomas/Desktop/chromedriver", options=chrome_options)
    return driver


def get_whoscored(team_dict, games_list):

    for team, team_id in team_dict.items():

        if os.path.exists("/home/tomas/Desktop/LigaBwin/data/" + team) == False:
            os.mkdir("/home/tomas/Desktop/LigaBwin/data/" + team)

        website = "https://www.whoscored.com"

        if team not in games_list["whoscored"].keys():
            games_list["whoscored"][team] = []

        # Create opera driver in selenium - we use opera instead of chrome due to its vpn
        driver = get_opera_driver()

        links = []
        while links == []:
            driver.get("https://www.whoscored.com/Teams/" + str(team_id) + "/Fixtures/Portugal-" + team)
            soup = BeautifulSoup(driver.page_source, "html.parser")
            driver.close()

            for link in soup.find_all("a"):
                arrOfString = link.get("href").split("Live/Portugal-Liga-Portugal-2022-2023")
                if len(arrOfString) != 1:
                    if links == []:
                        links += [link.get("href")]
                    if links[len(links) - 1] != link.get("href"):
                        links += [link.get("href")]
            driver.quit()

        for link in links:
            if link in games_list["whoscored"][team]:
                continue
            else:
                df, title = get_data(website + link, team_id, team)
                df.to_csv("/home/tomas/Desktop/LigaBwin/data/" + team + "/" + title + ".csv", index=False)
                games_list["whoscored"][team] += [link]

            with open("scraped-games-22-23.json", "w") as outfile:
                json.dump(games_list, outfile)



def get_fotmob(games_list):

    driver = get_chrome_driver()
    
    link_games = []
    ret_games = []

    driver.get("https://www.fotmob.com/leagues/61/matches/Liga-Portugal/by-round")
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.find_element_by_css_selector('.css-1tun44q-Button-applyMediumHover').click()
    driver.find_element_by_css_selector('.css-jojkf7-PrevNextButton').click()
    
    links = []
    
    soup = BeautifulSoup(driver.page_source, "html.parser")
    divs = soup.find_all('div', {'data-index': lambda value: value and int(value) < 33})
    for div in divs:
        games = div.find_all("a")
        link_games += [games]
    for ronda in link_games:
        for game in ronda:
            ret_games += [game['href']]
        
    driver.quit()
    links = list(dict.fromkeys(ret_games))

    for link in links:
        if link in games_list["fotmob"]:
            continue
        else:
            games_list["fotmob"] += [link]
            error = get_data_fotmob(link)
            if error == "error":
                print("Error")
                continue
            print(link)
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
        allShots = pd.read_csv("/home/tomas/Desktop/LigaBwin/data/allShotsLigaBwin2223.csv")
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
    
    try:
        data = result["props"]["pageProps"]
    except:
        return "error"
    
    '''
    try:
        error = get_fotmob_stats(result)
        if(error == "error"): return "error"
    except:
        return "error"
    
    '''


    teams = data["general"]
    round = data["general"]["matchRound"]
    data = data["content"]["shotmap"]["shots"]

    home = teams["homeTeam"]
    away = teams["awayTeam"]

    teams = [teams["homeTeam"]] + [teams["awayTeam"]]
    teams = pd.DataFrame(teams)
    shots = pd.DataFrame(data)
    shots = shots.join(teams.set_index("id"), on = "teamId")
    shots["name"] = shots["name"].replace(" CP", "").replace("FC ", "")
    shots["homeTeam"] = home["name"].replace(" CP", "").replace("FC ", "")
    shots["awayTeam"] = away["name"].replace(" CP", "").replace("FC ", "")
    shots["round"] = round

    allShots = pd.concat([allShots, shots])
    allShots.to_csv("/home/tomas/Desktop/LigaBwin/data/allShotsLigaBwin2223.csv", index=False)


def get_data(link, teamId, team):
    driver = get_opera_driver()
    driver.get(link)

    soup = BeautifulSoup(driver.page_source, "lxml")
    driver.close()

    re.compile("var matchCentreData = ({.*?})")

    data = soup.find_all("script")

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

    title = home[0]["name"] + " - " + away[0]["name"].replace(" AC", "")

    players = pd.DataFrame.from_dict(players_dict)
    players_numbers = players[["playerId", "shirtNo", "name"]].copy()

    x = x.join(players_numbers.set_index("playerId"), on="playerId")

    x = fix_types(x)
    x = clean_df(x, home[0]["name"], away[0]["name"], teamId)
    x = get_xt(x)
    
    all = pd.read_csv(os.path.join("/home/tomas/Desktop/LigaBwin/data/",team,"events_" + team + ".csv"))
    all = pd.concat([all,x])
    all.to_csv(os.path.join("/home/tomas/Desktop/LigaBwin/data/",team,"events_" + team + ".csv"), index = False)

    df = plot_pass_network(x, teamId)
    get_statistics(x, teamId, team)

    if os.path.exists("/home/tomas/Desktop/LigaBwin/data/PassingNetworks/" + team) == False:
        os.mkdir("/home/tomas/Desktop/LigaBwin/data/PassingNetworks/" + team)

    df.to_csv(os.path.join("/home/tomas/Desktop/LigaBwin/data/PassingNetworks",team,"PassNetwork" + title.replace(" - ", "").replace(" ","-") + ".csv"), index = False)

    driver.quit()

    return x, title

def name_conversion(team):
    team = team.replace(" CP", "").replace(" AC", "").replace(" FC", "").replace("FC ","")
    team = unidecode(team)
    if(team == "Pacos"): team = "Pacos de Ferreira"
    elif(team == "Vitoria"): team = "Vitoria de Guimaraes"
    return team

def get_fbref():
    df = pd.read_html('https://fbref.com/en/comps/32/Primeira-Liga-Stats')
    
    classification = df[0][['Rk','Squad','MP','W','D','L','GF','GA','GD','Pts','Attendance']]
    classification.columns = ["Position", "Team", "Games", "Wins", "Draws", "Losses", "Goals", "Goals Against", "Goal Difference", "Points", "Attendance"]
    classification["Team"] = classification["Team"].apply(name_conversion)
    
    classification.to_csv("/home/tomas/Desktop/LigaBwin/data/classification.csv", index = False)
    
    stats = df[2].iloc[: , :4]
    stats.columns = ["Team", "Players Used", "Average Age", "Possession"]
    
    misc = df[22].iloc[: , :12]
    misc.columns = ["Team", "Drop", "Drop_2", "Yellow Card", "Red Card", "Second Yellow", "Fouls", "Fouls Against", "Offside", "Crosses", "Interceptions", "Tackles won"]
    misc.drop(["Drop", "Drop_2"], axis = 1, inplace = True)
    
    misc = misc.join(stats.set_index("Team"), on = "Team")
    misc["Team"] = misc["Team"].apply(name_conversion)
    
    misc.to_csv("/home/tomas/Desktop/LigaBwin/data/misc.csv", index = False)