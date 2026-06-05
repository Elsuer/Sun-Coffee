const Storage = {
  KEYS: {
    users: "suncoffee_users",
    session: "suncoffee_session",
    cart: "suncoffee_cart",
    orders: "suncoffee_orders",
    palomaLinks: "suncoffee_paloma_links",
  },

  read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getUsers() {
    return this.read(this.KEYS.users, []);
  },

  saveUsers(users) {
    this.write(this.KEYS.users, users);
  },

  getSession() {
    return this.read(this.KEYS.session, null);
  },

  setSession(userId) {
    this.write(this.KEYS.session, { userId, at: Date.now() });
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.session);
  },

  getCart() {
    return this.read(this.KEYS.cart, []);
  },

  saveCart(cart) {
    this.write(this.KEYS.cart, cart);
  },

  getOrders(userId) {
    const all = this.read(this.KEYS.orders, []);
    return userId ? all.filter((o) => o.userId === userId) : all;
  },

  addOrder(order) {
    const all = this.read(this.KEYS.orders, []);
    all.unshift(order);
    this.write(this.KEYS.orders, all.slice(0, 100));
  },

  getPalomaLinks() {
    return this.read(this.KEYS.palomaLinks, {});
  },

  savePalomaLink(userId, data) {
    const links = this.getPalomaLinks();
    links[userId] = { ...data, updatedAt: Date.now() };
    this.write(this.KEYS.palomaLinks, links);
  },

  getPalomaLink(userId) {
    return this.getPalomaLinks()[userId] || null;
  },
};
