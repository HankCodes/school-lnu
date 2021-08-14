
const fs = require("fs");
const { promisify } = require("util");
const path = require('path')
const appendFile = promisify(fs.appendFile);

const formatErrorMessage = (message, error) => {
    return `
========= ${new Date()} =========
[Server error]: ${message}
   
${error}
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

module.exports.errorLogger = async (message, error) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await appendFile(path.resolve(__dirname + '/../../log/errorlog.txt'), formatErrorMessage(message, error))
        } else {
            console.error(formatErrorMessage(message, error))
        }
    } catch (error) {
        console.error('Could not write to error log', error);
    }
}

module.exports.accessLogger = async (message) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await appendFile(path.resolve(__dirname + '/../../log/accesslog.txt'), formatAccessLogMessage(message))
        } else {
            console.error(formatAccessLogMessage(message))
        }
    } catch (error) {
        console.error('Could not write to error log');
    }
}
    