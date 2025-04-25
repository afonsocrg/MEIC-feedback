import subprocess
import os
import re
from datetime import datetime

# Read the course IDs from the SQL file
def get_course_ids():
    course_ids = {}
    with open('backend/scripts/meic_courses.csv', 'r') as f:
        # Skip header row
        next(f)
        for line in f:
            id, acronym, name, url = line.strip().split(',')
            if acronym:  # Only include courses with acronyms
                course_ids[acronym] = int(id)
    return course_ids

def get_git_blame(file_path):
    try:
        result = subprocess.run(
            ['git', 'blame', '--porcelain', file_path],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running git blame on {file_path}: {e}")
        return None

def parse_git_blame(blame_output):
    if not blame_output:
        return []
    
    feedback_entries = []
    current_entry = None
    
    for line in blame_output.split('\n'):
        if line.startswith('author '):
            if current_entry:
                feedback_entries.append(current_entry)
            current_entry = {'author': line[7:], 'date': None, 'content': []}
        elif line.startswith('author-time '):
            if current_entry:
                timestamp = int(line[11:])
                current_entry['date'] = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
        elif line.startswith('\t'):
            if current_entry:
                current_entry['content'].append(line[1:])
    
    if current_entry:
        feedback_entries.append(current_entry)
    
    return feedback_entries

def generate_sql_inserts(course_id, feedback_entries):
    sql_statements = []
    for entry in feedback_entries:
        if not entry['content']:
            continue
            
        content = ' '.join(entry['content']).replace("'", "''")
        sql = f"INSERT INTO feedback (course_id, author, date, content) VALUES ({course_id}, '{entry['author']}', '{entry['date']}', '{content}');"
        sql_statements.append(sql)
    return sql_statements

def main():
    course_ids = get_course_ids()
    all_sql_statements = []
    
    for filename in os.listdir('courses'):
        if not filename.endswith('.md'):
            continue
            
        acronym = filename[:-3]  # Remove .md extension
        if acronym not in course_ids:
            print(f"Warning: No course ID found for acronym {acronym}")
            continue
            
        file_path = os.path.join('courses', filename)
        blame_output = get_git_blame(file_path)
        feedback_entries = parse_git_blame(blame_output)
        
        sql_statements = generate_sql_inserts(course_ids[acronym], feedback_entries)
        all_sql_statements.extend(sql_statements)
    
    # Write all SQL statements to a file
    with open('backend/scripts/populate_feedback.sql', 'w') as f:
        f.write('\n'.join(all_sql_statements))
    
    print(f"Generated {len(all_sql_statements)} feedback entries")

if __name__ == '__main__':
    main() 