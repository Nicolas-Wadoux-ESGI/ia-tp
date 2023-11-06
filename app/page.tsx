'use client';
import React from "react";

export interface Message {
    text: string;
    type: 'user' | 'answer' | 'error' | 'loader';
}

export default function Home() {
    const [messages, setMessages, ] = React.useState([{text: "Hello, i'm your pizzaiolo, ask me anything !", type: 'answer'}] as Message[]);

    function addMessage(message: Message) {
        setMessages(messages => [...messages, message])
    }

    function removeLoader() {
        setMessages(messages => messages.filter(m => m.type !== 'loader'));
    }

    const [input, setInput] = React.useState('');

    function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setInput(e.target.value);
    }

    function getMessageClass(message: Message) {
        switch (message.type) {
            case 'user':
                return 'bg-green-100 ml-80';
            case 'error':
                return 'bg-red-100 mr-80';
            case 'loader':
                return 'bg-gray-100 mr-80';
            case 'answer':
            default:
                return 'bg-blue-100 mr-80';
        }
    }

    const send = () => {
        const message = input;
        if (!message || !message.trim()) {
            addMessage({text: 'Type a message before sending', type: 'error'});
            return
        }

        setInput('');
        addMessage({text: input, type: 'user'});
        addMessage({text: '...', type: 'loader'});

        fetch('http://localhost:3000/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message})
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                const error = 'Something went wrong';
                removeLoader();
                addMessage({text: error, type: 'error'});
                throw new Error(response.statusText);
            }
        }).then((text: string) => {
            removeLoader();
            addMessage({text, type: 'answer'});
        });
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            <div className="w-full">
                {messages.map((message, index) => (
                    <p key={index} className={getMessageClass(message) + " my-8 fixed left-0 top-0 flex justify-center border-b border-gray-300 from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:p-4 lg:dark:bg-zinc-800/30"}>
                        {message.text}
                    </p>
                ))}
            </div>
            <div className="w-full flex">
                <textarea className="mr-6 w-full h-16 px-3 py-1.5" onChange={handleTextareaChange} value={input}/>
                <button onClick={() => send()}>Envoyer</button>
            </div>
        </main>
    )
}
