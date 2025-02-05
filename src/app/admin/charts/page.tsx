"use client";

import React from "react";
import DashboardCharts from "@/app/components/Charts";

export default function ChartsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Charts</h2>
      <DashboardCharts />
    </div>
  );
}
