const SERIES_DATA = [
  {
    id: "mrtn",
    title: "MRTN",
	logo: "series/mrtn/logo.svg",
    description: "An autobiographical comic about routine, isolation, noise, comfort, and the small moments that make life manageable.",
    banner: "series/mrtn/banner.png",
    hero: "series/mrtn/hero.png"
  },
  {
    id: "echoing-horizon",
    title: "Echoing Horizon",
	logo: "series/echoing-horizon/logo.svg",
    description: "An abstract emotional sci-fi universe built around memory, color, shapes, and E.C.H.O.",
    banner: "series/echoing-horizon/banner.png",
    hero: "series/echoing-horizon/banner.png"
  },
  {
    id: "coming-soon",
    title: "Coming Soon",
    description: "A new project is taking shape.",
    banner: "series/ComingSoon/banner.png",
    hero: "series/ComingSoon/banner.png"
  }
];

const COMICS_DATA = [
  {
    id: "mrt-001",
    series: "mrtn",
    title: "MRTN",
    issue: "Issue 001",
    issueNumber: 1,
    description: "The beginning.",
    category: "MRTN",
    featured: true,
    cover: "comics/issue-001/cover.png",
    pages: [
      "comics/issue-001/page-001.png",
      "comics/issue-001/page-002.png",
      "comics/issue-001/page-003.png",
      "comics/issue-001/page-004.png",
      "comics/issue-001/page-005.png",
      "comics/issue-001/page-006.png",
      "comics/issue-001/page-007.png",
      "comics/issue-001/page-008.png",
	  "comics/issue-001/page-009.png",
	  "comics/issue-001/page-010.png",
	  "comics/issue-001/page-011.png",
	  "comics/issue-001/page-012.png"
    ],
    backCover: "comics/issue-001/back-cover.png",
	available: true
  },
  {
    id: "mrt-002",
    series: "mrtn",
    title: "MRTN",
    issue: "Issue 002",
    issueNumber: 2,
    description: "Coming soon.",
    category: "MRTN",
    featured: false,
    cover: "comics/issue-002/cover.png",
    pages: [],
    backCover: "",
	available: false
  },
  {
    id: "mrt-003",
    series: "mrtn",
    title: "MRTN",
    issue: "Issue 003",
    issueNumber: 3,
    description: "Coming soon.",
    category: "MRTN",
    featured: false,
    cover: "comics/issue-003/cover.png",
    pages: [],
    backCover: "",
	available: false
  }
];
