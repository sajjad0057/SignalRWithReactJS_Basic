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


const token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjUxMTAwOTYiLCJzZXNzaW9uIjoiMmI3ZTRjY2ItMDBiNS0xMWYwLTlkYjUtMzA4NWE5ZWUyNWQ0LWMwOWNhZjZkNGNhNTNjMWJlNmY3ZTlmOWJkYWIwNzEzIiwibmJmIjoxNzQxOTQzODU3LCJleHAiOjE3NDQ1MzU4NTcsImlzcyI6InF1aW5ib29rLmNvbSIsImF1ZCI6InF1aW5ib29rLmNvbSJ9.R3NITpN0EPxqea7ykENu2PFpf0dpqn9zumVptfalrG1eWtrasrcnQD5AlA_2IttPx1WVP3Vhv4sC6-GPyuCFDyv7M03uYiwS65OxWIw7zwRCbsAZLa4EeQT27VdKjkAmeIU63TE6zougHXfVMxmbIrijLIGdU75T7HXl-x5Bx64zRE5HeEBOobn_LW7r9eAKz-q6_XUm25rbXHZ2zMTRw_y7KILBydk5SUYCsa4NQkCXMzkmg_72FvHqAInMafhGVTti89oHpU2ioaeV_4qn7OxMk4xm9aI3_Icmvi7oe81eIKjYRD91HH4aTy0v0gDV2X0mHFVLLc8mz2i3yr5jNw";

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
      await connect.invoke("SendMessageToUser", messageData)
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
