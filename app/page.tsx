"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Animation {
  id: number
  text: string
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  delay: number
}

export default function AnimatedTextApp() {
  const [inputText, setInputText] = useState("")
  const [animations, setAnimations] = useState<Animation[]>([])
  const [nextId, setNextId] = useState(1)

  const createRandomAnimation = useCallback(
    (text: string): Animation => {
      // Random starting position (left side of screen)
      const startX = -100
      const startY = Math.random() * 400 + 50

      // Random ending position (right side of screen)
      const endX = window.innerWidth + 100
      const endY = Math.random() * 400 + 50

      // Random duration between 3-8 seconds
      const duration = Math.random() * 5000 + 3000

      // Small random delay
      const delay = Math.random() * 500

      return {
        id: nextId,
        text,
        startX,
        startY,
        endX,
        endY,
        duration,
        delay,
      }
    },
    [nextId],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!inputText.trim()) return

      const newAnimation = createRandomAnimation(inputText.trim())

      setAnimations((prev) => {
        // Keep only the most recent 4 animations, then add the new one (max 5 total)
        const updated = prev.length >= 5 ? prev.slice(1) : prev
        return [...updated, newAnimation]
      })

      setNextId((prev) => prev + 1)
      setInputText("")

      // Remove animation after it completes
      setTimeout(
        () => {
          setAnimations((prev) => prev.filter((anim) => anim.id !== newAnimation.id))
        },
        newAnimation.duration + newAnimation.delay + 1000,
      )
    },
    [inputText, createRandomAnimation, nextId],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* View 1: Input Form */}
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Animated Text Display</h1>
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter a name or phrase..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1"
              maxLength={50}
            />
            <Button type="submit" disabled={!inputText.trim()}>
              Send
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-2">Up to 5 animations can run simultaneously</p>
        </Card>

        {/* View 2: Animation Display Area (16:9 aspect ratio) */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          <div className="aspect-video relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
            </div>

            {/* Animated text elements */}
            {animations.map((animation) => (
              <div
                key={animation.id}
                className="absolute whitespace-nowrap pointer-events-none"
                style={{
                  left: `${animation.startX}px`,
                  top: `${animation.startY}px`,
                  animation: `moveAcross-${animation.id} ${animation.duration}ms linear ${animation.delay}ms forwards`,
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
                  <span className="text-lg font-semibold text-gray-800">{animation.text}</span>
                </div>
              </div>
            ))}

            {/* Instructions when no animations */}
            {animations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/80">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-xl font-medium">Enter text above to see animations!</p>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic CSS for each animation */}
          <style jsx>{`
            ${animations
              .map(
                (animation) => `
              @keyframes moveAcross-${animation.id} {
                from {
                  transform: translate(0, 0) rotate(${Math.random() * 20 - 10}deg);
                  opacity: 0;
                }
                10% {
                  opacity: 1;
                }
                90% {
                  opacity: 1;
                }
                to {
                  transform: translate(${animation.endX - animation.startX}px, ${animation.endY - animation.startY}px) rotate(${Math.random() * 20 - 10}deg);
                  opacity: 0;
                }
              }
            `,
              )
              .join("\n")}
          `}</style>
        </Card>

        {/* Active animations counter */}
        <div className="text-center text-sm text-muted-foreground">Active animations: {animations.length}/5</div>
      </div>
    </div>
  )
}
