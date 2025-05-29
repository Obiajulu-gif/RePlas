"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SafeImage } from "@/components/ui/safe-image";
import {
	Search,
	BookOpen,
	Video,
	FileText,
	ArrowRight,
	Clock,
	Calendar,
	ThumbsUp,
	Eye,
	Filter,
} from "lucide-react";
import { resources } from "@/data/resources";
import type { Resource } from "@/types/learn";

export default function LearnPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const featuredCourse = {
		title: "Plastic Recycling Fundamentals",
		description:
			"A comprehensive introduction to plastic recycling principles, processes, and best practices.",
		image: "/learn/featured-course.png",
		link: "/learn/courses/plastic-recycling-fundamentals",
	};

	// Filter resources based on search query
	const filteredResources = resources.filter(
		(resource) =>
			searchQuery === "" ||
			resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Group resources by type
	const articles = filteredResources.filter(
		(resource) => resource.type === "article"
	);
	const videos = filteredResources.filter(
		(resource) => resource.type === "video"
	);
	const guides = filteredResources.filter(
		(resource) => resource.type === "guide"
	);

	return (
		<div className="container py-12">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold">Educational Resources</h1>
					<p className="text-muted-foreground">
						Learn about plastic recycling, blockchain, and sustainability
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="flex items-center gap-1"
					>
						<Filter className="h-4 w-4" />
						<span>Filter</span>
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Card className="md:col-span-2">
					<CardHeader className="pb-3">
						<CardTitle>Search Resources</CardTitle>
						<CardDescription>
							Find articles, videos, and guides on plastic recycling
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search by title, description, or category..."
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-0">
					<CardHeader>
						<CardTitle>Featured Course</CardTitle>
						<CardDescription>Most popular educational content</CardDescription>
					</CardHeader>
					<CardContent className="pb-0">
						<Link href={featuredCourse.link} className="block">
							<div className="rounded-lg overflow-hidden mb-4 group">
								<SafeImage
									src={featuredCourse.image}
									alt={featuredCourse.title}
									width={400}
									height={225}
									className="w-full h-auto object-cover transition-transform group-hover:scale-105 duration-500"
									fallbackSrc="/recycling-course.png"
								/>
							</div>
							<h3 className="font-bold text-lg mb-2">{featuredCourse.title}</h3>
							<p className="text-sm text-muted-foreground">
								{featuredCourse.description}
							</p>
						</Link>
					</CardContent>
					<CardFooter className="pt-4">
						<Button
							asChild
							className="w-full bg-emerald-600 hover:bg-emerald-700"
						>
							<Link href={featuredCourse.link}>Start Learning</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>

			<Tabs defaultValue="all" className="space-y-6">
				<TabsList>
					<TabsTrigger value="all">
						All Resources ({filteredResources.length})
					</TabsTrigger>
					<TabsTrigger value="articles">
						Articles ({articles.length})
					</TabsTrigger>
					<TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
					<TabsTrigger value="guides">Guides ({guides.length})</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredResources.map((resource) => (
							<ResourceCard key={resource.id} resource={resource} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="articles" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{articles.map((resource) => (
							<ResourceCard key={resource.id} resource={resource} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="videos" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{videos.map((resource) => (
							<ResourceCard key={resource.id} resource={resource} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="guides" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{guides.map((resource) => (
							<ResourceCard key={resource.id} resource={resource} />
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ResourceCard({ resource }: { resource: Resource }) {
	const getResourceLink = (resource: Resource) => {
		const slug = resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
		return `/learn/${resource.type}s/${slug}`;
	};

	const getTypeIcon = (type: Resource["type"]) => {
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
		<Card className="overflow-hidden transition-all hover:shadow-lg group">
			<Link href={getResourceLink(resource)}>
				<div className="aspect-video relative overflow-hidden bg-muted">
					<SafeImage
						src={resource.image}
						alt={resource.title}
						fill
						className="object-cover transition-transform group-hover:scale-105 duration-500"
						fallbackSrc={`/placeholder.svg?height=200&width=350&query=${encodeURIComponent(
							resource.title
						)}`}
					/>
					<Badge className="absolute top-2 right-2" variant="secondary">
						{getTypeIcon(resource.type)}
						<span className="ml-1 capitalize">{resource.type}</span>
					</Badge>
				</div>
			</Link>

			<CardHeader className="p-4">
				<div className="flex items-center gap-2 mb-2">
					<Badge variant="outline" className="capitalize">
						{resource.category}
					</Badge>
					<div className="flex items-center text-xs text-muted-foreground">
						{resource.type === "article" && resource.readTime && (
							<>
								<Clock className="h-3 w-3 mr-1" />
								<span>{resource.readTime}</span>
							</>
						)}
						{resource.type === "video" && resource.duration && (
							<>
								<Clock className="h-3 w-3 mr-1" />
								<span>{resource.duration}</span>
							</>
						)}
						{resource.type === "guide" && resource.pages && (
							<>
								<FileText className="h-3 w-3 mr-1" />
								<span>{resource.pages} pages</span>
							</>
						)}
					</div>
				</div>

				<Link
					href={getResourceLink(resource)}
					className="group-hover:text-primary transition-colors"
				>
					<CardTitle className="text-lg">{resource.title}</CardTitle>
				</Link>
				<CardDescription className="line-clamp-2">
					{resource.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="p-4 pt-0">
				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						<span>{resource.date}</span>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1">
							<Eye className="h-3 w-3" />
							<span>{resource.views}</span>
						</div>
						<div className="flex items-center gap-1">
							<ThumbsUp className="h-3 w-3" />
							<span>{resource.likes}</span>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-4 pt-0 flex justify-between items-center">
				<div className="text-sm">By {resource.author}</div>
				<Button
					asChild
					size="sm"
					className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
				>
					<Link href={getResourceLink(resource)}>
						Read More
						<ArrowRight className="h-3 w-3 ml-1" />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
