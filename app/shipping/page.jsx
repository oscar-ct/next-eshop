"use client";

import React, {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import Btn from "@/components/Btn";
import Select from "react-select";
import {customStyles} from "@/utils/selectCustomStyles";
import {countries, states} from "@/utils/locationDataList";
import CheckoutSteps from "@/components/CheckoutSteps";
import {fetchUserAddress} from "@/utils/apiFetchRequests";
import RevealMotion from "@/components/RevealMotion";


const ShippingPage = () => {

    const router = useRouter();

    const { user, shippingAddress, cartItems, guestEmail: email, dispatch } = useContext(GlobalContext);

    // const [updateUserAddress] = useUpdateUserAddressMutation();

    const matchingAddress = user?.shippingAddresses.filter((address) => {
        return address.id === shippingAddress.id;
    });

    const locateExistingAddress = () => {
        if (user) {
            if (Object.keys(shippingAddress).length !== 0) {
                return !Object.hasOwnProperty.call(shippingAddress, "id");
            }
            return user.shippingAddresses.length === 0;
        }
        else {
            return true;
        }
    };

    const [radioId, setRadioId] = useState(Object.hasOwnProperty.call(shippingAddress, "id") ? matchingAddress[0].id : "");
    const [savePaymentData, setSavePaymentData] = useState(false);
    const [useNewAddress, setUseNewAddress] = useState(locateExistingAddress());
    const [guestEmail, setGuestEmail] = useState(email ? email : "");
    const [isValidShippingData, setIsValidShippingData] = useState(false);
    const [shippingData, setShippingData] = useState({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        state: "",
        country: "",
    });
    const {address, city, postalCode, state, country, name} = shippingData;


    useEffect(() => {
        if (Object.keys(shippingAddress).length !== 0 && Object.hasOwnProperty.call(shippingAddress,"id")) {
            return;
        }
        if (Object.keys(shippingAddress).length !== 0) {
            setShippingData({
                name: shippingAddress.name,
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                state:  shippingAddress.state,
                country: shippingAddress.country,
            });
        }
    }, [shippingAddress]);


    const isValidPostalCode = (zipCode) => {
        return zipCode.length === 5 && !isNaN(parseFloat(zipCode)) && isFinite(zipCode);
    };
    const isValidAddress = (address) => {
        return address.trim().length > 2 && address.length < 32;
    };
    const isValidCity = (city) => {
        return city.trim().length > 2 && address.length < 24;
    };
    const isValidName = (name) => {
        return name.trim().length > 2 && name.length < 24;
    };
    const isValidEmail = (email) => {
        const noSpacesRegex = /^\S+$/;
        const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        if (!noSpacesRegex.test(email)) {
            return false;
        }
        return emailRegex.test(email);
    };

    useEffect(() => {
        if (isValidPostalCode(shippingData.postalCode) && isValidAddress(shippingData.address) && isValidCity(shippingData.city) && isValidName(shippingData.name) && shippingData.state.length !== 0 && shippingData.country.length !== 0) {
            setIsValidShippingData(true);
        } else {
            setIsValidShippingData(false);
        }
    }, [shippingData.postalCode, shippingData.name, shippingData.address, shippingData.city, shippingData.state.length, shippingData.country.length]);

    useEffect(function () {
        if (cartItems.length === 0) {
            router.push("/");
        }
    }, [router, cartItems, dispatch]);

    const onChange = (e) => {
        setShippingData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };
    const onChangeSelect = (e) => {
        setShippingData(prevState => ({
            ...prevState,
            [e.id]: e.value,
        }));
    };

    const radioSelectAddress = user?.shippingAddresses?.filter(function (x) {
        return x.id === radioId;
    });

    const submitShippingData = async (e) => {
        e.preventDefault();
        if (useNewAddress) {
            if (savePaymentData) {
                const body = {
                    name,
                    address,
                    city,
                    postalCode,
                    state,
                    country
                }
                const userAddresses = await fetchUserAddress(user.id, body);
                const userAddressWithObjectId = userAddresses.filter(function (x) {
                    return x.name === name && x.address === address && x.city === city && x.postalCode === postalCode && x.country === country;
                });
                dispatch({type: "SET_SHIPPING_DATA", payload: userAddressWithObjectId[0]});
                dispatch({type: "UPDATE_USER_ADDRESSES", payload: userAddresses});
                dispatch({type: "SET_LOCAL_STORAGE"});
                router.push("payment");
            } else {
                dispatch({type: "SET_GUEST_EMAIL", payload: guestEmail});
                dispatch({type: "SET_SHIPPING_DATA", payload: {name, address, city, state, postalCode, country}});
                dispatch({type: "SET_LOCAL_STORAGE"});
                router.push("payment");
            }
        } else {
            dispatch({type: "SET_SHIPPING_DATA", payload: radioSelectAddress[0]});
            dispatch({type: "SET_LOCAL_STORAGE"});
            router.push("payment");
        }
    };

    const dynamicBorder = (boolean, string) => {
        if (string.length === 0) {
            return "";
        }
        return boolean ? "!border-green-500 focus:ring-green-100" : "!border-red-500 focus:ring-red-100";
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <CheckoutSteps/>
            <div className={"px-2 w-full flex justify-center sm:pt-10"}>
                <div className={"bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl max-w-xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800"}>
                    {
                        !mounted ? (
                            <div className="fadeInEffect flex w-full flex-col gap-5 h-full">
                                <div className="skeleton h-16 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                            </div>
                        ) : (
                            <RevealMotion y={25}>
                                <h1 className={"h-20 flex items-start justify-center font-semibold text-3xl text-center sm:h-16 dark:text-white"}>
                                    Confirm your shipping address
                                </h1>
                                {
                                    useNewAddress ? (
                                        <form onSubmit={submitShippingData} className="pt-3 flex flex-col gap-4 sm:pt-0">
                                            {
                                                !user && (
                                                    <div className="space-y-2">
                                                        <label htmlFor={"email"}
                                                               className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                                                            Customer Email
                                                        </label>
                                                        <input
                                                            className={`${dynamicBorder(isValidEmail(guestEmail), guestEmail)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                                            autoComplete={"email"}
                                                            type={"text"}
                                                            placeholder={"example@email.com"}
                                                            id={"email"}
                                                            value={guestEmail}
                                                            onChange={(e) => setGuestEmail(e.target.value)}
                                                            required
                                                        />
                                                        <div
                                                            className={"text-xs sm:text-sm w-full flex justify-center dark:text-gray-300"}>(this
                                                            email
                                                            will be only be used to contact you about your order)
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            <div className="space-y-2">
                                                <label htmlFor={"name"}
                                                       className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                                                    Recipient&apos;s Name
                                                </label>
                                                <input
                                                    className={`${dynamicBorder(isValidName(name), name)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                                    autoComplete={"name"}
                                                    type={"text"}
                                                    placeholder={"John Doe"}
                                                    id={"name"}
                                                    value={name}
                                                    onChange={onChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor={"address"}
                                                       className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                                                    Street Address
                                                </label>
                                                <input
                                                    className={`${dynamicBorder(isValidAddress(address), address)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                                    autoComplete={"address"}
                                                    type={"text"}
                                                    placeholder={"600 Navarro St #400"}
                                                    id={"address"}
                                                    value={address}
                                                    onChange={onChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor={"city"}
                                                       className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                                                    City
                                                </label>
                                                <input
                                                    className={`${dynamicBorder(isValidCity(city), city)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                                    autoComplete={"home city"}
                                                    type={"text"}
                                                    placeholder={"San Antonio"}
                                                    id={"city"}
                                                    value={city}
                                                    onChange={onChange}
                                                    required
                                                />
                                            </div>
                                            <div className={"flex w-full gap-4"}>
                                                <div className={"w-8/12 md:w-6/12 space-y-2"}>
                                                <span className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                                                    State
                                                </span>
                                                    <Select placeholder={"Select State"}
                                                            options={states}
                                                            styles={{
                                                                ...customStyles, control: (base) => ({
                                                                    ...base,
                                                                    padding: "2px",
                                                                    borderRadius: 6,
                                                                    cursor: "pointer",
                                                                    fontSize: "16px",
                                                                }),
                                                            }}
                                                            id={state}
                                                            value={states.filter(obj => obj.value === shippingData.state)}
                                                            onChange={onChangeSelect}
                                                    />
                                                </div>
                                                <div className={"w-4/12 md:w-6/12 space-y-2"}>
                                                    <label htmlFor={"postalCode"}
                                                           className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                                                        Zip Code
                                                    </label>
                                                    <input
                                                        className={`${dynamicBorder(isValidPostalCode(postalCode), postalCode)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                                        autoComplete={"locality"}
                                                        type={"text"}
                                                        placeholder={"78205"}
                                                        id={"postalCode"}
                                                        value={postalCode}
                                                        onChange={onChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                                                    Country
                                                </span>
                                                <Select
                                                    placeholder={"Select Country"}
                                                    options={countries}
                                                    styles={{
                                                        ...customStyles, control: (base) => ({
                                                            ...base,
                                                            padding: "2px",
                                                            borderRadius: 6,
                                                            cursor: "pointer",
                                                            fontSize: "16px",
                                                        }),
                                                    }}
                                                    id={state}
                                                    value={countries.filter(obj => obj.value === shippingData.country)}
                                                    onChange={onChangeSelect}
                                                />
                                            </div>
                                            {
                                                user && (
                                                    <div className="w-full flex justify-end">
                                                        {
                                                            user.shippingAddresses?.length !== 0 && (
                                                                <div className={"w-6/12 flex items-center"}>
                                                    <span onClick={() => setUseNewAddress(prevState => !prevState)}
                                                          className={"text-sm text-start link link-primary"}>Use saved address</span>
                                                                </div>
                                                            )
                                                        }

                                                        <label htmlFor={"checkbox"}
                                                               className="w-6/12 flex items-center justify-end cursor-pointer">
                                                            <span
                                                                className="text-sm pr-2 dark:text-white">Save this address</span>
                                                            <input id={"checkbox"} type="checkbox" checked={savePaymentData}
                                                                   onChange={() => setSavePaymentData(prevState => !prevState)}
                                                                   className="checkbox checkbox-primary"/>
                                                        </label>
                                                    </div>
                                                )
                                            }
                                            <div className={"pt-5 w-full flex justify-end"}>
                                                <Btn
                                                    isDisabled={!isValidShippingData || (user ? false : !isValidEmail(guestEmail))}
                                                    type={"submit"}
                                                >
                                                    Save and Continue
                                                </Btn>
                                            </div>
                                        </form>
                                    ) : (
                                        <form onSubmit={submitShippingData}>
                                            {
                                                user?.shippingAddresses.map(function (item, index) {
                                                    return (
                                                        <div key={index} className="my-5 dark:text-white"
                                                             onClick={() => setRadioId(item.id)}>
                                                            <div
                                                                className={`w-full rounded-md shadow-sm border cursor-pointer ${item.id === radioId && "ring-2 border-green-500 ring-green-100"}`}>
                                                                <div className={"w-full flex p-6"}>
                                                                    <div className={"text-sm w-10/12 flex flex-col justify-center"}>
                                                                        <span className={"truncate"}>{item.name}</span>
                                                                        <span className={"truncate"}>{item.address}</span>
                                                                        <span className={"truncate"}>{`${item.city}, ${item.state} ${item.postalCode} `}</span>
                                                                        <span className={"truncate"}>{item.country}</span>
                                                                    </div>
                                                                    <div className={"w-2/12 flex items-center"}>
                                                                        <input
                                                                            autoComplete={"off"}
                                                                            type="radio"
                                                                            name="address"
                                                                            id={index.toString()}
                                                                            value={item.id}
                                                                            className="radio radio-primary"
                                                                            onChange={(e) => {
                                                                                setRadioId(e.target.value)
                                                                            }}
                                                                            checked={item.id === radioId}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div>
                                                <span onClick={() => setUseNewAddress(prevState => !prevState)}
                                                    className={"text-sm text-end link link-primary"}>
                                                    Use new address
                                                </span>
                                            </div>
                                            <div className={"pt-5 w-full flex justify-end"}>
                                                <Btn isDisabled={radioId === ""} type={"submit"}>
                                                    Save and Continue
                                                </Btn>
                                            </div>
                                        </form>
                                    )
                                }
                            </RevealMotion>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default ShippingPage;