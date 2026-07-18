/*
  R3DMYST About page content database.

  Everything inside the hero, five collapsed chapters, expanded chapters,
  project links, social links and contact form is configured here.
  The page HTML is only the shared shell and empty content mount points.
*/
window.ABOUT_PAGE_DATA = {
  meta: {
    title: "About Me — R3DMYST",
    description: "Meet the person, ideas and creative work behind R3DMYST."
  },

  interaction: {
    openLabel: "Explore",
    closeLabel: "Close",
    oneOpenAtATime: true,
    updateUrlHash: true
  },

  hero: {
    eyebrow: "About R3DMYST",
    title: "Independent creative work across games, design, visuals and storytelling",
    intro: "R3DMYST is a solo creative studio focused on crafting meaningful experiences and worlds through games, visual design and long-form storytelling.",
    image: "assets/about/hero-orbit.svg"
  },

  sections: [
    {
      id: "identity",
      number: "01",
      label: "R3DMYST",
      title: "The name and the philosophy.",
      text: "The name, the philosophy and the goal: create work that leaves a lasting impression.",
      visual: {
        type: "brand",
        image: "assets/R3DMYSTLogo.svg",
        imageAlt: "R3DMYST"
      },
      expanded: {
        ariaLabel: "More about the R3DMYST name and philosophy",
        blocks: [
          {
            type: "heading",
            eyebrow: "The idea behind the name",
            text: "One creative identity. Different ways of expressing it.",
            span: "half"
          },
          {
            type: "paragraph",
            text: "Use this space for the longer story behind R3DMYST: where the name came from, what it represents, and why all of the work lives under one creative identity.",
            span: "half"
          },
          {
            type: "quote",
            text: "Look at usual things with unusual eyes.",
            attribution: "R3DMYST",
            span: "half"
          },
          {
            type: "image",
            src: "assets/about/hero-orbit.svg",
            alt: "Abstract R3DMYST orbit artwork",
            caption: "Replace this placeholder with a brand image, sketch or visual experiment.",
            span: "half",
            fit: "contain"
          }
        ]
      }
    },
    {
      id: "work",
      number: "02",
      label: "The Work",
      title: "Games, design, comics and experiments.",
      text: "Different mediums. One vision. Stories, systems and visuals that stay with you.",
      visual: {
        type: "image",
        image: "assets/about/work-visual.svg",
        imageAlt: "Abstract architectural scene"
      },
      expanded: {
        ariaLabel: "More about the creative work",
        blocks: [
          {
            type: "heading",
            eyebrow: "Different disciplines",
            text: "The medium changes. The intention does not.",
            span: "half"
          },
          {
            type: "paragraph",
            text: "R3DMYST brings games, graphic design, 3D, motion, comics and experimental visuals together. This text is a placeholder for a fuller explanation of how those disciplines influence one another.",
            span: "half"
          },
          {
            type: "list",
            title: "Areas of work",
            items: [
              "Game design and development",
              "3D art and real-time visuals",
              "Graphic design and motion",
              "Comics and visual storytelling"
            ],
            span: "half"
          },
          {
            type: "gallery",
            images: [
              { src: "assets/about/work-visual.svg", alt: "Abstract work visual one" },
              { src: "assets/about/person-visual.svg", alt: "Abstract work visual two" }
            ],
            span: "half"
          }
        ]
      }
    },
    {
      id: "person",
      number: "03",
      label: "The Person Behind It",
      title: "A bit about me.",
      text: "Designer, artist and developer from the Netherlands. The person behind the ideas, visuals and worlds.",
      visual: {
        type: "image",
        image: "assets/about/person-visual.svg",
        imageAlt: "Abstract portrait placeholder"
      },
      expanded: {
        ariaLabel: "More about the person behind R3DMYST",
        blocks: [
          {
            type: "image",
            src: "assets/about/person-visual.svg",
            alt: "Portrait placeholder",
            caption: "Replace this with a portrait, silhouette or another image that feels more personal.",
            span: "half",
            fit: "cover"
          },
          {
            type: "heading",
            eyebrow: "Behind the work",
            text: "Designer, artist, developer — but mostly someone who likes making things.",
            span: "half"
          },
          {
            type: "paragraph",
            text: "Use this area for a more personal introduction: your background, the tools you use, the subjects you keep returning to, and the things that shape how you approach creative work.",
            span: "half"
          },
          {
            type: "list",
            title: "Selected disciplines",
            items: ["Unreal Engine", "Cinema 4D", "Adobe Creative Cloud", "Narrative and visual design"],
            span: "half"
          }
        ]
      }
    },
    {
      id: "projects",
      number: "04",
      label: "Projects",
      title: "The worlds I’m building.",
      text: "Echoing Horizon, MRTN Comics and visual work. Different chapters of the same creative space.",
      visual: {
        type: "projects",
        projects: [
          { title: "Echoing Horizon", href: "EchoingHorizon/", mark: "eh" },
          { title: "MRTN Comics", href: "MRTNcomics/", mark: "mrtn" },
          { title: "Visuals", href: "Visuals/", mark: "visuals" }
        ]
      },
      expanded: {
        ariaLabel: "More about the R3DMYST projects",
        blocks: [
          {
            type: "heading",
            eyebrow: "Current projects",
            text: "Separate projects, connected by the same creative point of view.",
            span: "full"
          },
          {
            type: "projects",
            items: [
              {
                number: "01",
                title: "Echoing Horizon",
                description: "A handcrafted experiential puzzle game built around movement, light, memory and atmosphere.",
                href: "EchoingHorizon/",
                linkLabel: "Explore the game"
              },
              {
                number: "02",
                title: "MRTN Comics",
                description: "Autobiographical comics about routine, overstimulation and the small details of everyday life.",
                href: "MRTNcomics/",
                linkLabel: "Read the comics"
              },
              {
                number: "03",
                title: "Visuals",
                description: "Renders, graphic design, motion and visual experiments collected in one evolving archive.",
                href: "Visuals/",
                linkLabel: "Browse the visuals"
              }
            ],
            span: "full"
          }
        ]
      }
    },
    {
      id: "contact",
      number: "05",
      label: "Contact",
      title: "Let’s connect.",
      text: "Get in touch for collaborations, opportunities or simply to say hello.",
      visual: {
        type: "contact",
        image: "assets/about/contact-visual.svg",
        imageAlt: "Abstract horizon with a red light",
        buttonLabel: "Open contact",
        buttonHref: "#contact"
      },
      expanded: {
        ariaLabel: "Contact R3DMYST",
        blocks: [
          {
            type: "socials",
            eyebrow: "Elsewhere",
            title: "Find R3DMYST online.",
            links: [
              { label: "Instagram", href: "#" },
              { label: "YouTube", href: "#" },
              { label: "GitHub", href: "#" },
              { label: "Email", href: "mailto:" }
            ],
            span: "half"
          },
          {
            type: "contactForm",
            eyebrow: "Direct message",
            title: "Send a message.",
            action: "",
            method: "POST",
            successMessage: "Thanks — your message has been sent.",
            unconfiguredMessage: "Add your form endpoint in about-data.js to enable sending.",
            fields: [
              { name: "name", label: "Name", type: "text", autocomplete: "name", required: true },
              { name: "email", label: "Email", type: "email", autocomplete: "email", required: true },
              { name: "subject", label: "Subject", type: "text", required: false },
              { name: "message", label: "Message", type: "textarea", rows: 5, required: true }
            ],
            submitLabel: "Send message",
            span: "half"
          }
        ]
      }
    }
  ],

  approach: {
    number: "06",
    label: "Approach",
    titleLines: ["Focus on meaning.", "Everything else is noise"],
    principles: [
      "Precision over excess.",
      "Atmosphere over explanation.",
      "Experience over everything."
    ]
  }
};
