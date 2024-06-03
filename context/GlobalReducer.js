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
                publishableKey: "",
                guestData: "",
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
                publishableKey: "",
                guestData: "",
                user: null,
                cancelIntentData: null,
            };
        case "SET_LOCAL_STORAGE":
            localStorage.setItem("cart", JSON.stringify(state));
            return state;
        case "ADD_USER":
            return {
                ...state,
                user: action.payload
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
            console.log("case missed...")
            return state;
    }
};

export default globalReducer;