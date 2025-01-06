'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ViewDetailsModal from './ViewDetailsModal'

interface DataTableProps {
  data: any[]
  columns: { key: string; label: string }[]
  onAction: (action: string, items: any[]) => void
  title: string
}

export default function DataTable({ data, columns, onAction, title }: DataTableProps) {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? data : [])
  }

  const handleSelectItem = (item: any, checked: boolean) => {
    setSelectedItems(prev => 
      checked ? [...prev, item] : prev.filter(i => i !== item)
    )
  }

  const handleAction = (action: string) => {
    onAction(action, selectedItems)
  }

  const handleViewDetails = (item: any) => {
    setSelectedItem(item)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">Actions <MoreHorizontal className="ml-2 h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction('approve')}>Approve</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('reject')}>Reject</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('flag')}>Flag</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-primary/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedItems.length === data.length} 
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.key} className="font-bold text-primary">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={index % 2 === 0 ? 'bg-secondary/5' : 'bg-background'}>
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.includes(item)} 
                    onCheckedChange={(checked) => handleSelectItem(item, checked as boolean)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-secondary-foreground">
                    {item[column.key]}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(item)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ViewDetailsModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        data={selectedItem}
      />
    </div>
  )
}

