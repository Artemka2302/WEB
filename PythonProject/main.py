from http.client import responses
import json
import telebot
import requests
import time


TELEGRAM_TOKEN = "token"
WEATHERBIT_KEY = "KEY"git


bot = telebot.TeleBot(TELEGRAM_TOKEN)
@bot.message_handler(commands=['start'])
def send_welcome(message):
    text_1 = "Приветствую в ПРОГНОЗЩИКЕ. Если хотите узнать погоду пишите /weather"
    bot.reply_to(message, text_1)

@bot.message_handler(commands=['weather'])
def show_weather(message):
    response = requests.get(
        "https://api.weatherbit.io/v2.0/current",
        params={
            "key": WEATHERBIT_KEY,
            "city": "Moscow",
            "lang": "ru",
            "units": "M"
        }
    )
    data = response.json()
    weather_info = data['data'][0]
    app_temp = weather_info['app_temp']
    snow = weather_info['snow']
    osadki = weather_info['precip']
    city = weather_info['city_name']
    temperature = weather_info['temp']
    description = weather_info['weather']['description']

    text = f"""Погода в {city}: {temperature} °C {description}. Ощущается как {app_temp}. Осадки у нас {osadki}, а снег идет {snow}"""
    bot.reply_to(message, text)


if __name__ == '__main__':
    bot.polling(none_stop=True)
