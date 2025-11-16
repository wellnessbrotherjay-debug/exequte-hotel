import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";

const companyOptions = [
  { id: "1", name: "Exequte Hotel - Main" },
  { id: "2", name: "Exequte Hotel - Resort" },
];

const revenueSeries = [
  { month: "Jan", actual: 85, budget: 80 },
  { month: "Feb", actual: 92, budget: 88 },
  { month: "Mar", actual: 110, budget: 100 },
  { month: "Apr", actual: 120, budget: 112 },
  { month: "May", actual: 132, budget: 125 },
];

const kpis = [
  { label: "Revenue", value: "$1.20M", change: "+12.4%", tone: "pos" as const },
  { label: "Net Profit", value: "$310k", change: "+8.1%", tone: "pos" as const },
  { label: "Operating Margin", value: "26%", change: "+1.3 pts", tone: "pos" as const },
  { label: "Cash Runway", value: "11.3 months", change: "-0.2", tone: "warn" as const },
];

const AppDashboardPage = () => {
  const { user, logout } = useAuth();
  const currentCompany = companyOptions[0];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r flex-col bg-card/40">
        <div className="px-6 py-4 border-b">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Exequte Hotel
          </p>
          <p className="font-semibold">Analytics Hub</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
          <p className="px-2 text-xs font-medium text-muted-foreground uppercase">
            Overview
          </p>
          <Link to="/app">
            <Button variant="ghost" className="w-full justify-start">
              Insights Dashboard
            </Button>
          </Link>
          <p className="mt-4 px-2 text-xs font-medium text-muted-foreground uppercase">
            Data
          </p>
          <Link to={`/company/1/data`}>
            <Button variant="ghost" className="w-full justify-start">
              P&amp;L / Balance Sheet
            </Button>
          </Link>
          <p className="mt-4 px-2 text-xs font-medium text-muted-foreground uppercase">
            Modules
          </p>
          <Link to={`/company/1/analysis`}>
            <Button variant="ghost" className="w-full justify-start">
              KPI Analysis
            </Button>
          </Link>
          <Link to={`/company/1/reports`}>
            <Button variant="ghost" className="w-full justify-start">
              Management Reports
            </Button>
          </Link>
          <Link to={`/company/1/forecast`}>
            <Button variant="ghost" className="w-full justify-start">
              Forecasting
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="border-b px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-lg md:text-xl font-semibold">
              Financial Performance Dashboard
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Accounting and analytics hub for Exequte Hotel.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="text-sm border rounded-md px-3 py-1 bg-background"
              defaultValue={currentCompany.id}
            >
              {companyOptions.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="hidden md:inline text-xs text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 md:px-8 py-6 space-y-6">
          {/* KPI cards */}
          <section className="grid gap-3 md:grid-cols-4">
            {kpis.map(kpi => (
              <Card key={kpi.label} className="border-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-baseline justify-between">
                  <span className="text-lg font-semibold">{kpi.value}</span>
                  <span
                    className={
                      "text-xs font-medium " +
                      (kpi.tone === "pos"
                        ? "text-emerald-500"
                        : kpi.tone === "warn"
                        ? "text-amber-500"
                        : "text-rose-500")
                    }
                  >
                    {kpi.change}
                  </span>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Revenue chart + quick links */}
          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Revenue vs Budget
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Last 5 months · in 000s
                </span>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
                    <YAxis stroke="currentColor" fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="budget"
                      stroke="#64748b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                      name="Budget"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Quick links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  Jump straight into detailed tools:
                </p>
                <div className="space-y-2">
                  <Link to={`/company/1/data`}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Accounting data (P&amp;L, Balance Sheet)
                    </Button>
                  </Link>
                  <Link to={`/company/1/analysis`}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      KPI Explorer
                    </Button>
                  </Link>
                  <Link to={`/company/1/reports`}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Executive report
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tabs */}
          <section>
            <Tabs defaultValue="kpis">
              <TabsList>
                <TabsTrigger value="kpis">KPI table</TabsTrigger>
                <TabsTrigger value="cash">Cash flow</TabsTrigger>
                <TabsTrigger value="growth">Growth matrix</TabsTrigger>
              </TabsList>
              <TabsContent value="kpis" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      KPI overview (mock)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto text-xs">
                    <table className="w-full border-collapse">
                      <thead className="bg-muted/60">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">KPI</th>
                          <th className="px-3 py-2 text-right font-medium">Result</th>
                          <th className="px-3 py-2 text-right font-medium">Target</th>
                          <th className="px-3 py-2 text-right font-medium">Growth vs LY</th>
                          <th className="px-3 py-2 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-3 py-2">RevPAR</td>
                          <td className="px-3 py-2 text-right">$187</td>
                          <td className="px-3 py-2 text-right">$175</td>
                          <td className="px-3 py-2 text-right text-emerald-500">+9.2%</td>
                          <td className="px-3 py-2">On track</td>
                        </tr>
                        <tr className="bg-muted/30">
                          <td className="px-3 py-2">Net Profit Margin</td>
                          <td className="px-3 py-2 text-right">18.6%</td>
                          <td className="px-3 py-2 text-right">17.0%</td>
                          <td className="px-3 py-2 text-right text-emerald-500">+1.1 pts</td>
                          <td className="px-3 py-2">On track</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2">Cash on Hand</td>
                          <td className="px-3 py-2 text-right">$420k</td>
                          <td className="px-3 py-2 text-right">$400k</td>
                          <td className="px-3 py-2 text-right text-amber-500">+2.4%</td>
                          <td className="px-3 py-2">Watch</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="cash" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Cash flow view coming soon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    This tab will host operating, investing, and financing cash flow
                    charts once wired to Supabase.
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="growth" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Growth matrix placeholder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Here we will later render the growth matrix quadrant (EBIT vs
                    operating investment). For now this is explanatory content while
                    you refine layout.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AppDashboardPage;
