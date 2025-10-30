"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Plus, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const API = "https://be-production-4ef6.up.railway.app/expense";
const Token = () => localStorage.getItem("token") || "";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", icon: "" });
  const [loading, setLoading] = useState(false);

  // redirect if no token
  const router = useRouter();
    if (!Token) {
      router.push("/");
    }

    // Load Expenses
  const loadExpenses = async () => {
    try {
      const res = await axios.get(`${API}/`, {
        headers: { credentials: "include", Authorization: `Bearer ${Token()}` },
      });
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Load expenses error:", err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

 // Add Expense
  const handleAdd = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/`, {
        icon: form.icon || "💸",
        amount: Number(form.amount),
        category: form.category,
        date: form.date || new Date().toISOString(),
      }, {
        headers: { credentials: "include", Authorization: `Bearer ${Token()}` },
      });
      toast.success("Expense added!");
      setForm({ icon: "", amount: "", category: "", date: "" });
      loadExpenses();
      
    } catch (err) {
      console.error("Add expense error:", err);
      toast.error(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { credentials: "include", Authorization: `Bearer ${Token()}` },
      });
      await loadExpenses();
      toast.success("Expense deleted!");
    } catch (err) {
      console.error("Delete expense error:", err);
      toast.error(err.response?.data?.message || "Failed to delete expense");
    }
  };

  // Download Expenses
 const handleDownload = async () => {
  try {
    const response = await axios.get(`${API}/download`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${Token()}`,
        credentials: "include",
      },
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "expenses.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Expenses file downloaded successfully!");
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error("Failed to download the expenses file.");
  }
};

//chart data
  const chartData = expenses.map((i) => ({
    name: new Date(i.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    amount: i.amount,
  }));

  return (
    <div className="min-h-screen text-gray-800">
      
      <div className="flex">
        <main className="flex-1 p-6">
          <header className="flex items-center justify-between mb-6 mt-2">
            <h2 className="text-2xl font-medium">Expense Tracker</h2>
          </header>

          {/* Chart Section */}
          <section className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium">Expense Overview</h3>
                <p className="text-sm text-gray-600">
                  Track your spending trends over time and gain insights into
                  where your money goes.
                </p>
              </div>
              <button
                className="btn bg-purple-600 border-none text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                <Plus size={16} /> Add Expense
              </button>
            </div>

            {/* Smooth Purple Area Chart */}
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fill="url(#colorPurple)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* All Expense*/}
          <section className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">All Expenses</h4>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-100 cursor-pointer"
                >
                  <Download size={16} /> Download
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {expenses.length === 0 && (
                  <div className="text-gray-500 py-6">No expenses yet</div>
                )}

                {expenses.map((exp) => (
                  <div
                    key={exp._id}
                    className="flex items-center justify-between gap-4 border-b pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                        {exp.icon || "💸"}
                      </div>

                      <div>
                        <div className="font-medium">{exp.category}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(exp.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-red-500 font-medium">
                        -${exp.amount}
                      </div>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Expense Modal */}
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box bg-white max-w-5xl">
                <div className="bg-white shadow p-6 flex flex-wrap items-end gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="text-sm text-gray-600">category</label>
                    <input
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      placeholder="Food, Travel..."
                    />
                  </div>

                  <div className="w-full md:w-1/6">
                    <label className="text-sm text-gray-600">Amount</label>
                    <input
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      placeholder="0"
                    />
                  </div>

                  <div className="w-full md:w-1/6">
                    <label className="text-sm text-gray-600">Icon</label>
                    <input
                      value={form.icon}
                      onChange={(e) =>
                        setForm({ ...form, icon: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      placeholder="💸"
                    />
                  </div>

                  <div className="flex gap-3 ml-auto">
                    <button
                      onClick={handleAdd}
                      disabled={loading}
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus size={16} />{" "}
                      {loading ? "Adding..." : "Add Expense"}
                    </button>
                    <button
                      onClick={() =>
                        setForm({ category: "", amount: "", icon: "" })
                      }
                      className="border px-4 py-2 rounded-lg"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ExpensePage;
