/*
  CONTENT FILE: this is the only file you need to edit to update the site.
  Keep the quotes, commas and brackets exactly as they are. Each entry sits between { } and ends with a comma.
  After editing, save the file and redeploy (push to GitHub, and Vercel publishes it).
*/
const SITE = {

  // Shown in the Email links and the Contact section.
  email: "pukarwanemlimbu13@gmail.com",

  // The lines that rotate in the header. Add or remove as you like.
  taglines: [
    "Turning polygons into worlds",
    "Maya by day, Substance by night",
    "Jewelry, characters and pixels, all hand-built",
    "Blending creativity with technical precision",
    "Rendering at 99% since forever"
  ],

  about: {
    paragraphs: [
      "Multimedia Generalist and multi-disciplinary designer specializing in 3D modeling, character design, jewelry design, branding and UI collaboration. Experienced in creating game-ready assets in Autodesk Maya, production-ready jewelry designs in MatrixGold and marketing visuals in Adobe Photoshop, with proficiency in video editing and AI-driven content creation, plus experience supporting recruitment and HR operations.",
      "Passionate about blending creativity with technical precision."
    ],
    role: "Multimedia Generalist",
    location: "Imadole, Lalitpur",
    availability: "Commissions, residencies, collaborations"
  },

  // ---------------------------------------------------------------
  // WORK: one entry per design.
  //   title: name shown in the table
  //   type:  "Graphics" or "3D" (used by the filter buttons)
  //   tags:  short comma-separated tags
  //   image: file name inside the images folder
  // To add a design: put the image in /images, then add a new entry (newest first is a good habit).
  // ---------------------------------------------------------------
  imageFolder: "images/",
  projects: [
    { title: "F1 Championship - Standings", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-1.png" },
    { title: "Race Winner - Celebration", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-2.png" },
    { title: "Pole Position - Poster", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-3.png" },
    { title: "Driver Profile - Concept", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-4.png" },
    { title: "A-10 Warthog - Poster", type: "Graphics", tags: "Design, Graphics, Film", image: "showcase-5.png" },
    { title: "Fernando Alonso - Profile", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-6.png" },
    { title: "Oscar Piastri - Driver", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-7.png" },
    { title: "Max Verstappen - F1", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-8.png" },
    { title: "Lewis Hamilton - Legend", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-9.png" },
    { title: "Rabindra Dhant - Portrait", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-10.png" },
    { title: "Rayquaza - Composition", type: "Graphics", tags: "Design, Graphics, Photography", image: "showcase-11.jpg"},
    { title: "T1 Esports - Concept", type: "Graphics", tags: "Design, Graphics, Esports", image: "showcase-12.png" },
    { title: "Bingo Bango Bongo - Poster", type: "Graphics", tags: "Design, Graphics, Film", image: "showcase-13.png" },
    { title: "Race Week - Infographic", type: "Graphics", tags: "Design, Graphics, Sports", image: "showcase-14.png" },
    { title: "Faker - Professional Player", type: "Graphics", tags: "Design, Graphics, Esports", image: "showcase-15.png" },
    { title: "Optycygnus", type: "3D", tags: "Character, 3D, Maya", image: "cygnus-1.jpg" },
    { title: "Digital Media Project - Game Map", type:"3D", tags: "3D, Maya, Game Design", image: "dmp-1.jpg" },
    { title: "Digital Media Project - Game Map", type:"3D", tags: "3D, Maya, Game Design", image: "dmp-2.jpg" },
    { title: "Galaxy", type:"3D", tags: "3D", tags: "3D, Maya, Simulation", image:"galaxy-1.jpg"},
    { title: "Galaxy", type:"3D", tags: "3D", tags: "3D, Maya, Simulation", image:"galaxy-2.jpg"},
    { title: "Atlas Vanguard", type:"3D", tags: "3D", tags: "Character, 3D, Maya", image:"pukar-wanem-2.jpg"},
    { title: "Atlas Vanguard", type:"3D", tags: "3D", tags: "Character, 3D, Maya", image:"pukar-wanem-3.jpg"},
    { title: "Atlas Vanguard", type:"3D", tags: "3D", tags: "Character, 3D, Maya", image:"pukar-wanem-6.jpg"},
    { title: "Galaxy", type:"3D", tags: "3D", tags: "3D, Maya, Simulation", image:"pukar-wanem-milky-3.jpg"},
    { title: "Digital Media Project - Game Map", type:"3D", tags: "3D, Maya, Game Design", image: "pukar-wanem-l-meuseum-0501.jpg" },
  ],

  // ---------------------------------------------------------------
  // 3D VIEWER: one entry per model tab.
  //   name:  tab label
  //   file:  path to a .glb inside the models folder, e.g. "models/character.glb"
  //   shape: placeholder shape (knot, sphere, cube, torus, cone), used only when there is no file
  // To show your own model: export a .glb, put it in /models, and replace a placeholder line with
  //   { name: "My Character", file: "models/my-character.glb" },
  // ---------------------------------------------------------------
  models: [
    { name: "Floral-Earring", file: "models/Floral.glb" },
    { name: "Sun-Earrinng", file: "models/sunearring.glb"},
    { name: "Knot",   shape: "knot" },
    { name: "Sphere", shape: "sphere" },
    { name: "Cube",   shape: "cube" },
    { name: "Torus",  shape: "torus" },
    { name: "Cone",   shape: "cone" }
  ],

  // Entries with the same organization are grouped; the years of the first one are used for the group.
  experience: [
    { org: "Paradox City Inc.", role: "Junior Graphic Designer / Associate HR", years: "2025 to 2026",
      details: "Worked as a multi-disciplinary designer and HR associate, handling graphic design, 3D and character design, jewelry design, UI collaboration and AI-based video content. Created branding visuals in Adobe Photoshop, developed 3D assets in Autodesk Maya and produced production-ready jewelry designs using MatrixGold. Collaborated with IT teams on UI design and supported video editing and motion graphics. Also assisted with recruitment and HR operations, including job postings, candidate coordination and administrative tasks." },
    { org: "Islington College", role: "Academic Tutor", years: "2023 to 2025",
      details: "Delivered 3D Modeling and Texturing modules as a tutor, leading lectures, demonstrations and hands-on practical sessions. Guided students through the complete asset creation pipeline, including modeling fundamentals, UV mapping, texturing workflows and project-based learning, while providing mentorship and technical feedback." },
    { org: "Islington College", role: "Graduate Teaching Assistant", years: "",
      details: "Supported lecturers in delivering modules on 3D Modeling, Texturing and VFX by guiding students through practical workflows and project development. Conducted hands-on workshops focused on Maya to Substance Painter pipelines, helping students understand asset creation, UV mapping, texturing and real-time rendering integration." },
    { org: "Islington College", role: "Teaching Assistant", years: "",
      details: "Guided and inspired second-year students through 3D Modeling and Texturing, building a dynamic learning environment that fosters creativity, technical proficiency and a deep understanding of the subject." }
  ],

  education: [
    { qualification: "MBA with Specialisation in Project Management", institution: "Islington College, London Metropolitan University", years: "2024 to 2026", notes: "" },
    { qualification: "BSc (Hons) Multimedia", institution: "Islington College, London Metropolitan University", years: "2021 to 2024", notes: "First Class Honors" },
    { qualification: "High School", institution: "Delhi Public School, B.P.K.I.H.S, Dharan, Sunsari", years: "2018 to 2021", notes: "" },
    { qualification: "Secondary School", institution: "Delhi Public School, B.P.K.I.H.S, Dharan, Sunsari", years: "2014 to 2018", notes: "" }
  ],

  skills: {
    software: ["Autodesk Maya", "Adobe Photoshop", "Unreal Engine", "DaVinci Resolve", "Adobe Premiere Pro", "Adobe After Effects", "3D Coat", "Adobe Substance Painter", "Rizom UV"],
    technical: ["Video Editing", "3D Modelling", "Visual Effects", "Audio Editing", "Motion Graphics", "Graphics Designing", "Video Production", "3D Animation", "Texturing", "UV Mapping"],
    soft: ["Management Skills", "Communication", "Teamwork", "Critical Thinking", "Decision-Making", "Creativity", "Open to criticism", "Leadership"]
  },

  certificates: [
    { provider: "Udemy", title: "Maya Environment Creation for Film" },
    { provider: "LinkedIn Learning", title: "Substance Painter: Photorealistic Techniques" }
  ]
};
