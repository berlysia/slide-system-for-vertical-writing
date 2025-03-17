import { useState, useRef, useEffect } from "react";
import slidesContent from "virtual:slides.js";

function App() {
  const [writingMode, setWritingMode] = useState("vertical-rl");
  const isVertical = writingMode !== "horizontal-tb";
  const slidesRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(42);
  const [withAbsoluteFontSize, setWithAbsoluteFontSize] = useState(false);

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

  function gotoNextSlide(forward = true) {
    const currentHash = location.hash;
    const currentIndex = parseInt(currentHash.replace("#page-", ""));
    const nextIndex = forward ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= slidesContent.length) {
      return;
    }
    location.hash = `#page-${nextIndex}`;
  }

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
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        gotoNextSlide();
      } else if (event.deltaY < 0) {
        gotoNextSlide(false);
      }
    };
    const controller = new AbortController();
    window.addEventListener("keydown", handleKeydown, {
      signal: controller.signal,
    });
    window.addEventListener("wheel", handleWheel, {
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
