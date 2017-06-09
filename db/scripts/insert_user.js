db.auth(appUserName, appPassword);

var user = {
    "id":       userId,
    "username": userName,
    "usermail": userMail,
    "password": password
};

db.users.insert(user);