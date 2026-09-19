# Camera Plain Variable font files go here

Drop the font files with these exact names and they are picked up
automatically by `src/app/globals.css` (no code change needed):

```
CameraPlainVariable.woff2    # preferred: one variable file, weight 100-900
```

Or, if you only have static weights:

```
CameraPlain-Regular.woff2    # weight 400 (body)
CameraPlain-Medium.woff2     # weight 500 (covers the 480 headline step)
CameraPlain-SemiBold.woff2   # weight 600
```

If a file is missing, its `@font-face` simply fails to load and the site
falls back to Inter (via `next/font` in `src/app/layout.tsx`) — nothing
breaks. Restarting `npm run dev` after adding files is enough.
