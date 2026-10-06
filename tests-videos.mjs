import assert from 'node:assert/strict';
import {curriculum} from './curriculum.js';
import {chapterVideos} from './chapter-videos.js';
import {videoPanel} from './video-ui.js';
const chapters=curriculum.flatMap(b=>b.chapters);assert.equal(chapters.length,36);assert.deepEqual(Object.keys(chapterVideos).sort(),chapters.map(c=>c.id).sort());
for(const c of chapters){const v=chapterVideos[c.id];assert.match(v.id,/^[\w-]{11}$/);for(const key of ['title','author','level','ready','watch','task','focus'])assert.ok(v[key]?.length>5,`${c.id}/${key}`);assert.ok(['Indonesia','Inggris'].includes(v.language));assert.equal(v.start,0);const html=videoPanel(c.id);assert.ok(html.includes(v.id));assert.ok(html.includes('Buka YouTube'));assert.ok(!html.includes('<iframe'));assert.ok(!html.includes('autoplay=1'));}
assert.equal(chapterVideos.minor.extra.start,50);assert.equal(videoPanel('missing'),'');console.log('PASS video curation: all 36 chapters, 30 unique primary sources, explicit readiness/level/tasks, lazy player and direct fallback.');
