document.querySelector('#run').addEventListener('click',async()=>{
  const results=[],api=window.ProfessionalsLanguage,host=document.querySelector('#fixture');
  const initial=api.get();
  const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
  const check=(name,condition)=>results.push({name,passed:!!condition});
  try {
    api.set('en');
    host.innerHTML='<button id="action">Change design</button><p id="count">20 files</p><input id="copy" value="Change design"><textarea id="brief">Download ZIP</textarea><span id="customer" data-no-translate>Build the set</span><span id="editable" contenteditable="true">Change design</span><select id="selection"><option>Other</option><option selected>Too risky</option></select><input id="help" placeholder="Headline" aria-label="Button text"><button id="close" title="Close (Esc)" aria-label="Close">×</button><label><input id="chosen" type="checkbox" checked>Landing page draft</label><span data-en="History" data-de="Verlauf" id="marked">History</span>';
    const action=host.querySelector('#action'),selected=host.querySelector('#selection'),copy=host.querySelector('#copy');
    const originalValue=selected.value;
    let clicked=0;action.addEventListener('click',()=>clicked++);
    copy.focus();copy.setSelectionRange(2,5);
    api.set('de');await settle();
    check('Existing dynamic button is German',action.textContent==='Design ändern');
    check('Count is translated',host.querySelector('#count').textContent==='20 Dateien');
    check('Field value is untouched',copy.value==='Change design');
    check('Brief text is untouched',host.querySelector('#brief').value==='Download ZIP');
    check('Protected customer copy is untouched',host.querySelector('#customer').textContent==='Build the set');
    check('Editable text is untouched',host.querySelector('#editable').textContent==='Change design');
    check('Focus and selection survive',document.activeElement===copy&&copy.selectionStart===2&&copy.selectionEnd===5);
    check('Selected output survives',host.querySelector('#chosen').checked);
    check('Implicit option value is stable',selected.value===originalValue);
    check('Selected option label is German',selected.selectedOptions[0].textContent==='Zu riskant');
    check('Explicit translation still applies',host.querySelector('#marked').textContent==='Verlauf');
    check('Placeholder is German',host.querySelector('#help').placeholder==='Überschrift');
    check('Accessible label is German',host.querySelector('#close').getAttribute('aria-label')==='Schließen');
    action.click();check('Event listeners survive',clicked===1);
    const late=document.createElement('button');late.textContent='Download ZIP';host.append(late);
    await settle();check('Newly inserted control is translated',late.textContent==='ZIP herunterladen');
    host.querySelector('#count').textContent='21 files';await settle();
    check('Updated count is translated',host.querySelector('#count').textContent==='21 Dateien');
    api.set('en');await settle();
    check('English is restored on original nodes',action.textContent==='Change design');
    check('English is restored on newly inserted nodes',late.textContent==='Download ZIP');
    check('Latest number is preserved on round trip',host.querySelector('#count').textContent==='21 files');
    check('Accessible English is restored',host.querySelector('#close').getAttribute('aria-label')==='Close');
    check('Option value remains stable on round trip',selected.value===originalValue);
    api.set('de');await settle();
    check('Repeated switching stays correct',late.textContent==='ZIP herunterladen'&&host.querySelector('#count').textContent==='21 Dateien');
  } catch(error) {results.push({name:'Runtime failure',passed:false,error:error.message});}
  finally {api.set(initial);}
  const failures=results.filter(r=>!r.passed);
  document.querySelector('#results').textContent=JSON.stringify({checks:results.length,failures,results},null,2);
  document.querySelector('#status').textContent=`Complete · ${results.length} checks · ${failures.length} failures`;
});
