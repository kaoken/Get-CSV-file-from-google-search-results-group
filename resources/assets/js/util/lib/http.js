let gRefCount$1=0;

/**
 * 読み込み
 * @returns {{open: open, close: close}}
 */
export function loadingRender() {
    return {
        open: function(){
            ++gRefCount$1;
            if( !$('#kn-loading').length ){
                $('body').append(
                    "<div id='kn-loading'><div class='loading-img'>Loading</div></div>"
                );
            }
            return gRefCount$1;
        },
        close:function () {
            if( --gRefCount$1 <= 0 ){
                $(".overlay").show();
                gRefCount$1 = 0;
                if( $('#kn-loading').length ){
                    $('#kn-loading').remove();
                }
            }
            return gRefCount$1;
        }
    };
}
/**
 * 簡単なシンプルな送信を作る
 * @param {object} scope
 * @param {object} ctrl
 * @param {string} url
 * @param {object|null} data
 * @param {boolean} onlyOnceSubmit 一度送信に成功したら、それ以降送信不可能にするか
 * @returns {utilSimpleSubmitHttp}
 */
export function utilSimpleSubmitHttp(scope, ctrl, url, data, onlyOnceSubmit) {
    var ins = {};
    // 送信して成功したか？
    ins.isSubmitSuccess = false;
    // 送信中か？
    ins.isSubmitIn = false;
    // 送信後にエラーが発生したか？
    ins.isSubmitError = false;
    // エラーメッセージ
    ins.errorMessage = "";
    ins.isNotTimeMessage = false;
    // REST
    ins.method = 'POST';

    /**
     * 使用する場合はtrueをセット
     * @param isUse {boolean}
     */
    ctrl.setUseTimeMessage = function (isUse) {
        ins.isNotTimeMessage = isUse === true;
    }
    /**
     * 通信成功時呼び出される
     * @see ctrl.submit
     */
    ins.httpSuccess = function (scope_, response) {
        if( util.isFunction(ctrl.success))
            ctrl.success(scope_, response);
        if ( !util.isUndefined(response.data.success) ) {
            ins.isSubmitSuccess = true;
        }
    };
    /**
     * 通信失敗時呼び出される
     * @see ctrl.submit
     */
    ins.httpError = function (scope_, $error) {
        var response = $error.response;
        resetErrMessage();
        if( util.isDefined(response.data) && util.isDefined(response.data.error) ){
            var error = response.data.error;
            if(util.isObject(error)){
                error = Object.keys(error).map(function (key) {return error[key]});
            }
            if(util.isArray(error)){
                ins.errorMessage = '<ul>';
                error.forEach(function(record, i) {
                    ins.errorMessage += '<li>' + util.htmlEntityDecode(record) + "</li>\n";
                });
                ins.errorMessage += '</ul>';
            }else{
                ins.errorMessage += util.htmlEntityDecode(error);
            }
        }else{
            ins.errorMessage = "予期せぬエラーが発生しました。"
        }
        if( util.isFunction(ctrl.error))
            ctrl.error(scope_, response);

        drawErrMessage();
    };

    /**
     * 通信終了時呼び出される
     * @see ctrl.submit
     */
    ins.httpFinally = function (scope_) {
        if( util.isFunction(ctrl.finally))
            ctrl.finally(scope_);
        ins.isSubmitIn = false;
    }
    /**
     * 送信先のURLをセットする（変更する）
     * @param newUrl {string}
     */
    ctrl.setSimpleSubmitUrl = function(newUrl) {
        url = newUrl;
    };

    /**
     * @ngdoc method
     * @name submit
     * @description 送信する
     */
    ctrl.submit = function() {
        if( !ctrl.submitCheck() ) return;
        if( util.isFunction(ctrl.submitStart))
            ctrl.submitStart(scope);

        ins.isSubmitIn = true;
        if( util.isDefined(scope.$forceUpdate))scope.$forceUpdate();
        axios({
            method: ins.method,
            url: url,
            data: data
        })
        .then(response => {
            ins.httpSuccess(scope, response);
        }).catch( error => {
            if(util.isDefined(error.response) && util.isDefined(error.response.status)){
                ins.httpError(scope, error);
            }else{
                throw error;
            }
        })
        .then(()=>{
            ins.httpFinally(scope);
            if( util.isDefined(scope.$forceUpdate))scope.$forceUpdate();
        });
    };
    /**
     * @ngdoc method
     * @name LoginInstanceCtrl.resetErrMessage
     * @description エラー内容をリセットする
     * @kind function
     */
    var resetErrMessage = function() {
        ins.isSubmitError = false;
        ins.errorMessage = '';
    };

    /**
     * @ngdoc method
     * @name LoginInstanceCtrl.drawErrMessage
     * @description フォームにX秒、エラー内容を表示させる
     * @kind function
     */
    var drawErrMessage = function(){
        ins.isSubmitError = true;

        if( !ins.isNotTimeMessage ){
            setTimeout(function(){
                if( util.isDefined(scope.$forceUpdate)){
                    scope.$forceUpdate();
                }
                ins.isSubmitError = false;
            }, 10000);
        }
    };

    /**
     * 送信後のエラー内容
     * @returns {string}
     */
    ctrl.errorMessage = function () { return ins.errorMessage; };
    /**
     * 送信後にエラーが発生したか
     * @returns {boolean}
     */
    ctrl.isOccurError  = function () { return ins.isSubmitError; };
    /**
     * 送信に成功したか？
     * @returns {boolean}
     */
    ctrl.submitSuccess = function () { return ins.isSubmitSuccess; };
    /**
     * 現在、登録中か？
     * @returns {boolean}
     */
    ctrl.submitIn = function(){ return ins.isSubmitIn; };

    /**
     * 登録可能か？可能の場合 trueを返す
     * @returns {boolean}
     */
    ctrl.submitCheck = function () {
        var isOther = true;
        /**
         *  submitCheckOther() で、さらに、送信できるかを決める。
         */
        if( util.isFunction(ctrl.submitCheckOther))
            isOther = ctrl.submitCheckOther(scope) == true;

        return !ins.isSubmitIn && !(ins.isSubmitSuccess && onlyOnceSubmit) && isOther;
    };
    return ins;
}


/**
 * 簡単なシンプルな送信を作る
 * @param {object} scope
 * @param {object} ctrl
 * @param {string} url
 * @param {object} data
 * @param {bool} onlyOnceSubmit  一度送信に成功したら、それ以降送信不可能にするか
 * @returns {utilSimpleSubmitUpload}
 */
export function utilSimpleSubmitUpload(scope, ctrl, url, data, onlyOnceSubmit)
{
    var t = utilSimpleSubmitHttp(scope, ctrl, url, data, onlyOnceSubmit);
    ctrl.submit = function() {
        if( !ctrl.submitCheck() ) return;
        if( util.isFunction(ctrl.onSubmitStart))
            ctrl.onSubmitStart(scope);

        t.isSubmitIn = true;

        var formData = new FormData();
        var imagefile = document.querySelector('#file');
        formData.append("image", imagefile.files[0]);
        axios.post('upload_file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            t.httpSuccess(scope, response);
        }).catch( error => {
            t.httpError(scope, error);
        })
        .then(()=>{
            t.httpFinally(scope);
        });
    };
}