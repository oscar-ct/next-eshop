export async function generateMetadata({ params }) {
    const sortTerm = params.sortTerm
    const categoryTerm = params.categoryTerm
    return {
        title: `ShopOscar.com | Products: ${sortTerm.substring(0,1).toUpperCase() + sortTerm.substring(1, sortTerm.length)} - ${categoryTerm.substring(0,1).toUpperCase() + categoryTerm.substring(1, categoryTerm.length)}`,
    };
}

export default function FilterProductsLayout({ children }) {
    return (
        <>{children}</>
    );
};