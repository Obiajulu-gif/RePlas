"use client";

import { getResourceBySlug } from "@/lib/resources";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { VideoPlayer } from "@/components/ui/video-player";
import {
	ArrowLeft,
	BookOpen,
	Video,
	FileText,
	Clock,
	Calendar,
	ThumbsUp,
	Eye,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Metadata } from "next";

interface ResourcePageProps {
	params: {
		type: string;
		slug: string;
	};
}

export async function generateMetadata({
	params,
}: ResourcePageProps): Promise<Metadata> {
	const resource = getResourceBySlug(params.type, params.slug);

	if (!resource) {
		return {
			title: "Resource Not Found",
			description: "The requested resource could not be found.",
		};
	}

	return {
		title: `${resource.title} | RePlas Learning Resources`,
		description: resource.description,
		openGraph: {
			title: resource.title,
			description: resource.description,
			images: [resource.image],
		},
	};
}

export default function ResourcePage({ params }: ResourcePageProps) {
	const resource = getResourceBySlug(params.type, params.slug);

	if (!resource) {
		return (
			<div className="container py-12">
				<Button variant="ghost" asChild className="mb-8">
					<Link href="/learn">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Resources
					</Link>
				</Button>
				<Card>
					<CardContent className="p-6">
						<div className="prose prose-emerald dark:prose-invert max-w-none">
							<h1>Resource Not Found</h1>
							<p>The resource you're looking for could not be found.</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "article":
				return <BookOpen className="h-4 w-4" />;
			case "video":
				return <Video className="h-4 w-4" />;
			case "guide":
				return <FileText className="h-4 w-4" />;
			default:
				return <BookOpen className="h-4 w-4" />;
		}
	};

	return (
		<div className="container py-12">
			<Button variant="ghost" asChild className="mb-8">
				<Link href="/learn">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Resources
				</Link>
			</Button>

			<article className="max-w-4xl mx-auto">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<Badge variant="secondary" className="capitalize">
							{getTypeIcon(resource.type)}
							<span className="ml-1">{resource.type}</span>
						</Badge>
						<Badge variant="outline" className="capitalize">
							{resource.category}
						</Badge>
					</div>

					<h1 className="text-4xl font-bold mb-4">{resource.title}</h1>

					<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
						<div className="flex items-center gap-1">
							<Calendar className="h-4 w-4" />
							<span>{resource.date}</span>
						</div>
						{resource.type === "article" && (
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								<span>{resource.readTime}</span>
							</div>
						)}
						{resource.type === "video" && (
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								<span>{resource.duration}</span>
							</div>
						)}
						<div className="flex items-center gap-1">
							<Eye className="h-4 w-4" />
							<span>{resource.views} views</span>
						</div>
						<div className="flex items-center gap-1">
							<ThumbsUp className="h-4 w-4" />
							<span>{resource.likes} likes</span>
						</div>
					</div>

					{resource.type === "video" ? (
						<div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
							<VideoPlayer url={resource.videoUrl || ""} />
						</div>
					) : (
						<div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
							<SafeImage
								src={resource.image}
								alt={resource.title}
								fill
								className="object-cover"
								fallbackSrc={`/placeholder.svg?height=400&width=800&query=${encodeURIComponent(
									resource.title
								)}`}
							/>
						</div>
					)}

					<Card className="mt-8">
						<CardContent className="p-6">
							<div className="prose prose-emerald dark:prose-invert max-w-none">
								{resource.content}
							</div>
						</CardContent>
					</Card>

					<footer className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
						<div>By {resource.author}</div>
						{resource.updatedAt && (
							<div>Last updated: {resource.updatedAt}</div>
						)}
					</footer>
				</div>
			</article>
		</div>
	);
}
