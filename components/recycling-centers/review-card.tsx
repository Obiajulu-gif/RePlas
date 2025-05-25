import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export default function ReviewCard({ review }) {
  const date = new Date(review.date)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="font-medium">{review.userName}</h4>
                <div className="flex items-center mt-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  <span className="text-muted-foreground text-sm ml-2">
                    {formatDistanceToNow(date, { addSuffix: true })}
                  </span>
                </div>
              </div>
              {review.verifiedVisit && (
                <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Verified Visit
                </div>
              )}
            </div>
            <p className="mt-3 text-sm">{review.comment}</p>
            {review.photos && review.photos.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {review.photos.map((photo, index) => (
                  <div key={index} className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Review photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ThumbsUp className="h-4 w-4 mr-1" />
          Helpful ({review.helpfulCount})
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </CardFooter>
    </Card>
  )
}
