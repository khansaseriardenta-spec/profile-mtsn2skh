(()=>{
const $=(s,r=document)=>r.querySelector(s),C=window.CONFIG,esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ico=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const empty=(t,n="trophy")=>`<div class="empty">${ico(n)}<p>${t}</p></div>`;
const card=(x,body)=>`<article class="card rv"><img src="${x.i}" alt="${esc(x.t)}" loading="lazy"${x.p?` style="object-position:${x.p}"`:""}><div class="card-b">${body}</div></article>`;

// Navigasi mobile
const burger=$(".burger"),menu=$("#menu");
burger.onclick=()=>{const o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o);$("use",burger).setAttribute("href",o?"#i-x":"#i-menu")};
menu.addEventListener("click",e=>{if(e.target.tagName==="A"){menu.classList.remove("open");burger.setAttribute("aria-expanded",false)}});

// Ekskul
$("#ekskul-list").innerHTML=EKSKUL.map(x=>card(x,`<h3>${esc(x.t)}</h3><p class="meta">${esc(x.d)}</p>`)).join("");

// Prestasi: cari + filter tahun/bidang/tingkat
const opt=(el,label,vals)=>el.innerHTML=`<option value="">${label}</option>`+vals.map(v=>`<option>${v}</option>`).join("");
const uniq=k=>[...new Set(PRESTASI.map(p=>p[k]).filter(Boolean))];
opt($("#fy"),"Semua tahun",uniq("y").sort((a,b)=>b-a));opt($("#fb"),"Semua bidang",uniq("b"));opt($("#fl"),"Semua tingkat",uniq("l"));
function renderPrestasi(){
  const q=$("#q").value.toLowerCase(),y=$("#fy").value,b=$("#fb").value,l=$("#fl").value;
  const r=PRESTASI.filter(p=>(!q||p.t.toLowerCase().includes(q))&&(!y||p.y==y)&&(!b||p.b===b)&&(!l||p.l===l));
  $("#prestasi-list").innerHTML=r.length?r.map(p=>card(p,`<span class="tag">${p.b}</span><h3>${esc(p.t)}</h3><p class="meta">${p.l||"Tingkat menyusul"} · ${p.y||"Tahun menyusul"}</p>`)).join(""):empty("Tidak ada prestasi yang cocok dengan filter.");
  reveal();
}
["#q","#fy","#fb","#fl"].forEach(s=>$(s).addEventListener("input",renderPrestasi));

// Berita: filter kategori
const cats=["Semua",...new Set(BERITA.map(b=>b.c))];let cat="Semua";
function renderBerita(){
  $("#berita-chips").innerHTML=cats.map(c=>`<button aria-pressed="${c===cat}">${c}</button>`).join("");
  const r=BERITA.filter(b=>cat==="Semua"||b.c===cat);
  $("#berita-list").innerHTML=r.map(b=>card(b,`<span class="tag">${b.c}</span><h3>${esc(b.t)}</h3><p class="meta">${esc(b.s)}</p>`)).join("");
  reveal();
}
$("#berita-chips").onclick=e=>{if(e.target.tagName==="BUTTON"){cat=e.target.textContent;renderBerita()}};

// Galeri + lightbox
$("#galeri-list").innerHTML=GALERI.map((g,i)=>`<button class="rv" data-i="${i}" aria-label="Perbesar: ${esc(g.t)}"><img src="${g.i}" alt="${esc(g.t)}" loading="lazy"></button>`).join("");
const lb=$("#lb");
$("#galeri-list").onclick=e=>{const b=e.target.closest("button");if(!b)return;const g=GALERI[b.dataset.i];$("img",lb).src=g.i;$("img",lb).alt=g.t;$("p",lb).textContent=g.t;lb.showModal()};
$(".lb-x").onclick=()=>lb.close();lb.onclick=e=>{if(e.target===lb)lb.close()};

// Video YouTube
$("#video-list").innerHTML=C.youtube.length?`<div class="vid">${C.youtube.map(v=>{v=typeof v==="string"?{id:v,t:"Video kegiatan"}:v;return `<figure class="rv"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}" title="${esc(v.t)}" allowfullscreen></iframe><figcaption>${esc(v.t)}</figcaption></figure>`}).join("")}</div>`+(C.channel?`<p class="mt"><a class="link" target="_blank" rel="noopener" href="${esc(C.channel)}">Lihat semua video di YouTube ${ico("arrow")}</a></p>`:""):empty("Video resmi madrasah belum ditambahkan. Isi di js/config.js.","play");

// Kontak, WhatsApp
$("#c-alamat").textContent=C.alamat;
$("#c-tel").textContent=C.telepon||"Nomor telepon belum diisi (js/config.js)";
$("#c-mail").textContent=C.email||"Email belum diisi (js/config.js)";
if(C.wa)["#wa","#wa-ppdb"].forEach(s=>{const a=$(s);a.href="https://wa.me/"+C.wa+"?text="+encodeURIComponent("Assalamu'alaikum, saya ingin bertanya tentang MTsN 2 Sukoharjo.");a.target="_blank";a.rel="noopener"});
$("#yr").textContent=new Date().getFullYear();

// Animasi masuk berurutan (jeda 100 ms)
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
function reveal(){document.querySelectorAll(".rv:not(.in)").forEach(el=>{const sib=[...el.parentElement.children].indexOf(el);el.style.setProperty("--d",Math.min(sib,6)*100+"ms");io.observe(el)})}

// Menu aktif
const links=[...menu.querySelectorAll("a:not(.btn)")],so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("main section[id]").forEach(s=>so.observe(s));
renderPrestasi();renderBerita();reveal();
})();
