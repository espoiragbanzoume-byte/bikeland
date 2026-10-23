/* ====== Données du site Bike Land ====== */
/* true = cache un fond blanc ; false = images PNG à fond transparent (recommandé) */
const FOND_BLANC = false;

const DEVISE = "FCFA";
const GAMMES = {
  Classique: { heures: [1125, 2125, 3125, 3625], roadtrip: 2625 },
  Premium:   { heures: [1625, 3125, 4625, 5625], roadtrip: 3125 }
};
const DUREES = ["1 h", "2 h", "3 h", "4 h", "Road trip"];
const VELOS = [
  { nom: "Apollo", img: "images/apollo.png", gamme: "Premium",   resume: "VTT tout-suspendu, 21 vitesses, gris et rouge",
    populaire: true,  poids: "14 kg",   vitesses: "21", charge: "120 kg", auto: "60 km/jour",
    c1: "#5d626c", c2: "#17181b", cadre: "#c9ced6", accent: "#e0322e", susp: true },
  { nom: "Émeraude", img: "images/emeraude.png", gamme: "Classique", resume: "VTT dame, vert et noir, à cadre surbaissé",
    populaire: false, poids: "15 kg",   vitesses: "21", charge: "100 kg", auto: "30 km/jour",
    c1: "#13684b", c2: "#04150f", cadre: "#27d79a", accent: "#151617", bas: true },
  { nom: "Flamme", img: "images/flamme.png",   gamme: "Classique", resume: "Tout-suspendu rouge et jaune, freins à disque",
    populaire: false, poids: "16,5 kg", vitesses: "21", charge: "110 kg", auto: "45 km/jour",
    c1: "#d9342b", c2: "#4b0d0a", cadre: "#ffd21a", accent: "#ff3b30", susp: true, disque: true },
  { nom: "Glacier", img: "images/glacier.png",  gamme: "Premium",   resume: "Petit format en 24 pouces, pour les gabarits légers",
    populaire: true,  poids: "13 kg",   vitesses: "7",  charge: "85 kg",  auto: "25 km/jour",
    c1: "#6fa8d6", c2: "#123452", cadre: "#eef6ff", accent: "#4d8fc7", petit: true }
];
/* ======================================== */

function velo(b) {
  const r = b.petit ? 55 : 60, hy = b.petit ? 175 : 170, lift = b.petit ? 8 : 0;
  const bb = [190, hy + 5], seat = [168, hy - 70 + lift], head = [268, hy - 68 + lift];
  const roue = cx => {
    let s = `<circle cx="${cx}" cy="${hy}" r="${r}" fill="none" stroke="#101012" stroke-width="9"/>
             <circle cx="${cx}" cy="${hy}" r="${r - 8}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>`;
    for (let a = 0; a < 180; a += 22.5) {
      const t = a * Math.PI / 180, dx = (r - 8) * Math.cos(t), dy = (r - 8) * Math.sin(t);
      s += `<line x1="${cx - dx}" y1="${hy - dy}" x2="${cx + dx}" y2="${hy + dy}" stroke="rgba(255,255,255,.4)" stroke-width="1"/>`;
    }
    if (b.disque) s += `<circle cx="${cx}" cy="${hy}" r="14" fill="none" stroke="#c8c8cc" stroke-width="2.5"/>`;
    return s + `<circle cx="${cx}" cy="${hy}" r="6" fill="#ddd"/>`;
  };
  const haut = b.bas ? `M${head[0]} ${head[1]} L182 ${hy - 28}` : `M${seat[0]} ${seat[1]} L${head[0]} ${head[1]}`;
  const cadre = `M95 ${hy} L${bb[0]} ${bb[1]} L${seat[0]} ${seat[1]} ${b.bas ? "" : `L${head[0]} ${head[1]}`} M${bb[0]} ${bb[1]} L${head[0]} ${head[1]} M${seat[0]} ${seat[1]} L95 ${hy} M${head[0]} ${head[1]} L305 ${hy}${b.bas ? " " + haut : ""}`;
  const susp = b.susp
    ? `<path d="M${head[0]} ${head[1]} L${head[0] + 15} ${head[1] + 32}" stroke="${b.accent}" stroke-width="12" stroke-linecap="round"/>
       <path d="M180 ${hy - 52} L204 ${hy + 3}" stroke="${b.accent}" stroke-width="8" stroke-linecap="round"/>` : "";
  const fourche = !b.susp ? `<path d="M${head[0]} ${head[1]} L305 ${hy}" stroke="${b.accent === "#151617" ? "#151617" : b.cadre}" stroke-width="9" stroke-linecap="round"/>` : "";
  return `<svg viewBox="0 0 400 250" role="img" aria-label="${b.nom}">
    <ellipse class="shadow" cx="200" cy="232" rx="150" ry="9" fill="rgba(0,0,0,.35)"/>
    ${roue(95)}${roue(305)}
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${cadre}" stroke="${b.cadre}" stroke-width="9"/>
      <path d="${cadre}" stroke="rgba(255,255,255,.3)" stroke-width="2.5" transform="translate(-1.5 -2.5)"/>
    </g>
    ${fourche}${susp}
    <path d="M${head[0]} ${head[1]} L${head[0] - 6} ${head[1] - 22} L${head[0] + 22} ${head[1] - 24}" fill="none" stroke="#18181a" stroke-width="6" stroke-linecap="round"/>
    <path d="M${seat[0] - 18} ${seat[1] - 10} L${seat[0] + 20} ${seat[1] - 10}" stroke="#151517" stroke-width="9" stroke-linecap="round"/>
    <path d="M${seat[0]} ${seat[1]} L${seat[0] - 2} ${seat[1] - 8}" stroke="#444" stroke-width="5"/>
    <path d="M${bb[0]} ${bb[1]} L${bb[0] - 14} ${bb[1] + 21}" stroke="#222" stroke-width="5" stroke-linecap="round"/>
    <rect x="${bb[0] - 24}" y="${bb[1] + 19}" width="20" height="6" rx="3" fill="#222"/>
    <circle cx="${bb[0]}" cy="${bb[1]}" r="11" fill="#9a9a9e" stroke="#222" stroke-width="4"/>
  </svg>`;
}

/* Affiche la vraie photo ; si le fichier est introuvable, retombe sur le dessin SVG */
function visuel(b, cible, prefixe = "") {
  cible.innerHTML = `<img src="${b.img}" alt="${b.nom}" class="${FOND_BLANC ? "fond-blanc" : ""}" loading="eager" decoding="async">` + prefixe;
  cible.querySelector("img").addEventListener("error", e => e.target.outerHTML = velo(b), { once: true });
}

const $ = s => document.querySelector(s);
VELOS.forEach(v => { new Image().src = v.img; }); /* précharge les photos pour une transition sans à-coup */
const racine = document.documentElement;
const fmt = n => n.toLocaleString("fr-FR") + " " + DEVISE;
let i = 0, m = 0, occupe = false, minuteur;

function prix() {
  const b = VELOS[i], g = GAMMES[b.gamme];
  if (m < 4) {
    $("#price").textContent = fmt(g.heures[m]);
    $("#sub").textContent = `pour ${m + 1} h · frais compris`;
    $("#note").textContent = m === 3 ? "Forfait le plus avantageux · caution rendue à la restitution du vélo" : "Caution rendue à la restitution du vélo";
  } else {
    $("#price").textContent = "dès " + fmt(g.roadtrip);
    $("#sub").textContent = "par personne · sortie encadrée";
    $("#note").textContent = "Sans caution, un coordinateur roule avec le groupe";
  }
  document.querySelectorAll("#chips button").forEach(c => c.setAttribute("aria-pressed", Number(c.dataset.m) === m));
}

function remplir() {
  const b = VELOS[i], n = VELOS[(i + 1) % VELOS.length];
  visuel(b, $("#bike"));
  $("#nom").textContent = b.nom;
  $("#badge").hidden = !b.populaire;
  $("#resume").textContent = b.resume;
  $("#gamme").textContent = "Gamme " + b.gamme;
  $("#specs").innerHTML = [[b.poids, "poids"], [b.vitesses, "vitesses"], [b.charge, "charge max"], [b.auto, "autonomie conseillée"]]
    .map(([v, l]) => `<div><b>${v}</b>${l}</div>`).join("");
  visuel(n, $("#thumb")); $("#thumb").insertAdjacentHTML("beforeend", `<small>${n.nom}</small>`);
  prix();
}

/* ====== Transition : le vélo suit la diagonale du coin bas droit vers le centre, puis sort ====== */
const DUREE_VOL = 1000;
const reduit = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/* Rectangle r agrandi de k fois autour de son centre, puis décalé de (dx, dy) */
const rect = (r, dx, dy, k) => ({
  left: r.left + r.width / 2 - r.width * k / 2 + dx, top: r.top + r.height / 2 - r.height * k / 2 + dy,
  width: r.width * k, height: r.height * k
});

/* Pose une copie du vélo b sur le rectangle "de" et la fait glisser vers le rectangle "vers" */
function vol(b, de, vers, fondu) {
  const scene = $(".stage"), st = scene.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "vol";
  el.style.cssText = `left:${de.left - st.left}px;top:${de.top - st.top}px;width:${de.width}px;height:${de.height}px`;
  visuel(b, el);
  scene.appendChild(el);
  const op = fondu === "sortie" ? [1, 1, 0] : fondu === "entree" ? [0, 1, 1] : [1, 1, 1];
  el.animate([
    { transform: "translate(0, 0) scale(1)", opacity: op[0], offset: 0 },
    { opacity: op[1], offset: .5 },
    { transform: `translate(${vers.left - de.left}px, ${vers.top - de.top}px) scale(${vers.width / de.width})`, opacity: op[2], offset: 1 }
  ], { duration: DUREE_VOL, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "both" });
  return el;
}

function aller(n, sens = 1) {
  if (occupe) return;
  occupe = true;
  const ancien = VELOS[i], ancienSuivant = VELOS[(i + 1) % VELOS.length];
  i = (n + VELOS.length) % VELOS.length;
  const b = VELOS[i];
  racine.style.setProperty("--c1", b.c1);
  racine.style.setProperty("--c2", b.c2);
  const els = document.querySelectorAll(".sw");
  els.forEach(e => e.classList.add("out"));

  const anime = !reduit(), bike = $("#bike"), thumb = $("#thumb");
  const clones = []; let vx = 0, vy = 0;
  if (anime) {
    const rB = bike.getBoundingClientRect();                       /* emplacement du grand vélo */
    const rBimg = bike.firstElementChild.getBoundingClientRect();  /* sa position réelle (avec le flottement) */
    const rT = thumb.querySelector("img, svg").getBoundingClientRect(); /* emplacement du petit vélo, coin bas droit */
    vx = (rB.left + rB.width / 2) - (rT.left + rT.width / 2);      /* la diagonale : du petit vélo vers le grand */
    vy = (rB.top + rB.height / 2) - (rT.top + rT.height / 2);
    const hautGauche = rect(rB, vx * .9, vy * .9, 1.5);            /* plus loin sur la même diagonale */
    if (sens > 0) {
      clones.push(vol(ancien, rBimg, hautGauche, "sortie"));       /* l'actuel continue la diagonale et sort */
      clones.push(vol(ancienSuivant, rT, rB));                     /* le suivant quitte le coin et va au centre */
    } else {
      clones.push(vol(b, hautGauche, rB, "entree"));               /* retour : le précédent arrive du haut gauche */
      clones.push(vol(ancien, rBimg, rT));                         /* l'actuel retourne dans le coin */
      clones.push(vol(ancienSuivant, rT, rect(rT, -vx * .25, -vy * .25, .6), "sortie"));
    }
    bike.classList.add("cache");
    thumb.classList.add("cache");
  }

  setTimeout(() => {
    remplir();
    els.forEach(e => { e.classList.remove("out"); e.classList.add("pre"); });
    void document.body.offsetWidth;
    els.forEach(e => e.classList.remove("pre"));
    if (anime && sens > 0) {
      /* un nouveau petit vélo arrive dans le coin bas droit */
      thumb.classList.remove("cache");
      thumb.querySelector("img, svg").animate([
        { transform: `translate(${-vx * .2}px, ${-vy * .2}px) scale(.5)`, opacity: 0 },
        { transform: "none", opacity: 1 }
      ], { duration: 650, easing: "cubic-bezier(.2, .7, .3, 1)", fill: "backwards" });
    }
  }, 320);

  setTimeout(() => {
    clones.forEach(c => c.remove());
    bike.classList.remove("cache");
    thumb.classList.remove("cache");
    occupe = false;
  }, anime ? DUREE_VOL : 320);
  relancer();
}

function relancer() {
  clearInterval(minuteur);
  if (modalOuverte) return;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) minuteur = setInterval(() => aller(i + 1), 6000);
}

DUREES.forEach((d, k) => {
  const c = document.createElement("button");
  c.dataset.m = k; c.textContent = d;
  c.onclick = () => { m = k; prix(); };
  $("#chips").appendChild(c);
});
$("#next").onclick = $("#thumb").onclick = () => aller(i + 1);
$("#prev").onclick = () => aller(i - 1, -1);
$(".stage").addEventListener("mouseenter", () => clearInterval(minuteur));
$(".stage").addEventListener("mouseleave", relancer);

racine.style.setProperty("--c1", VELOS[0].c1);
racine.style.setProperty("--c2", VELOS[0].c2);
/* ====== Fenêtre de réservation (démonstration) ====== */
let modalOuverte = false, bk = VELOS[0], R = {};
const MAXV = { Classique: 3, Premium: 11 };
const COCOS = { Classique: "eau et 1 coco", Premium: "eau et 2 cocos" };
const $r = $("#modalResa");
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const jour = t => new Date(t + "T00:00:00");
const long = t => { const x = jour(t).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); return x.charAt(0).toUpperCase() + x.slice(1); };
function prochain(dow) { const d = new Date(); d.setHours(0, 0, 0, 0); while (d.getDay() !== dow) d.setDate(d.getDate() + 1); return iso(d); }
function creneaux() {
  const out = [], auj = R.date === iso(new Date());
  for (let s = jour(R.date).getDay() === 6 ? 11 : 8; s <= 22 - R.heures; s++) { if (auj && s <= new Date().getHours()) continue; out.push(s); }
  return out;
}
const total = () => R.formule === "trip" ? GAMMES[bk.gamme].roadtrip * R.qte : GAMMES[bk.gamme].heures[R.heures - 1] * R.qte;
const okC = () => R.c.prenom.trim() && R.c.nom.trim() && /^\S+@\S+\.\S+$/.test(R.c.email.trim());
const frais = () => Math.round(total() * 0.0325);
const okM = () => R.momo.replace(/\D/g, "").length >= 8;
const carte = (act, v, on, inner) => `<button type="button" class="opt${on ? " on" : ""}" data-act="${act}" data-v="${v}">${inner}</button>`;
const qte = max => `<div class="qte"><button type="button" data-act="qm" ${R.qte <= 1 ? "disabled" : ""}>−</button><span>${R.qte}</span><button type="button" data-act="qp" ${R.qte >= max ? "disabled" : ""}>+</button></div>`;

function ouvrir() {
  bk = VELOS[i];
  const dem = new Date(); dem.setDate(dem.getDate() + 1);
  R = { etape: 1, formule: m < 4 ? "libre" : "trip", heures: m < 4 ? m + 1 : 2, date: iso(dem), departs: [prochain(6), prochain(0)].sort(), depart: 0, qte: 1,
        op: "MTN MoMo", momo: "", code: "", codeMsg: "", cgu: false, ref: "", c: { prenom: "", nom: "", email: "", tel: "", mot: "" } };
  R.heure = creneaux()[0];
  modalOuverte = true; clearInterval(minuteur);
  $r.hidden = false; document.body.style.overflow = "hidden";
  rendre(); $r.querySelector(".x").focus();
}
function fermer() { modalOuverte = false; $r.hidden = true; document.body.style.overflow = ""; relancer(); }

function rendre() {
  const g = GAMMES[bk.gamme], max = MAXV[bk.gamme], trip = R.formule === "trip";
  $("#rstep").innerHTML = ["Votre location", "Vos coordonnées", "Paiement"].map((t, k) =>
    `<span class="${R.etape === k + 1 ? "cur" : R.etape > k + 1 ? "done" : ""}"><b>${R.etape > k + 1 ? "✓" : k + 1}</b>${t}</span>`).join("");
  let h = "";
  if (R.etape === 1) {
    h = `<h2>Votre location</h2><h3>Votre formule</h3><div class="grid2">` +
      carte("formule", "trip", trip, `<span class="t">Road trip sur la route des Pêches</span><em>dès ${fmt(g.roadtrip)} / pers.</em><small>Un de nos deux circuits, roulé ensemble avec un coordinateur qui ouvre la route. Vélo, casque, antivol, kit de réparation, coco frais et eau compris. Aucune caution.</small>`) +
      carte("formule", "libre", !trip, `<span class="t">Location libre</span><em>dès ${fmt(g.heures[0])}</em><small>Vous prenez le vélo et vous roulez où vous voulez, à votre rythme. De une à quatre heures. Pièce d’identité et engagement signé demandés au départ.</small>`) + `</div>`;
    if (trip) {
      h += `<h3>Quel départ ?</h3><p class="hint">La sortie est encadrée : elle part en groupe, à heure fixe, avec un coordinateur qui ouvre la route.</p><div class="grid2">` +
        R.departs.map((d, k) => carte("depart", k, R.depart === k, `<span class="t">${long(d)}</span><small>8 h – 11 h</small><b>${fmt(g.roadtrip)} / pers.</b>`)).join("") +
        `</div><h3>Combien de personnes ?</h3><p class="hint">Jusqu’à ${max} : un vélo ${bk.gamme} par personne.</p>${qte(max)}` +
        `<ul class="plain"><li>Rien à apporter : casque, antivol et kit sont fournis au départ.</li><li>Être présent au point de départ quinze minutes avant l’heure.</li></ul>` +
        `<p class="hint">Retrait et restitution : <b>Atelier Route des Pêches</b>, Route des Pêches, Fidjrossè, Cotonou. Actuellement 2 créneaux de sortie par semaine, horaires confirmés par téléphone.</p>`;
    } else {
      const cs = creneaux();
      h += `<h3>Combien de temps ?</h3><div class="grid4">` +
        [1, 2, 3, 4].map(n => carte("heures", n, R.heures === n, `<span class="t">${n} h</span><small>${fmt(g.heures[n - 1])}</small>`)).join("") +
        `</div><h3>Quel jour ?</h3><input type="date" id="rdate" value="${R.date}" min="${iso(new Date())}">` +
        `<h3>À quelle heure ?</h3><p class="hint">Départs de 8 h à 20 h, vélo rendu à 22 h au plus tard : nous ne proposons que les départs qui vous laissent le temps de le rendre.${jour(R.date).getDay() === 6 ? " Le samedi, de 8 h à 11 h, les vélos partent en road trip : la location libre commence à 11 h ce jour-là." : ""}</p>` +
        (cs.length ? `<div class="slots">` + cs.map(s => carte("heure", s, R.heure === s, `${s} h – ${s + R.heures} h`)).join("") + `</div>` : `<p class="hint">Plus de créneau ce jour-là, choisissez une autre date.</p>`) +
        `<h3>Combien de vélos ?</h3><p class="hint">Jusqu’à ${max} vélos ${bk.gamme}, au même prix chacun.</p>${qte(max)}`;
    }
    h += `<div class="actions"><button type="button" class="btn" data-act="next" ${!trip && !R.heure ? "disabled" : ""}>Continuer</button></div>`;
  } else if (R.etape === 2) {
    const v = k => esc(R.c[k]);
    h = `<h2>Vos coordonnées</h2><p class="hint">Nous n’ouvrons pas de compte. Ces informations servent à préparer votre vélo, vous envoyer la facture et vous transmettre votre lien de suivi.</p>` +
      `<div class="grid2 f"><label>Prénom *<input data-f="prenom" value="${v("prenom")}" autocomplete="given-name"></label><label>Nom *<input data-f="nom" value="${v("nom")}" autocomplete="family-name"></label>` +
      `<label>Adresse email *<input type="email" data-f="email" value="${v("email")}" autocomplete="email"><small>Votre facture et votre lien de suivi y sont envoyés.</small></label>` +
      `<label>Téléphone<input type="tel" data-f="tel" value="${v("tel")}" autocomplete="tel"><small>Pour vous joindre en cas d’imprévu.</small></label></div>` +
      `<label class="full">Un mot pour nous ? (facultatif)<textarea data-f="mot" rows="3" placeholder="Votre taille, votre itinéraire, un besoin particulier">${v("mot")}</textarea></label>` +
      `<div class="actions"><button type="button" class="btn ghost" data-act="back">Retour</button><button type="button" class="btn" id="rnext" data-act="next" ${okC() ? "" : "disabled"}>Continuer vers le paiement</button></div>` +
      `<p class="hint">Prénom, nom et adresse email sont nécessaires pour continuer.</p>`;
  } else if (R.etape === 3) {
    const fr = frais();
    const cg = `<a href="https://bike-land.vercel.app/cgv" target="_blank" rel="noopener">conditions générales de vente</a>`;
    const pd = `<a href="https://bike-land.vercel.app/donnees-personnelles" target="_blank" rel="noopener">politique de protection des données</a>`;
    h = `<h2>Paiement</h2><p class="hint">Une demande de paiement partira sur votre téléphone, que vous validerez avec votre code Mobile Money. Aucune coordonnée de paiement ne transite ni n’est conservée par Bike Land : nous ne connaissons que votre numéro.</p><div class="demo">Démonstration : aucun paiement réel n’est effectué.</div>` +
      `<h3>Moyen de paiement</h3><div class="grid3">${["MTN MoMo", "Moov Money", "Celtiis Cash"].map(o => carte("op", o, R.op === o, `<span class="t">${o}</span><small>Validation sur votre téléphone</small>`)).join("")}</div>` +
      `<label class="full">Numéro ${R.op}<input type="tel" data-f="momo" value="${esc(R.momo)}" placeholder="01 XX XX XX XX"></label>` +
      `<h3>Code de parrainage (facultatif)</h3><div class="code"><input data-f="code" value="${esc(R.code)}" placeholder="Code partenaire"><button type="button" class="btn ghost" id="rcode" data-act="code" ${R.code.trim() ? "" : "disabled"}>Appliquer</button></div>${R.codeMsg ? `<p class="hint">${R.codeMsg}</p>` : ""}` +
      `<div class="sum"><div class="line"><span>Votre location</span><span>${fmt(total())}</span></div><div class="line"><span>Frais Mobile Money<small>3,25 %, prélevés par l’opérateur de paiement</small></span><span>+ ${fmt(fr)}</span></div><div class="tot"><span>Débité de votre compte</span><b>${fmt(total() + fr)}</b></div></div>` +
      `<label class="cgu"><input type="checkbox" id="rcgu" ${R.cgu ? "checked" : ""}> J’accepte les ${cg} et la ${pd}.</label>` +
      `<div class="actions"><button type="button" class="btn ghost" data-act="back">Retour</button><button type="button" class="btn" id="rpay" data-act="pay" ${okM() && R.cgu ? "" : "disabled"}>Payer ${fmt(total() + fr)}</button></div>`;
  } else {
    h = `<div class="ok"><div class="check">✓</div><h2>Réservation confirmée</h2><p class="hint">Référence <b>${R.ref}</b></p>` +
      `<p class="hint">Démonstration : rien n’a été payé ni réservé. Dans la vraie version, la facture part par email à ${esc(R.c.email)} avec votre lien de suivi.</p>` +
      `<div class="actions"><button type="button" class="btn" data-act="close">Fermer</button></div></div>`;
  }
  $("#rbody").innerHTML = h;

  const dateTxt = trip ? long(R.departs[R.depart]) + ", de 8 h à 11 h" : long(R.date) + (R.heure ? `, de ${R.heure} h à ${R.heure + R.heures} h` : "");
  $("#rrecap").innerHTML = `<div class="rh"><span>Récapitulatif</span><i>${trip ? "Road trip · " + R.qte + " pers." : "Location libre · " + R.heures + " h"}</i></div>` +
    `<p><b>${bk.nom}</b> · gamme ${bk.gamme}</p><p>${dateTxt}</p>` +
    `<div class="line"><span>${trip ? "Road trip, " + R.qte + " personne" + (R.qte > 1 ? "s" : "") : "Location libre, " + R.heures + " h" + (R.qte > 1 ? " × " + R.qte + " vélos" : "")}</span><b>${fmt(total())}</b></div>` +
    `<small>${trip ? fmt(g.roadtrip) + " par personne, " + COCOS[bk.gamme] + " compris" : "Vélo, casque et antivol compris"}</small>` +
    `<div class="tot"><span>Total à payer</span><b>${fmt(total())}</b></div>` +
    (trip ? `<p class="good">Aucune caution : la sortie est encadrée par un coordinateur, qui récupère le vélo et le kit à l’arrivée.</p>`
          : `<p class="hint">Une caution de 5 000 FCFA est remise en espèces au départ, en même temps que votre pièce d’identité. Elle vous est rendue à la restitution du vélo, elle n’est jamais encaissée en ligne.</p>`) +
    `<ul class="checks"><li>Annulation gratuite jusqu’à 72 h avant le départ</li><li>Facture envoyée par email juste après le paiement</li><li>Lien de suivi personnel, sans mot de passe</li></ul>`;
}

$r.addEventListener("click", e => {
  if (e.target === $r) return fermer();
  const b = e.target.closest("[data-act]");
  if (!b || b.disabled) return;
  const a = b.dataset.act, v = b.dataset.v;
  if (a === "close") return fermer();
  if (a === "pay") {
    b.disabled = true; b.textContent = "Validation sur votre téléphone…";
    setTimeout(() => {
      if (!modalOuverte) return;
      R.ref = "BL-" + Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
      R.etape = 4; rendre();
    }, 1400);
    return;
  }
  if (a === "code") R.codeMsg = "Démonstration : le code serait vérifié par le système de Bike Land.";
  if (a === "formule") R.formule = v;
  if (a === "depart") R.depart = +v;
  if (a === "heures") R.heures = +v;
  if (a === "heure") R.heure = +v;
  if (a === "qm") R.qte--;
  if (a === "qp") R.qte++;
  if (a === "op") R.op = v;
  if (a === "back") R.etape--;
  if (a === "next") R.etape++;
  R.qte = Math.min(MAXV[bk.gamme], Math.max(1, R.qte));
  const cs = creneaux(); if (!cs.includes(R.heure)) R.heure = cs[0];
  rendre();
  $r.scrollTo({ top: 0 });
});
$r.addEventListener("change", e => {
  if (e.target.id === "rcgu") { R.cgu = e.target.checked; const q = $("#rpay"); if (q) q.disabled = !(okM() && R.cgu); return; }
  if (e.target.id !== "rdate" || !e.target.value) return;
  R.date = e.target.value;
  const cs = creneaux(); if (!cs.includes(R.heure)) R.heure = cs[0];
  rendre();
});
$r.addEventListener("input", e => {
  const f = e.target.dataset.f;
  if (!f) return;
  if (f === "momo") R.momo = e.target.value; else if (f === "code") R.code = e.target.value; else R.c[f] = e.target.value;
  const n = $("#rnext"); if (n) n.disabled = !okC();
  const p = $("#rpay"); if (p) p.disabled = !(okM() && R.cgu);
  const c = $("#rcode"); if (c) c.disabled = !R.code.trim();
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && modalOuverte) fermer(); });
$("#cta").onclick = ouvrir;
$("#openResa").onclick = ouvrir;

remplir();
relancer();
