var user = {
  "user": adminUserName,
  "pwd":  adminPassword,
  roles: [
    {"role" : "userAdminAnyDatabase", "db" : "admin"}
  ]
};

db.createUser(user);