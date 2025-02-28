import React from 'react'

const MessageContainer = ({messages}) => {
  console.log(`MessageContainer -> messages : ${JSON.stringify(messages)}`)
  return( 
    <div>
      {
        messages.map((msg, index) => 
          <table striped bordered>
            <tr key = {index}>
              <td>{msg.msg} - {msg.username}</td>
            </tr>
          </table>)
      }
    </div>
  )
 
}

export default MessageContainer