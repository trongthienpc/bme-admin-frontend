import React, { useContext } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const {
        authState: { authLoading, isAuthenticated }
    } = useContext(AuthContext)

    if (authLoading)
        return (
            <div className='spinner-container'>
                {/* <Spinner animation='border' variant='info' /> */}
            </div>
        )

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <>
                        {/* <NavbarMenu /> */}
                        <Component {...rest} {...props} />
                    </>
                ) : (
                    <Navigate to='/login' />
                )
            }
        />
    )
}

export default ProtectedRoute