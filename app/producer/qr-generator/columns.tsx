"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, MoreHorizontal, Printer, QrCode, Eye, ArchiveX } from "lucide-react"

export type Batch = {
  id: string
  productName: string
  plasticType: string
  weight: string
  date: string
  status: "active" | "inactive"
}

export const columns: ColumnDef<Batch>[] = [
  {
    accessorKey: "id",
    header: "Batch ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "plasticType",
    header: "Plastic Type",
    cell: ({ row }) => {
      const plasticType = row.getValue("plasticType") as string
      return (
        <Badge variant="outline" className="font-medium">
          {plasticType}
        </Badge>
      )
    },
  },
  {
    accessorKey: "weight",
    header: "Weight (kg)",
  },
  {
    accessorKey: "date",
    header: "Manufacturing Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className={status === "active" ? "bg-green-500" : ""}
        >
          {status === "active" ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const batch = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(batch.id)}>Copy Batch ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <QrCode className="mr-2 h-4 w-4" />
              View QR Code
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 h-4 w-4" />
              Print QR Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 dark:text-red-400">
              <ArchiveX className="mr-2 h-4 w-4" />
              Deactivate Batch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
