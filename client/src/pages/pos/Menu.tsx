import { useTenant } from "@/contexts/TenantContext";
import { trpc } from "@/lib/trpc";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronRight, Utensils } from "lucide-react";
import { useState } from "react";

export default function Menu() {
  const { tenantId } = useTenant();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    isTaxable: true,
    categoryId: "",
  });

  const { data: categories = [], refetch: refetchCats } = trpc.menu.getCategories.useQuery(
    { tenantId: tenantId! },
    { enabled: !!tenantId }
  );

  const { data: items = [], refetch: refetchItems } = trpc.menu.getItems.useQuery(
    { tenantId: tenantId!, categoryId: selectedCategoryId ?? undefined },
    { enabled: !!tenantId }
  );

  const createCategoryMutation = trpc.menu.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Category created");
      setShowAddCategory(false);
      setNewCategory({ name: "", description: "" });
      refetchCats();
    },
    onError: (e) => toast.error(e.message),
  });

  const createItemMutation = trpc.menu.createItem.useMutation({
    onSuccess: () => {
      toast.success("Menu item created");
      setShowAddItem(false);
      setNewItem({ name: "", description: "", price: "", isTaxable: true, categoryId: "" });
      refetchItems();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateItemMutation = trpc.menu.updateItem.useMutation({
    onSuccess: () => {
      toast.success("Item updated");
      setEditItem(null);
      refetchItems();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteItemMutation = trpc.menu.deleteItem.useMutation({
    onSuccess: () => {
      toast.success("Item removed");
      refetchItems();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteCategoryMutation = trpc.menu.deleteCategory.useMutation({
    onSuccess: () => {
      toast.success("Category removed");
      refetchCats();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <POSLayout title="Menu Management">
      <div className="flex h-full">
        {/* Categories Sidebar */}
        <div className="w-56 border-r border-border/50 flex flex-col">
          <div className="p-3 border-b border-border/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAddCategory(true)}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategoryId === null
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <div key={cat.id} className="group flex items-center">
                <button
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategoryId === cat.id
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
                <button
                  onClick={() => deleteCategoryMutation.mutate({ id: cat.id, tenantId: tenantId! })}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""}
              {selectedCategoryId && categories.find((c) => c.id === selectedCategoryId) && (
                <span> in {categories.find((c) => c.id === selectedCategoryId)?.name}</span>
              )}
            </div>
            <Button size="sm" onClick={() => setShowAddItem(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Item
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No items yet</p>
                <p className="text-sm mt-1">Add your first menu item</p>
                <Button className="mt-4" size="sm" onClick={() => setShowAddItem(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border/50 bg-card hover:border-border transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm leading-tight">{item.name}</div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItemMutation.mutate({ id: item.id, tenantId: tenantId! })}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">
                        ₱{parseFloat(String(item.price)).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.isTaxable && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">VAT</Badge>
                        )}
                        <Badge
                          className={`text-[10px] px-1.5 py-0 ${
                            item.isAvailable
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Beverages, Main Course"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory((p) => ({ ...p, description: e.target.value }))}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button>
            <Button
              onClick={() =>
                createCategoryMutation.mutate({
                  tenantId: tenantId!,
                  name: newCategory.name,
                  description: newCategory.description || undefined,
                })
              }
              disabled={!newCategory.name || createCategoryMutation.isPending}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Category</Label>
              <Select
                value={newItem.categoryId}
                onValueChange={(v) => setNewItem((p) => ({ ...p, categoryId: v }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Item Name</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Iced Americano"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Price (₱)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))}
                placeholder="0.00"
                className="mt-1.5"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={newItem.isTaxable}
                onCheckedChange={(v) => setNewItem((p) => ({ ...p, isTaxable: v }))}
              />
              <Label>Subject to 12% VAT</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItem(false)}>Cancel</Button>
            <Button
              onClick={() =>
                createItemMutation.mutate({
                  tenantId: tenantId!,
                  categoryId: parseInt(newItem.categoryId),
                  name: newItem.name,
                  description: newItem.description || undefined,
                  price: parseFloat(newItem.price).toFixed(2),
                  isTaxable: newItem.isTaxable,
                })
              }
              disabled={!newItem.name || !newItem.price || !newItem.categoryId || createItemMutation.isPending}
            >
              {createItemMutation.isPending ? "Creating..." : "Create Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4 py-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={editItem.name}
                  onChange={(e) => setEditItem((p: any) => ({ ...p, name: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Price (₱)</Label>
                <Input
                  type="number"
                  value={editItem.price}
                  onChange={(e) => setEditItem((p: any) => ({ ...p, price: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editItem.isAvailable}
                  onCheckedChange={(v) => setEditItem((p: any) => ({ ...p, isAvailable: v }))}
                />
                <Label>Available for ordering</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button
              onClick={() =>
                updateItemMutation.mutate({
                  id: editItem.id,
                  tenantId: tenantId!,
                  name: editItem.name,
                  price: parseFloat(editItem.price).toFixed(2),
                  isAvailable: editItem.isAvailable,
                })
              }
              disabled={updateItemMutation.isPending}
            >
              {updateItemMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </POSLayout>
  );
}
