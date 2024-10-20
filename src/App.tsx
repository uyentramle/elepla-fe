import { Route, Routes } from 'react-router-dom';
import './App.css';
import { adminRoutes, privateRoutes, publicRoutes, managerRoutes, academyStaffRoutes, teacherRoutes } from './routes';

function App() {
    return (
        <>
            <Routes>
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
                {privateRoutes.map(({ layout, component, path }, index) => {
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
                {adminRoutes.map(({ layout, component, path }, index) => {
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
                {managerRoutes.map(({ layout, component, path }, index) => {
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
                {academyStaffRoutes.map(({ layout, component, path }, index) => {
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
                {teacherRoutes.map(({ layout, component, path }, index) => {
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
                
            </Routes>
        </>
    );
}

export default App;