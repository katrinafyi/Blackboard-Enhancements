import os
import sys
import datetime as dt
from collections import namedtuple

def next_weekday(datetime, weekday):
    this_weekday = datetime.isoweekday()
    days_to_sunday = (weekday - this_weekday) % 7
    if (days_to_sunday):
        return datetime + dt.timedelta(days=days_to_sunday)
    else:
        return datetime

def prev_weekday(datetime, weekday):
    this_weekday = datetime.isoweekday()
    days_after_sunday = (this_weekday - weekday) % 7
    if (days_after_sunday):
        return datetime - dt.timedelta(days=days_after_sunday)
    else:
        return datetime

def parse_date(date_string):
    return dt.datetime.strptime(date_string, '%Y%m%d')

def date_str(datetime):
    return datetime.strftime('%Y-%m-%d')

def main():
    os.chdir(os.path.dirname(__file__) or '.')

    events = []

    with open('uqevents-.ics', 'r') as ics:
        for l in ics:
            if (l.startswith('SUMMARY:')):
                summary = l.replace('SUMMARY:', '').strip()
            elif l.startswith('DTSTART:'):
                date = l.replace('DTSTART:', '').split('T')[0]
            elif l.startswith('END:VEVENT'):
                events.append((date, summary))
    
    sem = {}
    week_defs = []
    for date_string, summary in sorted(events):
        l_summary = summary.lower().rstrip('*')
        date = parse_date(date_string)
        if ' semester ' in (' '+l_summary) and l_summary.endswith(' classes commence'):
            sem['name'] = summary.rstrip('*')[:-len(' classes commence')]
            sem['lname'] = sem['name'].lower()
            sem['term 1 start'] = date
        elif 'name' in sem:
            if l_summary == sem['lname'] + ' classes end before mid-semester break':
                sem['term 1 end'] = next_weekday(date, 7)
                week_defs.append(
                    date_str(sem['term 1 start']) 
                    + ' ' + date_str(sem['term 1 end'])
                    + ' 1 ' + sem['name']
                )
            elif l_summary == sem['lname'] + ' mid-semester break commences':
                sem['midsem start'] = date
            elif l_summary == sem['lname'] + ' classes recommence after mid-semester break':
                sem['midsem end'] = prev_weekday(date, 7)
                week_defs.append(
                    date_str(sem['midsem start']) 
                    + ' ' + date_str(sem['midsem end'])
                    + ' 1 Mid-semester Break — ' + sem['name']
                )

                sem['term 2 start'] = date
            elif l_summary == sem['lname'] + ' classes end':
                sem['term 2 end'] = next_weekday(date, 7)
                weeks_in_term_1 = int((sem['term 1 end'] - sem['term 1 start']) / dt.timedelta(days=7))
                week_defs.append(
                    date_str(sem['term 2 start']) 
                    + ' ' + date_str(sem['term 2 end'])
                    + ' ' + str(weeks_in_term_1+2) + ' ' + sem['name']
                )
                
            elif l_summary.startswith(sem['lname'] + ' revision period '):
                sem['revision start'] = date
            elif l_summary.startswith(sem['lname'] + ' examination period ') \
            and ' ends' not in l_summary:
                sem['revision end'] = date - dt.timedelta(days=1)
                sem['exams start'] = date

                week_defs.append(
                    date_str(sem['revision start'])
                    + ' ' + date_str(sem['revision end'])
                    + ' 1 Revision Period — ' + sem['name']
                )
            elif l_summary.startswith(sem['lname'] + ' examination period ends'):
                sem['exams end'] = next_weekday(date, 7)

                week_defs.append(
                    date_str(sem['exams start'])
                    + ' ' + date_str(sem['exams end'])
                    + ' 1 Examination Period — ' + sem['name']
                )

                print(sem) 
    with open('uqevents_parsed.txt', 'w', encoding='utf-8') as out:
        out.write('\n'.join(week_defs))

                

if __name__ == '__main__':
    main()