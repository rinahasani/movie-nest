"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { useTranslations } from "next-intl";
import { title } from "process";

const BudgetVsRevenueBarChart = ({ budget, revenue }) => {
  const t = useTranslations("budgetVsRevenueChart");
  const data = [
    { name: t("budget"), value: budget || 0 },
    { name: t("revenue"), value: revenue || 0 },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 100, left: 20, bottom: 20 }}
          barSize={40}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === t("budget") ? "#E6E4E3" : "var(--base-color)"}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value) => `$${value.toLocaleString()}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetVsRevenueBarChart;
