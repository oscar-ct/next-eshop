import Select from "react-select";
import {useRouter} from "next/navigation";
import capitalizeFirstChar from "@/utils/capitalizeFirstChar";

const SelectMenuCategory = ({sortTerm, categoryTerm, pageNumber, customStyles, options}) => {

    const router = useRouter();

    const handleChange = (selectedOption) => {
        router.push(`/products/sort/${sortTerm}/select/${selectedOption.value}/page/${pageNumber}`);
    };
    return (
        <Select
            styles={customStyles}
            isSearchable={false}
            className={"w-full"}
            placeholder={capitalizeFirstChar(categoryTerm)}
            options={options}
            onChange={handleChange}
        />
    );
};

export default SelectMenuCategory;