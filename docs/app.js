const groups={open:new Set(["open","closing-soon"]),upcoming:new Set(["upcoming"]),watch:new Set(["awarded","award-watch","watch"])};
const list=document.querySelector("#program-list");
const esc=value=>String(value??"").replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
const label=value=>value.replaceAll("-"," ");

function card(program){
  return `<article class="program" data-status="${esc(program.status)}">
    <div class="program-top"><div><p class="state">${esc(program.state)}</p><h3>${esc(program.program)}</h3></div><span class="status ${esc(program.status)}">${esc(label(program.status))}</span></div>
    <dl>
      <dt>Opens</dt><dd>${esc(program.opens)}</dd>
      <dt>Deadline</dt><dd>${esc(program.deadline)}</dd>
      <dt>Funding</dt><dd>${esc(program.funding)}</dd>
      <dt>Max award</dt><dd>${esc(program.max_award)}</dd>
      <dt>Match</dt><dd>${esc(program.match)}</dd>
    </dl>
    <p class="signal">${esc(program.mapping_signal)}</p>
    <a class="source" href="${esc(program.source_url)}" rel="noopener">Official source</a>
  </article>`;
}

function applyFilter(programs,filter){
  const visible=filter==="all"?programs:programs.filter(item=>groups[filter]?.has(item.status));
  list.innerHTML=visible.map(card).join("")||"<p>No programs match this filter.</p>";
}

fetch("../data/programs.json")
  .then(response=>{if(!response.ok)throw new Error("Program data unavailable");return response.json();})
  .then(data=>{
    const programs=data.programs;
    document.querySelector("#verified").textContent=`${programs.length} programs · sources last verified ${data.last_verified}`;
    document.querySelector("#open-count").textContent=programs.filter(item=>groups.open.has(item.status)).length;
    document.querySelector("#upcoming-count").textContent=programs.filter(item=>groups.upcoming.has(item.status)).length;
    document.querySelector("#tracked-count").textContent=programs.length;
    applyFilter(programs,"all");
    document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
      document.querySelectorAll(".filter").forEach(item=>item.classList.toggle("active",item===button));
      applyFilter(programs,button.dataset.status);
    }));
  })
  .catch(error=>{list.innerHTML=`<p>${esc(error.message)}. Use the GitHub data file while this page is restored.</p>`;});
