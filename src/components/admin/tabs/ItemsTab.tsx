
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ItemType {
  id: string;
  title: string;
  category: string;
  condition: string;
  status: string;
  swapcoins: number;
  created_at: string;
  user_id: string;
}

interface ItemsTabProps {
  items: ItemType[];
}

export const ItemsTab = ({ items }: ItemsTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
      default: return 'bg-monochrome-500/20 text-monochrome-700 hover:bg-monochrome-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Item Management</h2>
        <p className="text-muted-foreground">View and manage all submitted items</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SwapCoins</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.condition}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.swapcoins}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">Approve</Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
