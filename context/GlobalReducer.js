const globalReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            const itemUserAddedToCart = action.payload;
            const cartItem = state.cartItems.find(function (cartItem) {
                return itemUserAddedToCart._id === cartItem._id;
            });
            if (cartItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((item) => {
                       return itemUserAddedToCart._id === item._id ? {...itemUserAddedToCart} : item
                    }),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, itemUserAddedToCart],
                }
            }
        case "REMOVE_FROM_CART":
            const itemUserRemovedFromCart = action.payload;
            if (state.cartItems.length !== 1) {
                const cart = state.cartItems.filter(function (item) {
                    return item._id !== itemUserRemovedFromCart;
                });
                return {
                    ...state,
                    cartItems: cart,
                }
            } else {
                return {
                    cartItems: [],
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                    shippingAddress: {},
                    paymentMethod: null,
                    discount: false,
                    discountKey: "",
                    publishableKey: "",
                    guestData: ""
                }
            }
        case "UPDATE_CART":
            if (state.cartItems.length === 0) {
                return state;
            } else {
                const addDecimals = (num) => {
                    return Math.round(num * 1e2) / 1e2;
                }
                const itemsPrice = addDecimals(state.cartItems.reduce(function (acc, item) {
                    return (acc + item.price * item.quantity);
                }, 0));
                const shippingPrice = state.discount ? 0 : Math.round(itemsPrice > 100 ? 0 : 10);
                const taxableAmount = itemsPrice + shippingPrice;
                const taxPrice = addDecimals(0.0825 * taxableAmount);
                const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);
                return {
                    ...state,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                }
            }
        case "CLEAR_CART":
            localStorage.removeItem("cart");
            return {
                cartItems: [],
                itemsPrice: 0,
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: 0,
                shippingAddress: {},
                paymentMethod: null,
                discount: false,
                discountKey: "",
                publishableKey: "",
                guestData: ""
            };

        case "SET_LOCAL_STORAGE":
            localStorage.setItem("cart", JSON.stringify(state));
            return state;
        case "SET_SHIPPING_DATA":
            return {
                ...state,
                shippingAddress: action.payload
            }
        case "SET_PAYMENT_METHOD":
            return {
                ...state,
                paymentMethod: action.payload
            }
        case "SET_DISCOUNT":
            return {
                ...state,
                discount: action.payload
            }
        case "SET_DISCOUNT_KEY":
            return {
                ...state,
                discountKey: action.payload
            }
        case "SET_PUBLISHABLE_KEY":
            return {
                ...state,
                publishableKey: action.payload
            }
        case "SET_GUEST_DATA":
            return {
                ...state,
                guestData: action.payload
            }
        default:
            return state;
    }
};

export default globalReducer;