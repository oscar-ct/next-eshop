const DashboardProductsCategorySelect = ({disabled, isPopulated = false}) => {
    return (
        <>
            {
                !isPopulated && (
                    <option defaultChecked disabled={disabled}>
                        Select Category
                    </option>
                )
            }
            <option value={"Apparel"}>
                Apparel
            </option>
            <option value={"Automotive"}>
                Automotive
            </option>
            <option value={"Electronics"}>
                Electronics
            </option>
            <option value={"Food"}>
                Food
            </option>
            <option value={"Footwear"}>
                Footwear
            </option>
            <option value={"Games"}>
                Games
            </option>
            <option value={"Health"}>
                Health
            </option>
            <option value={"Home"}>
                Home
            </option>
            <option value={"Pet"}>
                Pet
            </option>
            <option value={"Other"}>
                Other
            </option>
        </>
    );
};

export default DashboardProductsCategorySelect;