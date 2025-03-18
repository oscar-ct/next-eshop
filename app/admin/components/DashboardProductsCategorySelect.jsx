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
            <option value={"Automotive"}>
                Automotive
            </option>
            <option value={"Cycling"}>
                Cycling
            </option>
            <option value={"EDC"}>
                EDC
            </option>
            <option value={"Electronics"}>
                Electronics
            </option>
            <option value={"Cycling"}>
                Kayaking
            </option>
            <option value={"Footwear"}>
                Footwear
            </option>
            <option value={"Games"}>
                Games
            </option>
            <option value={"Home"}>
                Home
            </option>
            <option value={"Kayaking"}>
                Kayaking
            </option>
            <option value={"Pet"}>
                Pet
            </option>
            <option value={"Treats"}>
                Treats
            </option>
            <option value={"Other"}>
                Other
            </option>
        </>
    );
};

export default DashboardProductsCategorySelect;