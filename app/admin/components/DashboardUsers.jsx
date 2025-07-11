import {useEffect, useState} from "react";
import {fetchAdminUsers} from "@/utils/apiFetchRequests";
import DashboardUsersItem from "@/app/admin/components/DashboardUsersItem";
import DashboardLoading from "@/app/admin/components/DashboardLoading";

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
                        return <DashboardUsersItem user={user} key={user.id}/>
                    })
                }
            </section>
        </>

    );
    return <DashboardLoading/>
};

export default DashboardUsers;