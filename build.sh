#!/usr/bin/env bash

TARGET=$@

if [ -z "$TARGET" ]; then
  echo "Target not specified"
  exit 1
fi


if [ ! -f package.json ]; then
  echo "package.json not found"
  exit 1
fi

# Function to extract a field from package.json
extract_field() {
  grep -oP "(?<=\"$1\": \")[^\"]*" package.json
}

NAME=$(extract_field "name")
HOMEPAGE=$(extract_field "homepage")
VERSION=$(extract_field "version")
DESCRIPTION=$(extract_field "description")
ENTRYPOINT=$(extract_field "module")
LICENSE=$(extract_field "license")


if [ -z "$NAME" ] || [ -z "$HOMEPAGE" ] || [ -z "$VERSION" ] || [ -z "$DESCRIPTION" ] || [ -z "$ENTRYPOINT" ] || [ -z "$LICENSE" ]; then
  echo "One or more required fields (name, homepage, version, description, module, license) not found"
  exit 1
fi

if [ "$TARGET" = "docker" ]; then
    IMAGENAME=ghcr.io/fjelloverflow/$NAME

    sudo docker build \
      -t "$IMAGENAME":latest -t "$IMAGENAME":"$VERSION" \
      --label "org.opencontainers.image.source=$HOMEPAGE" \
      --label "org.opencontainers.image.description=$DESCRIPTION" \
      --label "org.opencontainers.image.licenses=$LICENSE" .
else
    bun build $ENTRYPOINT --target=bun-$TARGET --compile --outfile $NAME.v$VERSION.$TARGET
fi


