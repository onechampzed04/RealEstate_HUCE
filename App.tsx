
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ValuationPage from './pages/ValuationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SubmitPropertyPage from './pages/SubmitPropertyPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<PropertyDetailPage />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/submit-property" element={
              <PrivateRoute>
                <SubmitPropertyPage />
              </PrivateRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
