import { ReactNode } from 'react';

// Update the Column type to include specific classNames
interface Column<T> {
  key: string;
  label: ReactNode;
  render: (item: T) => ReactNode;
  className?: string; // Add a className for the cell (td)
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends { id: any }>({
  columns,
  data,
  loading = false,
  onRowClick,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-gray-500">
        Loading...
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                // Apply the className to the header
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((col) => (
                <td 
                  key={col.key} 
                  // Apply the className to the cell
                  className={`whitespace-nowrap px-4 py-4 text-sm text-gray-600 ${col.className || ''}`}
                >
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}