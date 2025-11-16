import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const CompanyHomePage = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold">Company Hub</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Company ID: {id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-muted-foreground">
            {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="px-4 md:px-8 py-6 space-y-6">
        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                KPI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Explore key performance indicators and metrics.
              </p>
              <Link to={`/company/${id}/analysis`}>
                <Button size="sm" className="w-full">
                  Open Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Reporting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Generate management and executive reports.
              </p>
              <Link to={`/company/${id}/reports`}>
                <Button size="sm" className="w-full">
                  Open Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Build 3-way forecast models.
              </p>
              <Link to={`/company/${id}/forecast`}>
                <Button size="sm" className="w-full">
                  Open Forecast
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section>
          <Link to={`/company/${id}/data`}>
            <Button>View Accounting Data (P&amp;L / Balance Sheet)</Button>
          </Link>
        </section>

        <section className="mt-6">
          <Link to="/app">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default CompanyHomePage;
