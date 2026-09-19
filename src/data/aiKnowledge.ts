import { contactLinks, projects, services, skillGroups } from './siteData.js'

export const portfolioKnowledge = {
  name: 'Eyad Darwish',
  title: 'Web & App Developer and Computer Science student',
  about: 'Eyad Darwish is a Web & App Developer studying Computer Science / Computers & Information. He builds modern web applications, mobile experiences, AI-powered products, APIs, automation systems, and thoughtful digital solutions with a focus on performance, usability, and clean design.',
  skills: skillGroups.flatMap((group) => group.items.map((item) => item.name)),
  projects: projects.map((project) => ({
    name: project.name,
    slug: project.slug,
    category: project.category,
    description: project.shortDescription.en,
    technologies: project.technologies,
    url: `/project/${project.slug}`,
  })),
  services: services.map((service) => service.title.en),
  contact: {
    email: contactLinks.email,
    phone: contactLinks.phone,
    github: contactLinks.github,
    linkedin: contactLinks.linkedin,
    x: contactLinks.x,
    facebook: contactLinks.facebook,
    whatsapp: contactLinks.whatsapp,
  },
} as const

export const portfolioKnowledgeText = JSON.stringify(portfolioKnowledge, null, 2)
