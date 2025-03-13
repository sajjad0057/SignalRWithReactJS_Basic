import React from 'react'

const MessageContainer = ({messages}) => {
  console.log(`MessageContainer -> messages : ${JSON.stringify(messages)}`)
  return( 
    <div>
      {
        messages.map((msg, index) => 
          <table striped bordered>
            <tr key = {index}>
              <td>{msg.a_msg} - {msg.sender}</td>
            </tr>
          </table>)
      }
    </div>
  )
 
}

export default MessageContainer