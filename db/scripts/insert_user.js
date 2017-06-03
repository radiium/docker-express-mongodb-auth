db.auth(appUserName, appPassword);

var user = {
    "username": userName,
    "password": password
};

db.users.insert(user);