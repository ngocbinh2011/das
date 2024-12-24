'use client'

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import ProductPage from './components/ProductPage';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import PurchasedBooks from './pages/PurchasedBooks';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import ViewPdf from './pages/ViewPdf';
import AudioBook from './pages/AudioBook';

function App() {
    return (
        <CartProvider>
            <AuthProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={
                            <ProtectedRoute>
                                <Login />
                            </ProtectedRoute>
                        } />
                        <Route path="/register" element={<Register />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/change-password" element={
                            <PrivateRoute>
                                <ChangePassword />
                            </PrivateRoute>
                        } />
                        <Route path="/book/:id" element={<BookDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/checkout" element={
                            <PrivateRoute>
                                <Checkout />
                            </PrivateRoute>
                        } />
                        <Route path="/success" element={
                            <PrivateRoute>
                                <Success />
                            </PrivateRoute>
                        } />
                        <Route path="/purchased-books" element={
                            <PrivateRoute>
                                <PurchasedBooks />
                            </PrivateRoute>
                        } />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/view-pdf" element={<ViewPdf />} />
                        <Route path="/audio-book" element={<AudioBook />} />
                    </Routes>
                    <Footer />
                </Router>
            </AuthProvider>
        </CartProvider>
    );
}

export default App;