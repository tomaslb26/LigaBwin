import json
from bs4 import BeautifulSoup
from helper import get_whoscored, get_fotmob, get_fbref

# Load a Dictionary containing every team and his respective team id
f = open("team-ids-22-23.json")
team_dict = json.load(f)

# Load already scraped games and convert it to a list
f = open("scraped-games-22-23.json")
games_list = json.load(f)

#get_whoscored(team_dict,games_list)

#get_fbref()

get_fotmob(games_list)
