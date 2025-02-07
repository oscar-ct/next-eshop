export const metadata = {
    title: "eshopjs | Existing Order",
};

export default function RootLayout({ children }) {
    return (
        <div className={"overflow-x-clip relative"}>
            {children}
            <div
                className={"z-0 scale-125 -rotate-6 m-auto absolute w-full top-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}/>
        </div>
    );
};