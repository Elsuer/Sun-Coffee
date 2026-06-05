const CONFIG = {
  phone: "+7 (707) 777-32-78",
  phoneRaw: "77077773278",
  whatsapp: "77077773278",
  instagram: "https://www.instagram.com/suncoffee.kosshy",
  kaspiPayPhone: "+7 (707) 777-32-78",

  loyalty: {
    percentBack: 5,
    minOrderForBonus: 500,
    welcomeBonus: 100,
  },

  paloma: {
    enabled: true,
    apiBase: "https://api.paloma365.com",
    authKey: "",
    proxyUrl: "",
    companyName: "Sun Coffee",
  },

  branches: [
    { id: "tole", name: "ул. Толе би, 2е", label: "Основной филиал" },
    { id: "lesnaya", name: "ул. Лесная поляна, 17", label: "Филиал 2" },
  ],

  paymentMethods: [
    { id: "cash", label: "Наличными при получении" },
    { id: "card", label: "Картой в кофейне" },
    { id: "kaspi", label: "Удалённо — Kaspi перевод" },
    { id: "halyk", label: "Удалённо — Halyk / другой банк" },
  ],
};
