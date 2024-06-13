import {useEffect, useState} from "react";
import {fetchAdminProducts, fetchAdminUpdateProduct} from "@/utils/api-requests/fetchRequests";
import DashboardProductsItem from "@/components/dashboard/DashboardProductsItem";
import ConfirmModal from "@/components/modals/ConfirmModal";
import toast from "react-hot-toast";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const DashboardProducts = ({ width }) => {

    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState(null);
    const [successfullyUpdatedOrder, setSuccessfullyUpdatedOrder] = useState(false);


    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const products = await fetchAdminProducts();
                setProducts(products);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (products === null) fetchProductsData();
    }, [products]);


    const submitProductUpdate = async () => {
        const { productId } = productData;
        const body = {...productData}
        delete body.message;
        delete body.productId;
        const updatedProduct = await fetchAdminUpdateProduct(productId, body);
        if (updatedProduct) {
            setSuccessfullyUpdatedOrder(true);
            const updatedProducts = products.map((product) => {
                return product._id === updatedProduct._id ? updatedProduct : product
            });
            setProducts(updatedProducts);
            toast.success("Product updated!");
        }
    };

    if (!loading && products) return (
        <>
            <section>
            {
                products.map((product) => {
                    return <DashboardProductsItem setProductData={setProductData} successfullyUpdatedOrder={successfullyUpdatedOrder} setSuccessfullyUpdatedOrder={setSuccessfullyUpdatedOrder} width={width} product={product} key={product._id}/>
                })
            }
            </section>
            <ConfirmModal title={"Confirm Changes"} initiateFunction={submitProductUpdate}>
                <h3 className="font-semibold text-lg">Please confirm these are the changes you wish to make --</h3>
                {
                    productData?.message !== "" && (
                        productData?.message.split("&").map(function(sentence, index){
                            return (
                                <p className={"pt-3"} key={index}>{sentence}</p>
                            )
                        })
                    )
                }
            </ConfirmModal>
        </>
    );
    return <DashboardLoading/>
};

export default DashboardProducts;