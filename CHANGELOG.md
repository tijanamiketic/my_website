# Changelog

## 2026-11-13
- Fixed: Security: Next.js upgraded from 16.4.0 to 16.4.6, which fixes two critical remote-code-execution flaws (`use cache` with typed arrays; image optimization with SVG files) and a high-severity denial of service in Server Actions. Also updated: eslint-config-next 16.4.6, zod 4.6.7 (memory exhaustion fix, used by the Anthropic SDK) and fast-xml-parser 5.12.1 (CPU use fix, used by the news feed).
- Changed: The Projects carousel shows eight service cards instead of the old projects: "AI Chatbot po meri" / "Custom AI Chatbot", "AI alat za kreiranje i editovanje sadržaja" / "AI Content Creation & Editing Tool", "Glasovni AI agent" / "AI Voice Agent", "Izrada web sajtova" / "Website Development", "Lični AI asistent na Telegramu" / "Personal AI Assistant on Telegram", "Automatizovano upravljanje bazom podataka" / "Automated Database Management", "Automatske poruke" / "Automated Messages" and "Projekat po vašoj ideji" / "Your Idea, Built for You". Titles, descriptions and tags are translated.
- Removed: The old projects (Lumen Tutor, PromptLab, Agent Atlas, DocuMind, Voice → Lesson, ClassPulse) and the year in the corner of each card.
- Changed: The card link reads "Kontakt →" / "Contact →" and scrolls to the Contact section. It used to read "Pogledaj projekat →" / "View project →" and led nowhere.
- Changed: All cards in the carousel are the same height, and the link always sits in the bottom-right corner, even under longer descriptions.
- Fixed: Links on the cards in the auto-scrolling carousel could not be clicked. Cards that are tilted back caught no clicks, and the repeated cards that make the loop seamless ignored clicks entirely.
- Changed: The chat assistant knows the services and sends visitors who ask about them to Contact or email.
- Changed: The section is renamed "Usluge — Šta mogu da napravim za vas" / "Services — What I can build for you" (was "Projekti — Napravljeno i pokrenuto" / "Projects — Things I've shipped"). The navigation reads "Usluge" / "Services", and the carousel buttons say "Prethodna / Sledeća usluga" / "Previous / Next service".

## 2026-10-16
- Changed: Upcoming Events shows a single card: "Radionica" / "Workshop", "Uvod u AI" / "Introduction to AI", "Uživo" / "In person". It has no date, time, seats or venue yet. The date block reads "Uskoro" / "Soon", and the register button is disabled and reads "Uskoro" / "Coming soon". The whole card is greyed out, with no tilt or glow on hover.
- Removed: The other events ("AI u učionici", "Pravimo zajedno: RAG", "Masterclass: AI agenti", "AI Builders Meetup").
- Changed: An event in `content/events.ts` may leave out `date`, `time`, `location`, `seats` and `url`. An event without a `date` is shown as coming soon and is never hidden as past.
- Changed: The chat assistant says the only upcoming event is the in-person "Uvod u AI" / "Introduction to AI" workshop, date to be announced, and suggests emailing for details.
- Removed: The footer line "Dizajnirano uz staklo, prelive i mnogo kafe." / "Designed with glass, gradients and a lot of coffee." The footer now shows only the copyright.
- Changed: The navigation button (desktop and mobile menu) reads "Kontaktiraj me" / "Contact me" and the hero's second button reads "Zakaži konsultacije" / "Book a consultation". Both scroll to Contact instead of opening Skool.
- Changed: The chat assistant describes the courses as coming soon, with no prices or Skool links, and suggests booking a consultation by email. Its quick replies "Besplatni kursevi" / "Free courses" and "Cene kurseva" / "Course prices" are now "Kursevi" / "Courses" and "Konsultacije" / "Book a consultation".
- Removed: The Skool link on the "Masterclass: AI agenti" event.
- Changed: The contact email is tijanamiketic.raz@gmail.com everywhere (Contact section, copy button, search data and chat assistant).
- Changed: LinkedIn in Contact links to Tijana's real profile. YouTube, GitHub and Skool are greyed out with an "Uskoro" / "Coming soon" label and are not links yet.
- Removed: Instagram from the social links.
- Removed: The newsletter sign-up ("The Sunday Prompt") from Contact, and every mention of the newsletter in the Events section and the chat assistant. The Contact card now shows the heading on the left and the email and social profiles on the right.
- Changed: All courses are greyed out with an "Uskoro" / "Coming soon" label instead of a price and an enroll button.
- Changed: Interviews & Press shows the real AK Academy article "Ovako sam ja počela" / "How I got started" (12 Mar 2026) instead of the mock interviews. The list beside it shows four questions from the article. The featured card, each list card and their buttons open the article in a new tab.
- Removed: The format filter (Sve / Podkast / Video / Članak / Radio) in Interviews & Press.
- Changed: The Interviews & Press intro reads "Razgovori i tekstovi u kojima delim svoje iskustvo sa veštačkom inteligencijom." / "Conversations and articles where I share my experience with AI."
- Fixed: On narrow phones (e.g. 375px) the Serbian Events cards were 5px wider than the screen, because the location "Beograd · Naučno-tehnološki park" could not wrap. Long event chips now wrap onto two lines on screens 760px and narrower.

## 2026-10-15
- Removed: The small "prevuci ili povuci prstom · pređi mišem za pauzu" / "drag or swipe · hover to pause" hint under the Projects heading.
- Changed: The About heading reads "AI koji rešava probleme" / "AI that solves problems", and the bio has new text in both languages. The quote, signature and Build / Teach / Share cards are unchanged.

## 2026-10-14
- Changed: The navigation logo and the social share image show "Tijana Miketić" instead of "T. Miketić".
- Fixed: Navigation links no longer wrap onto two lines (e.g. "AI News" on `/en`) and stay vertically aligned. Link spacing is slightly tighter, and the menu button now appears at 1220px and narrower (was 1180px).
- Changed: The name in the hero uses Roboto Slab 500. The role under it keeps Instrument Serif italic.
- Changed: Hero shows the full name, the new role ("AI Specijalista i Edukator" / "AI Specialist & Educator"), a new short description and the status "Primam prijave za konsultacije" / "Now booking consultations".
- Removed: The three floating cards around the hero photo and the "12k+" and "40+" stats. The hero now shows one stat: 9 courses & trainings.
- Added: Serbian version of the whole site (Latin script). Serbian is the default at `/`; English moved to `/en`.
- Added: SR | EN language switch in the navigation. It opens the same page and section in the other language.
- Added: Serbian translations of all content and all five blog posts.
- Changed: Dates, prices and plurals follow the page language (e.g. "22. okt 2026.", "349 €").
- Changed: The chat assistant, its quick replies, the newsletter form and all error messages follow the page language.
- Changed: Search metadata, sitemap and the social share image now exist per language, with links between the two versions.
- Changed: English chat window title and greeting now read "Ask the assistant" and "I'm this site's assistant".

## 2026-10-10
- Added: Documentation created (README, docs/how-to-change.md, docs/decisions.md, docs/ai.md, CHANGELOG).
