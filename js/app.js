const UI = {
  els: {},

  init() {
    this.cache();
    this.bindHeader();
    this.renderMenu();
    this.renderCart();
    this.updateAuthUI();
    this.bindModals();
    this.bindCart();
    this.bindCheckout();
    this.bindContact();
    this.bindReveal();
    toggleHeaderState();
  },

  cache() {
    this.els = {
      header: document.getElementById("header"),
      burger: document.getElementById("burger"),
      nav: document.getElementById("nav"),
      cartBtn: document.getElementById("cartBtn"),
      cartBadge: document.getElementById("cartBadge"),
      authBtn: document.getElementById("authBtn"),
      authIconBtn: document.getElementById("authIconBtn"),
      navAuthLink: document.getElementById("navAuthLink"),
      menuGrid: document.getElementById("menuGrid"),
      menuFilters: document.getElementById("menuFilters"),
      cartDrawer: document.getElementById("cartDrawer"),
      cartOverlay: document.getElementById("cartOverlay"),
      cartItems: document.getElementById("cartItems"),
      cartTotal: document.getElementById("cartTotal"),
      cartBonus: document.getElementById("cartBonus"),
      checkoutForm: document.getElementById("checkoutForm"),
      authModal: document.getElementById("authModal"),
      accountModal: document.getElementById("accountModal"),
      loginForm: document.getElementById("loginForm"),
      registerForm: document.getElementById("registerForm"),
      accountContent: document.getElementById("accountContent"),
      palomaLinkForm: document.getElementById("palomaLinkForm"),
      contactForm: document.getElementById("contactForm"),
    };
  },

  formatPrice(n) {
    return `${n.toLocaleString("ru-RU")} ₸`;
  },

  bindHeader() {
    const { burger, nav } = this.els;

    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.classList.toggle("active", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("active");
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("scroll", toggleHeaderState, { passive: true });

    this.els.cartBtn.addEventListener("click", () => this.openCart());
    const openAuthOrAccount = () => {
      const user = Auth.getCurrentUser();
      user ? this.openAccount() : this.openAuth("login");
    };

    this.els.authBtn.addEventListener("click", openAuthOrAccount);
    this.els.authIconBtn?.addEventListener("click", openAuthOrAccount);
    this.els.navAuthLink?.addEventListener("click", (e) => {
      e.preventDefault();
      burger.classList.remove("active");
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      openAuthOrAccount();
    });
  },

  bindModals() {
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => this.closeAllModals());
    });

    document.querySelectorAll(".modal-tab").forEach((tab) => {
      tab.addEventListener("click", () => this.switchAuthTab(tab.dataset.tab));
    });

    this.els.loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    this.els.registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    this.els.palomaLinkForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handlePalomaLink();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeAllModals();
    });
  },

  switchAuthTab(tab) {
    document.querySelectorAll(".modal-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
    document.getElementById("loginPanel").hidden = tab !== "login";
    document.getElementById("registerPanel").hidden = tab !== "register";
  },

  openAuth(tab = "login") {
    this.switchAuthTab(tab);
    this.els.authModal.classList.add("open");
    document.body.classList.add("modal-open");
  },

  openAccount() {
    this.renderAccount();
    this.els.accountModal.classList.add("open");
    document.body.classList.add("modal-open");
  },

  openCart() {
    this.els.cartDrawer.classList.add("open");
    this.els.cartOverlay.classList.add("open");
    document.body.classList.add("modal-open");
    this.renderCart();
  },

  closeAllModals() {
    document.querySelectorAll(".modal, .drawer, .overlay").forEach((el) => el.classList.remove("open"));
    document.body.classList.remove("modal-open");
  },

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  updateAuthUI() {
    const user = Auth.getCurrentUser();
    const label = user ? user.name.split(" ")[0] : "Войти";
    this.els.authBtn.textContent = label;
    this.els.authBtn.classList.toggle("btn--logged", !!user);
    if (this.els.navAuthLink) {
      this.els.navAuthLink.textContent = user ? `Кабинет · ${label}` : "Войти / Регистрация";
    }
  },

  handleLogin() {
    const fd = new FormData(this.els.loginForm);
    try {
      Auth.login({ phone: fd.get("phone"), password: fd.get("password") });
      this.closeAllModals();
      this.updateAuthUI();
      this.prefillCheckout();
      this.showToast("Добро пожаловать!", "success");
    } catch (err) {
      this.showToast(err.message, "error");
    }
  },

  handleRegister() {
    const fd = new FormData(this.els.registerForm);
    if (fd.get("password") !== fd.get("password2")) {
      this.showToast("Пароли не совпадают", "error");
      return;
    }
    try {
      Auth.register({
        name: fd.get("name"),
        phone: fd.get("phone"),
        password: fd.get("password"),
        address: fd.get("address"),
      });
      this.closeAllModals();
      this.updateAuthUI();
      this.prefillCheckout();
      this.showToast(`Регистрация успешна! +${CONFIG.loyalty.welcomeBonus} бонусов`, "success");
    } catch (err) {
      this.showToast(err.message, "error");
    }
  },

  async handlePalomaLink() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const fd = new FormData(this.els.palomaLinkForm);
    const palomaClientId = fd.get("palomaClientId")?.toString().trim();
    const phone = fd.get("palomaPhone")?.toString().trim() || user.phone;

    try {
      const found = await Paloma.findClientByPhone(phone);
      Auth.linkPaloma(user.id, {
        palomaClientId: palomaClientId || found.client?.id || `phone-${Auth.normalizePhone(phone)}`,
        palomaPhone: phone,
      });
      this.renderAccount();
      this.showToast("Аккаунт привязан к Paloma", "success");
    } catch (err) {
      this.showToast(err.message, "error");
    }
  },

  async syncPalomaBonuses() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const result = await Paloma.syncBonuses(user);
    this.renderAccount();
    this.showToast(result.message || (result.synced ? "Бонусы синхронизированы" : "Синхронизация недоступна"), result.synced ? "success" : "info");
  },

  renderAccount() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const link = Storage.getPalomaLink(user.id);
    const orders = Storage.getOrders(user.id).slice(0, 5);

    this.els.accountContent.innerHTML = `
      <div class="account-header">
        <div>
          <h3>${user.name}</h3>
          <p>${user.phoneDisplay}</p>
        </div>
        <div class="account-bonus">
          <span>${user.bonuses}</span>
          <small>бонусов</small>
        </div>
      </div>

      <div class="account-stats">
        <div><strong>${user.ordersCount || 0}</strong><span>заказов</span></div>
        <div><strong>${this.formatPrice(user.totalSpent || 0)}</strong><span>сумма</span></div>
        <div><strong>${CONFIG.loyalty.percentBack}%</strong><span>кэшбэк</span></div>
      </div>

      <div class="account-section">
        <h4>Paloma — накопительная программа</h4>
        <p class="account-note">Привяжите номер телефона из программы лояльности на кассе Paloma. При заказе кассир найдёт вас по номеру и начислит бонусы.</p>
        <div class="paloma-status ${user.palomaLinked ? "paloma-status--linked" : ""}">
          ${user.palomaLinked
            ? `✓ Привязано · ID: ${user.palomaClientId || link?.palomaClientId || "по телефону"}`
            : "Не привязано к Paloma"}
        </div>
        <form id="palomaLinkFormInner" class="stack-form">
          <label>
            <span>Телефон в Paloma</span>
            <input type="tel" name="palomaPhone" value="${Auth.formatPhone(user.phone)}" required>
          </label>
          <label>
            <span>ID клиента Paloma (если есть на чеке)</span>
            <input type="text" name="palomaClientId" placeholder="Необязательно" value="${user.palomaClientId || ""}">
          </label>
          <div class="form-row">
            <button type="submit" class="btn btn--outline">Привязать</button>
            <button type="button" class="btn btn--outline" id="syncPalomaBtn">Синхронизировать</button>
          </div>
        </form>
      </div>

      <div class="account-section">
        <h4>История заказов</h4>
        ${orders.length
          ? `<ul class="order-history">${orders.map((o) => `
              <li>
                <div>
                  <strong>${new Date(o.createdAt).toLocaleString("ru-RU")}</strong>
                  <span>${o.items.length} поз. · ${this.formatPrice(o.total)}</span>
                </div>
                <span class="order-status">${o.status}</span>
              </li>`).join("")}</ul>`
          : "<p class='account-note'>Заказов пока нет</p>"}
      </div>

      <button type="button" class="btn btn--outline btn--full" id="logoutBtn">Выйти</button>
    `;

    document.getElementById("palomaLinkFormInner").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const palomaClientId = fd.get("palomaClientId")?.toString().trim();
      const phone = fd.get("palomaPhone")?.toString().trim();
      Paloma.findClientByPhone(phone).then(() => {
        Auth.linkPaloma(user.id, { palomaClientId: palomaClientId || `phone-${Auth.normalizePhone(phone)}`, palomaPhone: phone });
        this.renderAccount();
        this.updateAuthUI();
        this.showToast("Привязано к Paloma", "success");
      });
    });

    document.getElementById("syncPalomaBtn").addEventListener("click", () => this.syncPalomaBonuses());
    document.getElementById("logoutBtn").addEventListener("click", () => {
      Auth.logout();
      this.updateAuthUI();
      this.closeAllModals();
      this.showToast("Вы вышли из аккаунта");
    });
  },

  renderMenu(filter = "all") {
    const items = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

    this.els.menuFilters.innerHTML = Object.entries(PRODUCT_CATEGORIES)
      .map(([id, label]) => `<button type="button" class="filter-btn ${filter === id ? "active" : ""}" data-filter="${id}">${label}</button>`)
      .join("");

    this.els.menuGrid.innerHTML = items.map((p) => `
      <article class="product-card">
        <div class="product-card__icon">${p.icon}</div>
        <div class="product-card__body">
          <span class="product-card__cat">${PRODUCT_CATEGORIES[p.category] || ""}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="product-card__footer">
            <strong>${p.price === 0 ? "В подарок" : this.formatPrice(p.price)}</strong>
            <button type="button" class="btn btn--sm" data-add="${p.id}">В корзину</button>
          </div>
        </div>
      </article>
    `).join("");

    this.els.menuFilters.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.renderMenu(btn.dataset.filter));
    });

    this.els.menuGrid.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Cart.add(btn.dataset.add);
        this.showToast("Добавлено в корзину", "success");
      });
    });
  },

  bindCart() {
    document.addEventListener("cart:updated", () => {
      this.renderCart();
      this.updateCartBadge();
    });
    this.els.cartOverlay.addEventListener("click", () => this.closeAllModals());
    this.updateCartBadge();
  },

  updateCartBadge() {
    const count = Cart.getCount();
    this.els.cartBadge.textContent = count;
    this.els.cartBadge.hidden = count === 0;
  },

  renderCart() {
    const total = Cart.getTotal();
    const bonus = Cart.calcBonusEarn(total);
    const user = Auth.getCurrentUser();

    this.els.cartTotal.textContent = this.formatPrice(total);
    this.els.cartBonus.textContent = user
      ? `+${bonus} бонусов после заказа · баланс: ${user.bonuses}`
      : `+${bonus} бонусов после входа в аккаунт`;

    if (!Cart.items.length) {
      this.els.cartItems.innerHTML = `<p class="cart-empty">Корзина пуста. Добавьте напитки из меню.</p>`;
      return;
    }

    this.els.cartItems.innerHTML = Cart.items.map((item) => `
      <div class="cart-item" data-id="${item.productId}">
        <div class="cart-item__top">
          <strong>${item.name}</strong>
          <span>${this.formatPrice(item.price * item.qty)}</span>
        </div>
        <div class="cart-item__controls">
          <button type="button" class="qty-btn" data-action="minus">−</button>
          <span>${item.qty}</span>
          <button type="button" class="qty-btn" data-action="plus">+</button>
          <button type="button" class="cart-item__remove" data-action="remove">Удалить</button>
        </div>
        <input type="text" class="cart-item__comment" placeholder="Комментарий к позиции (без сахара, овсяное молоко...)" value="${item.comment || ""}">
      </div>
    `).join("");

    this.els.cartItems.querySelectorAll(".cart-item").forEach((row) => {
      const id = row.dataset.id;
      row.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = Cart.items.find((i) => i.productId === id);
          if (btn.dataset.action === "minus") Cart.setQty(id, item.qty - 1);
          if (btn.dataset.action === "plus") Cart.setQty(id, item.qty + 1);
          if (btn.dataset.action === "remove") Cart.remove(id);
        });
      });
      row.querySelector(".cart-item__comment").addEventListener("change", (e) => {
        Cart.setComment(id, e.target.value);
      });
    });

    this.prefillCheckout();
  },

  prefillCheckout() {
    const user = Auth.getCurrentUser();
    const form = this.els.checkoutForm;
    if (!user || !form) return;
    form.elements.name.value = user.name;
    form.elements.phone.value = user.phoneDisplay;
    if (user.address) form.elements.address.value = user.address;
  },

  bindCheckout() {
    const branchSelect = this.els.checkoutForm.elements.branch;
    branchSelect.innerHTML = CONFIG.branches
      .map((b) => `<option value="${b.name}">${b.label} — ${b.name}</option>`)
      .join("");

    const paymentSelect = this.els.checkoutForm.elements.payment;
    paymentSelect.innerHTML = CONFIG.paymentMethods
      .map((p) => `<option value="${p.id}">${p.label}</option>`)
      .join("");

    paymentSelect.addEventListener("change", () => {
      const remote = ["kaspi", "halyk"].includes(paymentSelect.value);
      document.getElementById("remotePayBlock").hidden = !remote;
    });

    this.els.checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitOrder();
    });
  },

  submitOrder() {
    if (!Cart.items.length) {
      this.showToast("Корзина пуста", "error");
      return;
    }

    const fd = new FormData(this.els.checkoutForm);
    const user = Auth.getCurrentUser();
    const total = Cart.getTotal();
    const bonusEarn = Cart.calcBonusEarn(total);
    const paymentId = fd.get("payment");
    const paymentLabel = CONFIG.paymentMethods.find((p) => p.id === paymentId)?.label || paymentId;
    const useBonuses = fd.get("useBonuses") === "on";
    const bonusSpend = useBonuses && user ? Math.min(user.bonuses, Math.floor(total * 0.3)) : 0;
    const finalTotal = total - bonusSpend;

    const order = {
      id: crypto.randomUUID(),
      userId: user?.id || null,
      name: fd.get("name").toString().trim(),
      phone: fd.get("phone").toString().trim(),
      address: fd.get("address").toString().trim(),
      branch: fd.get("branch"),
      deliveryType: fd.get("deliveryType"),
      payment: paymentId,
      paymentLabel,
      remotePayPhone: fd.get("remotePayPhone")?.toString().trim() || CONFIG.kaspiPayPhone,
      comment: fd.get("orderComment")?.toString().trim() || "",
      items: [...Cart.items],
      total: finalTotal,
      bonusEarn,
      bonusSpend,
      status: "отправлен в WhatsApp",
      createdAt: Date.now(),
    };

    const lines = [
      "☀ *НОВЫЙ ЗАКАЗ — Sun Coffee*",
      "",
      `👤 Имя: ${order.name}`,
      `📞 Телефон: ${order.phone}`,
      `📍 Филиал: ${order.branch}`,
      `🚗 Получение: ${order.deliveryType === "delivery" ? "Доставка" : "Самовывоз"}`,
      order.address ? `🏠 Адрес: ${order.address}` : null,
      "",
      "*Состав заказа:*",
      ...order.items.map((i, n) => {
        const line = `${n + 1}. ${i.name} × ${i.qty} — ${this.formatPrice(i.price * i.qty)}`;
        return i.comment ? `${line}\n   💬 ${i.comment}` : line;
      }),
      "",
      `💰 Сумма: ${this.formatPrice(total)}`,
      bonusSpend ? `🎁 Списано бонусов: −${bonusSpend} ₸` : null,
      bonusSpend ? `💳 К оплате: ${this.formatPrice(finalTotal)}` : null,
      `🎁 Начислится бонусов: +${bonusEarn}`,
      "",
      `💳 Оплата: ${paymentLabel}`,
      ["kaspi", "halyk"].includes(paymentId) ? `📲 Перевод на номер: ${order.remotePayPhone}` : null,
      user?.palomaLinked ? `🔗 Paloma ID: ${user.palomaClientId || "по телефону"}` : null,
      user ? `⭐ Баланс бонусов: ${user.bonuses} → ${(user.bonuses || 0) - bonusSpend + bonusEarn}` : null,
      order.comment ? `\n💬 Комментарий к заказу:\n${order.comment}` : null,
      "",
      "_Заказ с сайта suncoffee.kosshy_",
    ].filter(Boolean);

    if (user) {
      Auth.applyBonuses(user.id, bonusEarn, bonusSpend, finalTotal);
      Auth.updateProfile(user.id, { name: order.name, address: order.address });
    }

    Storage.addOrder(order);
    Paloma.buildOrderPayload(order, user);

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");

    Cart.clear();
    this.closeAllModals();
    this.updateAuthUI();
    this.showToast("Заказ отправлен в WhatsApp!", "success");
  },

  bindContact() {
    this.els.contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(this.els.contactForm);
      const text = [
        "Здравствуйте! Пишу с сайта Sun Coffee.",
        `Имя: ${fd.get("name")}`,
        `Телефон: ${fd.get("phone")}`,
        fd.get("message") ? `Сообщение: ${fd.get("message")}` : null,
      ].filter(Boolean).join("\n");
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
  },

  bindReveal() {
    const revealElements = document.querySelectorAll(
      ".section__head, .about__grid > *, .product-card, .location-card, .review-card, .contact__grid > *"
    );
    revealElements.forEach((el) => el.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));
  },
};

function toggleHeaderState() {
  document.getElementById("header")?.classList.toggle("header--scrolled", window.scrollY > 24);
}

document.addEventListener("DOMContentLoaded", () => UI.init());
