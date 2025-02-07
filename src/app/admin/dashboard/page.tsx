"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import {
  FiHome,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiBarChart,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import Link from "next/link";

interface Rent {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: { name: string; image: string }[];
}

export default function AdminDashboard() {
  const [rent, setRent] = useState<Rent[]>([]);
  const [selectedRentId, setSelectedRentId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "rent"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zipCode,
          total,
          discount,
          orderDate,
          status,
          cartItems[]-> {
            name,
            image
          }
        }`
      )
      .then((data) => setRent(data))
      .catch((error) => console.error("Error fetching orders:", error));

    // Load theme from local storage if set
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkTheme(true);
    }
  }, []);

  const filteredRent =
    filter === "All" ? rent : rent.filter((rent) => rent.status === filter);

  const toggleRentDetails = (rentId: string) => {
    setSelectedRentId((prev) => (prev === rentId ? null : rentId));
  };

  const handleStatusChange = async (rentId: string, newStatus: string) => {
    try {
      await client.patch(rentId).set({ status: newStatus }).commit();
      setRent((prevRent) =>
        prevRent.map((rent) =>
          rent._id === rentId ? { ...rent, status: newStatus } : rent
        )
      );

      Swal.fire(
        newStatus === "dispatch" ? "Dispatch" : "Success",
        `The order is now ${newStatus === "dispatch" ? "dispatched" : "completed"}.`,
        "success"
      );
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Something went wrong while updating status.", "error");
    }
  };

  const handleDelete = async (rentId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(rentId);
      setRent((prevRent) => prevRent.filter((rent) => rent._id !== rentId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <ProtectedRoute>
      <div className={`flex h-screen ${isDarkTheme ? "bg-gray-900" : "bg-gray-100"}`}>
        {/* Sidebar */}
        <aside
          className={`${
            isDarkTheme ? "bg-blue-800 text-white" : "bg-blue-400 text-white"
          } w-64 p-6 shadow-lg flex flex-col space-y-4`}
        >
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <Link
            href="/admin/charts"
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-white hover:bg-white hover:text-blue-600"
          >
            <FiBarChart /> Analytics
          </Link>

          {[{ status: "All", icon: <FiHome /> },
            { status: "pending", icon: <FiClock /> },
            { status: "dispatch", icon: <FiTruck /> },
            { status: "success", icon: <FiCheckCircle /> }].map(({ status, icon }) => (
            <button
              key={status}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                filter === status ? "bg-white text-blue-600 font-bold" : "text-white"
              }`}
              onClick={() => setFilter(status)}
            >
              {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 mt-6 rounded-lg text-white hover:bg-white hover:text-blue-600 transition-all"
          >
            {isDarkTheme ? <FiSun /> : <FiMoon />} Toggle Theme
          </button>
        </aside>

        {/* Orders Table */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Orders</h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className={`${isDarkTheme ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-700"}`}>
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRent.map((rent) => (
                  <React.Fragment key={rent._id}>
                    <tr
                      className="cursor-pointer hover:bg-blue-50 transition-all duration-200"
                      onClick={() => toggleRentDetails(rent._id)}
                    >
                      <td className="p-3">{rent._id}</td>
                      <td className="p-3">{rent.firstName} {rent.lastName}</td>
                      <td className="p-3">{rent.address}</td>
                      <td className="p-3">{new Date(rent.orderDate).toLocaleDateString()}</td>
                      <td className="p-3 font-semibold text-green-700">${rent.total}</td>
                      <td className="p-3">
                        <select
                          value={rent.status || ""}
                          onChange={(e) => handleStatusChange(rent._id, e.target.value)}
                          className="bg-gray-100 p-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Completed</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => handleDelete(rent._id, e)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                    {selectedRentId === rent._id && (
                      <tr>
                        <td colSpan={7} className="bg-blue-50 p-6 transition-all duration-200">
                          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h3>
                          <p className="mb-2">
                            <strong className="text-gray-600">Phone:</strong>
                            <span className="text-gray-600">{rent.phone}</span>
                          </p>
                          <p className="mb-2">
                            <strong className="text-gray-600">Email:</strong>
                            <span className="text-gray-600">{rent.email}</span>
                          </p>
                          <p className="mb-2">
                            <strong className="text-gray-600">City:</strong>
                            <span className="text-gray-600">{rent.city}</span>
                          </p>
                          <ul className="space-y-3">
                            {rent.cartItems.length > 0 ? (
                              rent.cartItems.map((item, index) => (
                                <li key={`${rent._id}-${index}`} className="flex items-center gap-3 p-3 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-all">
                                  <span className="flex-1 text-gray-700">{item.name}</span>
                                  {item.image ? (
                                    <Image
                                      src={urlFor(item.image).url()}
                                      width={100}
                                      height={100}
                                      alt={item.name}
                                      className="rounded-md"
                                    />
                                  ) : (
                                    <span className="text-gray-500">No image</span>
                                  )}
                                </li>
                              ))
                            ) : (
                              <li>No items in this order</li>
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
