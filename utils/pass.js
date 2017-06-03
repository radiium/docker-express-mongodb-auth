#!/usr/bin/env node
var bcrypt = require('./bCrypt');
var hash = bcrypt.hashSync(process.argv[2], bcrypt.genSaltSync(8), null);
console.log(hash)