const globalReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            const itemUserAddedToCart = action.payload;
            const cartItem = state.cartItems.find(function (cartItem) {
                return itemUserAddedToCart.id === cartItem.id;
            });
            if (cartItem) {
                return {
                    ...state,
                    addToCartId: itemUserAddedToCart.id,
                    cartItems: state.cartItems.map((item) => {
                       return itemUserAddedToCart.id === item.id ? {...itemUserAddedToCart} : item
                    }),
                }
            } else {
                return {
                    ...state,
                    addToCartId: itemUserAddedToCart.id,
                    cartItems: [...state.cartItems, itemUserAddedToCart],
                }
            }
        case "REMOVE_FROM_CART":
            const itemUserRemovedFromCart = action.payload;
            if (state.cartItems.length !== 1) {
                const cart = state.cartItems.filter(function (item) {
                    return item.id !== itemUserRemovedFromCart;
                });
                return {
                    ...state,
                    cartItems: cart,
                }
            } else {
                return {
                    ...state,
                    cartItems: [],
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                    shippingAddress: {},
                    paymentMethod: null,
                    discount: false,
                    discountKey: "",
                    guestData: ""
                }
            }
        case "UPDATE_CART":
            if (state.cartItems.length === 0) {
                return state;
            } else {
                const itemsPrice = state.cartItems.reduce(function (acc, item) {
                    return acc + (item.price * item.quantity);
                }, 0);
                const shippingPrice = state.discount ? 0 : itemsPrice > 10000 ? 0 : 1000;
                const taxableAmount = itemsPrice + shippingPrice;
                const taxPrice = Math.round(0.0825 * taxableAmount);
                const totalPrice = itemsPrice + shippingPrice + taxPrice;
                return {
                    ...state,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                }
            }
        case "CLEAR_CART":
            return {
                ...state,
                cartItems: [],
                itemsPrice: 0,
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: 0,
                shippingAddress: {},
                paymentMethod: null,
                discount: false,
                discountKey: "",
                guestData: "",
                authToken: "",
            };
        case "RESET_STATE":
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
                guestData: "",
                user: null,
                cancelIntentData: null,
                authToken: "",
            };
        case "SET_LOCAL_STORAGE":
            localStorage.setItem("cart", JSON.stringify(state));
            return state;
        case "ADD_USER":
            return {
                ...state,
                user: action.payload
            }
        case "SET_AUTH_TOKEN":
            return {
                ...state,
                authToken: action.payload
            }
        case "UPDATE_CANCEL_INTENT_DATA":
            return {
                ...state,
                cancelIntentData: action.payload
            }
        case "UPDATE_USER_ADDRESSES":
            return {
                ...state,
                user: {
                    ...state.user,
                    shippingAddresses: action.payload
                }
            }
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
        case "ADD_DISCOUNT":
            return {
                ...state,
                discount: true,
                discountKey: action.payload
            }
        case "REMOVE_DISCOUNT":
            return {
                ...state,
                discount: false,
                discountKey: ""
            }
        case "SET_GUEST_EMAIL":
            return {
                ...state,
                guestEmail: action.payload
            }
        default:
            console.log("case missed...")
            return state;
    }
};

export default globalReducer;