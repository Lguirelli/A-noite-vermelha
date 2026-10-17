/* Optional browser integration test: install playwright or set ANV_PLAYWRIGHT_PATH. */
const {chromium}=require(process.env.ANV_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const base=process.env.ANV_BASE_URL||'http://127.0.0.1:8766';
const out=path.resolve(__dirname,'../../verificacao');fs.mkdirSync(out,{recursive:true});
(async()=>{
 let server;
 if(!process.env.ANV_BASE_URL){
  const root=path.resolve(__dirname,'..');
  server=require('node:http').createServer((req,res)=>{
   let url=new URL(req.url,base).pathname;
   if(url==='/table'){res.writeHead(307,{Location:'/mesa/index.html'});res.end();return;}
   url=({'/':'/index.html','/play':'/index.html','/game':'/index.html','/gm':'/gm.html'})[url]||url;
   const target=path.resolve(root,'.'+decodeURIComponent(url));
   if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
   fs.readFile(target,(error,data)=>{if(error){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'})[path.extname(target)]||'application/octet-stream');res.end(data);});
  });
  await new Promise(resolve=>server.listen(8766,'127.0.0.1',resolve));
 }
 const browser=await chromium.launch({headless:true,...(process.env.ANV_BROWSER_PATH?{executablePath:process.env.ANV_BROWSER_PATH}:{})});
 const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 const click=async id=>page.locator(`[data-action="${id}"]`).click();
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('anv_campaign_v3')));
 await page.goto(base+'/');await page.getByRole('heading',{name:'A Noite Vermelha',exact:true}).waitFor();
 assert.equal(await page.locator('body').innerText().then(t=>/Vilar|Helena|Tião era/.test(t)),false);
 await page.screenshot({path:path.join(out,'01-inicio-desktop.png'),fullPage:true});
 await click('begin');await click('listen');await click('cup');await click('witness');
 for(const a of ['mask','flame','heart','scent'])await click(a);
 await page.locator('details.notes summary').click();await page.locator('#notes').fill('Conferir a cerca e comparar os cheiros.');
 await page.reload();assert.equal((await read()).scene,'cell');assert.equal(await page.locator('#notes').inputValue(),'Conferir a cerca e comparar os cheiros.');
 for(const a of ['road','oct','dam','bal','tur','doubt','sleep','receipt','rest','farm','track','hands','time','aid','registry'])await click(a);
 assert.equal((await read()).book_known_as_pact_registry,true);
 await page.screenshot({path:path.join(out,'02-livro-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.join(out,'03-livro-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1000});
 for(const a of ['copy','marks','joaquim','copy','bento','arm','back','rosa','copy','compare','check','connect','routes','theater','echo','hunter','back','helena','letter','heart','back','bridge','eyes','smell','face','back','mill','question','copy','assemble','mask','choose','baltazar','stand'])await click(a);
 const beforeFinal=await read();
 for(const end of ['destroy','bind','leave','give']){
  await page.evaluate(s=>localStorage.setItem('anv_campaign_v3',JSON.stringify(s)),beforeFinal);await page.reload();await click(end);assert.equal((await read()).ending,end);
 }
 await page.locator('#menuButton').click();
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const savePath=path.join(out,'teste-salvamento.json');await download.saveAs(savePath);
 assert.equal(JSON.parse(fs.readFileSync(savePath,'utf8')).ending,'give');
 await page.locator('#reset').click();await page.locator('#cancelConfirm').click();assert.equal((await read()).ending,'give');
 await page.locator('#reset').click();await page.locator('#acceptConfirm').click();assert.equal((await read()).scene,'start');
 await page.locator('#menuButton').click();await page.locator('#import').setInputFiles(savePath);await page.locator('#acceptConfirm').click();assert.equal((await read()).ending,'give');
 await page.goto(base+'/gm.html');assert.equal(await page.locator('#gmContent').isVisible(),false);await page.locator('#revealGM').click();assert.ok((await page.locator('#gmContent').innerText()).includes('CONCLUÍDO'));
 await page.goto(base+'/');await page.locator('#menuButton').click();await page.locator('#reset').click();await page.locator('#acceptConfirm').click();
 for(const a of ['begin','push','resist','road','sleep','farm','porch','fire','finish','take'])await click(a);
 assert.equal((await read()).book_known_as_pact_registry,false);assert.equal((await read()).farm_pact_closed,true);
 for(const a of ['marks','bento','back','rosa','copy','joaquim','copy','compare','connect','routes','helena','back','theater','back','bridge','back','mill','accept','assemble','exit','choose','burn','stand','leave'])await click(a);
 assert.equal((await read()).ending,'leave');
 await page.goto(base+'/mesa/index.html');await page.locator('#mapWorld').waitFor();await page.locator('[data-die="20"]').click();assert.match(await page.locator('#rollResult').innerText(),/^\d+$/);
 await page.goto(base+'/game.html');await page.waitForURL('**/index.html');
 // Offline opening must also work without a server or network assets.
 const offline=await browser.newContext({viewport:{width:390,height:844}});await offline.setOffline(true);
 const local=await offline.newPage();local.on('pageerror',e=>errors.push(e.message));
 await local.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);await local.locator('[data-action="begin"]').click();await local.reload();await local.getByRole('heading',{name:'Quatro lugares à mesa'}).waitFor();
 assert.ok(await local.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Storage unavailable: visible warning, still playable and exportable.
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('storage blocked')}});});
 const blockedPage=await blocked.newPage();blockedPage.on('pageerror',e=>errors.push(e.message));await blockedPage.goto(base+'/');await blockedPage.locator('[data-action="begin"]').click();assert.equal(await blockedPage.locator('#saveWarning').isVisible(),true);
 assert.deepEqual(errors,[]);
 const summary={passed:true,checks:['Root opens game','No opening spoilers','Cell actions and reload persistence','Notes saved','Peaceful farm','Mobile width 390px','All four endings','Export/import/reset confirmation','GM spoiler gate','Violent farm to ending','Legacy map and dice','game.html alias','Offline file opening and reload','Blocked storage warning'],browser:'Chromium',consoleErrors:errors};
 fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));await browser.close();if(server)server.close();
})().catch(e=>{console.error(e);process.exit(1)});
