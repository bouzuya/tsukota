# tsukota

tsukota は使った金額を記録する Android アプリです。

## 機能

- アカウント (Account) の作成・更新・削除
- 分類 (Category) の作成・更新・削除
- 使用額 (Transaction) の作成・更新・削除

## インストール方法

(Google Play ストアからダウンロードできるよう準備中)

## Firebase Local Emulator Suite の使用

<https://firebase.google.com/docs/cli?hl=ja>
<https://firebase.google.com/docs/emulator-suite/install_and_configure?hl=ja>

```console
$ npm install -g firebase-tools
# ...

$ firebase login
# ...

$ firebase projects:list
# ...

$ project_id='bouzuya-lab-tsukota'
$ firebase use "${project_id}"
# ...

$ firebase init emulators
# ...

$ firebase emulators:start
# ...
```

## Cloud Firestore からのエクスポート

<https://firebase.google.com/docs/firestore/manage-data/export-import?hl=ja>
<https://cloud.google.com/sdk/docs/install-sdk?hl=ja>

```console
$ # install `gcloud` CLI

$ gcloud auth login
# ...

$ project_id='bouzuya-lab-tsukota'
$ gcloud config set project "${project_id}"
# ...

$ gcloud firestore export gs://bouzuya-lab-tsukota.appspot.com
# ...

$ mkdir storage
$ export_prefix='2023-04-08T08:43:12_90016'
$ gsutil -m cp -r "gs://bouzuya-lab-tsukota.appspot.com/${export_prefix}" storage
# ...

$ firebase emulators:start --import "storage/${export_prefix}"
# ...
```
