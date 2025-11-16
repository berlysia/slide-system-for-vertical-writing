/**
 * スライドのメタデータ型定義
 */
export interface SlideMetadata {
  /** スライドのタイトル */
  title?: string;
  /** スライドの説明 */
  description?: string;
  /** 作成者 */
  author?: string;
  /** 作成日時 */
  date?: string;
  /** その他のカスタムフィールド */
  [key: string]: unknown;
}

/**
 * frontmatterをパースした結果
 */
export interface ParsedSlideFile {
  /** パースされたメタデータ */
  metadata: SlideMetadata;
  /** メタデータを除いたコンテンツ */
  content: string;
  /** 元のファイル内容 */
  originalContent: string;
}
