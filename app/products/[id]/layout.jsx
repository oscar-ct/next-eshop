// Dynamic metadata
import {fetchProduct} from "@/utils/api-requests/fetchRequests";

export async function generateMetadata({ params, searchParams }) {

    const id = params.id
    const product = await fetchProduct(id);
    return {
        title: "e-shop | " + product.name,
        description: product.description,
    }
}

export default function RootLayout({ children }) {
    return (
        <>{children}</>
    );
};