import React, { useEffect, useState } from 'react'
import AdminLayout from '../layout/AdminLayout'
import axios from 'axios';
import baseUrl from '../../../components/api/myAPI';
import imageUrl from '../../../components/api/myImageUrl';
import AlertUpdateSuccess from '../components/Alert/Product/AlertUpdateSuccess';
import AlertAddSuccess from '../components/Alert/Product/AlertAddSuccess';
import AlertDelete from '../components/Alert/Product/AlertDelete';
import AlertAddAddonSuccess from '../components/Alert/Addon/AlertAddAddonSuccess';
import AlertUpdAddon from '../components/Alert/Addon/AlertUpdAddon';
import AlertDeleteAddon from '../components/Alert/Addon/AlertDeleteAddon';
import PopupDeleteAddon from '../components/Modal/PopUp/PopupDeleteAddon';



const ProductAdmin = () => {
    const [allProduct, setAllProduct] = useState([]);

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpd, setShowModalUpd] = useState(false);

    const [nameAdd, setNameAdd] = useState('')
    const [descriptionAdd, setDescriptionAdd] = useState('')
    const [categoryAdd, setCategoryAdd] = useState('')
    const [priceAdd, setPriceAdd] = useState('')
    const [prepareAdd, setPrepareAdd] = useState('')
    const [stockAdd, setStockAdd] = useState('')
    const [imageAdd, setImageAdd] = useState(null)
    const [imagePreview, setImagePreview] = useState(null);

    const [listCategory, setListCategory] = useState([])

    const [selectedId, setSelectedId] = useState(null)
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertUpdate, setShowAlertUpdate] = useState(false);
    const [showAlertDanger, setShowAlertDanger] = useState(false);

    const [closingSuccess, setClosingSuccess] = useState(false);
    const [closingUpdate, setClosingUpdate] = useState(false);
    const [closingDanger, setClosingDanger] = useState(false);

    const [showPopUpDelete, setShowPopUpDelete] = useState(false);

    const [currentImage, setCurrentImage] = useState(null)

    const [nameUpd, setNameUpd] = useState('')
    const [descriptionUpd, setDescriptionUpd] = useState('');
    const [categoryUpd, setCategoryUpd] = useState('');
    const [priceUpd, setPriceUpd] = useState('');
    const [prepareUpd, setPrepareUpd] = useState('');
    const [stockUpd, setStockUpd] = useState('')
    const [imageUpd, setImageUpd] = useState(null)
    const [imagePreviewUpd, setImagePreviewUpd] = useState(null);

    const [selectedProductId, setSelectedProductId] = useState(null)

    // addon
    const [addonByProduct, setAddonByProduct] = useState([])
    const [expandedProduct, setExpandedProduct] = useState(null)
    const [loadingAddons, setLoadingAddons] = useState(false)

    // modal add and upd
    const [showModalAddAddon, setShowModalAddAddon] = useState(false);
    const [showModalUpdAddon, setShowModalUpdAddon] = useState(false);
    const [showPopUpDeleteAddon, setShowPopUpDeleteAddon] = useState(false);

    // modal add addon
    const [addonProductId, setAddonProductId] = useState(null);
    const [addonNameAdd, setAddonNameAdd] = useState('');
    const [addonPriceAdd, setAddonPriceAdd] = useState('');
    const [addonCategoryAdd, setAddonCategoryAdd] = useState('');

    // modal upd addon
    const [selectedAddonId, setSelectedAddonId] = useState(null);
    const [addonNameUpd, setAddonNameUpd] = useState('');
    const [addonPriceUpd, setAddonPriceUpd] = useState('');
    const [addonCategoryUpd, setAddonCategoryUpd] = useState('');

    // alert add and upd addon
    const [showAlertAddonSuccess, setShowAlertAddonSuccess] = useState(false);
    const [showAlertAddonUpdate, setShowAlertAddonUpdate] = useState(false);
    const [showAlertAddonDanger, setShowAlertAddonDanger] = useState(false);
    const [closingAddonSuccess, setClosingAddonSuccess] = useState(false);
    const [closingAddonUpdate, setClosingAddonUpdate] = useState(false);
    const [closingAddonDanger, setClosingAddonDanger] = useState(false);

    useEffect(() => {
        getAllProducts();
        getListCategory();
    }, [])

    const getListCategory = async () => {
        try {
            const response = await axios.get(`${baseUrl}categories`, {
                withCredentials: true
            });
            setListCategory(response.data.data)
        } catch (error) {
            console.log('Category Error Fetching : ', error)
        }
    }

    const getAllProducts = async () => {
        try {
            const response = await axios.get(`${baseUrl}products`, {
                withCredentials: true
            })
            setAllProduct(response.data.data)
        } catch (error) {
            console.log('Cannot fetch product API', error)
        }
    }

    const getAddonsByProductId = async (productId) => {
        try {
            setLoadingAddons(true);
            const response = await axios.get(`${baseUrl}addons/product/${productId}`, {
                withCredentials: true
            });
            setAddonByProduct(response.data.data);
        } catch (error) {
            console.log('Error fetching addons:', error);
            setAddonByProduct([]);
        } finally {
            setLoadingAddons(false);
        }
    }

    // fungsi untuk handle toggle expansion 
    const handleRowClick = (productId) => {
        if (expandedProduct === productId) {
            setExpandedProduct(null);
            setAddonByProduct([]);
        } else {
            setExpandedProduct(productId);
            getAddonsByProductId(productId);
        }
    }

    // add addon by product_id
    const handleAddAddonClick = (productId) => {
        setAddonProductId(productId);
        setShowModalAddAddon(true);
    }

    const addAddon = async (e) => {
        e.preventDefault();

        if (!addonNameAdd || !addonPriceAdd || !addonCategoryAdd) {
            alert('All fields must be filled');
            return;
        }

        try {
            const addonData = {
                product_id: addonProductId,
                addon_name: addonNameAdd,
                addon_price: parseFloat(addonPriceAdd),
                addon_category: addonCategoryAdd
            };

            await axios.post(`${baseUrl}addons`, addonData, {
                withCredentials: true
            });
            getAddonsByProductId(addonProductId);
            resetAddAddonForm();
            setShowModalAddAddon(false);
            showAddonSuccessAlert();
        } catch (error) {
            console.log('ERROR CANNOT ADD ADDON', error);
            alert('Failed to add addon');
        }
    }

    const resetAddAddonForm = () => {
        setAddonNameAdd('');
        setAddonPriceAdd('');
        setAddonCategoryAdd('');
        setAddonProductId(null);
    }

    const handleCloseModalAddAddon = () => {
        setShowModalAddAddon(false);
        resetAddAddonForm();
    }

    const handleUpdateAddonClick = (addon) => {
        setSelectedAddonId(addon.addon_id);
        setAddonNameUpd(addon.addon_name);
        setAddonPriceUpd(addon.addon_price);
        setAddonCategoryUpd(addon.addon_category);
        setShowModalUpdAddon(true);
    }

    const updateAddon = async (e) => {
        e.preventDefault();

        try {
            const addonData = {
                addon_name: addonNameUpd,
                addon_price: parseFloat(addonPriceUpd),
                addon_category: addonCategoryUpd
            };

            await axios.put(`${baseUrl}addons/${selectedAddonId}`, addonData, {
                withCredentials: true
            });

            getAddonsByProductId(expandedProduct);
            handleCloseModalUpdAddon();
            showAddonUpdateAlert();
        } catch (error) {
            console.log('CANNOT UPDATE ADDON', error);
            alert('Failed to update addon');
        }
    }

    const handleCloseModalUpdAddon = () => {
        setShowModalUpdAddon(false);
        setSelectedAddonId(null);
        setAddonNameUpd('');
        setAddonPriceUpd('');
        setAddonCategoryUpd('');
    }

    const handleDeleteAddonClick = (addonId) => {
        setSelectedAddonId(addonId);
        setShowPopUpDeleteAddon(true);
    }

    const deleteAddon = async () => {
        try {
            await axios.delete(`${baseUrl}addons/${selectedAddonId}`, {
                withCredentials: true
            });

            getAddonsByProductId(expandedProduct);
            setShowPopUpDeleteAddon(false);
            setSelectedAddonId(null);
            showAddonDangerAlert();
        } catch (error) {
            console.log('CANNOT DELETE ADDON', error);
            alert('Failed to delete addon');
        }
    }

    const showAddonSuccessAlert = () => {
        setShowAlertAddonSuccess(true);
        setTimeout(() => {
            setClosingAddonSuccess(true);
            setTimeout(() => {
                setShowAlertAddonSuccess(false);
                setClosingAddonSuccess(false);
            }, 500)
        }, 3000)
    }

    const showAddonUpdateAlert = () => {
        setShowAlertAddonUpdate(true);
        setTimeout(() => {
            setClosingAddonUpdate(true);
            setTimeout(() => {
                setClosingAddonUpdate(false);
                setShowAlertAddonUpdate(false);
            }, 500)
        }, 3000)
    }

    const showAddonDangerAlert = () => {
        setShowAlertAddonDanger(true);
        setTimeout(() => {
            setClosingAddonDanger(true);
            setTimeout(() => {
                setShowAlertAddonDanger(false);
                setClosingAddonDanger(false)
            }, 500)
        }, 3000)
    }
    // Add Product
    const addProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', nameAdd)
        formData.append('description', descriptionAdd)
        formData.append('base_price', priceAdd)
        formData.append('stock_quantity', stockAdd)
        formData.append('preparation_time', prepareAdd)
        formData.append('category_id', categoryAdd)
        if (imageAdd) {
            formData.append('image_url', imageAdd)
        }
        if (!nameAdd || !descriptionAdd || !priceAdd || !stockAdd || !prepareAdd || !categoryAdd) {
            alert('Every field must be contain')
        }

        try {
            await axios.post(`${baseUrl}products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            getAllProducts();
            resetAddForm();
            setShowModalAdd(false);
            setShowAlertSuccess(true);
            setTimeout(() => {
                setClosingSuccess(true);
                setTimeout(() => {
                    setShowAlertSuccess(false);
                    setClosingSuccess(false);
                }, 500)
            }, 3000)
        } catch (error) {
            console.log('ERROR CANNOT ADD PRODUCT', error)
        }
    }

    const resetAddForm = () => {
        setNameAdd('');
        setDescriptionAdd('');
        setPriceAdd('');
        setStockAdd('');
        setPrepareAdd('');
        setCategoryAdd('');
        setImageAdd(null);
        setImagePreview(null)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageAdd(file);
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleCloseModalAdd = () => {
        setShowModalAdd(false);
        resetAddForm();
    }

    const getProductById = async (id) => {
        try {
            const response = await axios.get(`${baseUrl}products/${id}`, {
                withCredentials: true
            })
            const productData = response.data.data;
            console.log(response.data.data)
            setNameUpd(productData.name);
            setDescriptionUpd(productData.description)
            setPriceUpd(productData.base_price)
            setStockUpd(productData.stock_quantity)
            setPrepareUpd(productData.preparation_time)
            setCategoryUpd(productData.category_id)
            setCurrentImage(productData.image_url)
            setImageUpd(null);
            setImagePreviewUpd(null)
        } catch (error) {
            console.log('ERROR CANNOT FETCH BY ID', error)
        }
    }
    // Upd product
    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', nameUpd)
            formData.append('description', descriptionUpd)
            formData.append('base_price', priceUpd)
            formData.append('stock_quantity', stockUpd)
            formData.append('preparation_time', prepareUpd)
            formData.append('category_id', categoryUpd)
            if (imageUpd) {
                formData.append('image_url', imageUpd)
            }
            await axios.put(`${baseUrl}products/${selectedId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            getAllProducts();
            handleCloseModalUpd();
            setShowAlertUpdate(true);
            setTimeout(() => {
                setClosingUpdate(true);
                setTimeout(() => {
                    setClosingUpdate(false);
                    setShowAlertUpdate(false);
                }, 500)
            }, 3000)
        } catch (error) {
            console.log('CANNOT UPDATE THE PRODUCT', error)
            alert('GAGAL UPDATE PRODUCT', error)
        }
    }

    const handleUpdClick = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
        getProductById(id);
        setShowModalUpd(true);
    }

    const handleCloseModalUpd = () => {
        setShowModalUpd(false);
        setNameUpd('');
        setDescriptionUpd('')
        setPriceUpd('')
        setStockUpd('')
        setPrepareUpd('')
        setCategoryUpd('')
        setImageUpd(null)
        setCurrentImage(null)
        setImagePreviewUpd(null)
        setSelectedId(null)
    }

    const handleImageChangeUpd = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageUpd(file);
            setImagePreviewUpd(URL.createObjectURL(file))
        }
    }

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${baseUrl}products/${id}`, {
                withCredentials: true
            });
            getAllProducts();
            setShowAlertDanger(true);
            setTimeout(() => {
                setClosingDanger(true);
                setTimeout(() => {
                    setShowAlertDanger(false);
                    setClosingDanger(false)
                }, 500)
            }, 3000)
        } catch (error) {
            console.log('CANNOT DELETE PRODUCT');
            alert('FAILED', error)
        } finally {
            setShowPopUpDelete(false);
            setSelectedProductId(null);
        }
    }
    // delete Product 
    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setSelectedProductId(id);
        setShowPopUpDelete(true);
    }


    return (
        <AdminLayout>
            <AlertUpdateSuccess show={showAlertUpdate} closing={closingUpdate} />
            <AlertAddSuccess show={showAlertSuccess} closing={closingSuccess} />
            <AlertDelete show={showAlertDanger} closing={closingDanger} />

            <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
                <div>
                    <button
                        onClick={() => setShowModalAdd(true)}
                        data-dialog-target="animated-modal"
                        className="rounded-md border border-slate-300 py-2 px-4 text-center text-md transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                        Add Product
                    </button>
                </div>
                <div className="mx-3">
                    <div className="w-full max-w-sm min-w-[200px] relative">
                        <div className="relative">
                            <input
                                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Search for category..."
                            />
                            <button
                                className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-8 h-8 text-slate-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                <table className="w-full text-left table-auto min-w-max">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50">
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">No</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">Product</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">Name</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">Description</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">Category</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">Price</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">Preparation Time</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500">Stock</th>
                            <th className="p-4 text-sm font-normal leading-none text-slate-500"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProduct.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr
                                    className="hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                                    onClick={() => handleRowClick(item.product_id)}
                                >
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <div className="flex items-center">
                                            <p className="block font-semibold text-sm text-slate-800 mr-2">{index + 1}.</p>
                                            {expandedProduct === item.product_id ? (
                                                <svg className="w-4 h-4 text-slate-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-slate-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <img
                                            src={`${imageUrl}${item.image_url}`}
                                            className='w-16 h-16 object-cover rounded'
                                            alt={item.name}
                                        />
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="block font-semibold text-sm text-slate-800">{item.name}</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="text-sm text-slate-500">{item.description}</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5 font-bold">
                                        <p className="text-sm text-slate-500">{item.Category.name}</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5 ">
                                        <p className="text-sm text-slate-500">Rp. {item.base_price.toLocaleString('id-ID')}</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="text-sm text-slate-500">±{item.preparation_time} minute</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <p className="text-sm text-slate-500">{item.stock_quantity}</p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 py-5">
                                        <button
                                            onClick={(e) => handleUpdClick(e, item.product_id)}
                                            type="button" className="text-slate-500 hover:text-slate-700 mr-2">
                                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(e, item.product_id)}
                                            type="button" className="text-slate-500 hover:text-slate-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>

                                {/* Expanded Addons Row */}
                                {expandedProduct === item.product_id && (
                                    <tr>
                                        <td colSpan="9" className="p-0 border-b border-slate-200">
                                            <div className="bg-slate-50 border-l-4 border-slate-400 transition-all duration-300 ease-in-out">
                                                <div className="p-6">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="text-lg font-semibold text-slate-800 flex items-center">
                                                            <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            Product Addons
                                                        </h4>
                                                        <button
                                                            onClick={() => handleAddAddonClick(item.product_id)}
                                                            className="rounded-md border border-green-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-green-600 hover:text-white hover:bg-green-600 hover:border-green-600 focus:text-white focus:bg-green-600 focus:border-green-600"
                                                        >
                                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            Add Addon
                                                        </button>
                                                    </div>

                                                    {loadingAddons ? (
                                                        <div className="flex justify-center items-center py-8">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                                                            <p className="ml-3 text-slate-600">Loading addons...</p>
                                                        </div>
                                                    ) : addonByProduct.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {addonByProduct.map((addon) => (
                                                                <div key={addon.addon_id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${addon.is_available
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {addon.is_available ? 'Available' : 'Unavailable'}
                                                                    </span>
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <h5 className="font-semibold text-slate-800 text-base">{addon.addon_name}</h5>

                                                                        <div className="flex space-x-2">
                                                                            <button
                                                                                onClick={() => handleUpdateAddonClick(addon)}
                                                                                className="text-slate-500 hover:text-amber-600"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteAddonClick(addon.addon_id)}
                                                                                className="text-slate-500 hover:text-red-600"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between text-sm">
                                                                            <span className="text-slate-500">Price:</span>
                                                                            <span className="font-medium text-slate-800">
                                                                                Rp. {parseFloat(addon.addon_price).toLocaleString('id-ID')}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between text-sm">
                                                                            <span className="text-slate-500">Category:</span>
                                                                            <span className="font-medium text-slate-800 capitalize">
                                                                                {addon.addon_category}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                                                                            Added: {new Date(addon.createdAt).toLocaleDateString('id-ID')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                            <p className="text-slate-500 text-sm mb-3">No addons available for this product</p>
                                                            <button
                                                                onClick={() => handleAddAddonClick(item.product_id)}
                                                                className="text-sm text-green-600 hover:text-green-700 underline"
                                                            >
                                                                Add your first addon
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModalAdd && (
                <>
                    <div
                        data-dialog-backdrop="animated-modal"
                        data-dialog-backdrop-close="true"
                        className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                    >
                        <div
                            data-dialog="animated-modal"
                            data-dialog-mount="opacity-100 translate-y-0 scale-100"
                            data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
                            data-dialog-transition="transition-all duration-300"
                            className="relative mx-auto w-full max-w-4xl rounded-lg overflow-hidden shadow-sm"
                        >
                            <div className="relative flex flex-col bg-white">
                                <div className="relative m-2.5 flex justify-center items-center text-white h-24 rounded-md bg-slate-800">
                                    <h3 className="text-2xl">Add Product</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                    <div className="flex flex-col items-center">
                                        <label className="block mb-2 text-sm text-slate-600">Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                        {imagePreview ? (
                                            <div className="mt-4 w-full">
                                                <p className="mb-1 text-sm text-slate-600">Image Preview:</p>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-auto max-h-72 object-contain border border-slate-300 rounded"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 mt-4">No image selected</p>
                                        )}
                                    </div>
                                    <form onSubmit={addProduct} className="flex flex-col gap-4">
                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Name</label>
                                            <input
                                                type="text"
                                                value={nameAdd}
                                                onChange={(e) => setNameAdd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                placeholder="Category name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Description</label>
                                            <textarea
                                                value={descriptionAdd}
                                                onChange={(e) => setDescriptionAdd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                placeholder="Category description"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Price</label>
                                            <input
                                                type="number"
                                                value={priceAdd}
                                                onChange={(e) => setPriceAdd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                placeholder="Rp.XXXXXX"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Stock</label>
                                            <input
                                                type="number"
                                                value={stockAdd}
                                                onChange={(e) => setStockAdd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                placeholder="Stock: 10,20,30..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Preparation Time</label>
                                            <input
                                                type="number"
                                                value={prepareAdd}
                                                onChange={(e) => setPrepareAdd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                placeholder="in minute: 10,20,30..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Category</label>
                                            <div className="relative">
                                                <select
                                                    value={categoryAdd}
                                                    onChange={(e) => setCategoryAdd(e.target.value)}
                                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="">Selected Category</option>
                                                    {listCategory.map((lc) => (
                                                        <option key={lc.category_id} value={lc.category_id}>{lc.name}</option>
                                                    ))}
                                                </select>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 absolute top-2.5 right-2.5 text-slate-700">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                type="button"
                                                onClick={handleCloseModalAdd}
                                                className="text-slate-600 hover:text-slate-800 text-sm underline"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}
            {showModalUpd && (
                <>
                    <div
                        data-dialog-backdrop="animated-modal"
                        data-dialog-backdrop-close="true"
                        className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                    >
                        <div
                            data-dialog="animated-modal"
                            data-dialog-mount="opacity-100 translate-y-0 scale-100"
                            data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
                            data-dialog-transition="transition-all duration-300"
                            className="relative mx-auto w-full max-w-4xl rounded-lg overflow-hidden shadow-sm"
                        >
                            <div className="relative flex flex-col bg-white">
                                {/* Header */}
                                <div className="relative m-2.5 flex justify-center items-center text-white h-24 rounded-md bg-slate-800">
                                    <h3 className="text-2xl">Update Product</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                    <div className="flex flex-col items-center">
                                        <label className="block mb-2 text-sm text-slate-600">Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChangeUpd}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                        {imagePreviewUpd ? (
                                            <div className="mt-4 w-full">
                                                <p className="mb-1 text-sm text-slate-600">New Image Preview:</p>
                                                <img
                                                    src={imagePreviewUpd}
                                                    alt="New Preview"
                                                    className="w-full h-auto max-h-72 object-contain border border-slate-300 rounded"
                                                />
                                            </div>
                                        ) : currentImage ? (
                                            <div className="mt-4 w-full">
                                                <p className="mb-1 text-sm text-slate-600">Current Image:</p>
                                                <img
                                                    src={`${imageUrl}${currentImage}`}
                                                    alt="Current"
                                                    className="w-full h-auto max-h-72 object-contain border border-slate-300 rounded"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 mt-4">No image available</p>
                                        )}
                                    </div>

                                    <form onSubmit={updateProduct} className="flex flex-col gap-4">
                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Name</label>
                                            <input
                                                type="text"
                                                value={nameUpd}
                                                onChange={(e) => setNameUpd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Description</label>
                                            <textarea
                                                value={descriptionUpd}
                                                onChange={(e) => setDescriptionUpd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Price</label>
                                            <input
                                                type="number"
                                                value={priceUpd}
                                                onChange={(e) => setPriceUpd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Stock</label>
                                            <input
                                                type="number"
                                                value={stockUpd}
                                                onChange={(e) => setStockUpd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Preparation Time</label>
                                            <input
                                                type="number"
                                                value={prepareUpd}
                                                onChange={(e) => setPrepareUpd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Category</label>
                                            <div className="relative">
                                                <select
                                                    value={categoryUpd}
                                                    onChange={(e) => setCategoryUpd(e.target.value)}
                                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                                                >
                                                    <option value="">Selected Category</option>
                                                    {listCategory.map((lc) => (
                                                        <option key={lc.category_id} value={lc.category_id}>
                                                            {lc.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.2"
                                                    stroke="currentColor"
                                                    className="h-5 w-5 absolute top-2.5 right-2.5 text-slate-700"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                type="button"
                                                onClick={handleCloseModalUpd}
                                                className="text-slate-600 hover:text-slate-800 text-sm underline"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}


            {showPopUpDelete && (
                <>
                    <div id="popup-modal" tabIndex="-1"
                        className="bg-black/50 flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow-sm">
                                <button
                                    onClick={() => setShowPopUpDelete(false)}
                                    type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="p-4 md:p-5 text-center">
                                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                                    <button
                                        onClick={() => deleteProduct(selectedProductId)}
                                        type="button"
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                    >
                                        Confirm
                                    </button>

                                    <button
                                        onClick={() => setShowPopUpDelete(false)}
                                        data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Add Addon Modal */}
            {showModalAddAddon && (
                <>
                    <div
                        data-dialog-backdrop="animated-modal"
                        data-dialog-backdrop-close="true"
                        className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                    >
                        <div
                            data-dialog="animated-modal"
                            data-dialog-mount="opacity-100 translate-y-0 scale-100"
                            data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
                            data-dialog-transition="transition-all duration-300"
                            className="relative mx-auto w-full max-w-2xl rounded-lg overflow-hidden shadow-sm"
                        >
                            <div className="relative flex flex-col bg-white">
                                <div className="relative m-2.5 flex justify-center items-center text-white h-24 rounded-md bg-green-600">
                                    <h3 className="text-2xl">Add Addon</h3>
                                </div>

                                <form onSubmit={addAddon} className="p-6 space-y-4">
                                    <div>
                                        <label className="block mb-2 text-sm text-slate-600">Addon Name</label>
                                        <input
                                            type="text"
                                            value={addonNameAdd}
                                            onChange={(e) => setAddonNameAdd(e.target.value)}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            placeholder="Extra Mayo, Extra Cheese, etc."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm text-slate-600">Addon Price</label>
                                        <input
                                            type="number"
                                            value={addonPriceAdd}
                                            onChange={(e) => setAddonPriceAdd(e.target.value)}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            placeholder="2500"
                                            min="0"
                                            step="100"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm text-slate-600">Addon Category</label>
                                        <div className="relative">
                                            <select
                                                value={addonCategoryAdd}
                                                onChange={(e) => setAddonCategoryAdd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="">Select Addon Category</option>
                                                <option value="sauce">Sauce</option>
                                                <option value="topping">Topping</option>
                                                <option value="size">Ukuran</option>
                                                <option value="side_dish">Lauk</option>
                                                <option value="drink">Minuman</option>
                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 absolute top-2.5 right-2.5 text-slate-700">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModalAddAddon}
                                            className="text-slate-600 hover:text-slate-800 text-sm underline"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        >
                                            Add Addon
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Update Addon Modal */}
            {showModalUpdAddon && (
                <>
                    <div
                        data-dialog-backdrop="animated-modal"
                        data-dialog-backdrop-close="true"
                        className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                    >
                        <div
                            data-dialog="animated-modal"
                            data-dialog-mount="opacity-100 translate-y-0 scale-100"
                            data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
                            data-dialog-transition="transition-all duration-300"
                            className="relative mx-auto w-full max-w-2xl rounded-lg overflow-hidden shadow-sm"
                        >
                            <div className="relative flex flex-col bg-white">
                                <div className="relative m-2.5 flex justify-center items-center text-white h-24 rounded-md bg-amber-500">
                                    <h3 className="text-2xl">Update Addon</h3>
                                </div>

                                <form onSubmit={updateAddon} className="p-6 space-y-4">
                                    <div>
                                        <label className="block mb-2 text-sm text-slate-600">Addon Name</label>
                                        <input
                                            type="text"
                                            value={addonNameUpd}
                                            onChange={(e) => setAddonNameUpd(e.target.value)}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            placeholder="Extra Mayo, Extra Cheese, etc."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm text-slate-600">Addon Price</label>
                                        <input
                                            type="number"
                                            value={addonPriceUpd}
                                            onChange={(e) => setAddonPriceUpd(e.target.value)}
                                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                            placeholder="2500"
                                            min="0"
                                            step="100"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm text-slate-600">Addon Category</label>
                                        <div className="relative">
                                            <select
                                                value={addonCategoryUpd}
                                                onChange={(e) => setAddonCategoryUpd(e.target.value)}
                                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="">Select Addon Category</option>
                                                <option value="sauce">Sauce</option>
                                                <option value="topping">Topping</option>
                                                <option value="size">Ukuran</option>
                                                <option value="side_dish">Lauk</option>
                                                <option value="drink">Minuman</option>
                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 absolute top-2.5 right-2.5 text-slate-700">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModalUpdAddon}
                                            className="text-slate-600 hover:text-slate-800 text-sm underline"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-amber-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-amber-600 focus:shadow-none active:bg-amber-600 hover:bg-amber-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        >
                                            Update Addon
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Popup Addon Modal */}
            <PopupDeleteAddon
                show={showPopUpDeleteAddon}
                onClose={() => setShowPopUpDeleteAddon(false)}
                onDelete={deleteAddon}
            />

            {/* Addon Alert Components */}
            <AlertAddAddonSuccess show={showAlertAddonSuccess} closing={closingAddonSuccess} />
            <AlertUpdAddon show={showAlertAddonUpdate} closing={closingAddonUpdate} />
            <AlertDeleteAddon show={showAlertAddonDanger} closing={closingAddonDanger} />

        </AdminLayout>
    )
}

export default ProductAdmin