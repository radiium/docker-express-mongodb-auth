#!/bin/sh


# Launch mongoDB with authentication
mongod --smallfiles --auth --storageEngine wiredTiger


# Create admin db user
sleep 5
echo "========================================="
echo "=> Create admin user/password"
mongo admin \
      --eval "var adminUserName = '$DB_ADMIN_USER_NAME'; \
              var adminPassword = '$DB_ADMIN_USER_PASS';" \
              create_admin.js


# Create user for ap db connection
sleep 2
echo "========================================="
echo "=> Create DB connection user"
mongo admin \
      --eval "var appDbName     = '$DB_APP_NAME'; \
              var appUserName   = '$DB_APP_USER_NAME'; \
              var appPassword   = '$DB_APP_USER_PASS'; \
              var adminUserName = '$DB_ADMIN_USER_NAME'; \
              var adminPassword = '$DB_ADMIN_USER_PASS';" \
              create_user.js


# Insert first app user
sleep 2
echo "========================================="
echo "=> Insert first app user"
mongo $DB_APP_NAME \
      --eval "var appDbName   = ''; \
              var appUserName = '$DB_APP_USER_NAME'; \
              var appPassword = '$DB_APP_USER_PASS'; \
              var userId      = '$APP_ID'; \
              var userName    = '$APP_USER'; \
              var userMail    = '$APP_MAIL'; \
              var password    = '$APP_PASS';" \
              insert_user.js
