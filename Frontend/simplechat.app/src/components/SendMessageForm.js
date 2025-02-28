import { useState } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const SendMessageForm = ({sendMessage}) => {
  const [msg, setMessage] = useState('');
  return (
    <Form onSubmit = {e =>{
      e.preventDefault();
      sendMessage(msg);
      setMessage('');
    }}>
      <InputGroup className='mb-3' >
        <InputGroup.Text>Chat</InputGroup.Text>
        <Form.Control onChange={e => setMessage(e.target.value)} value={msg} placeholder="type a message"></Form.Control>
        <Button variant='primary' type='submit' disabled={!msg}>Send</Button>
      </InputGroup>
    </Form>
  )
}
