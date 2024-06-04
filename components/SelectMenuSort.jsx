import Select from "react-select";

import {useRouter} from "next/navigation";

const SelectMenuSort = ({sortTerm, categoryTerm, pageNumber, customStyles}) => {


    const router = useRouter();
    const options = [
        {value: "toprated", label: "Top Rated"},
        {value: "latest", label: "Most Recent"},
        {value: "price-asc", label: "Price: Low To High"},
        {value: "price-dsc", label: "Price: High To Low"},
    ];
    const placeHolder = () => {
        if (sortTerm === "toprated") {
            return "Top Rated"
        } else if (sortTerm === "latest") {
            return "Most Recent"
        } else if (sortTerm === "price-asc") {
            return "Price: Low To High"
        } else if (sortTerm === "price-dsc") {
            return "Price: High To Low"
        }
    };
    const handleChange = (selectedOption) => {
        router.push(`/products/sort/${selectedOption.value}/select/${categoryTerm}/page/${pageNumber}`);
    };
    return (
        <Select
            styles={customStyles}
            isSearchable={false}
            className={"text-black w-full"}
            placeholder={placeHolder(sortTerm)}
            options={options}
            onChange={handleChange}
        />
    );
};

export default SelectMenuSort;