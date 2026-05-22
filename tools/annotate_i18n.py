#!/usr/bin/env python3
"""
Simple utility to scan HTML/PHP files and insert data-i18n-key attributes
for elements whose visible English text matches entries in i18n/en.json.

Usage:
    python tools/annotate_i18n.py [--dry-run]

This script makes a best-effort, not perfect, injection. It creates a .bak
backup for changed files.
"""
import os
import re
import json
import argparse

ROOT = os.path.dirname(os.path.dirname(__file__))
EN_JSON = os.path.join(ROOT, 'i18n', 'en.json')

def load_translations():
    with open(EN_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def scan_files():
    exts = ('.html', '.php')
    for dirpath, dirs, files in os.walk(ROOT):
        # skip node_modules, .git, tools dir except this script
        if any(part in ('node_modules', '.git') for part in dirpath.split(os.sep)):
            continue
        for fn in files:
            if fn.endswith(exts):
                yield os.path.join(dirpath, fn)

def annotate_file(path, translations):
    changed = False
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()

    out = src
    total_inserts = 0

    for key, value in translations.items():
        if not isinstance(value, str) or not value.strip():
            continue
        v = value.strip()
        esc = re.escape(v)

        # 1) Text nodes like <span>Value</span>
        pattern = re.compile(r'(<([a-zA-Z0-9\-]+)([^>]*)>)(\s*' + esc + r'\s*)(</\2>)', flags=re.IGNORECASE)

        def repl(m):
            opening = m.group(1)
            attrs = m.group(3) or ''
            if 'data-i18n-key' in opening:
                return m.group(0)
            new_open = opening[:-1] + ' data-i18n-key="' + key + '">'
            return new_open + m.group(4) + m.group(5)

        new_out, n = pattern.subn(repl, out)
        if n:
            total_inserts += n
            out = new_out

        # 2) placeholders: <input placeholder="Value" ...>
        ph_pattern = re.compile(r'(<(input|textarea|button)[^>]*?)\bplaceholder\s*=\s*"' + esc + r'"([^>]*>)', flags=re.IGNORECASE)

        def repl_ph(m):
            opening = m.group(1)
            if 'data-i18n-key' in opening:
                return m.group(0)
            return opening + ' data-i18n-key="' + key + '" placeholder="' + v + '"' + m.group(3)

        new_out, n2 = ph_pattern.subn(repl_ph, out)
        if n2:
            total_inserts += n2
            out = new_out

    if total_inserts and out != src:
        changed = True
    return changed, out, total_inserts

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    translations = load_translations()
    files = list(scan_files())
    print('Scanning', len(files), 'files...')
    summary = {}

    for path in files:
        changed, out, inserts = annotate_file(path, translations)
        if changed:
            summary[path] = inserts
            print('Would update' if args.dry_run else 'Updating', path, '-', inserts, 'insert(s)')
            if not args.dry_run:
                bak = path + '.bak'
                with open(bak, 'w', encoding='utf-8') as f:
                    f.write(open(path, 'r', encoding='utf-8').read())
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(out)

    print('Done. Files changed:', len(summary))

if __name__ == '__main__':
    main()
