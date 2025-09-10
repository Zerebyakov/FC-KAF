import axios from 'axios';
import React, { useEffect, useState } from 'react'
import baseUrl from '../../../components/api/myAPI';
import AdminLayout from '../layout/AdminLayout';
import imageUrl from '../../../components/api/myImageUrl';

const CategoryAdmin = () => {
  const [allCategory, setAllCategory] = useState([]);

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpd, setShowModalUpd] = useState(false);

  const [nameAdd, setNameAdd] = useState('');
  const [descriptionAdd, setDescriptionAdd] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [imageAdd, setImageAdd] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [nameUpd, setNameUpd] = useState('')
  const [descriptionUpd, setDescriptionUpd] = useState('')
  const [sortOrderUpd, setSortOrderUpd] = useState('')
  const [imageUpd, setImageUpd] = useState(null);
  const [imagePreviewUpd, setImagePreviewUpd] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); 

  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    getAllCategory();
  }, [])

  const getAllCategory = async () => {
    try {
      const response = await axios.get(`${baseUrl}categories`, {
        withCredentials: true
      })
      setAllCategory(response.data.data)
    } catch (error) {
      console.log('Category Error Fetching : ', error)
    }
  }

  const addCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', nameAdd);
    formData.append('description', descriptionAdd);
    formData.append('sort_order', sortOrder);

    // Hanya append image jika ada file yang dipilih
    if (imageAdd) {
      formData.append('image_url', imageAdd);
    }

    try {
      await axios.post(`${baseUrl}categories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      getAllCategory();
      resetAddForm();
      setShowModalAdd(false);

      alert('Category berhasil ditambahkan!');
    } catch (error) {
      console.log('Gagal menambah kategori', error);
      alert('Gagal menambah kategori!');
    }
  }

  const resetAddForm = () => {
    setNameAdd('');
    setDescriptionAdd('');
    setImageAdd(null);
    setSortOrder('');
    setImagePreview(null);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageAdd(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const handleImageChangeUpd = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpd(file);
      setImagePreviewUpd(URL.createObjectURL(file));
    }
  }

  const handeCloseModal = () => {
    setShowModalAdd(false);
    resetAddForm();
  }

  const handleCloseModalUpd = () => {
    setShowModalUpd(false);
    setNameUpd('');
    setDescriptionUpd('');
    setSortOrderUpd('');
    setImageUpd(null);
    setImagePreviewUpd(null);
    setCurrentImage(null); // Reset current image
    setSelectedId(null);
  }

  const deleteCategory = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await axios.delete(`${baseUrl}categories/${id}`, {
          withCredentials: true
        })
        getAllCategory();
        alert('Category berhasil dihapus!');
      } catch (error) {
        console.log('GAGAL HAPUS CATEGORY', error)
        alert('Remove category failed!')
      }
    }
  }

  const getCategoryById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}categories/${id}`, {
        withCredentials: true
      })
      
      const categoryData = response.data.data;
      setNameUpd(categoryData.name)
      setDescriptionUpd(categoryData.description)
      setSortOrderUpd(categoryData.sort_order)
      
      // Set current image untuk preview
      setCurrentImage(categoryData.image_url);
      
      setImageUpd(null);
      setImagePreviewUpd(null);
    } catch (error) {
      console.log('ERROR CANNOT FETCH BY ID', error)
    }
  }

  const updateCategory = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', nameUpd);
      formData.append('description', descriptionUpd);
      formData.append('sort_order', sortOrderUpd);
      
      // Append image_url hanya jika ada file baru yang dipilih
      if (imageUpd) {
        formData.append('image_url', imageUpd);
      }
      await axios.put(`${baseUrl}categories/${selectedId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })

      getAllCategory();
      handleCloseModalUpd();
      alert('Category berhasil diupdate!');
    } catch (error) {
      console.log('CANNOT UPDATE CATEGORY', error);
      
      // Tampilkan error yang lebih detail
      if (error.response) {
        console.log('Response error:', error.response.data);
        alert(`Gagal update category: ${error.response.data.message || 'Unknown error'}`);
      } else {
        alert('Gagal update category: Network error');
      }
    }
  }

  const handleUpdClick = (id) => {
    setSelectedId(id);
    getCategoryById(id);
    setShowModalUpd(true);
  }

  return (
    <AdminLayout>
      <div>
        <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
          <div>
            <button
              onClick={() => setShowModalAdd(true)}
              data-dialog-target="animated-modal"
              className="rounded-md border border-slate-300 py-2 px-4 text-center text-md transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
              Add Category
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
                <th className="p-4 text-sm font-normal leading-none text-slate-500">Category</th>
                <th className="p-4 text-sm font-normal leading-none text-slate-500">Name</th>
                <th className="p-4 text-sm font-normal leading-none text-slate-500">Description</th>
                <th className="p-4 text-sm font-normal leading-none text-slate-500"></th>
              </tr>
            </thead>
            <tbody>
              {allCategory.map((item, index) => (
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
                  <td className="p-4 border-b border-slate-200 py-5">
                    <button
                      onClick={() => handleUpdClick(item.category_id)}
                      type="button" className="text-slate-500 hover:text-slate-700 mr-2">
                      <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteCategory(item.category_id)}
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
      </div>

      {/* MODAL ADD */}
      {showModalAdd && (
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
            className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm"
          >
            <div className="relative flex flex-col bg-white">
              <div className="relative m-2.5 items-center flex justify-center text-white h-24 rounded-md bg-slate-800">
                <h3 className="text-2xl">Add Category</h3>
              </div>
              <form onSubmit={addCategory} className="flex flex-col gap-4 p-6">
                <div className="w-full max-w-sm min-w-[200px]">
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

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">Description</label>
                  <textarea
                    value={descriptionAdd}
                    onChange={(e) => setDescriptionAdd(e.target.value)}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Category description"
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Sort order"
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  />
                  {imagePreview && (
                    <div className="w-full max-w-sm mt-2">
                      <p className="mb-1 text-sm text-slate-600">Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto max-h-48 object-contain border border-slate-300 rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    onClick={handeCloseModal}
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
      )}

      {/* MODAL UPDATE */}
      {showModalUpd && (
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
            className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm"
          >
            <div className="relative flex flex-col bg-white">
              <div className="relative m-2.5 items-center flex justify-center text-white h-24 rounded-md bg-slate-800">
                <h3 className="text-2xl">Update Category</h3>
              </div>
              <form onSubmit={updateCategory} className="flex flex-col gap-4 p-6">
                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">Name</label>
                  <input
                    type="text"
                    value={nameUpd}
                    onChange={(e) => setNameUpd(e.target.value)}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Category name"
                    required
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">Description</label>
                  <textarea
                    value={descriptionUpd}
                    onChange={(e) => setDescriptionUpd(e.target.value)}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Category description"
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrderUpd}
                    onChange={(e) => setSortOrderUpd(e.target.value)}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Sort order"
                  />
                </div>

                <div className="w-full max-w-sm min-w-[200px]">
                  <label className="block mb-2 text-sm text-slate-600">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChangeUpd}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  />
                  <div className="w-full max-w-sm mt-2">
                    {imagePreviewUpd ? (
                      // Tampilkan gambar baru yang akan diupdate
                      <div>
                        <p className="mb-1 text-sm text-slate-600">New Image Preview:</p>
                        <img
                          src={imagePreviewUpd}
                          alt="New Preview"
                          className="w-full h-auto max-h-48 object-contain border border-slate-300 rounded"
                        />
                      </div>
                    ) : currentImage ? (
                      <div>
                        <p className="mb-1 text-sm text-slate-600">Current Image:</p>
                        <img
                          src={`${imageUrl}${currentImage}`}
                          alt="Current"
                          className="w-full h-auto max-h-48 object-contain border border-slate-300 rounded"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No image available</p>
                    )}
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
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default CategoryAdmin