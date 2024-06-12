import { Schema, model, models } from "mongoose";

const orderSchema = new Schema({
    user: {
            id: {
                type: Schema.Types.ObjectId,
                // required: true,
                ref: "User",
            },
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
        },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            brand: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            images: [
                {
                    url: {
                        type: String
                    },
                    handle: {
                        type: String
                    }
                }
            ],
            price: {
                type: Number,
                required: true,
            },
            isPaid: {
                type: Boolean,
                default: false,
            },
            isCanceled: {
                type: Boolean,
                default: false,
            },
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            }
        }
    ],
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        }
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: {
            type: String
        },
        status: {
            type: String
        },
        update_time: {
            type: String
        },
        email_address: {
            type: String
        }
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isCanceled: {
        type: Boolean,
        required: true,
        default: false,
    },
    canceledAt: {
        type: Date,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    canceledItems: [
        {
            productId: {
                type: String
            },
            productPrice: {
                type: Number
            },
            productQuantity: {
                type: Number
            },
            canceledAt: {
                type: Date
            }
        }
    ],
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paidAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    isShipped: {
        type: Boolean,
        required: true,
        default: false,
    },
    trackingNumber: {
        type: String,
        default: "",
    },
    isReimbursed: {
        type: Boolean,
        required: true,
        default: false,
    },
    reimbursedAt: {
        type: Date,
    },
    reimbursedAmount: {
        required: true,
        default: 0,
        type: Number,
    },

},
{
    timestamps: true,
});

const Order = models.Order || model("Order", orderSchema);

export default Order;