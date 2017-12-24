# Google検索、件数取得
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)]()
[![version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![version](https://img.shields.io/badge/npm-5.5.1-blue.svg)]()  
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
## 必要パッケージのインストール
```bash
npm install
```

## リソースの構築
`CSS` や `Javascript` を `public` ディレクトリへ構築する。
```bash
npm run dev
```
  
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