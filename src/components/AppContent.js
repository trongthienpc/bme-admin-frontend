import { CContainer, CSpinner } from '@coreui/react';
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom'

const AppContent = () => {
    return (
        <CContainer lg>
            <Suspense fallback={<CSpinner color="primary" />}>
                <Outlet />
            </Suspense>
        </CContainer>
    )
};

export default AppContent;
