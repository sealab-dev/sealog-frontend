import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import EditorLayout from "../components/layout/EditorLayout";
import AdminLayout from "../components/layout/AdminLayout";
import HomePage from "../pages/blog/HomePage";
import UserHomePage from "../pages/blog/UserHomePage";
import PostDetailPage from "../pages/blog/PostDetailPage";
import PostEditPage from "../pages/blog/PostEditPage";
import MyPage from "../pages/user/MyPage";
import AdminUserPage from "../pages/admin/AdminUserPage";
import AdminPostPage from "../pages/admin/AdminPostPage";
import AdminStackPage from "../pages/admin/AdminStackPage";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Blog Routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path=":username/posts" element={<UserHomePage />} />
        <Route path=":username/entry/:slug" element={<PostDetailPage />} />
        <Route path="mypage" element={<MyPage />} />
      </Route>

      {/* Editor Routes */}
      <Route element={<EditorLayout />}>
        <Route path="/write" element={<PostEditPage />} />
        <Route path="/:username/entry/:slug/edit" element={<PostEditPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<AdminUserPage />} />
        <Route path="posts" element={<AdminPostPage />} />
        <Route path="stacks" element={<AdminStackPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
