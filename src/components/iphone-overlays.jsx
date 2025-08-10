"use client";

// Use runtime URLs from public/ instead of importing SVG modules

export function IphoneOverlays({ orientation = "portrait", browser = "safari", showStatusBar = true, showHomeIndicator = true, showBrowserTop = true, showBrowserBottom = true }) {
  const isPortrait = orientation === "portrait";

  const portrait = {
    statusBar: "/assets/elements/iphone/portrait/status-bar.svg",
    home: "/assets/elements/iphone/portrait/home-indicator.svg",
    safariTop: "/assets/elements/iphone/portrait/safari/Safari Top.svg",
    safariBottom: "/assets/elements/iphone/portrait/safari/Safari Bottom.svg",
    chromeTop: "/assets/elements/iphone/portrait/chrome/Chrome - Top.svg",
    chromeBottom: "/assets/elements/iphone/portrait/chrome/Chrome - Bottom.svg",
  };

  const landscape = {
    // No status bar asset provided for landscape in public/
    home: "/assets/elements/iphone/landscape/home-indicator.svg",
    safariTop: "/assets/elements/iphone/landscape/safari/Safari - Top.svg",
    chromeTop: "/assets/elements/iphone/landscape/chrome/Chrome - Top.svg",
  };

  const imgs = isPortrait
    ? {
        statusBar: portrait.statusBar,
        home: portrait.home,
        safariTop: portrait.safariTop,
        safariBottom: portrait.safariBottom,
        chromeTop: portrait.chromeTop,
        chromeBottom: portrait.chromeBottom,
      }
    : {
        statusBar: undefined,
        home: landscape.home,
        safariTop: landscape.safariTop,
        safariBottom: undefined,
        chromeTop: landscape.chromeTop,
        chromeBottom: undefined,
      };

  return (
    <>
      {isPortrait && showStatusBar && imgs.statusBar && (
        <img src={imgs.statusBar} alt="status bar" className="pointer-events-none select-none absolute top-0 left-0 w-full h-auto" />
      )}

      {browser !== "none" && (
        <>
          {browser === "safari" && (
            <>
              {showBrowserTop && imgs.safariTop && (
                <img src={imgs.safariTop} alt="safari top" className="pointer-events-none select-none absolute top-0 left-0 w-full h-auto" />
              )}
              {isPortrait && showBrowserBottom && imgs.safariBottom && (
                <img src={imgs.safariBottom} alt="safari bottom" className="pointer-events-none select-none absolute bottom-0 left-0 w-full h-auto" />
              )}
            </>
          )}
          {browser === "chrome" && (
            <>
              {showBrowserTop && imgs.chromeTop && (
                <img src={imgs.chromeTop} alt="chrome top" className="pointer-events-none select-none absolute top-0 left-0 w-full h-auto" />
              )}
              {isPortrait && showBrowserBottom && imgs.chromeBottom && (
                <img src={imgs.chromeBottom} alt="chrome bottom" className="pointer-events-none select-none absolute bottom-0 left-0 w-full h-auto" />
              )}
            </>
          )}
        </>
      )}

      {showHomeIndicator && imgs.home && (
        <img src={imgs.home} alt="home indicator" className="pointer-events-none select-none absolute bottom-0 left-0 w-full h-auto" />
      )}
    </>
  );
}
