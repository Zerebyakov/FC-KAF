import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const AdminLayout = ({children }) => {
    return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
    )
}

export default AdminLayout
