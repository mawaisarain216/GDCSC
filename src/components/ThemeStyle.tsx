import { getSettings, getTheme } from "@/lib/repo";

function googleFontHref(families: string[]) {
  const unique = Array.from(new Set(families)).filter(Boolean);
  const params = unique
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export default async function ThemeStyle() {
  const theme = await getTheme();
  const settings = await getSettings();

  const vars = `
:root {
  --primary: ${theme.colorPrimary};
  --primary-dark: ${theme.colorPrimaryDark};
  --secondary: ${theme.colorSecondary};
  --accent: ${theme.colorAccent};
  --bg: ${theme.colorBg};
  --surface: ${theme.colorSurface};
  --text: ${theme.colorText};
  --text-muted: ${theme.colorTextMuted};
  --header-bg: ${theme.colorHeaderBg};
  --header-text: ${theme.colorHeaderText};
  --footer-bg: ${theme.colorFooterBg};
  --footer-text: ${theme.colorFooterText};
  --radius: ${theme.radius}px;
  --container-width: ${theme.containerWidth}px;
  --section-spacing: ${theme.sectionSpacing}px;
  --font-heading-family: "${theme.fontHeading}", "Segoe UI", sans-serif;
  --font-body-family: "${theme.fontBody}", "Segoe UI", sans-serif;
  --base-font-size: ${theme.baseFontSize}px;
  --h1-size: ${theme.h1Size}px;
  --h2-size: ${theme.h2Size}px;
  --h3-size: ${theme.h3Size}px;
}
${theme.darkMode ? `:root { --bg: #0f1613; --surface: #16201c; --text: #eef3f0; --text-muted: #9fb0a8; }` : ""}
`;

  const href = googleFontHref([theme.fontHeading, theme.fontBody]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={href} />
      <style
        id="theme-vars"
        dangerouslySetInnerHTML={{ __html: vars + "\n" + (settings.customCss || "") }}
      />
    </>
  );
}
