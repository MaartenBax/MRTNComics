window.ECHOING_HORIZON_DEVLOGS = {
  settings: {
    siteUrl: "https://r3dmyst.net/EchoingHorizon/devlogs/",
    overviewTitle: "Development Log | Echoing Horizon",
    overviewDescription: "Development notes, visual experiments and progress updates from Echoing Horizon.",
    socialImage: "../assets/hero.svg"
  },

  posts: [
    {
      slug: "new-home-for-echoing-horizon",
      number: "003",
      status: "published",
      date: "2026-07-18",
      build: "Website update",
      title: "A new home for Echoing Horizon",
      excerpt: "Rebuilding the project page around clearer gameplay, stronger imagery and a better way to share development updates.",
      cover: "../assets/hero.svg",
      coverAlt: "Echoing Horizon website presentation artwork",
      tags: ["Website", "Development"],
      seoDescription: "A look at the redesigned Echoing Horizon project page and the new development log system.",
      sections: [
        {
          id: "why-it-changed",
          title: "Why it changed",
          navLabel: "Why it changed",
          showInNavigation: true,
          blocks: [
            {
              type: "paragraph",
              text: "The previous project page worked as a simple introduction, but it did not yet communicate Echoing Horizon as a complete game. The redesign gives the project more room to explain its atmosphere, mechanics and ongoing development without turning the page into a wall of information."
            },
            {
              type: "paragraph",
              text: "The structure is intentionally familiar: a clear hero, a concise synopsis, gameplay features, screenshots, development updates and a final call to action. The identity comes from the typography, pacing and imagery rather than unusual navigation."
            }
          ]
        },
        {
          id: "visual-direction",
          title: "A quieter visual direction",
          navLabel: "Visual direction",
          showInNavigation: true,
          blocks: [
            {
              type: "image",
              src: "../assets/about.svg",
              alt: "Minimal architectural scene from Echoing Horizon",
              caption: "The page uses the same restrained architectural language as the game.",
              width: "wide"
            },
            {
              type: "paragraph",
              text: "Large areas of space, restrained color and precise alignment help the page feel connected to the game. Blue is used as a signal rather than a decoration, while the darker sections create contrast at the moments that need more weight."
            },
            {
              type: "callout",
              label: "Design note",
              title: "Commercial structure, artistic presentation.",
              text: "The site still needs to market the game clearly. Its personality should never make the information harder to find."
            }
          ]
        },
        {
          id: "development-log",
          title: "Building the development log",
          navLabel: "Development log",
          showInNavigation: true,
          blocks: [
            {
              type: "paragraph",
              text: "The new development log is driven by one editable data file. Posts can contain long text, images, local video, embedded video, galleries, lists, comparisons, quotes and callout notes without creating a new page by hand each time."
            },
            {
              type: "list",
              ordered: false,
              items: [
                "Cards are generated automatically on the overview page.",
                "Long articles receive jump links for selected sections.",
                "Previous and next navigation is calculated from the publication order.",
                "Each post receives its own title, description and share metadata."
              ]
            }
          ]
        },
        {
          id: "next",
          title: "What comes next",
          navLabel: "What comes next",
          showInNavigation: true,
          blocks: [
            {
              type: "paragraph",
              text: "The current imagery is still temporary. The next major step is replacing the placeholders with real environments, puzzle moments and a strong hero render that represents the game as it exists now."
            }
          ]
        }
      ]
    },

    {
      slug: "reconstructing-memory",
      number: "002",
      status: "published",
      date: "2026-07-02",
      build: "Visual development",
      title: "Reconstructing memory",
      excerpt: "Exploring how unstable fragments can appear present without ever feeling entirely real.",
      cover: "../assets/gallery-2.svg",
      coverAlt: "Abstract reconstructed geometry from Echoing Horizon",
      tags: ["Art direction", "Rendering"],
      seoDescription: "Exploring reconstructed memories, fragmented geometry and point-cloud-inspired visuals in Echoing Horizon.",
      sections: [
        {
          id: "the-problem",
          title: "The problem with solid objects",
          navLabel: "The problem",
          showInNavigation: true,
          blocks: [
            { type: "paragraph", text: "Memory objects need to be readable enough to recognize, but not so physically convincing that they feel permanent. Fully solid props communicate presence too strongly; they begin to look like ordinary set dressing rather than incomplete reconstruction." },
            { type: "quote", text: "The object should look like it is there, while never feeling completely real." }
          ]
        },
        {
          id: "fragmenting",
          title: "Fragmenting the reconstruction",
          navLabel: "Fragmenting it",
          showInNavigation: true,
          blocks: [
            { type: "image", src: "../assets/gallery-2.svg", alt: "Fragmented geometric reconstruction", caption: "A placeholder study for fragmented memory geometry.", width: "wide" },
            { type: "paragraph", text: "The current direction uses broken silhouettes, sparse points and subtle internal motion. The form remains identifiable from a distance, while close inspection reveals that it is unstable and incomplete." },
            { type: "video", src: "", poster: "../assets/gallery-3.svg", caption: "Motion tests can be placed here when a local MP4 is available." }
          ]
        },
        {
          id: "gameplay",
          title: "Connecting it to gameplay",
          navLabel: "Gameplay connection",
          showInNavigation: true,
          blocks: [
            { type: "paragraph", text: "The visual system becomes more meaningful when it responds to the player. Reconstructed objects may become clearer near specific viewpoints, destabilize after a puzzle is solved or reveal new information when light passes through them." },
            { type: "gallery", images: [
              { src: "../assets/gallery-1.svg", alt: "Echoing Horizon gallery study one", caption: "Environment study" },
              { src: "../assets/gallery-4.svg", alt: "Echoing Horizon gallery study two", caption: "Lighting study" }
            ] }
          ]
        }
      ]
    },

    {
      slug: "building-puzzles-before-answers",
      number: "001",
      status: "published",
      date: "2026-06-14",
      build: "Gameplay prototype",
      title: "Building puzzles before answers",
      excerpt: "Refining rotating mirrors, beam blockers and the spaces that give each mechanic meaning.",
      cover: "../assets/gallery-1.svg",
      coverAlt: "Geometric puzzle space from Echoing Horizon",
      tags: ["Gameplay", "Puzzle design"],
      seoDescription: "A development update about puzzle design, rotating mirrors and beam blockers in Echoing Horizon.",
      sections: [
        {
          id: "starting-point",
          title: "Starting with the interaction",
          navLabel: "Starting point",
          showInNavigation: true,
          blocks: [
            { type: "paragraph", text: "The first prototypes focus on a small vocabulary of interactions: redirecting beams, rotating mirrors and using blockers to control where light can travel. The challenge is not inventing more mechanics, but finding spaces where the existing ones create meaningful decisions." }
          ]
        },
        {
          id: "readability",
          title: "Readability before difficulty",
          navLabel: "Readability",
          showInNavigation: true,
          blocks: [
            { type: "paragraph", text: "Puzzles are not intended to be timed or deliberately frustrating. The player should understand what the room is asking before solving it. Difficulty should come from reasoning, not from fighting the controls or searching for an invisible rule." },
            { type: "comparison", before: { label: "Before", image: "../assets/gallery-3.svg", alt: "Earlier puzzle layout" }, after: { label: "After", image: "../assets/gallery-4.svg", alt: "Revised puzzle layout" }, caption: "A comparison block can show revisions side by side." }
          ]
        },
        {
          id: "next-prototype",
          title: "The next prototype",
          navLabel: "Next prototype",
          showInNavigation: true,
          blocks: [
            { type: "paragraph", text: "The next pass will test how moving platforms and reconstructed objects can interact with the beam system without making the puzzle language feel crowded." }
          ]
        }
      ]
    }
  ]
};
