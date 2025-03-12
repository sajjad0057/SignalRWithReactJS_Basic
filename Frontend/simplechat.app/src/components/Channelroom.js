import { Row, Col } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import { SendMessageForm } from "./SendMessageForm";

const ChannelRoom = ({channelMessages, sendChannelMessage}) => (
  <div>
    <Row className="px-5 py-5">
      <Col sm={10}>
        <h2>Channel Room</h2>
      </Col>
      <Col>
      
      </Col>
    </Row>
    <Row className="px-5 py-5">
      <Col sm={12}>
        <MessageContainer messages = {channelMessages}/>
      </Col>
      <Col sm={12}>
        <SendMessageForm sendMessage = {sendChannelMessage}/>
      </Col>
    </Row>
  </div>
);

export default ChannelRoom;