const VISUALS = [
  {
    id: "orbit",
    title: "Orbit",
    category: "3d",
    label: "3D Abstract Render",
    year: "2026",
    tools: ["Cinema 4D", "After Effects"],
    description: "Rings orbiting a sphere",
    size: "wide",
    cover: "assets/orbit/10156365043885277.webp",
    alt: "Abstract 3D Render - Orbit",
    media: [
      {
        kind: "image",
        src: "assets/orbit/10156365043885277.webp",
      },
      {
        kind: "image",
        src: "assets/orbit/10156365043870277.webp",
      },
      {
        kind: "image",
        src: "assets/orbit/10156365043895277.webp",
      },
      {
        kind: "image",
        src: "assets/orbit/10156365043900277.webp",
      },
    ],
  },
  {
    id: "destruction",
    title: "Destructed Series",
    category: "3d",
    label: "3D Mixed Media",
    year: "2020",
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
        src: "assets/DestructionSeries/piramid-destruction.webp",
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
    cover: "assets/MinimalistPosters/glados-portal-2.webp",
    alt: "",
    media: [
      {
        kind: "image",
        src: "assets/MinimalistPosters/glados-portal-2.webp",
      },
      {
        kind: "image",
        src: "assets/MinimalistPosters/10169276928925277.webp",
      },
      {
        kind: "image",
        src: "assets/MinimalistPosters/the-matrix.webp",
      },
      {
        kind: "image",
        src: "assets/MinimalistPosters/10169222387850277.webp",
      },
    ],
  },
  {
    id: "overgrown",
    title: "Overgrown",
    category: "3d",
    label: "3D Abstract Render",
    year: "2026",
    tools: ["Cinema 4D", "After Effects"],
    description: "",
    size: "normal",
    cover: "assets/overgrown/10158536042120277.webp",
    alt: "",
    media: [
      {
        kind: "image",
        src: "assets/overgrown/10158536042120277.webp",
      },
      {
        kind: "image",
        src: "assets/overgrown/10158530989160277.webp",
      },
      {
        kind: "image",
        src: "assets/overgrown/10158524089190277.webp",
      },
      {
        kind: "image",
        src: "assets/overgrown/10158527738670277.webp",
      },
      {
        kind: "image",
        src: "assets/overgrown/10158528717440277.webp",
      },
    ],
  },
  {
    id: "car-explosion",
    title: "Car Explosion",
    category: "motion",
    label: "Exploding stylized police car",
    year: "2026",
    tools: ["Cinema 4D", "After Effects"],
    description: "A short fluid simulation experiment of an exploding car",
    size: "normal",
    cover: "assets/car-explosion/late-drive-realesrgan-poster.webp",
    alt: "Car Explosion",
    media: [
      {
        kind: "video",
        src: "assets/car-explosion/late-drive-realesrgan.mkv",
        poster: "assets/car-explosion/late-drive-realesrgan-poster.webp",
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
