const fs = require("fs");
const { promisify } = require("util");
const path = require('path')
const appendFile = promisify(fs.appendFile);

const formatErrorMessage = (message, stack) => {
    return `
========= ${new Date()} =========
    ${message}
    
    ${stack}
============== END ==============

`
}

const formatAccessLogMessage = (message) => {
    return `
========= ${new Date()} =========
        [Server]: ${message}
============== END ==============
`
}

module.exports.errorLogger = async (message, stackTrace) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await appendFile(path.resolve(__dirname + '/../log/errorlog.txt'), formatErrorMessage(message, stackTrace))
        } else {
            
            console.error(formatErrorMessage(message, stackTrace))
        }
    } catch (error) {
        console.error('Could not write to error log');
    }
}

module.exports.accessLogger = async (message) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await appendFile(path.resolve(__dirname + '/../log/accesslog.txt'), formatAccessLogMessage(message))
        } else {
            console.error(formatAccessLogMessage(message))
        }
    } catch (error) {
        console.error('Could not write to error log');
    }
}
    