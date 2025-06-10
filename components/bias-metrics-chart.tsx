"use client"

import { useEffect, useRef } from "react"

export default function BiasMetricsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart data
    const biasCategories = ["Gender", "Age", "Cultural", "Educational", "Appearance"]
    const biasValues = [12, 8, 15, 5, 3]
    const maxValue = Math.max(...biasValues) * 1.2

    // Chart dimensions
    const chartWidth = canvas.width - 80
    const chartHeight = canvas.height - 60
    const barWidth = (chartWidth / biasCategories.length) * 0.6
    const spacing = chartWidth / biasCategories.length

    // Colors
    const barColors = [
      "rgba(16, 185, 129, 0.7)", // emerald-500
      "rgba(16, 185, 129, 0.7)",
      "rgba(16, 185, 129, 0.7)",
      "rgba(16, 185, 129, 0.7)",
      "rgba(16, 185, 129, 0.7)",
    ]

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, chartHeight + 30)
    ctx.lineTo(canvas.width - 20, chartHeight + 30)
    ctx.strokeStyle = "#94a3b8" // slate-400
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw y-axis labels
    ctx.font = "10px Inter, sans-serif"
    ctx.fillStyle = "#64748b" // slate-500
    ctx.textAlign = "right"

    const yAxisSteps = 5
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = Math.round((maxValue / yAxisSteps) * i)
      const y = chartHeight + 30 - (chartHeight / yAxisSteps) * i

      ctx.fillText(value.toString(), 35, y + 3)

      // Draw horizontal grid lines
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(canvas.width - 20, y)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)" // slate-400 with opacity
      ctx.stroke()
    }

    // Draw bars and x-axis labels
    biasCategories.forEach((category, index) => {
      const x = 40 + spacing * index + (spacing - barWidth) / 2
      const barHeight = (biasValues[index] / maxValue) * chartHeight
      const y = chartHeight + 30 - barHeight

      // Draw bar
      ctx.fillStyle = barColors[index]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw bar border
      ctx.strokeStyle = "rgba(16, 185, 129, 1)" // emerald-600
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, barWidth, barHeight)

      // Draw x-axis label
      ctx.fillStyle = "#64748b" // slate-500
      ctx.textAlign = "center"
      ctx.fillText(category, x + barWidth / 2, chartHeight + 45)

      // Draw value on top of bar
      ctx.fillStyle = "#334155" // slate-700
      ctx.fillText(biasValues[index].toString(), x + barWidth / 2, y - 5)
    })

    // Chart title
    ctx.fillStyle = "#334155" // slate-700
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Potential Bias Indicators (Last 30 Days)", 40, 15)
  }, [])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
