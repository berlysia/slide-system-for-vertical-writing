import { useState, useRef, useEffect, useCallback } from "react";
import slidesContent, { slideScripts } from "virtual:slides.js";
import { globalScriptManager } from "./script-manager";

function App() {
  const [writingMode, setWritingMode] = useState(() => {
    const saved = sessionStorage.getItem("slide-writing-mode");
    return saved ?? "vertical-rl";
  });
  const isVertical = writingMode !== "horizontal-tb";
  const slidesRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(() => {
    const saved = sessionStorage.getItem("slide-font-size");
    return saved ? Number(saved) : 42;
  });
  const [withAbsoluteFontSize, setWithAbsoluteFontSize] = useState(() => {
    const saved = sessionStorage.getItem("slide-with-absolute-font-size");
    return saved === "true";
  });

  // 状態変更時にsessionStorageに保存
  useEffect(() => {
    sessionStorage.setItem("slide-writing-mode", writingMode);
  }, [writingMode]);

  useEffect(() => {
    sessionStorage.setItem("slide-font-size", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    sessionStorage.setItem(
      "slide-with-absolute-font-size",
      withAbsoluteFontSize.toString(),
    );
  }, [withAbsoluteFontSize]);

  // スクリプトの読み込み
  useEffect(() => {
    if (
      slideScripts &&
      (slideScripts.external.length > 0 || slideScripts.inline.length > 0)
    ) {
      console.log("[App] Loading slide scripts:", slideScripts);
      globalScriptManager.loadScripts(slideScripts).catch(console.error);
    }

    return () => {
      // クリーンアップは慎重に行う（全てのスクリプトを削除すると他の機能に影響する場合がある）
    };
  }, []);

  // ロード時にハッシュが入ってたらそのページにスクロール
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView();
      }
    }
  }, [writingMode]);

  // IntersectionObserverでスクロール位置に応じてページ番号を変更
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const index = parseInt(id.replace("page-", ""));
            history.replaceState(null, "", `#page-${index}`);
          }
        });
      },
      { threshold: 0.5 },
    );
    if (slidesRef.current) {
      slidesRef.current.querySelectorAll(".slide").forEach((slide) => {
        observer.observe(slide);
      });
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const gotoNextSlide = useCallback((forward = true) => {
    const currentHash = location.hash;
    const currentIndex = parseInt(currentHash.replace("#page-", ""));
    const nextIndex = forward ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= slidesContent.length) {
      return;
    }
    location.hash = `#page-${nextIndex}`;
  }, []);

  // keydownイベントでページ送り
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowDown" ||
        (event.key === " " && !event.shiftKey)
      ) {
        event.preventDefault();
        gotoNextSlide();
      } else if (
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        (event.key === " " && event.shiftKey)
      ) {
        event.preventDefault();
        gotoNextSlide(false);
      }
    };
    const controller = new AbortController();
    window.addEventListener("keydown", handleKeydown, {
      signal: controller.signal,
    });
    return () => {
      controller.abort();
    };
  }, [gotoNextSlide]);

  return (
    <div
      className="slides-container"
      style={{ "--slide-writing-mode": writingMode }}
    >
      <div className="slides" ref={slidesRef}>
        {slidesContent.map((content, index) => {
          if (typeof content === "string") {
            return (
              <div className="slide" id={`page-${index}`} key={index}>
                <div
                  className="slide-content"
                  style={
                    withAbsoluteFontSize ? { fontSize: `${fontSize}px` } : {}
                  }
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              </div>
            );
          } else {
            const SlideComponent = content;
            return (
              <div className="slide" id={`page-${index}`} key={index}>
                <div
                  className="slide-content"
                  style={
                    withAbsoluteFontSize ? { fontSize: `${fontSize}px` } : {}
                  }
                >
                  <SlideComponent />
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="controls">
        <div>
          <button type="button" onClick={() => gotoNextSlide()}>
            次
          </button>
          <button
            type="button"
            onClick={() =>
              setWritingMode(isVertical ? "horizontal-tb" : "vertical-rl")
            }
          >
            {isVertical ? "横書きにする" : "縦書きにする"}
          </button>
          <button type="button" onClick={() => gotoNextSlide(false)}>
            前
          </button>
        </div>
        <div>
          <label>
            フォントサイズを指定する
            <input
              type="checkbox"
              checked={withAbsoluteFontSize}
              onChange={(e) => setWithAbsoluteFontSize(e.target.checked)}
            />
          </label>
          <label>
            <input
              type="number"
              min="10"
              step="1"
              value={fontSize}
              onChange={(e) => {
                const t = Number(e.target.value);
                setFontSize(Number.isNaN(t) || t < 4 ? 4 : t);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.stopPropagation();
                }
              }}
              style={{
                inlineSize: `${fontSize.toString(10).length / 2 + 2}em`,
              }}
            />
            px
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
