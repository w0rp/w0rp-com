#!/usr/bin/env bash

set -eu

# Generate _index.md files for each archive month.
# This will make Hugo generate pages for everything monthly archive.
rm -rf content/blog/date

while read -r; do
    mkdir -p "content/blog/date/$REPLY"
    (
        echo '---'
        echo 'layout: archive_month'
        echo -n 'month: "'
        echo -n "$REPLY"
        echo '"'
        echo '---'
    ) > "content/blog/date/$REPLY/_index.md"
done < <(grep '^date: 2[0-1][0-9][0-9]-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$' content/blog/post/*.md \
    | sed 's/^.*date: \(2[0-1][0-9][0-9]\)-\([0-1][0-9]\).*$/\1\/\2/' \
    | sort -u)

# Generate the public pages with Hugo.
hugo
