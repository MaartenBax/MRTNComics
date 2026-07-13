const VISUALS = [
  {
    id: "the-depot",
    title: "The Depot",
    category: "3d",
    label: "3D Environment",
    year: "2026",
    tools: ["Unreal Engine 5", "Cinema 4D", "Photoshop"],
    description: "An abandoned industrial environment focused on atmosphere, scale and lighting.",
    size: "wide",
    cover: "assets/depot.svg",
    alt: "The Depot environment",
    media: [
      {
        kind: "image",
        src: "assets/depot.svg",
        alt: "The Depot main view",
      },
      {
        kind: "image",
        src: "assets/concrete.svg",
        title: "The Depot — Loading Dock",
        description: "A closer look at the loading dock geometry.",
        alt: "The Depot loading dock variation",
      },
      {
        kind: "image",
        src: "assets/signal.svg",
        label: "Detail Study",
        description: "A tighter environmental detail from the same series.",
        alt: "The Depot detail variation",
      },
      {
        kind: "video",
        src: "assets/late-drive.mp4",
        poster: "assets/late-drive-poster.jpg",
        title: "The Depot — Flythrough",
        label: "Motion Study",
        tools: ["Unreal Engine 5", "Premiere Pro"],
        description: "A short cinematic movement study through the environment.",
        alt: "The Depot flythrough video",
      },
    ],
  },
  {
    id: "destruction",
    title: "Destructed Series",
    category: "3d",
    label: "3D Mixed Media",
    year: "2026",
    tools: ["Cinema 4D", "After Effects"],
    description: "",
    size: "tall",
    cover: "assets/DestructionSeries/cube-destruction.webp",
    alt: "",
    media: [
      {
        kind: "image",
        src: "assets/DestructionSeries/cube-destruction.webp",
        title: "Cube Destruction",
        description: "A metallic cube with a blue laser destroying the corner, debris is flying upward.",
      },
      {
        kind: "image",
        src: "assets/DestructionSeries/sphere-destruction.webp",
      },
      {
        kind: "image",
        src: "assets/DestructionSeries/pill-destruction.webp",
      },
      {
        kind: "image",
        src: "assets/DestructionSeries/piramid-destruction.webp",
      },
      {
        kind: "image",
        src: "assets/DestructionSeries/cone-destruction.webp",
      },
      {
        kind: "image",
        src: "assets/DestructionSeries/torus-destruction.webp",
      },
      {
        kind: "image",
        src: "assets/DestructionSeries/polyhedral-destruction.webp",
      },
    ],
  },
  {
    id: "posters",
    title: "Minimalist Posters",
    category: "design",
    label: "Minimalist Poster Series",
    year: "2026",
    tools: ["Adobe Illustrator"],
    description: "",
    size: "tall",
    cover: "assets/MinimalistPosters/10169268787880277.webp",
    alt: "",
    media: [
      {
        kind: "image",
        src: "assets/MinimalistPosters/10169268787880277.webp",
      },
      {
        kind: "image",
        src: "assets/MinimalistPosters/10169276928925277.webp",
      },
      {
        kind: "image",
        src: "assets/MinimalistPosters/10169404487385277.webp",
      },
      {
        kind: "image",
        src: "assets/MinimalistPosters/10169222387850277.webp",
      },
    ],
  },
  {
    id: "the-signal",
    title: "The Signal",
    category: "3d",
    label: "3D Render",
    year: "2026",
    tools: ["Unreal Engine 5", "Cinema 4D", "Photoshop"],
    description: "A cinematic environment study built around light, distance and atmosphere.",
    size: "tall",
    cover: "assets/signal.svg",
    alt: "The Signal placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/signal.svg",
      },
    ],
  },
  {
    id: "mono",
    title: "Mono",
    category: "3d",
    label: "Product Render",
    year: "2026",
    tools: ["Cinema 4D", "Octane Render"],
    description: "A monochromatic product-lighting study.",
    size: "normal",
    cover: "assets/mono.svg",
    alt: "Mono placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/mono.svg",
      },
    ],
  },
  {
    id: "concrete-study",
    title: "Concrete Study",
    category: "3d",
    label: "3D Render",
    year: "2026",
    tools: ["Cinema 4D", "Photoshop"],
    description: "A material and composition study focused on concrete surfaces.",
    size: "wide",
    cover: "assets/concrete.svg",
    alt: "Concrete Study placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/concrete.svg",
      },
    ],
  },
  {
    id: "fragment",
    title: "Fragment",
    category: "design",
    label: "Graphic Design",
    year: "2026",
    tools: ["Photoshop", "Illustrator"],
    description: "An abstract graphic-design experiment built from fractured geometry.",
    size: "normal",
    cover: "assets/fragment.svg",
    alt: "Fragment placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/fragment.svg",
      },
    ],
  },
  {
    id: "late-drive",
    title: "Late Drive",
    category: "motion",
    label: "Motion Study",
    year: "2026",
    tools: ["Cinema 4D", "After Effects"],
    description: "A short motion experiment built around speed, light and atmosphere.",
    size: "normal",
    cover: "assets/late-drive-poster.jpg",
    alt: "Late Drive motion study",
    media: [
      {
        kind: "video",
        src: "assets/late-drive.mp4",
        poster: "assets/late-drive-poster.jpg",
      },
    ],
  },
  {
    id: "neon-district",
    title: "Neon District",
    category: "3d",
    label: "3D Environment",
    year: "2026",
    tools: ["Unreal Engine 5", "Photoshop"],
    description: "An environment study exploring artificial light and urban scale.",
    size: "wide",
    cover: "assets/neon.svg",
    alt: "Neon District placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/neon.svg",
      },
    ],
  },
  {
    id: "void",
    title: "Void",
    category: "design",
    label: "Poster Design",
    year: "2026",
    tools: ["Photoshop", "InDesign"],
    description: "A minimal poster experiment using negative space and restrained typography.",
    size: "normal",
    cover: "assets/void.svg",
    alt: "Void placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/void.svg",
      },
    ],
  },
  {
    id: "still-life",
    title: "Still Life",
    category: "3d",
    label: "Product Study",
    year: "2026",
    tools: ["Cinema 4D", "Octane Render"],
    description: "A controlled lighting and material study.",
    size: "wide",
    cover: "assets/still-life.svg",
    alt: "Still Life placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/still-life.svg",
      },
    ],
  },
  {
    id: "horizon",
    title: "Horizon",
    category: "3d",
    label: "Environment Study",
    year: "2026",
    tools: ["Unreal Engine 5"],
    description: "A quiet environment study focused on distance and atmosphere.",
    size: "normal",
    cover: "assets/horizon.svg",
    alt: "Horizon placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/horizon.svg",
      },
    ],
  },
  {
    id: "orbit",
    title: "Orbit",
    category: "design",
    label: "Abstract Design",
    year: "2026",
    tools: ["Cinema 4D", "Photoshop"],
    description: "An abstract composition built from circular motion and geometric balance.",
    size: "normal",
    cover: "assets/orb.svg",
    alt: "Orbit placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/orb.svg",
      },
    ],
  },
  {
    id: "red-room",
    title: "Red Room",
    category: "motion",
    label: "Motion Experiment",
    year: "2026",
    tools: ["After Effects", "Cinema 4D"],
    description: "A short experimental motion piece built around light, rhythm and color.",
    size: "normal",
    cover: "assets/red-room.svg",
    alt: "Red Room placeholder artwork",
    media: [
      {
        kind: "image",
        src: "assets/red-room.svg",
      },
    ],
  },
];

/*
PROJECT TEMPLATE

{
  id: "unique-project-id",
  title: "Project Title",
  category: "3d", // "3d", "design", or "motion"
  label: "3D Environment",
  year: "2026",
  tools: ["Cinema 4D", "Photoshop"],
  description: "Default project description.",
  size: "normal", // "normal", "wide", or "tall"
  cover: "assets/project/project-cover.webp",
  alt: "Accessible project description",
  media: []
}

Every media item inherits title, label, year, tools, description and alt
from the project unless that media item overrides the value.
The thumbnail strip appears only when media contains more than one item.
*/
