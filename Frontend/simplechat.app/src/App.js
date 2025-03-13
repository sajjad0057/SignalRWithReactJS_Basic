import { Col, Container, Row } from 'react-bootstrap';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/WaitingRoom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useState } from 'react';
import ChatRoom from './components/Chatroom';
import ChannelRoom from './components/Channelroom';
import { messageChannelData } from './data/message.channel';
import { messageData } from './data/message';


const token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJzZXNzaW9uIjoiMTc0ZGE3MzItZjc1Yy0xMWVmLTlkYjUtMzA4NWE5ZWUyNWQ0LWMwOWNhZjZkNGNhNTNjMWJlNmY3ZTlmOWJkYWIwNzEzIiwibmJmIjoxNzQwOTE2MDM3LCJleHAiOjE3NDM1MDgwMzcsImlzcyI6InF1aW5ib29rLmNvbSIsImF1ZCI6InF1aW5ib29rLmNvbSJ9.DcbDmsArrNm1vEfWNz5ArJJFnqI-aBubK1jUxjvv6t9TS0EZRL6PvtzIt7hzu1SHQWrierBHcIXuC4aW62oy32FgFEwKAUhECGseDca5ItUfaeCWG8JtNuL9ThMM-KgqKNVsFm1J0CMHSLnFNpMGri9UEanhY1mhelA3yY9uvYfStqXCM_KcYJv1QCJnbQaMyRkNSOyTyoubUMdbF_hbN3CVbcpG68Cte0vd5XW7KskFxmnClr7qOWwMNuJ960SZVKiGt9PoG3LF4r-mI29uw0R__Q_vx36PyqBuU4KTeqqVVr8lIMDZh3LE4kIuCHa-evKUtIpNIAiICVvHFfYN6w";

function App() {
  const [connect, setConnect] = useState();
  const [messages, setMessages] = useState([]);
  const [channelMessages, setChannelMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      //initiate a connection
      const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/messagingHub", {
        accessTokenFactory: () => token // Attach token to the request
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
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

      // connection.on("ReceiveChannelMessage", (sender, msg) =>{
      //   setChannelMessages(messages => [...messages, {sender,msg}])
      //   console.log(`ReceiveSpecificMessage -> messages : ${messages}`)
      // })

      connection.on("ReceiveMessage", (sender, msg) =>{
        console.log(`ReceiveMessage : msg -> ${JSON.stringify(msg)}`);
        var a_msg = msg.message;
        setChannelMessages(messages => [...messages, {sender, a_msg}])
        console.log(`ReceiveSpecificMessage -> messages : ${messages}`)
      })

      await connection.start();

      //// here invoke method 1st parameter is server end method name 
      await connection.invoke("JoinCompanyGroup", messageChannelData);
      setConnect(connection)

    } 
    catch (error) {
      console.log(error);      
    } 
  }

  const sendMessage = async (message) =>{
    try{
      console.log(`sendMessage : ${message}`);
      
      await connect.invoke("SendMessageToCompany", messageData)
      //console.log(`sendMessage res : ${res}`);
      
    }catch(e){
      console.log(e);
      
    }
  }

  const sendChannelMessage = async (message) =>{
    try{
      await connect.invoke("PublishMessageToChannel", messageData)
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
            : (
              <div>
                <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
                <ChannelRoom channelMessages={channelMessages} sendChannelMessage={sendChannelMessage}></ChannelRoom>
              </div>
              )
         }
          
        </Container>
      </main>
    </div>
  );
}

export default App;
