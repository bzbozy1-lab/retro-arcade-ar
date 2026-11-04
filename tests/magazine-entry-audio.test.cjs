const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(on=false,blocked=false,reader=false){const events={},pageEvents={},clips=[],state={enabled:on};const doc={body:{appendChild(){}},currentScript:{hasAttribute:()=>reader},readyState:'complete',hidden:false,addEventListener:(n,f)=>events[n]=f};class Clip{constructor(src){this.src=src;this.calls=0;this.pauses=0;clips.push(this)}play(){this.calls++;return blocked?Promise.reject(new Error('NotAllowedError')):Promise.resolve()}pause(){this.pauses++}}
vm.runInNewContext(fs.readFileSync('assets/magazine-entry-audio.js','utf8'),{Audio:Clip,document:doc,window:{CartoAudio:state,addEventListener:(n,f)=>pageEvents[n]=f}});return {state,doc,events,pageEvents,clips};}
const event=(toggle=false)=>({target:{closest:()=>null},composedPath:()=>toggle?[{matches:()=>true}]:[]}),tick=()=>new Promise(r=>setImmediate(r));
test('magazine clip stays unloaded by default, plays once after explicit enabling, and mute/hide/pagehide stop it',async()=>{const x=setup();assert.equal(x.clips.length,0);x.events.pointerdown(event());assert.equal(x.clips.length,0);x.state.enabled=true;x.events.click(event(true));await tick();assert.equal(x.clips.length,1);assert.equal(x.clips[0].calls,1);assert.equal(x.clips[0].loop,false);x.events.pointerdown(event());assert.equal(x.clips[0].calls,1);x.state.enabled=false;x.events.click(event(true));assert.equal(x.clips[0].pauses,1);assert.equal(x.clips[0].currentTime,0);x.doc.hidden=true;x.events.visibilitychange();x.pageEvents.pagehide();assert.equal(x.clips[0].pauses,3);});
test('stored opt-in attempts entry playback, denied autoplay retries only on interaction and never on mute',async()=>{const x=setup(true,true);await tick();assert.equal(x.clips[0].calls,1);x.events.pointerdown(event(true));assert.equal(x.clips[0].calls,1);x.events.keydown(event());await tick();assert.equal(x.clips[0].calls,2);x.state.enabled=false;x.events.click(event(true));x.events.pointerdown(event());assert.equal(x.clips[0].calls,2);});
test('the audio-only asset and loader are scoped to the magazine library, with no user-data writes',()=>{const bytes=fs.readFileSync('assets/sounds/magazine-entry.m4a');assert(bytes.length<60000);assert(bytes.includes(Buffer.from('mp4a')));assert(!bytes.includes(Buffer.from('avc1')));const html=fs.readFileSync('magazines.html','utf8');assert(html.includes('assets/magazine-entry-audio.js?v=trial-2'));assert(html.indexOf('assets/audio.js')<html.indexOf('assets/magazine-entry-audio.js'));for(const p of ['index.html','sakhr.html'])assert(!fs.readFileSync(p,'utf8').includes('magazine-entry-audio.js'));assert(!fs.readFileSync('assets/magazine-entry-audio.js','utf8').includes('localStorage'));});

test('reader cue waits for a valid issue, uses a separate audio asset, and plays once',async()=>{
 const x=setup(true,false,true);
 x.events.pointerdown(event());
 assert.equal(x.clips.length,0);
 x.events['carto:magazine-open']();
 await tick();
 assert.equal(x.clips[0].src,'assets/sounds/magazine-open.m4a');
 x.events.pointerdown(event());
 assert.equal(x.clips[0].calls,1);
 assert.match(fs.readFileSync('reader.html','utf8'),/magazine-entry-audio\.js[^>]+data-reader-cue/);
});
