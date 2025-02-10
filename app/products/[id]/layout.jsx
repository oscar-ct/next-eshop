// Dynamic metadata
import {fetchProduct} from "@/utils/api-requests/fetchRequests";

export async function generateMetadata({ params }) {

    const id = params.id
    const product = await fetchProduct(id);
    return {
        title: "eshopjs | " + product?.name,
        description: product?.description,
    }
}

export default function RootLayout({ children }) {
    return (
        <>{children}</>
    );
};