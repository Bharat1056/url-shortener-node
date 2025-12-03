"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { api, Link } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Calendar, MousePointer, Clock } from "lucide-react";
import { formatDistanceToNow, format, startOfDay, subDays, isSameDay } from "date-fns";
import LinkNext from "next/link";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function LinkStats() {
  const { code } = useParams();
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState<'clicks' | 'uptime'>('clicks');

  const fetchedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!code || fetchedCodeRef.current === code) return;
    fetchedCodeRef.current = code as string;

    const fetchStats = async () => {
      try {
        const data = await api.getLinkStats(code as string);
        setLink(data);
      } catch (err) {
        setError("Failed to load link stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [code]);

  const chartData = useMemo(() => {
    if (!link?.clicks) return [];

    // Create an array of the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return startOfDay(d);
    });

    return last7Days.map((date) => {
      const clicksOnDay = link.clicks?.filter((click) =>
        isSameDay(new Date(click.createdAt), date)
      ).length || 0;

      return {
        date: format(date, "MMM dd"),
        clicks: clicksOnDay,
      };
    });
  }, [link]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        Loading...
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center text-red-500">{error || "Link not found"}</div>
        <div className="text-center mt-4">
          <LinkNext href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </LinkNext>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Link Statistics</h1>
        <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as 'clicks' | 'uptime')}>
          <ToggleGroupItem value="clicks" aria-label="Show clicks">
            Clicks
          </ToggleGroupItem>
          <ToggleGroupItem value="uptime" aria-label="Show uptime">
            Uptime
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <LinkNext href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </LinkNext>
        <p className="text-muted-foreground mt-2">
          Stats for <span className="font-mono font-bold">{link.shortCode}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{link.totalClicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(link.createdAt), "PPP")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Clicked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {link.lastClicked
                ? formatDistanceToNow(new Date(link.lastClicked), { addSuffix: true })
                : "Never"}
            </div>
          </CardContent>
        </Card>
      </div>

      {chartType === 'clicks' ? (
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daily Uptime (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={link.dailyUptime || []}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => format(new Date(value), "MMM dd")}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px" }}
                    formatter={(value: number) => [`${value}%`, "Uptime"]}
                    labelFormatter={(label) => format(new Date(label), "MMM dd, yyyy")}
                  />
                  <Bar
                    dataKey="uptimePercentage"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-green-500"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Uptime History (Last 50 Checks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {link.uptimeChecks?.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>
                      <Badge
                        className={
                          check.status === 'UP'
                            ? "bg-green-500 hover:bg-green-600 border-transparent text-white"
                            : "bg-destructive hover:bg-destructive/90 border-transparent text-white"
                        }
                      >
                        {check.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(check.createdAt), "PP pp")}
                    </TableCell>
                  </TableRow>
                ))}
                {!link.uptimeChecks?.length && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">No uptime checks recorded yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Target URL
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md break-all">
              {link.targetUrl}
              <a
                href={link.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Short Link
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              {`${window.location.origin}/${link.shortCode}`}
              <a
                href={`/${link.shortCode}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
