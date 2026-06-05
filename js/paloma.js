const Paloma = {
  async request(endpoint, options = {}) {
    const { authKey, apiBase, proxyUrl } = CONFIG.paloma;
    if (!authKey && !proxyUrl) {
      throw new Error("Paloma API не настроен. Укажите API AUTHKEY в js/config.js");
    }

    const url = proxyUrl
      ? `${proxyUrl}?endpoint=${encodeURIComponent(endpoint)}`
      : `${apiBase}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authKey}`,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Paloma API error ${response.status}`);
    }

    return response.json();
  },

  async findClientByPhone(phone) {
    const normalized = Auth.normalizePhone(phone);

    if (!CONFIG.paloma.authKey && !CONFIG.paloma.proxyUrl) {
      return {
        found: false,
        mock: true,
        message: "Локальный режим: клиент будет найден в Paloma по номеру при пробитии заказа",
        phone: normalized,
      };
    }

    try {
      const data = await this.request(`/clients?phone=${normalized}`, { method: "GET" });
      const client = Array.isArray(data) ? data[0] : data?.client || data;
      return { found: !!client, client, phone: normalized };
    } catch (error) {
      return { found: false, error: error.message, phone: normalized };
    }
  },

  async syncBonuses(user) {
    const link = Storage.getPalomaLink(user.id);

    if (!CONFIG.paloma.authKey && !CONFIG.paloma.proxyUrl) {
      return {
        synced: false,
        bonuses: user.bonuses,
        message: "Бонусы на сайте. При оплате в Paloma назовите номер телефона — кассир применит программу лояльности.",
        palomaClientId: user.palomaClientId || link?.palomaClientId || null,
      };
    }

    try {
      const clientId = user.palomaClientId || link?.palomaClientId;
      if (!clientId) {
        const found = await this.findClientByPhone(user.phone);
        if (found.client?.id) {
          Auth.linkPaloma(user.id, { palomaClientId: found.client.id, palomaPhone: user.phone });
        }
      }

      const id = user.palomaClientId || Storage.getPalomaLink(user.id)?.palomaClientId;
      if (!id) {
        return { synced: false, bonuses: user.bonuses, message: "Клиент не найден в Paloma. Проверьте номер на кассе." };
      }

      const data = await this.request(`/clients/${id}`, { method: "GET" });
      const bonuses = data?.bonus_balance ?? data?.bonuses ?? user.bonuses;

      const users = Storage.getUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx].bonuses = bonuses;
        Storage.saveUsers(users);
      }

      return { synced: true, bonuses, palomaClientId: id };
    } catch (error) {
      return { synced: false, bonuses: user.bonuses, error: error.message };
    }
  },

  buildOrderPayload(order, user) {
    return {
      source: "suncoffee_website",
      company: CONFIG.paloma.companyName,
      client: {
        name: order.name,
        phone: Auth.normalizePhone(order.phone),
        palomaClientId: user?.palomaClientId || null,
        bonuses: user?.bonuses || 0,
      },
      branch: order.branch,
      items: order.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
        comment: i.comment || "",
      })),
      total: order.total,
      payment: order.payment,
      comment: order.comment,
      createdAt: new Date().toISOString(),
    };
  },
};
