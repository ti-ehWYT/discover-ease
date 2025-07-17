"use client";

import { TrendingUp } from "lucide-react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";

export default function LikesOverTimeByCountry() {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchLikesData = async () => {
            try {
                const res = await fetch("/api/dashboard/likes-over-time-by-country");
                if (!res.ok) throw new Error("Failed to fetch likes over time");
                const data = await res.json();
                setChartData(data);
            } catch (error) {
                console.error(error);
            }

        };

        fetchLikesData();
    }, []);

    // Extract country names from first data point to generate line colors and labels
    const countryKeys = chartData.length > 0
        ? Object.keys(chartData[0]).filter((key) => key !== "date")
        : [];

    const colors = [
        "#3b82f6",
        "#f97316",
        "#10b981",
        "#8b5cf6",
        "#ef4444",
        "#22c55e",
        "#eab308",
        "#ec4899",
        "#14b8a6",
        "#facc15",
    ];

    return (
        <div className="bg-white dark:bg-muted rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-1 text-center">Trend of like counts</h2>
            <p className="text-sm text-muted-foreground mb-4 text-center">
                (By Country)
            </p>
            <ResponsiveContainer width="100%" height={320}>
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 24, left: -30, bottom: 32 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={6} />
                    <YAxis tick={{ fontSize: 12 }} tickMargin={6} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {countryKeys.map((country, idx) => (
                        <Line
                            key={country}
                            type="monotone"
                            dataKey={country}
                            stroke={colors[idx % colors.length]}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-2 leading-none font-medium ">
                Trending engagement by country <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
                Daily like count across multiple countries
            </div>
        </div>
    );
}
