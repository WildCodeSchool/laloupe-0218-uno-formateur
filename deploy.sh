#!/bin/bash

owner="$(cut -d'/' -f1 <<< ${TRAVIS_REPO_SLUG})"
repo="$(cut -d'/' -f2 <<< ${TRAVIS_REPO_SLUG})"

if [ -n "${TRAVIS_PULL_REQUEST}" -a "${TRAVIS_PULL_REQUEST}" != "false" ]; then
  npm run build -- --base-href "https://${owner}.github.io/${repo}/pr/${TRAVIS_PULL_REQUEST}/" -op "./dist/pr/${TRAVIS_PULL_REQUEST}" -dop false
  angular-cli-ghpages --repo=https://GH_TOKEN@github.com/${TRAVIS_REPO_SLUG}.git --name="Travis bro" --email=travis@wildcodeschool.fr
  npm run lh --score=70 https://${owner}.github.io/${repo}/pr/${TRAVIS_PULL_REQUEST}/
elif [ "${TRAVIS_BRANCH}" = "master" ]; then
  npm run build -- --base-href "https://${owner}.github.io/${repo}/" -dop false
  angular-cli-ghpages --repo=https://GH_TOKEN@github.com/${TRAVIS_REPO_SLUG}.git --name="Travis bro" --email=travis@wildcodeschool.fr
fi
