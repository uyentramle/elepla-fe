import { Route, Routes } from 'react-router-dom';
import './App.css';
import allRoutes from './routes';
import clientRoutes from './routes/clientRoutes';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    const isAuthenticated = localStorage.getItem('accessToken') ? true : false;
    const userRole = localStorage.getItem('userRole') || 'guest';

    return (
        <>
            <AuthProvider>
                <Routes>
                    {clientRoutes.map(({ layout, component, path }, index) => {
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

                    {allRoutes.map(({ layout, component, path, allowedRoles }, index) => {
                        // const isClientRoute = clientRoutes.some(route => route.path === path);
                        const Layout = layout;
                        const Component = component;

                        return (
                            <Route
                                key={index}
                                path={path}
                                element={
                                    // isClientRoute ? (
                                    //     <Layout children={<Component />} />
                                    // ) : (
                                    <ProtectedRoute
                                        isAuthenticated={isAuthenticated}
                                        userRole={userRole}
                                        allowedRoles={allowedRoles}
                                    >
                                        <Layout children={<Component />} />
                                    </ProtectedRoute>
                                    // )
                                }
                            />
                        );
                    })}

                </Routes>
            </AuthProvider>
        </>
    );
}

export default App;