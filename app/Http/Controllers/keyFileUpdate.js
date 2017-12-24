const log = require('../../../logger.js');
const env = require('../../../env');
const fs = require("fs");

/**
 * アップロード
 */
const multer = require('multer');
const storage = multer.diskStorage({
    // ファイルの保存先を指定
    destination: function (req, file, cb) {
        cb(null, env.dir.tmp);
    },
    // ファイル名を指定(オリジナルのファイル名を指定)
    filename: function (req, file, cb) {
        cb(null, 'keyword.txt');
    }
});
const upload = multer({ storage: storage });

/**
 *
 * @type {module.KeyFileUpdate}
 */
module.exports = class KeyFileUpdate
{
    /**
     *
     * @returns {*}
     */
    static get middleware()
    {
        return upload.single('file');
    }
    static isExistFile(file) {
        try {
            fs.statSync(file);
            return true
        } catch(err) {
            if(err.code === 'ENOENT') return false
        }
    }
    /**
     * コンストラクタ
     */
    constructor(req, res, socket)
    {
        this.req = req;
        this.res = res;
        this.socket = socket;
        try{
            if(KeyFileUpdate.isExistFile(env.filePath.run)){
                let run = JSON.parse(fs.readFileSync(env.filePath.run,'utf8'));
                if(run.state === 'run'){
                    let err = "処理中にアップロードできません。";
                    log.request.error(err);
                    console.log(err);
                    this.socket.emit('error',{ state:'err', text:err});
                    return;
                }
            }
            fs.unlink(env.filePath.keyword, (err) => {
                if(err){
                    log.request.error('keyword.txt ファイル削除失敗. ' + err.message);
                    console.log('keyword.txt ファイル削除失敗',err);
                }
            });
            let items = KeyFileUpdate.convert(fs.readFileSync(env.filePath.keyword,'utf8'));
            if(items.length > env.maxKeyword){
                res.send({
                    state:'err',
                    text:"キーワード数("+items.length+")は、"+env.maxKeyword+" 個までです。"
                });
                return;
            }
            this.keywordJsonFileWrite(items);
            res.send('ok');
        }catch (e){
            let err = "keyword.txt 読み込みに失敗" + e.message;
            log.request.error(err);
            console.log('keyword.txt ファイル削除失敗',e);
            res.send({
                state:'err',
                text:"keyword.txt 読み込みに失敗"
            });
        }
    }

    /**
     *
     * @param {string} text
     * @returns {Array}
     */
    static convert(text)
    {
        let items = [];
        text.split(/\r\n|\r|\n/).filter((v) => {
            return v !== "";
        }).forEach(function(v){
            items.push({keyword:v,result:-1,endDate:null});
        });
        return items;
    }
    /**
     * Jsonキーワードファイルの書き込み
     * @param {array} text
     */
    keywordJsonFileWrite(items) {
        let self = this;

        let runObj = {
            state:"run",
            startDate:(new Date()),
            endDate:null,
            finished:0,
            items:items
        };
        fs.writeFile(env.filePath.run, JSON.stringify(runObj),(err) => {
            if(err){
                log.request.error('run.json 書き込み失敗. ' + err.message);
                self.socket.emit('error',{
                    state:'err',
                    text:'run.json 書き込み失敗. ' + err.message
                });
                return;
            }
            self.socket.emit("runToServer");
        });
    }
};