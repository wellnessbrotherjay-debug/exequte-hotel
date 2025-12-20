export default function NexusNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/80">
          Return to Home
        </a>
      </div>
    </div>
  );
}
