(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],C=window.CONFIG,esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ico=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const empty=(t,n="trophy")=>`<div class="empty">${ico(n)}<p>${t}</p></div>`;
const card=(x,body)=>`<article class="card rv"><img referrerpolicy="no-referrer" src="${x.i}" alt="${esc(x.t)}" loading="lazy"${x.p?` style="object-position:${x.p}"`:""}><div class="card-b">${body}</div></article>`;

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
$("#galeri-list").innerHTML=GALERI.map((g,i)=>`<button class="rv" data-i="${i}" aria-label="Perbesar: ${esc(g.t)}"><img referrerpolicy="no-referrer" src="${g.i}" alt="${esc(g.t)}" loading="lazy"></button>`).join("");
const lb=$("#lb");
$("#galeri-list").onclick=e=>{const b=e.target.closest("button");if(!b)return;const g=GALERI[b.dataset.i];$("img",lb).src=g.i;$("img",lb).alt=g.t;$("p",lb).textContent=g.t;lb.showModal()};
$(".lb-x").onclick=()=>lb.close();lb.onclick=e=>{if(e.target===lb)lb.close()};

// Video YouTube: thumbnail dulu, iframe dimuat saat diklik. Video yang linknya mati disembunyikan otomatis.
const vids=C.youtube.map(v=>typeof v==="string"?{id:v,t:"Video kegiatan"}:v);
$("#video-list").innerHTML=vids.length?`<div class="vid">${vids.map(v=>`<figure class="rv" data-id="${esc(v.id)}"><button class="vthumb" type="button" aria-label="Putar: ${esc(v.t)}"><img referrerpolicy="no-referrer" src="https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg" alt="" loading="lazy"><span class="vplay">${ico("play")}</span></button><figcaption>${esc(v.t)}</figcaption></figure>`).join("")}</div>`+(C.channel?`<p class="mt"><a class="link" target="_blank" rel="noopener" href="${esc(C.channel)}">Lihat semua video di YouTube ${ico("arrow")}</a></p>`:""):empty("Video resmi madrasah belum ditambahkan. Isi di js/config.js.","play");
$$(".vid figure").forEach(f=>{
  const im=$("img",f),bad=()=>f.remove();
  im.addEventListener("error",bad);
  im.addEventListener("load",()=>{if(im.naturalWidth<=120)bad()}); // YouTube mengembalikan gambar 120px untuk video yang tidak ada
  $(".vthumb",f).onclick=()=>{const t=$(".vthumb",f);t.outerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(f.dataset.id)}?autoplay=1" title="${esc($("figcaption",f).textContent)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`};
});
// Foto yang gagal dimuat diganti placeholder netral
document.addEventListener("error",e=>{const t=e.target;if(t.tagName==="IMG"&&!t.dataset.fb&&!t.closest(".vthumb")){t.dataset.fb=1;t.src="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e8efe9"/><text x="400" y="310" text-anchor="middle" font-family="sans-serif" font-size="32" fill="#6b7f72">MTsN 2 Sukoharjo</text></svg>')}},true);

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
