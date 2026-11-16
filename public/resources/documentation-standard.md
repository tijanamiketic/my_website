# Documentation Standard

A universal standard for creating and updating project documentation.
It applies to every project, regardless of size or technology.

## 1. Purpose

Documentation exists so that a project is easy to understand and easy to change later,
by the owner, by another person, or by an AI assistant with no memory of earlier work.

A project is well documented when someone who has never seen it can answer five questions
without reading the code:

1. What is this?
2. How do I run it?
3. How do I change it?
4. What was decided, and why?
5. What changed, and when?

## 2. Principles

- **One standard, every project.** All projects use the same documents with the same names.
- **Record why, not what.** What the project does is visible in the project itself. The reasons are not.
- **Docs change with the project.** Documentation is updated in the same step as the change, never later.
- **One fact, one place.** Never copy the same information into two documents. Link instead.
- **Never invent.** If something cannot be determined from the project, ask the owner or write `TODO: confirm with owner`.
- **Short and plain.** Simple sentences, concrete steps, real file paths. No filler.

## 3. Where things live

| Location | Contains |
| --- | --- |
| Project repository | Documentation of this project only (the documents in section 4) |
| Owner's notes (Obsidian) | This standard, tasks, ideas, plans, research |

Do not copy this standard, tasks, or personal notes into the repository.

## 4. Required documents

Every project has these four documents.

### `README.md` (project root)
Answers: what is this, and how do I run it?
- One paragraph: what the project is and who it is for
- Requirements and setup steps
- How to run it locally
- How to publish or deploy it
- Links to the documents in `docs/`

### `docs/how-to-change.md`
Answers: how do I change it?
- Project layout: the main folders and what each one is for
- Step-by-step instructions for the most common changes
  (for a website: add a page, edit text, replace an image, change colors or fonts)
- Things that are easy to break, and how to avoid breaking them

### `docs/decisions.md`
Answers: what was decided, and why?
- One entry per decision, newest first
- Entries are never rewritten. If a decision changes, add a new entry that replaces the old one.

Entry template:

```
## YYYY-MM-DD: Short title
**Decision:** what was chosen.
**Why:** the reason, including what was considered and rejected.
**Consequences:** what this makes easier or harder.
```

### `CHANGELOG.md` (project root)
Answers: what changed, and when?
- Newest first, grouped by date
- One line per change, written for a person, not copied from commit messages

Entry template:

```
## YYYY-MM-DD
- Added: ...
- Changed: ...
- Fixed: ...
- Removed: ...
```

## 5. Additional document for AI projects

If the project uses an AI model, add `docs/ai.md`:

- **Prompts:** where they are stored, what each one is for, and why it is written that way
- **Model:** which model is used and why it was chosen
- **Evaluation:** the examples used to check that the solution works, and how to run the check
- **Limitations:** what the solution cannot do and where it is known to fail

## 6. Larger projects

The same documents apply. Grow them by splitting, not by inventing a new structure.

- Split a document when it passes about 300 lines or serves two different audiences.
- When `docs/` has more than five files, add `docs/index.md` listing each file with one line about it.
- Give each major module or service its own `README.md` next to its code.
  Keep in `docs/` only what applies to more than one module.

## 7. Procedure: create documentation for a project

Use this when a project is new or has no documentation.

1. Read the project: folder structure, configuration files, entry points, existing notes.
2. List what cannot be determined from the project and ask the owner before writing.
3. Create `README.md`.
4. Create `docs/how-to-change.md`.
5. Create `docs/decisions.md` with one entry for each decision already visible
   in the project (framework, hosting, structure). Mark unknown reasons with `TODO: confirm with owner`.
6. Create `CHANGELOG.md` with a first entry: "Documentation created".
7. If the project uses an AI model, create `docs/ai.md`.
8. Add the section below to the project's `CLAUDE.md` (create the file if missing),
   so the update rule applies in every future session:

```
## Documentation
After any change to this project, update the affected documents in the same step:
README.md (setup, run, deploy), docs/how-to-change.md (layout, common changes),
docs/decisions.md (new decision entry), CHANGELOG.md (every noticeable change),
docs/ai.md if present (prompts, model, evaluation, limitations).
If no document is affected, say so explicitly.
```

9. Report to the owner: which files were created and which `TODO` items remain.

## 8. Procedure: update documentation after a change

Run this in the same step as every change to the project.

| What changed | Update |
| --- | --- |
| Setup, run, or deploy steps | `README.md` |
| Folder layout, or the steps for a common change | `docs/how-to-change.md` |
| A tool, library, service, or approach was chosen or replaced | `docs/decisions.md` (new entry) |
| Anything a user or maintainer would notice | `CHANGELOG.md` |
| A prompt, the model, evaluation examples, a known limitation | `docs/ai.md` |
| Internal cleanup with no visible effect | Nothing. Say that no document was affected. |

At the end of the change, state which documents were updated.

## 9. Procedure: audit

Use this after a larger piece of work, or when the owner asks.

1. Compare each document with the current state of the project.
2. Report every mismatch: the document, what it says, and what is actually true.
3. Report missing documents and unresolved `TODO` items.
4. Do not fix anything silently. Present the list first, then fix what the owner approves.

## 10. Done means

- All required documents exist and answer their question.
- Every instruction in the documents works when followed exactly.
- No information is duplicated between documents.
- No `TODO` remains without the owner knowing about it.
