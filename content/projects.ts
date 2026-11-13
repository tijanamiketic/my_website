import type { Project } from "./types";

/**
 * Services shown in the Projects carousel. Each card's link scrolls to Contact.
 * Add `image: "/projects/x.webp"` (file in /public/projects) to use a picture
 * instead of the generated gradient cover.
 */
export const projects: Project[] = [
  {
    title: { sr: "AI Chatbot po meri", en: "Custom AI Chatbot" },
    description: {
      sr: "Chatbot za sajt ili društvene mreže, naučen na informacijama o vašem poslovanju. Odgovara klijentima 24/7.",
      en: "A chatbot for your website or social media, trained on information about your business. It answers your customers 24/7.",
    },
    tags: ["LLM", "RAG", { sr: "Integracije", en: "Integrations" }],
    glyph: "[···]",
  },
  {
    title: { sr: "AI alat za kreiranje i editovanje sadržaja", en: "AI Content Creation & Editing Tool" },
    description: {
      sr: "Vaša lična aplikacija za kreiranje i editovanje AI sadržaja za društvene mreže, prilagođena potrebama vašeg brenda.",
      en: "Your own app for creating and editing AI content for social media, tailored to your brand.",
    },
    tags: [{ sr: "AI slike", en: "AI images" }, "AI video", "Web app"],
    glyph: "◫",
  },
  {
    title: { sr: "Glasovni AI agent", en: "AI Voice Agent" },
    description: {
      sr: "Virtuelni asistent koji se javlja na pozive, odgovara na pitanja i zakazuje termine prirodnim glasom.",
      en: "A virtual assistant that answers calls, responds to questions and books appointments in a natural voice.",
    },
    tags: ["Voice AI", { sr: "Telefonija", en: "Telephony" }, { sr: "Zakazivanje", en: "Scheduling" }],
    glyph: "∿",
  },
  {
    title: { sr: "Izrada web sajtova", en: "Website Development" },
    description: {
      sr: "Moderni, brzi i pregledni sajtovi prilagođeni vašem brendu, po želji povezani sa AI alatima.",
      en: "Modern, fast and clear websites tailored to your brand, optionally connected to AI tools.",
    },
    tags: ["Responsive", "SEO", { sr: "Dizajn", en: "Design" }],
    glyph: "</>",
  },
  {
    title: { sr: "Lični AI asistent na Telegramu", en: "Personal AI Assistant on Telegram" },
    description: {
      sr: "Vaš lični asistent uvek pri ruci: podsetnici, beleške, odgovori i zadaci preko jedne poruke. Može se povezati sa kalendarom, mejlom i drugim aplikacijama koje koristite.",
      en: "Your personal assistant, always at hand: reminders, notes, answers and tasks in a single message. It can connect to your calendar, email and the other apps you use.",
    },
    tags: ["Telegram", "LLM", { sr: "Automatizacija", en: "Automation" }],
    glyph: "➤",
  },
  {
    title: { sr: "Automatizovano upravljanje bazom podataka", en: "Automated Database Management" },
    description: {
      sr: "Podaci se sami unose, sortiraju i ažuriraju, bez ručnog prepisivanja i grešaka.",
      en: "Your data is entered, sorted and updated automatically, with no manual copying and no errors.",
    },
    tags: [{ sr: "Baze podataka", en: "Databases" }, { sr: "Integracije", en: "Integrations" }, { sr: "Izveštaji", en: "Reports" }],
    glyph: "⊞",
  },
  {
    title: { sr: "Automatske poruke", en: "Automated Messages" },
    description: {
      sr: "Potvrde, podsetnici i obaveštenja klijentima putem mejla, SMS-a, WhatsApp-a ili Vibera.",
      en: "Confirmations, reminders and notifications sent to your customers by email, SMS, WhatsApp or Viber.",
    },
    tags: ["Email", "WhatsApp", "SMS"],
    glyph: "↻",
  },
  {
    title: { sr: "Projekat po vašoj ideji", en: "Your Idea, Built for You" },
    description: {
      sr: "Imate ideju koja nije na listi? Recite mi šta vam treba i napraviću AI rešenje po meri.",
      en: "Have an idea that isn't on the list? Tell me what you need and I'll build a custom AI solution for you.",
    },
    tags: [{ sr: "Po meri", en: "Custom" }, { sr: "Konsultacije", en: "Consulting" }, { sr: "Po dogovoru", en: "By arrangement" }],
    glyph: "+",
  },
];
