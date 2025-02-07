"use client";

import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { client } from "@/sanity/lib/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashboardCharts = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    orders: number[];
    revenue: number[];
    statusCount: { pending: number; dispatch: number; success: number };
  }>({
    labels: [],
    orders: [],
    revenue: [],
    statusCount: { pending: 0, dispatch: 0, success: 0 },
  });

  // State for theme toggle (dark/light mode)
  const [theme, setTheme] = useState<string>("light");

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme); // Save preference to localStorage
      return newTheme;
    });
  };

  useEffect(() => {
    // Get the saved theme from localStorage on initial load
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    client
      .fetch(`*[_type == "rent"]{ orderDate, total, status }`)
      .then((data) => {
        const ordersByDate: { [key: string]: number } = {};
        const revenueByDate: { [key: string]: number } = {};
        const statusCount = { pending: 0, dispatch: 0, success: 0 };

        data.forEach((order: any) => {
          const date = new Date(order.orderDate).toLocaleDateString();
          ordersByDate[date] = (ordersByDate[date] || 0) + 1;
          revenueByDate[date] = (revenueByDate[date] || 0) + order.total;

          if (order.status) {
            statusCount[order.status as keyof typeof statusCount]++;
          }
        });

        setChartData({
          labels: Object.keys(ordersByDate),
          orders: Object.values(ordersByDate),
          revenue: Object.values(revenueByDate),
          statusCount,
        });
      })
      .catch((error) => console.error("Error fetching chart data:", error));
  }, []);

  return (
    <div className={`transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full"
      >
        Toggle Theme
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Bar Chart - Orders Per Day */}
        <div className={`p-6 shadow-lg rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-bold mb-2">Orders Per Day</h3>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Orders",
                  data: chartData.orders,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
          />
        </div>

        {/* Line Chart - Revenue Over Time */}
        <div className={`p-6 shadow-lg rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-bold mb-2">Revenue Over Time</h3>
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: "Revenue ($)",
                  data: chartData.revenue,
                  borderColor: "rgb(75, 192, 192)",
                  fill: true,
                },
              ],
            }}
          />
        </div>

        {/* Pie Chart - Order Status */}
        <div className={`p-6 shadow-lg rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-bold mb-2">Order Status</h3>
          <Pie
            data={{
              labels: ["Pending", "Dispatch", "Success"],
              datasets: [
                {
                  data: [
                    chartData.statusCount.pending,
                    chartData.statusCount.dispatch,
                    chartData.statusCount.success,
                  ],
                  backgroundColor: ["#facc15", "#3b82f6", "#22c55e"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
