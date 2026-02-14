import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { canViewConsultationDetails } from "@/integrations/supabase/bookingHelpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  id: string;
  full_name: string | null;
  is_verified: boolean | null;
  created_at: string | null;
  role: AppRole;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  problem_category: string;
  preferred_slot: string;
  status: string;
  created_at: string;
  assigned_to: string | null;
  user_id: string;
  description: string | null;
  ai_summary: string | null;
}

interface Professional {
  id: string;
  full_name: string | null;
  role: AppRole;
}

const AdminDashboard = () => {
  const { user: currentUser, role: currentRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, is_verified, created_at");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    if (profiles && roles) {
      const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));
      const merged: UserWithRole[] = profiles.map((p) => ({
        ...p,
        role: roleMap.get(p.id) || "user",
      }));
      setUsers(merged);

      // Extract astrologers and priests for assignment
      const pros: Professional[] = merged
        .filter((u) => u.role === "astrologer" || u.role === "priest")
        .map((u) => ({ id: u.id, full_name: u.full_name, role: u.role }));
      setProfessionals(pros);
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data as Booking[]);
    setBookingsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchBookings();

    const channel = supabase
      .channel("admin_bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      fetchUsers();
    }
  };

  const handleVerify = async (userId: string, verified: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: verified })
      .eq("id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: verified ? "User verified" : "Verification removed" });
      fetchUsers();
    }
  };

  const handleAssign = async (bookingId: string, assigneeId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ assigned_to: assigneeId, status: "assigned" })
      .eq("id", bookingId);
    if (error) {
      toast({ title: "Error assigning", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking assigned" });
      fetchBookings();
    }
  };

  const roleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-600";
      case "astrologer": return "bg-purple-600";
      case "priest": return "bg-amber-600";
      default: return "bg-gray-500";
    }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "assigned": return "bg-blue-100 text-blue-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAssigneeName = (assignedTo: string | null) => {
    if (!assignedTo) return "Unassigned";
    const pro = professionals.find((p) => p.id === assignedTo);
    return pro?.full_name || "Unknown";
  };

  const getEligibleProfessionals = (serviceType: string) => {
    if (serviceType === "consultation") return professionals.filter((p) => p.role === "astrologer");
    if (serviceType === "pooja") return professionals.filter((p) => p.role === "priest");
    return [];
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#2B2B2B" }}>Admin Dashboard</h1>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : bookings.length === 0 ? (
                <p className="text-muted-foreground text-sm">No bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Slot</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>AI Summary</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((b) => {
                        // Test/debug: CASE 3 — Admin sees user details, problem description, AI summary, assigned astrologer
                        if (b.service_type === "consultation" && currentUser && currentRole) {
                          const canView = canViewConsultationDetails(b, { id: currentUser.id, role: currentRole });
                          console.log("[Admin booking row]", {
                            "booking.id": b.id,
                            "booking.status": b.status,
                            "booking.astrologer_id": b.assigned_to,
                            "loggedInUser.id": currentUser.id,
                            "booking.ai_summary": b.ai_summary ? `${b.ai_summary.slice(0, 50)}...` : null
                          });
                          if (canView) console.log("ADMIN VIEW — user details, problem description, AI summary, assigned astrologer", b.id);
                        }

                        return (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {b.service_type === "consultation" ? "Consultation" : "Pooja"}
                            </Badge>
                          </TableCell>
                          <TableCell>{b.problem_category}</TableCell>
                          <TableCell className="text-sm">{b.preferred_slot}</TableCell>
                          <TableCell>
                            <Badge className={statusBadgeColor(b.status)}>{b.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{getAssigneeName(b.assigned_to)}</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate" title={b.ai_summary ?? undefined}>
                            {b.ai_summary ?? "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap items-center gap-2">
                              {(!b.assigned_to || b.status === "pending") && (
                                <Select onValueChange={(v) => handleAssign(b.id, v)}>
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Assign..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getEligibleProfessionals(b.service_type).map((p) => (
                                      <SelectItem key={p.id} value={p.id}>
                                        {p.full_name || "Unnamed"} ({p.role})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              <Select
                                value={b.status}
                                onValueChange={async (v) => {
                                  const { error } = await supabase.from("bookings").update({ status: v }).eq("id", b.id);
                                  if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                                  else { toast({ title: "Status updated" }); fetchBookings(); }
                                }}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="assigned">Assigned</SelectItem>
                                  <SelectItem value="accepted">Accepted</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Change Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.full_name || "—"}</TableCell>
                          <TableCell>
                            <Badge className={roleBadgeColor(u.role)}>{u.role}</Badge>
                          </TableCell>
                          <TableCell>{u.is_verified ? "✅" : "—"}</TableCell>
                          <TableCell>
                            <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v as AppRole)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="astrologer">Astrologer</SelectItem>
                                <SelectItem value="priest">Priest</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={u.is_verified ? "outline" : "default"}
                              onClick={() => handleVerify(u.id, !u.is_verified)}
                            >
                              {u.is_verified ? "Unverify" : "Verify"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
