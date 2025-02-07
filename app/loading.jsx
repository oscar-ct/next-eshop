export const metadata = {
    title: "e-shop | Loading...",
};

const Loading = () => {
    return (
        <div
            className={"overflow-x-clip  relative mx-auto min-h-[calc(100vh-336px)] md:min-h-[calc(100vh-288px)] flex items-center justify-center"}>
            <span className="z-30 loading loading-bars loading-lg"/>
            <div
                className={"z-0 scale-125 -rotate-6 m-auto absolute w-full top-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}/>
        </div>
    );
};

export default Loading;