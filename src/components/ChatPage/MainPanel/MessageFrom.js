import React, { useState } from 'react'
import { Col, Form, ProgressBar, Row } from "react-bootstrap"
import { child, set, remove, push, ref, getDatabase } from "firebase/database";
import { useSelector } from 'react-redux';

function MessageFrom() {
  const [content, setContent] = useState("")
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageRef = ref(getDatabase(), "messages");
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    e.preventDefault();
    setContent(e.target.value)
  }

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: new Date(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        image: currentUser.photoURL
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  }

  const handleSubmit = async () => {
    if (!content) {
      setErrors(prev => prev.concat("Type contents first"))
      return;
    }
    setLoading(true);
    //firebase에 메시지를 저장
    try {
      await set(push(child(messageRef, currentChatRoom.id)), createMessage());
      remove(child(messageRef,`${currentChatRoom.id}/${currentUser.uid}`));
      
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      console.error(error);
      setErrors(prev => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  // const handleKeyDonw = (e) => {
  //   if (e.ctrlKey && e.keyCode === 13) {
  //     handleSubmit();
  //   }

  //   if (content) {
  //     set(child(typingRef,`${currentChatRoom.id}/${currentUser.uid}`), currentUser.displayName);
  //   } else {
  //     remove(child(typingRef,`${currentChatRoom.id}/${currentUser.uid}`));
  //   }
  // };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
          value={content}
          onChange={handleChange}
          as="textarea"
          rows={3}
          />
        </Form.Group>
      </Form>

      <ProgressBar variant='warning' label="60%" now={60} />

      <div>
        {errors.map(errorMsg => <p style={{ color: "red" }} key={errorMsg}>{errorMsg}</p>)}
      </div>

      <Row>
        <Col>
          <button
          className='message-form-button'
          style={{ width: '100%' }}
          onClick={handleSubmit}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
          className='message-form-button'
          style={{ width: '100%' }}
          >
            UPLOAD
          </button>
        </Col>
      </Row>
    </div>
  )
}

export default MessageFrom