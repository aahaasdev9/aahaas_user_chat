import React, { useEffect, useState } from 'react'
import 'firebase/analytics';
import { db, auth } from '../firebase';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { faPaperPlane, faComments, faUserTie, faCircleUser, faCircleXmark, faPlus, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthState } from 'react-firebase-hooks/auth';
import GetChatsBox from './GetChatsBox';
// import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

function ChatBox() {

  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [usermessage, setusermessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [chatCount, setChatCount] = useState(0);

  const [chatArr, setChatArr] = useState([]);

  const sendMessage = async () => {
    if (usermessage.trim() === "") {
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "chats/chats_dats/" + user.uid), {
      text: usermessage,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    });
    setusermessage("");
  }

  const createNewChat = () => {
    // if (value === user.uid) {
    //   console.log("chat is already existing");
    // } else {
    //   console.log("new chat has been created");
    // }
  }

  const openChat = (value) => {
    if (!chatArr.includes(value)) {
      if (chatArr.length <= 2) {
        setChatArr(prevChatArr => [...prevChatArr, value])
        setChatCount(chatCount + 1)
      } else {
        chatArr.shift()
        setChatArr(prevChatArr => [...prevChatArr, value])
        setChatCount(chatCount - 1)
      }
    }
  }

  // const getTime = (value, type) => {
  //   if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
  //   const ts = (value.seconds + value.nanoseconds / 1000000000) * 1000;
  //   if (type === "value1") {
  //     return new Date(ts).toLocaleDateString();
  //   }
  //   if (type === "value2") {
  //     return new Date(ts).toDateString();
  //   }
  //   }
  //   return '';
  // };

  useEffect(() => {
    const q = query(
      collection(db, "chats/chats_dats/" + user.uid),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, []);

  return (

    <>

      
      <button
        className={`btn btn-primary border d-flex justify-content-between chat_button ${isOpen ? 'open' : 'close'}`} onClick={() => { setIsOpen(!isOpen) }}>
        <p className='m-0 p-1'><FontAwesomeIcon icon={faComments} /></p>
        <p className='m-0 p-1'>chat with us</p>
      </button >

      <div className='main_content_chats'>



        <div className={`chat_area ${isOpen ? 'open' : 'close'}`}>
          <div className='user_head'>
            <img src={user.photoURL} className='user_image' />
            <p className='user_name'>{user.displayName}</p>
            <p className='lost_login'>{Date(user.reloadUserInfo.lastLoginAt)}</p>
            <p className='close_icon'><FontAwesomeIcon icon={faCircleXmark} onClick={() => { setIsOpen(!isOpen) }} /></p>
          </div>

          <div className='main_chat_contents'>

            <div className='chat_contents user_head_update' onClick={() => { openChat(1) }}>
              <img src={user.photoURL} className='user_image' />
              <p className='user_name'>{user.displayName}</p>
              <p className='lost_login'>May i know the update ( static )</p>
            </div>

            <div className='chat_contents user_head_update' onClick={() => { openChat(2) }}>
              <FontAwesomeIcon icon={faUserGroup} className='user_image' />
              <p className='user_name'>{user.displayName} & apple</p>
              <p className='lost_login'>May i know the update ( static )</p>
            </div>

            <div className='chat_contents user_head_update' onClick={() => { openChat(3) }}>
              <img src={user.photoURL} className='user_image' />
              <p className='user_name'>{user.displayName}</p>
              <p className='lost_login'>May i know the update ( static )</p>
            </div>

            <div className='chat_contents user_head_update' onClick={() => { openChat(4) }}>
              <FontAwesomeIcon icon={faUserGroup} className='user_image' />

              <p className='user_name'>{user.displayName} & boat</p>
              <p className='lost_login'>May i know the update ( static )</p>
            </div>

            <div className='chat_contents user_head_update' onClick={() => { openChat(5) }}>
              <FontAwesomeIcon icon={faUserGroup} className='user_image' />

              <p className='user_name'>{user.displayName} & boat</p>
              <p className='lost_login'>May i know the update ( static )</p>
            </div>

            <div className='chat_contents user_head_update' onClick={() => { openChat(6) }}>
              <FontAwesomeIcon icon={faUserGroup} className='user_image' />

              <p className='user_name'>{user.displayName} & boat</p>
              <p className='lost_login'>May i know the update ( static )</p>
            </div>

            <div className='chat_contents user_head_update' onClick={() => { openChat(7) }}>
              <FontAwesomeIcon icon={faUserGroup} className='user_image' />

              <p className='user_name'>{user.displayName} & boat</p>
              <p className='lost_login'>May i know the update ( static )</p>
            </div>

          </div>

          <div className='newChat_button'>
            <button className='btn btn-primary' onClick={createNewChat}><FontAwesomeIcon icon={faPlus} className='m-1' />new chat</button>
          </div>
        </div>

        <div className='test'>
          {
            chatArr.map(value => (
              // <p>{value}</p>
              <GetChatsBox value={value}/>
            ))
          }
        </div>

      </div>


      <div className='chat_main_box'>
        {/* <button className="button_chat" onClick={handleClick}>
        <a href="javascript:;" class="code_view actionBtn8">
          <span class="txt"><ChatIcon></ChatIcon></span>
          <span class="txt_slide">Chat WithUs</span>
          <span class="btn_ico">
            <span>
              <img src="http://css3studio.com/images/effect_ex/ico_play_2.png" alt="" />
            </span>
          </span> 
        </a>
      </button> */}






        <div>

          <div className="chat_text_area_main">
            <p className="chat_text_area_heading">Aahaas support team</p>
            {/* <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className="chat_info_icon chat_info_icon2" /> */}
          </div>
          <div className="suggestions_message">
            <p>suuggesion 1</p>
            <p>suuggesion 2</p>
            <p>suuggesion 3</p>
            <p>suuggesion 4</p>
          </div>

          <div className="chats_content">

            {
              messages.map((value, key) => {
                return (
                  <span className="chat_msg">

                    <div className={`${value.uid === user.uid ? "chat-bubble right" : "chat-bubble left"}`}>
                      <p className="d-flex align-items-center justify-content-around">
                        <FontAwesomeIcon icon={faUserTie} className="admin_icon" style={{ display: `${key % 2 === 0 && key !== 3 && key !== 7 ? "none" : "block"}` }} />
                        {value.text}
                        <FontAwesomeIcon icon={faCircleUser} className="customer_icon" style={{ display: `${key % 2 === 1 ? "none" : "block"}` }} />
                      </p>
                      <span className="time">today mor 12.30</span>
                    </div>

                  </span>
                )
              })
            }

          </div>



          <div className="message_area input-group mb-3" onClick={sendMessage} >

            <input type="text" className="message " value={usermessage} placeholder="Enter your message here..." onChange={(e) => setusermessage(e.target.value)} />
            <button className="send_button">Send
              <FontAwesomeIcon icon={faPaperPlane} className="chat_send_icon" /></button>
          </div>

        </div>
      </div>
    </>

  )
}

export default ChatBox