import { NextRequest, NextResponse } from 'next/server';
import { CustomersService } from '@/lib/admin-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv';
    const search = searchParams.get('search') || undefined;

    // Get all customers (no pagination for export)
    const { customers } = await CustomersService.getAll({
      search,
      limit: 10000, // Large limit for export
    });

    if (format === 'csv') {
      // Generate CSV content
      const csvHeaders = [
        'ID',
        'Name', 
        'Email',
        'Phone',
        'Total Orders',
        'Join Date',
        'Last Updated'
      ];

      const csvRows = customers.map(customer => [
        customer.id,
        customer.name || '',
        customer.email || '',
        (customer as any).phone || '', // Type assertion for optional phone field
        customer._count?.orders || 0,
        customer.createdAt?.toISOString().split('T')[0] || '',
        customer.updatedAt?.toISOString().split('T')[0] || ''
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => 
          typeof field === 'string' && field.includes(',') 
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (format === 'json') {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalCustomers: customers.length,
        customers: customers.map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: (customer as any).phone || null, // Type assertion for optional phone field
          totalOrders: customer._count?.orders || 0,
          joinDate: customer.createdAt,
          lastUpdated: customer.updatedAt,
        }))
      };

      return NextResponse.json(exportData, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'Unsupported format. Use csv or json.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error exporting customers:', error);
    return NextResponse.json(
      { error: 'Failed to export customers' },
      { status: 500 }
    );
  }
}
