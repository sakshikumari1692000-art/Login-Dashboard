import { useNavigate } from "react-router-dom";
import { UseAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";

interface DashboardData {
  overview: {
    totalBooks: number;
    activeBooks: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    lowStockBooks: number;
  };
  ordersByStatus: Record<string, number>;
  recentOrders: {
    customer: { name: string };
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }[];
  monthlyRevenue: {
    _id: { year: number; month: number };
    revenue: number;
    orders: number;
  }[];
  topSellingBooks: {
    _id: string;
    title: string;
    totalSold: number;
    totalRevenue: number;
  }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  confirmed: "bg-violet-100 text-violet-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  unpaid: "bg-amber-100 text-amber-700",
  refunded: "bg-red-100 text-red-700",
};

const statusBarColors: Record<string, string> = {
  pending: "bg-amber-400",
  shipped: "bg-blue-400",
  delivered: "bg-emerald-400",
  confirmed: "bg-violet-400",
  cancelled: "bg-red-400",
};

const Dashboard = () => {
  const { user, logout } = UseAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardData();
        if (res.success) {
          setData(res.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const getMonthName = (month: number) =>
    new Date(2026, month - 1).toLocaleString("default", { month: "long" });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const overview = data!.overview;
  const totalStatusOrders = Object.values(data!.ordersByStatus).reduce((a, b) => a + b, 0);

  const overviewCards = [
    { label: "Total Revenue", value: formatCurrency(overview.totalRevenue), icon: "💰", accent: "from-emerald-500 to-teal-600" },
    { label: "Total Orders", value: overview.totalOrders, icon: "📦", accent: "from-blue-500 to-indigo-600" },
    { label: "Total Books", value: overview.totalBooks, icon: "📚", accent: "from-violet-500 to-purple-600" },
    { label: "Active Books", value: overview.activeBooks, icon: "✅", accent: "from-green-500 to-emerald-600" },
    { label: "Total Users", value: overview.totalUsers, icon: "👥", accent: "from-orange-500 to-amber-600" },
    { label: "Low Stock", value: overview.lowStockBooks, icon: "⚠️", accent: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-bold text-white tracking-tight">BookStore</h1>
            <span className="hidden sm:block text-xs font-medium bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}! 👋</h2>
          <p className="text-slate-400 mt-1">Here's what's happening with your store today.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {overviewCards.map((card) => (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-5 hover:bg-white/8 transition-all duration-300 group"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${card.accent} transition-opacity duration-300`}></div>
              <div className="relative">
                <span className="text-2xl">{card.icon}</span>
                <p className="text-2xl font-bold text-white mt-3">{card.value}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row: Orders by Status + Top Selling Books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status */}
          <div className="rounded-2xl bg-white/5 border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Orders by Status</h3>
            <div className="space-y-4">
              {Object.entries(data!.ordersByStatus).map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300 capitalize">{status}</span>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusBarColors[status] || "bg-slate-400"} transition-all duration-700`}
                      style={{ width: `${totalStatusOrders > 0 ? (count / totalStatusOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Books */}
          <div className="rounded-2xl bg-white/5 border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Top Selling Books</h3>
            <div className="space-y-3">
              {data!.topSellingBooks.map((book, idx) => (
                <div
                  key={book._id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{book.title}</p>
                    <p className="text-xs text-slate-400">{book.totalSold} sold</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">{formatCurrency(book.totalRevenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        {data!.monthlyRevenue.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data!.monthlyRevenue.map((m) => (
                <div
                  key={`${m._id.year}-${m._id.month}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-lg font-bold">
                    📊
                  </div>
                  <div>
                    <p className="text-white font-semibold">{formatCurrency(m.revenue)}</p>
                    <p className="text-xs text-slate-400">
                      {getMonthName(m._id.month)} {m._id.year} · {m.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-white/5">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Order</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Payment</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data!.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/3 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-indigo-300">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">{order.customer.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-white">{formatCurrency(order.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${paymentColors[order.paymentStatus] || "bg-slate-100 text-slate-700"}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{formatDate(order.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
