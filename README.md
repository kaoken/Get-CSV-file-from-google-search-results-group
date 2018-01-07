# Google検索、件数取得
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://github.com/kaoken/Get-CSV-file-from-google-search-results-group)
[![version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/kaoken/Get-CSV-file-from-google-search-results-group)
[![version](https://img.shields.io/badge/npm-5.5.1-blue.svg)](https://github.com/kaoken/Get-CSV-file-from-google-search-results-group)  
Google検索で、複数ある対象キーワード群から件数のみを取得し、CSVファイルに変化するWEBアプリである

__コンテンツの表__

- [インストール](#インストール)
- [構築](#構築)
- [起動](#起動)
- [使い方](#使い方)
- [ライセンス](#ライセンス)

# インストール
## Windows環境
[Node.js](https://nodejs.org/ja/)からLTS版をダウンロードする。  

# 構築
## ディレクトリの移動
このアプリのディレクトリへ移動する

## 必要パッケージのインストール
```bash
npm install
```

## リソースの構築
`CSS` や `Javascript` を `public` ディレクトリへ構築する。
```bash
npm run dev
```
  
## コンフィグ
`env.json`ファイルがコンフィグファイルである。
```js
{
  "server":{
    "port":3000,
    "socketPort":3001,
    "https":{
      "valid":false,
      "key":"D:/www/nodejs/google_keyword_hit_count_csv/resources/ssl/server.key",
      "cert":"D:/www/nodejs/google_keyword_hit_count_csv/resources/ssl/server.crt"
    },
    "serverWebID":"90-pweutrvvcw*PLi"
  },
  "auth":
  {
    "valid":false,
    "username":"admin",
    "password":"pass"
  },
  "maxKeyword":1000,
  "searchInterval":5000,
  "dir":{
    "tmp":"storage/tmp/"
  },
  "filePath":{
    "CSV":"storage/tmp/keyword_result.CSV",
    "keyword":"storage/tmp/keyword.txt",
    "run":"storage/tmp/run.json"
  },
  "file":{
    "CSV":"keyword_result.CSV"
  }
}
```
### 最大キー数 
`maxKeyword`は、一度に検索することのできる最大キー数である。
  
### キーの検索間隔
`searchInterval`は、一つのキーを検索する毎に待つ時間である。単位はミリセコンドで、1000で一秒を表す。  
デフォルトでは、5秒間隔である。

### 他のパラメーター
上記以外の値を偏向することは、今のところおすすめしない。コードを読んで理解できる方はどうぞ。

  
# 起動
サーバを起動するためのコマンド
```bash
npm start
```
デフォルトでポート3000番で [http://127.0.0.1:3000](http://127.0.0.1:3000) でアクセス可能。  
このとき、ソケットでポート3001番も使用している。

# 使い方
## キーファイルの用意
例として、`キーファイル.txt`のファイルの中身が

```txt
検索ワード
こんにちは
マグネット 磁石
```

として、検索したいキーワードごとに改行する。  

注意：ファイルフォーマットは必ず **`UTF8`** にすること！！

## キーフェイルのアップロード
サイトトップで、`キーファイル`の所に、ファイルをアップロードするフォームがある。
上記例で作成したファイルを、アップロードした瞬間に解析が始まる。  

しばらくすると、処理が終了したメッセージが表示され、CSVダウンロードボタンが表示される。  
ボタンをクリック後、ダウンロードが開始される。



## ライセンス

[MIT](https://github.com/markdown-it/markdown-it/blob/master/LICENSE)