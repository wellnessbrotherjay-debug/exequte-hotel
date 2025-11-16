import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const CompanyDataPage = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold">
            Accounting Data
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
        <Tabs defaultValue="pl">
          <TabsList>
            <TabsTrigger value="pl">P&amp;L</TabsTrigger>
            <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
          </TabsList>

          <TabsContent value="pl" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Profit &amp; Loss (mock)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  This tab will display P&amp;L statements once connected to
                  Supabase. For now, this is a placeholder.
                </p>
                <div className="mt-4 space-y-2 border p-4 rounded">
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span className="font-semibold">$1,200,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COGS</span>
                    <span className="font-semibold">($480,000)</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Gross Profit</span>
                    <span className="font-semibold">$720,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Expenses</span>
                    <span className="font-semibold">($410,000)</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Net Profit</span>
                    <span>$310,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Balance Sheet (mock)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  This tab will display balance sheet data once connected to
                  Supabase. For now, this is a placeholder.
                </p>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 border p-4 rounded">
                    <h3 className="font-semibold text-foreground">Assets</h3>
                    <div className="flex justify-between">
                      <span>Cash</span>
                      <span>$420,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accounts Receivable</span>
                      <span>$150,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fixed Assets</span>
                      <span>$2,300,000</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-foreground">
                      <span>Total Assets</span>
                      <span>$2,870,000</span>
                    </div>
                  </div>
                  <div className="space-y-2 border p-4 rounded">
                    <h3 className="font-semibold text-foreground">
                      Liabilities &amp; Equity
                    </h3>
                    <div className="flex justify-between">
                      <span>Accounts Payable</span>
                      <span>$80,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Long-term Debt</span>
                      <span>$1,200,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equity</span>
                      <span>$1,590,000</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-foreground">
                      <span>Total L&amp;E</span>
                      <span>$2,870,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Import Financial Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload CSV or Excel files with financial data. This is a mock
                  interface – no actual file processing yet.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select File</label>
                  <Input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={e =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
                <Button disabled>Upload (mock only)</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="mt-6">
          <Link to={`/company/${id}`}>
            <Button variant="outline">← Back to Company Hub</Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default CompanyDataPage;
