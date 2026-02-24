export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} ilionx.{" "}
              <span className="font-light italic">experts in eenvoud</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo application built with Next.js & Spring Boot
          </p>
        </div>
      </div>
    </footer>
  );
}
