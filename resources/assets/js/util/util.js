
let util = {};

util.version = '1.0.0';

import {
    prefArray,
    prefList
} from "./lib/address"
util.prefArray = prefArray;
util.prefList = prefList;


import {
    htmlEntityDecode,
    nl2br
} from "./lib/html"
util.htmlEntityDecode = htmlEntityDecode;
util.nl2br = nl2br;


import {
    loadingRender,
    utilSimpleSubmitHttp,
    utilSimpleSubmitUpload
} from "./lib/http"
util.loadingRender = loadingRender;
util.utilSimpleSubmitHttp = utilSimpleSubmitHttp;
util.utilSimpleSubmitUpload = utilSimpleSubmitUpload;

import {
    convertYENtoJapaneseFormat
} from "./lib/money"
util.convertYENtoJapaneseFormat = convertYENtoJapaneseFormat;

import {
    isUndefined,
    isDefined,
    isObject,
    isBlankObject,
    isString,
    isNumber,
    isDate,
    isArray,
    isError,
    isFunction,
    isRegExp,
    isWindow,
    isFile,
    isFormData,
    isBlob,
    isBoolean,
    isPromiseLike,
    isTypedArray,
    isArrayBuffer
} from "./lib/check"
util.isUndefined = isUndefined;
util.isDefined = isDefined;
util.isObject = isObject;
util.isBlankObject = isBlankObject;
util.isString = isString;
util.isNumber = isNumber;
util.isDate = isDate;
util.isArray = isArray;
util.isError = isError;
util.isFunction = isFunction;
util.isRegExp = isRegExp;
util.isWindow = isWindow;
util.isFile = isFile;
util.isFormData = isFormData;
util.isBlob = isBlob;
util.isBoolean = isBoolean;
util.isPromiseLike = isPromiseLike;
util.isTypedArray = isTypedArray;
util.isArrayBuffer = isArrayBuffer;


export default util;