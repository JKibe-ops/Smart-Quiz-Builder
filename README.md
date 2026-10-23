# Cloudwise — AZ-900 practice, made clearer

Cloudwise is an independent, unofficial AZ-900 practice app built around a simple idea: every answer should teach something. Learners choose an AZ-900 skill area, answer original multiple-choice questions, and immediately see why an option is right or wrong. Progress is saved locally and summarized by topic.

> Cloudwise is not affiliated with, endorsed by, or sponsored by Microsoft. It does not use Microsoft logos and does not reproduce real exam questions. All practice questions here are original learning prompts based on the public AZ-900 skills outline.

## Try it

Open `index.html` in a modern browser. No account, API key, build step, or dependency installation is required. To serve it locally, run:

```sh
npx serve .
```

## What it does

- Covers the three AZ-900 skills areas: cloud concepts; Azure architecture and services; and Azure management and governance.
- Offers all-topic and topic-specific practice rounds, with 5, 10, or all available questions.
- Gives immediate, plain-language feedback and an explanation for every response.
- Tracks total answers, accuracy, a practice-based readiness snapshot, and topic accuracy in the browser's local storage.
- Reports the round score and per-topic results when a round ends.
- Uses responsive layouts, keyboard-operable controls, visible focus states, and reduced-motion support.

Progress remains in the current browser on the current device. No learner data is sent to a server. The readiness label is a learning aid based only on practice performance, not a promise or prediction of an exam result.

## Content and learning design

The questions are authored for this project and mapped to the public Microsoft Learn AZ-900 skills outline. They use original situations—including examples from everyday African businesses—to make abstract concepts more relatable. The quiz favors a concise feedback cycle: choose, get the correct answer and rationale, reflect, continue.

Content-authoring prompt used as a quality checklist:

> Write a new beginner-level multiple-choice learning question aligned to one named AZ-900 skills-outline area. Do not imitate, quote, or claim to reproduce a real exam item. Use a clear everyday scenario, one unambiguously best answer, three plausible alternatives, and a short explanation that teaches the underlying concept. Check technical accuracy against Microsoft Learn, avoid claims about exam appearance, and use an accessible, respectful example.

Questions were checked against the public outline and Microsoft Learn service documentation. The app is educational, not an exam simulator.

## Project files

- `index.html` — app structure and navigation
- `styles.css` — responsive visual design
- `questions.js` — topic definitions and original quiz content
- `app.js` — practice flow, feedback, scoring, and local progress
- `PITCH.md` — demo flow, pitch narrative, and Canva-ready slide copy

## Public references

- [Microsoft Learn: Azure Fundamentals certification](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
- [Microsoft Learn: AZ-900 study guide](https://aka.ms/AZ900-StudyGuide)

## Hackathon presentation

Open the ready-to-present [Cloudwise pitch deck](./pitch-deck.html) in a browser. Navigate with the arrow keys or on-screen controls; use **Print / PDF** to print or save it as a PDF. The full slide copy and speaking notes are in [`PITCH.md`](./PITCH.md).

The project presentation is also available as an [editable Canva copy](https://www.canva.com/design/DAHY2YOfmsw/oveScBMGzqMs7bOJ_1kW2Q/edit), made from the supplied [PLP Canva presentation template](https://canva.link/os6usknbpkr6vmi). The copy has nine project-focused slides. Add app screenshots and personalize the speaking notes before submitting.

## License

This project is an independent hackathon learning tool. Question content and code in this repository are original project work.
