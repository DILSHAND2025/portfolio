import urllib.request
import sys

for path in ['/', '/resume/']:
    url = f'http://localhost:3000{path}'
    try:
        req = urllib.request.urlopen(url)
        print(f'SUCCESS: {url} returned HTTP {req.status}')
    except Exception as e:
        print(f'ERROR: {url} failed with {e}')
        sys.exit(1)

# Check index.html for specific updated keywords
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

checks = [
    '7.75 CGPA',
    '2024–2028',
    'Dilshand_83',
    '200+ Problems Solved',
    'phishguard-gdkk47ruk-dilshand2025.vercel.app',
    'Student Record Manager',
    'Event Manager App',
    '9944667158'
]

all_passed = True
for check in checks:
    if check in content:
        print(f'VERIFIED: found "{check}" in index.html')
    else:
        print(f'MISSING: "{check}" NOT found in index.html')
        all_passed = False

print('--- Resume checks ---')
with open('resume/index.html', 'r', encoding='utf-8') as f:
    res_content = f.read()

res_checks = [
    'CGPA: 7.75',
    '2024 – 2028',
    'Dilshand_83',
    '200+ problems',
    'phishguard-gdkk47ruk-dilshand2025.vercel.app',
    'Student Record Manager',
    'Event Manager App',
    '+91 9944667158'
]

for r_check in res_checks:
    if r_check in res_content:
        print(f'VERIFIED: found "{r_check}" in resume/index.html')
    else:
        print(f'MISSING: "{r_check}" NOT found in resume/index.html')
        all_passed = False

if all_passed:
    print('ALL CONTENT AND RESUME SYNC CHECKS PASSED!')
else:
    sys.exit(1)
