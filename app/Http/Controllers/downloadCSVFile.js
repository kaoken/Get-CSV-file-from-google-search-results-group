const log = require('../../../logger.js');
const env = require('../../../env');
const fs = require("fs");

/**
 *
 * @type {module.DownloadCSVFile}
 */
module.exports = class DownloadCSVFile
{
    /**
     *
     * @param req
     * @param res
     * @param {socket} socket
     */
    constructor(req, res, next, socket)
    {
        let self = this;
        this.req = req;
        this.res = res;
        this.next = next;
        this.socket = socket;

        res.download(env.filePath.CSV, env.file.CSV, function(err){
            if (err) {
                console.log(err);
            } else {
                // decrement a download credit, etc.
            }
        });
    }
};