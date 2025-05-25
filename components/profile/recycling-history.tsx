"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye } from "lucide-react"
import Link from "next/link"

// Mock recycling history data
const recyclingHistory = [
  {
    id: "PET-2023-001",
    date: "2023-12-15",
    type: "PET Bottles",
    weight: "12.5 kg",
    location: "Nairobi Central",
    status: "Verified",
    tokens: "125 RPL",
  },
  {
    id: "HDPE-2023-042",
    date: "2023-11-28",
    type: "HDPE Containers",
    weight: "8.2 kg",
    location: "Mombasa Collection Center",
    status: "Verified",
    tokens: "82 RPL",
  },
  {
    id: "LDPE-2023-103",
    date: "2023-11-10",
    type: "LDPE Bags",
    weight: "3.7 kg",
    location: "Kisumu Recycling Hub",
    status: "Verified",
    tokens: "37 RPL",
  },
  {
    id: "PP-2023-078",
    date: "2023-10-22",
    type: "PP Containers",
    weight: "5.1 kg",
    location: "Nakuru Collection Point",
    status: "Verified",
    tokens: "51 RPL",
  },
  {
    id: "PS-2023-054",
    date: "2023-10-05",
    type: "PS Packaging",
    weight: "2.8 kg",
    location: "Eldoret Green Center",
    status: "Verified",
    tokens: "28 RPL",
  },
  {
    id: "MIX-2023-091",
    date: "2023-09-18",
    type: "Mixed Plastics",
    weight: "15.3 kg",
    location: "Nairobi Central",
    status: "Verified",
    tokens: "153 RPL",
  },
  {
    id: "PET-2023-112",
    date: "2023-09-02",
    type: "PET Bottles",
    weight: "9.6 kg",
    location: "Mombasa Collection Center",
    status: "Verified",
    tokens: "96 RPL",
  },
]

export default function RecyclingHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredHistory = recyclingHistory.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterType === "all") return matchesSearch
    return matchesSearch && item.type.includes(filterType)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recycling History</CardTitle>
        <CardDescription>View your complete plastic recycling history and transaction details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, type, or location..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PET">PET Bottles</SelectItem>
                <SelectItem value="HDPE">HDPE Containers</SelectItem>
                <SelectItem value="LDPE">LDPE Bags</SelectItem>
                <SelectItem value="PP">PP Containers</SelectItem>
                <SelectItem value="PS">PS Packaging</SelectItem>
                <SelectItem value="Mixed">Mixed Plastics</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Badge variant="success">{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.tokens}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/batch-tracking/${item.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No recycling history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
