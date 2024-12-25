import { Route, Routes } from "react-router-dom";
import "./App.css";
import { adminRoutes, privateRoutes, publicRoutes, managerRoutes, academyStaffRoutes, teacherRoutes } from "./routes";
import ProtectedRoute from "./routes/ProtectedRoute"; // Import HOC
import NotFoundPage from "@/pages/client/NotFound/NotFoundPage"; // Import trang Not Found
import RequireAuth from "./routes/RequireAuth";

function App() {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                {publicRoutes.map(({ layout, component, path }, index) => {
                    const Layout = layout;
                    const Component = component;
                    return (
                        <Route
                            key={index}
                            path={path}
                            element={<Layout children={<Component />} />}
                        />
                    );
                })}

                {/* Private Routes */}
                {privateRoutes.map(({ layout, component, path }, index) => {
                    const Layout = layout;
                    const Component = component;
                    return (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <RequireAuth>
                                    <ProtectedRoute allowedRoles={["Admin", "Teacher", "Manager", "AcademicStaff"]}>
                                        <Layout children={<Component />} />
                                    </ProtectedRoute>
                                </RequireAuth>
                            }
                        />
                    );
                })}

                {/* Admin Routes */}
                {adminRoutes.map(({ layout, component, path }, index) => {
                    const Layout = layout;
                    const Component = component;
                    return (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <RequireAuth>
                                    <ProtectedRoute allowedRoles={["Admin"]}>
                                        <Layout children={<Component />} />
                                    </ProtectedRoute>
                                </RequireAuth>
                            }
                        />
                    );
                })}

                {/* Manager Routes */}
                {managerRoutes.map(({ layout, component, path }, index) => {
                    const Layout = layout;
                    const Component = component;
                    return (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <RequireAuth>
                                    <ProtectedRoute allowedRoles={["Manager"]}>
                                        <Layout children={<Component />} />
                                    </ProtectedRoute>
                                </RequireAuth>
                            }
                        />
                    );
                })}

                {/* Academy Staff Routes */}
                {academyStaffRoutes.map(({ layout, component, path }, index) => {
                    const Layout = layout;
                    const Component = component;
                    return (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <RequireAuth>
                                    <ProtectedRoute allowedRoles={["AcademicStaff"]}>
                                        <Layout children={<Component />} />
                                    </ProtectedRoute>
                                </RequireAuth>
                            }
                        />
                    );
                })}

                {/* Teacher Routes */}
                {teacherRoutes.map(({ layout, component, path }, index) => {
                    const Layout = layout;
                    const Component = component;
                    return (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <RequireAuth>
                                    <ProtectedRoute allowedRoles={["Admin", "Teacher", "Manager", "AcademicStaff"]}>
                                    <Layout children={<Component />} />
                                    </ProtectedRoute>
                                </RequireAuth>
                            }
                        />
                    );
                })}

                {/* Not Found Page */}
                <Route path="/not-found" element={<NotFoundPage />} />

                {/* Default Fallback */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;