const log4js = require('log4js');
const logger = exports = module.exports = {};
log4js.configure({
    appenders: { cheese: { type: 'file', filename: "./storage/logs/result.log" } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});


logger.request = log4js.getLogger('cheese');