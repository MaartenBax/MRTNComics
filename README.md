# MRTN Comics Reader V6

This version uses:

```text
Home | Series | Continue Reading
```

It works locally by double-clicking `index.html` and also works on GitHub Pages.

There is no JSON file. Edit:

```text
data/comics.js
```

## What changed in V6

- `Library` is now `Series`
- Series page shows big custom series banner tiles
- Clicking a series opens a series detail page
- Issues can be sorted newest first or oldest first
- Main website header is hidden while reading
- Reader keeps the book-style layout:
  - front cover alone
  - inside pages as two-page spreads
  - back cover alone

## Series banners

Put series banner images here:

```text
series/mrtn/banner.png
series/echoing-horizon/banner.png
series/grimm/banner.png
```

Recommended banner size:

```text
1920 × 800 px
```

or anything wide like:

```text
16:7
21:9
```

## Adding a new series

In `data/comics.js`, add to `SERIES_DATA`:

```js
{
  id: "new-series",
  title: "New Series",
  description: "Description here.",
  banner: "series/new-series/banner.png"
}
```

Then create:

```text
series/new-series/banner.png
```

## Adding a new issue

Create a folder:

```text
comics/issue-002/
```

Add:

```text
cover.png
page-001.png
page-002.png
page-003.png
back-cover.png
```

Then add this to `COMICS_DATA` in `data/comics.js`:

```js
{
  id: "mrt-002",
  series: "mrtn",
  title: "MRTN",
  issue: "Issue 002",
  issueNumber: 2,
  description: "Issue 002.",
  category: "MRTN",
  featured: false,
  cover: "comics/issue-002/cover.png",
  pages: [
    "comics/issue-002/page-001.png",
    "comics/issue-002/page-002.png",
    "comics/issue-002/page-003.png"
  ],
  backCover: "comics/issue-002/back-cover.png"
}
```

## Important

The `series` value on an issue must match a series `id`.

Example:

```js
series: "mrtn"
```

must match:

```js
id: "mrtn"
```
