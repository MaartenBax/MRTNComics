/*
  R3DMYST About page content database.

  Everything inside the hero, five collapsed chapters, expanded chapters,
  project links, social links and contact form is configured here.
  The page HTML is only the shared shell and empty content mount points.
*/
window.ABOUT_PAGE_DATA = {
  meta: {
    title: "About Me — R3DMYST",
    description: "Meet the person, ideas and creative work behind R3DMYST.",
  },
  interaction: {
    openLabel: "Explore",
    closeLabel: "Close",
    oneOpenAtATime: true,
    updateUrlHash: true,
  },
  hero: {
    eyebrow: "About R3DMYST",
    title: "Independent creative work across games, design, visuals and storytelling",
    intro: "R3DMYST is a solo creative studio focused on crafting meaningful experiences and worlds through games, visual design and long-form storytelling.",
    image: "assets/about/hero-orbit.svg",
  },
  sections: [
    {
      expanded: {
        ariaLabel: "More about the R3DMYST name ",
        blocks: [
          {
            eyebrow: "About the name",
            span: "full",
            text: "R3DMYST began as a username, combining Red Mist from Kick-Ass with Mysterion from South Park. RedMyst was already taken, so I replaced the E with a 3. There was no larger idea behind it at the time; it was simply the name I used online. I kept using it as my interests and creative work changed, and over time it became the name attached to the things I make. R3DMYST is not a company or studio. It is simply the name I create under.",
            title: "It started as a username. I just kept using it.",
            type: "introSplit",
          },
          {
            attribution: "R3DMYST",
            span: "half",
            text: "Look at usual things with unusual eyes.",
            type: "quote",
          },
          {
            alt: "Abstract R3DMYST orbit artwork",
            caption: "",
            fit: "contain",
            span: "half",
            src: "assets/about/hero-orbit.svg",
            type: "image",
          },
        ],
      },
      id: "identity",
      label: "R3DMYST",
      number: "01",
      text: "It started as a username and gradually became the name attached to the things I make.",
      title: "The name I create under.",
      visual: {
        fit: "cover",
        image: "assets/R3DMYSTLogo.svg",
        imageAlt: "R3DMYST",
        type: "image",
      },
    },
    {
      expanded: {
        ariaLabel: "More about the creative work",
        blocks: [
          {
            eyebrow: "Different disciplines",
            span: "full",
            text: "R3DMYST brings games, graphic design, 3D, motion, comics and experimental visuals together. This text is a placeholder for a fuller explanation of how those disciplines influence one another.",
            title: "The medium changes. The intention does not.",
            type: "introSplit",
          },
          {
            items: ["Game design and development", "3D art and real-time visuals", "Graphic design and motion", "Comics and visual storytelling"],
            span: "half",
            title: "Areas of work",
            type: "list",
          },
          {
            images: [
              {
                alt: "Abstract work visual one",
                src: "assets/about/work-visual.svg",
              },
              {
                alt: "Abstract work visual two",
                src: "assets/about/person-visual.svg",
              },
            ],
            span: "half",
            type: "gallery",
          },
        ],
      },
      id: "work",
      label: "The Work",
      number: "02",
      text: "Different mediums. One vision. Stories, systems and visuals that stay with you.",
      title: "Games, design, comics and experiments.",
      visual: {
        image: "assets/about/work-visual.svg",
        imageAlt: "Abstract architectural scene",
        type: "image",
      },
    },
    {
      expanded: {
        ariaLabel: "More about the person behind R3DMYST",
        blocks: [
          {
            alt: "Portrait placeholder",
            caption: "Replace this with a portrait, silhouette or another image that feels more personal.",
            fit: "cover",
            span: "half",
            src: "assets/about/person-visual.svg",
            type: "image",
          },
          {
            eyebrow: "Behind the work",
            span: "half",
            text: "Designer, artist, developer — but mostly someone who likes making things.",
            type: "heading",
          },
          {
            span: "half",
            text: "Use this area for a more personal introduction: your background, the tools you use, the subjects you keep returning to, and the things that shape how you approach creative work.",
            type: "paragraph",
          },
          {
            items: ["Unreal Engine", "Cinema 4D", "Adobe Creative Cloud", "Narrative and visual design"],
            span: "half",
            title: "Selected disciplines",
            type: "list",
          },
        ],
      },
      id: "person",
      label: "The Person Behind It",
      number: "03",
      text: "Designer, artist and developer from the Netherlands. The person behind the ideas, visuals and worlds.",
      title: "A bit about me.",
      visual: {
        image: "assets/about/person-visual.svg",
        imageAlt: "Abstract portrait placeholder",
        type: "image",
      },
    },
    {
      expanded: {
        ariaLabel: "More about the R3DMYST projects",
        blocks: [
          {
            eyebrow: "Current projects",
            span: "full",
            text: "Separate projects, connected by the same creative point of view.",
            type: "heading",
          },
          {
            items: [
              {
                description: "A handcrafted experiential puzzle game built around movement, light, memory and atmosphere.",
                href: "EchoingHorizon/",
                linkLabel: "Explore the game",
                number: "01",
                title: "Echoing Horizon",
              },
              {
                description: "Autobiographical comics about routine, overstimulation and the small details of everyday life.",
                href: "MRTNcomics/",
                linkLabel: "Read the comics",
                number: "02",
                title: "MRTN Comics",
              },
              {
                description: "Renders, graphic design, motion and visual experiments collected in one evolving archive.",
                href: "Visuals/",
                linkLabel: "Browse the visuals",
                number: "03",
                title: "Visuals",
              },
            ],
            span: "full",
            type: "projects",
          },
        ],
      },
      id: "projects",
      label: "Projects",
      number: "04",
      text: "Echoing Horizon, MRTN Comics and visual work. Different chapters of the same creative space.",
      title: "The worlds I’m building.",
      visual: {
        projects: [
          {
            href: "EchoingHorizon/",
            mark: "eh",
            title: "Echoing Horizon",
          },
          {
            href: "MRTNcomics/",
            mark: "mrtn",
            title: "MRTN Comics",
          },
          {
            href: "Visuals/",
            mark: "visuals",
            title: "Visuals",
          },
        ],
        type: "projects",
      },
    },
    {
      expanded: {
        ariaLabel: "Contact R3DMYST",
        blocks: [
          {
            eyebrow: "Elsewhere",
            links: [
              {
                href: "#",
                label: "Instagram",
              },
              {
                href: "#",
                label: "YouTube",
              },
              {
                href: "#",
                label: "GitHub",
              },
              {
                href: "mailto:",
                label: "Email",
              },
            ],
            span: "half",
            title: "Find R3DMYST online.",
            type: "socials",
          },
          {
            action: "",
            eyebrow: "Direct message",
            fields: [
              {
                autocomplete: "name",
                label: "Name",
                name: "name",
                required: true,
                type: "text",
              },
              {
                autocomplete: "email",
                label: "Email",
                name: "email",
                required: true,
                type: "email",
              },
              {
                label: "Subject",
                name: "subject",
                required: false,
                type: "text",
              },
              {
                label: "Message",
                name: "message",
                required: true,
                rows: 5,
                type: "textarea",
              },
            ],
            method: "POST",
            span: "half",
            submitLabel: "Send message",
            successMessage: "Thanks — your message has been sent.",
            title: "Send a message.",
            type: "contactForm",
            unconfiguredMessage: "Add your form endpoint in about-data.js to enable sending.",
          },
        ],
      },
      id: "contact",
      label: "Contact",
      number: "05",
      text: "Get in touch for collaborations, opportunities or simply to say hello.",
      title: "Let’s connect.",
      visual: {
        buttonHref: "#contact",
        buttonLabel: "Open contact",
        image: "assets/about/contact-visual.svg",
        imageAlt: "Abstract horizon with a red light",
        type: "contact",
      },
    },
  ],
  approach: {
    number: "06",
    label: "Approach",
    titleLines: ["Focus on meaning.", "Everything else is noise"],
    principles: ["Precision over excess.", "Atmosphere over explanation.", "Experience over everything."],
  },
};