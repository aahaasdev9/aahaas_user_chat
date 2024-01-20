import React, { useEffect, useState } from 'react'
import 'firebase/analytics';
import { db, auth } from '../firebase';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { faPaperPlane, faComments, faRectangleXmark, faSquareCaretDown, faCircleXmark, faPlus, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthState } from 'react-firebase-hooks/auth';
import pic from './img/Customer.png'
import axios from 'axios';
// import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

function ChatBox() {

  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [chatArr, setChatArr] = useState([]);
  const [messages, setMessages] = useState([]);
  const [usermessage, setusermessage] = useState('');

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
    const updatedChatArr = chatArr.filter(chat => chat.chat_ID !== chatID);
    setChatArr(updatedChatArr);
  };

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

  useEffect(() => {
    try {
      axios.get('./chats').then(res => {
        if (res.data.status === 200) {
          setUserChats(res.data);
          if (userChats.length > 0) {
            userChats.map(value => {
              if (value === user.uid) {
                console.log('already chat is existing');
              } else {
                console.log('no chats are there hence we need to create a new chat !');
              }
            })
          } else {
            console.log('data is not a array that is ', typeof (res.data));
          }
        }
      })
    } catch (error) {
      console.log(error);
    }
  })

  // post-/updatechat/{id} 

  const createNewChat = () => {
    if (userChats.length === 0){
      // Post - /addchats
    }
  }

  /* 
   e.preventDefault();
        axios.defaults.withCredentials = true;
        const dataset = {
            username: registerUser.username,
            email: registerUser.email,
            password: registerUser.password,
        };

        console.log(dataset)

        setLoginProcess(30);

        axios.get('/sanctum/csrf-cookie').then(response => {

            setLoginProcess(50);
            axios.post('new-user-registration', dataset, {
                xsrfHeaderName: "X-XSRF-TOKEN",
                withCredentials: true
            }).then(res => {

                setLoginProcess(75);

                if (res.data.status === 200) {
                    console.log("Connection OK")
                    // navigate('/main/landing')
                    // setLoginProcess(100);
                    setUserEmailSended(true)
                    console.log(res.data.status)

                    setLoginProcess(100);

                    // navigate('/userLogin')


                }
  */

  return (

    <>
      <button className={`btn btn-primary border-0 chat_button chat_btn`} style={{ display: `${isOpen ? 'none' : 'block'}` }} onClick={() => { setIsOpen(!isOpen) }}>
        <p className='m-0 p-1'>
          <FontAwesomeIcon icon={faComments} className='mx-1' />
          chat with us</p>
      </button >

      <div className='testing_process_need_to_give_valid_name'>
        <div className={`chat_area ${isOpen ? 'open' : 'close'}`}>
          <div className='user_head'>
            <img src={user.photoURL} className='user_image' />
            <p className='user_name'>{user.displayName}</p>
            <p className='lost_login'>{Date(user.reloadUserInfo.lastLoginAt)}</p>
            <p className='close_icon'><FontAwesomeIcon icon={faCircleXmark} onClick={closeChats} /></p>
          </div>
          <div className='main_chat_contents'>
            {
              userChats.length > 0 &&
              userChats.map((value, key) => {
                return (
                  <div className='chat_contents user_head_update' onClick={() => { openChat(value) }} key={key}>
                    <FontAwesomeIcon icon={faUserGroup} className='user_image' />
                    <p className='user_name'>{user.displayName} & boat</p>
                    <p className='lost_login'>May i know the update ( static )</p>
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
                  <img src={pic} className="profile-pic" />
                  <p className='profile_name'>{user.displayName} ({value.chat_ID}) </p>
                  <p className='profile_time'>{Date(user?.reloadUserInfo?.lastRefreshAt).slice(0, 24) || 'No valid date'}</p>
                  <span className='close_individual_chat' onClick={() => { closeChat(value.chat_ID) }}>
                    <FontAwesomeIcon icon={faRectangleXmark} className='fs-4' />
                  </span>
                </div>
                {/* Additional elements or code if needed */}

                <div className="chats_content">
                  {
                    messages.map((value, key) => {
                      return (
                        <div className="chat_msg" key={key}>
                          <div className={`${value.uid === user.uid ? "chat-bubble left" : "chat-bubble right"}`}>
                            <p className='chats'>{value.text}
                              {
                                value.uid !== user.uid &&
                                <span>
                                  (
                                  {value.name || value.uid}
                                  )
                                </span>
                              }
                            </p>
                            <span className="time">
                              {
                                getTime(value.createdAt, "value3")
                              }
                            </span>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>

                <div className="message_area input-group" onClick={sendMessage} >
                  <input type="text" className="message col-9" value={usermessage} placeholder="Enter your message here..." onChange={(e) => setusermessage(e.target.value)} />
                  <button className="send_button col-2"><FontAwesomeIcon icon={faPaperPlane} className="chat_send_icon" /></button>
                </div>

              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default ChatBox;