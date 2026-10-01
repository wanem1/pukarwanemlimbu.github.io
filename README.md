# Pukar Wanem Limbu: Portfolio site

A static site. There is nothing to install or build.

```
index.html     the page (design and behavior; you rarely need to touch this)
content.js     ALL your content: projects, 3D models, experience, education, skills
images/        your showcase images
models/        your 3D models (.glb)
```

## Add a new design
1. Resize the image to about 1600 px wide and compress it (JPG or WebP, ideally under 400 KB). Squoosh (squoosh.app) is a free tool for this.
2. Save it in `images/`, for example `images/my-new-poster.jpg`.
3. Open `content.js`, find `projects:`, and add a line at the top of the list:
   `{ title: "My New Poster", type: "Graphics", tags: "Design, Poster", image: "my-new-poster.jpg" },`
4. Save, then deploy (see below). The table gets 6 projects per page and adds new pages automatically.

`type` must be `"Graphics"` or `"3D"`, because the filter buttons use it.

## Add a 3D model
1. In Blender: File > Export > glTF 2.0, and choose **glTF Binary (.glb)**. Tick "Apply Modifiers". Keep the file under about 5 MB. Textures at 2048 px or smaller keep it light.
2. Save it in `models/`, for example `models/my-character.glb`.
3. In `content.js`, under `models:`, replace a placeholder line with:
   `{ name: "My Character", file: "models/my-character.glb" },`
4. The viewer centers and scales the model automatically. The pass buttons (Beauty, Clay, Wire, Normals, Flat) work on it. Beauty shows your own materials.

If a file cannot be loaded, the viewer shows a placeholder shape and says which file failed.

## Edit text, experience, skills
Everything is in `content.js`, with comments explaining each part. Keep the quotes, commas and brackets in place.

## Preview on your computer
Double-clicking `index.html` works for everything except loading `.glb` models (browsers block that from a plain file). To test models, run a tiny local server in this folder:
`npx serve .`
and open the address it prints.

## Deploy (Vercel)
1. Put this folder in a GitHub repository.
2. At vercel.com/new, import the repository. No build settings are needed.
3. After that, every push to GitHub publishes automatically. Vercel also makes a preview link for each branch so you can check changes first.

Your current showcase images sit at the root of your Silentforge site (`showcase-1.jpg`, ...). If you deploy this into that same project and leave them there, set `imageFolder: ""` in `content.js`. Otherwise copy them into `images/`.

## Comments
The discussion section currently saves posts only in each visitor's browser. For shared comments you need a small backend (for example Waline, or Supabase with the threaded UI connected to it).
