import React, { useRef } from 'react'
import { IoIosChatboxes } from 'react-icons/io';
import { Dropdown, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref as strRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref, child, update } from 'firebase/database';
import  mime from 'mime-types';

import { setPhotoURL } from '../../../redux/actions/user_action';

function UserPanel() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const inputOpenImageRef = useRef();

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth);
    };

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];

        const metadata = {contentType: mime.lookup(file.name)};
        try {
            //스토리지 파일 저장
            const storageRef = strRef(getStorage(), `user_image/${currentUser.uid}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                },
                (error) => {
                    console.error('실패', error);
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        updateProfile(currentUser, {
                            photoURL: downloadURL,
                        });

                        dispatch(setPhotoURL(downloadURL));
                        
                        update(child(ref(getDatabase(), "users"), currentUser.uid), {
                            image: downloadURL,
                        });
                    });
                }
            );
        } catch (error) {
            alert(error);
        }
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
                    <Dropdown.Item onClick={handleOpenImageRef}>
                        프로필 사진 변경
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                        로그아웃
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>

            <input
            type="file"
            accept='image/jpeg, image/png'
            style={{ display: "none" }}
            ref={inputOpenImageRef}
            onChange={handleUploadImage}
            />
        </div>
    )
}

export default UserPanel