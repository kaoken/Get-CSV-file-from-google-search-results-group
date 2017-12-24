const log = require('../logger.js');
const env = require('../env');
const fs = require("fs");
const csvStringify = require('csv-stringify');
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

var socketServer;
const client = require('cheerio-httpcli');

if(env.server.https.valid){
    socketServer = require('https').createServer({
        key:  fs.readFileSync(env.server.https.key).toString(),
        cert: fs.readFileSync(env.server.https.cert).toString()
    });
}
else{
    socketServer = require('http').createServer();
}

const io = require('socket.io')(socketServer,{
    path: '/',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});
socketServer.listen(env.server.socketPort);


class ClientSocket
{
    static isExistFile(file) {
        try {
            fs.statSync(file);
            return true
        } catch(err) {
            if(err.code === 'ENOENT') return false
        }
    }

    /**
     *
     * @param {socket.io} socket
     * @param {SocketMgr} socketMgr
     */
    constructor(socket,socketMgr)
    {
        let self = this;
        self.socket = socket;
        self.socketMgr = socketMgr;
        self.state = "none";
        socket.on('state', ()=>{self.onState()});
        socket.on('simpleState', ()=>{self.onSimpleState()});
        socket.on('runToServer', ()=>{self.onRunToServer()});
        socket.on('error', (e)=>{self.onError(e)});
        socket.on('disconnect', ()=>{self.onDisconnect()});
        socket.on('disconnecting', ()=>{self.onDisconnecting()});
    }

    /**
     *
     */
    onDisconnect()
    {
        let self = this;
        //切断時
        self.socketMgr.onDisconnect(self);
        console.log('disconnect. ' + (new Date()));
    }

    /**
     *
     */
    onDisconnecting()
    {
        let self = this;
        // クライアントが切断されるときに起動されます（ただし、roomsまだ終了していません）。
        self.socketMgr.onDisconnecting(self);
        console.log('disconnecting. ' + (new Date()));
    }


    onError(o)
    {
        console.log('onError. ' + (new Date()),o);
        if( o.id!==undefined && o.id===env.server.serverWebID)
            io.emit('error',o);
    }

    /**
     *
     */
    onSimpleState()
    {
        let self=this;
        self.socket.emit('simpleState',{state:self.socketMgr.state});
    }
    /**
     * 状態を返す
     */
    onState()
    {
        let self=this;
        self.socketMgr.onState(self);
    }

    /**
     *
     */
    onRunToServer()
    {
        let self=this;
        self.socketMgr.onRunToServer(self);
    }
}





/**
 *
 */
class SocketMgr
{
    constructor()
    {
        let self = this;
        self.state = "none";
        self.clients = [];
        io.on('connection', (socket)=>{self.onConnection(socket)});
        // io.on('simpleState', ()=>{self.onSimpleState()});
        // io.on('runToServer', ()=>{self.onRunToServer()});
        // io.on('error', (e)=>{self.onError(e)});
    }

    /**
     * Create ソケット server.
     * @param {socket.io} socket
     */
    onConnection(socket)
    {
        let self = this;
        console.log('Socket server Connection accepted. ' + (new Date()),socket.id);
        self.clients[socket.id] = new ClientSocket(socket,self);
    }

    /**
     *
     * @param {ClientSocket} socket
     */
    onState(socket) {
        let self=this;
        if(ClientSocket.isExistFile(env.filePath.run)){
            try{
                let text = fs.readFileSync(env.filePath.run, 'utf8');
                let a = JSON.parse(text);
                let isPause=false;
                for(let i=0;i<a.items.length;++i){
                    if( a.items[i].result == -1){
                        isPause=true;
                        break;
                    }
                }
                a.existCSV=false;
                a.dateCSV=null;
                if(ClientSocket.isExistFile(env.filePath.CSV)){
                    a.existCSV=ClientSocket.isExistFile(env.filePath.CSV);
                    let stat = fs.statSync(env.filePath.CSV);
                    a.ctimeCSV=stat.ctime;
                }
                if(self.state==='run'){
                    a.state='run';
                }else if(isPause){
                    self.state = a.state='pause';
                }else{
                    self.state = a.state='none';
                }
                socket.socket.emit('state',a);
            }catch (e){
                let err = "キーワード処理 ファイル読み込みに失敗.[" + e.message +"]";
                log.request.error(err);
                console.log(err);
                io.emit('error',{ state:'err', text:err });
            }
            return;
        }
        socket.socket.emit('state',{
            state:'none',
            existCSV:ClientSocket.isExistFile(env.filePath.CSV)
        });
    }

    /**
     *
     * @param {ClientSocket} socket
     */
    onRunToServer(socket)
    {
        let self=this;
        console.log('runToServer  ' + (new Date()));
        if( self.state === 'run'){
            let err="既に実行中";
            log.request.error(err);
            console.log(err);
            io.emit('error',{ state:'err', text:err });
            return;
        }
        /**
         * CSVファイルの作成
         * @param a
         */
        let createCSVFile = function (a) {
            a.items.forEach(function (v) {
                delete v.endDate;
            });
            let newItems = [];
            Object.assign(newItems , a.items);
            csvStringify(newItems,{ delimiter: ',',quote:'"',quoted:true,quotedString:true },(_err, output) => {
                fs.writeFile(env.filePath.CSV,output,function(err){
                    if(err){
                        log.request.error("CSV ファイル作成に失敗."+err.message);
                        io.emit('error',{
                            state:'err',
                            text:"CSV ファイル作成に失敗"
                        });
                    }
                    a.existCSV=ClientSocket.isExistFile(env.filePath.CSV);
                    if(a.existCSV)
                        a.ctimeCSV=fs.statSync(env.filePath.CSV).ctime;
                    else
                        a.ctimeCSV=null;
                    io.emit('end',a);
                    self.state = 'end';
                    console.log("CSV ファイル書き込み終了.");
                });
            });
        };

        /**
         *
         */
        let runJsonReadFile = function () {
            fs.readFile(env.filePath.run, 'utf8', (err, text)=> {
                if(err){
                    log.request.error("キーワード処理 ファイル読み込みに失敗");
                    io.emit('error',{
                        state:'err',
                        text:"キーワード処理 ファイル読み込みに失敗"
                    });
                    return;
                }
                if(ClientSocket.isExistFile(env.filePath.CSV))
                    fs.unlink(env.filePath.CSV,(err)=>{});

                let a = JSON.parse(text);
                let itemCnt = 0;

                // 実行開始したことを知らせる
                io.emit('run',a);
                self.state = 'run';

                a.items.forEach(function(v,i){
                    if(v.result != -1){++itemCnt;return;}

                    client.fetch('https://www.google.com/search', { q: v.keyword }, (err, $, res, body)=> {
                        ++itemCnt;
                        if(err) return;
                        let n = $('#resultStats').text().match(/[0-9,]+/)[0].replace(/,/g,'');
                        io.emit('result',{
                            state:'result',
                            item:{keyword:v.keyword,result:n,endDate:new Date()}
                        });
                        a.items[i].result = n;
                        a.items[i].endDate = new Date();
                        console.log($('title').text() + ' ' + n);
                    });
                });
                (async () => {
                    do{
                        await sleep(100);
                        if( itemCnt === a.items.length ){
                            let isPause=false;
                            for(let i=0;i<a.items.length;++i){
                                if( a.items[i].result == -1){ isPause=true; break; }
                            }
                            try{
                                fs.writeFileSync(env.filePath.run, JSON.stringify({
                                    state:"end",
                                    startDate:a.startDate,
                                    endDate:new Date(),
                                    finished:itemCnt,
                                    items:a.items
                                }));
                                if(isPause){
                                    throw "一部のキーワードが検索できませんでした。";
                                }
                                createCSVFile(a);
                            }catch (e){
                                let err =e.message;
                                log.request.error(err);
                                console.log(err);
                                io.emit('error',{ state:'err', text:err });
                                //-----------------------------------------------
                                self.state = 'pause';
                                a.stete = 'pause';
                                io.emit('pause',a);
                            }
                            return;
                        }
                    }while(true);
                })();
            });
        };
        fs.access(env.filePath.run, (err)=> {
            if(err){
                if (err.code === 'ENOENT') {
                    log.request.error("実行するキーワードファイルが存在しない。");
                    socket.socket.emit('error',{
                        state:'err',
                        text:"実行するキーワードファイルが存在しない。"
                    });
                    return;
                }else if(err.code==='EBUSY'){
                    log.request.error("run.jsonのリソースが処理中またはロックされています。");
                    socket.socket.emit('error',{
                        state:'err',
                        text:"run.jsonのリソースが処理中またはロックされています。"
                    });
                    return;
                }else{
                    socket.socket.emit('error',{
                        state:'err',
                        text:"run.json で予期せぬエラー["+err.code+"]"
                    });
                    return;
                }
            }else{
                runJsonReadFile();
            }
        });
    }

    /**
     *
     * @param {ClientSocket} socket
     */
    onDisconnect(socket)
    {
        let self = this;
    }
    /**
     *
     * @param {ClientSocket} socket
     */
    onDisconnecting(socket)
    {
        let self = this;
        delete self.clients[socket.socket.id];
    }

}
new SocketMgr();
