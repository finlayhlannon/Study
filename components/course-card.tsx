import Link from "next/link"
import { Book } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseCardProps {
  course: {
    id: string
    name: string
    topics: any[]
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            {course.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {course.topics.length} {course.topics.length === 1 ? "topic" : "topics"}
          </p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">Click to view topics</CardFooter>
      </Card>
    </Link>
  )
}

