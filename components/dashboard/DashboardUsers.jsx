import {useEffect, useState} from "react";
import {fetchAdminUsers} from "@/utils/api-requests/fetchRequests";
import DashboardUsersItem from "@/components/dashboard/DashboardUsersItem";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const DashboardUsers = () => {


    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState(null);


    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const users = await fetchAdminUsers();
                setUsers(users);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (users === null) fetchUsersData();
    }, [users]);

    if (users && !loading) return (
        <>
            <section className={"flex justify-evenly flex-wrap"}>
                {
                    users.map(function (user) {
                        return <DashboardUsersItem user={user} key={user._id}/>
                    })
                }
            </section>
        </>

    );
    return <DashboardLoading/>
};

export default DashboardUsers;