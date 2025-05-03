import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, PackagePlus, Edit, Trash2, Save, X, Eye } from "lucide-react";

// Type for shop/inventory item with all needed fields
type InventoryItem = Tables<"items"> & {
  isEditing?: boolean;
};

export function InventoryManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  
  // Form state for new/edit item
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    condition: "",
    size: "",
    swapcoins: 0,
    price: 0,
    stock_quantity: 0,
    sku: "",
    status: "active",
    is_shop_item: true
  });

  // Fetch inventory items on component mount
  useEffect(() => {
    fetchItems();
    
    // Set up real-time listener for changes to items table
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes (insert, update, delete)
          schema: 'public',
          table: 'items'
        },
        (payload) => {
          console.log('Change received!', payload);
          // Refresh data when changes occur
          fetchItems();
        }
      )
      .subscribe();
      
    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.sku?.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // Fetch all inventory items from Supabase
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
      setFilteredItems(data || []);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast({
        variant: "destructive",
        title: "Failed to load inventory",
        description: "There was a problem loading the inventory items."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open dialog to create a new item
  const handleCreateNew = () => {
    setIsCreateMode(true);
    setFormData({
      id: "",
      title: "",
      description: "",
      category: "",
      condition: "new_with_tags",
      size: "",
      swapcoins: 0,
      price: 0,
      stock_quantity: 1,
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      status: "active",
      is_shop_item: true
    });
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing item
  const handleEditItem = (item: InventoryItem) => {
    setIsCreateMode(false);
    setFormData({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      condition: item.condition || "",
      size: item.size || "",
      swapcoins: item.swapcoins || 0,
      price: item.price || 0,
      stock_quantity: item.stock_quantity || 0,
      sku: item.sku || "",
      status: item.status || "active",
      is_shop_item: item.is_shop_item !== null ? item.is_shop_item : true
    });
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  // Handle dialog form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  // Save new or updated item
  const handleSaveItem = async () => {
    try {
      if (isCreateMode) {
        // Create a new item
        const { data, error } = await supabase
          .from("items")
          .insert({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            condition: formData.condition,
            size: formData.size,
            swapcoins: formData.swapcoins,
            price: formData.price,
            stock_quantity: formData.stock_quantity,
            sku: formData.sku,
            status: formData.status,
            is_shop_item: true,
            user_id: "admin" // This should be the admin user ID in a real app
          })
          .select();

        if (error) throw error;
        
        toast({
          title: "Item created",
          description: "The new item has been added to inventory."
        });
      } else {
        // Update existing item
        const { error } = await supabase
          .from("items")
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            condition: formData.condition,
            size: formData.size,
            swapcoins: formData.swapcoins,
            price: formData.price,
            stock_quantity: formData.stock_quantity,
            sku: formData.sku,
            status: formData.status,
            is_shop_item: formData.is_shop_item
          })
          .eq("id", formData.id);

        if (error) throw error;
        
        toast({
          title: "Item updated",
          description: "The item has been updated successfully."
        });
      }

      // Close dialog and refresh items
      setIsDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        variant: "destructive",
        title: "Failed to save item",
        description: "There was a problem saving the item to inventory."
      });
    }
  };

  // Delete an inventory item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Item deleted",
        description: "The item has been removed from inventory."
      });
      
      // Refresh items
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete item",
        description: "There was a problem removing the item from inventory."
      });
    }
  };

  // Update an item's status (active/inactive)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    try {
      const { error } = await supabase
        .from("items")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: `Item ${newStatus === "active" ? "activated" : "deactivated"}`,
        description: `The item is now ${newStatus}.`
      });
      
      // Refresh items
      fetchItems();
    } catch (error) {
      console.error("Error updating item status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "There was a problem updating the item status."
      });
    }
  };

  const categoryOptions = [
    "tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"
  ];

  const conditionOptions = [
    { value: "new_with_tags", label: "New with tags" },
    { value: "like_new", label: "Like new" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" }
  ];

  const sizeOptions = [
    "xxs", "xs", "s", "m", "l", "xl", "xxl", "one_size"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Inventory Manager</CardTitle>
            <CardDescription>
              Manage your inventory - changes appear instantly in the shop
            </CardDescription>
          </div>
          <Button onClick={handleCreateNew}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Item</th>
                  <th className="py-3 px-4 text-left font-medium">Category</th>
                  <th className="py-3 px-4 text-left font-medium">Size</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-right font-medium">Price (SwapCoins)</th>
                  <th className="py-3 px-4 text-right font-medium">Stock</th>
                  <th className="py-3 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">Loading inventory...</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      {searchQuery ? "No items match your search" : "No items in inventory yet"}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground">{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="uppercase">{item.size}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={item.status === "active" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">{item.swapcoins}</td>
                      <td className="py-3 px-4 text-right">{item.stock_quantity || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleStatus(item.id, item.status || "")}
                          >
                            <Eye className={`h-4 w-4 ${item.status === "active" ? "text-green-500" : "text-muted-foreground"}`} />
                            <span className="sr-only">Toggle visibility</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isCreateMode ? "Add New Item" : "Edit Item"}</DialogTitle>
            <DialogDescription>
              {isCreateMode
                ? "Add a new item to the inventory. It will be immediately available in the shop."
                : "Edit this inventory item. Changes will be immediately reflected in the shop."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Item Name</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Product title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Stock keeping unit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => handleSelectChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleSelectChange("condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="swapcoins">SwapCoins Price</Label>
              <Input
                id="swapcoins"
                name="swapcoins"
                type="number"
                min="0"
                value={formData.swapcoins}
                onChange={(e) => handleNumberChange("swapcoins", e.target.value)}
                placeholder="Price in SwapCoins"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => handleNumberChange("stock_quantity", e.target.value)}
                placeholder="Available quantity"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Product description"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              <Save className="mr-2 h-4 w-4" />
              {isCreateMode ? "Create Item" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}