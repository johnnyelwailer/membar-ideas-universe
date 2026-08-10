# Membar Ideas Universe — timestamp-linked correction

## Hypothesis

When a lyric is uncertain after a take, a timestamp-linked correction lens can
let an artist verify the performed word, compare a small set of alternatives,
and correct the display without losing the original take or leaving Live
Session. The interaction should feel like checking a source note, not opening
a full editor.

## Variant and relationships

- New node: **Timestamp-linked correction** (Workbench / transcription trust)
- Extends the product direction's Live Session → Workbench transition.
- Contrasts the existing Cue, native-scroll, click-expand, Galaxy, and Artboard
  experiments by making provenance and correction the primary interaction.
- Next contrast: test a two-pane source/video + lyric/chord layout.

## Synthetic fixture

'Sea Glass' is a fictional English demo by **Mara Vale**, recorded in the
fictional 2026-07-20 rehearsal take 'sea-glass_take-03.m4a'. Lyrics, timestamps,
chords, confidence values, alternate transcript candidates, and the waveform
are all generated fixture data. No audio or private media is included.

## Interaction contract

1. Click a timeline segment or uncertain word.
2. Inspect the source timestamp and candidate wording.
3. Select a candidate and apply it to the display.
4. The original transcript remains visible in the evidence log, and the user can
   restore the performed wording.

## Variant: source-video workbench (2026-07-21)

### Falsifiable hypothesis

Putting synthetic source video, lyric, chord, and section state on one scrubbed
surface will help an artist recover and keep a useful moment faster than
switching between separate source and editing views.

This deliberately contrasts the previous timestamp-linked correction lens: the
last experiment focused on one uncertain word and reversible display text; this
one focuses on navigating a whole take and preserving a revisitable source
moment.

### Interaction contract

1. Scrub the source or choose a section tab; the frame, lyric, chord, bars, and
   timestamp change together.
2. Play the source to advance through sections and compare source-only with the
   source-plus-display reading.
3. Keep a moment; it becomes a persistent in-session return point and can be
   tapped to restore the same source-backed context.

### Persistent-universe delta

- New node: **Source Workbench** (`new`, v01, last_touched `2026-07-21`, status
  `New experiment`).
- Relationships: `Source Workbench → Song Workbench`, `Timestamp Correction`,
  `Structure Lens`, and `Memory Archive`.
- Existing nodes remain immutable in prior versions; all fixture video frames,
  song data, timestamps, chords, and performer names are synthetic.

## Variant: proactive Home return (2026-07-22)

### Falsifiable hypothesis

If Muse Home offers a one-tap return to the last kept source moment, an artist
can resume in Workbench without opening the galaxy first.

This contrasts the previous latest-experiment launch strip: that run tested
discoverability of Source Workbench; this run tests continuity after an artist
keeps a concrete section, timestamp, lyric, and chord.

### Interaction contract

1. Open Source Workbench, choose a synthetic section, and keep the moment.
2. The kept moment is stored locally as a small synthetic JSON record under
   `membar:last-kept-moment`; no account or server state is involved.
3. Return to Home. Its first-viewport strip changes to `ready to resume` and
   shows a return chip with the saved section, timestamp, chord, lyric, song,
   and artist.
4. Tap Resume in Workbench. The `?moment=<section-id>` deep link restores the
   exact source-backed section and shows that it was resumed from Home.

### Persistent-universe delta

- Existing 11-node tracked source surface is preserved; the public Pages
  universe remains the authoritative 11-node synthetic direction.
- Muse Home changes from `unresolved` to updated `v02`, last touched
  `2026-07-22`, change type `continuity`; Source Workbench is also marked
  updated `v02` because it now emits the return record.
- Visible relationship statement: `Home → Source Workbench` and
  `Home → Memory Archive`. No historical node or edge is replaced.

## Variant: Workbench to Live Session cue bridge (2026-07-23)

### Falsifiable hypothesis

If a kept Workbench moment can be armed as a Live Session cue and then entered
during a session, an artist can move from archive evidence into making without
losing provenance or returning to the galaxy.

This contrasts the previous Home → Workbench experiment: that run tested
resuming a kept moment from Home; this run tests the reverse handoff, with the
source-backed moment becoming actionable inside a live session.

### Interaction contract

1. Scrub or choose a synthetic section, then press `Arm cue for Live Session`.
2. Inspect the visible cue chip with section, timestamp, chord, performed lyric,
   and source filename; press `Enter cue` to start the synthetic session clock.
3. The framed `LIVE SESSION · CUE ENTERED` state keeps the same source context,
   then `Exit session` returns to the Workbench.
4. The cue is stored locally under `membar:last-live-cue`; `Recent cues` can
   restore the same cue without visiting the Ideas Universe.

### Persistent-universe delta

- Node count remains 11; **Source Workbench** is updated from v02 to v03,
  last_touched `2026-07-23`, change type `updated`, with the visible state
  `cue bridge`.
- Relationship delta: `Source Workbench → Live Session` is now explicit. The
  prior Source Workbench → Song Workbench, Timestamp Correction, Structure
  Lens, and Memory Archive edges remain unchanged.
- Every cue, lyric, timestamp, chord, artist, and source filename is synthetic;
  persistence is browser-local only. No microphone, private media, account,
  or generated lyric is used.

## Variant: direct source scrub retrieval (2026-07-24)

### Falsifiable hypothesis

Making one synchronized source strip directly scrub-able — while the
lyric/chord lane follows and a kept moment becomes a revisitable return point —
will reduce the time from seeing a promising node to re-entering its exact song
moment compared with the previous run's explicit Workbench → Live Session cue
arming.

This contrasts the prior cue bridge: the earlier run tested arming and entering
a source-backed cue inside Live Session; this run tests direct manipulation and
exact timestamp retrieval before entering a session.

### Interaction contract

1. Drag or tap anywhere on the framed Source Strip. Its playhead and timestamp
   move continuously across the synthetic 01:12 take.
2. The source section, scene, chord, lyric, and provenance line update together
   at the new timestamp.
3. Keep the current moment. It creates a browser-local return point and also
   feeds the existing Home resume record under `membar:last-kept-moment`.
4. Tap a return point to restore the exact timestamp, chord, lyric, and source
   section. Play advances the same strip deterministically; the prior cue bridge
   remains available under a secondary disclosure.

### Synthetic fixture and provenance

`North Window` is a fictional English demo by `Jo Sable`, recorded in the
fictional `north-window_take-02.mp4` rehearsal take. The waveform, section
bounds, timestamps, chords, scenes, and performed lyric lines are synthetic
fixture data. No audio, video, private media, account state, or generated lyric
is bundled. The strip's display remains explicitly non-destructive and source
authoritative.

### Persistent-universe delta

- New node: **Direct source scrub** (`new`, v04, last_touched `2026-07-24`,
  change_type `new`, status `exact retrieval`).
- Updated node: **Source Workbench** remains v03 and keeps its prior cue-bridge
  variant immutable; this run adds a separate direct-scrub node and page variant.
- Relationships: `Direct source scrub → Source Workbench`, `Direct source scrub
  → Memory Archive`, and `Direct source scrub → Live Session`. Existing nodes and
  historical edges remain unchanged.
- Node/list count changes from 11 to 12. The spatial map and list fallback both
  expose the NEW marker, version, date, status, and direct route to the lab.

### Next contrast

Test whether the same exact return point can become a timestamp-linked lyric
correction without adding a second editing surface or disrupting the source
strip's direct manipulation.

## Variant: recency focus shell refresh (run 8, 2026-07-26)

### Falsifiable hypothesis

When the universe leads with recent changes, exposes a focused relationship
drawer, and keeps a synchronized list fallback, an artist can understand and
act on a 100-node universe without losing the spatial map.

This deliberately contrasts run 7's direct source-scrub retrieval experiment:
run 7 shortened the path to an exact song moment inside Workbench; this refresh
tests whether the outer universe can make scale, change, and relationships
legible before an artist opens that workbench.

### Interaction contract

1. Select a mapped node or a recent-change action to open its focused drawer.
2. Inspect hypothesis, status, version, last touched date, and relationship
   edges, then use the density or change filter to alter the visible universe.
3. Remember the focus and return to it from the scale strip after navigating or
   filtering. Source-backed nodes retain an actionable route into Workbench.

### Universe status and relationships

- **100 indexed nodes** are represented by client-side synthetic records;
  **12 recent nodes** stay mapped/listed for comprehension, while 88 quieter
  archive nodes become discoverable through search and change filters.
- **New:** Timestamp-linked correction, v01, last touched 20 Jul 2026, status
  `ready to test`. Edges: Song Workbench, Source Workbench, Phonetic Memory.
- **Updated:** One calm invitation, v02, 22 Jul 2026, status `continuity test`.
  Edges: Source Workbench, Memory Archive, Live Session.
- **Updated:** Source + lyric chord layout, v03, 23 Jul 2026, status `cue
  bridge`. Edges: Source Workbench, Live Session, Structure Lens.
- **New:** Direct source scrub, v04, 24 Jul 2026, status `exact retrieval`.
  Edges: Source Workbench, Memory Archive, Live Session. Its NEW marker is
  preserved from run 7; this refresh does not replace that node.
- **Needs review:** Phonetic Memory, v01, 15 Jul 2026, status `evidence layer`;
  edges Timestamp-linked correction and Memory Archive. Structure Lens, v01,
  16 Jul 2026, status `section map`; edges Live Session, Source Workbench,
  Cue as a quiet section.
- Stable nodes remain Cue as a quiet section, Galaxy at hundreds of ideas, Six
  visual worlds, Song Workbench, Memory Archive, and Rhyme Compass; their edges
  are preserved in the client fixture records.

All titles, song fragments, dates, and relationship labels are synthetic. This
variant does not add feedback, custom nodes, authenticated persistence, agent
handoff, private media, or a server-backed write path.

## Variant: in-strip timestamp correction (run 9, 2026-07-27)

### Falsifiable hypothesis

A timestamp-linked, display-only correction inside the existing source strip
will let an artist verify and revisit an uncertain performed word without
leaving its source context.

This contrasts run 8's recency/focus shell refresh and run 7's exact source
scrub retrieval. The shell remains the entry point; the correction lens now
appears where the source moment is already being scrubbed.

### Interaction contract

1. Scrub to the dotted synthetic word `light` at `00:47.3` or `weather` at
   `00:58.2`; the lens follows the source timestamp, section, chord, take, and
   confidence.
2. Select one of three synthetic readings and apply it. Only the display lyric
   changes; the performed word stays visible as evidence.
3. The correction is stored browser-locally under `membar:strip-corrections`.
   The evidence log provides a revisitable timestamp and a restore action.
4. Restore the performed wording at any time; the source strip and prior keep,
   cue, and Home routes remain available.

### Synthetic fixture and provenance

This extends fictional `North Window` by `Jo Sable` in
`north-window_take-02.mp4`. The two uncertain words, confidence values,
candidate readings, source frames, timestamps, and chords are synthetic. No
audio, private media, account state, or generated lyric is bundled.

### Persistent universe delta

- Updated **Timestamp-linked correction** from v01 to v02, last touched 27 Jul
  2026, `change_type: updated`, status `in-strip test`.
- Added the relationship **Timestamp-linked correction → Direct source scrub**;
  existing edges to Song Workbench, Source Workbench, and Phonetic Memory are
  preserved.
- The universe remains 100 indexed synthetic nodes with the same 12 surfaced
  records; no historical node or edge was replaced. The v01 Sea Glass lens is
  still reachable from the focus view, while the v02 route is the source strip.

### Next contrast

Test a distinct source/video plus lyric/chord/section layout claim from this
in-strip correction, without duplicating the correction lens or changing its
non-destructive provenance contract.

## Variant: split evidence deck (run 10, 2026-07-29)

### Falsifiable hypothesis

Putting synthetic source video, lyric, chord, and section state into a split
evidence deck with a pinned source context will let an artist compare a take and
keep the right section faster than the current source-strip correction path.

This contrasts run 9's in-strip timestamp-linked correction: run 9 checked one
uncertain word without leaving the source strip; this run tests whole-take
comparison, section comprehension, and a separate source-backed return point.

### Interaction contract

1. Scrub or play the synthetic `North Window` take, or tap one of four sections.
   The source frame, timestamp, lyric, chord, bars, section, and provenance move
   together.
2. Toggle the reading layer to compare source-only with the source-plus-reading
   deck. The source frame remains pinned and authoritative in both states.
3. Keep the current section. A browser-local return card persists the exact
   timestamp and restores the joined source/reading context after reload.

### Synthetic provenance

`North Window` by fictional `Jo Sable` uses synthetic source frames, scene names,
timestamps, chords, bars, performed lines, and the fictional
`north-window_take-02.mp4` filename. No audio, video, private media, account
state, generated lyrics, or authenticated persistence is included.

### Persistent-universe delta

- Added **Evidence deck** as NEW, v01, last touched 29 Jul 2026,
  `change_type: new`, status `section compare`.
- Relationships: `Evidence deck → Source Workbench`, `Evidence deck → Direct
  source scrub`, and `Evidence deck → Structure Lens`.
- The universe is now 101 indexed synthetic nodes: 13 recent mapped/listed
  records and 88 quieter archive records. Prior nodes, routes, and edges remain
  immutable; this is not a shell refresh.

The route is `source-layout.html`. Its private browser-local key is
`membar:source-layout-moment:v01`, separate from the existing keep, cue, and
correction stores.

### Next contrast

Test a radically different Artboard/collage model or Live Session-to-Workbench
continuation, without adding another correction surface to the evidence deck.

## Variant: audio-visual constellation artboard (run 11, 2026-07-31)

### Falsifiable hypothesis

An audio-visual constellation Artboard, where an artist drags a source moment
into a visual orbit, compares two synthetic treatments, and pins one, makes
visual direction feel like a reversible song-making action rather than a
gallery.

This contrasts run 10's split evidence deck: run 10 compared whole take
sections inside a pinned source/reading deck; this run leaves the comparison
deck entirely and tests a spatial collage instrument where one source moment
becomes a placed, treated, pinnable object. It adds no lyric correction and no
second source comparison surface.

### Interaction mechanics

1. Drag the synthetic `North Window` source moment tile (pointer or touch) from
   the source tray into the orbit; the tile itself is the accessible fallback —
   press or tap it to place. The orbit fills, the constellation thread becomes
   active, and the treatment controls appear.
2. Compare two clearly different synthetic treatments for the placed moment —
   `Ember drift` (warm particles, slow pull) and `Tide glass` (cool rings,
   breathing) — rendered procedurally in CSS. Selecting one previews it on the
   placed tile and in the active thread.
3. Pin the chosen reading. The pin persists browser-locally under
   `membar:constellation-pin:v01`; on reload the pinned constellation restores
   (placed tile, treatment, pinned marker, return card), and `Release pin`
   reverses it without touching the source.

The source moment stays authoritative: the placed tile keeps `Jo Sable`,
`North Window`, the `00:60.0` Chorus/G reference, and the synthetic
`north-window_take-02.mp4` provenance. Both treatments are explicitly
non-destructive interpretations, never edits to the take.

### Synthetic provenance

This reuses the fictional `North Window` by `Jo Sable` fixture. The orbit,
sparks, threads, treatments, and all visuals are procedural CSS/SVG/DOM. No
audio, video, private media, generated binary media, account state, or
generated lyric is bundled; persistence is browser-local only.

### Persistent-universe delta

- Added **Audio-visual constellation** as NEW, v01, last touched 31 Jul 2026,
  `change_type: new`, category `visual`, status `orbit study`, route
  `artboard-constellation.html`.
- Relationships: `Audio-visual constellation → Six visual worlds`,
  `Audio-visual constellation → Memory Archive`, and
  `Audio-visual constellation → Direct source scrub`.
- The existing **Six visual worlds** (Artboard) node is wired to the new route:
  its drawer action now opens `artboard-constellation.html`. Its version,
  status, and edges are unchanged.
- The universe is now 102 indexed synthetic nodes: 14 recent mapped/listed
  records and the same 88 quieter archive records. No historical node or edge
  is replaced, and this is not a shell refresh; the existing keep, cue,
  correction, and evidence-deck stores and routes remain intact.

### Next contrast

Test Live Session-to-Workbench continuation, or let a pinned constellation feed
a future artboard back into Cue, without reopening the correction or evidence
deck surfaces.

## Variant: recency orbit rail shell refresh (run 12, 2026-08-03)

### Falsifiable hypothesis

An interactive recency orbit rail that can be scrubbed through change windows,
keeps the map and list synchronized, and restores a pinned focus after reload
will let an artist find and re-enter the relevant experiment in under 15
seconds at 100+ ideas. This contrasts run 11's spatial Artboard placement: the
shell itself is now the instrument, while the constellation and every earlier
prototype remain reachable and immutable.

### Interaction mechanics

1. Drag or tap a recency window, or focus the rail and use the arrow keys. The
   visible date horizon, indexed count, map nodes, and list fallback change
   together; each window includes everything newer than it.
2. Select any visible node to open its focused thread with hypothesis, status,
   version, last-touched date, route, and relationship edges.
3. Pin the focus. A versioned browser-local record under
   `membar:recency-focus:v01` survives reload and creates a compact return
   action in the scale strip and rail. No account or server state is involved.

### Persistent-universe delta

- Node count remains **102 indexed**, with **14 recent mapped/listed** records
  and **88 quiet archive** records. No historical node or relationship edge is
  replaced; every node still carries `hypothesis`, `status`, `version`,
  `last_touched`, `change_type`, and `edges`.
- **Galaxy at hundreds of ideas** is the shell concept under test; its prior
  node remains stable and its prior relationships remain unchanged.
- The shell refresh adds no new content node. It changes the navigational
  interaction materially: recency windows, synchronized filtering, focus
  comprehension, and revisitable focus persistence.

### Synthetic provenance

All dates, node titles, relationship labels, hypotheses, and quiet archive
records are synthetic fixture data. No private media, account data, secrets,
tokens, or generated lyrics are bundled.

### Next contrast

Test Live Session-to-Workbench continuity or a new collage model, contrasting
this shell's time-based retrieval with a single source-backed making action;
do not add another correction surface or repeat the run-12 rail claim.

## Variant: Live rehearsal continuity (run 13, 2026-08-05)

### Falsifiable hypothesis

A source-backed Live Session rehearsal loop will make Live Session → Workbench
feel like a making action: launch from one kept source moment, capture two
synthetic passes, compare them, and return the chosen pass without losing
provenance or navigating the galaxy.

This contrasts run 12's recency orbit rail. Run 12 tested time-based retrieval,
focus comprehension, and shell persistence; this run tests one source-backed
making loop inside the session boundary. It does not reopen correction, source
scrub, evidence-deck, or Artboard comparison surfaces.

### Interaction contract

1. Enter Live Session from the fixed `North Window` / Jo Sable `Chorus` source
   moment at `01:00.0`, chord `G`, with the synthetic source filename visible.
2. Capture a synthetic Take A, then a synthetic Take B. The meter animates only
   while capture is active, and the performed line remains a source anchor.
3. Tap either captured pass to compare/select it. The chosen pass becomes a
   browser-local, versioned return point and exposes `Return ... to Workbench`.
4. Reopening the route restores the captured passes and selection. Reset is
   explicit and reversible at the prototype level; source evidence never changes.

### Synthetic provenance

`North Window` is a fictional English demo by `Jo Sable`, with a fictional
`north-window_take-02.mp4` rehearsal source. The source frame, timestamp,
section, chord, lyric, take labels, take notes, and meter are synthetic fixture
data. No audio, video, private media, account state, generated lyrics, or
authenticated persistence is included. Take notes are session observations,
not edits to the performed lyric.

### Persistent-universe delta

- Added **Live rehearsal continuity** as NEW, v01, last touched 05 Aug 2026,
  `change_type: new`, category `live`, status `continuity study`, route
  `live-session-continuity.html`.
- Relationships: **Live rehearsal continuity → Live Session**, **Source
  Workbench**, **Song Workbench**, and **Memory Archive**. Existing nodes and
  edges remain unchanged.
- The universe is now **103 indexed synthetic nodes**: 15 recent mapped/listed
  records and the same 88 quieter archive records. This is a content-node
  addition, not a shell refresh.
- Browser-local state uses the versioned key
  `membar:live-session-continuity:v01`; no feedback, custom nodes, server
  persistence, or agent handoff is included.

### Next contrast

Test whether a chosen rehearsal pass can reopen the exact Workbench reading
without adding another capture surface, contrasting this continuity loop with
the run-12 shell retrieval and run-13 pass comparison.
