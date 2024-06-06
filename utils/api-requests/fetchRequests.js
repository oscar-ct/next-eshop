import toast from "react-hot-toast";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

const putJsonReturnJsonErrorNull = async (pathName, body) => {
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}${pathName}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const getDataReturnJsonErrorNull = async (pathName) => {
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}${pathName}`);
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const deleteDataReturnJsonErrorNull = async (pathName) => {
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}${pathName}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const postJsonReturnJsonErrorNull = async (pathName, body) => {
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}${pathName}`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};


export const fetchUpdateUserCredentials = async (body) => {
    return await putJsonReturnJsonErrorNull("/auth/credentials", body);
};

export const fetchUser = async (id) => {
    return await getDataReturnJsonErrorNull(`/users/${id}`);
};

export const fetchRegister = async (body) => {
    return await postJsonReturnJsonErrorNull(`/auth/register`, body);
};

export const fetchUserOrders = async (id) => {
    return await getDataReturnJsonErrorNull(`/orders/user/${id}`);
};

export const fetchCancelOrder = async (id) => {
    return await deleteDataReturnJsonErrorNull(`/orders/${id}/cancel`);
};

export const fetchCancelProduct = async (id, productId) => {
    return await deleteDataReturnJsonErrorNull(`/orders/${id}/cancel/product/${productId}`);
};

export const fetchProduct = async (id) => {
    return await getDataReturnJsonErrorNull(`/products/${id}`);
};

export const fetchTopRatedProducts = async () => {
    return await getDataReturnJsonErrorNull(`/products/toprated`);
};

export const fetchDiscountValidity = async (body) => {
    return await postJsonReturnJsonErrorNull(`/discount`, body);
};

export const fetchPayOrder = async (body) => {
    return await putJsonReturnJsonErrorNull(`/orders/pay`, body);
};

export const fetchVerifiedOrderDollarAmount = async (body) => {
    return await postJsonReturnJsonErrorNull(`/products/verifyusd`, body);
};

export const fetchNewOrder = async (body) => {
    return await postJsonReturnJsonErrorNull(`/orders/add`, body);
};

export const fetchStripePaymentIntent = async (body) => {
    return await postJsonReturnJsonErrorNull(`/stripe/paymentintent`, body);
};

export const fetchVerifyEmail = async (body) => {
    return await postJsonReturnJsonErrorNull(`/auth/verify/email`, body);
};

export const fetchVerifyOrder = async (body) => {
    return await postJsonReturnJsonErrorNull(`/orders/validate`, body);
};

export const fetchOrder = async (id) => {
    return await getDataReturnJsonErrorNull(`/orders/${id}`);
};

export const fetchUserAddress = async (id, body) => {
    return await putJsonReturnJsonErrorNull(`/users/${id}/updateaddress`, body);
};

export const fetchProducts = async () => {
    return await getDataReturnJsonErrorNull(`/products/sort/latest/select/all/page/1`);
};

export const fetchProductCategories = async () => {
    return await getDataReturnJsonErrorNull(`/products/categories`);
};















