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

  function extraItem(extra) {
    const a = accById[extra.id] || { name: extra.id };
    return {
      name: extra.name || a.name,
      sku: extra.sku || a.sku || "",
      url: extra.url || a.url || "",
      order: extra.order || a.order || "",
      image: extra.image || a.image || "",
      group: a.group || ""
    };
  }

  function buyBlock(item) {
    const sku = item.sku ? `<span class="sku">арт. ${item.sku}</span>` : "";
    const link = item.url
      ? `<a class="buy-link" href="${item.url}" target="_blank" rel="noopener">${item.url}</a>`
      : "";
    const via = item.order === "catalog"
      ? `<div class="order-via">Закажи через активный закуп</div>`
      : "";
    if (!sku && !link) return "";
    return `<div class="buy-line">${sku}${link}${via}</div>`;
  }

  function extraCard(product, extra) {
    const a = extraItem(extra);
    return `<article class="card acc-card ${extra.must ? "must" : ""}">
      ${extra.must ? `<div class="must-flag">Обязательно предлагать</div>` : ""}
      ${a.image ? `<div class="photo-stage extra-photo"><img src="${a.image}" alt="${a.name}"></div>` : ""}
      <h3>${a.name}</h3>
      ${buyBlock(a)}
      <div class="why"><b>Зачем к ${product.name}:</b> ${extra.why}</div>
    </article>`;
  }

  function renderHome() {
    setActive("home");
    root.innerHTML = `
      ${hero("Обучение по тепловому оборудованию BRAIT")}
      <p class="byline">Категорийный менеджер: <b>Эльвира Носкова</b> · дата публикации <b>15.09.2026</b></p>
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
      <p>Слева каждая модель — отдельная вкладка. Откройте нужную пушку: на карточке фото товара, как её продать, преимущества, важные ТТХ и допы с формулировкой «зачем именно к этой пушке».</p>
      <article class="card red" style="margin-top:16px">
        <h3>Что продаём мы</h3>
        <p>В этом курсе только артикулы нашей витрины — то, что реально стоит на продаже. Не вся линейка BRAIT с завода, а наш ассортимент.</p>
        <p>Технические данные сверяли с официальным каталогом и с нашими карточками. Где паспорт и витрина расходятся, в курсе стоят наши цифры: BR-36AW — 36 кВт, BR-56AW — 56 кВт и бак 56 л, BR-22A — 22 кВт. У электрики важно не перепутать форму: BFH-2 и BFH-3 — круглые, BFH-2S — квадратная.</p>
        <p>На сайте производителя больше, чем в курсе: описания, инструкции, запчасти и актуальная комплектация. Перед спорным вопросом клиента откройте карточку модели там.</p>
        <p><a class="site-link" href="https://fdbrait.ru/klimaticheskoe-oborudovanie/" target="_blank" rel="noopener">Открыть каталог теплового оборудования fdbrait.ru</a></p>
      </article>
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
      ${hero("Как продавать линейку", "Задавайте вопросы по порядку. Не перескакивайте: от первого ответа зависит, какую пушку вообще можно продавать.")}
      <article class="card step-card">
        <div class="step-num">1</div>
        <div>
          <h3>Спросите: «Где будете греть? Люди будут в этом помещении?»</h3>
          <ul class="list">
            <li><b>Улица, каркас, стройка, люди не сидят внутри</b> — можно газ BGH-20M или дизель прямого нагрева: BR-15A, BR-22A, BR-36AW, BR-56AW.</li>
            <li><b>Цех, склад, павильон, люди или товар внутри</b> — только непрямой нагрев BR-22AIW или электрика. Прямой дизель и газ сюда нельзя: выхлоп идёт в воздух.</li>
            <li><b>Бытовка, кунг, кабина, маленький гараж</b> — портативная BPH-8000TH, 5–8 кВт.</li>
          </ul>
        </div>
      </article>
      <article class="card step-card">
        <div class="step-num">2</div>
        <div>
          <h3>Спросите: «Чем будете топить — газ, солярка или розетка?»</h3>
          <ul class="list">
            <li><b>Есть пропан</b> — газовая BGH-20M. Сразу в чек: редуктор 0,7 бар, шланг и баллон. Без них пушка не запустится.</li>
            <li><b>Есть дизель</b> — смотрите ответ из вопроса 1: люди внутри → BR-22AIW или BPH-8000TH; людей нет → прямой дизель.</li>
            <li><b>Только розетка 220 В</b> — электрика: BFH-2 круглая 2 кВт, BFH-2S квадратная 2 кВт, BFH-3 круглая 3 кВт. Склад и ангар электрикой не греем.</li>
          </ul>
        </div>
      </article>
      <article class="card step-card">
        <div class="step-num">3</div>
        <div>
          <h3>Спросите: «Какая площадь и высота потолка?»</h3>
          <p>Ориентир: примерно 1 кВт на 10 м² при высоте около 3 метров. Если потолки выше — берите запас по мощности.</p>
          <ul class="list">
            <li><b>Комната, бытовка</b> — 2 кВт (BFH-2 / BFH-2S) или 3 кВт (BFH-3). Либо портативная BPH-8000TH, если нужна солярка.</li>
            <li><b>Гараж, бокс, небольшая стройка</b> — 15 кВт BR-15A или 22 кВт BR-22A.</li>
            <li><b>Средний каркас, ангар</b> — 36 кВт BR-36AW.</li>
            <li><b>Большой склад, промплощадка</b> — 56 кВт BR-56AW. В гараж её не продаём: топливо уйдёт зря.</li>
          </ul>
        </div>
      </article>
      <article class="card step-card">
        <div class="step-num">4</div>
        <div>
          <h3>Спросите себя: «Что положить в чек вместе с пушкой?»</h3>
          <p>Пушку одну не отпускайте, если без допа она не запустится или будет греть впустую.</p>
          <ul class="list">
            <li><b>BR-22AIW</b> — обязательно рукав тепловой гибкий, диаметр 350 мм, длина 6 м. Плюс дымоход.</li>
            <li><b>BPH-8000TH</b> — обязательно ремкомплект RK-1, артикул 25.02.197.120.</li>
            <li><b>Газ BGH-20M</b> — редуктор 0,7 бар, шланг, баллон.</li>
            <li><b>Любой дизель</b> — канистра топлива, форсунка, свеча, термостат.</li>
            <li><b>Электрика</b> — удлинитель 220 В. На 3 кВт — только нормальное сечение кабеля.</li>
          </ul>
        </div>
      </article>
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
        <article class="card ok"><h3>Непрямой (AIW, BPH)</h3><p>Камера закрытая: воздух помещения идёт в обход пламени. Выхлоп — в дымоход или за борт. Можно работать рядом.</p></article>
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
    const mustBlocks = products.flatMap((p) => p.extras.filter((e) => e.must).map((e) => extraCard(p, e)));

    const byProduct = products.map((p) => {
      const extras = p.extras.filter((e) => !e.must);
      if (!extras.length) return "";
      return `<article class="card group-card">
        <div class="group-head">
          <button class="chip" data-go="product/${p.id}" type="button">${p.name}</button>
          <span class="sku">${p.sku}</span>
        </div>
        <p class="muted group-title">${p.title}</p>
        ${extras.map((e) => {
          const a = extraItem(e);
          return `<div class="extra-row">
            <div class="extra-row-name">${a.name}</div>
            ${buyBlock(a)}
            <div class="why"><b>Зачем:</b> ${e.why}</div>
          </div>`;
        }).join("")}
      </article>`;
    }).join("");

    const extraIndex = {};
    products.forEach((p) => {
      p.extras.filter((e) => !e.must).forEach((e) => {
        if (!extraIndex[e.id]) extraIndex[e.id] = [];
        extraIndex[e.id].push({ product: p, extra: e });
      });
    });
    const byExtra = accessories.filter((a) => extraIndex[a.id]).map((a) => {
      const rows = extraIndex[a.id];
      return `<article class="card group-card">
        <div class="group-head">
          <h3>${a.name}</h3>
        </div>
        ${buyBlock(a)}
        ${rows.map(({ product, extra }) => `
          <div class="extra-row">
            <div class="extra-row-name"><button class="chip" data-go="product/${product.id}" type="button">${product.name}</button> ${product.sku}</div>
            <div class="why"><b>Зачем к ${product.name}:</b> ${extra.why}</div>
          </div>`).join("")}
      </article>`;
    }).join("");

    root.innerHTML = `
      ${hero("Допы: что класть в чек")}
      <article class="card red" style="margin-bottom:16px">
        <h3>Как заказывать доп</h3>
        <p>Если позиция есть в каталоге продавца, но нет у нас — закажи через активный закуп.</p>
        <p>Если этот товар есть на нашем сайте — берите позицию с нашего сайта <a href="https://gvozditut.ru/" target="_blank" rel="noopener">gvozditut.ru</a>: артикул и ссылка доступны в этом обучении.</p>
      </article>
      <div class="grid-2">${mustBlocks.join("")}</div>
      <h2>Остальные допы</h2>
      <div class="chips">
        <button class="chip is-on" type="button" data-view="products">По товарам</button>
        <button class="chip" type="button" data-view="extras">По допам</button>
      </div>
      <div id="extras-by-product">${byProduct}</div>
      <div id="extras-by-extra" class="hidden">${byExtra}</div>
    `;
    root.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        root.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("is-on", b === btn));
        root.querySelector("#extras-by-product").classList.toggle("hidden", view !== "products");
        root.querySelector("#extras-by-extra").classList.toggle("hidden", view !== "extras");
      });
    });
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
        <div class="product-copy">
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
