import os
import requests
import json
import time
from datetime import datetime

API_KEY = os.environ["GNEWS_API_KEY"]
BASE_URL = "https://gnews.io/api/v4/top-headlines"


def fetch_news(category=None):
    params = {
        "lang": "ja",
        "country": "jp",
        "max": 10,
        "apikey": API_KEY
    }

    if category:
        params["category"] = category

    r = requests.get(BASE_URL, params=params)

    if r.status_code == 429:
        print("Rate limited. Waiting 15 seconds...")
        time.sleep(15)
        r = requests.get(BASE_URL, params=params)

    r.raise_for_status()
    return r.json()["articles"]


# def simplify(articles):
#     return [
#         {
#             "title": a["title"],
#             "url": a["url"],
#             "source": a["source"]["name"]
#         }
#         for a in articles
#     ]

def simplify(articles):
    return [
        {
            "title": a["title"],
            "description": a.get("description"),
            "content": a.get("content"),
            "url": a["url"],
            "image": a.get("image"),
            "publishedAt": a.get("publishedAt"),
            "source": a["source"]["name"]
        }
        for a in articles
    ]


print("Fetching general news...")
general = simplify(fetch_news())

time.sleep(15)

print("Fetching business news...")
business = simplify(fetch_news("business"))

output = {
    "updated": datetime.utcnow().isoformat(),
    "general": general,
    "business": business
}

os.makedirs("data", exist_ok=True)

with open("data/news.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("news saved")