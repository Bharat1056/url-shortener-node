"use client";

import { useEffect, useState } from "react";
import { api, SystemStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Link as LinkIcon, Server } from "lucide-react";

export function StatsCards() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [totalLinks, setTotalLinks] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sysStats, linksData] = await Promise.all([
          api.getSystemStats(),
          api.getLinks(1, 1), // Fetch 1 link just to get the total count
        ]);
        setStats(sysStats);
        setTotalLinks(linksData.pagination.total);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-1/2 rounded bg-gray-300 dark:bg-gray-700 mb-2" />
            <div className="h-3 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Links</CardTitle>
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLinks}</div>
          <p className="text-xs text-muted-foreground">
            Active shortened URLs
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.uptime.formatted || "-"}</div>
          <p className="text-xs text-muted-foreground">
            Since {stats?.uptime.startTime ? new Date(stats.uptime.startTime).toLocaleDateString() : "-"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Database Status</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.database.connected ? (
              <span className="text-green-500">Connected</span>
            ) : (
              <span className="text-red-500">Disconnected</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Response time: {stats?.database.responseTime || "-"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Server Status</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.ok ? (
              <span className="text-green-500">Healthy</span>
            ) : (
              <span className="text-red-500">Unhealthy</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            API Version 1.0.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
