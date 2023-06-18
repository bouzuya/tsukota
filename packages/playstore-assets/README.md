# playstore-assets

Play ストアの掲載情報

- `tsukota-playstore-app-icon-v2.png` は `packages/assets/tsukota-v2.svg` から生成している
  - 余白の関係で x: 192, y: 192, w: 640, h: 640 の領域を 512x512 で PNG にして export している
  - `アプリアイコンは、PNG または JPEG で、1 MB 以下、512 x 512 ピクセルであり、Google の デザイン仕様とメタデータに関するポリシーに準拠する必要があります`
    - [デザイン仕様](https://developer.android.com/google-play/resources/icon-design-specifications?hl=ja)
    - [メタデータに関するポリシー](https://support.google.com/googleplay/android-developer/answer/9898842)
- `tsukota-playstore-feature-graphic-v2.png` は `packages/assets/tsukota-v2.svg` から生成している
  - x: 0, y: 262, w: 1024, h: 500 の領域を 1024x500 で PNG にして export している
- `tsukota-playstore-phone-1.png` はアカウント詳細を Pixel 4 の Virtual Device でスクリーンショットを撮っている
- `tsukota-playstore-phone-2.png` はホームでドロワーを表示して Pixel 4 の Virtual Device でスクリーンショットを撮っている
