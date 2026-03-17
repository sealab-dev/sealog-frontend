import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrollToTop";
import AppLayout from "@/components/layout/AppLayout";
import EditorLayout from "@/components/layout/EditorLayout";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import MyPageLayout from "@/components/layout/mypage/MyPageLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";

import HomePage from "@/pages/blog/HomePage";
import UserHomePage from "@/pages/blog/UserHomePage";
import PostDetailPage from "@/pages/blog/PostDetailPage";
import PostEditPage from "@/pages/blog/PostEditPage";
import MyProfilePage from "@/pages/mypage/MyProfilePage";
import MyPostsPage from "@/pages/mypage/MyPostsPage";
import MySeriesPage from "@/pages/mypage/MySeriesPage";
import AdminUserPage from "@/pages/admin/AdminUserPage";
import AdminPostPage from "@/pages/admin/AdminPostPage";
import AdminStackPage from "@/pages/admin/AdminStackPage";
import NotFoundPage from "@/pages/common/NotFoundPage";

export const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* Public Routes: 누구나 접근 가능한 블로그 관련 경로 */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path=":username/posts" element={<UserHomePage />} />
        <Route path=":username/posts/:stackGroup/:stackName" element={<UserHomePage />} />
        <Route path=":username/series/:seriesSlug" element={<UserHomePage />} />
        <Route path=":username/entry/:slug" element={<PostDetailPage />} />
      </Route>

      {/* Protected Routes: 로그인한 유저만 접근 가능 */}
      <Route element={<ProtectedRoute />}>
        {/* Editor Routes */}
        <Route element={<EditorLayout />}>
          <Route path="/write" element={<PostEditPage />} />
          <Route path="/:username/entry/:slug/edit" element={<PostEditPage />} />
        </Route>

        {/* MyPage Routes */}
        <Route path="/mypage" element={<MyPageLayout />}>
          <Route index element={<Navigate to="/mypage/profile" replace />} />
          <Route path="profile" element={<MyProfilePage />} />
          <Route path="posts" element={<MyPostsPage />} />
          <Route path="series" element={<MySeriesPage />} />
        </Route>
      </Route>

      {/* Admin Routes: 어드민만 접근 가능 */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<AdminUserPage />} />
          <Route path="posts" element={<AdminPostPage />} />
          <Route path="stacks" element={<AdminStackPage />} />
        </Route>
      </Route>

      {/* 404 Not Found: 명시적 경로 및 와일드카드 처리 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
