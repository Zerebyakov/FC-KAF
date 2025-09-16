import React from 'react'

const ModalUpdAddon = ({
    show,
    onClose,
    addonNameUpd,
    setAddonNameUpd,
    addonPriceUpd,
    setAddonPriceUpd,
    addonCategoryUpd,
    setAddonCategoryUpd,
    updateAddon,

}) => {
    if (!show) return null;

    return (
        <div>
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
                                    onClick={onClose}
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
        </div>
    )
}

export default ModalUpdAddon;
