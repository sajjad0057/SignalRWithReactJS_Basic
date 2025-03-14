import { useState } from "react"
import { Col, Form, Row, Button } from "react-bootstrap";

const WaitingRoom = ({ joinChatRoom }) => {
  const [username, setUsername] = useState();
  const [chatroom, setChatroom] = useState();

  return (
    <Form onSubmit={e => {
    e.preventDefault();
    console.log(`username : ${username}; chatroom : ${chatroom}`);
    
    joinChatRoom(username, chatroom)}}>
    <Row className='px-5 py-5'>
      <Col sm={12}>
        <Form.Group>
          <Form.Control placeholder='Username' className="my-2 p-2"
              onChange={e => setUsername(e.target.value)} />

          <Form.Control placeholder='Chatroom' className="my-2 p-2"
              onChange={e => setChatroom(e.target.value)} />
        </Form.Group>
      </Col>
      <Col sm={12}>
          <hr />
          <Button variant='success' type='submit'>Join</Button>
      </Col>
    </Row>
  </Form>)
}

export default WaitingRoom;