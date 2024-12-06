import { useEffect, useState } from 'react'

interface Props {
  text: string
  speed?: number // thời gian giữa các ký tự (ms)
  scrollToBottom: () => void
}

export default function Typewriter({ text, speed = 10, scrollToBottom }: Props) {
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

  useEffect(() => {
    scrollToBottom()
  }, [displayedText, scrollToBottom]) // Theo dõi sự thay đổi của displayedText
  return <div dangerouslySetInnerHTML={{ __html: displayedText }} />
}
