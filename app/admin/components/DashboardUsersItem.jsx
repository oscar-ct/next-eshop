const DashboardUsersItem = ({ user }) => {
    return (
        <div className={"w-6/12 lg:w-4/12 xl:w-4/12 2xl:w-3/12 p-1"}>
            <details className={`collapse ${user.isAdmin ? "skeleton bg-amber-300" : "bg-base-200"}`}>
                <summary className="collapse-title text-xl font-medium px-2 sm:px-5">
                    <div className={"flex flex-col"}>
                        <h3 className="text-gray-500">
                            <span className="font-semibold ml-1 badge badge-md truncate">{user.name}</span>
                        </h3>
                        <h3 className="w-full text-gray-500">
                            <span className="w-full font-semibold ml-1 bg-white text-xs sm:text-sm rounded-full px-2 truncate ...">{user.email}</span>
                        </h3>
                    </div>
                </summary>
                <div className="collapse-content px-2">
                    {
                        user.shippingAddresses.length !== 0 ? (
                            <>
                                <p className={"text-gray-500 text-base font-semibold px-2"}>Saved Addresses</p>
                                <div className={"flex flex-wrap items-start pt-2"}>
                                    {
                                        user.shippingAddresses.map((address, index) => {
                                            return (
                                                <div className={"w-full sm:w-6/12 p-1"} key={index}>
                                                    <div className={"rounded-xl bg-white p-3 text-gray-500 text-xs"}>
                                                        <p>{address.name}</p>
                                                        <p>{address.address}</p>
                                                        <p>{address.city}</p>
                                                        <p>{address.state}, {address.postalCode}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        ) : (
                            <p className={"text-gray-500 text-base font-semibold px-2"}>No Saved Addresses</p>
                        )
                    }
                </div>
            </details>
        </div>
    );
};

export default DashboardUsersItem;