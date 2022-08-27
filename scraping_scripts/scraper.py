import json
from bs4 import BeautifulSoup
from helper import get_opera_driver, get_data

website = "https://www.whoscored.com"

# Load a Dictionary containing every team and his respective team id
f = open("team-ids-22-23.json")
team_dict = json.load(f)


# Load already scraped games and convert it to a list
f = open("scraped-games-22-23.json")
games_list = json.load(f)


for team, team_id in team_dict.items():

    if team not in games_list.keys():
        games_list[team] = []

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
        if link in games_list[team]:
            continue
        else:
            df, title = get_data(website + link, team_id)
            df.to_csv("/home/tomas/Desktop/test/" + team + "/" + title + ".csv", index=False)
            games_list[team] += [link]

    break


with open("scraped-games-22-23.json", "w") as outfile:
    json.dump(games_list, outfile)
