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

  function nameLink(item) {
    if (!item.url) return item.name;
    return `<a class="buy-link" href="${item.url}" target="_blank" rel="noopener">${item.name}</a>`;
  }

  function buyBlock(item) {
    const sku = item.sku ? `<span class="sku">арт. ${item.sku}</span>` : "";
    const via = item.order === "catalog"
      ? `<div class="order-via">Закажи через активный закуп</div>`
      : "";
    if (!sku && !via) return "";
    return `<div class="buy-line">${sku}${via}</div>`;
  }

  function extraCard(product, extra) {
    const a = extraItem(extra);
    return `<article class="card acc-card ${extra.must ? "must" : ""}">
      ${extra.must ? `<div class="must-flag">Обязательно предлагать</div>` : ""}
      ${a.image ? `<div class="photo-stage extra-photo"><img src="${a.image}" alt="${a.name}"></div>` : ""}
      <h3>${nameLink(a)}</h3>
      ${buyBlock(a)}
      <div class="why"><b>Зачем к ${product.name}:</b> ${extra.why}</div>
    </article>`;
  }

  function renderHome() {
    setActive("home");
    root.innerHTML = `
      ${hero("Обучение по тепловому оборудованию BRAIT")}
      <p class="byline">Категорийный менеджер: <b>Эльвира Носкова</b> · дата публикации <b>15.09.2026</b></p>
      <section class="howto">
        <h2>Как пользоваться курсом</h2>
        <ol>
          <li><b>Слева меню.</b> Там главная, бренд, как продавать линейку, типы нагрева, допы и каждая пушка — отдельная вкладка.</li>
          <li><b>Откройте модель.</b> На карточке фото, как её продать в зале, преимущества и важные ТТХ.</li>
          <li><b>Допы внизу карточки.</b> Что класть в тот же чек и зачем именно к этой пушке. Если есть ссылка — это карточка на gvozditut.ru.</li>
          <li><b>Вкладка «Допы».</b> Весь список сразу: по товарам или по позициям. Нет на витрине, есть у продавца — закажи через активный закуп.</li>
        </ol>
      </section>
      <div class="grid-3">
        <article class="card red"><h3>1. Не продавайте «просто пушку»</h3><p>Сначала сценарий: улица или помещение, люди внутри или нет, газ / дизель / розетка, площадь и высота. От этого зависит жизнь клиента и возврат товара.</p></article>
        <article class="card red"><h3>2. Собирайте комплект</h3><p>Газ без редуктора не стартует. К BR-22AIW сразу рукав Ø350 мм / 6 м. К BPH-8000TH сразу ремкомплект RK-1. Доп — не «навязывание», а условие нормальной работы.</p></article>
        <article class="card red"><h3>3. Считайте расход вслух</h3><p>Клиент думает киловаттами, платит литрами и килограммами. Назовите расход в час и бак — сделка становится конкретной.</p></article>
      </div>
      <article class="card red" style="margin-top:16px">
        <h3>Что продаём мы</h3>
        <p>В этом курсе только артикулы нашей витрины — то, что реально стоит на продаже. Не вся линейка BRAIT с завода, а наш ассортимент.</p>
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
      <section class="forbid">
        <h2>Чего <span>нельзя</span> обещать</h2>
        <ul class="list">
          <li>Прямой дизель и газ — «как батарея в квартире».</li>
          <li>BFH-2 / BFH-2S на 2 кВт — «прогреет склад».</li>
          <li>Непрямой нагрев — «можно без трубы и без рукава».</li>
        </ul>
      </section>
    `;
  }

  function renderHeat() {
    setActive("heat-types");
    root.innerHTML = `
      ${hero("Прямой и непрямой нагрев", "Сначала это, потом модель. Ошиблись типом — клиент дышит выхлопом, товар пахнет соляркой, возврат и претензия.")}
      <article class="card red">
        <h3>Один вопрос решает всё</h3>
        <p class="heat-q">«Люди или товар будут в этом помещении, пока пушка работает?»</p>
        <ul class="list">
          <li><b>Нет</b> — стройка, каркас, улица, пустой ангар на ночь. Можно прямой нагрев: газ BGH-20M или дизель A / AW.</li>
          <li><b>Да</b> — цех, павильон, склад с товаром, бытовка. Только непрямой: BR-22AIW, BPH-8000TH. Либо электрика BFH, там нет выхлопа вообще.</li>
        </ul>
      </article>
      <h2>В чём разница, на пальцах</h2>
      <div class="grid-2">
        <article class="card warn">
          <h3>Прямой нагрев — костёр с вентилятором</h3>
          <p>Пламя греет воздух, и этот же воздух сразу вылетает из пушки в помещение. Вместе с теплом идут запах, влага и продукты сгорания.</p>
          <p>Как газовая горелка на улице: жарко и дёшево, но стоять над ней и дышать нельзя.</p>
          <p><b>У нас:</b> BGH-20M, BR-15A, BR-22A, BR-36AW, BR-56AW.</p>
        </article>
        <article class="card ok">
          <h3>Непрямой нагрев — батарея с трубой</h3>
          <p>Пламя сидит в закрытой камере. Воздух помещения греется о стенки, как о батарею. Выхлоп уходит в дымоход или за борт — в комнату не попадает.</p>
          <p>Как котёл в котельной: тепло в доме, дым на улице. Без трубы это уже не непрямой нагрев.</p>
          <p><b>У нас:</b> BR-22AIW и портативная BPH-8000TH.</p>
        </article>
      </div>
      <h2>На что это влияет в продаже</h2>
      <div class="grid-2">
        <article class="card">
          <h3>Здоровье и претензии</h3>
          <p>Прямой нагрев в глухом помещении — головная боль, резь в глазах, «нас отравили». Это возврат и разговор с юристом, не «клиент сам виноват».</p>
        </article>
        <article class="card">
          <h3>Товар и отделка</h3>
          <p>Копоть садится на штукатурку, картон, одежду, продукты. Клиент скажет «пушка коптит» — хотя вы продали прямой нагрев туда, где нужен непрямой.</p>
        </article>
        <article class="card">
          <h3>Цена, расход, скорость</h3>
          <p>Прямой дешевле и почти всё тепло идёт в воздух — быстрее «жарит». Непрямой чуть дороже: часть тепла уходит в трубу, зато люди могут работать рядом.</p>
        </article>
        <article class="card">
          <h3>Что класть в чек</h3>
          <p>Непрямой без дымохода не работает как задумано. К BR-22AIW ещё рукав Ø350 мм / 6 м — иначе тепло бьёт в одну точку. Прямому рукав и труба не нужны.</p>
        </article>
      </div>
      <h2>Примеры из зала</h2>
      <article class="card">
        <div class="extra-row">
          <div class="extra-row-name">Натяжные потолки, бригада на час</div>
          <p>Помещение проветривают, люди не живут внутри. <b>Прямой газ BGH-20M</b> — быстро и дёшево.</p>
        </div>
        <div class="extra-row">
          <div class="extra-row-name">Каркас, сушка стяжки, ночью никого нет</div>
          <p><b>Прямой дизель</b> BR-15A / 22A / 36AW / 56AW по площади. Выхлоп в воздух — нормально, если нет постоянного персонала.</p>
        </div>
        <div class="extra-row">
          <div class="extra-row-name">Цех, павильон, склад с товаром, люди весь день</div>
          <p>Только <b>непрямой BR-22AIW</b> + труба + рукав. Прямой сюда нельзя, даже если «так дешевле».</p>
        </div>
        <div class="extra-row">
          <div class="extra-row-name">Бытовка, кунг, кабина, маленький гараж</div>
          <p><b>Портативная непрямая BPH-8000TH</b>: выхлоп наружу, воздух внутри чистый. 8 кВт — комната, не ангар.</p>
        </div>
        <div class="extra-row">
          <div class="extra-row-name">Дом, офис, розетка 220 В, без солярки и газа</div>
          <p><b>Электрика BFH-2 / 2S / 3</b>. Нагрева нет пламени, выхлопа нет. Склад на 2 кВт не греют.</p>
        </div>
      </article>
      <h2>Как читать название BRAIT</h2>
      <table class="ttx card" style="padding:0">
        <tr><th>A / AW</th><td>Дизель <b>прямого</b> нагрева. AW — обычно уже с колёсами и большим баком.</td></tr>
        <tr><th>AIW</th><td>Дизель <b>непрямого</b> нагрева (Indirect). У нас это BR-22AIW.</td></tr>
        <tr><th>BGH</th><td>Газ, у нас BGH-20M — тоже прямой нагрев.</td></tr>
        <tr><th>BPH</th><td>Портативный непрямой. У нас BPH-8000TH, 5–8 кВт.</td></tr>
        <tr><th>BFH</th><td>Электрическая керамика. Не прямой и не непрямой — просто ТЭН, без выхлопа.</td></tr>
      </table>
    `;
    bindGo(root);
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
            <div class="extra-row-name">${nameLink(a)}</div>
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
          <h3>${nameLink(a)}</h3>
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
          <h1>${p.shopUrl ? `<a class="shop-product-link" href="${p.shopUrl}" target="_blank" rel="noopener">${p.title}</a>` : p.title}</h1>
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
