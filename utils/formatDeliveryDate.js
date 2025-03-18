export const deliveryDateString = (speed) => {
    const currentDate = new Date();
    if (speed === "express") {
        const targetDate = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() + 4);
        const targetDateNumber = targetDate.getDate();
        const options = { month: 'long' };
        const targetDateMonth = targetDate.toLocaleDateString('en-US', options);
        return targetDateMonth.toString() + " " + targetDateNumber.toString();
    }
    const targetDate1 = new Date(currentDate);
    targetDate1.setDate(currentDate.getDate() + 4);
    const targetDate2 = new Date(currentDate);
    targetDate2.setDate(currentDate.getDate() + 7);
    const options = { month: 'short' };
    const targetDateNumber1 = targetDate1.getDate();
    const targetDateNumber2 = targetDate2.getDate();
    const targetDateMonth1 = targetDate1.toLocaleDateString('en-US', options);
    const targetDateMonth2 = targetDate2.toLocaleDateString('en-US', options);
    return `${targetDateMonth1} ${targetDateNumber1} - ${targetDateMonth2} ${targetDateNumber2}`
};