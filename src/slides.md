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
