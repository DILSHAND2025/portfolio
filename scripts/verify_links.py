import re
import os
import sys
from bs4 import BeautifulSoup

def audit_file(filepath):
    print(f"\n--- Auditing {filepath} ---")
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    all_ids = set(tag['id'] for tag in soup.find_all(id=True))
    print(f"Found {len(all_ids)} elements with IDs.")

    # Check internal hash links
    hash_links = [a['href'] for a in soup.find_all('a', href=True) if a['href'].startswith('#')]
    broken_hashes = []
    for h in hash_links:
        target = h[1:]
        if target and target not in all_ids:
            broken_hashes.append(h)

    if broken_hashes:
        print(f"FAIL: Broken anchor targets: {broken_hashes}")
        return False
    else:
        print(f"PASS: All {len(hash_links)} in-page anchor links are valid.")

    # Check local relative file paths
    local_links = [a['href'] for a in soup.find_all('a', href=True) if not a['href'].startswith(('http://', 'https://', '#', 'mailto:', 'tel:', 'javascript:'))]
    broken_files = []
    base_dir = os.path.dirname(filepath)
    for l in local_links:
        clean_path = l.split('#')[0].split('?')[0]
        if clean_path:
            full_path = os.path.normpath(os.path.join(base_dir, clean_path))
            if not (os.path.exists(full_path) or os.path.exists(full_path + '.html') or os.path.isdir(full_path)):
                broken_files.append((l, full_path))

    if broken_files:
        print(f"FAIL: Broken local files: {broken_files}")
        return False
    else:
        print(f"PASS: All {len(local_links)} local relative links exist on disk.")

    return True

ok1 = audit_file('index.html')
ok2 = audit_file('resume/index.html')

if ok1 and ok2:
    print("\nSUCCESS: All files, anchors, and links are 100% valid!")
else:
    sys.exit(1)
