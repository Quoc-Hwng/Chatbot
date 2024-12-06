import { useRef, useState } from 'react'
import ChatMessage from './components/ChatMessage'
import { ChatMessageType } from './types/chatMessageType.type'

const listTaskCurrent = [
  { icon: '/icons/map-icon.svg', name: 'Tóm tắt văn bản' },
  { icon: '/icons/lightbulb-icon.svg', name: 'Lên ý tưởng' },
  { icon: '/icons/message-icon.svg', name: 'Làm tôi ngạc nhiên' },
  { icon: '/icons/code-icon.svg', name: 'Giúp tôi viết' }
]

function App() {
  const [message, setMessage] = useState('')
  // const [chatList, setChatList] = useState<
  //   { id: string; message: string; messageFn: Promise<ReadableStreamDefaultReader<Uint8Array>> }[]
  // >([])
  const [chatList, setChatList] = useState<{ id: string; message: string; messageFn: Promise<string> }[]>([])
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([])
  const [showResult, setShowResult] = useState(false)
  const [pending, setPending] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const sendMessageFn = async (message: string) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        history: chatHistory,
        message: message
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(`http://localhost:8000/gemini`, options)
    const data = await response.text()
    setChatHistory((oldChatHistory) => [
      ...oldChatHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      },
      {
        role: 'model',
        parts: [{ text: data }]
      }
    ])
    return data
    // const reader = response.body!.getReader()
    // console.log(response)
    // return reader
  }

  const sendMessages = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowResult(true)
    const sendMessageFunction = sendMessageFn(message)
    setChatList((oldChatHistory) => [
      ...oldChatHistory,
      {
        id: Date.now().toString(),
        message: message,
        messageFn: sendMessageFunction
      }
    ])

    setPending(true)
    // sendMessageFunction
    //   .then(async (result) => {
    // const result2 = Stream.
    // let text = ''
    // while (true) {
    //   const { value, done } = await result.read()
    //   if (done) break
    //   console.log('Received', value)
    //   text += value
    // }
    //     setChatHistory((oldChatHistory) => [
    //       ...oldChatHistory,
    //       {
    //         role: 'user',
    //         parts: [{ text: message }]
    //       },
    //       {
    //         role: 'model',
    //         parts: [{ text: data }]
    //       }
    //     ])
    //   })
    //   .finally(() => {
    //     setPending(false)
    //   })
    sendMessageFunction
      .then(() => {})
      .finally(() => {
        setPending(false)
      })
    setMessage('')
  }

  const focusInput = (text: string) => {
    if (inputRef.current) {
      setMessage(text)
      inputRef.current.focus()
    }
  }

  return (
    <div className='flex-1 min-h-[100vh] relative pb-[15vh]'>
      <div className='flex items-center p-5 gap-2 border-b border-b-gray-400 w-full text-[#585858]'>
        <img src='vite.svg' alt='avatar' className='rounded-full size-10 object-cover' />
        <p>Gemini</p>
      </div>
      <div className='max-w-[900px] m-auto'>
        {!showResult ? (
          <>
            <div className='mx-12 my-0 text-5xl font-medium p-5'>Tôi có thể giúp gì cho bạn?</div>
            <div className='grid grid-cols-autofill gap-4 p-5'>
              {listTaskCurrent.map((task, index) => (
                <div
                  className='h-52 p-4 bg-[#f0f4f9] rounded-xl relative cursor-pointer hover:bg-[#df34ea]'
                  key={index}
                  onClick={() => focusInput(task.name)}
                >
                  <p className='text-[#585858] text-lg'>{task.name}</p>
                  <img src={task.icon} alt='' className='w-9 p-1 absolute bg-white rounded-3xl bottom-3 right-3' />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='py-0 px-[5%] max-h-[70vh] overflow-y-auto mt-4'>
            {chatList.map((chatItem) => (
              <ChatMessage key={chatItem.id} message={chatItem.message} sendMessageFn={chatItem.messageFn} />
            ))}
          </div>
        )}
        <div className='absolute bottom-0 w-full max-w-[900px] py-0 px-4 m-auto'>
          <form
            className='flex items-center justify-between gap-5 bg-[#f0f4f9] px-5 py-2 rounded-2xl mb-5'
            onSubmit={(event) => sendMessages(event)}
          >
            <input
              onChange={(event) => setMessage(event.target.value)}
              value={message}
              type='text'
              className='flex-1 bg-transparent border-none outline-none p-2 text-lg'
              disabled={pending}
              ref={inputRef}
            />
            <div className='flex gap-4 items-center'>
              <img src='/icons/photo-icon.svg' alt='' className='w-6 cursor-pointer' />
              <img src='/icons/mic-icon.svg' alt='' className='w-6 cursor-pointer' />
              <button type='submit' disabled={pending}>
                <img src='/icons/send-icon.svg' alt='' className='w-6 cursor-pointer' />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
