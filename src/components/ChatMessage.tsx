import { useEffect, useRef, useState } from 'react'
import Typewriter from './TypeWriter'

interface Props {
  message: string
  // sendMessageFn: Promise<ReadableStreamDefaultReader<Uint8Array>>
  sendMessageFn: Promise<string>
}

export default function ChatMessage({ message, sendMessageFn }: Props) {
  const [botMessage, setBotMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
    sendMessageFn
      .then(async (message) => {
        setLoading(false)
        setBotMessage(message)
        // const textDecode = new TextDecoder()
        // while (true) {
        //   const { value, done } = await reader.read()
        //   if (done) break
        //   console.log('Received', value)
        //   const mess = textDecode.decode(value)
        //   mess.split(' ').forEach((word) => {
        //     setTimeout(() => {
        //       setBotMessage((message) => {
        //         return message + ' ' + word
        //       })
        //     }, 50)
        //   })
        // }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }, [message, sendMessageFn])

  return (
    <div>
      <div className='mb-2 flex text-right flex-row-reverse items-center gap-5'>
        <img src='vite.svg' alt='avatar' className='size-10 rounded-[50%] border border-purple-300 object-cover' />
        <p className='bg-blue-100 p-2 rounded-lg inline-block'>{message}</p>
      </div>
      <div className='mb-2 flex gap-5'>
        <img src='vite.svg' alt='avatar' className='size-10 rounded-[50%] border border-purple-300 object-cover' />
        {loading ? (
          <div className='w-full flex flex-col gap-2'>
            <hr className=' animate-[loader_3s_ease-in-out_infinite] rounded border-none bg-[#f6f7f8] h-5 bg-gradient-to-r from-[#9ed7ff] via-white to-[#9ed7ff] bg-[length:800px_50px]' />
            <hr className=' animate-[loader_3s_ease-in-out_infinite] rounded border-none bg-[#f6f7f8] h-5 bg-gradient-to-r from-[#9ed7ff] via-white to-[#9ed7ff] bg-[length:800px_50px]' />
          </div>
        ) : (
          <div
            className='bg-green-100 p-2 rounded-lg inline-block text-justify'
            // dangerouslySetInnerHTML={{ __html: convertText(botMessage) }}
          >
            <Typewriter text={botMessage} scrollToBottom={scrollToBottom} />
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
