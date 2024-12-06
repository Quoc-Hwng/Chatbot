import { useEffect, useState } from 'react'

interface Props {
  message: string
  // sendMessageFn: Promise<ReadableStreamDefaultReader<Uint8Array>>
  sendMessageFn: Promise<string>
}

type TypewriterProps = {
  text: string
  speed?: number // thời gian giữa các ký tự (ms)
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const boldText = text.replace(/\*\*(.*?)\*\*/g, '<br /> <strong>$1</strong>')

  // Chuyển * thành <br />
  const formattedText = boldText.replace(/\*/g, '<br />')

  useEffect(() => {
    if (currentIndex < formattedText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + formattedText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeoutId) // Dọn dẹp timeout khi component unmount
    }
  }, [currentIndex, formattedText, speed])

  return <div dangerouslySetInnerHTML={{ __html: displayedText }} />
}

export default function ChatMessage({ message, sendMessageFn }: Props) {
  const [botMessage, setBotMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // const convertText = (text: string) => {
  //   // Chuyển **đoạn văn bản** thành <strong>đoạn văn bản</strong>
  //   const boldText = text.replace(/\*\*(.*?)\*\*/g, '<br /> <strong>$1</strong>')

  //   // Chuyển * thành <br />
  //   const formattedText = boldText.replace(/\*/g, '<br />')

  //   return formattedText
  // }

  useEffect(() => {
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
            <Typewriter text={botMessage} />
          </div>
        )}
      </div>
    </div>
  )
}
