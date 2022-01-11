#! /usr/bin/env node
const healthcheck = require('./healthcheck_util.js')
const passesperstation = require('./passesperstation_util.js')
const passesanalysis = require('./passesanalysis_util.js')
const passescost = require('./passescost_util.js')
const chargesby = require('./chargesby_util.js')
const resetstations = require('./resetstations_util.js')
const resetvehicles = require('./resetvehicles_util.js')
const resetpasses = require('./resetpasses_util.js')

require('yargs/yargs')(process.argv.slice(2))
  .command({
    command: 'healthcheck',
    //aliases: ['config', 'cfg'],
    desc: 'check connection with database server',
    //builder: (yargs) => yargs.default('value', 'true'),
    handler: (argv) => {
      console.log(`performing healthcheck`);
      healthcheck.healthy()
    }
  })
  .command({
    command: 'resetpasses',
    desc: 'reset initial passes records',
    handler: (argv) => {
      console.log('resetpasses')
      resetpasses.ret()
    }
  })
  .command({
    command: 'resetstations',
    desc: 'reset intial toll station records',
    handler: (argv) => {
      console.log('resetstations')
      resetstations.ret()
    }
  })
  .command({
    command: 'resetvehicles',
    desc: 'reset initial vehicle records',
    handler: (argv) => {
      console.log('resetvehicles')
      resetvehicles.ret()
    }
  })
  .command({
    command: 'passesperstation',
    desc: 'returns passes that occured in the specified station between the requested dates',
    builder: (yargs) => yargs
      .option('station', {
        desc: 'station',
        type: 'string',
        demandOption: true
      })
      .option('datefrom', {
        desc: 'date from (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('dateto',{
        desc: 'date to (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('format', {
        desc: 'format',
        type: 'string',
        demandOption: true
      }),
    handler: (argv) => {
      //console.log('passesperstation');
      passesperstation.ret(argv.station, argv.datefrom, argv.dateto, argv.format)
    }
  })
  .command({
    command: 'passesanalysis',
    desc: 'returns the list of events in op1 stations with op2 tags between specified dates',
    handler: (argv) => {
      //console.log('passesanalysis')
      passesanalysis.ret(argv.op1, argv.op2, argv.datefrom, argv.dateto, argv.format)
    },
    builder: (yargs) => yargs
      .option('op1', {
        desc: 'operator 1',
        type: 'string',
        demandOption: true
      })
      .option('op2', {
        desc: 'operator 2',
        type: 'string',
        demandOption: true
      })
      .option('datefrom', {
        desc: 'date from (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('dateto',{
        desc: 'date to (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('format', {
        desc: 'format',
        type: 'string',
        demandOption: true
      })
  })
  .command({
    command: 'passescost',
    desc: 'returns number and total cost of events in op1 stations with op2 tags',
    handler: (argv) => {
      //console.log('passesanalysis')
      passescost.ret(argv.op1, argv.op2, argv.datefrom, argv.dateto, argv.format)
    },
    builder: (yargs) => yargs
      .option('op1', {
        desc: 'operator 1',
        type: 'string',
        demandOption: true
      })
      .option('op2', {
        desc: 'operator 2',
        type: 'string',
        demandOption: true
      })
      .option('datefrom', {
        desc: 'date from (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('dateto',{
        desc: 'date to (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('format', {
        desc: 'format',
        type: 'string',
        demandOption: true
      })
  })
  .command({
    command: 'chargesby',
    desc: 'returns total number of events that happend in op stations and their cost, with tags of other operators',
    handler: (argv) => {
      //console.log('chargesby')
      chargesby.ret(argv.op, argv.datefrom, argv.dateto, argv.format)
    },
    builder: (yargs) => yargs
      .option('op', {
        desc: 'operator',
        type: 'string',
        demandOption: true
      })
      .option('datefrom', {
        desc: 'date from (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('dateto',{
        desc: 'date to (format: YYYYMMDD)',
        type: 'string',
        demandOption: true
      })
      .option('format', {
        desc: 'format',
        type: 'string',
        demandOption: true
      })
  })
  .command({
    command: 'admin',
    desc: 'for administrator purposes',
    handler: (argv) => {
      console.log('admin')
    }
  })
  // provide a minimum demand and a minimum demand message
  .demandCommand(1,1)
  .help()
  .version(true, "1.0.0", "1.0.0")
  .argv
