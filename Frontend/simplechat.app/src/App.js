import { Col, Container, Row } from 'react-bootstrap';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/waitingroom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useState } from 'react';

function App() {
  const [connect, setConnect] = useState();
  const joinChatRoom = async (username, chatroom) => {
    try {
      //initiate a connection
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7149/Chat")
        .configureLogging(LogLevel.Information)
        .build();

      // setup handler
      connection.on("ReceiveMessage", (username,msg)=>{
        console.log("msg : ", msg);
        
      });

      await connection.start();
      await connection.invoke("JoinSpecificChatRoom", {username, chatroom});
      setConnect(connection)

    } 
    catch (error) {
      console.log(error);      
    }
  }
  return (
    <div>
      <main>
        <Container>
          <Row className='px-5 my-5'>
            <Col sm='12'>
              <h1 className='font-weight-light'>
                Welcome to the simple chat app
              </h1>
            </Col>
          </Row>
          <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
        </Container>
      </main>
    </div>
  );
}

export default App;
