# Blog Website To-Do Plan

## Purpose

This plan breaks the blog website into small, context-safe tasks so each AI generation step stays focused and does not lose track of the current goal.

## How To Use This Plan

For every task, keep the AI prompt limited to:

- The task goal.
- The exact files or UI area being changed.
- The inputs the task depends on.
- The expected output.
- The constraints that must not change.
- The definition of done.

If a task feels large, split it again before generating code.

## Task Breakdown

### 1. Project Structure Setup

Goal: create a clean folder structure for the blog app.

Small bits:

1.1 Review current files in `src` and identify missing folders.
1.2 Create folders for `components`, `pages`, `data`, `hooks`, `utils`, and `assets` if needed.
1.3 Decide where blog post data will live for the first version.
1.4 Keep the structure minimal and avoid overbuilding.

Done when:

- The folder structure is ready for feature work.
- The app still builds without errors.

### 2. App Shell And Routing

Goal: set up the main navigation and page routes.

Small bits:

2.1 Add routes for home, blog list, blog detail, and new blog page.
2.2 Create a shared layout with header and footer.
2.3 Add navigation links between all major pages.
2.4 Make the layout responsive before adding advanced UI.

Done when:

- Users can move through the main pages.
- The shell works on mobile and desktop.

### 3. Design System Foundation

Goal: define a visual identity for the blog.

Small bits:

3.1 Pick typography, spacing, colors, and card styles.
3.2 Add shared button, input, badge, and section heading styles.
3.3 Establish container widths and responsive spacing rules.
3.4 Keep the style distinct from the default Vite template.

Done when:

- Core UI tokens are reusable.
- The site has a consistent editorial look.

### 4. Blog Data Model

Goal: define the content shape for posts and AI drafts.

Small bits:

4.1 Define the post object fields.
4.2 Define the AI draft object fields.
4.3 Create sample seed data for posts and categories.
4.4 Keep the data structure simple enough for local development.

Done when:

- The app has predictable mock content.
- Pages can render without a backend.

### 5. Home Page

Goal: build the first impression of the blog.

Small bits:

5.1 Add a featured post hero section.
5.2 Add recent posts and category sections.
5.3 Add a call to action for reading or creating posts.
5.4 Make the page visually strong but not crowded.

Done when:

- The home page clearly communicates the blog’s purpose.
- Featured and recent content are easy to scan.

### 6. Blog Listing Page

Goal: let users browse and filter posts.

Small bits:

6.1 Render a grid or list of post cards.
6.2 Add search by title, summary, or tag.
6.3 Add category and sort filters.
6.4 Add pagination or a simple load-more pattern.

Done when:

- Users can find posts quickly.
- Filters update the visible post list correctly.

### 7. Blog Detail Page

Goal: create the article reading experience.

Small bits:

7.1 Show title, author, date, cover image, and reading time.
7.2 Render body content with readable typography.
7.3 Add share actions and copy-link behavior.
7.4 Show related posts at the bottom.

Done when:

- The article page is pleasant to read.
- Readers can continue to other posts.

### 8. New Blog Page Layout

Goal: create the authoring workspace.

Small bits:

8.1 Add metadata fields for title, slug, excerpt, category, tags, and cover image.
8.2 Add the main content editor area.
8.3 Add preview and save actions.
8.4 Keep the layout simple before adding AI tools.

Done when:

- An author can start a post from scratch.
- The page is ready for draft generation features.

### 9. Manual Draft Workflow

Goal: support writing without AI first.

Small bits:

9.1 Add draft save state.
9.2 Add publish state.
9.3 Add a preview mode for the post.
9.4 Add autosave if the editor scope is small enough.

Done when:

- A post can move from draft to published.
- The author can preview content before publishing.

### 10. Generate With AI Entry Point

Goal: add the AI-assisted creation trigger on the new blog page.

Small bits:

10.1 Add a visible Generate with AI button or panel.
10.2 Add a prompt field for topic or article idea.
10.3 Add tone, length, and audience selectors.
10.4 Make sure the AI action does not replace manual editing.

Done when:

- The user can start an AI draft flow from the new blog page.
- The UI still supports manual editing.

### 11. AI Draft Output Flow

Goal: turn a prompt into a usable draft.

Small bits:

11.1 Generate title suggestions first.
11.2 Generate an outline next.
11.3 Generate full article content after the outline.
11.4 Insert the generated draft into the editor for review.

Done when:

- The output arrives in a staged way.
- The draft is editable immediately after generation.

### 12. AI Regeneration Controls

Goal: let authors refine AI output without starting over.

Small bits:

12.1 Add regenerate title.
12.2 Add regenerate outline.
12.3 Add regenerate selected section.
12.4 Add shorten and expand controls if needed.

Done when:

- The author can improve specific parts of the draft.
- The whole draft does not need to be regenerated every time.

### 13. SEO Helpers

Goal: help authors optimize posts before publishing.

Small bits:

13.1 Suggest meta title.
13.2 Suggest meta description.
13.3 Suggest tags and category hints.
13.4 Keep SEO helpers optional and non-blocking.

Done when:

- SEO inputs are easy to review and edit.
- The author can ignore them if not needed.

### 14. Validation And Error States

Goal: make the app resilient.

Small bits:

14.1 Show errors for failed saves.
14.2 Show errors for failed AI generation.
14.3 Add loading states for asynchronous actions.
14.4 Prevent publishing when required fields are missing.

Done when:

- Users understand what went wrong.
- The UI avoids silent failures.

### 15. Accessibility And Responsive Polish

Goal: make the experience usable on all devices.

Small bits:

15.1 Check keyboard navigation.
15.2 Check contrast and text sizing.
15.3 Tune mobile spacing and stacking.
15.4 Keep action buttons easy to reach on small screens.

Done when:

- The blog is usable on mobile and desktop.
- Core interactions work with keyboard input.

### 16. Content Quality Review

Goal: verify the final writing workflow.

Small bits:

16.1 Test a manual draft from start to publish.
16.2 Test an AI-generated draft from prompt to review.
16.3 Test regeneration on a single section.
16.4 Confirm the author can edit everything before publishing.

Done when:

- The full author flow works end to end.
- AI remains a helper, not a blocker.

## Recommended Build Order

1. Project structure.
2. App shell and routing.
3. Design system foundation.
4. Blog data model.
5. Home page.
6. Blog listing page.
7. Blog detail page.
8. New blog page layout.
9. Manual draft workflow.
10. Generate with AI entry point.
11. AI draft output flow.
12. AI regeneration controls.
13. SEO helpers.
14. Validation and error states.
15. Accessibility and responsive polish.
16. Content quality review.

## AI Prompt Template For Each Task

Use this structure when generating code or content:

- Task: what is being built.
- Scope: which files or page section are allowed to change.
- Input: what data, UI state, or props are available.
- Output: what should exist after the change.
- Constraints: what must stay unchanged.
- Acceptance: how to verify the task is complete.

## Notes

- Keep each AI prompt focused on one task only.
- If a task starts to touch unrelated UI, stop and split it.
- Prefer small, testable changes over large rewrites.
- Reuse existing components when possible.