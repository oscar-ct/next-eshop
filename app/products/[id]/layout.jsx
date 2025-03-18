// Dynamic metadata
import {fetchProduct} from "@/utils/apiFetchRequests";

export async function generateMetadata({ params }) {
    const id = params.id
    const product = await fetchProduct(id);
    return {
        title: "eshopjs | " + product?.name,
        description: product?.description,
    };
}

export default function ProductIdLayout({ children }) {
    return (
        <>{children}</>
    );
};