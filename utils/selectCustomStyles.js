export const customStyles = {
    control: (base) => ({
        ...base,
        padding: "2px",
        borderRadius: 0,
        cursor: "pointer",
        fontSize: "14px",
        zIndex: 30,
        lineHeight: "14px",
    }),
    option: (base, {isDisabled, isFocused, isSelected}) => {
        return {
            ...base,
            cursor: "pointer",
            borderRadius: 1,
            color: "#1E313B",
            backgroundColor: isFocused
                ? "rgba(132,170,252,0.3)"
                : isSelected
                    ? "rgb(132,166,252)"
                    : "rgb(245,245,245)",
            ':active': {
                ...base[':active'],
                backgroundColor: !isDisabled
                    && isSelected
                    && "rgb(245,245,245)",

            },
        };
    },
    menu: base => ({
        ...base,
        cursor: "pointer",
        borderRadius: 0,
        zIndex: 30
    }),
    menuList: base => ({
        ...base,
        padding: 0,
        cursor: "pointer",
        fontSize: "14px",
    }),
    singleValue: base => ({
        ...base,
        color: "light-dark(#1E313B, #FFFFFF)",
    })
};
