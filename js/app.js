(function () {
  const { brand, accessories, products, groups } = window.BRAIT;
  const accById = Object.fromEntries(accessories.map((a) => [a.id, a]));
  const root = document.getElementById("app");
  const nav = document.getElementById("nav");
  const searchInput = document.getElementById("search");

  function route() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, "") || "home");
    const [kind, id] = hash.split("/");
    if (kind === "product" && id === "rk-1") {
      location.hash = "product/bph-8000th";
      return;
    }
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
      const items = products.filter((p) => p.group === g.id);
      if (!items.length) return "";
      return `<details class="nav-section" open>
        <summary>${g.title}</summary>${items.map((p) => `
        <button class="tab" data-hash="product/${p.id}" type="button">
          ${p.name}<small>${p.power} · ${p.heat}</small>
        </button>`).join("")}
      </details>`;
    }).join("");

    nav.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      location.hash = tab.dataset.hash;
    });
  }

  function bindGo(scope) {
    (scope || document).querySelectorAll("[data-go]").forEach((b) => {
      b.addEventListener("click", () => { location.hash = b.dataset.go; });
    });
  }

  function hero(title, text) {
    return `<div class="hero"><h1>${title}</h1>${text ? `<p>${text}</p>` : ""}</div>`;
  }

  function extraCard(product, extra) {
    const a = accById[extra.id] || { name: extra.id, sku: "" };
    return `<article class="card acc-card ${extra.must ? "must" : ""}">
      ${extra.must ? `<div class="must-flag">Обязательно предлагать</div>` : ""}
      ${a.image ? `<div class="photo-stage extra-photo"><img src="${a.image}" alt="${a.name}"></div>` : ""}
      <h3>${a.name}<span class="sku">${a.sku || ""}</span></h3>
      <div class="why"><b>Зачем к ${product.name}:</b> ${extra.why}</div>
    </article>`;
  }

  function renderHome() {
    setActive("home");
    root.innerHTML = `
      ${hero("Обучение по тепловому оборудованию BRAIT")}
      <div class="chips">
        <button class="chip" data-go="product/bgh-20m">Потолки / газ → BGH-20M</button>
        <button class="chip" data-go="product/br-22a">Стройка без людей → дизель прямой</button>
        <button class="chip" data-go="product/br-22aiw">Люди в помещении → BR-22AIW + рукав</button>
        <button class="chip" data-go="product/bfh-2">Розетка 220 В → BFH-2 / 2S / 3</button>
        <button class="chip" data-go="product/bph-8000th">Бытовка / кунг → BPH-8000TH + RK-1</button>
      </div>
      <div class="grid-3">
        <article class="card red"><h3>1. Не продавайте «просто пушку»</h3><p>Сначала сценарий: улица или помещение, люди внутри или нет, газ / дизель / розетка, площадь и высота. От этого зависит жизнь клиента и возврат товара.</p></article>
        <article class="card red"><h3>2. Собирайте комплект</h3><p>Газ без редуктора не стартует. К BR-22AIW сразу рукав Ø350 мм / 6 м. К BPH-8000TH сразу ремкомплект RK-1. Доп — не «навязывание», а условие нормальной работы.</p></article>
        <article class="card red"><h3>3. Считайте расход вслух</h3><p>Клиент думает киловаттами, платит литрами и килограммами. Назовите расход в час и бак — сделка становится конкретной.</p></article>
      </div>
      <h2>Как пользоваться курсом</h2>
      <p>Слева каждая модель — отдельная вкладка. На карточке: фото на белом фоне, как продать, преимущества, важные ТТХ и допы с формулировкой «зачем именно к этой пушке».</p>
      <div class="grid-2" style="margin-top:16px">
        <article class="card"><h3>Шрифты и цвет сайта</h3><ul class="list">${brand.fonts.map((f) => `<li>${f}</li>`).join("")}</ul><p class="muted">Фирменный красный BRAIT: <b style="color:#e31e24">#E31E24</b>. Чёрный логотипа и подложки: #1A1A1A. Белый под фото товаров — как просили.</p></article>
        <article class="card"><h3>Что продаём мы</h3><p>В курсе только артикулы нашей витрины. Источник ТТХ — каталог <a href="${brand.site}" target="_blank" rel="noopener">fdbrait.ru</a> плюс ваши карточки: мощность BR-36AW 36 кВт, BR-56AW 56 кВт / бак 56 л, BR-22A 22 кВт, электрика круглая/квадратная.</p></article>
      </div>
    `;
    bindGo(root);
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
        <article class="card warn"><h3>Развилка 1. Где греем?</h3><p><b>Улица, каркас, стройка без людей</b> — BGH-20M или дизель прямой (15 / 22 / 36 / 56 кВт).<br><b>Помещение с людьми или товаром</b> — BR-22AIW или электрика.<br><b>Бытовка, кунг, маленький объём</b> — портативная BPH-8000TH.</p></article>
        <article class="card warn"><h3>Развилка 2. Чем топим?</h3><p><b>Есть пропан</b> — только BGH-20M + редуктор 0,7 бар + шланг + баллон.<br><b>Есть солярка</b> — дизель прямой или непрямой.<br><b>Только розетка</b> — BFH-2 круглая, BFH-2S квадратная, BFH-3 круглая 3 кВт.</p></article>
        <article class="card"><h3>Развилка 3. Сколько кВт?</h3><p>Грубо 1 кВт на 10 м² при высоте ~3 м. 2–3 кВт — комната. 15–22 — бокс и стройка. 36–56 — ангар. Не продавайте BR-56AW в гараж.</p></article>
        <article class="card"><h3>Развилка 4. Чек не из одной позиции</h3><p><b>BR-22AIW</b> — сразу рукав тепловой гибкий Ø 350 мм, длина 6 м.<br><b>BPH-8000TH</b> — сразу ремкомплект RK-1, арт. 25.02.197.120.<br>К дизелю — канистра, форсунка, свеча. К газу — редуктор и шланг.</p></article>
      </div>
      <h2>Чего нельзя обещать</h2>
      <ul class="list">
        <li>Прямой дизель и газ — «как батарея в квартире».</li>
        <li>BFH-2 / BFH-2S на 2 кВт — «прогреет склад».</li>
        <li>Непрямой нагрев — «можно без трубы и без рукава».</li>
        <li>Портативную BPH-8000TH — без ремкомплекта RK-1, «запчасти потом».</li>
      </ul>
    `;
  }

  function renderHeat() {
    setActive("heat-types");
    root.innerHTML = `
      ${hero("Прямой и непрямой нагрев", "Это главная ошибка новичков в зале. Путаете — рискуете здоровьем клиента.")}
      <div class="grid-2">
        <article class="card warn"><h3>Прямой (AW, A, газ)</h3><p>Пламя греет воздух, который сразу вылетает из пушки. Вместе с теплом идут продукты сгорания. КПД высокий, цена ниже. Только улица и мощная вентиляция. Люди не должны дышать этим постоянно.</p></article>
        <article class="card ok"><h3>Непрямой (AIW, BPH)</h3><p>Камера закрытая: воздух помещения идёт в обход пламени. Выхлоп — в дымоход или за борт. Можно работать рядом. К BR-22AIW сразу предлагаем рукав Ø 350 мм, длина 6 м. К портативной BPH-8000TH сразу RK-1.</p></article>
      </div>
      <h2>Индексы в названиях BRAIT</h2>
      <table class="ttx card" style="padding:0">
        <tr><th>A / AW</th><td>Дизель прямого нагрева</td></tr>
        <tr><th>AIW</th><td>Дизель непрямого нагрева (Indirect)</td></tr>
        <tr><th>BGH-20M</th><td>Единственная газовая в витрине, 20 кВт, прямой нагрев</td></tr>
        <tr><th>BPH</th><td>Портативная дизельная непрямого нагрева (у нас BPH-8000TH 5–8 кВт)</td></tr>
        <tr><th>BFH-2</th><td>Электрическая керамика 2 кВт, круглая</td></tr>
        <tr><th>BFH-2S</th><td>Электрическая керамика 2 кВт, квадратная</td></tr>
        <tr><th>BFH-3</th><td>Электрическая керамика 3 кВт, круглая</td></tr>
      </table>
    `;
  }

  function renderExtras() {
    setActive("extras");
    const rest = products.map((p) => {
      const extras = p.extras.filter((e) => !e.must);
      if (!extras.length) return "";
      return `<h2>${p.name} · ${p.sku}</h2>
        <p class="muted" style="margin-top:-6px">${p.title}</p>
        <div class="grid-2">${extras.map((e) => extraCard(p, e)).join("")}</div>`;
    }).join("");
    const mustBlocks = products.flatMap((p) => p.extras.filter((e) => e.must).map((e) => extraCard(p, e)));
    root.innerHTML = `
      ${hero("Допы: что класть в чек")}
      <div class="grid-2">${mustBlocks.join("")}</div>
      <h2>Остальные допы</h2>
      ${rest}
    `;
    bindGo(root);
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
        ${p.extras.map((e) => extraCard(p, e)).join("")}
      </div>
      <p class="note">ТТХ по каталогу fdbrait.ru. Производитель может менять комплектацию. Перед продажей сверяйте шильдик и накладную.</p>
    `;
    bindGo(root);
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
