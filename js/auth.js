const Auth = {
  normalizePhone(phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("8")) return "7" + digits.slice(1);
    if (digits.length === 10) return "7" + digits;
    return digits;
  },

  formatPhone(phone) {
    const d = this.normalizePhone(phone);
    if (d.length !== 11) return phone;
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  },

  hashPassword(password) {
    return btoa(unescape(encodeURIComponent(password + "::suncoffee")));
  },

  getCurrentUser() {
    const session = Storage.getSession();
    if (!session?.userId) return null;
    return Storage.getUsers().find((u) => u.id === session.userId) || null;
  },

  register({ name, phone, password, address = "" }) {
    const normalized = this.normalizePhone(phone);
    if (normalized.length !== 11) throw new Error("Введите корректный номер телефона");

    const users = Storage.getUsers();
    if (users.some((u) => u.phone === normalized)) {
      throw new Error("Пользователь с таким телефоном уже зарегистрирован");
    }

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: normalized,
      phoneDisplay: this.formatPhone(normalized),
      passwordHash: this.hashPassword(password),
      address: address.trim(),
      bonuses: CONFIG.loyalty.welcomeBonus,
      totalSpent: 0,
      ordersCount: 0,
      palomaLinked: false,
      palomaClientId: null,
      createdAt: Date.now(),
    };

    users.push(user);
    Storage.saveUsers(users);
    Storage.setSession(user.id);
    return user;
  },

  login({ phone, password }) {
    const normalized = this.normalizePhone(phone);
    const user = Storage.getUsers().find((u) => u.phone === normalized);
    if (!user || user.passwordHash !== this.hashPassword(password)) {
      throw new Error("Неверный телефон или пароль");
    }
    Storage.setSession(user.id);
    return user;
  },

  logout() {
    Storage.clearSession();
  },

  updateProfile(userId, data) {
    const users = Storage.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error("Пользователь не найден");

    users[index] = {
      ...users[index],
      name: data.name?.trim() || users[index].name,
      address: data.address?.trim() ?? users[index].address,
      phoneDisplay: this.formatPhone(users[index].phone),
    };

    Storage.saveUsers(users);
    return users[index];
  },

  applyBonuses(userId, earned, spent = 0, orderTotal = 0) {
    const users = Storage.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    users[index].bonuses = Math.max(0, (users[index].bonuses || 0) + earned - spent);
    users[index].totalSpent = (users[index].totalSpent || 0) + orderTotal;
    users[index].ordersCount = (users[index].ordersCount || 0) + 1;

    Storage.saveUsers(users);
    return users[index];
  },

  linkPaloma(userId, { palomaClientId, palomaPhone }) {
    const users = Storage.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error("Пользователь не найден");

    users[index].palomaLinked = true;
    users[index].palomaClientId = palomaClientId || users[index].palomaClientId;
    Storage.saveUsers(users);

    Storage.savePalomaLink(userId, {
      palomaClientId: users[index].palomaClientId,
      phone: palomaPhone || users[index].phone,
      linkedAt: Date.now(),
    });

    return users[index];
  },
};
