import { Resource } from "@/types/learn"
import { resources } from "@/data/resources"

export function getResourceBySlug(type: string, slug: string): Resource | undefined {
  const normalizedSlug = slug.toLowerCase()
  return resources.find(resource => {
    const resourceSlug = resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    return resource.type === type && resourceSlug === normalizedSlug
  })
}

export function generateResourceSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

export function getResourcesByType(type: string): Resource[] {
  return resources.filter(resource => resource.type === type)
}

export function getResourcesByCategory(category: string): Resource[] {
  return resources.filter(resource => resource.category === category)
}

export function getFeaturedResources(count: number = 3): Resource[] {
  return resources
    .filter(resource => resource.featured)
    .slice(0, count)
}

export function searchResources(query: string): Resource[] {
  const searchQuery = query.toLowerCase()
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery) ||
    resource.description.toLowerCase().includes(searchQuery) ||
    resource.category.toLowerCase().includes(searchQuery)
  )
}
