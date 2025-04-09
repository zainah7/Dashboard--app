import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";

export default function DataTable({ data, setData }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [filter, setFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Filtering logic
  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(filter.toLowerCase())
    )
  );

  // Sorting handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Form submission
  const handleAddData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.error("Please fill all fields");
        return;
      }

      // Check for duplicate email
      if (data.some((item) => item.email === formData.email)) {
        toast.warning("Email already exists!");
        return;
      }

      // Add new data
      setData((prevData) => [
        ...prevData,
        {
          ...formData,
          id: Math.max(0, ...prevData.map((item) => item.id)) + 1,
        },
      ]);

      toast.success("Data added successfully!");
      setFormData({ name: "", email: "" });
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add data");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Filter data..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:max-w-sm"
        />

        {/* Add Data Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              Add Data
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Add New Data
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddData} className="space-y-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isSubmitting}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isSubmitting}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                  className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSubmitting ? "Adding..." : "Add Data"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-2">
                <Button
                  variant="ghost"
                  onClick={() => requestSort("id")}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium p-0 sm:p-2"
                >
                  ID{" "}
                  <ArrowUpDown className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 text-indigo-600 dark:text-indigo-400" />
                </Button>
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-2">
                <Button
                  variant="ghost"
                  onClick={() => requestSort("name")}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium p-0 sm:p-2"
                >
                  Name{" "}
                  <ArrowUpDown className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 text-indigo-600 dark:text-indigo-400" />
                </Button>
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-2">
                <Button
                  variant="ghost"
                  onClick={() => requestSort("email")}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium p-0 sm:p-2"
                >
                  Email{" "}
                  <ArrowUpDown className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 text-indigo-600 dark:text-indigo-400" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id}
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <TableCell className="text-gray-800 dark:text-gray-200 px-2 sm:px-4 py-2">
                  {item.id}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-200 px-2 sm:px-4 py-2">
                  {item.name}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-200 px-2 sm:px-4 py-2">
                  {item.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
