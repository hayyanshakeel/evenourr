"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/currencies"

const orders = [
	{
		id: "ORD-2024-001",
		customer: "John Doe",
		email: "john@example.com",
		total: 2340,
		status: "delivered",
		date: "2024-01-15",
		items: 3,
	},
	{
		id: "ORD-2024-002",
		customer: "Sarah Wilson",
		email: "sarah@example.com",
		total: 1890,
		status: "processing",
		date: "2024-01-14",
		items: 2,
	},
	{
		id: "ORD-2024-003",
		customer: "Mike Johnson",
		email: "mike@example.com",
		total: 3450,
		status: "shipped",
		date: "2024-01-13",
		items: 5,
	},
	{
		id: "ORD-2024-004",
		customer: "Emily Brown",
		email: "emily@example.com",
		total: 890,
		status: "pending",
		date: "2024-01-12",
		items: 1,
	},
]

const statusColors = {
	pending: "bg-yellow-100 text-yellow-800",
	processing: "bg-blue-100 text-blue-800",
	shipped: "bg-purple-100 text-purple-800",
	delivered: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800",
}

export function OrdersTable() {
	const { currency } = useSettings();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Orders</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Items</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-medium">{order.id}</TableCell>
								<TableCell>
									<div>
										<div className="font-medium">{order.customer}</div>
										<div className="text-sm text-muted-foreground">
											{order.email}
										</div>
									</div>
								</TableCell>
								<TableCell className="font-medium">{formatCurrency(order.total, currency)}</TableCell>
								<TableCell>
									<Badge className={statusColors[order.status as keyof typeof statusColors]}>{order.status}</Badge>
								</TableCell>
								<TableCell>{order.date}</TableCell>
								<TableCell>{order.items}</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-2">
										<Button variant="outline" size="sm">
											<Eye className="h-4 w-4" />
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" size="sm">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>View Details</DropdownMenuItem>
												<DropdownMenuItem>Edit Order</DropdownMenuItem>
												<DropdownMenuItem>Mark as Shipped</DropdownMenuItem>
												<DropdownMenuItem>Cancel Order</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
