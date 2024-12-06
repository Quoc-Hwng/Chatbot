import { useEffect, useState } from 'react'

interface Props {
  text: string
  speed?: number // thời gian giữa các ký tự (ms)
}

export default function Typewriter({ text, speed = 10 }: Props) {
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
