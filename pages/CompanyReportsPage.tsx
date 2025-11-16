import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const CompanyReportsPage = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold">
            Management Reports
          </h1>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Report Templates (Coming Soon)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <p>
              This module will provide customizable report templates for
              management and board presentations, including:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Executive summary reports</li>
              <li>Monthly financial packages</li>
              <li>Variance analysis (Actual vs. Budget)</li>
              <li>Year-over-year performance comparisons</li>
              <li>Department-level profitability reports</li>
              <li>Custom report builder with export to PDF/Excel</li>
            </ul>
            <p>
              Once connected to Supabase, you'll be able to generate and
              schedule automated reports.
            </p>
          </CardContent>
        </Card>

        <section className="mt-6">
          <Link to={`/company/${id}`}>
            <Button variant="outline">← Back to Company Hub</Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default CompanyReportsPage;
