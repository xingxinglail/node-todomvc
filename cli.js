#!/usr/bin/env node
const program = require('commander')
const pkg = require('./package')
const api = require('./index')

if (process.argv.length === 2) {
    api.showAll()
}

program
    .version(pkg.version)

program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const title = args.slice(0, -1).join(' ')
        api.add(title)
    })

program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear()
    })


program.parse(process.argv)
