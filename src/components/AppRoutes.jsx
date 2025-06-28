import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout/AppLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

// Pages
import Home from "../pages/Home/Home";
import Topic from "../pages/Topic/Topic";
import TopicsListing from "../pages/TopicsListing/TopicsListing";
import BlogDetail from "../pages/BlogDetail/BlogDetail";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/EditProfile/EditProfile";
import MyPosts from "../pages/MyPosts/MyPosts";
import WritePost from "../pages/WritePost/WritePost";
import Bookmarks from "../pages/Bookmarks/Bookmarks";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import NotFound from "../pages/NotFound/NotFound";

const AppRoutes = () => {
    return (
        <Routes>
            {/* App Layout Routes */}
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="topics" element={<TopicsListing />} />
                <Route path="topics/:slug" element={<Topic />} />
                <Route path="blog/:slug" element={<BlogDetail />} />
                <Route path="profile/:username" element={<Profile />} />
                <Route
                    path="profile/:username/edit"
                    element={<EditProfile />}
                />
                <Route path="my-posts" element={<MyPosts />} />
                <Route path="write" element={<WritePost />} />
                <Route path="write/:slug" element={<WritePost />} />
                <Route path="bookmarks" element={<Bookmarks />} />
            </Route>

            {/* Auth Routes */}
            <Route
                path="/login"
                element={
                    <AuthLayout>
                        <Login />
                    </AuthLayout>
                }
            />
            <Route
                path="/register"
                element={
                    <AuthLayout>
                        <Register />
                    </AuthLayout>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <AuthLayout>
                        <ForgotPassword />
                    </AuthLayout>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <AuthLayout>
                        <ResetPassword />
                    </AuthLayout>
                }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
