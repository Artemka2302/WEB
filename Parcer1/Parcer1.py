from dataclasses import replace
from tabulate import tabulate
import requests
from bs4 import BeautifulSoup
import pandas as pd

url = 'https://sneakerhead.ru/shoes/sneakers/men/'
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')
cards = soup.find_all('div', class_='product-card')
NP = []
c = 0
outNP = []
nums = []
for card in cards:
    name = card.find('a', class_='product-card__link')
    price = card.find('span', class_='product-card__price-value')
    if name is not None and price is not None:

        name_text = name.get_text(strip=True)
        name_text = name_text.replace("\n\t\t\t\t\t", '').replace('\n', '')
        price_text = price.get_text(strip=True)
        price_text = price_text.replace("\xa0", '').replace('₽', '')
        NP.append([name_text, price_text])


sorted_NP = sorted(NP, key=lambda x: x[1], reverse=False)


def num(n):
    if n >= 4:
        for i in range(1, n):

            if i < 4:
                nums.append(i)
            if i == (n // 2) - 1 or i == (n // 2) or i == (n // 2) + 1:
                nums.append(i)
            if i > n - 4:
                nums.append(i)

        return nums

for i in range(len(sorted_NP)):
    if i in num(len(sorted_NP)):
        outNP.append(sorted_NP[i])

df = pd.DataFrame(outNP, columns=['Name', 'Price'])
print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))












