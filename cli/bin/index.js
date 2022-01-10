#! /usr/bin/env node

const yargs = require("yargs");
const utils = require('./utils.js')

const usage = "\nUsage: healthcheck";const options = yargs
      .usage(usage)
      .help(false)
      .version(false)
      .argv;

var sentence = utils.healthy();
//console.log("Hello World!");
