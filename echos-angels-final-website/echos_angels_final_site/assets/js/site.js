
const DEFAULT_PATH = "content.json";
let DATA = null;
let activeAdminTab = "site";

async function loadData(){
  try{
    const res = await fetch(DEFAULT_PATH + "?v=" + Date.now());
    DATA = await res.json();
  }catch(err){
    console.warn("Could not load content.json. Using embedded fallback so the site still works when opened directly.", err);
    const fallbackTag = document.getElementById("fallbackData");
    try { DATA = fallbackTag ? JSON.parse(fallbackTag.textContent) : {}; }
    catch(e){ DATA = {}; }
  }
  const local = localStorage.getItem("echosAngelsDraft");
  if(local){
    try{ DATA = JSON.parse(local); }catch(e){}
  }
  renderSite();
  buildAdmin();
}

function $(sel, root=document){ return root.querySelector(sel); }
function el(tag, cls){ const x=document.createElement(tag); if(cls)x.className=cls; return x; }
function safeArr(v){ return Array.isArray(v)?v:[]; }
function enabled(item){ return item && item.enabled !== false; }

function renderSite(){
  document.title = DATA.seo?.title || "Echo's Angels Dog Training";
  const metaDesc = document.querySelector('meta[name="description"]');
  if(metaDesc) metaDesc.content = DATA.seo?.description || "";

  $("#brandName").textContent = DATA.site?.businessName || "Echo's Angels";
  $("#brandSub").textContent = DATA.site?.subtitle || "Dog Training";
  $("#brandLogo").src = DATA.images?.logo || "assets/images/logo-placeholder.svg";
  $("#footerName").textContent = DATA.site?.businessName || "Echo's Angels";
  $("#footerText").textContent = `${DATA.site?.subtitle || "Dog Training"} • ${DATA.site?.serviceArea || ""}`;

  $("#heroEyebrow").textContent = DATA.home?.eyebrow || "";
  $("#heroTitle").textContent = DATA.home?.title || "";
  $("#heroScript").textContent = DATA.home?.script || "";
  $("#heroBody").textContent = DATA.home?.body || "";
  $("#heroPrimary").textContent = DATA.home?.primaryButton || "Contact";
  $("#heroSecondary").textContent = DATA.home?.secondaryButton || "Services";

  renderNav(); renderHeroSlides(); renderValues(); renderAbout(); renderServices();
  renderGallery(); renderTestimonials(); renderFAQ(); renderContact(); renderSocials();
  applySectionVisibility();
}

function renderNav(){
  const nav=$("#navLinks");
  nav.querySelectorAll("[data-dynamic-nav]").forEach(n=>n.remove());
  const settings=$("#settingsBtn");
  safeArr(DATA.nav).forEach(name=>{
    const a=el("a"); a.dataset.dynamicNav="1"; a.href = "#" + name.toLowerCase().replaceAll(" ","-"); a.textContent=name;
    nav.insertBefore(a, settings);
  });
}

let slideTimer=null;
function renderHeroSlides(){
  const box=$("#heroSlides"); box.innerHTML="";
  const slides = safeArr(DATA.images?.heroSlides);
  (slides.length?slides:["assets/images/hero-1.svg"]).forEach((src,i)=>{
    const s=el("div","hero-slide"+(i===0?" active":"")); s.style.backgroundImage=`url("${src}")`; box.appendChild(s);
  });
  clearInterval(slideTimer);
  slideTimer=setInterval(()=>{
    const all=[...document.querySelectorAll(".hero-slide")]; if(all.length<2)return;
    const cur=all.findIndex(x=>x.classList.contains("active"));
    all[cur].classList.remove("active"); all[(cur+1)%all.length].classList.add("active");
  }, 5200);
}

function renderValues(){
  const box=$("#values"); box.innerHTML="";
  safeArr(DATA.home?.values).forEach(v=>{
    const item=el("div","value");
    item.innerHTML=`<div class="value-icon">${v.icon||"🐾"}</div><div><h3>${v.title||""}</h3><p>${v.text||""}</p></div>`;
    box.appendChild(item);
  });
}
function renderAbout(){
  $("#aboutTitle").textContent=DATA.about?.title||"About";
  $("#aboutScript").textContent=DATA.about?.script||"";
  $("#aboutImage").src=DATA.images?.aboutImage||"assets/images/about-placeholder.svg";
  const pbox=$("#aboutParagraphs"); pbox.innerHTML="";
  safeArr(DATA.about?.paragraphs).forEach(p=>{const pe=el("p"); pe.textContent=p; pbox.appendChild(pe);});
  $("#aboutCallout").textContent=DATA.about?.callout||"";
}
function renderServices(){
  const box=$("#servicesGrid"); box.innerHTML="";
  safeArr(DATA.services).filter(enabled).forEach(s=>{
    const c=el("article","card");
    c.innerHTML=`<img src="${s.image||"assets/images/service-obedience.svg"}" alt=""><div class="card-body"><h3>${s.title||""}</h3><p>${s.text||""}</p></div>`;
    box.appendChild(c);
  });
}
function renderGallery(){
  const box=$("#galleryGrid"); box.innerHTML="";
  safeArr(DATA.gallery).filter(enabled).forEach(g=>{
    const item=el("div","gallery-item");
    item.innerHTML=`<img src="${g.src||"assets/images/gallery-1.svg"}" alt=""><div class="caption">${g.caption||""}</div>`;
    box.appendChild(item);
  });
}
function renderTestimonials(){
  const box=$("#testimonialsGrid"); box.innerHTML="";
  safeArr(DATA.testimonials).filter(enabled).forEach(t=>{
    const q=el("div","quote");
    q.innerHTML=`<p>“${t.quote||""}”</p><strong>${t.name||""}</strong>`;
    box.appendChild(q);
  });
}
function renderFAQ(){
  const box=$("#faqList"); box.innerHTML="";
  safeArr(DATA.faq).filter(enabled).forEach(f=>{
    const item=el("div","faq-item");
    item.innerHTML=`<button class="faq-q">${f.q||""}</button><div class="faq-a">${f.a||""}</div>`;
    item.querySelector("button").onclick=()=>item.classList.toggle("open");
    box.appendChild(item);
  });
}
function renderContact(){
  $("#contactTitle").textContent="Let's Train Together";
  $("#contactEmail").textContent=DATA.site?.email||"";
  $("#contactArea").textContent=DATA.site?.serviceArea||"";
  $("#quickEmail").href=`mailto:${DATA.site?.email||""}`;
  $("#quickEmail").textContent = DATA.site?.email ? "Email " + DATA.site.email : "Email Directly";
  $("#mobileEmail").href=`mailto:${DATA.site?.email||""}`;
  const phone=DATA.site?.phone||"";
  $("#mobileCall").href=phone?`tel:${phone.replace(/[^+\d]/g,"")}`:"#contact";
  $("#mobileCall").textContent=phone?"Call":"Contact";
}
function renderSocials(){
  const box=$("#socialLinks"); box.innerHTML="";
  Object.entries(DATA.socials||{}).forEach(([k,v])=>{ if(v){const a=el("a"); a.href=v; a.target="_blank"; a.rel="noopener"; a.textContent=k; box.appendChild(a);} });
}
function applySectionVisibility(){
  Object.entries(DATA.sections||{}).forEach(([k,v])=>{
    const sec = document.querySelector(`[data-section="${k}"]`);
    if(sec) sec.style.display = v ? "" : "none";
  });
}

function submitTrainingForm(e){
  e.preventDefault();
  const f=e.target;
  const endpoint = DATA.form?.useFormspree ? DATA.form?.formspreeEndpoint : "";
  if(endpoint){
    f.action=endpoint; f.method="POST"; f.submit(); return;
  }
  const parts = [
    `Name: ${f.name.value}`,
    `Email: ${f.email.value}`,
    `Phone: ${f.phone.value}`,
    `Dog: ${f.dog.value}`,
    `Goals: ${f.message.value}`
  ];
  const subject=encodeURIComponent(DATA.form?.emailSubject||"New training inquiry");
  const body=encodeURIComponent(parts.join("\n"));
  window.location.href=`mailto:${DATA.site?.email}?subject=${subject}&body=${body}`;
}

function toggleMenu(){ $("#navLinks").classList.toggle("open"); }
function openAdmin(){
  const saved = sessionStorage.getItem("eaAdminOK");
  if(!saved){
    const pass = prompt("Admin password hint: change this before launch. Default is echo");
    if(pass !== "echo"){ alert("Not unlocked."); return; }
    sessionStorage.setItem("eaAdminOK","1");
  }
  $("#adminPanel").classList.add("open"); buildAdmin();
}
function closeAdmin(){ $("#adminPanel").classList.remove("open"); }

function buildAdmin(){
  const box=$("#adminContent"); if(!box || !DATA) return; box.innerHTML="";
  document.querySelectorAll(".admin-tabs button").forEach(b=>b.classList.toggle("active", b.dataset.tab===activeAdminTab));
  if(activeAdminTab==="site") buildSiteAdmin(box);
  if(activeAdminTab==="home") buildHomeAdmin(box);
  if(activeAdminTab==="services") buildListAdmin(box,"services",["title","text","image","enabled"]);
  if(activeAdminTab==="gallery") buildListAdmin(box,"gallery",["src","caption","enabled"]);
  if(activeAdminTab==="faq") buildListAdmin(box,"faq",["q","a","enabled"]);
  if(activeAdminTab==="socials") buildObjectAdmin(box,"socials",DATA.socials);
  if(activeAdminTab==="sections") buildObjectAdmin(box,"sections",DATA.sections,true);
  if(activeAdminTab==="seo") buildObjectAdmin(box,"seo",DATA.seo);
  if(activeAdminTab==="images") buildImagesAdmin(box);
}
function input(label,value,onchange,type="text"){
  const l=el("label"); l.textContent=label; const i= type==="textarea"?el("textarea"):el("input"); i.type=type==="checkbox"?"checkbox":"text";
  if(type==="checkbox"){ i.checked=!!value; i.onchange=()=>onchange(i.checked); }
  else { i.value=value||""; i.oninput=()=>onchange(i.value); }
  return [l,i];
}
function buildSiteAdmin(box){
  box.appendChild(hint("These are the public business details. Leave phone blank if you don't want it public yet."));
  ["businessName","subtitle","email","phone","serviceArea","tagline"].forEach(k=>{ const [l,i]=input(k,DATA.site[k],v=>DATA.site[k]=v); box.append(l,i); });
}
function buildHomeAdmin(box){
  ["eyebrow","title","script","body","primaryButton","secondaryButton"].forEach(k=>{ const [l,i]=input(k,DATA.home[k],v=>DATA.home[k]=v,k==="body"?"textarea":"text"); box.append(l,i); });
}
function buildObjectAdmin(box,name,obj,booleans=false){
  Object.keys(obj||{}).forEach(k=>{ const [l,i]=input(k,obj[k],v=>obj[k]=v,booleans?"checkbox":"text"); box.append(l,i); });
}
function buildImagesAdmin(box){
  box.appendChild(hint("Put real photos in assets/images, then use paths like assets/images/echo-training.jpg. Hero slides are comma-separated."));
  ["logo","pixelEcho","aboutImage"].forEach(k=>{ const [l,i]=input(k,DATA.images[k],v=>DATA.images[k]=v); box.append(l,i); });
  const [l,i]=input("heroSlides", safeArr(DATA.images.heroSlides).join(", "), v=>DATA.images.heroSlides=v.split(",").map(x=>x.trim()).filter(Boolean), "textarea"); box.append(l,i);
}
function buildListAdmin(box,name,fields){
  const arr=DATA[name]||[];
  arr.forEach((item,idx)=>{
    const wrap=el("div","admin-item");
    wrap.innerHTML=`<strong>${name} item ${idx+1}</strong>`;
    fields.forEach(k=>{
      const type = k==="enabled" ? "checkbox" : (k==="text"||k==="a"||k==="quote" ? "textarea":"text");
      const [l,i]=input(k,item[k],v=>item[k]=v,type); wrap.append(l,i);
    });
    const row=el("div","admin-actions");
    const up=button("↑",()=>{ if(idx>0){ [arr[idx-1],arr[idx]]=[arr[idx],arr[idx-1]]; buildAdmin(); }});
    const down=button("↓",()=>{ if(idx<arr.length-1){ [arr[idx+1],arr[idx]]=[arr[idx],arr[idx+1]]; buildAdmin(); }});
    const del=button("Delete",()=>{ if(confirm("Delete this item?")){ arr.splice(idx,1); buildAdmin(); }}, "danger");
    row.append(up,down,del); wrap.appendChild(row); box.appendChild(wrap);
  });
  box.appendChild(button("Add Item",()=>{ const n={enabled:true}; fields.forEach(f=>{ if(f!=="enabled") n[f]=""; }); arr.push(n); DATA[name]=arr; buildAdmin(); }, "save"));
}
function button(text,fn,cls=""){ const b=el("button",cls); b.textContent=text; b.onclick=fn; return b; }
function hint(text){ const d=el("div","hint"); d.textContent=text; return d; }

function saveDraft(){ localStorage.setItem("echosAngelsDraft", JSON.stringify(DATA)); renderSite(); alert("Saved as a browser draft. Export content.json to make it ready for upload."); }
function clearDraft(){ if(confirm("Clear browser draft and reload content.json?")){ localStorage.removeItem("echosAngelsDraft"); location.reload(); } }
function exportJSON(){
  const blob=new Blob([JSON.stringify(DATA,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="content.json"; a.click();
}
function importJSON(ev){
  const file=ev.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{ try{ DATA=JSON.parse(reader.result); saveDraft(); buildAdmin(); }catch(e){ alert("That JSON file did not import correctly."); } };
  reader.readAsText(file);
}
function runChecks(){
  const issues=[];
  if(!DATA.site?.email) issues.push("Missing public email.");
  if(!safeArr(DATA.services).filter(enabled).length) issues.push("No enabled services.");
  if(!safeArr(DATA.gallery).filter(enabled).length) issues.push("No enabled gallery images.");
  if((DATA.site?.phone||"").trim()==="") issues.push("Phone is blank — okay if intentional.");
  const links=Object.values(DATA.socials||{}).filter(Boolean);
  if(!links.length) issues.push("No social links added yet.");
  alert(issues.length ? "Launch check notes:\n\n- "+issues.join("\n- ") : "Looks good for a simple launch.");
}

document.addEventListener("click", e=>{
  if(e.target.matches(".admin-tabs button")){ activeAdminTab=e.target.dataset.tab; buildAdmin(); }
});
window.addEventListener("DOMContentLoaded", loadData);
