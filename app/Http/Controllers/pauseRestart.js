const log = require('../../../logger.js');
const env = require('../../../env');
const fs = require("fs");
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

module.exports = class PauseRestart
{
    /**
     * コンストラクタ
     * @param req
     * @param res
     * @param {socket} socket
     */
    constructor(req, res, socket)
    {
        let self = this;
        let i=0;
        this.req = req;
        this.res = res;
        this.socket = socket;
        this.isGet=false;
        this.state = "";
        socket.on('simpleState', (e)=>{self.onSimpleState(e)});
        // socket.on('simpleState', ()=>{self.onSimpleState()});
        // socket.on('runToServer', ()=>{self.onRunToServer()});
        // socket.on('error', (e)=>{self.onError(e)});
        socket.emit('simpleState');
        (async () => {
            await sleep(20);
            let err="";
            for(i=0;i<5;++i){
                if(self.isGet == true){
                    break;
                }
                await sleep(20);
            }

            if( i>=5 ){
                err = "サーバーの情報取得失敗" ;
            }else if(self.state=='run'){
                err = "既に実行中です。";
            }
            if(err!=''){
                log.request.error(err);
                console.log(err);
                res.send({
                    state:'err',
                    text:err
                });
            }else{
                self.socket.emit("runToServer");
                res.send({state:'ok'});
            }
        })();
    }
    onSimpleState(e)
    {
        this.state = e.state;
        this.isGet=true;
    }
};