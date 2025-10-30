"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

const Dashboard = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
const [token, setToken] = useState(null); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = window.localStorage?.getItem("token");
      if (savedToken) setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return; 

  const api = axios.create({
    baseURL: "https://be-production-4ef6.up.railway.app",
    headers: { Authorization: `Bearer ${token}` },
  });

  const loadData = async () => {
    try {
      const [incRes, expRes] = await Promise.all([
        api.get("/income"),
        api.get("/expense"),
      ]);
      setIncome(incRes.data || []);
      setExpense(expRes.data || []);
    } catch (err) {
      console.error("Data load error:", err);
    }
  };

  
    loadData();
  }, [token]);

  const totalIncome = income.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expense.reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  const incomeData = income.map((i) => ({
    name: new Date(i.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    amount: i.amount,
  }));
  const expenseData = expense.map((i) => ({
    name: new Date(i.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    amount: i.amount,
  }));

  return (
    <div className="min-h-screen mt-5 text-gray-800 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-medium">Finance Dashboard</h1>
      </header>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <TrendingUp size={26} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Income</p>
            <h3 className="text-2xl font-medium">${totalIncome}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <TrendingDown size={26} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expense</p>
            <h3 className="text-2xl font-medium">${totalExpense}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Wallet size={26} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Balance</p>
            <h3 className="text-2xl font-medium">${balance}</h3>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Income Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-medium mb-4 text-green-600">
            Income Trend
          </h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorInc)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-medium mb-4 text-purple-600">
            Expense Trend
          </h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenseData}>
                <defs>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="url(#colorExp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
