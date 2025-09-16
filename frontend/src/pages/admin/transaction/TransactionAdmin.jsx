import React from 'react'
import AdminLayout from '../layout/AdminLayout'

const TransactionAdmin = () => {
    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Daftar Transaksi</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2">Order</th>
                                <th className="px-4 py-2">Customer</th>
                                <th className="px-4 py-2">Metode</th>
                                <th className="px-4 py-2">Total</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2 capitalize"></td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2">
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        className="text-blue-600 underline"
                                    >
                                        Detail
                                    </button>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Confirm
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

export default TransactionAdmin
