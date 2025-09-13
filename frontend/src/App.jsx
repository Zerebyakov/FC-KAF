import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardStaff from "./pages/staff/DashboardStaff";
import DashboardCustomer from "./pages/customer/DashboardCustomer";
import LandingPage from './pages/LandingPage';
import CategoryAdmin from './pages/admin/category/CategoryAdmin';
import ProductAdmin from './pages/admin/product/ProductAdmin';
import ProductAddonAdmin from './pages/admin/product/ProductAddonAdmin';


function App() {
  const { user, loading, isAdmin, isStaff, isCustomer, isAdminOrStaff } = useAuth();

  const LoadingScreen = () => (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );


  const AdminRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to='/login' replace />;
    if (!isAdmin) return <Navigate to='/' replace />
    return children;
  }

  const StaffRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    if (!isStaff()) return <Navigate to="/" replace />;
    return children;
  };

  const AdminStaffRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    if (!isAdminOrStaff()) return <Navigate to="/" replace />;
    return children;
  };

  const CustomerRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    if (!isCustomer()) return <Navigate to="/" replace />;
    return children;
  };


  const HomeRedirect = () => {
    if (loading) return <LoadingScreen />;

    if (user) {
      if (isAdmin()) {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (isStaff()) {
        return <Navigate to="/staff/dashboard" replace />;
      } else if (isCustomer()) {
        return <Navigate to="/user/dashboard" replace />;
      }
    }

    return <LandingPage />;
  };

  const LoginRedirect = () => {
    if (loading) return <LoadingScreen />;
    if (user) return <Navigate to="/" replace />;
    return <Login />;
  };


  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginRedirect />} />

        {/* Admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <DashboardAdmin/>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/category"
          element={
            <AdminRoute>
              <CategoryAdmin/>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product"
          element={
            <AdminRoute>
              <ProductAdmin/>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/addon"
          element={
            <AdminRoute>
              <ProductAddonAdmin/>
            </AdminRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <StaffRoute>
              <DashboardStaff/>
            </StaffRoute>
          }
        />


        {/* Customer Routes */}
        <Route
        path="/user/dashboard"
        element={
          <CustomerRoute>
            <DashboardCustomer/>
          </CustomerRoute>
        }
        >
        </Route>
      </Routes>
    </Router>
  )
}

export default App
