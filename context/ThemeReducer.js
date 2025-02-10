const themeReducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_THEME":
            return {
                ...state,
                isDarkMode: !state.isDarkMode,
            }
        default:
            console.log("case missed...")
            return state;
    }
};

export default themeReducer;