// Applciaiton javascript
// NOTE: firebase.json has a consideration 
//       for avoiding cache-ing the javascript
//       providing immedate refresh when deploying the 
//       database again

// Firebase configuration
var config = {
  apiKey: "AIzaSyDJp1h339sJ2bYD6Xj7rzsj5kKVG7r2UHs",
  authDomain: "chatroom-45c80.firebaseapp.com",
  databaseURL: "https://chatroom-45c80.firebaseio.com",
  projectId: "chatroom-45c80",
  storageBucket: "chatroom-45c80.appspot.com",
  messagingSenderId: "512748989344"
};

// Initialize firebase
firebase.initializeApp(config);

// database refrence 
const db = firebase.database()
// refrence to directory for data
const msgRef = db.ref('messages')

// Retreive from local storage user data, if already exisst
function alreadyHere() {
  // Check if user data exist
  if (localStorage.getItem('name')) {
    // it does exist, retrieve data 
    document.querySelector('#name').setAttribute('placeholder', localStorage.getItem('name'))
    document.querySelector('#username').setAttribute('placeholder', localStorage.getItem('username'))
    document.querySelector('#user').innerHTML = `Welcome <b>${localStorage.getItem('name')}</b>! Please Enter Your Message Below.`
    document.querySelector('#username').setAttribute('disabled', true)
    document.querySelector('#name').setAttribute('disabled', true)
    return true
  } else {
    return false
  }
}

function scrollBottom() {
  // Scroll down to end of div contents
  document.querySelector('#chatRoom').scrollTop = document.querySelector('#chatRoom').scrollHeight
}

function emptyElem(selector) {
  // clear div contents
  document.querySelector(selector).innerHTML = ''
}

// Send message when pressing button 
function sendMessage() {

  // Control default behavior for submitt btn in form (i.e. refresh page)
  event.preventDefault()

  // if first time for user, add data in local storage
  if (!alreadyHere()) {
    localStorage.setItem('name', document.querySelector('#name').value)
    localStorage.setItem('username', document.querySelector('#username').value)
  }

  if (document.querySelector('#message').value.trim() != '') {

    //push object to datbase folder
    msgRef.push({
      name: alreadyHere() ? localStorage.getItem('name') : document.querySelector('#name').value,
      username: alreadyHere() ? localStorage.getItem('username') : document.querySelector('#username').value,
      message: document.querySelector('#message').value
    })

    // clear message window
    document.querySelector('#message').value = '';
  }
}

// Event: listen to message and present in screen
msgRef.on('value', function (snap) {

  // get conversation data
  let data = snap.val();

  // Scroll page to the bottom of conversation
  scrollBottom();

  // clear chat room
  emptyElem('#chatRoom')

  // For-in loop to process all conversations
  for (const key in data) {

    if (data.hasOwnProperty(key)) {

      // get message 
      const item = data[key];

      // add conversation to screen
      let piece = document.createElement('div')

      piece.innerHTML = `
        <h5><i>${item.username}</i></h5>
        <p>${item.message}</p>
       `
      // if message is from current user, put message to the rigth
      // else put it at the left.
      if (item.name && item.name === localStorage.getItem('name')) {
        piece.setAttribute('class', 'msgThingME')
      } else {
        piece.setAttribute('class', 'msgThingYOU')
      }

      document.querySelector('#chatRoom').appendChild(piece)
    }
  }
})

// Initialize applciaiton 
alreadyHere();