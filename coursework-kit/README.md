# Article and coursework kit

Turns Markdown files into pages in the same style as your portfolio, plus a searchable index page. Set `layout: article` in a file for the magazine-style article layout (headline, standfirst, "In brief" box, reading time). Leave it out for the coursework layout (module, institution, level).

## Folder layout (put these side by side in your website project)
```
your-website/
  index.html, content.js, ...
  coursework-kit/        <- this folder
  articles/              <- generated pages (the build creates and overwrites this)
```

## First time
1. Copy the `coursework-kit` folder into your website project.
2. Open `coursework-kit/config.json` and set `baseUrl` to your live address (used in the citation text).
3. In the terminal: `cd coursework-kit`, `npm install`, then `node build.js`.
4. The pages appear in `../articles/`. Open `articles/index.html` (or run `npx serve ..`) to check them.
5. Link to them from your site, for example in the sidebar of `index.html`:
   `<a href="articles/">Articles</a>`
6. Commit and push as usual. The generated `coursework/` folder is what gets published.

## Add another coursework
1. Copy a file from `templates/` into `docs/` (article, report, essay, case study, reflective journal).
2. Fill in the front matter at the top (title, module, date, tags, summary...) and write the content under it.
3. Remove the line `draft: true`.
4. Run `node build.js` again.

## Writing tips (Markdown)
- Headings: `##` for main sections, `###` for sub-sections. The contents list is built from them.
- Table: use `| A | B |` rows. Put a line `Table 1: Caption` directly under it.
- Figure: `![Figure 1: Caption (Source, Year)](images/your-slug/fig-1.jpg)`, with the image file in `docs/images/your-slug/`. If the file is missing, a grey "Image not added yet" box shows instead.
- Footnote: write `[^1]` in the text and `[^1]: The note text` on its own line.
- A section called `## References` is shown with hanging indents, and links become clickable.

## Avoiding plagiarism problems
- Cite every source in the text and list them under `## Sources`. The page also gives readers a ready-made citation of your own article.
- The `rights` line states what others may reuse (short quotes with credit, not the full text).
- If the article is based on assessed work, keep the `adapted` line so the origin is clear, and check what your institution allows.
- Rewording a text does not make it original. Originality comes from your own analysis and from crediting what is not yours.

## Before you publish a piece of coursework
- Check your institution's rules on sharing assessed work. Many universities run plagiarism checks and treat copies of your work online as a risk, so waiting until after marking is the safe choice.
- Remove personal identifiers such as student and college ID numbers (the front matter has no place for them on purpose).
- Third-party images (maps, charts) belong to their owners. Add them only if you have permission or the licence allows it, and always credit the source in the caption. Otherwise leave the placeholder or link to the source.
- Use `draft: true` to keep a work in progress out of the build.
