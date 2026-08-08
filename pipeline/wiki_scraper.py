#!/usr/bin/env python3
"""
WikiScraper - Wikipedia Turkish Biography Scraper for MemleketNere.
Parses tr.wikipedia.org biographies to extract birthplace (doğum yeri), photo, and gender.
Filters out Istanbul to focus on Turkey's other 80 provinces and districts.
"""

import os
import re
import json
import time
import urllib.parse
import urllib.request

WIKI_API_ENDPOINT = "https://tr.wikipedia.org/w/api.php"
HEADERS = {
    'User-Agent': 'MemleketNereBot/1.0 (https://github.com/memleketnere; contact@memleketnere.org)'
}

ISTANBUL_DISTRICTS = {
    'istanbul', 'adalar', 'arnavutköy', 'ataşehir', 'avcılar', 'bağcılar', 'bahçelievler',
    'bakırköy', 'başakşehir', 'bayrampaşa', 'beşiktaş', 'beykoz', 'beylikdüzü', 'beyoğlu',
    'büyükçekmece', 'çatalca', 'çekmeköy', 'esenler', 'esenyurt', 'eyüpsultan', 'fatih',
    'gaziosmanpaşa', 'güngören', 'kadıköy', 'kağıthane', 'kartal', 'küçükçekmece', 'maltepe',
    'pendik', 'sancaktepe', 'sarıyer', 'silivri', 'sultanbeyli', 'sultangazi', 'şile', 'şişli',
    'tuzla', 'ümraniye', 'üsküdar', 'zeytinburnu'
}

class WikiBioScraper:
    def __init__(self, output_dir="raw_data"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(os.path.join(output_dir, "images"), exist_ok=True)

    def _fetch_json(self, params):
        url = WIKI_API_ENDPOINT + "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))

    def search_category_members(self, category_title, limit=500):
        """Fetches list of articles inside a Turkish Wikipedia category."""
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": f"Kategori:{category_title}",
            "cmlimit": limit,
            "format": "json"
        }
        try:
            data = self._fetch_json(params)
            members = data.get("query", {}).get("categorymembers", [])
            return [m["title"] for m in members if m["ns"] == 0]
        except Exception as e:
            print(f"Error fetching category {category_title}: {e}")
            return []

    def get_article_details(self, page_title):
        """Parses article content, infobox, thumbnail image, and extracts birthplace & gender."""
        params = {
            "action": "query",
            "prop": "pageimages|revisions|categories",
            "titles": page_title,
            "piprop": "original|thumbnail",
            "pithumbsize": 800,
            "rvprop": "content",
            "rvslots": "main",
            "format": "json"
        }
        try:
            data = self._fetch_json(params)
            pages = data.get("query", {}).get("pages", {})
            page_id = list(pages.keys())[0]
            if page_id == "-1":
                return None
            
            page_data = pages[page_id]
            image_url = None
            if "original" in page_data:
                image_url = page_data["original"]["source"]
            elif "thumbnail" in page_data:
                image_url = page_data["thumbnail"]["source"]

            slots = page_data.get("revisions", [{}])[0].get("slots", {}).get("main", {})
            wikitext = slots.get("*", "")

            categories = [c.get("title", "") for c in page_data.get("categories", [])]
            cat_str = " ".join(categories).lower()
            gender = "female" if any(k in cat_str for k in ["kadın", "bayan", "doğumlu kadınlar"]) else "male"

            birth_place = self._extract_birth_place(wikitext)
            if not birth_place:
                return None

            bp_lower = birth_place.lower()
            if any(dist in bp_lower for dist in ISTANBUL_DISTRICTS):
                print(f"Skipping Istanbul birthplace: {birth_place} ({page_title})")
                return None

            return {
                "title": page_title,
                "gender": gender,
                "birth_place": birth_place,
                "image_url": image_url
            }

        except Exception as e:
            print(f"Error parsing article {page_title}: {e}")
            return None

    def _extract_birth_place(self, wikitext):
        match = re.search(r'doğum_yeri\s*=\s*([^|\n}]+)', wikitext, re.IGNORECASE)
        if match:
            clean = re.sub(r'\[\[|\]\]|\{\{|\}\}|<[^>]+>', '', match.group(1)).strip()
            clean = clean.split(',')[0].strip()
            return clean
        return None

if __name__ == "__main__":
    print("WikiBioScraper - Test Run (Standard Library)")
    scraper = WikiBioScraper()
    members = scraper.search_category_members("Trabzon doğumlular", limit=3)
    print(f"Found {len(members)} sample entries for Trabzon: {members}")
