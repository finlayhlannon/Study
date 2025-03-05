import Link from "next/link"
import { Calendar, FileText } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Topic } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

interface TopicCardProps {
  courseId: string
  topic: Topic
}

export default function TopicCard({ courseId, topic }: TopicCardProps) {
  const progressValue = (topic.knowledgeLevel / 5) * 100

  return (
    <Link href={`/courses/${courseId}/topics/${topic.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Unit {topic.unitNumber}</span>
            <span className="text-xs font-medium text-muted-foreground">Level {topic.knowledgeLevel}/5</span>
          </div>
          <CardTitle className="line-clamp-1">{topic.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topic.description && <p className="line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Due: {topic.dueDate}</span>
          </div>
          <Progress value={progressValue} className="h-1.5" />
        </CardContent>
        <CardFooter className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="h-3 w-3" />
          <span>{topic.notes ? "Notes added" : "No notes yet"}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

