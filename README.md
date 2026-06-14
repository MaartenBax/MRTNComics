# MRTN Comics V7

This is the V7 redesign based on the darker MRTN-style mockup direction.

## What changed

- New header structure: logo, Home, Series, Favorites, Search
- Full-width cinematic hero
- Continue Reading + New Here panel
- Latest Issues as horizontal issue cards
- Favorites system with heart buttons
- Reader functionality kept
- Book-style spreads kept
- Header hidden while reading
- No page flip animation
- No light mode
- GitHub Pages compatible

## Files to edit most often

```text
data/comics.js
```

## Replace these assets

```text
assets/logo.svg
series/mrtn/hero.png
series/mrtn/banner.png
comics/issue-001/cover.png
comics/issue-001/page-001.png
...
```

## Adding a real Issue 002

Create:

```text
comics/issue-002/
```

Add:

```text
cover.png
page-001.png
page-002.png
back-cover.png
```

Then update the Issue 002 object in `data/comics.js`.
