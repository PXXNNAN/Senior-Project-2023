export default {
  // synchronous
  ADD_CART(state, payload) {
    // Check if the item already exists
    if (
      !!state.cart.find(
        item =>
          item.Inventory_Number === payload.Inventory_Number &&
          item.Year === payload.Year
      )
    )
      return;
    // if (state.cart.indexOf(payload) !== -1) return;
    state.cart.push(payload);
  },

  REMOVE_CART(state, payload) {
    const removeIndex = state.cart.indexOf(payload);
    state.cart.splice(removeIndex, 1);
  },

  CLEAR_CART(state, payload) {
    state.cart = [];
  },

  ADD_ITEMS(state, payload) {
    state.items = payload;
  },

  UPDATE_ITEM_BORROW_STATUS(state, payload) {
    const updateIndex = state.items.findIndex(
      el => el.Inventory_Number === payload.item.Inventory_Number
    );
    state.items[updateIndex].Borrow_Status = payload.data;
  },

  CLEAR_ITEMS(state, payload) {
    state.items = [];
  },

  Request(state, payload) {}
};