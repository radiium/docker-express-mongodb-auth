db.auth(adminUserName, adminPassword);

db = db.getSiblingDB(appDbName)

var user = {
  "user" : appUserName,
  "pwd" : appPassword,
  roles : [{"role": "readWrite", "db": appDbName}]
};

db.createUser(user);