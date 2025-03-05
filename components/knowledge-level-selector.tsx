import { Star } from "lucide-react"

interface KnowledgeLevelSelectorProps {
  value: number
  onChange: (level: number) => void
}

export default function KnowledgeLevelSelector({ value, onChange }: KnowledgeLevelSelectorProps) {
  return (
    <div className="flex">
      {[0, 1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className="p-1 focus:outline-none"
          aria-label={`Knowledge level ${level}`}
        >
          <Star className={`h-4 w-4 ${level <= value ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  )
}

