import React, { useEffect, useState } from 'react'
import 'firebase/analytics';
import { db, auth } from '../firebase';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { faPaperPlane, faComments, faRectangleXmark, faCircleXmark, faPlus, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthState } from 'react-firebase-hooks/auth';
import pic from './img/Customer.png'
import axios from 'axios';

function ChatBox() {

  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [userChats, setUserChats] = useState([]);
  const [chatArr, setChatArr] = useState([]);
  const [messages, setMessages] = useState([]);

  const [usermessage, setusermessage] = useState({
    0: '',
    1: '',
    2: '',
  });

  const handleChangeUserMessage = (inputName, value) => {
    setusermessage(prevValues => ({
      ...prevValues,
      [inputName]: value,
    }));
  };

  const openChat = (value, key) => {
    console.log(value,key);
    if (!chatArr.find(chat => chat.id === value)) {
      if (chatArr.length <= 2) {
        setChatArr(prevChatArr => [...prevChatArr, { id: value, name: key }])
        setChatCount(chatCount + 1)
      } else {
        chatArr.shift()
        setChatArr(prevChatArr => [...prevChatArr, { id: value, name: key }])
        setChatCount(chatCount - 1)
      }
    }
  }

  // useEffect(() => {
  //   console.log(chatArr);
  // }, [chatArr])

  const fetchMessagesTestingprocess = () => {
    setMessages('')
    chatArr.map((value, key) => {
      getMessages(value, key)
    })
  }

  useEffect(() => {
    fetchMessagesTestingprocess()
  }, [chatArr])

  const getTime = (value, type) => {
    if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
      const ts = (value.seconds + value.nanoseconds / 1000000000) * 1000;
      if (type === "value1") {
        return new Date(ts).toLocaleDateString();
      }
      if (type === "value2") {
        return new Date(ts).toDateString();
      }
      if (type === "value3") {
        return new Date(ts).toDateString() + " : " + new Date(ts).toLocaleTimeString()
      }
    }
    return '';
  };

  const closeChat = (chatID) => {
    const updatedChatArr = chatArr.filter(chat => chat.name !== chatID);
    setChatArr(updatedChatArr);
  };

  const sendMessage = async (key) => {
    if (usermessage[key].trim() === "") {
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "chats/chats_dats/" + chatArr[key].id), {
      text: usermessage[key],
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    });
    setusermessage(prevValues => ({
      ...prevValues,
      [key]: '',
    }));
    fetchMessagesTestingprocess()
  }

  const closeChats = () => {
    setIsOpen(!isOpen);
    setChatArr([])
  }



  const getMessages = (value) => {
    const q = query(
      collection(db, "chats/chats_dats/" + value.id),
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
      setMessages(prevChatArr => [...prevChatArr, { id: chatArr.indexOf(value), data: sortedMessages }])
    });
    return () => unsubscribe();
  }

  const getChatInformation = () => {
    try {
      axios.get(`/chats/${user.uid}`).then(res => {
        if (res.data.status === 200) {
          setUserChats(res.data.data);
          // if (userChats.length > 0) {
          //   userChats.map(value => {
          //     if (value === user.uid) {
          //       console.log('already chat is existing');
          //     } else {
          //       console.log('no chats are there hence we need to create a new chat !');
          //     }
          //   })
          // }
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getChatInformation()
  }, [])

  // post-/updatechat/{id} 

  const createNewChat = (e) => {

    e.preventDefault();

    const dataSet = {
      // input details data
      customer_collection_id: user.uid + userChats.length,
      supplier_id: '',
      supplier_name: '',
      group_chat: '',
      customer_name: user.displayName,
      status: "pending",
      chat_created_date: new Date(),
      customer_mail_id: user.email,
      supplier_mail_id: '',
      supplier_added_date: '',
      comments: '',
      chat_name: `chat ${userChats.length}`,
      customer_id: user.uid
    };

    if (userChats.length >= 1) {
      axios.post('./addchats', dataSet).then(
        res => {
          if (res.data.status === 200) {
            alert("chat added successfully")
          } else {
            alert("error in adding chat")
          }
        }
      )
    } else {
      axios.post('./addchats', dataSet).then(
        res => {
          if (res.data.status === 200) {
            alert("chat added successfully")
          } else {
            alert("error in adding chat")
          }
        }
      )
    }
  }

  return (
    <div>

      <button className={`btn btn-primary border-0 chat_button d-flex justify-content-around`} style={{ display: `${isOpen ? 'none' : 'block'}` }} onClick={() => { setIsOpen(!isOpen) }}>
        <p className='mr-2'><FontAwesomeIcon icon={faComments} /></p>
        <p className=''>chat with us</p>
      </button >

      <div className='testing_process_need_to_give_valid_name'>
        <div className={`chat_area ${isOpen ? 'open' : 'close'}`}>
          <div className='user_head'>
            <img src={user.photoURL} className='user_image' alt='user profile' />
            <p className='user_name'>{user.displayName}</p>
            <p className='lost_login'>{Date(user.reloadUserInfo.lastLoginAt)}</p>
            <p className='close_icon'><FontAwesomeIcon icon={faCircleXmark} onClick={closeChats} /></p>
          </div>
          <div className='main_chat_contents'>
            {
              userChats.length > 0 &&
              userChats.map((value, key) => {
                {
                  // console.log(key)
                  console.log(value)
                }
                return (
                  <div className='chat_contents user_head_update' onClick={() => { openChat(value.customer_collection_id, key) }} key={key}>
                    <FontAwesomeIcon icon={faUserGroup} className='user_image' />
                    <p className='user_name'>{value.customer_name}
                      <span className='user_chat_count'>
                        chat no :
                        {value.chat_id}
                      </span>
                    </p>

                    {/* <p className='lost_login'>{Date(value.created_at)}</p> */}
                    <p className='lost_login'>{value.customer_collection_id}</p>
                  </div>
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
            chatArr.map((value, key) => (

              <div className="text_area" key={key}>
                <div className="chat_text_area_heading">
                  <img src={pic} className="profile-pic" alt='user profile' />
                  <p className='profile_name'>{userChats[key].customer_name} {userChats[key].supplier_name} </p>
                  {/* <p className='profile_time'>{Date(user?.reloadUserInfo?.lastRefreshAt).slice(0, 15) || 'No valid date'}</p> */}
                  <p className='profile_time'>{value.id}</p>
                  {/* <p className='profile_chat_count'> chat no : {userChats[key].chat_id} </p> */}
                  <span className='close_individual_chat' onClick={() => { closeChat(value.name) }}>
                    <FontAwesomeIcon icon={faRectangleXmark} className='fs-4' />
                  </span>
                </div>
                <div className="chats_content">
                  {
                      console.log("messages",value)
                  }
                  {
                    messages[key] !== undefined &&
                    messages[key].data.map((value, key) => {
                      return (
                        <div className="chat_msg" key={key}>
                          <div className={`${value.uid === user.uid ? "chat-bubble left" : "chat-bubble right"}`}>
                            <div className='chats'>
                              <img src={value.avatar} />
                              <p>{value.name}</p>
                              <p>{value.text}</p>
                            </div>
                            <span className="time">{getTime(value.createdAt, "value3")}</span>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>

                <div className="message_area input-group" onClick={() => { sendMessage(key) }} >
                  <input type="text" className="message col-9" value={usermessage[chatArr.indexOf(value)]} placeholder="Enter your message here..." onChange={(e) => handleChangeUserMessage(key, e.target.value)} />
                  <button className="send_button col-2"><FontAwesomeIcon icon={faPaperPlane} className="chat_send_icon" /></button>
                </div>

              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default ChatBox;