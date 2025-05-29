"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
	url: string;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		// If we're using YouTube or Vimeo, we could enhance this with their embeds
		if (videoRef.current) {
			videoRef.current.load();
		}
	}, [url]);

	if (!url) {
		return (
			<div className="flex items-center justify-center w-full h-full bg-muted">
				<p className="text-muted-foreground">No video available</p>
			</div>
		);
	}

	return (
		<video
			ref={videoRef}
			controls
			className="w-full h-full"
			poster="/placeholder.svg?height=400&width=800&text=Loading%20Video..."
		>
			<source src={url} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}
