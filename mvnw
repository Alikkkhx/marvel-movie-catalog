#!/bin/sh
# Maven Wrapper for Linux/Docker
set -e

MAVEN_PROJECTBASEDIR="$(cd "$(dirname "$0")" && pwd)"
WRAPPER_JAR="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar"
WRAPPER_PROPERTIES="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.properties"

# Download wrapper jar if missing
if [ ! -f "$WRAPPER_JAR" ]; then
    WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
    echo "Downloading Maven Wrapper..."
    mkdir -p "$(dirname "$WRAPPER_JAR")"
    if command -v wget > /dev/null; then
        wget -q -O "$WRAPPER_JAR" "$WRAPPER_URL"
    elif command -v curl > /dev/null; then
        curl -sL -o "$WRAPPER_JAR" "$WRAPPER_URL"
    fi
fi

exec java \
    $MAVEN_OPTS \
    -Dmaven.multiModuleProjectDirectory="$MAVEN_PROJECTBASEDIR" \
    -classpath "$WRAPPER_JAR" \
    org.apache.maven.wrapper.MavenWrapperMain "$@"
