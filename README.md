# OptionFilter

OptionFilter は、HTMLSelectElementのoption数が多くなった時に、フィルタリングするためのライブラリです。

## インストール

```Javascript
import { OptionFilter } from "./path/to/OptionFilter.js";
```

## 使い方

以下のようにHTMLとJavaScriptを設定します。

```html
<section class="container mx-auto">
  <select data-label="filter">
    <option>佐々木</option>
    <option>木下</option>
    <option>岡田</option>
  </select>
</section>

<script type="module">
    import { OptionFilter } from "./path/to/OptionFilter.js";
    // テスト対象の要素を取得
    const selectEl = document.querySelector("[data-label=filter]");

    // OptionFilterのインスタンスを初期化
    const optionFilter = new OptionFilter({
      target: selectEl,
      placeholder: "プレースホルダー",
    });

    optionFilter.init();
</script>
```

## API

### OptionFilterクラスについて

#### コンストラクタ

```typescript
new OptionFilter(params: OptionFilterParams)
```

##### パラメータ

- `params` (Object): OptionFilterのパラメータ。
  - `target` (string | HTMLElement): 対象のselect要素またはそのセレクタ。
  - `placeholder` (string, optional): input要素のプレースホルダー。

#### メソッド

##### `init()`

OptionFilterを初期化し、input要素を作成して挿入し、オプションをフィルタリングするためのイベントリスナーを設定します。
