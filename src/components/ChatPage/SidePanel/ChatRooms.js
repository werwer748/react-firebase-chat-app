import React, { useCallback, useState, useEffect } from 'react'
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getDatabase, ref, onChildAdded, onValue, push, child, update, off } from "firebase/database";
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';

function ChatRooms() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const chatRoomRef = ref(getDatabase(), "chatRooms");
  const [chatRooms, setChatRooms] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");

  useEffect(() => {
    AddChatRoomsListeners();
    return () => {
      off(chatRoomRef)
    };
  }, []);

  useEffect(() => {
    const firstChatRoom = chatRooms[0]
    if (firstLoad && chatRooms.length > 0) {
        dispatch(setCurrentChatRoom(firstChatRoom))
        setActiveChatRoomId(firstChatRoom.id);
        setFirstLoad(false);
    }
  }, [chatRooms]);

  const AddChatRoomsListeners = () => {
    let chatRoomsArray = [];
  
    onChildAdded(chatRoomRef, (DataSnapshot) => {
      // 여기만 알아서 돌아감
      chatRoomsArray.push(DataSnapshot.val());
      setChatRooms(chatRoomsArray);
    });
  };

  const changeChatRoom = (room) => {
    dispatch(setCurrentChatRoom(room));
    setActiveChatRoomId(room.id);
  };

  const renderChatRooms = useCallback((chatRooms) => 
    chatRooms.length > 0 &&
    chatRooms.map(room => (
      <li
        key={room.id}
        style={{ backgroundColor: room.id === activeChatRoomId && "#ffffff45"}}
        onClick={() => changeChatRoom(room)}
      >
          {room.name}
      </li>
  )), [activeChatRoomId]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isFormValid = (name, description) => name && description;

  const addChatRoom = async () => {
    const key = push(chatRoomRef).key;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
          name: currentUser.displayName,
          image: currentUser.photoURL
      }
    };

    try {
      await update(child(chatRoomRef, key), newChatRoom);
      setShow(false);
      setName("");
      setDescription("");
  } catch (error) {
      alert(error);
  }
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (isFormValid) {
      addChatRoom();
    }
  }, [name, description]);

  return (
    <div>
      <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
      >
        <FaRegSmileWink style={{ marginRight: 3 }} />
        CHAT ROOMS{" "} (1)

        <FaPlus
        style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
        onClick={handleShow}
        />
      </div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {renderChatRooms(chatRooms)}
      </ul>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a chat room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>방 이름</Form.Label>
              <Form.Control
              type="text"
              placeholder="Enter a chat room name"
              onChange={(e) => (
                e.preventDefault(),
                setName(e.target.value)
              )}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>방 설명</Form.Label>
              <Form.Control
              type="text"
              placeholder="Enter a chat room description"
              onChange={(e) => (
                e.preventDefault(),
                setDescription(e.target.value)
              )}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer> 
          {/* 폼 안에 있어야 서브밋이 먹는다 */}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ChatRooms