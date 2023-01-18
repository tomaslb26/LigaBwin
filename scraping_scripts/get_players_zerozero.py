from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
import pandas as pd

teams = {"Benfica" : 4, "Braga": 15, "Porto": 9, "Sporting": 16, "Casa-Pia": 2412, "Vitoria-de-Guimaraes": 18,
         "Arouca": 3555, "Rio-Ave": 31, "Chaves": 20, "Boavista": 5, "Portimonense": 33, "Vizela": 2197,
         "Famalicao": 2175, "Estoril" : 1734, "Santa-Clara": 32, "Gil-Vicente": 11, "Maritimo": 12, "Pacos-de-Ferreira": 13}

players_list = []

def get_chrome_driver():
    chrome_options = Options()
    #chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(executable_path="/home/tomas/Desktop/chromedriver", options=chrome_options)
    return driver

driver = get_chrome_driver()

for key, value in teams.items():
    driver.get(f"https://www.zerozero.pt/equipa.php?id={value}&epoca_id=152")
    soup = BeautifulSoup(driver.page_source, "html.parser")
    
    mydivs = soup.find_all("div", {"class": "innerbox"})
    
    for div in mydivs:
        try:
            if div.find("div", {"class": "title"}).text in ["Guarda Redes", "Defesa", "Médio", "Avançado"]:
                players = div.find_all("div", {"class": "staff"})
                for player in players:
                    
                    if(len(player.attrs["class"]) == 1): status ="active"
                    else: status = "inactive"
                    
                    photo = player.find("div", {"class": "photo"})["style"].split("'")[1]
                    
                    name = player.find("div", {"class": "text"}).text
                    
                    number = player.find("div", {"class": "number"}).text
                    
                    players_list += [{"name": name, "number": number, "photo": photo, "team": key, "status": status}]
                    
        except:
            continue
    
driver.quit()
df = pd.DataFrame(players_list)

df = df[df["number"] != "-"]
df["number"] = df["number"].astype(int)

df.to_csv("/home/tomas/Desktop/LigaBwin/aux/players.csv", index = False)