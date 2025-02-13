import Select from "react-select";
import {useRouter} from "next/navigation";

const SelectMenuCategory = ({sortTerm, categoryTerm, pageNumber, customStyles}) => {

    const router = useRouter();

    const options = [
        {value: "all", label: "All"},
        {value: "apparel", label: "Apparel"},
        {value: "automotive", label: "Automotive"},
        {value: "electronics", label: "Electronics"},
        {value: "food", label: "Food"},
        {value: "footwear", label: "Footwear"},
        {value: "games", label: "Games"},
        {value: "health", label: "Health"},
        {value: "home", label: "Home"},
        {value: "pet", label: "Pet"},
        {value: "other", label: "Other"},
    ];
    const placeHolder = (category) => {
        switch (category) {
            case "all":
                return "All"
            case "apparel":
                return "Apparel"
            case "automotive":
                return "Automotive"
            case "electronics":
                return "Electronics"
            case "food":
                return "Food"
            case "footwear":
                return "Footwear"
            case "games":
                return "Games"
            case "home":
                return "Home"
            case "pet":
                return "Pet"
            case "other":
                return "Other"
        }
    };
    const handleChange = (selectedOption) => {
        router.push(`/products/sort/${sortTerm}/select/${selectedOption.value}/page/${pageNumber}`);
    };
    return (
        <Select
            styles={customStyles}
            isSearchable={false}
            className={"text-black w-full z-30"}
            placeholder={placeHolder(categoryTerm)}
            options={options}
            onChange={handleChange}
        />
    );
};

export default SelectMenuCategory;