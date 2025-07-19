"use client";

import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { apiFetch } from "@/lib/apiFetch";
import { feature } from "topojson-client";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

type CountryView = {
  id: string; // ISO 3166-1 alpha-2 (not used here but can be)
  name: string;
  views: number;
};

function Legend({
  data,
  colorScale,
}: {
  data: CountryView[];
  colorScale: (v: number) => string;
}) {
  // Sort descending and take top 5 (or fewer if less)
  const topData = [...data].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="flex flex-col gap-1 mt-4 mx-auto w-64 select-none text-sm">
      <span className="mb-2 font-semibold">Top Countries by Views</span>
      {topData.map(({ name, views }) => (
        <div key={name} className="flex items-center gap-2">
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: colorScale(views),
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <span>{name}</span>
          <span className="ml-auto font-mono">{views.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function WorldViewMap() {
  const [data, setData] = useState<CountryView[]>([]);
  const [geographies, setGeographies] = useState<any[]>([]);
  const [tooltipContent, setTooltipContent] = useState<string>("");

  useEffect(() => {
    apiFetch("/api/dashboard/total-view-country")
      .then((rawData) => {
        // rawData is already an array [{id, name, views}, ...]
        const transformedData = rawData.map((item: any) => ({
          id: item.id.toUpperCase() || "",
          name: item.name || "",
          views: Number(item.views) || 0,
        }));

        setData(transformedData);
      })
      .catch((err) => {
        console.error("Failed to load view data", err);
      });
  }, []);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((topology) => {
        const geojson = feature(topology, topology.objects.countries) as any;
        const features =
          geojson.type === "FeatureCollection" ? geojson.features : [geojson];
        setGeographies(features);
      })
      .catch((err) => {
        console.error("Failed to load map data", err);
      });
  }, []);

  const maxViews = Math.max(...data.map((d) => d.views), 0);
  const colorScale = scaleLinear<string>()
    .domain([0, maxViews * 0.33, maxViews * 0.66, maxViews])
    .range(["#e0e0e0", "#8000ff", "#ff00ff", "#ff0077"]);

  // Map country name to views for lookup
  const viewMap = Object.fromEntries(data.map((d) => [d.name, d.views]));

  return (
    <div className="w-full relative">
      {tooltipContent && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "6px 10px",
            borderRadius: 4,
            pointerEvents: "none",
            fontSize: 14,
            zIndex: 10,
          }}
        >
          {tooltipContent}
        </div>
      )}

      <div className="w-full h-[500px]">
        <ComposableMap projection="geoMercator" data-tip="">
          <Geographies geography={geographies}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name || "";
                const views = viewMap[countryName] || 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={colorScale(views)}
                    stroke="#fff"
                    onMouseEnter={() =>
                      setTooltipContent(
                        `${countryName}: ${views.toLocaleString()} views`
                      )
                    }
                    onMouseLeave={() => setTooltipContent("")}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        fill: "#ffcc00",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend below the map */}
      <Legend data={data} colorScale={colorScale} />
    </div>
  );
}
