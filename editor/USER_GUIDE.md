# Props Editor — User Guide

## For Non-Technical Users

### What is the Props Editor?

The Props Editor is a web interface that lets you customize Remotion videos without touching any code. You can:

- Change text content (headlines, CTAs, brand names)
- Swap images and assets
- Select different video layouts (landscape, square, portrait)
- Preview changes in real-time
- Generate render commands to create the final video

### Getting Started

1. **Start the editor**

   ```bash
   npm run editor
   ```

   Opens at `http://localhost:3001`

2. **Select a video**
   Use the "Video:" dropdown to choose which video composition you want to edit.

3. **Choose a format**

   Click one of the format buttons:
   - **Landscape** (16:9) — YouTube, web sites
   - **LinkedIn** (1:1) — LinkedIn, Instagram
   - **Short** (9:16) — TikTok, Reels, YouTube Shorts

4. **Edit properties**

   Fill in the form fields on the left:
   - **Text fields** (headline, title, etc.) — just type
   - **Numbers** — enter a numeric value
   - **Checkboxes** — toggle true/false
   - **Dropdowns** — select from predefined options
   - **Asset fields** (🖼️ icon) — click to open the asset picker

5. **Live preview**
   The video preview on the right updates automatically as you type (with a 300ms delay to avoid lag).

6. **Generate the render command**

   Once you're happy with your edits:
   - Click the **Copy** button below the render command
   - Paste into your terminal
   - Run the command to generate the final MP4 video

### Asset Picker

When you click an asset field (image URL, logo, etc.):

1. A dialog opens showing all available files in `public/`
2. **Filter by type**: click "All", "Images", "Videos", or "Audio"
3. Click a file to select it
4. It fills in the form with the file path

### Keyboard Shortcuts

- **Tab** — Move to next field
- **Shift+Tab** — Move to previous field
- **Enter** (in a field) — Does not submit; just moves focus
- **Ctrl+C** (on the copy button) — Copy the render command

### Common Issues

#### "Preview not updating"

- Check the browser console (F12 → Console tab) for errors
- Make sure JavaScript is enabled
- Refresh the page

#### "Asset picker is empty"

- The assets must be in the `public/` directory
- Try uploading files to `public/images/`, `public/videos/`, or `public/audio/`
- Refresh the editor

#### "Copy button doesn't work"

- Some browsers block clipboard access; use Ctrl+C manually
- Or use "Inspect Element" to view the command text directly

---

## For Developers

### How Props Editor Works

The Props Editor automatically generates form fields from Zod schemas defined in each video composition.

#### 1. Define a Schema

Create `src/videos/my-video/schema.ts`:

```typescript
import { z } from "zod";

export const myVideoSchema = z.object({
  headline: z.string().default("Default Headline"),
  ctaText: z.string().default("Learn More"),
  logoUrl: z.string().default("logo-placeholder.svg"),
  displayCount: z.number().default(5),
  isEnabled: z.boolean().default(true),
  theme: z.enum(["light", "dark"]).default("dark"),
});

export type MyVideoProps = z.infer<typeof myVideoSchema>;
```

Key things:

- Use `.default()` for initial values (not functions in Zod v4, just values)
- `z.string()` → text input
- `z.number()` → number input
- `z.boolean()` → checkbox
- `z.enum(["a", "b"])` → dropdown
- Fields ending in `Url`, `url`, `Src`, `src`, `Path`, `path` automatically become asset pickers

#### 2. Update Your Composition

```typescript
import type { MyVideoProps } from "./schema";

export const MyVideoComposition: React.FC<MyVideoProps> = (props) => {
  return (
    <AbsoluteFill>
      <h1>{props.headline}</h1>
      <img src={staticFile(props.logoUrl)} />
      <button>{props.ctaText}</button>
    </AbsoluteFill>
  );
};
```

#### 3. Register in `src/videos/registry.ts`

```typescript
import { myVideoSchema } from "./my-video/schema";

{
  id: "my-video",
  title: "My Video",
  component: MyVideoComposition,
  schema: myVideoSchema,
  defaultProps: myVideoSchema.parse({
    headline: "My Brand",
    ctaText: "Get Started",
    logoUrl: "logo.png",
    displayCount: 5,
    isEnabled: true,
    theme: "dark",
  }),
  durationInFrames: 450,
  fps: 30,
}
```

### Customizing Field Types

The Props Editor auto-detects field types from Zod schemas:

| Zod Type                             | Field Component     | Example                     |
| ------------------------------------ | ------------------- | --------------------------- |
| `z.string()`                         | Text input          | `z.string()`                |
| `z.number()`                         | Number input        | `z.number()`                |
| `z.boolean()`                        | Checkbox            | `z.boolean()`               |
| `z.enum(["a", "b"])`                 | Dropdown            | `z.enum(["light", "dark"])` |
| `z.string()` with `Url`/`Src` suffix | Asset picker        | `logoUrl`, `imageSrc`       |
| `z.string().optional()`              | Optional text       | `z.string().optional()`     |
| `z.number().default(10)`             | Number with default | `z.number().default(10)`    |

### Adding Asset Types

To auto-detect more asset field patterns, edit `editor/src/lib/schemaIntrospection.ts`:

```ts
// Around line 30:
const assetKeys = /[Uu]rl$|[Ss]rc$|[Pp]ath$|[Ii]mage$/; // Add |[Ii]mage$ for "image" field
```

### Extending the Form

To add custom fields beyond the standard types, edit `editor/src/components/FieldRenderer.tsx`:

```ts
// Around line 50, add:
case "custom-type":
  return <CustomTypeField {...props} />;
```

Then create `editor/src/components/fields/CustomTypeField.tsx`.

### Environment Variables

For development:

```bash
npm run editor
```

### Testing Changes

```bash
# Run tests for the Props Editor
npm run test:editor

# Run with watch mode
npm run test:editor:watch

# Run all tests (root + editor)
npm run test:all
```

### Code Structure

```
editor/
  src/
    lib/
      schemaIntrospection.ts    # Zod schema → form fields
      buildRenderCommand.ts     # Generate CLI command string
    hooks/
      useEditorState.ts         # State management + localStorage
      usePublicAssets.ts        # Fetch /api/assets
    components/
      VideoSelector.tsx         # Choose video from registry
      FormatSelector.tsx        # Choose 16:9 / 1:1 / 9:16
      PropsForm.tsx            # Main form with auto-generated fields
      FieldRenderer.tsx        # Dispatch by field type
      fields/                  # Individual field components
      AssetPicker.tsx          # Modal for selecting assets
      PreviewPanel.tsx         # @remotion/player integration
      RenderCommand.tsx        # Display + copy CLI command
      App.tsx                  # 2-column layout
    server/
      assets-api.ts            # Vite plugin: GET /api/assets
    main.tsx
  __tests__/                    # Component & hook tests
  vite.config.ts
  vitest.config.ts
  setupTests.ts
  tsconfig.json
  index.html
```

### Common Customizations

#### Change the port

Edit `editor/vite.config.ts`:

```ts
server: { port: 3001 },  // Change to 3002, 5000, etc.
```

#### Add a custom CSS theme

Edit `editor/src/App.module.css` — uses CSS Modules.

#### Hide fields from the editor

Edit your schema to mark fields as "internal":

```ts
// Not supported yet, but you can comment them out in the schema
// Only uncomment fields you want users to edit
```

#### Validate field values before render

Edit `editor/src/components/PropsForm.tsx` to add pre-render validation before showing the render command.

---

## Troubleshooting

### Port 3001 already in use

```bash
# Use a different port:
npm run editor -- --port 3002
```

Or kill the process:

```bash
lsof -i :3001
kill -9 <PID>
```

### Schema not detected

Make sure:

1. `schema.ts` is in `src/videos/<video-id>/`
2. Export named `<videoId>Schema` or the schema is the default export
3. Schema is registered in `src/videos/registry.ts` with `schema:` property
4. Restart the editor: `npm run editor`

### Assets not showing

1. Files must be in `public/` directory
2. Restart the editor
3. Check browser DevTools (F12) → Network tab → search for `/api/assets`
4. Should return a JSON array of file paths

### Tests failing

```bash
npm run test:editor
```

If ESLint errors:

```bash
npm run lint -- --fix editor/
```

---

## Next Steps

- [Remotion Docs](https://remotion.dev) — Learn more about video composition
- [React Hook Form Docs](https://react-hook-form.com) — Form state management
- Use Claude to generate or modify video compositions with prompts
