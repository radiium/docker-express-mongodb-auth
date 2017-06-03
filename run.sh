#!/bin/sh

# Build container
# ttab  -a iTerm2


# Check if container already running
IS_RUNNING_APP=$(docker inspect --format="{{.State.Running}}" node_app 2> /dev/null)
IS_RUNNING_DB=$(docker inspect --format="{{.State.Running}}" node_db  2> /dev/null)
if [[ $IS_RUNNING_APP || $IS_RUNNING_DB ]] ; then
    echo "Shutdown container"
    docker-compose down
fi


# Check if node module does not exist
DIRECTORY=./app/node_modules
if [[ ! -d "${DIRECTORY}" && ! -L "${DIRECTORY}" ]] ; then
    echo "Install npm packages"
    (cd ./client ; npm install)
fi

# Build app and db container
docker-compose build

# Run and init db container
docker-compose up -d mongo
docker exec -it node_db  bash -c "cd /scripts ; ls -la ; ./init.sh"

# Run app container
docker-compose up -d web
#docker exec -it node_app bash -c "cd app ; pm2 kill ; pm2 start --no-daemon process.json --env production"

docker-compose logs