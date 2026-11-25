const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);
const cats = ["Arkada", "Strategiya", "Poyga", "Boshqotirma", "Kosmos", "VR"];
const names = [
  "Neon Arkada",
  "Retro Zal",
  "Piksel Jangi",
  "Shoh va Ot",
  "Shaxmat Ustasi",
  "Taxta Jangi",
  "Tungi Poyga",
  "Turbo Yo'l",
  "Drift Shahri",
  "Rangli Kub",
  "Mantiq Labirint",
  "Bloklar",
  "Yulduz Urushi",
  "Galaktika",
  "Asteroid",
  "VR Sarguzasht",
  "Virtual Dunyo",
  "Kelajak Shahri",
  "Arkada Pro",
  "Strategiya Pro",
  "Poyga Pro",
  "Boshqotirma Pro",
  "Kosmos Pro",
  "VR Pro",
];
const games = names.map((n, i) => ({
  id: i,
  n,
  c: cats[i < 18 ? Math.floor(i / 3) : i - 18],
  p: ((i % 5) + 2) * 15000 + (i >= 18 ? 50000 : 0),
  img: `img/g${(i < 18 ? Math.floor(i / 3) : i - 18) + 1}.jpg`,
  r: (4 + (i % 10) / 10).toFixed(1),
}));
let cart = JSON.parse(localStorage.getItem("oz-cart") || "[]"),
  filter = "Barchasi";
const som = (v) => v.toLocaleString("ru-RU") + " so'm";
const toast = (t) => {
  $("#toast").textContent = t;
  $("#toast").classList.add("on");
  setTimeout(() => $("#toast").classList.remove("on"), 2200);
};
function renderTabs() {
  $("#tabs").innerHTML = ["Barchasi", ...cats]
    .map(
      (c) =>
        `<button class="${c === filter ? "on" : ""}" data-c="${c}">${c}</button>`,
    )
    .join("");
}
function renderGrid() {
  $("#grid").innerHTML = games
    .filter((g) => filter === "Barchasi" || g.c === filter)
    .map(
      (g, i) =>
        `<article class="card" style="--d:${i * 50}ms"><div class="im"><img src="${g.img}" alt="${g.n}" loading="lazy"><span>${g.c}</span></div><div class="in"><h3>${g.n}</h3><p>Reyting ${g.r} / 5</p><div class="pr"><b>${som(g.p)}</b><button class="btn sm" data-add="${g.id}">Savatga</button></div></div></article>`,
    )
    .join("");
}
function renderCart() {
  $("#count").textContent = cart.length;
  $("#items").innerHTML = cart.length
    ? cart
        .map(
          (id, i) =>
            `<li><img src="${games[id].img}" alt=""><div><b>${games[id].n}</b><small>${som(games[id].p)}</small></div><button data-del="${i}">O'chirish</button></li>`,
        )
        .join("")
    : "<li class='empty'>Savat bo'sh</li>";
  $("#sum").textContent = som(cart.reduce((s, id) => s + games[id].p, 0));
  localStorage.setItem("oz-cart", JSON.stringify(cart));
}
const openCart = (o) => {
  $("#cart").classList.toggle("open", o);
  $("#veil").classList.toggle("on", o);
};
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.c) {
    filter = t.dataset.c;
    renderTabs();
    renderGrid();
  }
  if (t.dataset.add) {
    cart.push(+t.dataset.add);
    renderCart();
    toast(games[t.dataset.add].n + " savatga qo'shildi");
    $("#count").classList.remove("pop");
    void $("#count").offsetWidth;
    $("#count").classList.add("pop");
  }
  if (t.dataset.del) {
    cart.splice(t.dataset.del, 1);
    renderCart();
  }
});
$("#cartBtn").onclick = () => openCart(true);
$("#close").onclick = $("#veil").onclick = () => openCart(false);
$("#buy").onclick = () => {
  if (!cart.length) return toast("Savat bo'sh");
  cart = [];
  renderCart();
  openCart(false);
  toast("Xaridingiz uchun rahmat!");
};
$("#subF").onsubmit = (e) => {
  e.preventDefault();
  e.target.reset();
  toast("Obuna bo'ldingiz!");
};
const setTheme = (l) => {
  document.body.classList.toggle("light", l);
  $("#theme").textContent = l ? "🌚" : "☀️  ";
  localStorage.setItem("oz-theme", l ? "1" : "");
};
$("#theme").onclick = () =>
  setTheme(!document.body.classList.contains("light"));
let board = Array(9).fill(""),
  over = false;
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const win = (p) => lines.some((l) => l.every((i) => board[i] === p));
function drawXO() {
  $("#xo").innerHTML = board
    .map((v, i) => `<button data-x="${i}" class="${v}">${v}</button>`)
    .join("");
}
function endXO(m) {
  over = true;
  $("#xoMsg").textContent = m;
}
$("#xo").onclick = (e) => {
  const i = e.target.dataset.x;
  if (i === undefined || board[i] || over) return;
  board[i] = "X";
  if (win("X")) {
    drawXO();
    return endXO("Siz yutdingiz!");
  }
  const free = board.map((v, k) => (v ? -1 : k)).filter((k) => k >= 0);
  if (!free.length) {
    drawXO();
    return endXO("Durang!");
  }
  board[free[Math.floor(Math.random() * free.length)]] = "O";
  drawXO();
  if (win("O")) endXO("Kompyuter yutdi!");
  else if (!board.includes("")) endXO("Durang!");
};
$("#xoNew").onclick = () => {
  board = Array(9).fill("");
  over = false;
  drawXO();
  $("#xoMsg").textContent = "Sizning navbatingiz (X)";
};
let taps = 0,
  left = 0,
  best = +localStorage.getItem("oz-best") || 0;
$("#best").textContent = best;
$("#tap").onclick = () => {
  if (left > 0) return ($("#tap").textContent = ++taps);
  taps = 0;
  left = 10;
  $("#tap").textContent = 0;
  const t = setInterval(() => {
    $("#tapMsg").innerHTML = `Qoldi: ${--left} s`;
    if (left > 0) return;
    clearInterval(t);
    best = Math.max(best, taps);
    localStorage.setItem("oz-best", best);
    $("#tapMsg").innerHTML =
      `Natija: ${taps} · Rekord: <b id="best">${best}</b>`;
    $("#tap").textContent = "Yana";
  }, 1000);
};
let secret = Math.ceil(Math.random() * 100),
  tries = 0;
$("#gBtn").onclick = () => {
  const v = +$("#guess").value;
  if (!v) return;
  tries++;
  if (v === secret) {
    $("#gMsg").textContent =
      `Topdingiz! ${tries} ta urinishda. Yangi raqam o'yladim.`;
    secret = Math.ceil(Math.random() * 100);
    tries = 0;
  } else
    $("#gMsg").textContent =
      `${v} — ${v < secret ? "kattaroq" : "kichikroq"} raqam. Urinishlar: ${tries}`;
};
const slides = ["hero", "g6", "g3", "g1"],
  quotes = [
    ["Tanaffusda o'ynash uchun eng zo'r sayt!", "Aziz, Toshkent"],
    ["X-O da kompyuterni yengish juda qiziq.", "Laylo, Samarqand"],
    ["Turnirda g'olib bo'ldim, rahmat!", "Javohir, Buxoro"],
  ];
let s = 0;
setInterval(() => {
  s++;
  $("#slide").src = `img/${slides[s % 4]}.jpg`;
  const q = quotes[s % 3];
  $("#quote").textContent = `"${q[0]}"`;
  $("#who").textContent = "— " + q[1];
  $("#online").textContent = (
    1150 + Math.floor(Math.random() * 120)
  ).toLocaleString("ru-RU");
}, 3500);
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.15 },
);
$$(".r").forEach((el) => io.observe(el));
$$("[data-n]").forEach((el) => {
  let v = 0;
  const t = setInterval(() => {
    v += Math.ceil(el.dataset.n / 30);
    if (v >= +el.dataset.n) {
      v = el.dataset.n;
      clearInterval(t);
    }
    el.textContent = v + "+";
  }, 40);
});
addEventListener("scroll", () => {
  $("#bar").style.width =
    (scrollY / (document.body.scrollHeight - innerHeight)) * 100 + "%";
  $("header").classList.toggle("sc", scrollY > 40);
});
setTimeout(() => $("#intro").classList.add("done"), 1800);
setTheme(!!localStorage.getItem("oz-theme"));
renderTabs();
renderGrid();
renderCart();
drawXO();
