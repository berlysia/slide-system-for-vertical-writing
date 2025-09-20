<script src="https://cdn.jsdelivr.net/npm/baseline-status@1/baseline-status.min.js" type="module"></script>

# Markdownスクリプトテスト

このスライドはMarkdown（.md）ファイルでbaseline-statusスクリプトを読み込みます

<baseline-status feature="css-anchor-positioning"></baseline-status>

---

# 複数の要素（MD版）

<baseline-status feature="css-grid"></baseline-status>
<baseline-status feature="css-custom-properties"></baseline-status>
<baseline-status feature="fetch"></baseline-status>

---

<script>
console.log('Markdownファイルからのインラインスクリプトがロードされました');
console.log('baseline-status 要素数:', document.querySelectorAll('baseline-status').length);
</script>

# インラインスクリプトテスト（MD版）

コンソールにMarkdownファイル用のメッセージが表示されているはずです

DevToolsを開いて確認してください
