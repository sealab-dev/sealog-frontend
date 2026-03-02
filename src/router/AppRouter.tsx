import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "@/router/Guard";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ScrollToTop } from "./ScrollToTop";

//layout
import { HomePostsLayout } from "@/layout/home";
import { PostsLayout, EditorLayout, UserLayout } from "@/layout/user";
import { AdminLayout } from "@/layout/admin";

//page
import { HomePostsPage } from "@/pages/home";
import {
  PostDetailPage,
  PostFormPage,
  PostEditPage,
  PostsPage,
  SettingsPage,
} from "@/pages/user";
import {
  AdminAccountPage,
  AdminDashboardPage,
  AdminPostsPage,
  AdminStacksPage,
  AdminUsersPage,
} from "@/pages/admin";

//404
import { NotFoundPage } from "@/pages/notfound";

export const AppRouter = () => (
  <BrowserRouter basename="/">
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* 메인 게시글 목록 */}
        <Route path="/" element={<HomePostsLayout />}>
          <Route index element={<HomePostsPage />} />
          <Route path="collection" element={<HomePostsPage />} />
          <Route path="about" element={<HomePostsPage />} />
        </Route>

        {/* 유저 - 게시글 목록 */}
        <Route path="/user/:nickname" element={<PostsLayout />}>
          <Route index element={<PostsPage />} />
          {/* 타입별 */}
          <Route path="type/:postType" element={<PostsPage />} />
          {/* 스택별 */}
          <Route path="stack/:stack" element={<PostsPage />} />
          {/* 스택 + 타입 */}
          <Route path="stack/:stack/type/:postType" element={<PostsPage />} />
        </Route>

        {/* 유저 - 게시글 콘텐츠 */}
        <Route path="/user/:nickname" element={<PostsLayout />}>
          <Route path="entry/:slug" element={<PostDetailPage />} />
        </Route>

        {/* 유저 - 게시글 에디터 */}
        <Route path="/user/:nickname" element={<EditorLayout />}>
          <Route
            path="entry/:slug/edit"
            element={
              <ProtectedRoute>
                <PostEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="write"
            element={
              <ProtectedRoute>
                <PostFormPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 설정 페이지 */}
        <Route path="/user/:nickname" element={<UserLayout />}>
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 어드민 페이지 */}
        <Route
          path="/admin"
          element={<AdminRoute children={<AdminLayout />} />}
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="stacks" element={<AdminStacksPage />} />
          <Route path="create-account" element={<AdminAccountPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
