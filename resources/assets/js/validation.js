/**
 * Vue validate
 */
import VeeValidate, {Validator} from 'vee-validate';


/**
 * 電話番号の判定
 */
Validator.extend('tel', {
    getMessage(field, params, data) {
        return field + " is not a phone number";
    },
    validate: value => {
        return !!value.match(/(?:^\d{1,4}-\d{4}$)|(?:^\d{2,5}-\d{1,4}-\d{3,4}$)/);
    }
});

/**
 * 半角文字の判定
 */
Validator.extend('hankaku', {
    getMessage(field, params, data) {
        return field + " must be a one-byte character";
    },
    validate: value => {
        return !!value.match(/^[\x20-\x7E]+$/);
    }
});
/**
 * 全角文字の判定
 */
Validator.extend('zenkaku', {
    getMessage(field, params, data) {
        return field + " must be a double-byte character";
    },
    validate: value => {
        return !!value.match(/^[^\x01-\x7E\xA1-\xDF]+$/);
    }
});
/**
 * 全角ひらがな文字の判定
 */
Validator.extend('hiragana', {
    getMessage(field, params, data) {
        return field + " must be a double-byte Hiragana character";
    },
    validate: value => {
        return !!value.match(/^[\u3041-\u3096]+$/);
    }
});
/**
 * 全角カタカナ文字の判定
 */
Validator.extend('katakana', {
    getMessage(field, params, data) {
        return field + " must be a double-byte Katakana character";
    },
    validate: value => {
        return !!value.match(/^[\u30a1-\u30f6]+$/);
    }
});
/**
 * 全角番号文字の判定
 */
Validator.extend('zenkaku_number', {
    getMessage(field, params, data) {
        return field + " must be a double-byte Katakana character";
    },
    validate: value => {
        return !!value.match(/^[０-９]+$/);
    }
});
/**
 * 全角アルファベット文字の判定
 */
Validator.extend('zenkaku_alpha', {
    getMessage(field, params, data) {
        return field + " must be a double-byte alphabet character";
    },
    validate: value => {
        return !!value.match(/^[Ａ-Ｚａ-ｚ]+$/);
    }
});
window.Vue.use(VeeValidate,{
    locale:'ja',
    events:'blur',
    dictionary:{
        ja:{
            messages: {
                after: function (n, e) {
                    return n + "は" + e[0] + "の後でなければなりません"
                },
                alpha_dash: function (n) {
                    return n + "は英数字とハイフン、アンダースコアのみ使用できます"
                },
                alpha_num: function (n) {
                    return n + "は英数字のみ使用できます";
                },
                alpha_spaces: function (n) {
                    return n + "はアルファベットと空白のみ使用できます"
                },
                alpha: function (n) {
                    return n + "はアルファベットのみ使用できます"
                },
                before: function (n, e) {
                    return n + "は" + e[0] + "よりも前でなければなりません"
                },
                between: function (n, e) {
                    return n + "は" + e[0] + "から" + e[1] + "の間でなければなりません"
                },
                confirmed: function (n) {
                    return n + "が一致しません"
                },
                credit_card: function (n) {
                    return n + "が正しくありません"
                },
                date_between: function (n, e) {
                    return n + "は" + e[0] + "から" + e[1] + "の間でなければなりません"
                },
                date_format: function (n, e) {
                    return n + "は" + e[0] + "形式でなけれななりません"
                },
                decimal: function (n, e) {
                    void 0 === e && (e = ["*"]);
                    var t = e[0];
                    return n + "は整数及び小数点以下" + ("*" === t ? "" : t) + "桁までの数字にしてください"
                },
                digits: function (n, e) {
                    return n + "は" + e[0] + "桁の数字でなければなりません"
                },
                dimensions: function (n, e) {
                    return n + "は幅" + e[0] + "px、高さ" + e[1] + "px以内でなければなりません"
                },
                email: function (n) {
                    return n + "は有効なメールアドレスではありません"
                },
                ext: function (n) {
                    return n + "は有効なファイル形式ではありません"
                },
                image: function (n) {
                    return n + "は有効な画像形式ではありません"
                },
                in : function (n) {
                    return n + "は有効な値ではありません"
                },
                ip: function (n) {
                    return n + "は有効なIPアドレスではありません"
                },
                max: function (n, e) {
                    return n + "は" + e[0] + "文字以内にしてください"
                },
                max_value: function (n, e) {
                    return n + "は" + e[0] + "以下でなければなりません"
                },
                mimes: function (n) {
                    return n + "は有効なファイル形式ではありません"
                },
                min: function (n, e) {
                    return n + "は" + e[0] + "文字以上でなければなりません"
                },
                min_value: function (n, e) {
                    return n + "は" + e[0] + "以上でなければなりません"
                },
                not_in: function (n) {
                    return n + "は不正な値です"
                },
                numeric: function (n) {
                    return n + "は数字のみ使用できます"
                },
                regex: function (n) {
                    return n + "が正しくありません"
                },
                required: function (n) {
                    return n + "は必須項目です"
                },
                size: function (n, e) {
                    return n + "は" + e[0] + "KB以内でなければなりません"
                },
                url: function (n) {
                    return n + "が正しくありません"
                },
                /*
                 * ここからは、オリジナルルールの追加
                 */
                tel:function (n) {
                    return n + "は電話番号ではありません"
                },
                hankaku: function (n) {
                    return n + "は半角文字でなければなりません"
                },
                zenkaku: function (n) {
                    return n + "は全角文字でなければなりません"
                },
                hiragana: function (n) {
                    return n + "は 全角ひらがな でなければなりません"
                },
                katakana: function (n) {
                    return n + "は全角カタカナでなければなりません"
                },
                zenkaku_number: function (n) {
                    return n + "は全角の数値でなければなりません"
                },
                zenkaku_alpha: function (n) {
                    return n + "は全角のアルファベットでなければなりません"
                },
            },
            attributes: {
                phone:"電話番号",
                tel:"電話番号",
                email:"メールアドレス",
                subject:"タイトル",
                name:"お名前",
                body:"内容",
                password:"パスワード",
                passwordConfirmation:"確認のパスワード"
            }
        }
    }
});
