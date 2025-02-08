export async function generateMetadata({ params }) {
    const sortTerm = params.sortTerm
    const categoryTerm = params.categoryTerm
    return {
        title: `eshopjs | Products: ${sortTerm.substring(0,1).toUpperCase() + sortTerm.substring(1, sortTerm.length)} - ${categoryTerm.substring(0,1).toUpperCase() + categoryTerm.substring(1, categoryTerm.length)}`,
    };
}

export default function RootLayout({ children }) {
    return (
        <div className={"overflow-x-clip relative"}>
            {children}
            <div
                className={"z-0 scale-125 -rotate-6 m-auto absolute w-full top-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}/>
        </div>
    );
};