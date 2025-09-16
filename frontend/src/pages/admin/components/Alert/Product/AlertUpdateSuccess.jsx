import React from 'react'

const AlertUpdateSuccess = ({ show, closing }) => {
    if (!show) return null;


    return (
        <div>
            <div className="fixed top-5 right-5 z-50">
                <div
                    className={`flex items-center p-4 mb-4 text-sm text-amber-800 rounded-lg bg-amber-50 shadow-lg
                ${closing ? 'animate-slide-out' : 'animate-slide-in'}`}
                >
                    <svg className="flex-shrink-0 inline w-5 h-5 mr-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 9.414a1 1 0 011.414-1.414L9 11.293l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Success!</span>&nbsp; Product has been updated.
                </div>
            </div>
        </div>
    )
}

export default AlertUpdateSuccess
