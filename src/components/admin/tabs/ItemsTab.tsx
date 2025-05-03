import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Plus, Search, ShoppingCart, AlertTriangle, Box, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useInventoryData } from "@/hooks/useInventoryData";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export interface ItemType {
  id: string;
  title: string;
  category: string;
  condition: string;
  status: string;
  swapcoins: number;
  created_at: string;
  user_id: string;
  // Inventory fields
  stock_quantity?: number;
  sku?: string;
  is_shop_item?: boolean;
  price?: number;
  // Enhanced unified system fields
  approval_status?: string;
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  convertible_to_inventory?: boolean;
  estimated_value?: number;
  images?: string[];
  image_url?: string;
  description?: string;
  size?: string;
  brand?: string;
}

interface ItemsTabProps {
  items: ItemType[];
}

export const ItemsTab = ({ items }: ItemsTabProps) => {
  const { 
    addInventoryItem, 
    updateInventoryItem,
    deleteInventoryItem,
    reviewSubmittedItem,
    convertToInventoryItem,
    batchApproveItems,
    loading, 
    shopItems,
    submittedItems,
    fetchInventoryItems,
    fetchSubmittedItems
  } = useInventoryData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "",
    condition: "new",
    price: 0,
    swapcoins: 0,
    stock_quantity: 1,
    sku: "",
    images: [] as File[]
  });
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [reviewData, setReviewData] = useState({
    notes: "",
    swapcoins: 0,
    convertible_to_inventory: false,
    estimated_value: 0
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchSwapcoins, setBatchSwapcoins] = useState(10);
  const [isConverting, setIsConverting] = useState(false);

  // Determine status color based on status string
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
      case 'out_of_stock': return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
      case 'low_stock': return 'bg-orange-500/20 text-orange-700 hover:bg-orange-500/30';
      default: return 'bg-monochrome-500/20 text-monochrome-700 hover:bg-monochrome-500/30';
    }
  };
  
  // Handle file selection for images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewItem(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Limit to 5 images max
    }));
  };

  // Add new inventory item
  const handleAddItem = async () => {
    try {
      // Validate form fields
      if (!newItem.title || !newItem.category || newItem.price < 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Create a properly typed object for the inventory item
      const itemData = {
        title: newItem.title,
        description: newItem.description,
        category: newItem.category,
        condition: newItem.condition,
        price: newItem.price,
        swapcoins: newItem.swapcoins || Math.round(newItem.price),
        stock_quantity: newItem.stock_quantity,
        sku: newItem.sku,
        is_shop_item: true,
        status: 'active',
        size: 'one-size', // Default size
      };
      
      toast({
        title: "Adding item...",
        description: "Your item is being processed.",
      });
      
      // Pass the item data separately from the files to avoid type conflicts
      const result = await addInventoryItem({
        ...itemData,
        // Handle the images separately to avoid type conflicts
        // The addInventoryItem function will handle the File[] type internally
        images: undefined // Remove the images property from the typed object
      }, newItem.images); // Pass files as a separate parameter
      
      if (result.success) {
        setAddDialogOpen(false); // Close dialog after successful submission
        resetNewItemForm();
        
        toast({
          title: "Item Added",
          description: "The item has been added to the shop inventory."
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Update stock quantity for an inventory item
  const handleUpdateStock = async (itemId: string, newQuantity: number) => {
    try {
      const result = await updateInventoryItem(itemId, { stock_quantity: newQuantity });
      
      if (result.success) {
        toast({
          title: "Stock Updated",
          description: `Inventory has been updated to ${newQuantity} units.`
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update inventory",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Handle inventory item deletion
  const handleDeleteItem = async (itemId: string) => {
    try {
      const result = await deleteInventoryItem(itemId);
      
      if (result.success) {
        toast({
          title: "Item Deleted",
          description: "The item has been removed from inventory."
        });
        setViewDialogOpen(false);
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Reset new item form
  const resetNewItemForm = () => {
    setNewItem({
      title: "",
      description: "",
      category: "",
      condition: "new",
      price: 0,
      swapcoins: 0,
      stock_quantity: 1,
      sku: "",
      images: []
    });
  };
  
  // Open view dialog for an item
  const viewItem = (item: ItemType) => {
    setSelectedItem(item);
    setReviewData({
      notes: item.review_notes || "",
      swapcoins: item.approval_status === 'approved' ? item.swapcoins : 10,
      convertible_to_inventory: item.convertible_to_inventory || false,
      estimated_value: item.estimated_value || 0
    });
    setViewDialogOpen(true);
    setEditMode(false);
  };
  
  // Handle item approval
  const handleApproveItem = async () => {
    if (!selectedItem) return;
    
    try {
      const result = await reviewSubmittedItem(
        selectedItem.id, 
        'approve', 
        reviewData
      );
      
      if (result.success) {
        toast({
          title: "Item Approved",
          description: "The user submitted item has been approved."
        });
        setViewDialogOpen(false);
      } else {
        toast({
          title: "Approval Failed",
          description: result.error || "Failed to approve item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error approving item:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Handle item rejection
  const handleRejectItem = async () => {
    if (!selectedItem) return;
    
    try {
      const result = await reviewSubmittedItem(
        selectedItem.id, 
        'reject', 
        { notes: reviewData.notes }
      );
      
      if (result.success) {
        toast({
          title: "Item Rejected",
          description: "The user submitted item has been rejected."
        });
        setViewDialogOpen(false);
      } else {
        toast({
          title: "Rejection Failed",
          description: result.error || "Failed to reject item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Handle converting user item to inventory
  const handleConvertToInventory = async () => {
    if (!selectedItem) return;
    
    try {
      setIsConverting(true);
      const result = await convertToInventoryItem(selectedItem.id);
      
      if (result.success) {
        toast({
          title: "Conversion Successful",
          description: "The item has been added to shop inventory."
        });
        setViewDialogOpen(false);
      } else {
        toast({
          title: "Conversion Failed",
          description: result.error || "Failed to convert item to inventory",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error converting item:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  // Handle batch approval of multiple items
  const handleBatchApprove = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to approve.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await batchApproveItems(selectedItems, batchSwapcoins);
      
      if (result.success) {
        toast({
          title: "Batch Approval Successful",
          description: `${selectedItems.length} items have been approved.`
        });
        setBatchDialogOpen(false);
        setSelectedItems([]);
      } else {
        toast({
          title: "Batch Approval Failed",
          description: result.error || "Failed to approve items",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in batch approval:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Toggle selection of an item for batch operations
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prevSelected => 
      prevSelected.includes(itemId)
        ? prevSelected.filter(id => id !== itemId)
        : [...prevSelected, itemId]
    );
  };
  
  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Separate inventory items from user submissions
  const userSubmittedItems = filteredItems.filter(item => !item.is_shop_item);
  const inventoryItems = filteredItems.filter(item => item.is_shop_item);
  
  // Further filter user submissions by approval status
  const pendingSubmissions = userSubmittedItems.filter(
    item => item.approval_status === 'pending' || !item.approval_status
  );
  const approvedSubmissions = userSubmittedItems.filter(
    item => item.approval_status === 'approved'
  );
  const rejectedSubmissions = userSubmittedItems.filter(
    item => item.approval_status === 'rejected'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Unified Item Management</h2>
          <p className="text-muted-foreground">Manage shop inventory and user submissions in one place</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Shop Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Item Name</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter item name" 
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter item description" 
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({...newItem, category: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="bottoms">Bottoms</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                        <SelectItem value="dresses">Dresses</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="footwear">Footwear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select 
                      value={newItem.condition}
                      onValueChange={(value) => setNewItem({...newItem, condition: value})}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      min="0"
                      step="0.01"
                      placeholder="0.00" 
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="swapcoins">SwapCoins</Label>
                    <Input 
                      id="swapcoins" 
                      type="number" 
                      min="0"
                      placeholder="0" 
                      value={newItem.swapcoins}
                      onChange={(e) => setNewItem({...newItem, swapcoins: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input 
                      id="sku" 
                      placeholder="SKU-001" 
                      value={newItem.sku}
                      onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      min="0"
                      placeholder="1" 
                      value={newItem.stock_quantity}
                      onChange={(e) => setNewItem({...newItem, stock_quantity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="images">Item Images</Label>
                  <Input 
                    id="images" 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="text-xs text-muted-foreground">
                    You can upload up to 5 images. {newItem.images.length} selected.
                  </div>
                  {newItem.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newItem.images.map((file, index) => (
                        <div key={index} className="relative w-16 h-16 overflow-hidden rounded-md">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index}`} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetNewItemForm();
                  setAddDialogOpen(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} onClick={handleAddItem}>
                  {loading ? <LoadingSpinner size="small" className="mr-2" /> : null}
                  Add to Inventory
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Shop Inventory</TabsTrigger>
          <TabsTrigger value="pending">Pending Submissions</TabsTrigger>
          <TabsTrigger value="approved">Approved Submissions</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Submissions</TabsTrigger>
        </TabsList>
        
        {/* INVENTORY TAB */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>SwapCoins</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.sku || 'N/A'}</TableCell>
                    <TableCell>${item.price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{item.swapcoins}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          min="0" 
                          className="w-16 h-8" 
                          value={item.stock_quantity || 0}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            if (!isNaN(newValue) && newValue >= 0) {
                              handleUpdateStock(item.id, newValue);
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(
                        !item.stock_quantity || item.stock_quantity <= 0 ? 'out_of_stock' : 
                        item.stock_quantity < 5 ? 'low_stock' : 'approved'
                      )}>
                        {!item.stock_quantity || item.stock_quantity <= 0 ? 'Out of Stock' : 
                         item.stock_quantity < 5 ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewItem(item)}>View</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {inventoryItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        <p className="text-muted-foreground">No shop inventory items found</p>
                        <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)}>
                          Add your first item
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* PENDING SUBMISSIONS TAB */}
        <TabsContent value="pending" className="space-y-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                disabled={loading} 
                onClick={() => fetchSubmittedItems()}
              >
                {loading ? <LoadingSpinner size="small" className="mr-2" /> : null}
                Refresh List
              </Button>
              {selectedItems.length > 0 && (
                <Button 
                  onClick={() => setBatchDialogOpen(true)}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Batch Approve ({selectedItems.length})
                </Button>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedItems.length} of {pendingSubmissions.length} items selected
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubmissions.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedItems.includes(item.id)} 
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.condition}</TableCell>
                    <TableCell className="font-mono text-xs">{item.user_id.substring(0, 8)}...</TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewItem(item)}>View</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700"
                          onClick={() => {
                            viewItem(item);
                            setEditMode(false);
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                        <p className="text-muted-foreground">No pending submissions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* APPROVED SUBMISSIONS TAB */}
        <TabsContent value="approved" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>SwapCoins</TableHead>
                  <TableHead>Convertible</TableHead>
                  <TableHead>Reviewed At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedSubmissions.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.condition}</TableCell>
                    <TableCell>{item.swapcoins}</TableCell>
                    <TableCell>
                      {item.convertible_to_inventory ? 
                        <Badge className="bg-green-100 text-green-800">Yes</Badge> : 
                        <Badge variant="outline">No</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      {item.reviewed_at ? 
                        new Date(item.reviewed_at).toLocaleDateString() : 
                        'Unknown'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewItem(item)}>View</Button>
                        {item.convertible_to_inventory && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-primary hover:text-primary/80 gap-1"
                            onClick={() => {
                              setSelectedItem(item);
                              handleConvertToInventory();
                            }}
                          >
                            <ShoppingCart className="h-3 w-3" />
                            To Inventory
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {approvedSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        <p className="text-muted-foreground">No approved submissions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* REJECTED SUBMISSIONS TAB */}
        <TabsContent value="rejected" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Review Notes</TableHead>
                  <TableHead>Reviewed At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedSubmissions.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.condition}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.review_notes || 'No notes provided'}
                    </TableCell>
                    <TableCell>
                      {item.reviewed_at ? 
                        new Date(item.reviewed_at).toLocaleDateString() : 
                        'Unknown'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => viewItem(item)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rejectedSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        <p className="text-muted-foreground">No rejected submissions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* BATCH APPROVAL DIALOG */}
      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Batch Approve Items</DialogTitle>
            <DialogDescription>
              You are about to approve {selectedItems.length} items. This will credit users with SwapCoins.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="batch-swapcoins">SwapCoins per item</Label>
                <Input
                  id="batch-swapcoins"
                  type="number"
                  min="0"
                  value={batchSwapcoins}
                  onChange={(e) => setBatchSwapcoins(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Each user will receive this amount of SwapCoins for their approved items.
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">This action cannot be undone.</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBatchApprove} disabled={loading}>
              {loading ? <LoadingSpinner size="small" className="mr-2" /> : null}
              Approve {selectedItems.length} Items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ITEM DETAIL / REVIEW DIALOG */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.is_shop_item ? "Inventory Item" : "User Submission"} 
              {selectedItem?.approval_status && !selectedItem?.is_shop_item && (
                <Badge 
                  className={`ml-2 ${
                    selectedItem.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedItem.approval_status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedItem.approval_status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Item Images Section */}
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden h-64 bg-gray-100 flex items-center justify-center">
                  {selectedItem.image_url ? (
                    <img 
                      src={selectedItem.image_url} 
                      alt={selectedItem.title} 
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground">No Image Available</div>
                  )}
                </div>
                
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {selectedItem.images.map((imageUrl, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={`${selectedItem.title} view ${index + 1}`} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Item Details Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedItem.category}</Badge>
                  <Badge variant="outline">{selectedItem.condition}</Badge>
                  {selectedItem.is_shop_item && (
                    <Badge variant="outline" className={getStatusColor(
                      !selectedItem.stock_quantity || selectedItem.stock_quantity <= 0 ? 'out_of_stock' : 
                      selectedItem.stock_quantity < 5 ? 'low_stock' : 'approved'
                    )}>
                      {!selectedItem.stock_quantity || selectedItem.stock_quantity <= 0 ? 'Out of Stock' : 
                       selectedItem.stock_quantity < 5 ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  )}
                </div>
                
                {selectedItem.description && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Description</h4>
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                  </div>
                )}
                
                {selectedItem.is_shop_item ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="font-medium">${selectedItem.price?.toFixed(2) || '0.00'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">SwapCoins</div>
                        <div className="font-medium">{selectedItem.swapcoins}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">SKU</div>
                        <div>{selectedItem.sku || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Stock</div>
                        <div>{selectedItem.stock_quantity || 0} units</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Review form for user submitted items */}
                    {selectedItem.approval_status !== 'approved' && selectedItem.approval_status !== 'rejected' && (
                      <div className="space-y-4 border-t pt-4 mt-4">
                        <h4 className="font-medium">Review Item</h4>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="swapcoins">SwapCoins to Award</Label>
                          <Input 
                            id="swapcoins"
                            type="number"
                            min="0"
                            value={reviewData.swapcoins}
                            onChange={(e) => setReviewData({
                              ...reviewData, 
                              swapcoins: parseInt(e.target.value)
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            These SwapCoins will be added to the user's account if approved.
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="convertible" 
                            checked={reviewData.convertible_to_inventory}
                            onCheckedChange={(checked) => {
                              setReviewData({
                                ...reviewData,
                                convertible_to_inventory: !!checked
                              });
                            }}
                          />
                          <Label htmlFor="convertible" className="text-sm font-normal">
                            Item can be converted to shop inventory
                          </Label>
                        </div>
                        
                        {reviewData.convertible_to_inventory && (
                          <div className="grid gap-2">
                            <Label htmlFor="estimated-value">Estimated Value ($)</Label>
                            <Input 
                              id="estimated-value"
                              type="number"
                              min="0"
                              step="0.01"
                              value={reviewData.estimated_value}
                              onChange={(e) => setReviewData({
                                ...reviewData, 
                                estimated_value: parseFloat(e.target.value)
                              })}
                            />
                            <p className="text-xs text-muted-foreground">
                              This will be the initial price if converted to inventory.
                            </p>
                          </div>
                        )}
                        
                        <div className="grid gap-2">
                          <Label htmlFor="review-notes">Review Notes</Label>
                          <Textarea 
                            id="review-notes"
                            placeholder="Add notes about this item..."
                            value={reviewData.notes}
                            onChange={(e) => setReviewData({
                              ...reviewData, 
                              notes: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Display review information for already reviewed items */}
                    {(selectedItem.approval_status === 'approved' || selectedItem.approval_status === 'rejected') && (
                      <div className="space-y-4 border-t pt-4 mt-4">
                        <h4 className="font-medium">Review Information</h4>
                        
                        {selectedItem.approval_status === 'approved' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">SwapCoins Awarded</div>
                              <div className="font-medium">{selectedItem.swapcoins}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Convertible to Inventory</div>
                              <div>{selectedItem.convertible_to_inventory ? 'Yes' : 'No'}</div>
                            </div>
                            {selectedItem.convertible_to_inventory && (
                              <div>
                                <div className="text-sm text-muted-foreground">Estimated Value</div>
                                <div>${selectedItem.estimated_value?.toFixed(2) || '0.00'}</div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Review Notes</div>
                          <div className="bg-muted p-2 rounded-md mt-1 text-sm">
                            {selectedItem.review_notes || 'No notes provided'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Reviewed At</div>
                            <div>
                              {selectedItem.reviewed_at ? 
                                new Date(selectedItem.reviewed_at).toLocaleString() : 
                                'Unknown'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="pt-2">
                  <div className="text-sm text-muted-foreground">Item ID</div>
                  <div className="font-mono text-xs">{selectedItem.id}</div>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm text-muted-foreground">Added on</div>
                  <div>{new Date(selectedItem.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedItem?.is_shop_item ? (
              <>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => setEditMode(true)}>
                  Edit Item
                </Button>
              </>
            ) : (
              selectedItem?.approval_status === 'pending' || !selectedItem?.approval_status ? (
                <>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="destructive" onClick={handleRejectItem} disabled={loading}>
                    {loading ? <LoadingSpinner size="small" className="mr-2" /> : null}
                    Reject
                  </Button>
                  <Button variant="default" onClick={handleApproveItem} disabled={loading}>
                    {loading ? <LoadingSpinner size="small" className="mr-2" /> : null}
                    Approve
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Close
                  </Button>
                  {selectedItem.approval_status === 'approved' && selectedItem.convertible_to_inventory && (
                    <Button 
                      disabled={isConverting || loading} 
                      onClick={handleConvertToInventory}
                    >
                      {isConverting ? <LoadingSpinner size="small" className="mr-2" /> : null}
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Shop Inventory
                    </Button>
                  )}
                </>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
