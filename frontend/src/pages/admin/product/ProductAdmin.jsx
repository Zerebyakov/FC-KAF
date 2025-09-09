import React from 'react'
import AdminLayout from '../layout/AdminLayout'

const ProductAdmin = () => {
    return (
        <AdminLayout>
            <div class="w-full flex justify-between items-center mb-3 mt-1 pl-3">
                <div>
                    <h3 class="text-lg font-semibold text-slate-800">Shopping Cart</h3>
                    <p class="text-slate-500">Review your selected items.</p>
                </div>
                <div class="mx-3">
                    <div class="w-full max-w-sm min-w-[200px] relative">
                        <div class="relative">
                            <input
                                class="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Search for product..."
                            />
                            <button
                                class="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-8 h-8 text-slate-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                <table class="w-full text-left table-auto min-w-max">
                    <thead>
                        <tr class="border-b border-slate-300 bg-slate-50">
                            <th class="p-4 text-sm font-normal leading-none text-slate-500">Product</th>
                            <th class="p-4 text-sm font-normal leading-none text-slate-500">Name</th>
                            <th class="p-4 text-sm font-normal leading-none text-slate-500">Quantity</th>
                            <th class="p-4 text-sm font-normal leading-none text-slate-500">Price per Item</th>
                            <th class="p-4 text-sm font-normal leading-none text-slate-500">Total Price</th>
                            <th class="p-4 text-sm font-normal leading-none text-slate-500"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="hover:bg-slate-50">
                            <td class="p-4 border-b border-slate-200 py-5">
                                <img src="https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/kam-idris-_HqHX3LBN18-unsplash.jpg" alt="Product 1" class="w-16 h-16 object-cover rounded" />
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="block font-semibold text-sm text-slate-800">Beautiful Chair</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">2</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">$500</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">$1,000</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <button type="button" class="text-slate-500 hover:text-slate-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="hover:bg-slate-50">
                            <td class="p-4 border-b border-slate-200 py-5">
                                <img src="https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/spacejoy-NpF_OYE301E-unsplash.jpg" alt="Product 2" class="w-16 h-16 object-cover rounded" />
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="block font-semibold text-sm text-slate-800">Little Sofa</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">1</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">$750</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">$750</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <button type="button" class="text-slate-500 hover:text-slate-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="hover:bg-slate-50">
                            <td class="p-4 border-b border-slate-200 py-5">
                                <img src="https://demos.creative-tim.com/corporate-ui-dashboard-pro/assets/img/michael-oxendine-GHCVUtBECuY-unsplash.jpg" alt="Product 3" class="w-16 h-16 object-cover rounded" />
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="block font-semibold text-sm text-slate-800">Brown Coach</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">3</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">$3,000</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <p class="text-sm text-slate-500">$9,000</p>
                            </td>
                            <td class="p-4 border-b border-slate-200 py-5">
                                <button type="button" class="text-slate-500 hover:text-slate-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}

export default ProductAdmin
