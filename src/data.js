export const profile = {
  name: "Eduard A. Matubaran",
  title: "Computer Science · Software Engineering",
  intro:
    "I'm a Computer Science student specializing in Software Engineering, with an interest in software development, computer networking, and cybersecurity.",
  email: "eduardmatubaran13@gmail.com",
  github: "https://github.com/Ewadz",
  linkedin: "https://www.linkedin.com/in/eduard-matubaran-15383912b/",
  resume: "/resume.pdf",
  availability: "Open to opportunities",
};
// Projects appear in the same order as this array. Add your newest project at the top.
export const projects = [
  {
    id: "macroid",
    name: "MacroID",
    type: "Desktop · Computer Vision",
    description:
      "A desktop application for identifying freshwater macroinvertebrates and supporting river ecosystem assessment.",
    stack: ["Python", "PyQt6", "YOLOv8", "EfficientNet"],
    image: "/project-macroid.png",
    details:
      "MacroID combines image analysis, specimen identification, and assessment workflows into a desktop experience.",
  },
  {
    id: "heysweets",
    name: "HeySweets",
    type: "Web Application",
    description:
      "A bakery recipe and ingredient cost manager for tracking recipes, packaging, selling prices, and estimated profits.",
    stack: ["React", "Vite", "Tailwind CSS"],
    image: "/project-heysweets.png",
    details:
      "HeySweets helps organize ingredients and recipes and estimate the cost of making products.",
  },
  {
    id: "tahanan",
    name: "Tahanan Manila",
    type: "Mobile Application",
    description:
      "A Flutter and Dart mobile project for discovering and booking rooms and rental spaces in Manila.",
    stack: ["Flutter", "Dart", "Firebase"],
    image: "/project-mobile.png",
    details:
      "A student team project focused on exploring room listings, property details, and booking flows.",
  },
  {
    id: "dinner",
    name: "What'sForDinner",
    type: "iOS Application",
    description: "An iOS recipe discovery application using TheMealDB API.",
    stack: ["Swift", "TheMealDB API"],
    image: "/project-dinner.png",
    details:
      "An iOS app that helps users browse recipe ideas and meal details.",
  },
  {
    id: "seafood",
    name: "Seafood Bulk Buyer System",
    type: "Desktop Application",
    description: "A desktop system connecting seafood sellers and buyers.",
    stack: ["Python", "PyQt6", "QML", "JSON"],
    image: "/project-seafood.png",
    details:
      "A student desktop project for seafood selling and buying workflows.",
  },
];
export const certifications = [
  {
    name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    short: "SC-900",
    image: "/badges/microsoft-sc900.png",
    issuer: "Microsoft",
    detail: "Fundamentals of security, compliance, and identity.",
    url: "https://www.credly.com/badges/57edbdaf-90ff-483d-947c-4a5d68e8be02",
  },
  {
    name: "Introduction to Cybersecurity",
    short: "Cybersecurity",
    image: "/badges/cisco-cybersecurity.png",
    issuer: "Cisco Networking Academy",
    detail: "Foundational cybersecurity concepts and digital safety.",
    url: "https://www.credly.com/badges/e6494d62-c6f5-4021-a391-62836aa5e3a2",
  },
];
export const skills = [
  {
    title: "Development",
    items: [
      "Python",
      "Java",
      "JavaScript",
      "React",
      "Swift",
      "Flutter",
      "Dart",
    ],
  },
  {
    title: "Tools & Frameworks",
    items: ["Git", "GitHub", "Vite", "PyQt6", "FastAPI", "Firebase"],
  },
  {
    title: "Areas of Interest",
    items: [
      "Software Engineering",
      "Networking",
      "Cybersecurity",
      "Software Testing",
      "UI / UX",
    ],
  },
];
