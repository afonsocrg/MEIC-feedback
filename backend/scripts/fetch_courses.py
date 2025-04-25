#! /usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import re
import json
from typing import Dict, List
import csv

class Course:
    def __init__(self, name: str, url: str):
        self.name = name
        self.url = url
    
    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "url": self.url
        }

def scrape_meic_courses() -> List[Course]:
    url = "https://fenix.tecnico.ulisboa.pt/cursos/meic-a/curriculo"
    result = []
    
    try:
        # Send GET request to the URL
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all divs with class "row small"
        course_rows = soup.find_all('div', class_='row small')
        
        # Print number of rows found for debugging
        print(f"Found {len(course_rows)} course rows")
        
        # Iterate through the rows
        for row in course_rows:
            # Find the first link in the row
            link = row.find('a')
            name = None
            url = None
            if link:
                name = link.text.strip()
                url = link.get('href')
                # print(f"Name: {name}")
                # print(f"URL: {url}")
            # print(row)
            # print("="*100)
            result.append(Course(name, url))
        return result
        
    
    except requests.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return []

def main():
    courses = scrape_meic_courses()
    
    # Convert to list of dictionaries for JSON serialization
    courses_data = [course for course in courses]

    # Remove duplicates and sort alphabetically
    courses_data = sorted(
        {course.name: course for course in courses_data}.values(),
        key=lambda x: x.name
    )

    # Save to CSV file
    with open('meic_courses.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'acronym', 'name', 'url'])  # Update header with id
        for i, course in enumerate(courses_data, 1):  # Start enumeration at 1
            writer.writerow([i, '', course.name, course.url])
    # Print summary
    print(f"Found {len(courses_data)} courses:")
    for course in courses_data:
        print(f"- {course.name}")

if __name__ == "__main__":
    main()