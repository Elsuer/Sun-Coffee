const Cart = {
  items: Storage.getCart(),

  save() {
    Storage.saveCart(this.items);
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },

  add(productId, qty = 1) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const existing = this.items.find((i) => i.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({
        productId,
        qty,
        comment: "",
        price: product.price,
        name: product.name,
      });
    }
    this.save();
  },

  remove(productId) {
    this.items = this.items.filter((i) => i.productId !== productId);
    this.save();
  },

  setQty(productId, qty) {
    const item = this.items.find((i) => i.productId === productId);
    if (!item) return;
    if (qty <= 0) {
      this.remove(productId);
      return;
    }
    item.qty = qty;
    this.save();
  },

  setComment(productId, comment) {
    const item = this.items.find((i) => i.productId === productId);
    if (item) {
      item.comment = comment;
      this.save();
    }
  },

  clear() {
    this.items = [];
    this.save();
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCount() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  calcBonusEarn(total) {
    if (total < CONFIG.loyalty.minOrderForBonus) return 0;
    return Math.floor(total * (CONFIG.loyalty.percentBack / 100));
  },
};
