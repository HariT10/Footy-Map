import requests

from bs4 import BeautifulSoup

import re

import json

url = "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup"

### Please set a user-agent and respect our robot policy https://w.wiki/4wJS. See also https://phabricator.wikimedia.org/T400119.
headers = {

    "User-Agent": "MLSStadiumScraper/1.0 (student project; contact: harishan.thilak@gmail.com)"


}



response = requests.get(url, headers = headers)


print(response.text[:500])

soup = BeautifulSoup(response.text, "html.parser")

#print the nummber of tables in the wiki page
print(len(soup.find_all("table")))

#print first row of the table

tables = soup.find_all("table")


stadiums = []

print(stadiums)



#go through each table and print the contents of row 2
for i, table in enumerate(tables):

    if i != 0:
        continue


    rows = table.find_all("tr")
    #colunms = table.find_all("td")
    print(f"\nTable {i}:")

    #counter = 0

    row = rows[1]
    cells = row.find_all("td")

    print(len(cells))

    for rowIndex, row in enumerate(rows):

        if rowIndex == 0:
            continue

        print(f"\nStadium row: ", rowIndex)

        cells = row.find_all("td")

        stadium_name = cells[0].get_text(strip=True)  # <- define here





        # image
        # extract image
        image = cells[0].find("img")
      
        image = cells[0].find("img")
        if image:
            image_url = image["src"]
            if "/thumb/" in image_url:
                # Split at /thumb/, then take the part after and remove the size suffix
                thumb_part = image_url.split("/thumb/")[1]  # e.g., "4/4b/.../120px-..."
                # Remove the last part (filename with size prefix)
                full_file_path = "/".join(thumb_part.split("/")[:-1])
                image_url = "https://upload.wikimedia.org/wikipedia/commons/" + full_file_path
        else:
            image_url = None




        # store in dict
        #stadium_name = cells[1].get_text(strip=True)
        stadiums.append({
            "Stadium_Name": stadium_name,
            "Team": cells[0].get_text(strip=True),
            
        })


        

        for i, cell in enumerate(cells):

            if i == 0:

                print(f"{i}: {cell.get_text(strip=True)}")

                image = cells[0].find("img")

                if image:
                    print(image["src"])

                else:
                    print("No image found")
            
            else:

                print(f"{i}: {cell.get_text(strip=True)}")

              


for stadium in stadiums:

    print(stadium)
    break


with open("dataCPL.json", "w") as json_file:

    json.dump(stadiums, json_file, indent=4)
    

        
