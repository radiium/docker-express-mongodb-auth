#!/usr/bin/env node
var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync(process.argv[2], bcrypt.genSaltSync(8), null);
console.log(hash)