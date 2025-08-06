"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Eye } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const products = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sku: "IPH-15-PRO-128",
    price: "₹1,34,900",
    stock: 45,
    status: "active",
    image: "/modern-smartphone.png",
  },
  {
    id: "2",
    name: "MacBook Air M2",
    sku: "MBA-M2-256",
    price: "₹1,14,900",
    stock: 12,
    status: "low-stock",
    image: "/silver-macbook-pro.png",
  },
  {
    id: "3",
    name: "AirPods Pro",
    sku: "APP-2ND-GEN",
    price: "₹24,900",
    stock: 89,
    status: "active",
    image: "/generic-wireless-earbuds.png",
  },
  {
    id: "4",
    name: "iPad Pro 12.9",
    sku: "IPD-PRO-129-1TB",
    price: "₹1,59,900",
    stock: 0,
    status: "out-of-stock",
    image: "/silver-ipad-on-wooden-desk.png",
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    sku: "AWS9-45MM-GPS",
    price: "₹45,900",
    stock: 67,
    status: "active",
    image: "/smartwatch.png",
  },
  {
    id: "6",
    name: "Mac Studio",
    sku: "MS-M2-MAX-512",
    price: "₹2,09,900",
    stock: 8,
    status: "low-stock",
    image: "/mac-studio-setup.png",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  "low-stock": "bg-yellow-100 text-yellow-800",
  "out-of-stock": "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
}

export function ProductsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <Badge className={statusColors[product.status as keyof typeof statusColors]}>
                {product.status.replace("-", " ")}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{product.price}</span>
                <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Eye className="h-4 w-4 mr-2 text-blue-500" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Edit className="h-4 w-4 mr-2 text-green-500" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
