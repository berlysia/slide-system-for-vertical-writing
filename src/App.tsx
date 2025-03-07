import { useState, useRef, JSX, useEffect, useCallback } from "react";
import "./App.css";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import slidesContent from "virtual:slides.js";

async function processMarkdown(markdown: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
}

function App() {
  const [writingMode, setWritingMode] = useState("vertical-rl");
  const isVertical = writingMode !== "horizontal-tb";
  const slidesRef = useRef<HTMLDivElement>(null);

  const [slides, setSlides] = useState<JSX.Element[]>([]);

  useEffect(() => {
    (async () => {
      const contents = slidesContent;

      const slideElements = await Promise.all(
        contents.map(async (content, index) => {
          if (typeof content === "string") {
            const processed = await processMarkdown(content);
            return (
              <div className="slide" id={`page-${index}`} key={index}>
                <div
                  className="slide-content"
                  dangerouslySetInnerHTML={{
                    __html: processed.value as string,
                  }}
                />
              </div>
            );
          } else {
            const SlideComponent = content;
            return (
              <div className="slide" id={`page-${index}`} key={index}>
                <div className="slide-content">
                  <SlideComponent />
                </div>
              </div>
            );
          }
        }),
      );
      setSlides(slideElements);
    })();
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
  }, [slides, writingMode]);

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
  }, [slides]);

  const gotoNextSlide = useCallback(
    function gotoNextSlide(forward = true) {
      const currentHash = location.hash;
      const currentIndex = parseInt(currentHash.replace("#page-", ""));
      const nextIndex = forward ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= slides.length) {
        return;
      }
      location.hash = `#page-${nextIndex}`;
    },
    [slides],
  );

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
        {slides}
      </div>
      <div className="controls">
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
    </div>
  );
}

export default App;
