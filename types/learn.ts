export interface Resource {
	id: number;
	title: string;
	description: string;
	type: "article" | "video" | "guide";
	category: string;
	readTime?: string;
	duration?: string;
	pages?: number;
	date: string;
	author: string;
	likes: number;
	views: number;
	image: string;
}
