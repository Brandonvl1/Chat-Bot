const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');
const chatBotToggler = document.querySelector('.chatbot-toggler');
const chatBotCloseBtn = document.querySelector('.close-btn');

let userMessage;
const API_KEY = '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';
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    let chatContent = className === 'outgoing' ? `<p></p>` :  `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector('p').textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const messageElement = incomingChatLi.querySelector('p');

    //Define the properties and message for the API request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": userMessage}],
        })
    }

    // Send Post request to API,get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
        messageElement.classList.add('error');
        messageElement.textContent = 'Oops! Something ent wrong. Please try again.';
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = '';
    chatInput.style.height = `${inputInitHeight}px`;

    //Append the users message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        //Display "Thinking..." message while waiting for a respose
        const incomingChatLi = createChatLi('Thinking...', 'incoming')
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);

}

//Ajust the height of the input text area based on its content
chatInput.addEventListener('input', () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener('keydown', () => {
    //If enter key is pressed without shift key and the window
    //width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener('click', handleChat)
chatBotCloseBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'));
chatBotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'));

