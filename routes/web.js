var express = require('express');
const log = require('../logger.js');
const router = express.Router();
const fs = require("fs");
const socket = require('socket.io-client')('http://localhost:3001');

const ctrlDirPath='../app/Http/Controllers/';
const KeyFileUpdate = require(ctrlDirPath+'keyFileUpdate');
const PauseRestart = require(ctrlDirPath+'pauseRestart');
const DownloadCSVFile = require(ctrlDirPath+'downloadCSVFile');

function isExistFile(file) {
    try {
        fs.statSync(file);
        return true
    } catch(err) {
        if(err.code === 'ENOENT') return false
    }
}


/**
 * トップページ
 */
router.get('/', function(req, res, next) {
  res.render('index', { csrfToken: req.csrfToken(), title: 'Google 検索 キーワードヒット数' });
});

/**
 * キーワード アップロード
 */
router.post('/upload', KeyFileUpdate.middleware, function(req, res) {
    new KeyFileUpdate(req, res, socket);
});

/**
 * CSV ファイルのダウンロード
 */
router.get('/download', function(req, res, next) {
    new DownloadCSVFile(req, res, next,socket);
});


/**
 * 中断場所からリスタート
 */
router.post('/restart', function(req, res) {
    new PauseRestart(req, res, socket);
});

socket.on('connect', function(){
    console.log('Index WebSocket Client Connected. ' + (new Date()));
});
socket.on('disconnect', function(){
    // 切断したときに送信
    console.log('socket Connection Closed from Index' + (new Date()));
});



module.exports = router;
