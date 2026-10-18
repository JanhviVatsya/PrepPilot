
import { useState } from 'react'
import {
  ArrowLeft,
  ArrowUp,
  Bot,
  MessageCircle,
  Sparkles,
  UserRound,
} from 'lucide-react'

type Message = {
  id: number
  role: 'assistant' | 'user'
  content: string
}

const suggestions = [
  'I want to switch to a software development role',
  'Help me decide which career path suits me',
  'I want to strengthen my technical skills',
]

type AIChatPageProps = {
  onBack: () => void
}

export default function AIChatPage({ onBack }: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  function handleSend() {
    const content = input.trim()
    if (!content) return

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        role: 'user',
        content,
      },
    ])

    setInput('')
  }

  function handleSuggestion(suggestion: string) {
    setInput(suggestion)
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-4xl flex-col">
      <header className="mb-6 flex items-center gap-3 border-b border-[#292D29] pb-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="rounded-lg border border-[#292D29] p-2 text-[#A1A7A1] transition-colors hover:bg-[#191C19] hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#285238] bg-[#14251B]">
          <Bot size={21} className="text-[#00E676]" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Career Discovery</h2>
          <p className="mt-0.5 text-xs text-[#858B85]">
            Your personal career mentor
          </p>
        </div>

        <span className="hidden items-center gap-1.5 rounded-full border border-[#292D29] px-2.5 py-1.5 text-xs text-[#858B85] sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E5B567]" />
          Preview
        </span>
      </header>

      <div className="flex-1">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-2xl py-8 sm:py-14">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#285238] bg-[#14251B]">
              <Sparkles size={27} className="text-[#00E676]" />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#00E676]">
              Let's start with you
            </p>

            <h3 className="text-2xl font-bold leading-tight sm:text-3xl">
              What's on your career horizon?
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#A1A7A1]">
              Tell me about your current work, what you'd like to learn,
              or the role you're working towards. You don't need to have
              everything figured out.
            </p>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#858B85]">
                Not sure where to start?
              </p>

              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestion(suggestion)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#292D29] bg-[#111311] p-4 text-left text-sm text-[#C6CBC6] transition-colors hover:border-[#454B45] hover:bg-[#191C19]"
                  >
                    <span>{suggestion}</span>
                    <MessageCircle
                      size={16}
                      className="shrink-0 text-[#00E676]"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#14251B]">
                    <Bot size={17} className="text-[#00E676]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-[#1B3022] text-[#E5E7E5]'
                      : 'rounded-bl-sm border border-[#292D29] bg-[#111311] text-[#C6CBC6]'
                  }`}
                >
                  {message.content}
                </div>

                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#292D29] bg-[#191C19]">
                    <UserRound size={17} className="text-[#A1A7A1]" />
                  </div>
                )}
              </div>
            ))}

            <p className="pl-11 text-xs leading-5 text-[#858B85]">
              Your message has been added locally. AI responses will be
              available after backend integration.
            </p>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSend()
        }}
        className="sticky bottom-0 mt-6 border-t border-[#292D29] bg-[#080A09] py-4"
      >
        <div className="flex items-end gap-3 rounded-xl border border-[#353A35] bg-[#111311] p-2 focus-within:border-[#00E676]">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSend()
              }
            }}
            rows={2}
            placeholder="Tell me about your career goals..."
            aria-label="Your message"
            className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-[#E5E7E5] outline-none placeholder:text-[#777D77]"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00E676] text-[#080A09] transition-colors hover:bg-[#35F18E] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp size={20} />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-[#777D77]">
          Preview mode · AI responses aren't connected yet
        </p>
      </form>
    </section>
  )
}
