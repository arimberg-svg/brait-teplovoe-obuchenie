(function () {
  const { brand, accessories, products, groups } = window.BRAIT;
  const accById = Object.fromEntries(accessories.map((a) => [a.id, a]));
  const root = document.getElementById("app");
  const nav = document.getElementById("nav");
  const searchInput = document.getElementById("search");

  function route() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, "") || "home");
    const [kind, id] = hash.split("/");
    if (kind === "product" && id) return renderProduct(id);
    if (kind === "brand") return renderBrand();
    if (kind === "sell") return renderSell();
    if (kind === "heat-types") return renderHeat();
    if (kind === "extras") return renderExtras();
    return renderHome();
  }

  function setActive(hash) {
    nav.querySelectorAll(".nav-link, .tab").forEach((el) => {
      el.classList.toggle("active", el.dataset.hash === hash);
    });
  }

  function renderNav() {
    nav.innerHTML = groups.map((g) => {
      if (g.type === "page") {
        const hash = g.id === "home" ? "home" : g.id;
        return `<a class="nav-link" data-hash="${hash}" href="#${hash}">${g.title}</a>`;
      }
      const items = products.filter((p) => p.group === g.id).map((p) => `
        <button class="tab" data-hash="product/${p.id}" type="button">
          ${p.name}<small>${p.power} · ${p.heat}</small>
        </button>`).join("");
      return `<details class="nav-section" open>
        <summary>${g.title}</summary>${items}
      </details>`;
    }).join("");

    nav.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      location.hash = tab.dataset.hash;
    });
  }

  function hero(title, text) {
    return `<div class="hero"><h1>${title}</h1><p>${text}</p></div>`;
  }

  function renderHome() {
    setActive("home");
    root.innerHTML = `
      ${hero("Обучение по тепловому оборудованию BRAIT", "Внутренний курс для продавцов: линейка с официального сайта fdbrait.ru, стиль бренда, как закрывать сделку и какие допы класть в чек к каждой пушке.")}
      <div class="chips">
        <button class="chip" data-go="product/bgh-15">Потолки → газ 15 кВт</button>
        <button class="chip" data-go="product/br-22a">Стройка без людей → дизель прямой</button>
        <button class="chip" data-go="product/br-22aiw">Люди в помещении → непрямой</button>
        <button class="chip" data-go="product/br-3">Розетка 220 В → тепловентилятор</button>
        <button class="chip" data-go="product/bph-5000th">Кабина / кунг → автономка</button>
      </div>
      <div class="grid-3">
        <article class="card red"><h3>1. Не продавайте «просто пушку»</h3><p>Сначала сценарий: улица или помещение, люди внутри или нет, газ / дизель / розетка, площадь и высота. От этого зависит жизнь клиента и возврат товара.</p></article>
        <article class="card red"><h3>2. Собирайте комплект</h3><p>Газ без редуктора не стартует. Непрямой дизель без дымохода бессмысленен. Автономка без выхлопа опасна. Доп — не «навязывание», а условие запуска.</p></article>
        <article class="card red"><h3>3. Считайте расход вслух</h3><p>Клиент думает киловаттами, платит литрами и килограммами. Назовите расход в час и бак — сделка становится конкретной.</p></article>
      </div>
      <h2>Как пользоваться курсом</h2>
      <p>Слева каждая модель — отдельная вкладка. На карточке: фото на белом фоне, как продать, преимущества, важные ТТХ и допы с формулировкой «зачем именно к этой пушке».</p>
      <div class="grid-2" style="margin-top:16px">
        <article class="card"><h3>Шрифты и цвет сайта</h3><ul class="list">${brand.fonts.map((f) => `<li>${f}</li>`).join("")}</ul><p class="muted">Фирменный красный BRAIT: <b style="color:#e31e24">#E31E24</b>. Чёрный логотипа и подложки: #1A1A1A. Белый под фото товаров — как просили.</p></article>
        <article class="card"><h3>Источник линейки</h3><p>Каталог климатического оборудования официального сайта <a href="${brand.site}" target="_blank" rel="noopener">${brand.site}</a>. Файлы «Товар который продаем» и «ДОПЫ» в папке были пустыми — взяли полную линейку с сайта и расписали допы под продажи.</p></article>
      </div>
    `;
    root.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { location.hash = b.dataset.go; }));
  }

  function renderBrand() {
    setActive("brand");
    root.innerHTML = `
      ${hero("Зачем клиенту BRAIT, а не «какой-нибудь китай»", "Официально зарегистрированный бренд с 2012 года, прямые контракты с заводами, сервис по России и свои запчасти к тепловому оборудованию.")}
      <div class="grid-2">
        ${brand.advantages.map((a) => `<article class="card red"><h3>${a.title}</h3><p>${a.text}</p></article>`).join("")}
      </div>
      <h2>Как говорить это в зале, коротко</h2>
      <div class="phrase">«BRAIT — это не noname с барахолки. Бренд зарегистрирован, техника под регламенты ЕАЭС, запчасти к этим же пушкам лежат в каталоге, сервисный центр работает по России. Вы не останетесь зимой с мёртвым железом.»</div>
    `;
  }

  function renderSell() {
    setActive("sell");
    root.innerHTML = `
      ${hero("Скрипт линейки за 60 секунд", "Четыре развилки. Если пропустить первую — продадите опасную технику не туда и получите возврат.")}
      <div class="grid-2">
        <article class="card warn"><h3>Развилка 1. Где греем?</h3><p><b>Улица, каркас, стройка без людей</b> — газ или дизель прямого нагрева.<br><b>Помещение с людьми, товар, животные</b> — дизель непрямой (AIW) или электричество.<br><b>Кабина, кунг, бытовка</b> — автономка BPH, не пушка.</p></article>
        <article class="card warn"><h3>Развилка 2. Чем топим?</h3><p><b>Есть пропан</b> — газ, дешевле гигакалория, нужен комплект редуктор+шланг+баллон.<br><b>Есть солярка, нет баллонов</b> — дизель.<br><b>Только розетка</b> — тепловентилятор, честно по площади.</p></article>
        <article class="card"><h3>Развилка 3. Сколько кВт?</h3><p>Грубо 1 кВт на 10 м² при высоте ~3 м и среднем утеплении. Потолки и сушка — берите запас. Ангар 6–8 м — запас 1,5–2 раза. Не продавайте 80 кВт в гараж «на всякий случай».</p></article>
        <article class="card"><h3>Развилка 4. Чек не из одной позиции</h3><p>После согласия по модели сразу: топливо/газ, то, без чего не запустится, и то, что сломается в первую зиму (форсунка, свеча, фильтр, плата).</p></article>
      </div>
      <h2>Чего нельзя обещать</h2>
      <ul class="list">
        <li>Прямой дизель и газ — «как батарея в квартире».</li>
        <li>Тепловентилятор 2 кВт — «прогреет склад».</li>
        <li>Непрямой нагрев — «можно без трубы».</li>
        <li>5 кВт на 220 В — «воткнёте в любой удлинитель».</li>
      </ul>
    `;
  }

  function renderHeat() {
    setActive("heat-types");
    root.innerHTML = `
      ${hero("Прямой и непрямой нагрев", "Это главная ошибка новичков в зале. Путаете — рискуете здоровьем клиента.")}
      <div class="grid-2">
        <article class="card warn"><h3>Прямой (AW, A, газ)</h3><p>Пламя греет воздух, который сразу вылетает из пушки. Вместе с теплом идут продукты сгорания. КПД высокий, цена ниже. Только улица и мощная вентиляция. Люди не должны дышать этим постоянно.</p></article>
        <article class="card ok"><h3>Непрямой (AIW, автономки)</h3><p>Камера закрытая: воздух помещения идёт в обход пламени. Выхлоп — в дымоход или за борт. Можно работать рядом. Дороже, нужен дымоход. Не отпускайте без трубы.</p></article>
      </div>
      <h2>Индексы в названиях BRAIT</h2>
      <table class="ttx card" style="padding:0">
        <tr><th>A / AW</th><td>Дизель прямого нагрева</td></tr>
        <tr><th>AIW</th><td>Дизель непрямого нагрева (Indirect)</td></tr>
        <tr><th>BGH / BR-xx газ</th><td>Газовые пушки, всегда прямой нагрев</td></tr>
        <tr><th>M</th><td>Модификация той же мощности, сверяйте комплект</td></tr>
        <tr><th>S / C</th><td>У тепловентиляторов: термостат / компакт</td></tr>
        <tr><th>D</th><td>У электрики: 380 В, трёхфаза</td></tr>
        <tr><th>BFH vs BR</th><td>Новая и классическая линейки тепловентиляторов</td></tr>
      </table>
    `;
  }

  function renderExtras() {
    setActive("extras");
    root.innerHTML = `
      ${hero("Сопутствующий товар", "Правило: если без позиции пушка не запускается или становится опасной — это не доп, это часть комплекта.")}
      <div class="cards grid-2">
        ${accessories.map((a) => `<article class="card acc-card"><h3>${a.name}<span class="sku">${a.sku} · ${a.group}</span></h3><p class="muted">Карточки «зачем» живут на вкладке каждой модели: там формулировка под конкретную пушку, не общая.</p></article>`).join("")}
      </div>
    `;
  }

  function renderProduct(id) {
    const p = products.find((x) => x.id === id);
    setActive("product/" + id);
    if (!p) {
      root.innerHTML = hero("Модель не найдена", "Вернитесь в список слева.");
      return;
    }
    root.innerHTML = `
      <div class="product-head">
        <div class="photo-stage"><img src="${p.image}" alt="${p.title}"></div>
        <div>
          <p class="kicker">${groupTitle(p.group)}</p>
          <h1>${p.title}</h1>
          <div class="meta">
            <span class="badge dark">${p.name}</span>
            <span class="badge">${p.power}</span>
            <span class="badge ${p.heat.indexOf("непрямой") !== -1 ? "ok" : "warn"}">${p.heat}</span>
            <span class="badge">арт. ${p.sku}</span>
          </div>
          <p>${p.audience}</p>
          <div class="phrase">${p.phrase}</div>
        </div>
      </div>
      <div class="grid-2">
        <article class="card red"><h3>Как продать</h3><ul class="list">${p.sell.map((s) => `<li>${s}</li>`).join("")}</ul></article>
        <article class="card ok"><h3>Преимущества</h3><ul class="list">${p.advantages.map((s) => `<li>${s}</li>`).join("")}</ul></article>
      </div>
      <h2>Важные ТТХ</h2>
      <table class="ttx card" style="padding:0">${p.specs.map((row) => `<tr><th>${row[0]}</th><td>${row[1]}</td></tr>`).join("")}</table>
      <h2>Что предложить вместе и зачем</h2>
      <div class="grid-2">
        ${p.extras.map((e) => {
          const a = accById[e.id] || { name: e.id, sku: "" };
          return `<article class="card acc-card"><h3>${a.name}<span class="sku">${a.sku || ""}</span></h3><div class="why"><b>Зачем к ${p.name}:</b> ${e.why}</div></article>`;
        }).join("")}
      </div>
      <p class="note">ТТХ по каталогу fdbrait.ru. Производитель может менять комплектацию. Перед продажей сверяйте шильдик и накладную.</p>
    `;
    window.scrollTo(0, 0);
  }

  function groupTitle(id) {
    return (groups.find((g) => g.id === id) || { title: id }).title;
  }

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    const box = document.getElementById("search-box");
    if (!q) { box.classList.add("hidden"); box.innerHTML = ""; return; }
    const hits = products.filter((p) => (p.name + p.title + p.sku + p.power).toLowerCase().includes(q)).slice(0, 8);
    box.classList.remove("hidden");
    box.innerHTML = hits.length
      ? hits.map((p) => `<button type="button" data-go="product/${p.id}"><b>${p.name}</b> — ${p.title}</button>`).join("")
      : `<button type="button">Ничего не найдено</button>`;
    box.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => {
      location.hash = b.dataset.go;
      box.classList.add("hidden");
      searchInput.value = "";
    }));
  });

  renderNav();
  window.addEventListener("hashchange", route);
  route();
})();
