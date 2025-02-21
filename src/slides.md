<!--

- どういう話をするか
- スクロールとオーバーフロー revisiting
  - スクロールがどうして起きるか：オーバーフローしてるから
  - overflowプロパティとスクローリングエレメント
  - オーバーフローを起こす方向はどう決まるか
- コンテナスタイルクエリ
  - 「親の顔より見た○○」→「もっと親の○○見て」
  - 親のwriting-modeを知りたい
    - 正確には親から継承されてくる自分のwriting-modeを知りたい
      - レイアウト系……logical properties
      - overflow……仕様はあるけど実装がまだ
      - linear-gradient……仕様がまだ、議論はある
      - transform……仕様も議論もない
      - フォント指定

-->

<div class="wrapper center">

# 縦から目線の<span style="text-orientation: upright;">ＣＳＳ</span>

<div style="align-self: end; margin-inline-end: 4em">
<span style="font-size: 1em; color: #444">berlysia</span>
</div>

</div>

---

<div class="wrapper">

# どういう話をするか

1. 縦書きで余計に意識させられる要素

- 内在的サイズ
- 整形コンテキスト

2. コンテナスタイルクエリ

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る

<div style="flex: 1; container-type: size;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="flex: 1; border: 8px solid orange; display: flex; flex-direction: column; justify-content: center; align-items: center;">
   <div>

      （本文 flex: 1; ）

  </div>

  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：横書き

<div style="flex: 1; container-type: size;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="flex: 1; border: 8px solid orange;">

ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。

  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：横書き+overflow

<div style="flex: 1; container-type: size;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="flex: 1; border: 8px solid orange; overflow: auto;">

ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。

  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：よくあるやつ

<div style="flex: 1; container-type: size;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="writing-mode: vertical-rl; flex: 1; border: 8px solid orange; display: flex; flex-direction: column; justify-content: center; align-items: center;">
   <div>

      なんだか

      ふんいきのある

      良い感じの

      テキスト

  </div>

  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：縦書き

<div style="flex: 1; container-type: size; position: relative;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="writing-mode: vertical-rl; flex: 1; border: 8px solid orange;">
  ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：縦書き+overflow

<div style="flex: 1; container-type: size; position: relative;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="writing-mode: vertical-rl; flex: 1; border: 8px solid orange; overflow: auto;">
  ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：向きが違えばこう

<div style="flex: 1; container-type: size; position: relative;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: row; height: 100cqh; width: 100cqw;">
  <div style="writing-mode: vertical-rl; border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="writing-mode: horizontal-tb; flex: 1; border: 8px solid orange;">
ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。
  </div>
  <div style="writing-mode: vertical-rl; border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="writing-mode: vertical-rl; border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper center">

# 内在的サイズ

Intrinsic size

要素の内容で決まる良い感じの寸法。

</div>

---

<div class="wrapper">

`min-height`, `min-width` は初期値が `auto` である。

Flexboxのもとでは、  
`overflow: visible` のとき、  
フレックスアイテムの内在的サイズが考慮される。

`min-*` が `auto` なので、成り行きでフレックスコンテナーをはみだす結果になる。

`overflow` を `visible` 以外にすると、  
フレックスアイテムが縮小できるようになり、おさまる。

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：横書き

<div style="flex: 1; container-type: size;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="flex: 1; border: 8px solid orange;">

ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。

  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper header-and-content">

# 横書きの中に縦書きの領域を作る：横書き+overflow

<div style="flex: 1; container-type: size;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="flex: 1; border: 8px solid orange; overflow: auto;">

ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。

  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper">

# フローレイアウト

<div style="border: 8px solid blue;">

ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。

</div>

---

<div class="wrapper">

# フローレイアウトで混在

<div style="border: 8px solid blue;" class="wm-toggle">

ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。

</div>

---

<!--
<div class="wrapper">

- ブロック整形コンテキスト
  - 寸法の決まり方
    - `width`, `height: auto`の関係
  - ブロックボックスの並べ方
    - inline-start側を起点に配置することになっている

</div>

--- -->

<!-- <div class="wrapper center">

# 内在的サイズ

内容から決まる要素の寸法

</div>

--- -->

<div class="wrapper">

# 寸法の決まり方

<div style="border: 8px solid blue; margin: 12px; padding: 12px;">

フローレイアウト中のブロックボックスは、 `padding` や `margin` を考慮したうえで、インライン方向に広がる。

ブロック方向はIntrinsic sizeを考慮したAutomatic block sizeになる[🔗](https://www.w3.org/TR/。css-sizing-3/)。

この挙動はブロック整形コンテキストが定めている。

</div>

<div style="border: 8px solid blue; margin: 12px; padding: 12px;">

中身少ない版

</div>

※縦横切り替えてみよう

</div>

---

<div class="wrapper">

# ブロックの配置

<div style="border: 8px solid blue; margin: 12px; padding: 12px;">

<div style="border: 8px solid orange; margin: 12px; padding: 12px; inline-size: 33%;">
  ブロックはinline-start側に寄せて配置される
</div>

<div style="border: 8px solid orange; margin: 12px; padding: 12px; inline-size: 80%;">
  ブロックはinline-start側に寄せて配置される
</div>

<div style="border: 8px solid orange; margin: 12px; padding: 12px;" class="wm-toggle">
  縦横混ぜるとどうなる？
</div>

この挙動はブロック整形コンテキストが定めている。

</div>

※縦横切り替えてみよう

</div>

---

<div class="wrapper">

# だからこうなる

<div style="border: 8px solid blue;" class="wm-toggle">

ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。

</div>

---

<div class="wrapper header-and-content">

# おすすめ:FlexやGridで調停

<div style="flex: 1; container-type: size; position: relative;">

<div style="writing-mode: horizontal-tb; display: block flex; flex-direction: column; height: 100cqh; width: 100cqw;">
  <div style="border: 8px solid blue;">
    何かヘッダー
  </div>
  <div style="writing-mode: vertical-rl; flex: 1; border: 8px solid orange; overflow: auto;">
  ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。ここに長めのコンテンツ。
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
  <div style="border: 8px solid blue;">
    何か後続の中身たち
  </div>
</div>

</div>

</div>

---

<div class="wrapper header-and-content">

# どうしても<br />文章ページでやりたい

<!-- センタリング -->
<div style="flex: 1; display: flex; justify-content: center; align-items: center;">
頑張ってください
</div >

</div>

---

<div class="wrapper center">

# コンテナスタイルクエリ

</div>

---

<div class="wrapper">

# 親の顔より見た「〇〇」

</div>

---

<div class="wrapper">

# 親の顔より見た「`writing-mode`」

もっと親の顔見て

もっと親の `writing-mode` 見て

</div>

---

<div class="wrapper">

# 親の `writing-mode` を見たいとき

- 方向が伴うものほとんどすべて
  - レイアウト系
  - overflow
  - linear-gradient
  - transform
- フォント指定

</div>

---

<div class="wrapper header-and-content">

<img src="/public/CSS Logical Properties and Values.png">

</div>

---

<div class="wrapper header-and-content">

## フォントの場合

<div class="wm-horizontal" style="flex: 1; display: flex; justify-content: center; align-items: center; flex-direction: column;">

<img src="/public/font.png" style="height: 40cqh;">

<span style="font-size: 0.8em">

[縦書きHTMLにおける文字の向きはどのように定まるか](https://blog.nnn.dev/entry/2022/07/01/180000)

 </span>

</div>

</div>

---

<div class="wrapper">

## overflow

仕様がWD、実装がない

- `overflow-inline`
- `overflow-block`

## linear-gradient

- `to left` `to right` みたいなやつ

## transform

- そもそも話がない

</div>

---

<div class="wrapper header-and-content">

# 判定したい

<div class="wm-horizontal" style="flex: 1; display: flex; justify-content: center; align-items: center;">

```
(writing-modeがvertical-rlだったら) {
  overflow-x: scroll;
  font-family: "Noto Sans JP";
}
```

</div>

</div>

---

<div class="wrapper header-and-content">

# Container Style Query!!!

<div class="wm-horizontal" style="flex: 1; display: flex; justify-content: center; align-items: center;">

```
@container style(writing-mode: vertical-rl) {
  overflow-x: scroll;
  font-family: "Noto Sans JP";
}
```

</div>
</div>

---

<div class="wrapper">

# Container Query

- Container Size Query
- Container Style Query

</div>

---

<div class="wrapper header-and-content">

# Container Size Query

<div class="wm-horizontal" style="flex: 1; display: flex; justify-content: center; align-items: center;">

```
.myclass {
  container-type: size;
  container-name: --my-container-name;
  /*
  HTML側に逃すこともできそうね
  container-name: attr(id type(<custom-ident>), none);
  */
}
/* 〜 */
@container (max-width: 640px) {
  background-color: red;
}
```

</div>
</div>

---

<div class="wrapper header-and-content">

# Container Size Query

`container-type` プロパティがあるところ 「だけ」 がコンテナサイズクエリできるようになる

CSS Containmentの機能でレイアウト的に制約がかかる

# Container Style Query

デフォルトで全ての空でない要素がスタイルクエリコンテナになる。

</div>
</div>

---

<div class="wrapper header-and-content">

# 構文

<div class="wm-horizontal" style="flex: 1; display: flex; justify-content: center; align-items: center;">

```
/* サイズクエリ */
@container (max-width: 640px) {
  background-color: red;
}
/* スタイルクエリ */
@container style(writing-mode: vertical-rl) {
  background-color: blue;
}
/* 混合が許される */
@container (max-width: 640px)
    and style(writing-mode: vertical-rl) {
  background-color: blue;
}
```

</div>
</div>

---

<div class="wrapper header-and-content">

# で。動くんですか？

<!-- センタリング -->
<div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">

まだ動きません

しかし、カスタムプロパティならば

</div >

</div>

---

<div class="wrapper center">

# Go to editor……

</div>
