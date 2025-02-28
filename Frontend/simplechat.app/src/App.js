import { Col, Container, Row } from 'react-bootstrap';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/WaitingRoom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useState } from 'react';
import ChatRoom from './components/Chatroom';

function App() {
  const [connect, setConnect] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      //initiate a connection
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7149/Chat")
        .configureLogging(LogLevel.Information)
        .build();

      // setup frontend side methods using connection.on()
      connection.on("JoinSpecificChatRoomClientSide", (username, msg)=>{
        setMessages(messages => [...messages, {username, msg}])
        console.log(` JoinSpecificChatRoomClientSide -> username : ${username}; msg : ${msg}`);    
      });

      connection.on("ReceiveSpecificMessageClientSide", (username, msg) =>{
        setMessages(messages => [...messages, {username, msg}])
        console.log(`ReceiveSpecificMessage -> messages : ${messages}`)
      })

      await connection.start();

      //// here invoke method 1st parameter is server end method name 
      await connection.invoke("JoinSpecificChatRoomServerSide", {username, chatroom});
      setConnect(connection)

    } 
    catch (error) {
      console.log(error);      
    } 
  }

  const sendMessage = async (message) =>{
    try{
      await connect.invoke("SendSpecificMessageServerSide", message)
    }catch(e){
      console.log(e);
      
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
          { !connect 
            ? <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
            : <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
         }
          
        </Container>
      </main>
    </div>
  );
}

export default App;
