window.util = require("./util/util").default;
window.moment = require("moment");
let momentja = require('moment/locale/ja'); // browserifyでライブラリを読み込ませるのに必要

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

require('./vue.js');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
//Vue.component('example', require('./components/Example.vue'));
const app = new Vue({
    el: '#app',
    created:function(){
        let self = this;
        Echo.on('connect', function(){
            console.log('Connect from browser.');
            Echo.emit('state');
        });
        Echo.on('disconnect', function(){
            console.log('Disconnect from browser.');
        });
        Echo.on('state', function(e){
            console.log('state from browser.',e);
            self.isRestart=false;
            if(e.state==='run'){
                self.state = 'run';
                self.items = e.items;
                self.finished = e.finished;
                self.$toastr('success', {
                    title: '',
                    msg: 'キーワードを解析中です。'
                });
            }if(e.state==='pause'){
                self.state = 'pause';
                self.items = e.items;
                self.isRestart=true;
                self.$toastr('warning', {
                    title: '',
                    msg: '一部、未取得のキーワードがあります。'
                });
            }else{
                self.state = e.state;
                self.items = e.items||[];
            }
            self.existCSV=e.existCSV;
            self.ctimeCSV=e.ctimeCSV!==null?new Date(e.ctimeCSV):null;
        });
        Echo.on('error', function(data){
            self.$toastr('error', {
                title: 'エラー',
                msg: data.text
            });
        });
        Echo.on('run', function(data){
            self.state = 'run';
            self.finished = 0;
            self.items = data.items;
            self.$toastr('success', {
                title: '',
                msg: 'キーワード数の解析を始めました。'
            });
            console.log('run from browser.',data);
        });
        Echo.on('result', function(data){
            if( data.item !== undefined && data.item.idx <= self.items.length && data.item.idx >= 0)
            {
                self.finished++;
                self.isRestart=false;
                let v = self.items[data.item.idx];
                v.result        = data.item.result;
                v.titleCount    = data.item.titleCount;
                v.endDate       = new Date(data.item.endDate);
            }
            //console.log('result from browser.',data);
        });
        Echo.on('end', function(data){
            self.state = 'end';
            self.items = data.items;
            self.finished = data.items.length;
            self.existCSV = data.existCSV;
            self.ctimeCSV = new Date(data.ctimeCSV);

            self.$toastr('success', {
                title: '',
                msg: '全て取得しました。CSVファイルのダウンロードが可能です。'
            });
        });
    },
    methods: {
        onFileChange(e){
            let self = this;
            let files = e.target.files || e.dataTransfer.files;

            if (!files.length)return;

            const formData = new FormData();
            formData.append('file', files[0]);
            axios
                .post('/upload', formData)
                .then(function(response) {
                    let data = response.data;
                    if(data.state==='err'){
                        self.$toastr('error', {
                            title: 'エラー',
                            msg: data.text
                        });
                    }
                })
                .catch(function(error) {
                    self.$toastr('error', {
                        title: '予期せぬエラー',
                        msg: error.message
                    });
                })
        },
        onPauseRestart(e){
            let self = this;
            axios
                .post('/restart')
                .then(function(response) {
                    let data = response.data;
                    if(data.state==='err'){
                        self.$toastr('error', {
                            title: 'エラー',
                            msg: data.text
                        });
                    }else{
                        self.isRestart=false;
                    }
                })
                .catch(function(error) {
                    self.$toastr('error', {
                        title: '予期せぬエラー',
                        msg: error.message
                    });
                })
        },
        /**
         * CSVファイルのダウンロード開始
         */
        onDownloadCSVFile(){
            window.open('//'+location.hostname+':3000/download');
        }
    },
    data: function() {
        return {
            items:[],
            state : '',
            existCSV:false,
            ctimeCSV:null,
            isRestart:false,
            endDate:null,
            finished:0
        };
    }
});
//Vue.component('example', require('./components/Example.vue'));
