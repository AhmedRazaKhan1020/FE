"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Plus, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
const API = "https://be-production-4ef6.up.railway.app/income";

const Token = () => localStorage.getItem("token") || "";

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({ source: "", amount: "", icon: "" });
  const [loading, setLoading] = useState(false);

    // redirect if no token
    const router = useRouter();
    if (!Token) {
      router.push("/");
    }

  // load incomes 
  const loadIncomes = async () => {
    try {
      const res = await axios.get(`${API}/`, {
        headers: { credentials: "include", Authorization: `Bearer ${Token()}` },
      });
      setIncomes(res.data || []);
    } catch (err) {
      console.error("Load incomes error:", err);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, []);

  // add income 
  const handleAdd = async () => {
    try {
      setLoading(true);

      await axios.post(`${API}/`, {
        icon: form.icon || "💼",
        amount: Number(form.amount),
        source: form.source,
        date: form.date || new Date().toISOString(),
      },{
        headers: { credentials: "include", Authorization: `Bearer ${Token()}` }
      });

      toast.success("Income added!");
      setForm({ icon: "", amount: "", source: "", date: "" });
      loadIncomes();
    } catch (err) {
      console.error("Add income error:", err);
      toast.error(err.response?.data?.message || "Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  // delete income
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { credentials: "include", Authorization: `Bearer ${Token()}` },
      });
      await loadIncomes();
      toast.success("Income deleted!");
    } catch (err) {
      console.error("Delete income error:", err);
      toast.error(err.response?.data?.message || "Failed to delete income");
    }
  };

  // download income
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
    link.download = "income.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Income file downloaded successfully!");
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error("Couldn't download the file. Please try again.");
  }
  };

  // chart data
  const chartData = incomes.map((i) => ({
    name: new Date(i.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    amount: i.amount,
  }));
 
  return (
    <div className="min-h-screen  text-gray-800">
      <div className="flex">

        {/* Main content */}
        <main className="flex-1 p-6">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium mt-5">Expense Tracker</h2>
          
          </header>

          {/* Chart*/}
          <section className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium">Income Overview</h3>
                <p className="text-sm text-gray-500">
                  Track your earnings over time and analyze your income trends.
                </p>
              </div>
              <button className="btn bg-purple-600 border-none" onClick={() => document.getElementById('my_modal_2').showModal()}><Plus size={16} /> Add Income</button>
            </div>

            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="amount" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Income sources */}
          <section className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Income Sources</h4>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-100 cursor-pointer"
                >
                  <Download size={16} /> Download
                </button>
              </div>

              {/* items list */}
              <div className="grid grid-cols-1 gap-3">
                {incomes.length === 0 && (
                  <div className="text-gray-500 py-6">No incomes yet</div>
                )}

                {incomes.map((inc) => (
                  <div
                    key={inc._id}
                    className="flex items-center justify-between gap-4 border-b pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                        {inc.icon || "💼"}
                      </div>

                      <div>
                        <div className="font-medium">{inc.source}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(inc.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-green-600 font-medium">
                        +${inc.amount}
                      </div>
                      <button
                        onClick={() => handleDelete(inc._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/*form popup */}
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box bg-white max-w-5xl">
                <div
                  id="add-form"
                  className="bg-white  shadow p-6 flex flex-wrap items-end gap-4"
                >
                  <div className="w-full md:w-1/3">
                    <label className="text-sm text-gray-600">Source</label>
                    <input
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      placeholder="Salary, Freelance..."
                    />
                  </div>

                  <div className="w-full md:w-1/6">
                    <label className="text-sm text-gray-600">Amount</label>
                    <input
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      placeholder="0"
                    />
                  </div>

                  <div className="w-full md:w-1/6">
                    <label className="text-sm text-gray-600">Icon (emoji)</label>
                    <input
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                      placeholder="💼"
                    />
                  </div>

                  <div className="flex gap-3 ml-auto">
                    <button
                      onClick={handleAdd}
                      disabled={loading}
                      className="bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus size={16} /> {loading ? "Adding..." : "Add Income"}
                    </button>
                    <button
                      onClick={() => {
                        setForm({ source: "", amount: "", icon: "" });
                      }}
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

export default IncomePage;
