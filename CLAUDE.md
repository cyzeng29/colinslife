# Development Guidelines

## Approach
- Be direct and concise. Briefly state the intended change, then implement it.
- Inspect relevant code and existing conventions before editing.
- Make the smallest complete change that solves the task.
- Avoid unrelated refactors, unnecessary dependencies, and speculative abstractions.
- Ask questions only when ambiguity materially affects correctness or scope.
- When creative design changes are requested, propose the direction and obtain approval before implementing it.

## Preserve Existing Behavior
- Do not remove existing content, UI elements, routes, or functionality unless explicitly requested.
- Preserve the introductory video, homepage transition, piano navigation, and established visual style.
- Reuse existing components and patterns before introducing alternatives.

## Code Organization
- Keep related functionality together in clearly named files and folders.
- Separate presentation, application logic, and data access.
- Keep React components focused. Extract reusable UI into components and reusable stateful logic into hooks when useful.
- Keep editable portfolio content and asset references separate from presentation code.
- If backend code exists, keep route handlers thin, business logic in services, and database operations in data-access modules.
- Follow the repository’s existing structure; do not introduce a backend or new architectural layers without a concrete need.
- Avoid duplicated logic, oversized files, circular dependencies, and miscellaneous utility files containing unrelated functions.

## Verification After Every Code Change
- After each coherent code change, run the relevant unit tests and formatting checks before beginning the next change or reporting completion.
- Use the repository’s configured commands and package manager. Inspect project configuration rather than guessing commands.
- If formatting fails, apply the formatter and rerun the checks.
- Before handing off the task, run the full unit test suite, lint checks, type checks, and production build where configured.
- Add or update meaningful tests for new behavior and bug fixes. Test observable behavior rather than implementation details.
- For UI changes, also verify affected interactions, responsive layouts, and keyboard accessibility when browser tooling is available.
- Fix failures introduced by your changes. Do not disable tests, weaken assertions, or suppress errors just to pass.
- If checks are unavailable, blocked, or already failing, report exactly what could not be verified and why. Never claim unrun checks passed.
- If testing or formatting is not configured, flag the gap and propose a minimal setup.

## Reliability and Security
- Handle loading, empty, missing-file, and error states where relevant.
- Validate external input at application boundaries.
- Never commit secrets or expose server credentials in client code.
- Avoid logging sensitive information.
- Preserve accessible markup, visible keyboard focus, and reduced-motion support.

## Completion
- Review the diff for accidental changes, debugging code, and unused imports.
- Update documentation when setup, commands, configuration, or behavior changes.
- Finish with a short summary of what changed, which checks ran and their results, and any remaining limitations.