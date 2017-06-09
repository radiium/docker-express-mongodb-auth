#!/bin/sh

# Build container
# ttab  -a iTerm2

IS_RUNNING_APP=$(docker inspect --format="{{.State.Running}}" node_app 2> /dev/null)
IS_RUNNING_DB=$(docker inspect --format="{{.State.Running}}" node_db  2> /dev/null)
NODE_MODULE_DIR=./app/node_modules


# Check if container already running
if [[ $IS_RUNNING_APP || $IS_RUNNING_DB ]] ; then
    echo "Shutdown container"
    docker-compose down
fi

# Check if node module does not exist
if [[ ! -d "${NODE_MODULE_DIR}" && ! -L "${NODE_MODULE_DIR}" ]] ; then
    echo "Install npm packages"
    (cd ./app ; npm install)
fi

# Build app and db container
docker-compose build

# Run and init db container
docker-compose up -d mongo
docker exec -it node_db  bash -c "cd /scripts ; ls -la ; ./init.sh"

# Run app container
docker-compose up -d web

docker-compose logs