import React from 'react'
import { IoIosChatboxes } from 'react-icons/io';
import { Dropdown, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';

function UserPanel() {
    const { currentUser } = useSelector((state) => state.user);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth);
    };

    return (
        <div>
            <h3 style={{ color: 'white' }}>
                <IoIosChatboxes />{" "} Chat App
            </h3>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <Image
                src={currentUser && currentUser.photoURL}
                style={{ width: '30px', height: '30px', marginTop: '3px' }}
                roundedCircle
            />

            <Dropdown>
                <Dropdown.Toggle
                style={{ background: 'transparent', border: '0px' }}
                id="dropdown-basic"
                >
                    {currentUser && currentUser.displayName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">
                        프로필 사진 변경
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                        로그아웃
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel