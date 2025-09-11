import React, { useEffect, useState } from 'react'
import AdminLayout from '../layout/AdminLayout'
import axios from 'axios';
import baseUrl from '../../../components/api/myAPI';
import imageUrl from '../../../components/api/myImageUrl';



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
    const [currentImage, setCurrentImage] = useState(null)

    const [nameUpd, setNameUpd] = useState('')
    const [descriptionUpd, setDescriptionUpd] = useState('');
    const [categoryUpd, setCategoryUpd] = useState('');
    const [priceUpd, setPriceUpd] = useState('');
    const [prepareUpd, setPrepareUpd] = useState('');
    const [stockUpd, setStockUpd] = useState('')
    const [imageUpd, setImageUpd] = useState(null)
    const [imagePreviewUpd, setImagePreviewUpd] = useState(null);

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
            // console.log(response.data.data)
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
            // console.table(response.data.data)
            // console.log(response.data.data)
        } catch (error) {
            console.log('Cannot fetch product API', error)
        }
    }
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
            alert('Add Product succesfully !!')
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

    // Set Update Area
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
            alert('Product berhasil diupdate !')
        } catch (error) {
            console.log('CANNOT UPDATE THE PRODUCT', error)
            alert('GAGAL UPDATE PRODUCT', error)
        }
    }

    const handleUpdClick = (id) => {
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

    return (
        <AdminLayout>
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
                            <tr key={index} className="hover:bg-slate-50">
                                <td className="p-4 border-b border-slate-200 py-5">
                                    <p className="block font-semibold text-sm text-slate-800">{index + 1}.</p>
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
                                        onClick={() => handleUpdClick(item.product_id)}
                                        type="button" className="text-slate-500 hover:text-slate-700 mr-2">
                                        <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                        </svg>
                                    </button>
                                    <button
                                        // onClick={() => deleteCategory(item.category_id)}
                                        type="button" className="text-slate-500 hover:text-slate-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
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
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-slate-600">Category</label>
                                            <div className="relative">
                                                <select
                                                    value={categoryAdd}
                                                    onChange={(e) => setCategoryAdd(e.target.value)}
                                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
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
        </AdminLayout>
    )
}

export default ProductAdmin
