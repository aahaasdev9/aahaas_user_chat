import React, { useEffect, useState } from 'react'
import 'firebase/analytics';
import { db, auth } from '../firebase';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { faPaperPlane, faComments, faUserTie, faCircleUser, faCircleXmark, faPlus, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthState } from 'react-firebase-hooks/auth';
import pic from './img/Customer.png'
// import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

function ChatBox() {

  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [chatArr, setChatArr] = useState([]);

  const [userChats, setUserChats] = useState([
    {
      chat_ID: '12qw34'
    },
    {
      chat_ID: '23wqew45'
    },
    {
      chat_ID: '322343'
    },
    {
      chat_ID: '32343234'
    },
    {
      chat_ID: '234353'
    },
    {
      chat_ID: '13234234'
    },
    {
      chat_ID: '11213234'
    },
    {
      chat_ID: '1234233'
    },
    {
      chat_ID: '1234323'
    },
  ])

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

  const createNewChat = () => {
    // if (value === user.uid) {
    //   console.log("chat is already existing");
    // } else {
    //   console.log("new chat has been created");
    // }
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

  const handleClick = () => {
    setIsOpen(!isOpen)
    console.log(isOpen);
  }


  const [messages, setMessages] = useState([]);
  const [usermessage, setusermessage] = useState('');

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

  const closeChats = () => {
    setIsOpen(!isOpen);
    setChatArr([])
  }

  return (

    <>
      <button className={`btn btn-primary border-0 chat_button`} style={{ display: `${isOpen ? 'none' : 'block'}` }} onClick={handleClick}>
        <p className='m-0 p-1'>
          <FontAwesomeIcon icon={faComments} className='mx-1' />
          chat with us</p>
      </button >

      <div className=''>
        <div className={`chat_area ${isOpen ? 'open' : 'close'}`}>
          <div className='user_head'>
            <img src={user.photoURL} className='user_image' />
            <p className='user_name'>{user.displayName}</p>
            <p className='lost_login'>{Date(user.reloadUserInfo.lastLoginAt)}</p>
            <p className='close_icon'><FontAwesomeIcon icon={faCircleXmark} onClick={closeChats} /></p>
          </div>
          <div className='main_chat_contents'>
            {
              userChats.map((value, key) => {
                return (
                  <>
                    <div className='chat_contents user_head_update' onClick={() => { openChat(value) }}>
                      <FontAwesomeIcon icon={faUserGroup} className='user_image' />
                      <p className='user_name'>{user.displayName} & boat</p>
                      <p className='lost_login'>May i know the update ( static )</p>
                    </div>
                  </>
                )
              })
            }
          </div>
          <div className='newChat_button'>
            <button className='btn btn-primary' onClick={createNewChat}><FontAwesomeIcon icon={faPlus} className='m-1' />new chat</button>
          </div>
        </div>

        <div className='main_content_chats'>
          {
            chatArr.map(value => (
              <div className={`text_area  ${isOpen ? 'open' : ''}`}>
                <div className="chat_text_area_main">
                  <div className="d-flex chat_text_area_heading">
                    <img src={pic} className="profile-pic" />
                    <div className="ms-3">
                      <p>{user.displayName} ({value.chat_ID}) </p>
                      <span>{Date(user?.reloadUserInfo?.lastRefreshAt).slice(0, 24) || 'No valid date'}</span>
                    </div>
                    <span className='ms-auto me-3' onClick={() => { setIsOpen(false) }}>X </span>
                  </div>
                  {/* Additional elements or code if needed */}
                </div>

                <div className="chats_content">
                  {
                    messages.map((value, key) => {
                      return (
                        <span className="chat_msg">

                          <div className={`${value.uid === user.uid ? "chat-bubble right" : "chat-bubble left"}`}>
                            <p>{value.text}</p>
                            <span className="time"></span>
                          </div>

                        </span>
                      )
                    })
                  }
                </div>
                <div className="message_area input-group mb-3" onClick={sendMessage} >
                  <input type="text" className="message " value={usermessage} placeholder="Enter your message here..." onChange={(e) => setusermessage(e.target.value)} />
                  <button className="send_button">Send <FontAwesomeIcon icon={faPaperPlane} className="chat_send_icon" /></button>
                </div>

              </div>
            ))
          }
        </div>
      </div>






    </>
  )
}

export default ChatBox