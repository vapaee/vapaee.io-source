#!/bin/bash

if [ "$1" != "" ]; then
    COMMENT="$1"
else
    COMMENT="save";
fi

rm /var/www/pivot-cards/pivot -fr


git add -A

# get current br anch name
# https://stackoverflow.com/a/1593487/2274525
BRANCH=$(git symbolic-ref -q HEAD)
BRANCH=${BRANCH##refs/heads/}
BRANCH=${BRANCH:-HEAD}
echo "saving branch $BRANCH: $COMMENT"


# execute pull if needed
# https://stackoverflow.com/a/57447999/2274525
LAST_UPDATE=`git show --no-notes --format=format:"%H" $BRANCH | head -n 1`
LAST_COMMIT=`git show --no-notes --format=format:"%H" origin/$BRANCH | head -n 1`
git remote update
if [ $LAST_COMMIT != $LAST_UPDATE ]; then
        echo "Updating your branch $BRANCH"
        git pull --no-edit
else
        echo "Updated!"
fi

git commit -m "$COMMENT"
git push
