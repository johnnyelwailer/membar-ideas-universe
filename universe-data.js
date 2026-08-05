(function exposeUniverseData(global) {
  const recentNodes = [
    { id: 'correction', title: 'Timestamp-linked correction', hypothesis: 'A display-only correction inside the source strip can preserve trust in the performed word.', state: 'in-strip test', date: '27 Jul 2026', day: 27, version: 'v02', last_touched: '27 Jul 2026', change_type: 'updated', category: 'live memory', edges: ['Song Workbench', 'Source Workbench', 'Phonetic Memory', 'Direct source scrub'], link: '#correction' },
    { id: 'live', title: 'Cue as a quiet section', hypothesis: 'One adaptive Cue can offer the next useful thing without hijacking a performance.', state: 'canonical', date: '12 Jul 2026', day: 12, version: 'v03', last_touched: '12 Jul 2026', change_type: 'stable', category: 'live', edges: ['Live Session', 'Rhyme Compass', 'Structure Lens'], link: '#universe' },
    { id: 'galaxy', title: 'Galaxy at hundreds of ideas', hypothesis: 'Spatial scale should create discovery while every node still leads to a concrete action.', state: 'exploration', date: '17 Jul 2026', day: 17, version: 'v02', last_touched: '17 Jul 2026', change_type: 'stable', category: 'memory', edges: ['Memory Archive', 'Home', 'Source Workbench'], link: '#universe' },
    { id: 'artboard', title: 'Six visual worlds', hypothesis: 'Materially different artboard mechanics reveal the right role for taste and source imagery.', state: 'direction set', date: '17 Jul 2026', day: 17, version: 'v01', last_touched: '17 Jul 2026', change_type: 'stable', category: 'visual', edges: ['Artboard', 'Memory Archive'], link: 'artboard-constellation.html' },
    { id: 'home', title: 'One calm invitation', hypothesis: 'A single source-backed invitation can balance progress, discovery, and memory.', state: 'continuity test', date: '22 Jul 2026', day: 22, version: 'v02', last_touched: '22 Jul 2026', change_type: 'updated', category: 'memory', edges: ['Source Workbench', 'Memory Archive', 'Live Session'], link: 'source-video-workbench.html' },
    { id: 'source', title: 'Source + lyric chord layout', hypothesis: 'A source frame, lyric, chord, and section should stay legible on one persistent surface.', state: 'cue bridge', date: '23 Jul 2026', day: 23, version: 'v03', last_touched: '23 Jul 2026', change_type: 'updated', category: 'live', edges: ['Source Workbench', 'Live Session', 'Structure Lens'], link: 'source-video-workbench.html' },
    { id: 'source-strip', title: 'Direct source scrub', hypothesis: 'A synchronized source strip can shorten the path from seeing a moment to revisiting it exactly.', state: 'exact retrieval', date: '24 Jul 2026', day: 24, version: 'v04', last_touched: '24 Jul 2026', change_type: 'new', category: 'live', edges: ['Source Workbench', 'Memory Archive', 'Live Session'], link: 'source-video-workbench.html' },
    { id: 'source-layout', title: 'Evidence deck', hypothesis: 'A split source frame and reading lane can make whole-take section comparison faster.', state: 'section compare', date: '29 Jul 2026', day: 29, version: 'v01', last_touched: '29 Jul 2026', change_type: 'new', category: 'live', edges: ['Source Workbench', 'Direct source scrub', 'Structure Lens'], link: 'source-layout.html' },
    { id: 'constellation', title: 'Audio-visual constellation', hypothesis: 'Dragging a source moment into orbit and pinning one synthetic reading makes visual direction feel like a reversible song-making action rather than a gallery.', state: 'orbit study', date: '31 Jul 2026', day: 31, version: 'v01', last_touched: '31 Jul 2026', change_type: 'new', category: 'visual', edges: ['Six visual worlds', 'Memory Archive', 'Direct source scrub'], link: 'artboard-constellation.html' },
    { id: 'live-continuity', title: 'Live rehearsal continuity', hypothesis: 'A kept source moment can anchor two reversible rehearsal passes and return the chosen pass to Workbench without losing provenance.', state: 'continuity study', date: '05 Aug 2026', day: 5, version: 'v01', last_touched: '05 Aug 2026', change_type: 'new', category: 'live', edges: ['Live Session', 'Source Workbench', 'Song Workbench', 'Memory Archive'], link: 'live-session-continuity.html' },
    { id: 'workbench', title: 'Song Workbench', hypothesis: 'Every performed word should remain editable without losing source evidence.', state: 'canonical flow', date: '10 Jul 2026', day: 10, version: 'v03', last_touched: '10 Jul 2026', change_type: 'stable', category: 'live', edges: ['Live Session', 'Memory Archive', 'Timestamp-linked correction'], link: '#correction' },
    { id: 'archive', title: 'Memory Archive', hypothesis: 'Automatic indexing should resurface strong fragments without asking the artist to maintain a library.', state: 'source-backed', date: '14 Jul 2026', day: 14, version: 'v02', last_touched: '14 Jul 2026', change_type: 'stable', category: 'memory', edges: ['Home', 'Galaxy at hundreds of ideas', 'Source Workbench'], link: '#universe' },
    { id: 'phonetics', title: 'Phonetic Memory', hypothesis: 'Remembered pronunciation evidence can improve future correction without rewriting past takes.', state: 'evidence layer', date: '15 Jul 2026', day: 15, version: 'v01', last_touched: '15 Jul 2026', change_type: 'needs-review', category: 'live', edges: ['Timestamp-linked correction', 'Memory Archive'], link: '#correction' },
    { id: 'structure', title: 'Structure Lens', hypothesis: 'Sections should emerge from performed evidence rather than being imposed before a take.', state: 'section map', date: '16 Jul 2026', day: 16, version: 'v01', last_touched: '16 Jul 2026', change_type: 'needs-review', category: 'live', edges: ['Live Session', 'Source Workbench', 'Cue as a quiet section'], link: '#universe' },
    { id: 'rhymes', title: 'Rhyme Compass', hypothesis: 'A single timely word offer is more useful than a wall of generated lines.', state: 'exploration', date: '11 Jul 2026', day: 11, version: 'v02', last_touched: '11 Jul 2026', change_type: 'stable', category: 'visual', edges: ['Cue as a quiet section', 'Live Session'], link: '#universe' },
  ];

  const generatedNodes = Array.from({ length: 88 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    const clusters = ['archive', 'live', 'memory', 'visual'];
    const cluster = clusters[index % clusters.length];
    const changeType = 'stable';
    const day = (index % 28) + 1;
    return {
      id: `archive-${number}`,
      title: `${cluster === 'live' ? 'Take' : cluster === 'visual' ? 'Texture' : 'Recovered'} thread ${number}`,
      hypothesis: `Synthetic ${cluster} thread ${number} waits for a source-backed relationship to become useful.`,
      state: changeType === 'needs-review' ? 'needs a decision' : changeType === 'new' ? 'new fragment' : 'quiet archive',
      date: '2026', version: `v${(index % 3) + 1}`, day, last_touched: `${String(day).padStart(2, '0')} Jul 2026`, change_type: changeType, category: cluster,
      edges: [recentNodes[index % recentNodes.length].title, recentNodes[(index + 3) % recentNodes.length].title], link: '#universe',
    };
  });

  const universe = [...recentNodes, ...generatedNodes];
  const recentIds = recentNodes.map((node) => node.id);

  global.MembarUniverseData = Object.freeze({ recentNodes, generatedNodes, universe, recentIds });
})(typeof window === 'undefined' ? globalThis : window);
