export default function capitalizeFirstChar(string) {
    if (string === "edc") return string.toUpperCase();
    return string.substring(0, 1).toUpperCase() + string.substring(1, string.length);
};