import React from 'react'
import {
    CAvatar,
    CBadge,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react'
import {
    cilCreditCard,
    cilFile,
    cilLockLocked,
    cilSettings,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useStore, actions } from '../context'
import avatar from '../assets/avatar.png'

const AppHeaderDropdown = () => {

    const [state, dispatch] = useStore()

    const handleLogOut = () => {
        dispatch(actions.logOut())
    }

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
                <CAvatar src={avatar} size="md" />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
                <CDropdownItem href="#">
                    <CIcon icon={cilSettings} className="me-2" />
                    Settings
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilCreditCard} className="me-2" />
                    Payments
                    <CBadge color="secondary" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilFile} className="me-2" />
                    Projects
                    <CBadge color="primary" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem href="#" onClick={() => { handleLogOut() }}>
                    <CIcon icon={cilLockLocked} className="me-2" />
                    Log Out
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppHeaderDropdown
