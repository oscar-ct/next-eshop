export const metadata = {
    title: "e-shop | Loading...",
};

const Loading = () => {
    return (
        <div
            className={"mx-auto min-h-[calc(100vh-288px)] md:min-h-[calc(100vh-224px)] flex items-center justify-center"}>
            <span className="z-30 loading loading-bars loading-lg"/>
        </div>
    );
};

export default Loading;