# Current V2 builder — function reference

Snapshot SHA-256: `aa1bc6f0fea22b79ddb41b8debcaface6a9e58d13c9714ba4b1c2b57ae3bcbe8`. This is a static source map, not a browser test.

435 named function declarations, including nested declarations. Every entry links to its source. There are 955 total JavaScript function nodes when arrow functions and callbacks are counted. Those are included in the [complete callable register](/Users/tamchap/Dev/mh_media/audits/current-builder-callables.md).

Direct calls and assignments are extracted from the JavaScript syntax tree. They exclude nested callback bodies, which have their own register entries. Assignment targets include local variables and DOM properties as well as saved data. A call may mutate data or dispatch indirectly; this register is not a complete alias/dataflow proof. Short source-derived return outlines are excerpts, not a substitute for branch details.

Read the [control/dependency audit](/Users/tamchap/Dev/mh_media/audits/current-builder-controls-and-dependencies.md) for practical behavior and findings.

## scrollPageHeightUnits — line 5496

Returns clamp((height / width) * SCENE_ASPECT * 100, STAGE_OBJECT_MAX_POSITION, SCROLL_MAX_HEIGHT_UNITS).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5496) · Owner: callback:5348

- Calls: `currentSlide`, `Number`, `clamp`
- Assigns: No direct assignment expressions; see calls and initializers.

## stageVerticalPositionMax — line 5504

Returns slide?.kind === "scroll" ? scrollPageHeightUnits(slide) : STAGE_OBJECT_MAX_POSITION.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5504) · Owner: callback:5348

- Calls: `currentSlide`, `scrollPageHeightUnits`
- Assigns: No direct assignment expressions; see calls and initializers.

## scrollViewportOffsetUnits — line 5508

Returns viewport.scrollTop / Math.max(pageFrameHeight, 1) * 100.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5508) · Owner: callback:5348

- Calls: `currentSlide`, `root?.querySelector`, `CSS.escape`, `Number`, `scrollSlidePositions.get`, `Math.max`
- Assigns: No direct assignment expressions; see calls and initializers.

## fitStageObjectBounds — line 5516

Clamps object position using rotated dimensions, horizontal annotation bleed and page height.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5516) · Owner: callback:5348

- Calls: `currentSlide`, `clamp`, `Number`, `Math.abs`, `Math.cos`, `Math.sin`, `Math.min`, `Number.isFinite`, `stageVerticalPositionMax`
- Assigns: `item.x`, `item.y`

## normalizeSiteColor — line 5595

Returns LEGACY_SITE_COLOR_REPLACEMENTS[color] \|\| color.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5595) · Owner: callback:5348

- Calls: `String(value \|\| fallback).trim().toLowerCase`, `String(value \|\| fallback).trim`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## isCroppableAnnotation — line 5618

Returns Boolean(item && CROPPABLE_ANNOTATION_TYPES.includes(item.type)).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5618) · Owner: callback:5348

- Calls: `Boolean`, `CROPPABLE_ANNOTATION_TYPES.includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## isShadowableAnnotation — line 5622

Currently returns true for any supplied item, broader than some shadow tooltips.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5622) · Owner: callback:5348

- Calls: `Boolean`
- Assigns: No direct assignment expressions; see calls and initializers.

## initializeApp — line 5784

Registers events, then chooses named-project startup or embedded/browser startup.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5784) · Owner: callback:5348

- Calls: `bindGlobalEvents`, `initializeProjectApp`, `prepareLoadedState`, `render`, `finishBuilderStartup`
- Assigns: No direct assignment expressions; see calls and initializers.

## prepareLoadedState — line 5796

Normalizes state, applies versioned visual migrations and smart defaults, resets undo history.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5796) · Owner: callback:5348

- Calls: `normalizeState`, `applyVisualRefinements`, `applyCoverAutoFit`, `applyFixedVideoFrame`, `applySmartDefaults`, `historySnapshot`, `Number`
- Assigns: `undoStack`, `committedSnapshot`, `lastDraftSavedAt`

## finishBuilderStartup — line 5807

Schedules demo startup or loads builder artwork/draft assets and remembered media folder.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5807) · Owner: callback:5348

- Calls: `window.setTimeout`, `loadShapes`, `loadDraftImages`, `restoreMediaSiteDirectory`
- Assigns: No direct assignment expressions; see calls and initializers.

## uid — line 5827

Returns ′${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5827) · Owner: callback:5348

- Calls: `crypto.randomUUID`, `Date.now().toString`, `Date.now`, `Math.random().toString(36).slice`, `Math.random().toString`, `Math.random`
- Assigns: No direct assignment expressions; see calls and initializers.

## clamp — line 5832

Returns Math.min(max, Math.max(min, Number(value) \|\| 0)).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5832) · Owner: callback:5348

- Calls: `Math.min`, `Math.max`, `Number`
- Assigns: No direct assignment expressions; see calls and initializers.

## escapeHtml — line 5836

Returns String(value ?? "") .replace(/&/g, "&amp;") .replace(/</g, "&lt;") .replace(/>/g, "&gt;") .replace(/"/g, "&quot;") .replace(/'/g, "&#039;").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5836) · Owner: callback:5348

- Calls: `String(value ?? "")         .replace(/&/g, "&amp;")         .replace(/</g, "&lt;")         .replace(/>/g, "&gt;")         .replace(/"/g, "&quot;")         .replace`, `String(value ?? "")         .replace(/&/g, "&amp;")         .replace(/</g, "&lt;")         .replace(/>/g, "&gt;")         .replace`, `String(value ?? "")         .replace(/&/g, "&amp;")         .replace(/</g, "&lt;")         .replace`, `String(value ?? "")         .replace(/&/g, "&amp;")         .replace`, `String(value ?? "")         .replace`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## safeLinkUrl — line 5845

Returns !url \|\| /^(?:javascript\|data):/i.test(url) ? "" : url.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5845) · Owner: callback:5348

- Calls: `String(value \|\| "").trim`, `String`, `/^(?:javascript\|data):/i.test`
- Assigns: No direct assignment expressions; see calls and initializers.

## readJson — line 5850

Returns fallback.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5850) · Owner: callback:5348

- Calls: `JSON.parse`
- Assigns: No direct assignment expressions; see calls and initializers.

## clone — line 5855

Returns JSON.parse(JSON.stringify(value)).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5855) · Owner: callback:5348

- Calls: `JSON.parse`, `JSON.stringify`
- Assigns: No direct assignment expressions; see calls and initializers.

## hotspotStyle — line 5859

Returns HOTSPOT_STYLES[normalizedIndex].

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5859) · Owner: callback:5348

- Calls: `Number`
- Assigns: No direct assignment expressions; see calls and initializers.

## contentsNumberStyle — line 5865

Returns ′--contents-number-color:${style.color};--contents-number-ink:${ink}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5865) · Owner: callback:5348

- Calls: `hotspotStyle`
- Assigns: No direct assignment expressions; see calls and initializers.

## hotspotSlotIndex — line 5871

Returns slide?.hotspots?.findIndex((item) => item.id === id) ?? -1.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5871) · Owner: callback:5348

- Calls: `currentSlide`, `slide?.hotspots?.findIndex`
- Assigns: No direct assignment expressions; see calls and initializers.

## slugify — line 5875

Returns String(value \|\| "") .toLowerCase() .trim() .replace(/[^a-z0-9]+/g, "-") .replace(/^-+\|-+$/g, "") .slice(0, 80).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5875) · Owner: callback:5348

- Calls: `String(value \|\| "")         .toLowerCase()         .trim()         .replace(/[^a-z0-9]+/g, "-")         .replace(/^-+\|-+$/g, "")         .slice`, `String(value \|\| "")         .toLowerCase()         .trim()         .replace(/[^a-z0-9]+/g, "-")         .replace`, `String(value \|\| "")         .toLowerCase()         .trim()         .replace`, `String(value \|\| "")         .toLowerCase()         .trim`, `String(value \|\| "")         .toLowerCase`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## detectMediaType — line 5884

Returns Object.entries(MEDIA_TYPES).find(([, pattern]) => pattern.test(value))?.[0] \|\| "image".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5884) · Owner: callback:5348

- Calls: `String`, `Object.entries(MEDIA_TYPES).find`, `Object.entries`
- Assigns: No direct assignment expressions; see calls and initializers.

## mediaDisplayFilename — line 5889

Returns decodeURIComponent(original.split(/[?#]/)[0].split("/").pop() \|\| original).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5889) · Owner: callback:5348

- Calls: `String(value \|\| "").trim`, `String`, `decodeURIComponent`, `url.pathname.split("/").filter(Boolean).pop`, `url.pathname.split("/").filter`, `url.pathname.split`, `original.split(/[?#]/)[0].split("/").pop`, `original.split(/[?#]/)[0].split`, `original.split`
- Assigns: No direct assignment expressions; see calls and initializers.

## builtInAnnotationFilename — line 5900

Returns "".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5900) · Owner: callback:5348

- Calls: `String(value \|\| "").trim`, `String`, `/^data:/i.test`, `url.pathname.indexOf`, `url.pathname.slice`, `decodeURIComponent`
- Assigns: No direct assignment expressions; see calls and initializers.

## canonicalAnnotationFilename — line 5915

Returns parts.join("/").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5915) · Owner: callback:5348

- Calls: `String(value \|\| "").replace`, `String`, `path.split("/").filter`, `path.split`, `parts.pop`, `parts.push`, `filename.toLowerCase`, `parts.join`
- Assigns: No direct assignment expressions; see calls and initializers.

## encodedAnnotationFilename — line 5925

Returns canonicalAnnotationFilename(value) .split("/") .map((part) => encodeURIComponent(part)) .join("/").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5925) · Owner: callback:5348

- Calls: `canonicalAnnotationFilename(value)         .split("/")         .map((part) => encodeURIComponent(part))         .join`, `canonicalAnnotationFilename(value)         .split("/")         .map`, `canonicalAnnotationFilename(value)         .split`, `canonicalAnnotationFilename`
- Assigns: No direct assignment expressions; see calls and initializers.

## annotationAssetUrl — line 5932

Returns ′${ANNOTATION_ASSET_ROOT}${encodedAnnotationFilename(filename)}?v=${ANNOTATION_ASSET_VERSION}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5932) · Owner: callback:5348

- Calls: `encodedAnnotationFilename`
- Assigns: No direct assignment expressions; see calls and initializers.

## publicAnnotationAssetUrl — line 5936

Returns ′${PUBLIC_ANNOTATION_ASSET_ROOT}${encodedAnnotationFilename(filename)}?v=${ANNOTATION_ASSET_VERSION}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5936) · Owner: callback:5348

- Calls: `encodedAnnotationFilename`
- Assigns: No direct assignment expressions; see calls and initializers.

## resolveAnnotationAssetSrc — line 5940

Returns filename ? annotationAssetUrl(filename) : String(value \|\| "").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5940) · Owner: callback:5348

- Calls: `builtInAnnotationFilename`, `annotationAssetUrl`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeShapeAssetUrl — line 5945

Returns filename ? publicAnnotationAssetUrl(filename) : encodeURI(String(value \|\| "")).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5945) · Owner: callback:5348

- Calls: `builtInAnnotationFilename`, `String(name \|\| "").toLowerCase`, `String`, `publicAnnotationAssetUrl`, `encodeURI`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderAnnotationAssetImage — line 5951

Builds annotation asset image markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5951) · Owner: callback:5348

- Calls: `String`, `escapeHtml`, `resolveAnnotationAssetSrc`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeHostedAnnotationUrl — line 5956

Returns String(value \|\| "").trim().

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5956) · Owner: callback:5348

- Calls: `String(value \|\| "").trim`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## embeddedProjectState — line 5962

Returns readJson(document.getElementById("project-state")?.textContent, {}).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5962) · Owner: callback:5348

- Calls: `readJson`, `document.getElementById`
- Assigns: No direct assignment expressions; see calls and initializers.

## loadState — line 5966

Loads browser state for builder when available, otherwise embedded project state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5966) · Owner: callback:5348

- Calls: `embeddedProjectState`, `localStorage.getItem`, `readJson`
- Assigns: `draftStorageError`

## projectApi — line 5978

Returns payload.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5978) · Owner: callback:5348

- Calls: `fetch`, `readJson`, `response.text`
- Assigns: No direct assignment expressions; see calls and initializers.

## projectUrl — line 5992

Returns url.href.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5992) · Owner: callback:5348

- Calls: `url.searchParams.set`
- Assigns: No direct assignment expressions; see calls and initializers.

## projectTimeLabel — line 5998

Returns ′Saved ${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:5998) · Owner: callback:5348

- Calls: `Number.isFinite`, `date.getTime`, `date.toLocaleDateString`, `date.toLocaleTimeString`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderProjectLoading — line 6004

Builds project loading markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6004) · Owner: callback:5348

- Calls: `escapeHtml`
- Assigns: `root.innerHTML`

## renderProjectChooser — line 6013

Builds project chooser markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6013) · Owner: callback:5348

- Calls: `escapeHtml`, `projects.map((project) => ′                 <li class="project-list__item">                   <div>                     <span class="project-list__name">${escapeHtml(project.name)}</span>                     <span class="project-list__updated">${escapeHtml(projectTimeLabel(project.updatedAt))}</span>                   </div>                   <div class="project-list__actions">                     <button type="button" data-action="open-project" data-id="${escapeHtml(project.id)}">Open</button>                     <button class="project-list__delete" type="button" data-action="delete-project" data-id="${escapeHtml(project.id)}" data-name="${escapeHtml(project.name)}">Delete</button>                   </div>                 </li>               ′).join`, `projects.map`
- Assigns: `root.innerHTML`

## initializeProjectApp — line 6042

Loads project list and requested disk project; may fall back to cached browser project after load failure.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6042) · Owner: callback:5348

- Calls: `renderProjectLoading`, `projectApi`, `Array.isArray`, `renderProjectChooser`, `projects.find`, `encodeURIComponent`, `clone`, `localStorage.setItem`, `JSON.stringify`, `prepareLoadedState`, `render`, `finishBuilderStartup`, `readJson`, `localStorage.getItem`, `showToast`
- Assigns: `projects`, `projectApiError`, `currentProject`, `state`, `draftStorageError`, `draftSavePhase`, `cached`

## newProjectTemplate — line 6101

Returns clone(embeddedProjectState()).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6101) · Owner: callback:5348

- Calls: `clone`, `embeddedProjectState`, `readJson`, `localStorage.getItem`
- Assigns: No direct assignment expressions; see calls and initializers.

## openProjectNameDialog — line 6110

Opens naming UI for new, rename or duplicate project operation.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6110) · Owner: callback:5348

- Calls: `root.querySelector(".project-name-dialog")?.remove`, `root.querySelector`, `root.insertAdjacentHTML`, `escapeHtml`, `input?.focus`, `input?.select`
- Assigns: `projectDialogMode`

## closeProjectNameDialog — line 6149

Closes project naming UI and clears dialog mode.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6149) · Owner: callback:5348

- Calls: `root.querySelector(".project-name-dialog")?.remove`, `root.querySelector`
- Assigns: `projectDialogMode`

## confirmProjectNameDialog — line 6154

Reads entered project name and dispatches the current naming operation.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6154) · Owner: callback:5348

- Calls: `root.querySelector`, `String(input?.value \|\| "").trim`, `String`, `input?.setCustomValidity`, `input?.reportValidity`, `closeProjectNameDialog`, `createProject`, `renameCurrentProject`, `duplicateCurrentProject`
- Assigns: No direct assignment expressions; see calls and initializers.

## createProject — line 6169

Source feedback: “The current draft did not save to disk, so New Draft was stopped.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6169) · Owner: callback:5348

- Calls: `showToast`, `Boolean`, `saveProjectToDiskNow`, `renderProjectLoading`, `projectApi`, `JSON.stringify`, `newProjectTemplate`, `location.assign`, `projectUrl`, `renderProjectChooser`
- Assigns: `projectApiError`

## openProject — line 6199

Source feedback: “The current draft did not save to disk, so switching was stopped.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6199) · Owner: callback:5348

- Calls: `/^project-[a-zA-Z0-9_-]{1,100}$/.test`, `String`, `saveProjectToDiskNow`, `root.querySelector`, `showToast`, `location.assign`, `projectUrl`
- Assigns: `selector.value`

## deleteProject — line 6210

Confirms whole-project deletion and calls local project API; refreshes chooser or error.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6210) · Owner: callback:5348

- Calls: `/^project-[a-zA-Z0-9_-]{1,100}$/.test`, `String`, `window.confirm`, `projectApi`, `encodeURIComponent`, `projects.filter`, `renderProjectChooser`
- Assigns: `projects`, `projectApiError`

## renameCurrentProject — line 6224

Updates project name through API and refreshes project list; leaves tutorial title separate.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6224) · Owner: callback:5348

- Calls: `name.trim`, `projectApi`, `encodeURIComponent`, `JSON.stringify`, `projects.map`, `render`, `showToast`
- Assigns: `currentProject`, `projects`

## duplicateCurrentProject — line 6243

Source feedback: “The current draft did not save to disk, so Copy was stopped.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6243) · Owner: callback:5348

- Calls: `saveProjectToDiskNow`, `showToast`, `projectApi`, `JSON.stringify`, `clone`, `location.assign`, `projectUrl`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeState — line 6260

Normalizes full tutorial/meta/UI state and selection bounds.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6260) · Owner: callback:5348

- Calls: `String`, `Boolean`, `String(state.tutorial.title \|\| "TUTORIAL TITLE").toUpperCase`, `Array.isArray`, `state.tutorial.slides.unshift`, `createSlide`, `state.tutorial.slides.map`, `clamp`
- Assigns: `state.meta`, `state.meta.version`, `state.meta.touched`, `state.meta.pageType`, `state.meta.group`, `state.meta.primaryActionLabel`, `state.meta.primaryActionUrl`, `state.meta.relatedCalloutEnabled`, `state.meta.relatedCalloutTitle`, `state.meta.relatedCalloutText`, `state.meta.relatedCalloutLabel`, `state.meta.relatedCalloutUrl`, `state.meta.demoBuilderVersion`, `state.meta.demoDefaultDuration`, `state.tutorial`, `state.tutorial.title`, `state.tutorial.slides`, `state.ui`, `state.ui.slideIndex`, `state.ui.contentsOpen`, `state.ui.videoModalId`

## applyVisualRefinements — line 6290

Versioned migration resetting transforms of image media using match fit.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6290) · Owner: callback:5348

- Calls: `Number`, `state.tutorial.slides.forEach`, `saveStateNow`
- Assigns: `state.meta.visualRefinementVersion`

## applyCoverAutoFit — line 6303

Versioned migration setting existing cover image/GIF to match fit with reset transform.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6303) · Owner: callback:5348

- Calls: `Number`, `["image", "gif"].includes`, `saveStateNow`
- Assigns: `cover.media.fit`, `cover.media.x`, `cover.media.y`, `cover.media.scale`, `state.meta.coverAutoFitVersion`

## applyFixedVideoFrame — line 6317

Versioned migration changing match media fits to contain.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6317) · Owner: callback:5348

- Calls: `Number`, `state.tutorial.slides.forEach`, `saveStateNow`
- Assigns: `state.meta.fixedVideoFrameVersion`

## normalizeSlide — line 6327

Normalizes per-slide content, media, timing, hotspots and annotations.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6327) · Owner: callback:5348

- Calls: `String`, `clamp`, `Number`, `detectMediaType`, `["match", "contain", "cover"].includes`, `normalizeSiteColor`, `Math.max`, `Math.round`, `uid`, `clone`, `normalizeMixedBodyValue`, `String(slide?.demo?.audioUrl \|\| "").trim`, `Array.isArray`, `slide.hotspots.map`, `slide.annotations.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeHotspot — line 6383

Normalizes numbered marker content, dimensions, lock and popup properties.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6383) · Owner: callback:5348

- Calls: `currentSlide`, `Number.isFinite`, `Number`, `uid`, `String`, `/^HOTSPOT\s+\d+$/i.test`, `String(item?.title \|\| ′HOTSPOT ${index + 1}′).trim`, `normalizeMixedBodyValue`, `hotspotStyle`, `clamp`, `stageVerticalPositionMax`, `Boolean`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeAnnotation — line 6415

Normalizes each annotation type, formatting, media, geometry and relationship fields.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6415) · Owner: callback:5348

- Calls: `currentSlide`, `["shape", "image", "gif", "video", "audio", "link", "text", "slide-intro", "callout", "markup", "cover", "blur", "magnifier", "clip-frame"].includes`, `normalizeMarkupKind`, `["regular", "italic", "underline", "bold", "hand", "impact-label", "impact-label-reversed"].includes`, `uid`, `clone`, `String`, `normalizeHostedAnnotationUrl`, `normalizeMixedBodyValue`, `Boolean`, `normalizeSiteColor`, `clamp`, `["hand", "impact-label", "impact-label-reversed"].includes`, `["text", "slide-intro", "callout"].includes`, `/^#[0-9a-f]{6}$/i.test`, `isPathMarkup`, `normalizeMarkupPoints`, `stageVerticalPositionMax`, `["cover", "blur"].includes`, `Number.isFinite`, `CROPPABLE_ANNOTATION_TYPES.includes`, `["left", "top", "width", "height"].every`, `["square", "rounded", "circle"].includes`, `["straight", "rounded"].includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeMarkupKind — line 6491

Returns valid ? candidate : "line-solid".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6491) · Owner: callback:5348

- Calls: `String`, `MARKUP_SHAPES.some`, `["circle-dotted", "square-dotted"].includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## isPathMarkup — line 6507

Returns kind.startsWith("line-") \|\| kind.startsWith("arrow-").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6507) · Owner: callback:5348

- Calls: `kind.startsWith`
- Assigns: No direct assignment expressions; see calls and initializers.

## isRotatableMarkup — line 6511

Returns isPathMarkup(normalized) \|\| normalized.startsWith("circle-") \|\| normalized.startsWith("square-").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6511) · Owner: callback:5348

- Calls: `normalizeMarkupKind`, `isPathMarkup`, `normalized.startsWith`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeMarkupPoints — line 6516

Returns { start: point(points?.start, defaults.start), curve: point(points?.curve, defaults.curve), end: point(points?.end, defaults.end) }.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6516) · Owner: callback:5348

- Calls: `kind.startsWith`, `point`
- Assigns: No direct assignment expressions; see calls and initializers.

## markupLabel — line 6531

Returns ′${styleLabel} ${shape}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6531) · Owner: callback:5348

- Calls: `normalizeMarkupKind`, `normalized.split`, `normalized.endsWith`
- Assigns: No direct assignment expressions; see calls and initializers.

## createSlide — line 6544

Returns normalizeSlide({ id: uid(kind), kind, title: kind === "cover" ? "TUTORIAL SUBTITLE" : kind === "video" ? "VIDEO PAGE" : kind === "scroll" ? "SCROLL PAGE" : "SLIDE TITLE", description: kind === "cover" ? "Tutorial description." : kind === "i… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6544) · Owner: callback:5348

- Calls: `normalizeSlide`, `uid`
- Assigns: No direct assignment expressions; see calls and initializers.

## currentSlide — line 6557

Returns state.tutorial.slides[state.ui.slideIndex].

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6557) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## activeHotspot — line 6561

Returns currentSlide()?.hotspots.find((item) => item.id === state.ui.activeHotspotId) \|\| null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6561) · Owner: callback:5348

- Calls: `currentSlide()?.hotspots.find`, `currentSlide`
- Assigns: No direct assignment expressions; see calls and initializers.

## slideIntroCard — line 6565

Returns slide?.annotations.find((item) => item.type === "slide-intro") \|\| null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6565) · Owner: callback:5348

- Calls: `currentSlide`, `slide?.annotations.find`
- Assigns: No direct assignment expressions; see calls and initializers.

## defaultSlideTitle — line 6569

Returns slide?.kind === "cover" ? "TUTORIAL SUBTITLE" : slide?.kind === "video" ? "VIDEO PAGE" : slide?.kind === "scroll" ? "SCROLL PAGE" : "SLIDE TITLE".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6569) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## isSlideIntroState — line 6575

Returns Boolean(slideIntroCard(slide)) && !slide.hotspots.some((item) => item.id === state.ui.activeHotspotId).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6575) · Owner: callback:5348

- Calls: `currentSlide`, `Boolean`, `slideIntroCard`, `slide.hotspots.some`
- Assigns: No direct assignment expressions; see calls and initializers.

## selectedObject — line 6579

Returns state.ui.selectedKind === "hotspot" ? slide.hotspots.find((item) => item.id === state.ui.selectedId) : slide.annotations.find((item) => item.id === state.ui.selectedId).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6579) · Owner: callback:5348

- Calls: `currentSlide`, `slide.hotspots.find`, `slide.annotations.find`
- Assigns: No direct assignment expressions; see calls and initializers.

## selectionKey — line 6587

Returns kind && id ? ′${kind}:${id}′ : "".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6587) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## selectionEntry — line 6591

Returns item ? { key, kind, id, item } : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6591) · Owner: callback:5348

- Calls: `key.indexOf`, `key.slice`, `currentSlide`, `["hotspot", "annotation"].includes`, `slide.hotspots.find`, `slide.annotations.find`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncObjectSelection — line 6605

Reconciles primary and multiple selection against objects in current slide.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6605) · Owner: callback:5348

- Calls: `[...new Set(multiSelection)].filter`, `selectionKey`, `selectionEntry`, `multiSelection.includes`
- Assigns: `multiSelection`, `state.ui.selectedKind`, `state.ui.selectedId`

## selectedObjects — line 6623

Returns multiSelection.map((key) => selectionEntry(key)).filter(Boolean).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6623) · Owner: callback:5348

- Calls: `syncObjectSelection`, `multiSelection.map((key) => selectionEntry(key)).filter`, `multiSelection.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## hotspotGroupingSelection — line 6628

Returns { hotspot: hotspots.length === 1 ? hotspots[0].item : null, annotations, valid: hotspots.length === 1 && annotations.length > 0 && hotspots.length + annotations.length === selection.length }.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6628) · Owner: callback:5348

- Calls: `selectedObjects`, `selection.filter`
- Assigns: No direct assignment expressions; see calls and initializers.

## objectGroupEntriesForItem — line 6640

Returns slide.annotations .filter((annotation) => annotation.objectGroupId === groupId) .map((annotation) => ({ key: selectionKey("annotation", annotation.id), kind: "annotation", id: annotation.id, item: annotation }))… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6640) · Owner: callback:5348

- Calls: `currentSlide`, `String`, `slide.annotations         .filter((annotation) => annotation.objectGroupId === groupId)         .map`, `slide.annotations         .filter`
- Assigns: No direct assignment expressions; see calls and initializers.

## objectGroupingSelection — line 6653

Returns { annotations, valid: onlyAnnotations && annotations.length >= 2, grouped: sameExistingGroup, groupId: sameExistingGroup ? groupIds[0] : "" }.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6653) · Owner: callback:5348

- Calls: `selectedObjects`, `selection.filter`, `annotations.map(({ item }) => item.objectGroupId).filter`, `annotations.map`, `annotations.every`
- Assigns: No direct assignment expressions; see calls and initializers.

## clipFrameMembers — line 6668

Returns slide.annotations.filter((annotation) => annotation.clipFrameId === frameId).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6668) · Owner: callback:5348

- Calls: `currentSlide`, `slide.annotations.filter`
- Assigns: No direct assignment expressions; see calls and initializers.

## clipFrameForMember — line 6674

Returns slide.annotations.find((item) => item.id === annotation.clipFrameId && item.type === "clip-frame") \|\| null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6674) · Owner: callback:5348

- Calls: `currentSlide`, `slide.annotations.find`
- Assigns: No direct assignment expressions; see calls and initializers.

## clipFrameSceneStyle — line 6679

Returns ′--clip-frame-scene-left:${-left * 100 / width}%;--clip-frame-scene-top:${-top * 100 / height}%;--clip-frame-scene-width:${10000 / width}%;--clip-frame-scene-height:${10000 / height}%′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6679) · Owner: callback:5348

- Calls: `Math.max`, `Number`
- Assigns: No direct assignment expressions; see calls and initializers.

## topLevelAnnotations — line 6687

Returns slide.annotations.filter((item) => !item.clipFrameId \|\| !frameIds.has(item.clipFrameId)).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6687) · Owner: callback:5348

- Calls: `slide.annotations.filter((item) => item.type === "clip-frame").map`, `slide.annotations.filter`
- Assigns: No direct assignment expressions; see calls and initializers.

## arrangementEntries — line 6692

Returns { entries: unlockedSelection, usesAllHotspots: false }.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6692) · Owner: callback:5348

- Calls: `selectedObjects`, `selection.filter`
- Assigns: No direct assignment expressions; see calls and initializers.

## isObjectSelected — line 6697

Returns MODE === "builder" && multiSelection.includes(selectionKey(kind, id)).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6697) · Owner: callback:5348

- Calls: `multiSelection.includes`, `selectionKey`
- Assigns: No direct assignment expressions; see calls and initializers.

## mediaBase — line 6701

Returns folder ? ′${MEDIA_ROOT}${folder}/′ : MEDIA_ROOT.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6701) · Owner: callback:5348

- Calls: `slugify`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncMediaUrlSeeds — line 6706

Updates blank/previous-base URL input seeds when media base changes.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6706) · Owner: callback:5348

- Calls: `mediaBase`, `[         root.querySelector("#mainMediaUrl"),         ...root.querySelectorAll('.annotation-row input:not(#annotation-link-url)')       ].filter(Boolean).forEach`, `[         root.querySelector("#mainMediaUrl"),         ...root.querySelectorAll('.annotation-row input:not(#annotation-link-url)')       ].filter`, `root.querySelector`, `root.querySelectorAll`
- Assigns: No direct assignment expressions; see calls and initializers.

## updateMediaDropZone — line 6717

Refreshes folder/link/copy controls and media status text.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6717) · Owner: callback:5348

- Calls: `root.querySelector`, `zone.querySelector`, `mediaDropStatusText`
- Assigns: `zone.dataset.state`, `status.textContent`, `connectButton.textContent`, `existingButton.disabled`, `copyButton.disabled`

## formatMediaFileSize — line 6731

Returns ′${(size / 1024 ** 3).toFixed(2)} GB′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6731) · Owner: callback:5348

- Calls: `Number`, `(size / 1024).toFixed`, `(size / 1024 ** 2).toFixed`, `(size / 1024 ** 3).toFixed`
- Assigns: No direct assignment expressions; see calls and initializers.

## mediaTypeForFile — line 6739

Returns Object.entries(MEDIA_TYPES).find(([, pattern]) => pattern.test(file?.name \|\| ""))?.[0] \|\| "".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6739) · Owner: callback:5348

- Calls: `String(file?.type \|\| "").toLowerCase`, `String`, `mime.startsWith`, `Object.entries(MEDIA_TYPES).find`, `Object.entries`
- Assigns: No direct assignment expressions; see calls and initializers.

## webSafeMediaFilename — line 6748

Returns ′${stem}${extension}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6748) · Owner: callback:5348

- Calls: `String(filename \|\| "media").trim`, `String`, `original.lastIndexOf`, `original.slice(dot).toLowerCase().replace`, `original.slice(dot).toLowerCase`, `original.slice`, `slugify`
- Assigns: No direct assignment expressions; see calls and initializers.

## availableMediaFilename — line 6756

Checks destination folder and chooses a unique filename rather than overwrite.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6756) · Owner: callback:5348

- Calls: `preferredName.lastIndexOf`, `preferredName.slice`, `directory.getFileHandle`
- Assigns: `index`

## openMediaHandleDatabase — line 6772

Returns new Promise((resolve, reject) => { const request = indexedDB.open(MEDIA_HANDLE_DB, 1); request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(MEDIA_HANDLE_STORE)) { request.result.createObjectStore(MEDIA_HANDLE_STOR… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6772) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## rememberMediaDirectoryHandle — line 6785

Stores a folder handle in IndexedDB for future picker sessions.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6785) · Owner: callback:5348

- Calls: `openMediaHandleDatabase`, `database.close`
- Assigns: No direct assignment expressions; see calls and initializers.

## rememberMediaSiteDirectory — line 6800

Returns rememberMediaDirectoryHandle(handle, MEDIA_HANDLE_KEY).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6800) · Owner: callback:5348

- Calls: `rememberMediaDirectoryHandle`
- Assigns: No direct assignment expressions; see calls and initializers.

## savedMediaDirectoryHandle — line 6804

Returns await new Promise((resolve, reject) => { const request = database.transaction(MEDIA_HANDLE_STORE, "readonly") .objectStore(MEDIA_HANDLE_STORE).get(key); request.onsuccess = () => resolve(request.result \|\| null); request.onerror = () => re… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6804) · Owner: callback:5348

- Calls: `openMediaHandleDatabase`, `database.close`
- Assigns: No direct assignment expressions; see calls and initializers.

## savedMediaSiteDirectory — line 6818

Returns savedMediaDirectoryHandle(MEDIA_HANDLE_KEY).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6818) · Owner: callback:5348

- Calls: `savedMediaDirectoryHandle`
- Assigns: No direct assignment expressions; see calls and initializers.

## restoreMediaSiteDirectory — line 6822

Loads remembered root/last directory and updates media connection state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6822) · Owner: callback:5348

- Calls: `savedMediaSiteDirectory`, `savedMediaDirectoryHandle(MEDIA_LAST_DIRECTORY_KEY).catch`, `savedMediaDirectoryHandle`, `handle.queryPermission`, `updateMediaDropZone`
- Assigns: `mediaSiteDirectoryHandle`, `mediaLastDirectoryHandle`, `mediaDropState`, `mediaDropMessage`

## ensureMediaDirectoryPermission — line 6843

Returns await mediaSiteDirectoryHandle.requestPermission({ mode: "readwrite" }) === "granted".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6843) · Owner: callback:5348

- Calls: `mediaSiteDirectoryHandle.queryPermission`, `mediaSiteDirectoryHandle.requestPermission`
- Assigns: No direct assignment expressions; see calls and initializers.

## connectMediaDirectory — line 6850

Source feedback: “Media website connected. Existing files will be linked without copying them.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6850) · Owner: callback:5348

- Calls: `updateMediaDropZone`, `showToast`, `window.showDirectoryPicker`, `Promise.all([           rememberMediaSiteDirectory(handle),           rememberMediaDirectoryHandle(handle, MEDIA_LAST_DIRECTORY_KEY)         ]).catch`, `Promise.all`, `rememberMediaSiteDirectory`, `rememberMediaDirectoryHandle`
- Assigns: `mediaDropState`, `mediaDropMessage`, `mediaSiteDirectoryHandle`, `mediaLastDirectoryHandle`

## publicMediaUrl — line 6888

Returns ′${MEDIA_SITE_ORIGIN}/${pathParts.map((part) => encodeURIComponent(part)).join("/")}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6888) · Owner: callback:5348

- Calls: `pathParts.map((part) => encodeURIComponent(part)).join`, `pathParts.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## mediaPickerStartDirectory — line 6892

Returns mediaLastDirectoryHandle \|\| mediaSiteDirectoryHandle.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6892) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## rememberSelectedMediaDirectory — line 6896

Remembers the directory containing a picked file for subsequent picker starting location.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6896) · Owner: callback:5348

- Calls: `Array.isArray`, `pathParts.slice`, `directory.getDirectoryHandle`, `rememberMediaDirectoryHandle`
- Assigns: `directory`, `mediaLastDirectoryHandle`

## linkMediaToSlide — line 6910

Links public media URL, resets transform/dimensions and may update slide kind.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6910) · Owner: callback:5348

- Calls: `mediaTypeForFile`, `state.tutorial.slides.find`, `publicMediaUrl`, `commit`
- Assigns: `targetSlide.media.url`, `targetSlide.media.type`, `targetSlide.media.fit`, `targetSlide.media.x`, `targetSlide.media.y`, `targetSlide.media.scale`, `targetSlide.media.naturalWidth`, `targetSlide.media.naturalHeight`, `targetSlide.kind`, `mediaDropState`, `mediaDropMessage`

## selectExistingMediaFile — line 6934

Picks existing file within connected root and links it to target slide.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6934) · Owner: callback:5348

- Calls: `currentSlide`, `connectMediaDirectory`, `showToast`, `ensureMediaDirectoryPermission`, `["image", "scroll"].includes`, `window.showOpenFilePicker`, `mediaPickerStartDirectory`, `Boolean`, `mediaSiteDirectoryHandle.resolve`, `rememberSelectedMediaDirectory`, `fileHandle.getFile`, `mediaTypeForFile`, `["image", "gif"].includes`, `linkMediaToSlide`, `pathParts.join`, `updateMediaDropZone`
- Assigns: `mediaDropState`, `mediaDropMessage`

## selectExistingAnnotationMedia — line 6993

Picks media inside connected folder and inserts hosted annotation; fallback URL routing has mismatch.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:6993) · Owner: callback:5348

- Calls: `activateToolbarAnnotationUrl`, `showToast`, `connectMediaDirectory`, `updateMediaDropZone`, `currentSlide`, `ensureMediaDirectoryPermission`, `window.showOpenFilePicker`, `mediaPickerStartDirectory`, `mediaSiteDirectoryHandle.resolve`, `rememberSelectedMediaDirectory`, `fileHandle.getFile`, `mediaTypeForFile`, `publicMediaUrl`, `toolbarVideoLabel`, `pathParts.join`, `addAnnotationFromUrl`, `resetToolbarAnnotationInput`
- Assigns: `mediaDropMessage`, `mediaDropState`

## selectExistingSlideAudio — line 7047

Links narration to target slide and recalculates timing.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7047) · Owner: callback:5348

- Calls: `showToast`, `connectMediaDirectory`, `updateMediaDropZone`, `currentSlide`, `ensureMediaDirectoryPermission`, `window.showOpenFilePicker`, `mediaPickerStartDirectory`, `mediaSiteDirectoryHandle.resolve`, `rememberSelectedMediaDirectory`, `fileHandle.getFile`, `mediaTypeForFile`, `state.tutorial.slides.find`, `stopSlideNarrationPreview`, `publicMediaUrl`, `syncDemoAudioTiming`, `pathParts.join`, `commit`
- Assigns: `mediaDropMessage`, `targetSlide.demo.audioUrl`, `mediaDropState`

## chooseNewMediaFile — line 7095

Source feedback: “File selection needs Chrome or Edge.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7095) · Owner: callback:5348

- Calls: `connectMediaDirectory`, `updateMediaDropZone`, `showToast`, `window.showOpenFilePicker`, `copyNewMediaFile`, `fileHandle.getFile`
- Assigns: `mediaDropMessage`, `mediaDropState`

## copyNewMediaFile — line 7120

Writes uniquely named copy beneath tutorials/folder, links public URL; does not publish.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7120) · Owner: callback:5348

- Calls: `mediaTypeForFile`, `updateMediaDropZone`, `showToast`, `mediaFolderSlug`, `root.querySelector("#mediaDropFolder")?.focus`, `root.querySelector`, `currentSlide`, `ensureMediaDirectoryPermission`, `formatMediaFileSize`, `mediaSiteDirectoryHandle.getDirectoryHandle`, `tutorialsDirectory.getDirectoryHandle`, `availableMediaFilename`, `webSafeMediaFilename`, `tutorialDirectory.getFileHandle`, `fileHandle.createWritable`, `writable.write`, `writable.close`, `linkMediaToSlide`
- Assigns: `mediaDropState`, `mediaDropMessage`

## computedPublicUrl — line 7175

Returns ′${CANONICAL_SITE}/learn/′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7175) · Owner: callback:5348

- Calls: `slugify`
- Assigns: No direct assignment expressions; see calls and initializers.

## publicUrl — line 7184

Returns computedPublicUrl(meta).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7184) · Owner: callback:5348

- Calls: `String(meta.publicUrl \|\| "").trim`, `String`, `String(meta.publicUrl).trim`, `computedPublicUrl`
- Assigns: No direct assignment expressions; see calls and initializers.

## applySmartDefaults — line 7191

Derives untouched metadata, slug and media folder from title and cover; honors touched flags.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7191) · Owner: callback:5348

- Calls: `state.tutorial.title.trim`, `slugify`, `set`, `computedPublicUrl`
- Assigns: No direct assignment expressions; see calls and initializers.

## markTouched — line 7212

Marks a metadata field as user-edited so automatic defaults do not overwrite it.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7212) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: `state.meta.touched[key]`

## scheduleSave — line 7216

Debounces builder save by 180ms and updates status.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7216) · Owner: callback:5348

- Calls: `clearTimeout`, `updateDraftSaveStatus`, `setTimeout`
- Assigns: `draftSavePhase`, `saveTimer`

## saveStateNow — line 7224

Writes browser state; queues disk save when named project is open.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7224) · Owner: callback:5348

- Calls: `clearTimeout`, `Date.now`, `localStorage.setItem`, `JSON.stringify`, `queueProjectDiskSave`, `updateDraftSaveStatus`
- Assigns: `state.meta.updatedAt`, `lastDraftSavedAt`, `browserBackupSaved`, `draftStorageError`, `draftSavePhase`

## queueProjectDiskSave — line 7252

Serializes project PUT requests; updates named-project record and status with success/error callbacks.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7252) · Owner: callback:5348

- Calls: `Promise.resolve`, `clone`, `updateDraftSaveStatus`, `projectDiskSavePromise         .catch(() => false)         .then(async () => {           const payload = await projectApi(′/${encodeURIComponent(PROJECT_ID)}′, {             method: "PUT",             body: JSON.stringify({ state: snapshot })           });           currentProject = payload.project;           const summary = {             id: currentProject.id,             name: currentProject.name,             createdAt: currentProject.createdAt,             updatedAt: currentProject.updatedAt           };           projects = projects.map((project) => project.id === PROJECT_ID ? summary : project);           if (saveVersion === projectDiskSaveVersion) {             draftStorageError = "";             draftSavePhase = "saved";             lastDraftSavedAt = Number(snapshot.meta?.updatedAt) \|\| Date.now();             updateDraftSaveStatus();           }           return true;         })         .catch`, `projectDiskSavePromise         .catch(() => false)         .then`, `projectDiskSavePromise         .catch`
- Assigns: `projectDiskSaveVersion`, `draftSavePhase`, `projectDiskSavePromise`

## saveProjectToDiskNow — line 7292

Triggers save and waits for current queued disk-save promise.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7292) · Owner: callback:5348

- Calls: `saveStateNow`
- Assigns: No direct assignment expressions; see calls and initializers.

## draftSaveStatusText — line 7298

Returns IS_PROJECT_APP ? "On-disk draft ready" : "Browser draft ready".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7298) · Owner: callback:5348

- Calls: `new Date(lastDraftSavedAt).toLocaleTimeString`
- Assigns: No direct assignment expressions; see calls and initializers.

## updateDraftSaveStatus — line 7308

Updates visible save status, state attribute and explanatory title.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7308) · Owner: callback:5348

- Calls: `root?.querySelector`, `draftSaveStatusText`
- Assigns: `status.dataset.state`, `status.textContent`, `status.title`

## editableCopyFilename — line 7318

Returns ′${fallbackStem}-editable-demo-builder.html′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7318) · Owner: callback:5348

- Calls: `DRAFT_FILENAME.replace`, `slugify`
- Assigns: No direct assignment expressions; see calls and initializers.

## historySnapshot — line 7324

Serializes tutorial/meta without updatedAt; excludes UI state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7324) · Owner: callback:5348

- Calls: `clone`, `JSON.stringify`
- Assigns: No direct assignment expressions; see calls and initializers.

## recordUndoStep — line 7330

Records changed content/meta snapshot, up to 50 entries.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7330) · Owner: callback:5348

- Calls: `historySnapshot`, `undoStack.push`, `undoStack.shift`
- Assigns: `committedSnapshot`

## undoLastChange — line 7338

Restores prior tutorial/meta snapshot, normalizes and repairs selection, then saves/renders.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7338) · Owner: callback:5348

- Calls: `recordUndoStep`, `undoStack.pop`, `showToast`, `readJson`, `normalizeState`, `currentSlide`, `isSlideIntroState`, `slide.hotspots.some`, `slideIntroCard`, `slide.annotations.some`, `historySnapshot`, `scheduleSave`, `render`
- Assigns: `state.meta`, `state.tutorial`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `state.ui.contentsOpen`, `state.ui.videoModalId`, `committedSnapshot`

## commit — line 7371

Applies defaults, records undo, schedules save, shows toast and optionally redraws.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7371) · Owner: callback:5348

- Calls: `applySmartDefaults`, `recordUndoStep`, `scheduleSave`, `showToast`, `render`
- Assigns: No direct assignment expressions; see calls and initializers.

## showToast — line 7379

Displays a temporary feedback message and schedules its removal.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7379) · Owner: callback:5348

- Calls: `clearTimeout`, `document.querySelector(".toast")?.remove`, `document.querySelector`, `document.createElement`, `node.setAttribute`, `document.body.append`, `setTimeout`
- Assigns: `node.className`, `node.textContent`, `toastTimer`

## toggleDraftMore — line 7390

Opens/closes More menu and focuses its first button.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7390) · Owner: callback:5348

- Calls: `render`, `setTimeout`
- Assigns: `draftMoreOpen`

## runDraftMoreAction — line 7396

Closes More menu before running the selected operation.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7396) · Owner: callback:5348

- Calls: `render`, `action`
- Assigns: `draftMoreOpen`

## icon — line 7402

Returns ′<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">${paths[name] \|\| ""}</svg>′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7402) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## toolbarIcon — line 7444

Returns ′<img class="toolbar-icon-image" src="${escapeHtml(localSrc)}" data-toolbar-fallback="${escapeHtml(hostedSrc)}" alt="" aria-hidden="true" onerror="this.onerror=null;this.src=this.dataset.toolbarFallback">′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7444) · Owner: callback:5348

- Calls: `encodeURIComponent`, `String`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## numberedToolbarArt — line 7451

Returns ′<img class="numbered-toolbar-art" src="${escapeHtml(src)}" alt="" aria-hidden="true">′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7451) · Owner: callback:5348

- Calls: `encodeURIComponent`, `String`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## groupedShapes — line 7456

Returns Array.from(groups, ([group, entries]) => ({ group, entries: entries.slice().sort((a, b) => String(a.name).localeCompare(String(b.name))) })).sort((a, b) => a.group.localeCompare(b.group)).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7456) · Owner: callback:5348

- Calls: `shapes.forEach`, `Array.from(groups, ([group, entries]) => ({         group,         entries: entries.slice().sort((a, b) => String(a.name).localeCompare(String(b.name)))       })).sort`, `Array.from`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderShapeNavigation — line 7469

Builds shape navigation markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7469) · Owner: callback:5348

- Calls: `groupedShapes`, `numberedToolbarArt`, `categories.map(({ group, entries }) => {               const disabled = ["BUILT-IN CONTROLS", "HOTSPOTS"].includes(group);               return ′                 <div class="shape-nav-category ${disabled ? "is-disabled" : ""}">                   <button class="shape-nav-category-trigger" type="button" role="menuitem" aria-haspopup="menu" ${disabled ? "disabled" : ""}>${escapeHtml(group)}</button>                   <div class="shape-nav-items" role="menu" aria-label="${escapeHtml(group)}">                     ${entries.map((shape) => ′<button class="shape-nav-item" type="button" role="menuitem" data-action="add-shape-from-menu" data-url="${escapeHtml(shape.url)}" data-name="${escapeHtml(shape.name)}" ${disabled ? "disabled" : ""}>${escapeHtml(String(shape.name).toUpperCase())}</button>′).join("")}                   </div>                 </div>               ′;             }).join`, `categories.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderDraftNavigation — line 7494

Builds draft navigation markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7494) · Owner: callback:5348

- Calls: `numberedToolbarArt`, `draftImageGroups.map(({ label, entries, loaded, available }) => ′               <div class="shape-nav-category">                 <button class="shape-nav-category-trigger" type="button" aria-haspopup="menu">${escapeHtml(label)}</button>                 <div class="shape-nav-items" role="menu" aria-label="${escapeHtml(label)} images">                   ${entries.length                     ? entries.map((entry) => ′<button class="shape-nav-item" type="button" data-action="add-draft-image" data-url="${escapeHtml(entry.url)}" data-name="${escapeHtml(entry.name)}" data-type="${escapeHtml(entry.type)}">${escapeHtml(entry.label)}</button>′).join("")                     : ′<span class="shape-nav-empty">${loaded ? (available ? "EMPTY FOLDER" : "FOLDER UNAVAILABLE") : "LOADING…"}</span>′}                 </div>               </div>             ′).join`, `draftImageGroups.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## positionShapeNavigation — line 7514

Positions asset dropdown to fit available screen space.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7514) · Owner: callback:5348

- Calls: `menu.querySelector`, `trigger.getBoundingClientRect`, `clamp`, `Math.max`, `menu.matches`, `Math.min`, `menu.classList.toggle`
- Assigns: `panel.style.left`, `panel.style.top`

## shapeMenuButtons — line 7529

Returns Array.from(scope?.querySelectorAll(selector) \|\| []) .filter((button) => !button.disabled && button.offsetParent !== null).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7529) · Owner: callback:5348

- Calls: `Array.from(scope?.querySelectorAll(selector) \|\| [])         .filter`, `Array.from`, `scope?.querySelectorAll`
- Assigns: No direct assignment expressions; see calls and initializers.

## focusShapeMenuMatch — line 7534

Moves keyboard focus to an asset/menu label matching typed letter.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7534) · Owner: callback:5348

- Calls: `String(letter \|\| "").toUpperCase`, `String`, `shapeMenuButtons(scope, selector)         .filter`, `shapeMenuButtons`, `Date.now`, `matches[index].focus`
- Assigns: `shapeMenuTypeahead`

## handleShapeNavigationKey — line 7549

Handles arrows, Escape and letter navigation within asset menus.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7549) · Owner: callback:5348

- Calls: `event.target.closest`, `positionShapeNavigation`, `menu.querySelector`, `item?.closest`, `/^[a-z0-9]$/i.test`, `focusShapeMenuMatch`, `event.preventDefault`, `["Enter", " ", "ArrowDown"].includes`, `shapeMenuButtons`, `first.focus`, `["Enter", " ", "ArrowRight"].includes`, `["Escape", "ArrowLeft"].includes`, `category?.querySelector(":scope > .shape-nav-category-trigger")?.focus`, `category?.querySelector`, `["ArrowDown", "ArrowUp"].includes`, `buttons.indexOf`, `buttons[(current + delta + buttons.length) % buttons.length].focus`, `menu.querySelector(":scope > .shape-nav-trigger")?.focus`
- Assigns: `shapeMenuTypeahead`

## isPipeBodyLine — line 7616

Returns /^\s*\\|(?:\s\|$)/.test(line).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7616) · Owner: callback:5348

- Calls: `/^\s*\\|(?:\s\|$)/.test`
- Assigns: No direct assignment expressions; see calls and initializers.

## isNumberedBodyLine — line 7620

Returns /^\s*\d+[.)](?:\s\|$)/.test(line).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7620) · Owner: callback:5348

- Calls: `/^\s*\d+[.)](?:\s\|$)/.test`
- Assigns: No direct assignment expressions; see calls and initializers.

## normalizeMixedBodyValue — line 7624

Returns normalized .split("\n") .map((line) => line.trim() && !isPipeBodyLine(line) ? ′\| ${line}′ : line) .join("\n").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7624) · Owner: callback:5348

- Calls: `String(value \|\| "").replace`, `String`, `normalized         .split("\n")         .map((line) => line.trim() && !isPipeBodyLine(line) ? ′\| ${line}′ : line)         .join`, `normalized         .split("\n")         .map`, `normalized         .split`
- Assigns: No direct assignment expressions; see calls and initializers.

## mixedBodyLines — line 7633

Returns String(value \|\| "") .replace(/\r/g, "") .split("\n") .map((line) => { const kind = isPipeBodyLine(line) ? "pipe" : isNumberedBodyLine(line) ? "numbered" : "plain"; const text = kind === "pipe" ? line.replace(/^\s*\\|\s?/, "") : kind === "… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7633) · Owner: callback:5348

- Calls: `String(value \|\| "")         .replace(/\r/g, "")         .split("\n")         .map`, `String(value \|\| "")         .replace(/\r/g, "")         .split`, `String(value \|\| "")         .replace`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## bodyHasPipeLines — line 7648

Returns mixedBodyLines(value).some((line) => line.pipe).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7648) · Owner: callback:5348

- Calls: `mixedBodyLines(value).some`, `mixedBodyLines`
- Assigns: No direct assignment expressions; see calls and initializers.

## bodyHasNumberedLines — line 7652

Returns mixedBodyLines(value).some((line) => line.numbered).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7652) · Owner: callback:5348

- Calls: `mixedBodyLines(value).some`, `mixedBodyLines`
- Assigns: No direct assignment expressions; see calls and initializers.

## wordColorTarget — line 7656

Allows rich formatting only for listed slide/annotation bindings; excludes hotspots and overall tutorial title.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7656) · Owner: callback:5348

- Calls: `String(binding \|\| "").split`, `String`, `path.split`, `["title", "description"].includes`, `state.tutorial.slides.find`, `["text", "introTitle", "introBody", "calloutTitle", "calloutBody"].includes`, `currentSlide().annotations.find`, `currentSlide`
- Assigns: No direct assignment expressions; see calls and initializers.

## safeWordHtml — line 7670

Sanitizes saved rich text; retains color/background-color spans and line breaks, not underline styling.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7670) · Owner: callback:5348

- Calls: `document.createElement`, `String`, `Array.from(template.content.childNodes).map(clean).join("").replace`, `Array.from(template.content.childNodes).map(clean).join`, `Array.from(template.content.childNodes).map`, `Array.from`
- Assigns: `template.innerHTML`

## savedWordHtml — line 7688

Returns rich formatting only while its saved plain text still matches field text.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7688) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## renderWordText — line 7693

Builds word text markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7693) · Owner: callback:5348

- Calls: `savedWordHtml`, `safeWordHtml`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## captureWordFormatting — line 7698

Stores rich HTML or per-line spans with matching plain text.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7698) · Owner: callback:5348

- Calls: `wordColorTarget`, `editor.classList.contains`, `Array.from(editor.querySelectorAll(":scope > .mixed-body-line")).map`, `Array.from`, `editor.querySelectorAll`, `safeWordHtml`
- Assigns: `target.item.richText`, `target.item.richText[target.field]`

## rememberWordSelection — line 7708

Records selected range offsets, binding and editor text; collapsed selection does not clear remembered range.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7708) · Owner: callback:5348

- Calls: `window.getSelection`, `selection.getRangeAt`, `parent?.closest`, `wordColorTarget`, `range.cloneRange`, `prefix.selectNodeContents`, `prefix.setEnd`, `prefix.toString`, `range.toString`
- Assigns: `rememberWordSelection.saved`

## applyWordColor — line 7721

Wraps remembered selected text portions in color/highlight spans, updates field and saves.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7721) · Owner: callback:5348

- Calls: `Array.from(root.querySelectorAll('[contenteditable="true"][data-bind]')).find`, `Array.from`, `root.querySelectorAll`, `showToast`, `["color", "background-color"].includes`, `CSS.supports`, `document.createTreeWalker`, `walker.nextNode`, `parts.push`, `Math.max`, `Math.min`, `parts.reverse().forEach`, `parts.reverse`, `editor.dispatchEvent`, `captureWordFormatting`, `commit`
- Assigns: `node`, `offset`

## renderWordColorControls — line 7750

Builds word color controls markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7750) · Owner: callback:5348

- Calls: `location.pathname.includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderMixedBodyContent — line 7755

Builds mixed body content markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7755) · Owner: callback:5348

- Calls: `mixedBodyLines(value).forEach`, `mixedBodyLines`, `flushParagraph`, `flushBullets`, `flushNumbered`, `blocks.join`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderBodyFormatBar — line 7804

Builds body format bar markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7804) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## renderBody — line 7823

Builds body markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7823) · Owner: callback:5348

- Calls: `wordColorTarget`, `savedWordHtml`, `mixedBodyLines`, `lines.map((line, index) => {           const placeholderAttribute = lines.length === 1 && !line.text             ? ′ data-placeholder="${escapeHtml(placeholder)}"′             : "";           const listClass = line.kind === "pipe" ? "is-pipe" : line.kind === "numbered" ? "is-numbered" : "";           return ′<div class="mixed-body-line ${listClass}" data-list-kind="${line.kind}" data-pipe="${line.pipe}"${placeholderAttribute}>${richLines?.[index] != null ? safeWordHtml(richLines[index]) : escapeHtml(line.text)}</div>′;         }).join`, `lines.map`, `escapeHtml`, `renderMixedBodyContent`
- Assigns: No direct assignment expressions; see calls and initializers.

## objectStyle — line 7841

Returns appearanceStyle(item) + cropWindowStyle(item) + ′--x:${item.x}%;--y:${item.y}%;--w:${item.w}%;--h:${item.h}%;--scroll-y:${scrollY}cqw;--scroll-h:${scrollHeight}cqw;--z:${item.z};--opacity:${item.opacity};--rotation:${item.rotation \|\| 0}de… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7841) · Owner: callback:5348

- Calls: `Math.max`, `Number`, `appearanceStyle`, `cropWindowStyle`
- Assigns: No direct assignment expressions; see calls and initializers.

## appearanceStyle — line 7859

Builds CSS variables for shadow, appearance text/frame border and fixed magnifier outline width.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7859) · Owner: callback:5348

- Calls: `clamp`, `Math.max`, `["image","gif","shape","video","audio","link","clip-frame","blur"].includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## selectedObjectColor — line 7868

Reads type-specific displayed picker value, including magnifier transparent fallback.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7868) · Owner: callback:5348

- Calls: `item.markup.includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## applySelectedObjectColor — line 7876

Routes color to type-specific field of primary object; plain-filled markup mismatch documented in audit.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7876) · Owner: callback:5348

- Calls: `selectedObject`, `/^#[0-9a-f]{6}$/i.test`, `item.markup.includes`, `commit`
- Assigns: `item.textColor`, `item.fillColor`, `item.markupColor`, `item.appearanceColor`

## cropWindowStyle — line 7888

Returns crop ? ′--crop-left:${crop.left}%;--crop-top:${crop.top}%;--crop-width:${crop.width}%;--crop-height:${crop.height}%;′ : "".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7888) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## renderSiteHeader — line 7893

Builds site header markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7893) · Owner: callback:5348

- Calls: `SITE_TOOL_LINKS.map((link) => ′                 <a href="${link.href}"${isInternalSiteUrl(link.href) ? "" : ' target="_blank" rel="noopener noreferrer"'}>${escapeHtml(link.label)}</a>               ′).join`, `SITE_TOOL_LINKS.map`, `sitePageUrl`, `escapeHtml`, `SITE_PRIMARY_LINKS.map((link) => ′<a class="site-nav__link" href="${link.href}"${link.action ? ′ data-action="${link.action}"′ : ""}>${escapeHtml(link.label)}</a>′).join`, `SITE_PRIMARY_LINKS.map`, `SITE_PRIMARY_LINKS.map((link) => ′<a href="${link.href}"${link.action ? ′ data-action="${link.action}"′ : ""}>${escapeHtml(link.label)}</a>′).join`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderTutorialPageLinks — line 7928

Builds tutorial page links markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7928) · Owner: callback:5348

- Calls: `slugify`, `safeLinkUrl`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## isDemoCoverSlide — line 7964

Returns false.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7964) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## slideHasMainVideo — line 7968

Returns Boolean(slide && (slide.kind === "video" \|\| slide.media?.type === "video") && String(slide.media?.url \|\| "").trim()).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7968) · Owner: callback:5348

- Calls: `Boolean`, `String(slide.media?.url \|\| "").trim`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## demoVideoTargetIndex — line 7972

Returns -1.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7972) · Owner: callback:5348

- Calls: `slideHasMainVideo`, `currentSlide`
- Assigns: No direct assignment expressions; see calls and initializers.

## shouldRenderDemoVideoGate — line 7979

Returns IS_DEMO_PLAYER && !demoVideoGateDismissed && demoVideoTargetIndex() >= 0.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7979) · Owner: callback:5348

- Calls: `demoVideoTargetIndex`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderDemoVideoSoundGate — line 7983

Builds demo video sound gate markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7983) · Owner: callback:5348

- Calls: `shouldRenderDemoVideoGate`, `icon`
- Assigns: No direct assignment expressions; see calls and initializers.

## isDemoCenteredSlide — line 7993

Returns Boolean(slide).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7993) · Owner: callback:5348

- Calls: `currentSlide`, `Boolean`
- Assigns: No direct assignment expressions; see calls and initializers.

## demoPopupClasses — line 7997

Returns ′is-demo-popup ${horizontal} ${vertical}${sizeClass}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:7997) · Owner: callback:5348

- Calls: `slide.hotspots.find`, `Number.isFinite`
- Assigns: No direct assignment expressions; see calls and initializers.

## demoPopupStyle — line 8007

Returns ′ style="--popup-width:${popupWidth}${popupHeight}${position}"′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8007) · Owner: callback:5348

- Calls: `slide.hotspots.find`, `Math.max`, `String`, `String(hotspot.body \|\| "").replace(/\r/g, "").split("\n").map`, `String(hotspot.body \|\| "").replace(/\r/g, "").split`, `String(hotspot.body \|\| "").replace`, `Number.isFinite`, `clamp`, `Math.round`
- Assigns: No direct assignment expressions; see calls and initializers.

## render — line 8024

Synchronizes live edits and selections, rebuilds builder/player DOM, then refreshes runtime media.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8024) · Owner: callback:5348

- Calls: `requestAnimationFrame`, `syncLiveEditableBeforeRender`, `syncObjectSelection`, `currentSlide`, `selectedObject`, `isDemoCoverSlide`, `isDemoCenteredSlide`, `renderSiteHeader`, `renderToolbar`, `renderDraftMorePopover`, `escapeHtml`, `renderSidebar`, `renderStage`, `renderReaderNav`, `renderTutorialPageLinks`, `renderDemoPlaybackControls`, `renderMetadata`, `renderMediaDropZone`, `renderContentsModal`, `renderVideoModal`, `renderDemoPreviewModal`, `syncRuntimeMedia`, `scheduleDemoStageSize`, `scheduleTextCardAutoFit`
- Assigns: `root.innerHTML`

## scheduleDemoStageSize — line 8059

Schedules stage size calculation to fit available width/height at scene aspect ratio.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8059) · Owner: callback:5348

- Calls: `cancelAnimationFrame`, `requestAnimationFrame`
- Assigns: `demoStageSizeFrame`

## fitRenderedTextCardsToContent — line 8078

Returns changed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8078) · Owner: callback:5348

- Calls: `root.querySelectorAll("[data-stage]").forEach`, `root.querySelectorAll`, `scheduleSave`
- Assigns: No direct assignment expressions; see calls and initializers.

## scheduleTextCardAutoFit — line 8110

Currently empty function; call sites do not perform automatic fitting here.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8110) · Owner: callback:5348

- Calls: `cancelAnimationFrame`
- Assigns: `textCardFitFrame`

## renderDraftMorePopover — line 8115

Builds draft more popover markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8115) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## renderLegacyToolbar — line 8126

Builds older toolbar markup; current render uses renderToolbar instead.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8126) · Owner: callback:5348

- Calls: `["slide-intro", "callout"].includes`, `slideIntroCard`, `/^#[0-9a-f]{6}$/i.test`, `selectedObjects`, `arrangementEntries`, `hotspotGroupingSelection`, `grouping.annotations.every`, `toolbarAnnotationInputConfig`, `toolbarIcon`, `escapeHtml`, `Math.round`, `renderShapeNavigation`, `MARKUP_SHAPES.map((shape, index) => ′                 <label class="toolbar-icon-select" title="Add ${shape.label.toLowerCase()} markup">                   ${toolbarIcon(["b1-line.png", "b2-circle.png", "b3-squre.png", "b4-arrow.png"][index])}                   <select data-markup-shape="${shape.key}" aria-label="Choose ${shape.label.toLowerCase()} markup style">                     <option value="">${shape.label}</option>                     ${(["circle", "square"].includes(shape.key) ? CLOSED_MARKUP_STYLES : MARKUP_STYLES).map((style) => ′<option value="${style.key}">${style.label}</option>′).join("")}                   </select>                 </label>               ′).join`, `MARKUP_SHAPES.map`, `numberedToolbarArt`, `projects.map((project) => ′<option value="${escapeHtml(project.id)}" ${project.id === PROJECT_ID ? "selected" : ""}>${escapeHtml(project.name)}</option>′).join`, `projects.map`, `draftSaveStatusText`, `renderMainMediaControls`, `SITE_COLOR_PRESETS.map(([value, label]) => ′<option value="${value}" label="${escapeHtml(label)}"></option>′).join`, `SITE_COLOR_PRESETS.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderToolbar — line 8293

Builds toolbar markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8293) · Owner: callback:5348

- Calls: `normalizeMarkupKind(selectedMarkup.markup).startsWith`, `normalizeMarkupKind`, `["slide-intro", "callout"].includes`, `isCroppableAnnotation`, `Math.round`, `Boolean`, `slideIntroCard`, `selectedObjects`, `selection.every`, `selection.filter`, `arrangementEntries`, `selection.some`, `objectGroupingSelection`, `/^#[0-9a-f]{6}$/i.test`, `button`, `renderShapeNavigation`, `renderDraftNavigation`, `escapeHtml`, `projects.map((project) => ′<option value="${escapeHtml(project.id)}" ${project.id === PROJECT_ID ? "selected" : ""}>${escapeHtml(project.name)}</option>′).join`, `projects.map`, `draftSaveStatusText`, `numberedToolbarArt`, `renderWordColorControls`, `MARKUP_SHAPES.map((shape, index) => ′<label class="numbered-toolbar-control" title="Add ${shape.label.toLowerCase()} markup">${numberedToolbarArt(["tb-B1-line-dropdown.png", "tb-B2-circle-dropdown.png", "tb-B3-square-dropdown.png", "tb-B4-arrow-dropdown.png"][index])}<select data-markup-shape="${shape.key}" aria-label="Add ${shape.label.toLowerCase()} markup"><option value="">${shape.label}</option>${(["circle", "square"].includes(shape.key) ? CLOSED_MARKUP_STYLES : MARKUP_STYLES).map((style) => ′<option value="${style.key}">${style.label}</option>′).join("")}</select></label>′).join`, `MARKUP_SHAPES.map`, `selectedObjectColor`, `[0,3,10,50].includes`, `SITE_COLOR_PRESETS.map(([value, label]) => ′<option value="${value}" label="${escapeHtml(label)}"></option>′).join`, `SITE_COLOR_PRESETS.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderSidebar — line 8459

Builds sidebar markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8459) · Owner: callback:5348

- Calls: `bodyHasPipeLines`, `bodyHasNumberedLines`, `isDemoCenteredSlide`, `demoPopupClasses`, `slide.hotspots.find`, `scrollExpandedHotspots.get`, `escapeHtml`, `demoPopupStyle`, `renderPopupResizeHandles`, `renderWordText`, `renderBodyFormatBar`, `renderBody`, `slide.hotspots.map((hotspot, index) => renderHotspotRow(hotspot, index)).join`, `slide.hotspots.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderPopupResizeHandles — line 8494

Builds popup resize handles markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8494) · Owner: callback:5348

- Calls: `["nw", "n", "ne", "e", "se", "s", "sw", "w"]         .map((handle) => ′<span class="popup-resize-handle" data-popup-resize-handle data-handle="${handle}" data-id="${escapeHtml(hotspot.id)}" title="Resize hotspot text box" aria-hidden="true"></span>′)         .join`, `["nw", "n", "ne", "e", "se", "s", "sw", "w"]         .map`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderHotspotRow — line 8500

Builds hotspot row markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8500) · Owner: callback:5348

- Calls: `hotspotStyle`, `escapeHtml`, `icon`, `currentSlide`, `renderHotspotDetail`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderHotspotDetail — line 8516

Builds hotspot detail markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8516) · Owner: callback:5348

- Calls: `renderBody`, `renderBodyFormatBar`, `bodyHasPipeLines`, `bodyHasNumberedLines`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderStage — line 8538

Builds stage markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8538) · Owner: callback:5348

- Calls: `topLevelAnnotations(slide).slice().sort((a,b) => a.z - b.z).filter(isVisibleForActiveHotspot).map(renderAnnotation).join`, `topLevelAnnotations(slide).slice().sort((a,b) => a.z - b.z).filter(isVisibleForActiveHotspot).map`, `topLevelAnnotations(slide).slice().sort((a,b) => a.z - b.z).filter`, `topLevelAnnotations(slide).slice().sort`, `topLevelAnnotations(slide).slice`, `topLevelAnnotations`, `slide.hotspots.map((hotspot, index) => isHotspotVisibleForActiveState(hotspot, slide) ? renderHotspot(hotspot, index) : "").join`, `slide.hotspots.map`, `escapeHtml`, `renderScrollMainMedia`, `renderMainMedia`, `renderSlideNarrationControl`, `renderDemoVideoSoundGate`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderDeviceFrame — line 8562

Builds device frame markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8562) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## renderBrowserHeader — line 8566

Builds browser header markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8566) · Owner: callback:5348

- Calls: `String`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderSlideNarrationControl — line 8581

Builds slide narration control markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8581) · Owner: callback:5348

- Calls: `String(slide.demo?.audioUrl \|\| "").trim`, `String`, `Boolean`, `mediaDisplayFilename`, `escapeHtml`, `icon`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderMainMediaControls — line 8611

Builds main media controls markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8611) · Owner: callback:5348

- Calls: `escapeHtml`, `icon`
- Assigns: No direct assignment expressions; see calls and initializers.

## isHotspotVisibleForActiveState — line 8627

Determines marker visibility from intro/scroll mode, active hotspot and lock persistence.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8627) · Owner: callback:5348

- Calls: `currentSlide`, `isSlideIntroState`, `slide.hotspots.some`, `slide.hotspots.findIndex`
- Assigns: No direct assignment expressions; see calls and initializers.

## isVisibleForActiveHotspot — line 8640

Determines annotation visibility from intro state, video slide, active hotspot association and lock persistence.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8640) · Owner: callback:5348

- Calls: `isSlideIntroState`, `currentSlide`, `slide.hotspots.findIndex`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderMainMedia — line 8652

Builds main media markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8652) · Owner: callback:5348

- Calls: `Math.abs`, `icon`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderScrollMainMedia — line 8684

Builds scroll main media markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8684) · Owner: callback:5348

- Calls: `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderHotspot — line 8699

Builds hotspot markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8699) · Owner: callback:5348

- Calls: `isObjectSelected`, `Boolean`, `hotspotStyle`, `escapeHtml`, `objectStyle`, `renderHandles`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderAnnotation — line 8716

Builds annotation markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8716) · Owner: callback:5348

- Calls: `isObjectSelected`, `Boolean`, `isCroppableAnnotation`, `isShadowableAnnotation`, `clipFrameForMember`, `["video","link"].includes`, `["shape","image","gif"].includes`, `renderAnnotationAssetImage`, `escapeHtml`, `renderWordText`, `renderBodyFormatBar`, `bodyHasPipeLines`, `bodyHasNumberedLines`, `renderBody`, `markupSvg`, `Number(annotation.magnification \|\| 2).toFixed(2).replace(/0+$/, "").replace`, `Number(annotation.magnification \|\| 2).toFixed(2).replace`, `Number(annotation.magnification \|\| 2).toFixed`, `Number`, `clipFrameMembers(annotation)           .slice()           .sort((a, b) => a.z - b.z)           .filter(isVisibleForActiveHotspot)           .map(renderAnnotation)           .join`, `clipFrameMembers(annotation)           .slice()           .sort((a, b) => a.z - b.z)           .filter(isVisibleForActiveHotspot)           .map`, `clipFrameMembers(annotation)           .slice()           .sort((a, b) => a.z - b.z)           .filter`, `clipFrameMembers(annotation)           .slice()           .sort`, `clipFrameMembers(annotation)           .slice`, `clipFrameMembers`, `clipFrameSceneStyle`, `Number.isFinite`, `clamp`, `formatVideoTime`, `objectStyle`, `renderHandles`
- Assigns: `content`

## markupCornerRadii — line 8816

Returns { rx: Math.round(radius * shorterSide / renderedWidth * 1000) / 1000, ry: Math.round(radius * shorterSide / renderedHeight * 1000) / 1000 }.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8816) · Owner: callback:5348

- Calls: `clamp`, `Math.max`, `Number`, `Math.min`, `Math.round`
- Assigns: No direct assignment expressions; see calls and initializers.

## applyLiveMarkupCornerRadii — line 8827

Updates selected square SVG rectangle radii without rebuilding full view.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8827) · Owner: callback:5348

- Calls: `normalizeMarkupKind(annotation.markup).startsWith`, `normalizeMarkupKind`, `markupCornerRadii`, `element.querySelectorAll('[data-markup-square="true"]').forEach`, `element.querySelectorAll`
- Assigns: No direct assignment expressions; see calls and initializers.

## markupSvg — line 8836

Returns ′<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path data-markup-primary="true" d="${path}" fill="none" stroke="var(--markup-color, #000000)" stroke-linecap="round"${dash}/></svg>′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8836) · Owner: callback:5348

- Calls: `normalizeMarkupKind`, `kind.endsWith`, `markupCornerRadii`, `kind.startsWith`, `markupPath`, `uid`, `escapeHtml`, `JSON.stringify`, `normalizeMarkupPoints`
- Assigns: No direct assignment expressions; see calls and initializers.

## updateArrowGeometry — line 8863

Converts arrow control points to rendered pixels to avoid stretched arrowheads.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8863) · Owner: callback:5348

- Calls: `JSON.parse`, `svg.setAttribute`, `svg.querySelector('[data-markup-primary="true"]').setAttribute`, `svg.querySelector`, `xy`
- Assigns: No direct assignment expressions; see calls and initializers.

## observeArrowGeometry — line 8874

Observes arrow SVG resizing and updates geometry.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8874) · Owner: callback:5348

- Calls: `observer.disconnect`, `root.querySelectorAll("svg[data-arrow-points]").forEach`, `root.querySelectorAll`
- Assigns: `observeArrowGeometry.observer`

## markupPath — line 8888

Returns ′M ${points.start.x} ${points.start.y} Q ${points.curve.x} ${points.curve.y} ${points.end.x} ${points.end.y}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8888) · Owner: callback:5348

- Calls: `normalizeMarkupPoints`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncSelectionControls — line 8893

Fits selection-handle bounds to rendered text or contained artwork without rewriting saved artwork size.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8893) · Owner: callback:5348

- Calls: `root.querySelectorAll("[data-object].is-selected").forEach`, `root.querySelectorAll`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderHandles — line 8950

Builds handles markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8950) · Owner: callback:5348

- Calls: `resizeHandles.map((handle) => ′<span class="resize-handle" data-handle="${handle}" aria-hidden="true"></span>′).join`, `resizeHandles.map`, `isPathMarkup`, `normalizeMarkupPoints`, `["shape", "text", "slide-intro", "callout"].includes`, `isRotatableMarkup`, `escapeHtml`, `Boolean`, `icon`
- Assigns: No direct assignment expressions; see calls and initializers.

## atBeginning — line 8974

Returns !slide.hotspots.length \|\| !state.ui.activeHotspotId \|\| slide.hotspots[0]?.id === state.ui.activeHotspotId.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8974) · Owner: callback:5348

- Calls: `currentSlide`
- Assigns: No direct assignment expressions; see calls and initializers.

## atEnd — line 8980

Returns !slide.hotspots.length \|\| lastHotspot?.id === state.ui.activeHotspotId.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8980) · Owner: callback:5348

- Calls: `currentSlide`
- Assigns: No direct assignment expressions; see calls and initializers.

## readerBackLabel — line 8987

Returns "Back".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8987) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## readerNextLabel — line 8991

Returns "Next".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8991) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## renderReaderNav — line 8995

Builds reader nav markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:8995) · Owner: callback:5348

- Calls: `atBeginning`, `readerBackLabel`, `icon`, `atEnd`, `readerNextLabel`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderDemoPlaybackControls — line 9005

Builds demo playback controls markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9005) · Owner: callback:5348

- Calls: `slideHasMainVideo`, `currentSlide`, `icon`, `demoOverallProgress`, `escapeHtml`, `demoProgressText`
- Assigns: No direct assignment expressions; see calls and initializers.

## mediaFolderSlug — line 9020

Returns slugify(state.meta.mediaFolder \|\| state.meta.tutorialSlug \|\| "").

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9020) · Owner: callback:5348

- Calls: `slugify`
- Assigns: No direct assignment expressions; see calls and initializers.

## mediaDropStatusText — line 9024

Returns "First connect the main mh_media folder. Then choose the image, video, or audio file you want to use.".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9024) · Owner: callback:5348

- Calls: `mediaFolderSlug`, `["copying", "copied", "linked", "error", "remembered"].includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderMediaDropZone — line 9031

Builds media drop zone markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9031) · Owner: callback:5348

- Calls: `Boolean`, `escapeHtml`, `mediaDropStatusText`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderMetadata — line 9054

Builds metadata markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9054) · Owner: callback:5348

- Calls: `metaSelect`, `metaInput`, `escapeHtml`, `publicUrl`, `metaArea`, `metaCheckbox`
- Assigns: No direct assignment expressions; see calls and initializers.

## metaInput — line 9101

Returns ′<label>${escapeHtml(label)}<input data-meta="${key}" type="${type}" value="${escapeHtml(value ?? "")}" placeholder="${escapeHtml(placeholder)}" ${readonly ? "readonly" : ""}></label>′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9101) · Owner: callback:5348

- Calls: `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## metaArea — line 9105

Returns ′<label>${escapeHtml(label)}<textarea data-meta="${key}">${escapeHtml(value ?? "")}</textarea></label>′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9105) · Owner: callback:5348

- Calls: `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## metaSelect — line 9109

Returns ′<label>${escapeHtml(label)}<select data-meta="${key}">${options.map(([optionValue, optionLabel]) => ′<option value="${escapeHtml(optionValue)}" ${optionValue === value ? "selected" : ""}>${escapeHtml(optionLabel)}</option>′).join("")}</sel… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9109) · Owner: callback:5348

- Calls: `escapeHtml`, `options.map(([optionValue, optionLabel]) => ′<option value="${escapeHtml(optionValue)}" ${optionValue === value ? "selected" : ""}>${escapeHtml(optionLabel)}</option>′).join`, `options.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## metaCheckbox — line 9113

Returns ′<label class="metadata-checkbox"><input data-meta="${key}" type="checkbox" ${checked ? "checked" : ""}><span>${escapeHtml(label)}</span></label>′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9113) · Owner: callback:5348

- Calls: `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderContentsPreviewMedia — line 9117

Builds contents preview media markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9117) · Owner: callback:5348

- Calls: `String(media.url \|\| "").trim`, `String`, `Number`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderContentsPreviewAnnotation — line 9129

Builds contents preview annotation markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9129) · Owner: callback:5348

- Calls: `currentSlide`, `objectStyle`, `["shape", "image", "gif"].includes`, `resolveAnnotationAssetSrc`, `isCroppableAnnotation`, `open`, `escapeHtml`, `clipFrameMembers(annotation, slide)           .slice()           .sort((a, b) => a.z - b.z)           .map((member) => renderContentsPreviewAnnotation(member, slide))           .join`, `clipFrameMembers(annotation, slide)           .slice()           .sort((a, b) => a.z - b.z)           .map`, `clipFrameMembers(annotation, slide)           .slice()           .sort`, `clipFrameMembers(annotation, slide)           .slice`, `clipFrameMembers`, `clipFrameSceneStyle`, `markupSvg`, `Math.max`, `Number`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderContentsPreviewHotspot — line 9175

Builds contents preview hotspot markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9175) · Owner: callback:5348

- Calls: `hotspotStyle`, `objectStyle`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderContentsSlidePreview — line 9180

Builds contents slide preview markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9180) · Owner: callback:5348

- Calls: `/^#[0-9a-f]{6}$/i.test`, `String`, `topLevelAnnotations(slide)         .slice()         .sort((a, b) => a.z - b.z)         .map((annotation) => renderContentsPreviewAnnotation(annotation, slide))         .join`, `topLevelAnnotations(slide)         .slice()         .sort((a, b) => a.z - b.z)         .map`, `topLevelAnnotations(slide)         .slice()         .sort`, `topLevelAnnotations(slide)         .slice`, `topLevelAnnotations`, `slide.hotspots.map(renderContentsPreviewHotspot).join`, `slide.hotspots.map`, `escapeHtml`, `renderContentsPreviewMedia`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderContentsModal — line 9191

Builds contents modal markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9191) · Owner: callback:5348

- Calls: `escapeHtml`, `icon`, `state.tutorial.slides.map((slide, index) => {                   const previewColor = /^#[0-9a-f]{6}$/i.test(String(slide.media?.matte \|\| "")) ? slide.media.matte : "#ffffff";                   const title = slide.kind === "cover" ? state.tutorial.title : slide.title;                   return ′                     <div class="contents-card-shell">                       <button type="button" class="contents-card ${index === state.ui.slideIndex ? "is-active" : ""}" data-action="jump-slide" data-index="${index}">                         <span class="contents-card-preview ${slide.kind === "video" ? "is-video" : ""}" style="--contents-preview-color:${escapeHtml(previewColor)}">                           ${renderContentsSlidePreview(slide)}                         </span>                         <span class="contents-card-copy">                           <span class="contents-number" style="${contentsNumberStyle(index + 1)}">${index + 1}</span>                           <span class="contents-card-title">${escapeHtml(title \|\| ′Page ${index + 1}′)}</span>                         </span>                       </button>                       ${MODE === "builder" && index > 0 ? ′                         <details class="contents-slide-actions">                           <summary aria-label="Manage page ${index + 1}" title="Manage page ${index + 1}">⋯</summary>                           <div class="contents-slide-actions-menu" role="menu" aria-label="Page ${index + 1} actions">                             <label class="contents-slide-name-field">Page Name<input data-contents-slide-name data-index="${index}" value="${escapeHtml(slide.title)}" aria-label="Page ${index + 1} name"></label>                             <button type="button" role="menuitem" data-action="contents-save-slide-name" data-index="${index}">Save Name</button>                             <button type="button" role="menuitem" data-action="contents-duplicate-slide" data-index="${index}">Duplicate Page</button>                             <button type="button" role="menuitem" data-action="contents-move-slide" data-index="${index}" data-direction="-1" ${index > 1 ? "" : "disabled"}>Move Earlier</button>                             <button type="button" role="menuitem" data-action="contents-move-slide" data-index="${index}" data-direction="1" ${index < state.tutorial.slides.length - 1 ? "" : "disabled"}>Move Later</button>                             <button type="button" role="menuitem" data-action="contents-delete-slide" data-index="${index}">Delete Page</button>                           </div>                         </details>                       ′ : ""}                     </div>                   ′;                 }).join`, `state.tutorial.slides.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderVideoModal — line 9238

Builds video modal markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9238) · Owner: callback:5348

- Calls: `state.tutorial.slides.flatMap((slide) => slide.annotations).find`, `state.tutorial.slides.flatMap`, `youtubeVideoInfo`, `escapeHtml`, `icon`
- Assigns: No direct assignment expressions; see calls and initializers.

## renderDemoPreviewModal — line 9270

Builds demo preview modal markup; callers determine when it is displayed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9270) · Owner: callback:5348

- Calls: `icon`, `escapeHtml`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncMainMediaImage — line 9291

Records loaded image dimensions, updates CSS sizing and scroll UI, schedules save.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9291) · Owner: callback:5348

- Calls: `Math.max`, `Math.round`, `image.setAttribute`, `String`, `image.closest`, `layer?.style.setProperty`, `state.tutorial.slides.find`, `image.classList.contains`, `requestAnimationFrame`, `scheduleSave`
- Assigns: `slide.media.naturalWidth`, `slide.media.naturalHeight`

## syncScrollSlideUi — line 9311

Shows/hides scroll-down cue and updates visible hotspot selection.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9311) · Owner: callback:5348

- Calls: `root.querySelector`, `Math.max`, `viewport.closest("[data-stage]")?.querySelector`, `viewport.closest`, `caret.setAttribute`, `String`, `syncScrollHotspotInView`
- Assigns: `caret.hidden`

## syncScrollHotspotInView — line 9323

Chooses sufficiently visible marker near viewport target point and updates active/expanded hotspot/sidebar.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9323) · Owner: callback:5348

- Calls: `currentSlide`, `viewport.getBoundingClientRect`, `viewport.closest("[data-stage]")?.querySelector("[data-fixed-browser-header]")?.getBoundingClientRect`, `viewport.closest("[data-stage]")?.querySelector`, `viewport.closest`, `Math.max`, `Math.min`, `[...viewport.querySelectorAll(".hotspot-object[data-id]")]         .map((marker) => {           const bounds = marker.getBoundingClientRect();           const visiblePixels = Math.max(0, Math.min(bounds.bottom, visibleBottom) - Math.max(bounds.top, visibleTop));           const visibleRatio = visiblePixels / Math.max(1, bounds.height);           return { marker, bounds, visibleRatio, distance: Math.abs((bounds.top + bounds.bottom) / 2 - targetY) };         })         .filter((entry) => entry.visibleRatio >= .35)         .sort`, `[...viewport.querySelectorAll(".hotspot-object[data-id]")]         .map((marker) => {           const bounds = marker.getBoundingClientRect();           const visiblePixels = Math.max(0, Math.min(bounds.bottom, visibleBottom) - Math.max(bounds.top, visibleTop));           const visibleRatio = visiblePixels / Math.max(1, bounds.height);           return { marker, bounds, visibleRatio, distance: Math.abs((bounds.top + bounds.bottom) / 2 - targetY) };         })         .filter`, `[...viewport.querySelectorAll(".hotspot-object[data-id]")]         .map`, `viewport.querySelectorAll`, `scrollExpandedHotspots.get`, `scrollExpandedHotspots.set`, `scrollExpandedHotspots.delete`, `viewport.querySelectorAll(".hotspot-object[data-id]").forEach`, `root.querySelector`, `renderSidebar`
- Assigns: `state.ui.activeHotspotId`, `sidebar.outerHTML`

## restoreScrollSlidePosition — line 9360

Restores remembered scroll offset for current slide.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9360) · Owner: callback:5348

- Calls: `currentSlide`, `root.querySelector`, `CSS.escape`, `Number`, `scrollSlidePositions.get`, `requestAnimationFrame`
- Assigns: `viewport.scrollTop`

## onScrollSlide — line 9369

Records scrolling and updates viewport/hotspot UI.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9369) · Owner: callback:5348

- Calls: `event.target?.closest`, `Math.max`, `scrollSlidePositions.set`, `syncScrollSlideUi`
- Assigns: No direct assignment expressions; see calls and initializers.

## scrollPageDown — line 9377

Scrolls the associated viewport downward via its page cue.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9377) · Owner: callback:5348

- Calls: `button?.closest("[data-stage]")?.querySelector`, `button?.closest`, `viewport.scrollBy`, `Math.max`, `window.matchMedia`
- Assigns: No direct assignment expressions; see calls and initializers.

## waitForPlayerMedia — line 9386

Returns new Promise((resolve) => { let settled = false; const loadEvent = isVideo ? "loadeddata" : "load"; const finish = () => { if (settled) return; settled = true; window.clearTimeout(timeout); media.removeEventListener(loadEvent, handleLoad); m… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9386) · Owner: callback:5348

- Calls: `Promise.resolve`, `media.matches`, `media.decode().catch`, `media.decode`
- Assigns: No direct assignment expressions; see calls and initializers.

## playerSlideVisualUrls — line 9417

Returns urls.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9417) · Owner: callback:5348

- Calls: `add`, `slide.annotations.forEach`, `slide.hotspots.forEach`
- Assigns: No direct assignment expressions; see calls and initializers.

## preloadNextPlayerMedia — line 9438

Requests upcoming player slide media to reduce transition delay.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9438) · Owner: callback:5348

- Calls: `String(nextSlide.media?.url \|\| "").trim`, `String`, `document.createElement`, `video.load`, `preloaders.push`, `playerSlideVisualUrls(nextSlide).forEach`, `playerSlideVisualUrls`
- Assigns: `playerPreloadedMedia`, `video.preload`, `video.muted`, `video.src`

## preparePlayerSlideVisuals — line 9468

Returns Promise.all(media.map(waitForPlayerMedia)).then(() => { if (!body.isConnected \|\| currentSlide()?.id !== slideId) return; body.classList.remove("is-slide-media-pending"); body.classList.add("is-slide-media-ready"); playerVisualReadySlideId… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9468) · Owner: callback:5348

- Calls: `currentSlide`, `Promise.resolve`, `root.querySelector`, `body.classList.remove`, `body.classList.add`, `Array.from`, `body.querySelectorAll`, `Promise.all(media.map(waitForPlayerMedia)).then`, `Promise.all`, `media.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncMagnifierScenes — line 9490

Clones lower-layer scene into lens, excluding other lenses and interaction controls.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9490) · Owner: callback:5348

- Calls: `root.querySelectorAll("[data-magnifier-lens]").forEach`, `root.querySelectorAll`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncRuntimeMedia — line 9521

Source feedback: “This video URL could not be played. Use a direct video file or a YouTube watch, share, or Shorts URL.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9521) · Owner: callback:5348

- Calls: `root.querySelector`, `syncImage`, `mainImage.addEventListener`, `preparePlayerSlideVisuals`, `syncMainVideo`, `syncMagnifierScenes`, `restoreScrollSlidePosition`, `state.tutorial.slides.flatMap((slide) => slide.annotations).find`, `state.tutorial.slides.flatMap`, `youtubeVideoInfo`, `setVideoModalAspect`, `document.getElementById`, `video.addEventListener`, `updateAspect`, `updateDirectVideoControls`, `video.play().catch`, `video.play`
- Assigns: `playerVisualReadyPromise`

## syncMainVideo — line 9557

Attaches main-video media events and coordinates playback state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9557) · Owner: callback:5348

- Calls: `root.querySelector`, `video.addEventListener`, `syncDimensions`, `video.play().catch`, `video.play`, `video.pause`, `update`
- Assigns: `video.loop`, `video.muted`

## syncMainVideoDimensions — line 9600

Records main video's intrinsic dimensions for layout.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9600) · Owner: callback:5348

- Calls: `Math.max`, `Math.round`, `video.setAttribute`, `String`, `video.closest(".main-video-frame")?.style.setProperty`, `video.closest`, `currentSlide`, `scheduleSave`
- Assigns: `slide.media.naturalWidth`, `slide.media.naturalHeight`

## updateMainVideoControls — line 9616

Updates main-video timeline, elapsed/duration displays and playback controls.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9616) · Owner: callback:5348

- Calls: `root.querySelector`, `video.closest`, `frame?.querySelector`, `Number.isFinite`, `clamp`, `icon`, `button.setAttribute`, `String`, `timeline.setAttribute`, `formatVideoTime`, `updateDemoVideoControls`
- Assigns: `button.innerHTML`, `timeline.max`, `timeline.value`, `timeline.disabled`

## updateDemoVideoControls — line 9636

Updates demo-specific video progress and sound/play UI.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9636) · Owner: callback:5348

- Calls: `root.querySelector`, `controls?.querySelector`, `icon`, `toggle.setAttribute`, `String`, `timeline.setAttribute`, `formatVideoTime`, `sound.setAttribute`
- Assigns: `toggle.innerHTML`, `timeline.max`, `timeline.value`, `timeline.disabled`, `sound.innerHTML`, `gateLabel.textContent`

## youtubeVideoInfo — line 9664

Parses supported YouTube URL into embedding information.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9664) · Owner: callback:5348

- Calls: `String(value \|\| "").trim`, `String`, `url.hostname.toLowerCase().replace`, `url.hostname.toLowerCase`, `host.endsWith`, `url.pathname.split("/").filter`, `url.pathname.split`, `["embed", "live", "v"].includes`, `url.searchParams.get`, `/^[a-zA-Z0-9_-]{6,20}$/.test`
- Assigns: `id`

## setVideoModalAspect — line 9694

Stores video modal aspect information from dimensions.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9694) · Owner: callback:5348

- Calls: `document.querySelector`, `Number`, `String`, `media.style.setProperty`, `sizeActiveVideoModal`
- Assigns: `media.dataset.videoAspect`

## sizeActiveVideoModal — line 9703

Fits open modal video to available viewport.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9703) · Owner: callback:5348

- Calls: `document.querySelector`, `media?.closest`, `clamp`, `Number`, `media.querySelector`, `Math.max`, `Math.min`, `panel.style.setProperty`
- Assigns: No direct assignment expressions; see calls and initializers.

## updateDirectVideoControls — line 9714

Synchronizes popup direct-video timeline and control labels.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9714) · Owner: callback:5348

- Calls: `document.getElementById`, `document.querySelector`, `icon`, `button.setAttribute`, `Number.isFinite`, `String`, `Math.min`, `timeline.setAttribute`, `formatVideoTime`
- Assigns: `button.innerHTML`, `timeline.max`, `timeline.value`, `time.textContent`

## formatVideoTime — line 9733

Returns ′${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9733) · Owner: callback:5348

- Calls: `Number.isFinite`, `Math.max`, `Math.floor`, `String(safe % 60).padStart`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## parseShapeCsvRow — line 9738

Parses a CSV row, respecting quotes and comma boundaries.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9738) · Owner: callback:5348

- Calls: `cells.push`, `value.trim`
- Assigns: `index`, `value`, `quoted`

## loadShapes — line 9762

Fetches hosted CSV, parses grouped artwork catalog, retains built-in fallback on error.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9762) · Owner: callback:5348

- Calls: `fetch`, `(await response.text()).split(/\r?\n/).map((line) => {           const cells = parseShapeCsvRow(line);           const grouped = cells.length >= 3;           const group = (grouped ? cells[0] : "SHAPES").replace(/\u00a0/g, " ").trim();           const name = (grouped ? cells[1] : cells[0]).replace(/\u00a0/g, " ").trim();           const rawUrl = (grouped ? cells[2] : cells[1] \|\| "").trim();           if (!name \|\| !/^https?:\/\//i.test(rawUrl)) return null;           return { group: group \|\| "SHAPES", name, url: normalizeShapeAssetUrl(name, rawUrl) };         }).filter`, `(await response.text()).split(/\r?\n/).map`, `(await response.text()).split`, `response.text`, `render`, `showToast`
- Assigns: `shapes`

## loadDraftImages — line 9784

Reads local HTTP DRAFT directories and builds public image/GIF catalog entries.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9784) · Owner: callback:5348

- Calls: `/^https?:$/.test`, `Promise.all`, `DRAFT_FOLDERS.map`, `JSON.stringify`, `render`
- Assigns: `draftImagesLoading`, `draftImageGroups`, `draftImageSignature`

## bindGlobalEvents — line 9827

Registers root/document/window input, pointer, scroll, focus, selection, resize and lifecycle handlers.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9827) · Owner: callback:5348

- Calls: `root.addEventListener`, `window.addEventListener`, `document.addEventListener`
- Assigns: No direct assignment expressions; see calls and initializers.

## closeSiteNavigation — line 9865

Closes applicable site navigation dropdown/mobile state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9865) · Owner: callback:5348

- Calls: `root.querySelector`, `target.closest`, `dropdown.querySelector("[data-action='toggle-site-tools']")?.setAttribute`, `dropdown.querySelector`, `mobileToggle.setAttribute`
- Assigns: `dropdown.dataset.open`, `mobilePanel.hidden`

## toggleSiteTools — line 9880

Opens/closes site tools navigation dropdown.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9880) · Owner: callback:5348

- Calls: `button.closest`, `String`, `button.setAttribute`
- Assigns: `dropdown.dataset.open`

## toggleSiteMobile — line 9888

Opens/closes mobile site navigation.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9888) · Owner: callback:5348

- Calls: `root.querySelector`, `button.setAttribute`, `String`
- Assigns: `panel.hidden`

## showStoreComingSoon — line 9897

Temporarily changes store-link presentation to coming-soon feedback.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9897) · Owner: callback:5348

- Calls: `link.textContent.trim`, `window.clearTimeout`, `Number`, `link.classList.remove`, `link.classList.add`, `window.setTimeout`, `String`
- Assigns: `link.dataset.storeOriginalText`, `link.textContent`, `link.dataset.storeTeaserTimer`

## onClick — line 9913

Dispatches 133 named actions after handling word-highlight removal and editable/object clicks.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:9913) · Owner: callback:5348

- Calls: `event.target.closest`, `applyWordColor`, `closeSiteNavigation`, `event.preventDefault`, `event.stopPropagation`, `editable.closest`, `selectObject`, `binding.startsWith`, `activateHotspotForEditing`, `binding.split`, `drawAttentionToHotspot`, `activateAnnotationForEditing`, `currentSlide().annotations.find`, `currentSlide`, `openVideo`, `actions[action]`
- Assigns: `suppressObjectClickId`

## activateHotspotForEditing — line 10112

Selects hotspot while refreshing stage/detail/toolbar and preserving editing workflow.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10112) · Owner: callback:5348

- Calls: `currentSlide().hotspots.find`, `currentSlide`, `scrollExpandedHotspots.set`, `stopAudio`, `selectionKey`, `root.querySelector`, `renderStage`, `renderReaderNav`, `renderToolbar`, `syncSelectedObjectUi`, `root.querySelectorAll(".hotspot-row").forEach`, `root.querySelectorAll`, `root.querySelectorAll(".hotspot-entry").forEach`, `root.querySelectorAll(".hotspot-detail-panel").forEach`, `root.querySelector(′.hotspot-entry[data-id="${CSS.escape(id)}"]′)?.insertAdjacentHTML`, `CSS.escape`, `renderHotspotDetail`, `syncRuntimeMedia`, `drawAttentionToHotspot`, `scheduleSave`
- Assigns: `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`, `stageWrap.outerHTML`, `readerNav.outerHTML`, `toolbar.outerHTML`

## selectHotspotFromAction — line 10142

Routes hotspot click to selection or playback activation according to mode and Shift key.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10142) · Owner: callback:5348

- Calls: `actionNode.closest`, `selectObject`, `drawAttentionToHotspot`, `activateHotspot`
- Assigns: No direct assignment expressions; see calls and initializers.

## mixedBodyCaret — line 10153

Finds current mixed-body line and caret offset.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10153) · Owner: callback:5348

- Calls: `window.getSelection`, `editor.contains`, `anchorElement.closest`, `clamp`, `Math.max`, `editor.children[lineIndex]?.closest`, `editor.querySelector`, `line.contains`, `document.createRange`, `beforeCaret.selectNodeContents`, `beforeCaret.setEnd`, `beforeCaret.toString`
- Assigns: `line`, `offset`

## selectedMixedBodyLines — line 10180

Returns [lines[0]].

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10180) · Owner: callback:5348

- Calls: `Array.from`, `editor?.querySelectorAll`, `window.getSelection`, `selection.getRangeAt`, `editor.contains`, `mixedBodyCaret`, `lines.filter`, `lastMixedBodySelection.lines.every`
- Assigns: No direct assignment expressions; see calls and initializers.

## lineListKind — line 10205

Returns line?.dataset.pipe === "true" ? "pipe" : "plain".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10205) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## setLineListKind — line 10210

Updates line's pipe/numbered/plain attributes and classes.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10210) · Owner: callback:5348

- Calls: `String`, `line.classList.toggle`
- Assigns: `line.dataset.listKind`, `line.dataset.pipe`

## updateBodyListToggleState — line 10218

Reflects selected lines' list styles in formatting buttons.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10218) · Owner: callback:5348

- Calls: `selectedMixedBodyLines`, `editor.closest`, `container?.querySelectorAll(".body-list-toggle").forEach`, `container?.querySelectorAll`
- Assigns: No direct assignment expressions; see calls and initializers.

## rememberMixedBodySelection — line 10228

Remembers current editor/selected lines for toolbar list actions.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10228) · Owner: callback:5348

- Calls: `window.getSelection`, `anchorElement?.closest`, `selectedMixedBodyLines`, `mixedBodyCaret`, `updateBodyListToggleState`
- Assigns: `lastMixedBodySelection`

## toggleMixedBodyListLines — line 10248

Toggles requested list style on selected/current lines and restores editing selection.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10248) · Owner: callback:5348

- Calls: `selectedMixedBodyLines`, `lines.includes`, `lines.every`, `lines.forEach`, `updateBodyListToggleState`, `editor.dispatchEvent`, `editor.focus`, `placeCaretInMixedBodyLine`, `button.classList.toggle`, `button.setAttribute`, `String`, `commit`
- Assigns: `lastMixedBodySelection`

## toggleSlidePipeList — line 10273

Applies pipe-list toggle to slide description editor.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10273) · Owner: callback:5348

- Calls: `currentSlide`, `button?.closest(".body-field")?.querySelector`, `button?.closest`, `toggleMixedBodyListLines`
- Assigns: `slide.descriptionListStyle`

## toggleSlideNumberedList — line 10280

Applies numbered-list toggle to slide description editor.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10280) · Owner: callback:5348

- Calls: `currentSlide`, `button?.closest(".body-field")?.querySelector`, `button?.closest`, `toggleMixedBodyListLines`
- Assigns: `slide.descriptionListStyle`

## toggleHotspotPipeList — line 10287

Applies pipe-list toggle to hotspot body editor.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10287) · Owner: callback:5348

- Calls: `currentSlide().hotspots.find`, `currentSlide`, `stopAudio`, `button?.closest(".hotspot-detail-panel")?.querySelector`, `button?.closest`, `toggleMixedBodyListLines`
- Assigns: `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `hotspot.bodyListStyle`

## toggleHotspotNumberedList — line 10298

Applies numbered-list toggle to hotspot body editor.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10298) · Owner: callback:5348

- Calls: `currentSlide().hotspots.find`, `currentSlide`, `stopAudio`, `button?.closest(".hotspot-detail-panel")?.querySelector`, `button?.closest`, `toggleMixedBodyListLines`
- Assigns: `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `hotspot.bodyListStyle`

## toggleIntroBodyList — line 10309

Applies specified list kind to intro body editor.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10309) · Owner: callback:5348

- Calls: `slideIntroCard`, `button?.closest(".slide-intro-card__body-field")?.querySelector`, `button?.closest`, `toggleMixedBodyListLines`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`, `intro.introBodyListStyle`

## toggleCalloutBodyList — line 10318

Applies specified list kind to callout body editor.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10318) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `selectionKey`, `button?.closest(".standalone-callout-card__body-field")?.querySelector`, `button?.closest`, `toggleMixedBodyListLines`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`, `callout.calloutBodyListStyle`

## activateAnnotationForEditing — line 10328

Makes edited annotation the selected target.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10328) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `syncSelectedObjectUi`, `root.querySelector`, `renderToolbar`, `scheduleSave`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`, `toolbar.outerHTML`

## syncSelectedObjectUi — line 10339

Refreshes selection styling and relevant selection UI after editing activation.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10339) · Owner: callback:5348

- Calls: `selectionKey`, `root.querySelectorAll("[data-object].is-selected").forEach`, `root.querySelectorAll`, `root.querySelectorAll('[data-object][data-kind="hotspot"]').forEach`, `root.querySelector`, `CSS.escape`, `selected.classList.add`, `selected.insertAdjacentHTML`, `renderHandles`, `requestAnimationFrame`
- Assigns: `multiSelection`

## onChange — line 10355

Commits field changes, selectors, metadata, shape insertion and color changes.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10355) · Owner: callback:5348

- Calls: `target.matches`, `applyWordColor`, `["browserUrl", "gptName"].includes`, `currentSlide`, `target.value.trim`, `commit`, `target.value.toUpperCase`, `openProject`, `markTouched`, `commitDemoSeek`, `["default", "manual", "audio"].includes`, `clamp`, `Number`, `String(target.value \|\| "").trim`, `String`, `syncDemoAudioTiming`, `recordUndoStep`, `scheduleSave`, `setInsertedImageCornerRadius`, `setSelectedMagnifierShape`, `shapes.find`, `addImageAnnotation`, `addMarkup`, `selectedObject`, `normalizeMarkupKind(selected.markup).startsWith`, `normalizeMarkupKind`, `selectedTextAnnotation`, `normalizeMainMediaInput`, `mediaBase`, `detectMediaType`, `refreshMainMediaLayer`, `publicUrl`, `syncMediaUrlSeeds`
- Assigns: `currentSlide()[key]`, `target.value`, `state.tutorial.title`, `toolbarAnnotationDraft`, `state.meta.mediaFolder`, `mediaDropState`, `currentSlide().demo.timing`, `state.meta.demoDefaultDuration`, `currentSlide().demo.duration`, `currentSlide().demo.manualDuration`, `currentSlide().scrollViewportWidth`, `currentSlide().scrollHeaderHeight`, `currentSlide().demo.audioUrl`, `selected.opacity`, `selected.markupCornerRadius`, `selected.strokeWidth`, `selected.textLetterSpacing`, `selected.textLineHeight`, `markupColorDefault`, `selected.markupColor`, `markupFillColorDefault`, `selected.fillColor`, `selected.textColor`, `currentSlide().media.matte`, `selected.blurStrength`, `currentSlide().media.url`, `currentSlide().media.type`, `currentSlide().title`, `state.meta[key]`, `state.meta.publicUrl`

## onInput — line 10569

Handles live text/rich formatting, color, slider, metadata, timing and media timeline changes.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10569) · Owner: callback:5348

- Calls: `event.target.matches`, `event.target.closest`, `queueMicrotask`, `requestAnimationFrame`, `selectedObject`, `clamp`, `Number`, `root.querySelector(′[data-object][data-id="${CSS.escape(item.id)}"]′)?.style.setProperty`, `root.querySelector`, `CSS.escape`, `Math.max`, `String`, `scheduleSave`, `applySelectedObjectColor`, `selectedCornerAnnotation`, `applyLiveMarkupCornerRadii`, `root.querySelector(′[data-object][data-id="${CSS.escape(image.id)}"]′)?.style.setProperty`, `preset.querySelectorAll("[data-custom-radius]").forEach`, `preset.querySelectorAll`, `[0, 3, 10, 50].includes`, `document.createElement`, `preset.append`, `target.matches`, `["browserUrl", "gptName"].includes`, `currentSlide`, `target.value.toUpperCase`, `mediaBase`, `markTouched`, `syncMediaUrlSeeds`, `updateMediaDropZone`, `previewDemoSeek`, `String(target.value \|\| "").trim`, `syncDemoAudioTiming`, `stage?.style.setProperty`, `stage?.querySelector(".scroll-slide-sticky-header")?.setAttribute`, `stage?.querySelector`, `target.value.trim`, `normalizeMainMediaInput`, `detectMediaType`, `window.clearTimeout`, `window.setTimeout`, `Number.isFinite`, `updateMainVideoControls`, `document.getElementById`, `updateDirectVideoControls`, `updateAudioTimeline`, `element?.style.setProperty`, `normalizeMarkupKind(selected.markup).startsWith`, `normalizeMarkupKind`, `selectedTextAnnotation`, `root.querySelector("[data-stage]")?.style.setProperty`, `publicUrl`, `target.closest`, `editable.classList.contains`, `() => {           let numberedIndex = 0;           return Array.from(editable.querySelectorAll(":scope > .mixed-body-line"))           .map((line) => {             const text = line.innerText.replace(/\r/g, "").replace(/\n+$/, "");             const kind = lineListKind(line);             if (kind === "numbered") return ′${++numberedIndex}. ${text}′;             numberedIndex = 0;             return kind === "pipe" ? ′\| ${text}′ : text;           })           .join("\n");         }`, `editable.innerText.replace`, `value.toUpperCase`, `applySmartDefaults`, `binding.startsWith`, `currentSlide().hotspots.find`, `currentSlide().annotations.find`, `scheduleTextCardAutoFit`
- Assigns: `item.shadowHeight`, `item.imageShadow`, `root.querySelector("#shadowHeightValue").textContent`, `image.markupCornerRadius`, `image.cornerRadius`, `output.textContent`, `option.value`, `option.textContent`, `option.dataset.customRadius`, `preset.value`, `currentSlide()[key]`, `target.value`, `state.tutorial.title`, `toolbarAnnotationDraft`, `state.meta.mediaFolder`, `mediaDropState`, `state.meta.demoDefaultDuration`, `currentSlide().demo.duration`, `currentSlide().demo.manualDuration`, `currentSlide().scrollViewportWidth`, `currentSlide().scrollHeaderHeight`, `currentSlide().demo.audioUrl`, `currentSlide().media.url`, `currentSlide().media.type`, `mainMediaPreviewTimer`, `currentSlide().title`, `video.currentTime`, `audio.currentTime`, `selected.opacity`, `selected.markupCornerRadius`, `selected.strokeWidth`, `selected.textLetterSpacing`, `selected.textLineHeight`, `markupColorDefault`, `selected.markupColor`, `markupFillColorDefault`, `selected.fillColor`, `selected.textColor`, `element.style.color`, `currentSlide().media.matte`, `selected.blurStrength`, `state.meta[key]`, `state.meta.publicUrl`, `publicUrlField.value`, `currentSlide().description`, `item.title`, `item.autoTitle`, `item.body`, `item.text`, `item.introTitle`, `item.introBody`, `item.calloutTitle`, `item.calloutBody`

## normalizeMainMediaInput — line 10930

Removes duplicated media-base prefix when a complete HTTP URL was appended to it.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10930) · Owner: callback:5348

- Calls: `target.value.trim`, `mediaBase`, `value.slice`, `value.startsWith`, `/^https?:\/\//i.test`
- Assigns: `value`, `target.value`

## onFocusIn — line 10941

Positions menus; selects empty main-media URL seed for replacement typing.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10941) · Owner: callback:5348

- Calls: `positionShapeNavigation`, `target.closest`, `currentSlide`, `mediaBase`, `target.select`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncLiveEditableBeforeRender — line 10949

Returns true.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10949) · Owner: callback:5348

- Calls: `target?.closest`, `root.contains`, `editable.dispatchEvent`
- Assigns: No direct assignment expressions; see calls and initializers.

## onFocusOut — line 10958

Source feedback: “”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10958) · Owner: callback:5348

- Calls: `syncLiveEditableBeforeRender`, `commit`
- Assigns: No direct assignment expressions; see calls and initializers.

## refreshMainMediaLayer — line 10965

Rebuilds current main-media layer, or full scroll stage, and rebinds runtime media.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10965) · Owner: callback:5348

- Calls: `currentSlide`, `root.querySelector`, `renderStage`, `syncRuntimeMedia`, `renderMainMedia`
- Assigns: `stageWrap.outerHTML`, `layer.outerHTML`

## selectObject — line 10978

Updates primary/multiple selection, expands object groups and activates selected hotspot.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:10978) · Owner: callback:5348

- Calls: `syncObjectSelection`, `selectionKey`, `selectionEntry`, `objectGroupEntriesForItem`, `groupedEntries.map`, `stopAudio`, `candidateKeys.every`, `multiSelection.filter`, `multiSelection.push`, `candidateKeys.filter`, `multiSelection.includes`, `render`
- Assigns: `imageCropEditId`, `multiSelection`, `state.ui.selectedKind`, `state.ui.selectedId`, `state.ui.activeHotspotId`

## onPointerDown — line 11006

Prepares selection, popup/object drag, crop and grouped/clip-member movement; checks locks.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11006) · Owner: callback:5348

- Calls: `event.target.closest`, `syncLiveEditableBeforeRender`, `event.preventDefault`, `rememberMixedBodySelection`, `popupResizeHandle.closest`, `popup?.closest`, `currentSlide().hotspots.find`, `currentSlide`, `body.getBoundingClientRect`, `popup.getBoundingClientRect`, `clamp`, `Math.max`, `popup.classList.remove`, `popup.classList.add`, `popup.style.setProperty`, `popupResizeHandle.setPointerCapture`, `popupHandle.closest`, `popupHandle.setPointerCapture`, `Boolean`, `isObjectSelected`, `slide.hotspots.find`, `slide.annotations.find`, `objectGroupEntriesForItem`, `selectionKey`, `clipFrameMembers(item, slide).map`, `clipFrameMembers`, `selectedObjects`, `new Map(dragCandidates.flatMap((entry) =>         entry.item.type === "clip-frame"           ? [entry, ...clipFrameMembers(entry.item, slide).map((member) => ({ key: selectionKey("annotation", member.id), kind: "annotation", id: member.id, item: member }))]           : [entry]).map((entry) => [entry.key, entry])).values`, `dragCandidates.flatMap((entry) =>         entry.item.type === "clip-frame"           ? [entry, ...clipFrameMembers(entry.item, slide).map((member) => ({ key: selectionKey("annotation", member.id), kind: "annotation", id: member.id, item: member }))]           : [entry]).map`, `dragCandidates.flatMap`, `selectionEntries.map`, `groupedEntries.map`, `stopAudio`, `objectElement.classList.add`, `objectElement.closest`, `stage.getBoundingClientRect`, `isCroppableAnnotation`, `objectElement.getBoundingClientRect`, `Math.atan2`, `dragGroupEntries             .filter(({ item: groupItem }) => !groupItem.locked)             .map`, `dragGroupEntries             .filter`, `objectElement.setPointerCapture`
- Assigns: `popupDrag`, `hotspot.popupX`, `hotspot.popupY`, `hotspot.popupW`, `hotspot.popupH`, `multiSelection`, `state.ui.selectedKind`, `state.ui.selectedId`, `state.ui.activeHotspotId`, `drag`

## onPointerMove — line 11153

Applies type-specific movement, crop, resizing, rotation and control-point updates.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11153) · Owner: callback:5348

- Calls: `requestAnimationFrame`, `currentSlide().hotspots.find`, `currentSlide`, `Math.max`, `handle.includes`, `clamp`, `popupDrag.popup.style.setProperty`, `scheduleSave`, `event.preventDefault`, `selectedObject`, `stageVerticalPositionMax`, `Math.hypot`, `Math.abs`, `drag.captureElement?.setPointerCapture`, `window.getSelection()?.removeAllRanges`, `window.getSelection`, `isCroppableAnnotation`, `root.querySelector`, `CSS.escape`, `objectStyle`, `["shape", "text", "slide-intro", "callout"].includes`, `isRotatableMarkup`, `Math.atan2`, `drag.handle.startsWith`, `isPathMarkup`, `drag.handle.replace`, `normalizeMarkupPoints`, `applyLiveMarkupShape`, `drag.groupOriginals.map`, `bounds.map`, `Math.min`, `drag.groupOriginals.forEach`, `applyLiveClipFrameScene`, `drag.handle.includes`, `["text", "slide-intro", "callout"].includes`, `fitStageObjectBounds`, `/^[nesw]+$/.test`, `hotspotSlotIndex`, `hotspotStyle`, `applyLiveMarkupCornerRadii`
- Assigns: `left`, `right`, `top`, `bottom`, `hotspot.popupX`, `hotspot.popupY`, `hotspot.popupW`, `hotspot.popupH`, `drag.moved`, `drag.captured`, `item.cropX`, `item.cropY`, `item.cropWindow.left`, `item.cropWindow.top`, `element.style.cssText`, `item.rotation`, `item.markupPoints`, `item.markupPoints[pointName]`, `item.x`, `item.y`, `item.w`, `item.h`, `item.manualTextFrame`, `item.cropWindow`

## applyLiveClipFrameScene — line 11321

Updates clipped scene's positioning CSS while frame changes.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11321) · Owner: callback:5348

- Calls: `root.querySelector`, `CSS.escape`, `frameElement?.querySelector`, `clipFrameSceneStyle`
- Assigns: `scene.style.cssText`

## applyLiveMarkupShape — line 11327

Updates line/arrow curve and point handles during editing.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11327) · Owner: callback:5348

- Calls: `isPathMarkup`, `element.querySelector('[data-markup-primary="true"]')?.setAttribute`, `element.querySelector`, `markupPath`, `JSON.stringify`, `normalizeMarkupPoints`, `updateArrowGeometry`
- Assigns: `arrowSvg.dataset.arrowPoints`, `node.style.left`, `node.style.top`

## onPointerUp — line 11344

Commits completed drag or opens previously selected video on click.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11344) · Owner: callback:5348

- Calls: `commit`, `currentSlide().annotations.find`, `currentSlide`, `openVideo`, `window.setTimeout`
- Assigns: `popupDrag`, `drag`, `suppressObjectClickId`

## onDoubleClick — line 11371

Opens selected annotation video or link through double-click behavior.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11371) · Owner: callback:5348

- Calls: `event.target.closest`, `currentSlide().annotations.find`, `currentSlide`, `openVideo`, `openLink`
- Assigns: No direct assignment expressions; see calls and initializers.

## placeCaretInMixedBodyLine — line 11379

Places caret at requested character offset in a mixed-body line.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11379) · Owner: callback:5348

- Calls: `window.getSelection`, `line.normalize`, `document.createTreeWalker`, `walker.nextNode`, `Math.max`, `document.createRange`, `range.setStart`, `clamp`, `range.collapse`, `selection.removeAllRanges`, `selection.addRange`
- Assigns: `remaining`, `textNode`

## insertMixedBodyLine — line 11402

Splits line at selection/caret, preserves list kind, exits empty list line and restores caret.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11402) · Owner: callback:5348

- Calls: `event.preventDefault`, `window.getSelection`, `selection.getRangeAt`, `rangeElement?.closest`, `editor.querySelector`, `document.createElement`, `editor.append`, `line.contains`, `range.deleteContents`, `line.innerText.replace(/\r/g, "").replace`, `line.innerText.replace`, `document.createRange`, `beforeCaret.selectNodeContents`, `beforeCaret.setEnd`, `beforeCaret.toString`, `lineListKind`, `setLineListKind`, `placeCaretInMixedBodyLine`, `editor.dispatchEvent`, `updateBodyListToggleState`, `line.removeAttribute`, `tail.selectNodeContents`, `tail.setStart`, `tail.collapse`, `nextLine.append`, `tail.extractContents`, `line.after`
- Assigns: `line`, `line.className`, `line.dataset.listKind`, `line.dataset.pipe`, `offset`, `nextLine.className`, `lastMixedBodySelection`

## onKeyDown — line 11458

Routes keyboard editing, undo/save, grouping/alignment, object clipboard and navigation; refuses hotspot keyboard deletion.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11458) · Owner: callback:5348

- Calls: `handleShapeNavigationKey`, `event.preventDefault`, `confirmProjectNameDialog`, `closeProjectNameDialog`, `addAnnotationFromUrl`, `resetToolbarAnnotationInput`, `event.target.closest`, `insertMixedBodyLine`, `event.key.toLowerCase`, `saveStateNow`, `showToast`, `undoLastChange`, `selectedTextAnnotation`, `["-", "_"].includes`, `["Minus", "NumpadSubtract"].includes`, `["=", "+"].includes`, `["Equal", "NumpadAdd"].includes`, `adjustSelectedAnnotationLetterSpacing`, `adjustSelectedAnnotationLineHeight`, `adjustSelectedAnnotationTextSize`, `["c", "v"].includes`, `["text", "markup"].includes`, `selectedObject`, `copySelectedFormatProperties`, `pasteSelectedFormatProperties`, `toggleSelectedObjectGroup`, `["l", "m", "p", "h", "c"].includes`, `arrangeSelected`, `duplicateSelectedItems`, `selectedObjects`, `copySelectedItemsToBuilderClipboard`, `pasteBuilderClipboard`, `["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes`, `selectedObjects().some`, `nudgeSelectedObjects`, `Boolean`, `event.target.closest?.('[contenteditable="true"]')?.closest`, `moveSelectedZ`, `deleteSelected`, `closeDemoPreview`, `closeVideo`, `render`, `closeContents`, `window.parent.postMessage`, `closeSiteNavigation`, `document.querySelector`, `Array.from(modal?.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') \|\| [])           .filter`, `Array.from`, `modal?.querySelectorAll`, `last.focus`, `first.focus`, `openVideo`, `activateHotspot`
- Assigns: `slideNarrationPanelSlideId`, `draftMoreOpen`

## addHotspot — line 11697

Source feedback: “Added hotspot.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11697) · Owner: callback:5348

- Calls: `currentSlide`, `normalizeHotspot`, `uid`, `hotspotStyle`, `scrollViewportOffsetUnits`, `fitStageObjectBounds`, `slide.hotspots.push`, `stopAudio`, `commit`
- Assigns: `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`

## renumberHotspots — line 11722

Reassigns slot colors and automatic HOTSPOT titles after list changes; preserves custom titles.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11722) · Owner: callback:5348

- Calls: `currentSlide`, `slide.hotspots.forEach`
- Assigns: No direct assignment expressions; see calls and initializers.

## activateHotspot — line 11729

Makes hotspot active, updates scroll expansion, redraws and draws attention.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11729) · Owner: callback:5348

- Calls: `currentSlide`, `scrollExpandedHotspots.set`, `stopAudio`, `render`, `drawAttentionToHotspot`, `scheduleSave`
- Assigns: `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`

## drawAttentionToHotspot — line 11743

Applies temporary marker attention and optionally scrolls associated UI into view.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11743) · Owner: callback:5348

- Calls: `window.clearTimeout`, `root.querySelectorAll(".hotspot-object.is-attention").forEach`, `root.querySelectorAll`, `CSS.escape`, `root.querySelector`, `revealScrollSlideObject`, `marker.classList.add`, `entry?.querySelector(".hotspot-row")?.scrollIntoView`, `entry?.querySelector`, `window.setTimeout`
- Assigns: `hotspotAttentionTimer`

## revealScrollSlideObject — line 11765

Scrolls offscreen marker into scrolling viewport, respecting reduced motion.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11765) · Owner: callback:5348

- Calls: `element?.closest`, `viewport.getBoundingClientRect`, `element.getBoundingClientRect`, `Math.min`, `viewport.scrollTo`, `Math.max`, `window.matchMedia`
- Assigns: No direct assignment expressions; see calls and initializers.

## moveHotspot — line 11782

Swaps title/body/autoTitle between neighboring numbered slots; keeps marker identity, geometry and group references fixed.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11782) · Owner: callback:5348

- Calls: `currentSlide`, `list.findIndex`, `stopAudio`, `renumberHotspots`, `commit`
- Assigns: `list[index].title`, `list[index].body`, `list[index].autoTitle`, `list[target].title`, `list[target].body`, `list[target].autoTitle`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`

## assignNewAnnotationToActiveHotspot — line 11810

Offsets placement for scroll viewport and associates new non-intro annotation with active hotspot.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11810) · Owner: callback:5348

- Calls: `currentSlide`, `scrollViewportOffsetUnits`, `fitStageObjectBounds`, `activeHotspot`
- Assigns: `annotation.y`, `annotation.hotspotGroupId`

## addText — line 11823

Source feedback: “Added text.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11823) · Owner: callback:5348

- Calls: `currentSlide`, `["impact-label", "impact-label-reversed"].includes`, `normalizeAnnotation`, `uid`, `document.getElementById`, `["hand", "impact-label", "impact-label-reversed"].includes`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `commit`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`

## addSlideIntro — line 11843

Source feedback: “Added slide intro card.”; “Opened slide intro card for editing.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11843) · Owner: callback:5348

- Calls: `currentSlide`, `slideIntroCard`, `stopAudio`, `normalizeAnnotation`, `uid`, `scrollViewportOffsetUnits`, `topZ`, `fitStageObjectBounds`, `slide.annotations.push`, `selectionKey`, `commit`, `scheduleSave`, `render`, `showToast`
- Assigns: `state.ui.activeHotspotId`, `annotation`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## toggleIntroBodyLeft — line 11875

Toggles independent body-left alignment while preserving title alignment.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11875) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `commit`
- Assigns: `intro.introBodyAlign`

## setSlideIntroAlign — line 11882

Sets intro alignment and clears body-only override; activates intro state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11882) · Owner: callback:5348

- Calls: `slideIntroCard`, `selectionKey`, `commit`
- Assigns: `intro.introAlign`, `intro.introBodyAlign`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## toggleSlideIntroTitleOnly — line 11894

Toggles intro body visibility without removing stored body text.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11894) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `selectionKey`, `commit`
- Assigns: `intro.introTitleOnly`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## addCallout — line 11905

Source feedback: “Added standalone callout.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11905) · Owner: callback:5348

- Calls: `currentSlide`, `normalizeAnnotation`, `uid`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `selectionKey`, `commit`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## setSelectedTextBoxAlign — line 11923

Source feedback: “Select an intro card or callout first.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11923) · Owner: callback:5348

- Calls: `selectedObject`, `setSlideIntroAlign`, `showToast`, `selectionKey`, `commit`
- Assigns: `annotation.calloutAlign`, `multiSelection`

## selectedTextAnnotation — line 11938

Returns annotation?.type === "text" ? annotation : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11938) · Owner: callback:5348

- Calls: `selectedObject`
- Assigns: No direct assignment expressions; see calls and initializers.

## selectedResizableTextAnnotation — line 11943

Returns ["text", "slide-intro", "callout"].includes(annotation?.type) ? annotation : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11943) · Owner: callback:5348

- Calls: `selectedObject`, `["text", "slide-intro", "callout"].includes`
- Assigns: No direct assignment expressions; see calls and initializers.

## copySelectedFormatProperties — line 11948

Source feedback: “Select text or a Circle, Line, Square, or Arrow annotation first.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11948) · Owner: callback:5348

- Calls: `selectedObject`, `["text", "markup"].includes`, `showToast`, `normalizeMarkupKind(source.markup).split("-").slice(1).join`, `normalizeMarkupKind(source.markup).split("-").slice`, `normalizeMarkupKind(source.markup).split`, `normalizeMarkupKind`
- Assigns: `formatPropertiesClipboard`

## pasteSelectedFormatProperties — line 11977

Returns true.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:11977) · Owner: callback:5348

- Calls: `showToast`, `selectedObjects()         .filter(({ kind, item }) => kind === "annotation" && item.type === formatPropertiesClipboard.type)         .map`, `selectedObjects()         .filter`, `selectedObjects`, `targets.forEach`, `commit`
- Assigns: No direct assignment expressions; see calls and initializers.

## setSelectedAnnotationTextAlign — line 12015

Sets selected text annotation left/center alignment.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12015) · Owner: callback:5348

- Calls: `selectedTextAnnotation`, `selectionKey`, `commit`
- Assigns: `annotation.textAlign`, `multiSelection`

## adjustSelectedAnnotationTextSize — line 12023

Adjusts selected text/intro/callout font size with bounds.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12023) · Owner: callback:5348

- Calls: `selectedResizableTextAnnotation`, `clamp`, `Number`, `selectionKey`, `commit`
- Assigns: `annotation.textFontSize`, `multiSelection`

## adjustSelectedAnnotationLineHeight — line 12038

Adjusts selected text annotation line height with bounds.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12038) · Owner: callback:5348

- Calls: `selectedTextAnnotation`, `clamp`, `Math.round`, `Number`, `selectionKey`, `commit`
- Assigns: `annotation.textLineHeight`, `multiSelection`

## adjustSelectedAnnotationLetterSpacing — line 12050

Adjusts selected text annotation character spacing with bounds.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12050) · Owner: callback:5348

- Calls: `selectedTextAnnotation`, `clamp`, `Math.round`, `Number`, `selectionKey`, `commit`
- Assigns: `annotation.textLetterSpacing`, `multiSelection`

## fitSelectedTextFrame — line 12062

Source feedback: “Select a text annotation, intro card, or callout first.”; “Fit the selected text frame to its content.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12062) · Owner: callback:5348

- Calls: `selectedObject`, `["text", "slide-intro", "callout"].includes`, `showToast`, `fitRenderedTextCardsToContent`, `selectionKey`, `commit`
- Assigns: `annotation.manualTextFrame`, `multiSelection`

## setHotspotTextAlign — line 12074

Source feedback: “Select a hotspot first.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12074) · Owner: callback:5348

- Calls: `selectedObject`, `activeHotspot`, `showToast`, `selectionKey`, `commit`
- Assigns: `hotspot.textAlign`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## selectedMarkupAnnotation — line 12088

Returns annotation?.type === "markup" ? annotation : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12088) · Owner: callback:5348

- Calls: `selectedObject`
- Assigns: No direct assignment expressions; see calls and initializers.

## adjustSelectedMarkupCornerRadius — line 12093

Adjusts square markup rounding or delegates image-style corner rounding.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12093) · Owner: callback:5348

- Calls: `selectedMarkupAnnotation`, `normalizeMarkupKind(annotation.markup).startsWith`, `normalizeMarkupKind`, `selectedInsertedImage`, `setInsertedImageCornerRadius`, `Number`, `clamp`, `Math.round`, `selectionKey`, `commit`
- Assigns: `annotation.markupCornerRadius`, `multiSelection`

## adjustSelectedMarkupWidth — line 12109

Changes primary markup stroke width 1–10; not magnifier thickness.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12109) · Owner: callback:5348

- Calls: `selectedMarkupAnnotation`, `clamp`, `Number`, `selectionKey`, `commit`
- Assigns: `annotation.strokeWidth`, `multiSelection`

## adjustSelectedMarkupTransparency — line 12117

Changes primary markup opacity through bounded transparency percentage.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12117) · Owner: callback:5348

- Calls: `selectedMarkupAnnotation`, `clamp`, `Math.round`, `Number`, `selectionKey`, `commit`
- Assigns: `annotation.opacity`, `multiSelection`

## addCoverAnnotation — line 12130

Source feedback: “Added cover area.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12130) · Owner: callback:5348

- Calls: `currentSlide`, `normalizeAnnotation`, `uid`, `document.getElementById`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `commit`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`

## applySlideBackground — line 12146

Source feedback: “Applied a full-slide background color.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12146) · Owner: callback:5348

- Calls: `document.getElementById`, `currentSlide`, `commit`
- Assigns: `currentSlide().media.matte`

## addBlurAnnotation — line 12152

Source feedback: “Added blur area.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12152) · Owner: callback:5348

- Calls: `currentSlide`, `normalizeAnnotation`, `uid`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `commit`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`

## adjustSelectedBlurStrength — line 12168

Changes selected blur and next-blur default; without selected blur changes default only.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12168) · Owner: callback:5348

- Calls: `selectedObject`, `clamp`, `Number`, `selectionKey`, `commit`, `showToast`
- Assigns: `annotation.blurStrength`, `blurStrengthDefault`, `multiSelection`

## selectedMagnifier — line 12181

Returns annotation?.type === "magnifier" ? annotation : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12181) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`
- Assigns: No direct assignment expressions; see calls and initializers.

## addMagnifierAnnotation — line 12187

Source feedback: “Added a magnifier annotation. Move and resize it over the area to enlarge.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12187) · Owner: callback:5348

- Calls: `currentSlide`, `normalizeAnnotation`, `uid`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `selectionKey`, `commit`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## adjustSelectedMagnifier — line 12208

Adjusts magnification between 1.25 and 4.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12208) · Owner: callback:5348

- Calls: `selectedMagnifier`, `clamp`, `Math.round`, `Number`, `commit`
- Assigns: `magnifier.magnification`

## setSelectedMagnifierShape — line 12219

Changes lens shape; circular choice also changes dimensions.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12219) · Owner: callback:5348

- Calls: `selectedMagnifier`, `["square", "rounded", "circle"].includes`, `clamp`, `commit`
- Assigns: `magnifier.magnifierShape`, `magnifier.w`, `magnifier.h`

## createOrSelectClipFrame — line 12230

Creates/selects clipping frame or adds members; writes clipFrameId and selection.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12230) · Owner: callback:5348

- Calls: `currentSlide`, `selectedObjects`, `selection.some`, `showToast`, `selection.filter`, `members.map(({ item }) => item.clipFrameId).filter`, `members.map`, `slide.annotations.find`, `members.filter`, `added.forEach`, `selectionKey`, `commit`, `render`, `clamp`, `Math.min`, `Math.max`, `normalizeAnnotation`, `uid`, `topZ`, `members.forEach`, `slide.annotations.push`
- Assigns: `frame`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## selectedClipFrame — line 12288

Returns state.ui.selectedKind === "annotation" && annotation?.type === "clip-frame" ? annotation : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12288) · Owner: callback:5348

- Calls: `selectedObject`
- Assigns: No direct assignment expressions; see calls and initializers.

## setSelectedClipFrameShape — line 12293

Sets selected clip viewport to straight or rounded edges.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12293) · Owner: callback:5348

- Calls: `selectedClipFrame`, `["straight", "rounded"].includes`, `commit`
- Assigns: `frame.clipFrameShape`

## releaseSelectedClipFrame — line 12300

Removes clipping frame while keeping and selecting its released members.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12300) · Owner: callback:5348

- Calls: `currentSlide`, `selectedClipFrame`, `clipFrameMembers`, `members.forEach`, `slide.annotations.filter`, `members.map`, `commit`
- Assigns: `slide.annotations`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## usesLargeAnnotationStartSize — line 12313

Returns /(?:^\|\/)(?:shapes-text\|bubbles\|shapes)(?:\/\|$)/i.test(String(value \|\| "").split(/[?#]/, 1)[0]).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12313) · Owner: callback:5348

- Calls: `/(?:^\|\/)(?:shapes-text\|bubbles\|shapes)(?:\/\|$)/i.test`, `String(value \|\| "").split`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## naturalAnnotationStartSize — line 12317

Calculates initial artwork dimensions preserving aspect within asset-category limits.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12317) · Owner: callback:5348

- Calls: `Math.max`, `Number`, `usesLargeAnnotationStartSize`, `clamp`
- Assigns: `height`, `width`

## sizeNewImageAnnotationFromAsset — line 12335

Loads dimensions and applies initial size only if object and history remain unchanged.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12335) · Owner: callback:5348

- Calls: `resolveAnnotationAssetSrc`
- Assigns: `probe.onload`, `probe.src`

## addImageAnnotation — line 12352

Creates image/GIF/library-shape annotation, selects it, then probes natural dimensions.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12352) · Owner: callback:5348

- Calls: `currentSlide`, `normalizeAnnotation`, `uid`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `commit`, `sizeNewImageAnnotationFromAsset`, `historySnapshot`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`

## addMarkup — line 12369

Source feedback: “Added markup.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12369) · Owner: callback:5348

- Calls: `currentSlide`, `normalizeMarkupKind`, `normalizeAnnotation`, `uid`, `markupLabel`, `document.getElementById`, `isPathMarkup`, `normalizeMarkupPoints`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `commit`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`

## addAnnotationFromUrl — line 12392

Validates nonempty URL and creates supported media/link annotation with hotspot association.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12392) · Owner: callback:5348

- Calls: `["image", "video", "gif", "audio", "link"].includes`, `String(value \|\| "").trim`, `String`, `mediaBase`, `showToast`, `normalizeHostedAnnotationUrl`, `addImageAnnotation`, `currentSlide`, `normalizeAnnotation`, `uid`, `topZ`, `slide.annotations.push`, `assignNewAnnotationToActiveHotspot`, `commit`
- Assigns: `state.ui.selectedKind`, `state.ui.selectedId`

## toolbarAnnotationTypeLabel — line 12423

Returns ({ image: "image", video: "video", gif: "GIF", audio: "audio", link: "link" })[type] \|\| "".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12423) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## toolbarAnnotationInputConfig — line 12427

Returns { mode, value: toolbarAnnotationDraft.value, label: ′${label} annotation URL′, placeholder: ′PASTE ${label.toUpperCase()} URL + PRESS RETURN′, title: ′Paste the full ${label} URL and press Return′ }… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12427) · Owner: callback:5348

- Calls: `toolbarAnnotationTypeLabel`, `label.toUpperCase`
- Assigns: No direct assignment expressions; see calls and initializers.

## applyToolbarAnnotationInputDraft — line 12448

Restores temporary next-link text in toolbar input.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12448) · Owner: callback:5348

- Calls: `document.getElementById`
- Assigns: `input.value`

## toolbarVideoLabel — line 12454

Returns String(input?.value ?? toolbarAnnotationDraft.videoTitle ?? "").trim().

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12454) · Owner: callback:5348

- Calls: `document.getElementById`, `String(input?.value ?? toolbarAnnotationDraft.videoTitle ?? "").trim`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## activateToolbarAnnotationUrl — line 12459

Creates link from toolbar URL; immediately rejects other annotation types.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12459) · Owner: callback:5348

- Calls: `document.getElementById`, `String(input?.value \|\| "").trim`, `String`, `addAnnotationFromUrl`, `resetToolbarAnnotationInput`, `applyToolbarAnnotationInputDraft`, `activeInput.focus`, `activeInput.setSelectionRange`
- Assigns: `toolbarAnnotationDraft`

## resetToolbarAnnotationInput — line 12479

Clears next-link state and optionally next-video title.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12479) · Owner: callback:5348

- Calls: `String`, `document.getElementById`, `applyToolbarAnnotationInputDraft`
- Assigns: `toolbarAnnotationDraft`, `videoInput.value`

## addUrlAnnotation — line 12487

Reads type-specific legacy URL input and delegates URL annotation creation.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12487) · Owner: callback:5348

- Calls: `document.getElementById`, `input?.value.trim`, `toolbarVideoLabel`, `addAnnotationFromUrl`, `input?.focus`
- Assigns: No direct assignment expressions; see calls and initializers.

## topZ — line 12494

Returns Math.max(1, ...slide.hotspots.map((item) => item.z), ...slide.annotations.map((item) => item.z)).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12494) · Owner: callback:5348

- Calls: `currentSlide`, `Math.max`, `slide.hotspots.map`, `slide.annotations.map`
- Assigns: No direct assignment expressions; see calls and initializers.

## moveSelectedZ — line 12499

Reorders selected layers to front/back and renumbers all slide layers.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12499) · Owner: callback:5348

- Calls: `selectedObjects`, `currentSlide`, `[         ...slide.annotations.map((entry, index) => ({ item: entry, domOrder: index })),         ...slide.hotspots.map((entry, index) => ({ item: entry, domOrder: slide.annotations.length + index }))       ].sort`, `slide.annotations.map`, `slide.hotspots.map`, `selection.map`, `layers.filter`, `reorderedLayers.some`, `showToast`, `reorderedLayers.forEach`, `commit`
- Assigns: No direct assignment expressions; see calls and initializers.

## toggleSelectedLock — line 12528

Locks/unlocks all selected objects; visibility helpers also consult the same lock property.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12528) · Owner: callback:5348

- Calls: `selectedObjects`, `entries.every`, `entries.forEach`, `currentSlide`, `commit`
- Assigns: No direct assignment expressions; see calls and initializers.

## toggleSelectedHotspotGroup — line 12543

Associates/disassociates selected annotations with exactly one selected hotspot using hotspotGroupId.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12543) · Owner: callback:5348

- Calls: `hotspotGroupingSelection`, `showToast`, `annotations.every`, `annotations.forEach`, `commit`
- Assigns: `state.ui.activeHotspotId`

## toggleSelectedObjectGroup — line 12560

Creates/removes move-together annotation groups using objectGroupId.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12560) · Owner: callback:5348

- Calls: `objectGroupingSelection`, `objectGroupEntriesForItem`, `selectedObject`, `showToast`, `grouping.annotations.forEach`, `grouping.annotations.map`, `commit`, `uid`
- Assigns: `grouping`, `multiSelection`

## toggleShapeFlip — line 12603

Toggles saved horizontal flip on Shapes-menu image artwork.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12603) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `commit`
- Assigns: `shape.flipX`

## arrangeSelected — line 12610

Aligns one object to page or several to collective bounds; distributes 3+ unlocked objects.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12610) · Owner: callback:5348

- Calls: `arrangementEntries`, `stageVerticalPositionMax`, `currentSlide`, `commit`, `showToast`, `Math.min`, `entries.map`, `entries.forEach`, `Math.max`, `entries.slice().sort`, `entries.slice`, `ordered.reduce`, `ordered.forEach`
- Assigns: `item.x`, `item.y`

## duplicateSelectedItems — line 12705

Copies selected objects with new IDs, offset, unlocked state and remapped selected relationships; rejects intro.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12705) · Owner: callback:5348

- Calls: `currentSlide`, `selectedObjects`, `showToast`, `selection.some`, `selection.filter`, `selectedHotspots.map`, `selectedAnnotations.map`, `selectedAnnotations.reduce`, `[...groupCounts].filter(([, count]) => count > 1).map`, `[...groupCounts].filter`, `topZ`, `slide.hotspots.push`, `slide.annotations.push`, `renumberHotspots`, `duplicateHotspots.map`, `duplicateAnnotations.map`, `hotspotIdMap.get`, `annotationIdMap.get`, `selectionEntry`, `hotspotIdMap.has`, `commit`
- Assigns: `multiSelection`, `state.ui.selectedKind`, `state.ui.selectedId`, `state.ui.activeHotspotId`

## copySelectedItemsToBuilderClipboard — line 12777

Copies selection data into in-memory builder clipboard.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12777) · Owner: callback:5348

- Calls: `selectedObjects`, `showToast`, `currentSlide`, `selection.filter(({ kind }) => kind === "hotspot").map`, `selection.filter`, `selection.filter(({ kind }) => kind === "annotation").map`
- Assigns: `objectClipboard`, `objectClipboardPasteCount`

## pasteBuilderClipboard — line 12796

Pastes builder clipboard into current slide; new IDs, offsets, group/clip/hotspot reference repair and video/intro restrictions.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12796) · Owner: callback:5348

- Calls: `showToast`, `currentSlide`, `objectClipboard.annotations.some`, `slideIntroCard`, `Math.min`, `objectClipboard.hotspots.map`, `objectClipboard.annotations.map`, `objectClipboard.annotations.reduce`, `[...groupCounts].filter(([, count]) => count > 1).map`, `[...groupCounts].filter`, `topZ`, `slide.hotspots.push`, `slide.annotations.push`, `renumberHotspots`, `pastedHotspots.map`, `pastedAnnotations.map`, `hotspotIdMap.get`, `annotationIdMap.get`, `selectionEntry`, `hotspotIdMap.has`, `commit`
- Assigns: `objectClipboardPasteCount`, `multiSelection`, `state.ui.selectedKind`, `state.ui.selectedId`, `state.ui.activeHotspotId`, `imageCropEditId`

## deleteSelected — line 12873

Deletes the primary object, with separate hotspot renumber/detach, clipping-frame release, group cleanup and intro branches.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12873) · Owner: callback:5348

- Calls: `currentSlide`, `stopAudio`, `slide.hotspots.filter`, `renumberHotspots`, `[...slide.hotspots, ...slide.annotations].forEach`, `slideIntroCard`, `slide.annotations.find`, `clipFrameMembers`, `released.forEach`, `slide.annotations.filter`, `remainingGroup.forEach`, `commit`
- Assigns: `slide.hotspots`, `state.ui.activeHotspotId`, `message`, `slide.annotations`, `state.ui.selectedId`, `state.ui.selectedKind`

## addSlide — line 12907

Creates and selects slide after current, resets selection, then opens media picker.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12907) · Owner: callback:5348

- Calls: `stopAudio`, `currentSlide`, `createSlide`, `String`, `state.tutorial.slides.splice`, `commit`, `selectExistingMediaFile`
- Assigns: `slide.browserUrl`, `slide.gptName`, `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`, `imageCropEditId`

## replaceSlideMedia — line 12924

Stops annotation audio and opens picker for current slide's main media.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12924) · Owner: callback:5348

- Calls: `stopAudio`, `selectExistingMediaFile`
- Assigns: No direct assignment expressions; see calls and initializers.

## duplicateSlide — line 12929

Copies non-cover slide and remaps all internal object relationships.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12929) · Owner: callback:5348

- Calls: `stopAudio`, `clone`, `currentSlide`, `uid`, `duplicate.hotspots.map`, `duplicate.annotations           .map((item) => item.objectGroupId)           .filter(Boolean)           .map`, `duplicate.annotations           .map((item) => item.objectGroupId)           .filter`, `duplicate.annotations           .map`, `duplicate.annotations.map`, `state.tutorial.slides.splice`, `commit`
- Assigns: `duplicate.id`, `duplicate.hotspots`, `duplicate.annotations`, `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`

## deleteSlide — line 12962

Confirms and deletes non-cover slide; adjusts current index and selection.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12962) · Owner: callback:5348

- Calls: `currentSlide`, `window.confirm`, `stopAudio`, `state.tutorial.slides.splice`, `clamp`, `slideIntroCard`, `commit`
- Assigns: `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## moveSlide — line 12980

Reorders non-cover slide without crossing cover position.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12980) · Owner: callback:5348

- Calls: `state.tutorial.slides.splice`, `commit`
- Assigns: `state.ui.slideIndex`

## selectedInsertedImage — line 12992

Returns isCroppableAnnotation(annotation) ? annotation : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12992) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `isCroppableAnnotation`
- Assigns: No direct assignment expressions; see calls and initializers.

## selectedShadowAnnotation — line 12998

Returns selectedObject() \|\| null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:12998) · Owner: callback:5348

- Calls: `selectedObject`
- Assigns: No direct assignment expressions; see calls and initializers.

## toggleInsertedImageCrop — line 13002

Source feedback: “Select an image, GIF, or shape first.”; “Finished cropping the selected image or shape.”; “Wait for the image to load before cropping.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13002) · Owner: callback:5348

- Calls: `selectedInsertedImage`, `showToast`, `commit`, `root.querySelector`, `CSS.escape`, `element?.querySelector`, `image.cropEnabled ? Math.max : Math.min`, `clamp`
- Assigns: `imageCropEditId`, `image.cropWindow`, `image.cropEnabled`, `image.cropScale`

## toggleInsertedImageShadow — line 13037

Source feedback: “Select an image, GIF, shape, or markup annotation first.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13037) · Owner: callback:5348

- Calls: `selectedShadowAnnotation`, `showToast`, `commit`
- Assigns: `image.imageShadow`

## zoomInsertedImageCrop — line 13047

Adjusts source crop scale/window while preserving selected crop-edit target.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13047) · Owner: callback:5348

- Calls: `selectedInsertedImage`, `clamp`, `commit`
- Assigns: `image.cropWindow.left`, `image.cropWindow.top`, `image.cropWindow.width`, `image.cropWindow.height`, `image.cropScale`, `imageCropEditId`

## selectedCornerAnnotation — line 13062

Returns isCroppableAnnotation(item) \|\| (item?.type === "markup" && normalizeMarkupKind(item.markup).startsWith("square-")) ? item : null.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13062) · Owner: callback:5348

- Calls: `selectedObject`, `isCroppableAnnotation`, `normalizeMarkupKind(item.markup).startsWith`, `normalizeMarkupKind`
- Assigns: No direct assignment expressions; see calls and initializers.

## setInsertedImageCornerRadius — line 13067

Sets image radius or converts UI percent to square SVG radius.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13067) · Owner: callback:5348

- Calls: `selectedCornerAnnotation`, `clamp`, `Number`, `commit`
- Assigns: `image.markupCornerRadius`, `image.cornerRadius`

## resetInsertedImageEdit — line 13082

Clears image crop/window/scale/position and corners, leaving unrelated appearance properties.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13082) · Owner: callback:5348

- Calls: `selectedInsertedImage`, `Object.assign`, `commit`
- Assigns: `imageCropEditId`

## setMediaFit — line 13090

Sets current main media fit to supported match/contain/cover value.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13090) · Owner: callback:5348

- Calls: `currentSlide`, `["match", "contain", "cover"].includes`, `commit`
- Assigns: `currentSlide().media.fit`

## nudgeMedia — line 13095

Source feedback: “Moved main media.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13095) · Owner: callback:5348

- Calls: `currentSlide`, `clamp`, `commit`
- Assigns: `media.x`, `media.y`

## nudgeSelectedObjects — line 13102

Moves unlocked selected items with position bounds; refreshes clip scene CSS for selected frame, without expanding membership here.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13102) · Owner: callback:5348

- Calls: `selectedObjects().filter`, `selectedObjects`, `stageVerticalPositionMax`, `currentSlide`, `entries.forEach`, `recordUndoStep`, `scheduleSave`
- Assigns: No direct assignment expressions; see calls and initializers.

## zoomMedia — line 13120

Source feedback: “Resized main media.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13120) · Owner: callback:5348

- Calls: `currentSlide`, `clamp`, `commit`
- Assigns: `currentSlide().media.scale`

## resetMedia — line 13125

Source feedback: “Reset main media.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13125) · Owner: callback:5348

- Calls: `Object.assign`, `currentSlide`, `commit`
- Assigns: No direct assignment expressions; see calls and initializers.

## applyDefaultBackground — line 13130

Creates and selects a new default-background image slide after current.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13130) · Owner: callback:5348

- Calls: `stopAudio`, `createSlide`, `Object.assign`, `state.tutorial.slides.splice`, `commit`
- Assigns: `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`, `imageCropEditId`

## coverSlide — line 13154

Returns state.tutorial.slides.find((slide) => slide.kind === "cover") \|\| state.tutorial.slides[0].

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13154) · Owner: callback:5348

- Calls: `state.tutorial.slides.find`
- Assigns: No direct assignment expressions; see calls and initializers.

## replaceCoverBackground — line 13158

Selects a replacement image for cover regardless of current slide.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13158) · Owner: callback:5348

- Calls: `stopAudio`, `coverSlide`, `showToast`, `selectExistingMediaFile`
- Assigns: No direct assignment expressions; see calls and initializers.

## applyDefaultCoverBackground — line 13168

Resets cover media to default asset/placement without adding a slide.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13168) · Owner: callback:5348

- Calls: `stopAudio`, `coverSlide`, `showToast`, `Object.assign`, `commit`
- Assigns: No direct assignment expressions; see calls and initializers.

## demoSlideDurationMs — line 13189

Returns clamp(Number(seconds) \|\| DEMO_DEFAULT_DURATION, DEMO_MIN_DURATION, DEMO_MAX_DURATION) * 1000.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13189) · Owner: callback:5348

- Calls: `currentSlide`, `clamp`, `Number`
- Assigns: No direct assignment expressions; see calls and initializers.

## syncDemoAudioTiming — line 13196

Sets manual/audio/default timing from override and narration presence.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13196) · Owner: callback:5348

- Calls: `currentSlide`, `Boolean`, `String(slide?.demo?.audioUrl \|\| "").trim`, `String`, `root.querySelector`
- Assigns: `slide.demo.timing`, `timingSelect.value`, `durationInput.disabled`

## demoSlideProgress — line 13208

Returns clamp(1 - (remaining / demoTotalMs), 0, 1).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13208) · Owner: callback:5348

- Calls: `currentSlide`, `Number.isFinite`, `clamp`, `Math.max`, `performance.now`
- Assigns: No direct assignment expressions; see calls and initializers.

## demoOverallProgress — line 13221

Returns clamp(((state.ui.slideIndex + demoSlideProgress()) / count) * 100, 0, 100).toFixed(1).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13221) · Owner: callback:5348

- Calls: `Math.max`, `clamp(((state.ui.slideIndex + demoSlideProgress()) / count) * 100, 0, 100).toFixed`, `clamp`, `demoSlideProgress`
- Assigns: No direct assignment expressions; see calls and initializers.

## formatDemoTime — line 13227

Returns ′${minutes}:${String(remainder).padStart(2, "0")}′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13227) · Owner: callback:5348

- Calls: `Math.max`, `Number`, `Math.floor`, `String(remainder).padStart`, `String`
- Assigns: No direct assignment expressions; see calls and initializers.

## demoProgressText — line 13234

Returns ′${Math.round(Number(demoOverallProgress()))}% complete′.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13234) · Owner: callback:5348

- Calls: `Math.round`, `Number`, `demoOverallProgress`
- Assigns: No direct assignment expressions; see calls and initializers.

## updateDemoPlaybackUi — line 13238

Refreshes demo progress, play/pause and time indicators.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13238) · Owner: callback:5348

- Calls: `slideHasMainVideo`, `currentSlide`, `root.querySelector`, `Number.isFinite`, `updateDemoVideoControls`, `clamp`, `String`, `demoOverallProgress`, `demoProgressText`, `seek.setAttribute`, `icon`, `toggle.setAttribute`
- Assigns: `seek.value`, `toggle.innerHTML`

## clearDemoTimers — line 13263

Cancels demo advance/progress timers.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13263) · Owner: callback:5348

- Calls: `window.clearTimeout`, `window.clearInterval`
- Assigns: `demoTimer`, `demoProgressTimer`, `demoDeadline`

## ensureDemoAudio — line 13271

Creates or returns shared demo narration Audio instance.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13271) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: `demoAudio`, `demoAudio.preload`

## primeDemoAudio — line 13279

Primes narration audio during user interaction to support later playback.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13279) · Owner: callback:5348

- Calls: `state.tutorial.slides.find`, `String(audioSlide?.demo?.audioUrl \|\| "").trim`, `String`, `ensureDemoAudio`, `audio.pause`, `audio.load`
- Assigns: `absoluteUrl`, `audio.src`, `audio.muted`, `demoAudioPrimePromise`

## prepareDemoAudio — line 13314

Configures current slide narration, seek position and playback handlers.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13314) · Owner: callback:5348

- Calls: `String(slide?.demo?.audioUrl \|\| "").trim`, `String`, `ensureDemoAudio`, `audio.pause`, `audio.load`, `applyFraction`, `audio.addEventListener`
- Assigns: `absoluteUrl`, `audio.src`

## scheduleDemoTimer — line 13342

Schedules next demo advancement and records timing state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13342) · Owner: callback:5348

- Calls: `Math.max`, `Number`, `window.clearTimeout`, `performance.now`, `window.setTimeout`
- Assigns: `demoRemainingMs`, `demoDeadline`, `demoTimer`

## startDemoProgressTicker — line 13350

Starts repeated updates of playback progress UI.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13350) · Owner: callback:5348

- Calls: `window.clearInterval`, `window.setInterval`, `updateDemoPlaybackUi`
- Assigns: `demoProgressTimer`

## startDemoSlidePlayback — line 13356

Runs video loop or narrated/timed slide, with media-ready waits and fallback timers.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13356) · Owner: callback:5348

- Calls: `clearDemoTimers`, `currentSlide`, `slideHasMainVideo`, `root.querySelector`, `Number.isFinite`, `clamp`, `video.play`, `startDemoProgressTicker`, `updateDemoPlaybackUi`, `scheduleDemoTimer`, `demoSlideDurationMs`, `prepareDemoAudio`, `audio.play().catch`, `audio.play`
- Assigns: `demoPlaybackRequest`, `video.loop`, `video.muted`, `video.currentTime`, `demoPlaying`, `demoAudioEndDelayActive`, `demoTotalMs`, `demoRemainingMs`, `audio.onended`, `audio.onerror`

## stopDemoSlidePlayback — line 13426

Stops timer/audio/video for current demo slide and optionally captures remaining time.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13426) · Owner: callback:5348

- Calls: `Math.max`, `performance.now`, `clearDemoTimers`, `demoAudio.pause`, `root.querySelectorAll("[data-main-video]").forEach`, `root.querySelectorAll`
- Assigns: `demoPlaybackRequest`, `demoRemainingMs`, `demoAudio.onended`, `demoAudio.onerror`

## pauseDemoPlayback — line 13438

Pauses demo and refreshes controls while preserving resume state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13438) · Owner: callback:5348

- Calls: `stopDemoSlidePlayback`, `updateDemoPlaybackUi`
- Assigns: `demoPlaying`

## resumeDemoPlayback — line 13445

Resumes current demo state and media.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13445) · Owner: callback:5348

- Calls: `restartDemoPlayback`, `primeDemoAudio`, `startDemoSlidePlayback`, `updateDemoPlaybackUi`
- Assigns: `demoPlaying`

## setDemoSlide — line 13457

Changes demo slide and optional progress/play state; refreshes rendering and playback.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13457) · Owner: callback:5348

- Calls: `stopDemoSlidePlayback`, `clamp`, `currentSlide`, `slideIntroCard`, `scrollSlidePositions.set`, `scrollExpandedHotspots.set`, `Boolean`, `demoSlideDurationMs`, `render`, `startDemoSlidePlayback`, `prepareDemoAudio`, `updateDemoPlaybackUi`
- Assigns: `demoAudioEndDelayActive`, `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `state.ui.contentsOpen`, `state.ui.videoModalId`, `demoFinished`, `demoPlaying`, `demoTotalMs`, `demoRemainingMs`

## advanceDemoPlayback — line 13481

Moves demo to next slide or completes at end.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13481) · Owner: callback:5348

- Calls: `stopDemoSlidePlayback`, `updateDemoPlaybackUi`, `setDemoSlide`
- Assigns: `demoAudioEndDelayActive`, `demoFinished`, `demoPlaying`, `demoRemainingMs`

## restartDemoPlayback — line 13494

Resets playback progression and starts from configured beginning.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13494) · Owner: callback:5348

- Calls: `slideHasMainVideo`, `currentSlide`, `root.querySelector`, `video.play().catch`, `video.play`, `startDemoProgressTicker`, `updateDemoPlaybackUi`, `primeDemoAudio`, `setDemoSlide`
- Assigns: `demoStarted`, `demoFinished`, `demoPlaying`, `video.currentTime`, `video.muted`, `video.loop`

## toggleDemoPlayback — line 13519

Dispatches start, pause or resume depending on demo state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13519) · Owner: callback:5348

- Calls: `demoVideoTargetIndex`, `startDemoVideoWithSound`, `slideHasMainVideo`, `currentSlide`, `toggleDemoMainVideo`, `restartDemoPlayback`, `pauseDemoPlayback`, `resumeDemoPlayback`
- Assigns: No direct assignment expressions; see calls and initializers.

## toggleDemoMainVideo — line 13527

Toggles main-video playback in demo context.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13527) · Owner: callback:5348

- Calls: `root.querySelector`, `Number.isFinite`, `video.play().catch`, `video.play`, `startDemoProgressTicker`, `video.pause`, `clearDemoTimers`, `updateDemoPlaybackUi`
- Assigns: `demoStarted`, `demoFinished`, `video.currentTime`, `demoPlaying`

## startDemoVideoWithSound — line 13548

Source feedback: “Use the play button to start this video with sound.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13548) · Owner: callback:5348

- Calls: `demoVideoTargetIndex`, `setDemoSlide`, `root.querySelector`, `root.querySelector(".demo-video-sound-gate")?.remove`, `video.play`, `playRequest.catch`, `startDemoProgressTicker`, `updateDemoPlaybackUi`
- Assigns: `demoVideoGateDismissed`, `demoVideoSoundEnabled`, `demoStarted`, `demoFinished`, `demoPlaying`, `video.loop`, `video.muted`, `video.currentTime`

## toggleDemoVideoSound — line 13576

Toggles demo video sound and updates media/control state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13576) · Owner: callback:5348

- Calls: `root.querySelector`, `root.querySelector(".demo-video-sound-gate")?.remove`, `updateDemoPlaybackUi`
- Assigns: `demoVideoGateDismissed`, `demoVideoSoundEnabled`, `video.muted`

## previewDemoSeek — line 13586

Updates drag-preview seek state before committing position.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13586) · Owner: callback:5348

- Calls: `slideHasMainVideo`, `currentSlide`, `root.querySelector`, `clamp`, `Number`, `Number.isFinite`, `updateDemoPlaybackUi`, `pauseDemoPlayback`
- Assigns: `video.currentTime`, `demoSeekResumeAfter`, `demoSeekPreview`

## commitDemoSeek — line 13604

Applies final seek position and restores appropriate playback state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13604) · Owner: callback:5348

- Calls: `slideHasMainVideo`, `currentSlide`, `root.querySelector`, `clamp`, `Number`, `Number.isFinite`, `updateDemoPlaybackUi`, `Math.max`, `Math.min`, `Math.floor`, `setDemoSlide`
- Assigns: `video.currentTime`, `demoSeekPreview`, `demoSeekResumeAfter`, `demoStarted`

## readerNext — line 13624

Advances demo or tutorial state through mode-specific slide/hotspot branches.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13624) · Owner: callback:5348

- Calls: `stopSlideNarrationPreview`, `currentSlide`, `setDemoSlide`, `slide.hotspots.findIndex`, `Math.max`, `render`, `drawAttentionToHotspot`, `updateDemoPlaybackUi`, `jumpSlide`, `stopAudio`
- Assigns: `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## readerBack — line 13665

Moves backward through mode-specific slide/hotspot branches.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13665) · Owner: callback:5348

- Calls: `stopSlideNarrationPreview`, `currentSlide`, `setDemoSlide`, `slide.hotspots.findIndex`, `slideIntroCard`, `render`, `updateDemoPlaybackUi`, `drawAttentionToHotspot`, `jumpSlide`, `stopAudio`
- Assigns: `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`

## jumpSlide — line 13727

Changes current slide and initial/last hotspot according to mode and request.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13727) · Owner: callback:5348

- Calls: `stopSlideNarrationPreview`, `setDemoSlide`, `stopAudio`, `clamp`, `currentSlide`, `slideIntroCard`, `scrollSlidePositions.set`, `scrollExpandedHotspots.set`, `render`, `drawAttentionToHotspot`
- Assigns: `demoMenuResumeAfter`, `demoStarted`, `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`, `state.ui.contentsOpen`, `state.ui.videoModalId`

## saveContentsSlideName — line 13758

Saves non-cover page name or default when blank; keeps menu open.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13758) · Owner: callback:5348

- Calls: `String`, `root.querySelector`, `nextTitle.trim`, `defaultSlideTitle`, `commit`
- Assigns: `slide.title`, `state.ui.contentsOpen`

## manageContentsSlide — line 13767

Selects requested page then routes duplicate/reorder/delete operation.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13767) · Owner: callback:5348

- Calls: `stopAudio`, `stopSlideNarrationPreview`, `currentSlide`, `slideIntroCard`, `duplicateSlide`, `moveSlide`, `deleteSlide`
- Assigns: `slideNarrationPanelSlideId`, `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `multiSelection`, `state.ui.contentsOpen`

## openContents — line 13784

Opens contents modal and remembers/pauses demo playback state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13784) · Owner: callback:5348

- Calls: `pauseDemoPlayback`, `render`, `setTimeout`
- Assigns: `demoMenuResumeAfter`, `state.ui.contentsOpen`

## closeContents — line 13794

Closes menu, restores focus and appropriate demo playback.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13794) · Owner: callback:5348

- Calls: `render`, `resumeDemoPlayback`, `setTimeout`
- Assigns: `demoMenuResumeAfter`, `state.ui.contentsOpen`

## openVideo — line 13803

Source feedback: “Add the video URL first.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13803) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `showToast`, `pauseDemoPlayback`, `render`, `setTimeout`
- Assigns: `lastVideoTriggerId`, `state.ui.videoModalId`

## closeVideo — line 13816

Closes popup video, clears modal state and restores interaction context.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13816) · Owner: callback:5348

- Calls: `document.getElementById`, `video.pause`, `render`, `setTimeout`
- Assigns: `video.currentTime`, `state.ui.videoModalId`

## toggleVideo — line 13830

Source feedback: “The browser could not start this video.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13830) · Owner: callback:5348

- Calls: `document.getElementById`, `video.play`, `showToast`, `video.pause`, `updateDirectVideoControls`
- Assigns: No direct assignment expressions; see calls and initializers.

## restartVideo — line 13845

Source feedback: “The browser could not replay this video.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13845) · Owner: callback:5348

- Calls: `document.getElementById`, `video.play`, `showToast`, `updateDirectVideoControls`
- Assigns: `video.currentTime`

## toggleMainVideo — line 13857

Source feedback: “The browser could not start this video.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13857) · Owner: callback:5348

- Calls: `root.querySelector`, `Number.isFinite`, `video.play`, `showToast`, `video.pause`, `updateMainVideoControls`
- Assigns: `video.currentTime`

## openLink — line 13873

Opens annotation destination in new browsing context.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13873) · Owner: callback:5348

- Calls: `window.open`
- Assigns: No direct assignment expressions; see calls and initializers.

## stopSlideNarrationPreview — line 13878

Stops builder narration preview and clears its playback state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13878) · Owner: callback:5348

- Calls: `slideNarrationPreviewAudio.pause`
- Assigns: `slideNarrationPreviewAudio.currentTime`, `slideNarrationPreviewAudio`, `slideNarrationPreviewSlideId`, `slideNarrationPreviewPlaying`

## toggleSlideNarrationPanel — line 13888

Opens/closes narration settings for current slide.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13888) · Owner: callback:5348

- Calls: `currentSlide`, `render`, `setTimeout`
- Assigns: `slideNarrationPanelSlideId`

## removeSlideNarrationAudio — line 13897

Source feedback: “Removed narration audio from this slide.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13897) · Owner: callback:5348

- Calls: `currentSlide`, `String(slide.demo?.audioUrl \|\| "").trim`, `String`, `window.confirm`, `stopSlideNarrationPreview`, `syncDemoAudioTiming`, `commit`
- Assigns: `slide.demo.audioUrl`, `slideNarrationPanelSlideId`

## toggleSlideNarrationPreview — line 13908

Source feedback: “Choose slide narration audio first.”; “The slide narration audio could not be played. Check the uploaded audio file.”; “The browser could not start this slide narration audio.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13908) · Owner: callback:5348

- Calls: `currentSlide`, `String(slide?.demo?.audioUrl \|\| "").trim`, `String`, `showToast`, `slideNarrationPreviewAudio.pause`, `render`, `stopSlideNarrationPreview`, `audio.addEventListener`, `audio.play`, `audio.pause`
- Assigns: `slideNarrationPreviewPlaying`, `audio.preload`, `audio.src`, `slideNarrationPreviewAudio`, `slideNarrationPreviewSlideId`, `audio.currentTime`

## stopAudio — line 13960

Stops active interactive annotation audio and updates playback state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13960) · Owner: callback:5348

- Calls: `window.__tutorialAudio.pause`
- Assigns: `window.__tutorialAudio.currentTime`, `activeAudio`, `audioPlaying`

## rewindAudio — line 13969

Rewinds active audio annotation or initializes requested audio playback path.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13969) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `stopAudio`, `createTutorialAudio`, `render`
- Assigns: `window.__tutorialAudio.currentTime`, `window.__tutorialAudio`, `activeAudio`, `audioPlaying`

## createTutorialAudio — line 13983

Creates annotation audio with metadata, duration, time-update and end callbacks.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:13983) · Owner: callback:5348

- Calls: `normalizeHostedAnnotationUrl`, `audio.addEventListener`
- Assigns: `audio.preload`, `audio.crossOrigin`, `audio.src`

## updateAudioTimeline — line 14003

Updates matching interactive audio timeline/time display.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14003) · Owner: callback:5348

- Calls: `root.querySelector`, `CSS.escape`, `Number.isFinite`, `clamp`, `String`, `timeline.setAttribute`, `formatVideoTime`
- Assigns: `timeline.max`, `timeline.value`

## audioFailureMessage — line 14014

Returns "The browser could not start this audio. Check that the URL opens the audio file directly.".

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14014) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## toggleAudio — line 14022

Starts/pauses selected interactive audio, stopping other active annotation audio.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14022) · Owner: callback:5348

- Calls: `currentSlide().annotations.find`, `currentSlide`, `selectionKey`, `stopAudio`, `createTutorialAudio`, `window.__tutorialAudio.play`, `showToast`, `audioFailureMessage`, `window.__tutorialAudio.pause`, `render`, `updateAudioTimeline`
- Assigns: `imageCropEditId`, `multiSelection`, `state.ui.selectedKind`, `state.ui.selectedId`, `window.__tutorialAudio`, `activeAudio`, `audioPlaying`

## resetBuilder — line 14053

Confirms and resets current draft/browser data to starter state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14053) · Owner: callback:5348

- Calls: `confirm`, `clone`, `embeddedProjectState`, `prepareLoadedState`, `render`, `saveProjectToDiskNow`, `showToast`, `localStorage.removeItem`, `OBSOLETE_STORAGE_KEYS.forEach`, `updateDraftSaveStatus`, `location.reload`
- Assigns: `state`, `draftStorageError`, `draftSavePhase`

## saveEditableCopy — line 14080

Attempts save then downloads editable builder with current embedded state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14080) · Owner: callback:5348

- Calls: `saveProjectToDiskNow`, `saveStateNow`, `clone`, `document.documentElement.cloneNode`, `documentElement.querySelector`, `builderBody.removeAttribute`, `JSON.stringify(builderState, null, 2).replace`, `JSON.stringify`, `documentElement.querySelectorAll(".toast").forEach`, `documentElement.querySelectorAll`, `download`, `editableCopyFilename`, `showToast`
- Assigns: `builderBody.dataset.mode`, `documentElement.querySelector("#app").innerHTML`, `documentElement.querySelector("#project-state").textContent`

## metadataForExport — line 14098

Returns { title, description, image, alt: exportState.meta.socialImageAlt \|\| ′${title} tutorial preview′, url: publicUrl(exportState.meta) }.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14098) · Owner: callback:5348

- Calls: `publicUrl`
- Assigns: No direct assignment expressions; see calls and initializers.

## applyHeadMetadata — line 14106

Writes page title, description, canonical and Open Graph/Twitter metadata into export clone.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14106) · Owner: callback:5348

- Calls: `documentElement.querySelector`, `metadataForExport`, `head.querySelector`, `setMeta`, `documentElement.ownerDocument.createElement`, `head.append`
- Assigns: `head.querySelector("title").textContent`, `canonical`, `canonical.rel`, `canonical.href`

## setMeta — line 14132

Creates or updates one named/property metadata element.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14132) · Owner: callback:5348

- Calls: `head.querySelector`, `head.ownerDocument.createElement`, `node.setAttribute`, `head.append`
- Assigns: `node`, `node.content`

## applyExportFont — line 14142

Rewrites export font sources and preloads with public URLs and available embedded label-font fallback.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14142) · Owner: callback:5348

- Calls: `documentElement.querySelector`, `impactLabelFontFace?.textContent.match`, `impactLabelReversedFontFace?.textContent.match`, `[         ′url("${impactLabelUrl}") format("truetype")′,         ′url("${absoluteImpactLabelUrl}") format("truetype")′,         impactLabelEmbeddedUrl ? ′url("${impactLabelEmbeddedUrl}") format("truetype")′ : ""       ].filter(Boolean).join`, `[         ′url("${impactLabelUrl}") format("truetype")′,         ′url("${absoluteImpactLabelUrl}") format("truetype")′,         impactLabelEmbeddedUrl ? ′url("${impactLabelEmbeddedUrl}") format("truetype")′ : ""       ].filter`, `[         ′url("${impactLabelReversedUrl}") format("truetype")′,         ′url("${absoluteImpactLabelReversedUrl}") format("truetype")′,         impactLabelReversedEmbeddedUrl ? ′url("${impactLabelReversedEmbeddedUrl}") format("truetype")′ : ""       ].filter(Boolean).join`, `[         ′url("${impactLabelReversedUrl}") format("truetype")′,         ′url("${absoluteImpactLabelReversedUrl}") format("truetype")′,         impactLabelReversedEmbeddedUrl ? ′url("${impactLabelReversedEmbeddedUrl}") format("truetype")′ : ""       ].filter`, `preload.setAttribute`, `impactLabelPreload.setAttribute`, `impactLabelReversedPreload.setAttribute`
- Assigns: `fontFace.textContent`, `impactLabelFontFace.textContent`, `impactLabelReversedFontFace.textContent`

## waitForExportFonts — line 14220

Waits for interface/label font loads with a bounded timeout.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14220) · Owner: callback:5348

- Calls: `Promise.race`, `Promise.all`, `document.fonts?.load`, `Promise.resolve`
- Assigns: No direct assignment expressions; see calls and initializers.

## buildExportHtml — line 14232

Synchronizes editing, builds player clone and embeds export state; sets font/head metadata and mode.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14232) · Owner: callback:5348

- Calls: `waitForExportFonts`, `syncLiveEditableBeforeRender`, `render`, `fitRenderedTextCardsToContent`, `saveProjectToDiskNow`, `clone`, `exportState.tutorial.slides[0]?.annotations?.some`, `document.documentElement.cloneNode`, `documentElement.querySelector`, `exportBody.removeAttribute`, `documentElement.querySelector("#png-export-runtime")?.remove`, `JSON.stringify(exportState, null, 2).replace`, `JSON.stringify`, `documentElement.querySelectorAll(".toast").forEach`, `documentElement.querySelectorAll`, `applyExportFont`, `applyHeadMetadata`, `setMeta`, `slugify`
- Assigns: `exportState.meta.pageType`, `exportState.ui`, `exportBody.dataset.mode`, `exportBody.dataset.demoPlayer`, `documentElement.querySelector("#app").innerHTML`, `documentElement.querySelector("#project-state").textContent`

## previewDemo — line 14275

Uses shared HTML export builder for an iframe preview without downloading.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14275) · Owner: callback:5348

- Calls: `showToast`, `buildExportHtml`, `render`, `setTimeout`
- Assigns: `previewBuildRequest`, `demoPreviewMode`, `demoPreviewHtml`, `demoPreviewOpen`

## closeDemoPreview — line 14294

Clears preview state and restores focus to Preview button.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14294) · Owner: callback:5348

- Calls: `render`, `setTimeout`
- Assigns: `previewBuildRequest`, `demoPreviewOpen`, `demoPreviewHtml`

## exportHtml — line 14302

Downloads HTML returned by shared export builder.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14302) · Owner: callback:5348

- Calls: `buildExportHtml`, `download`, `showToast`
- Assigns: No direct assignment expressions; see calls and initializers.

## blobAsDataUrl — line 14310

Returns new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result \|\| "")); reader.onerror = () => reject(reader.error \|\| new Error("Could not read media for PNG export.")); reader.rea… (see source).

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14310) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## inlinePngExportImages — line 14319

Image/video inlining fallback helper, defined but not called by current runtime.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14319) · Owner: callback:5348

- Calls: `source.querySelectorAll`, `cloneRoot.querySelectorAll`, `Promise.all`, `cloneImages.map`, `cloneVideos.forEach`
- Assigns: No direct assignment expressions; see calls and initializers.

## elementAsPngBlob — line 14362

Captures stage using html2canvas, removes enumerated authoring UI and handles full scroll height.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14362) · Owner: callback:5348

- Calls: `element.getBoundingClientRect`, `element.querySelector`, `scrollViewport?.querySelector`, `Math.max`, `uid`, `window.html2canvas`
- Assigns: `element.dataset.pngCaptureId`, `canvas`

## downloadBlob — line 14428

Downloads supplied Blob through temporary object URL.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14428) · Owner: callback:5348

- Calls: `URL.createObjectURL`, `document.createElement`, `document.body.append`, `link.click`, `link.remove`, `setTimeout`
- Assigns: `link.href`, `link.download`

## zipCrc32 — line 14439

Calculates ZIP entry CRC-32 checksum, caching lookup table.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14439) · Owner: callback:5348

- Calls: `Array.from`
- Assigns: `zipCrc32.table`, `crc`

## zipHeader — line 14452

Returns { bytes, view: new DataView(bytes.buffer) }.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14452) · Owner: callback:5348

- Calls: No direct calls.
- Assigns: No direct assignment expressions; see calls and initializers.

## makeSlidePngZip — line 14457

Builds uncompressed ZIP containing PNG blobs, filenames, checksums and directory records.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14457) · Owner: callback:5348

- Calls: `now.getHours`, `now.getMinutes`, `Math.floor`, `now.getSeconds`, `Math.max`, `now.getFullYear`, `now.getMonth`, `now.getDate`, `encoder.encode`, `entry.blob.arrayBuffer`, `zipCrc32`, `zipHeader`, `local.view.setUint32`, `local.view.setUint16`, `localParts.push`, `central.view.setUint32`, `central.view.setUint16`, `centralParts.push`, `centralParts.reduce`, `end.view.setUint32`, `end.view.setUint16`
- Assigns: `offset`

## exportPng — line 14517

Loops slides, captures initial visible state to PNG, creates ZIP, then restores UI state.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14517) · Owner: callback:5348

- Calls: `showToast`, `clone`, `slugify`, `waitForExportFonts`, `saveProjectToDiskNow`, `slideIntroCard`, `render`, `root.querySelector`, `slideElement.querySelector`, `elementAsPngBlob`, `pngEntries.push`, `String(index + 1).padStart`, `String`, `downloadBlob`, `makeSlidePngZip`
- Assigns: `pngExportInProgress`, `index`, `state.ui.slideIndex`, `state.ui.activeHotspotId`, `state.ui.selectedKind`, `state.ui.selectedId`, `state.ui.contentsOpen`, `state.ui.videoModalId`, `multiSelection`, `resultMessage`, `state.ui`

## copyPublicUrl — line 14563

Source feedback: “Add a learning section and tutorial slug first.”; “Copied the public social share URL.”. Target assignments and called functions are listed below.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14563) · Owner: callback:5348

- Calls: `publicUrl`, `showToast`, `navigator.clipboard.writeText`, `document.createElement`, `input.setAttribute`, `document.body.append`, `input.select`, `document.execCommand`, `input.remove`
- Assigns: `input.value`, `input.style.position`, `input.style.opacity`

## download — line 14585

Creates a text Blob, initiates file download and releases object URL.

[Source](/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html:14585) · Owner: callback:5348

- Calls: `URL.createObjectURL`, `document.createElement`, `document.body.append`, `link.click`, `link.remove`, `setTimeout`
- Assigns: `link.href`, `link.download`

