import { HealthBadge } from "@/components/HealthBadge"
import { HostnameForm } from "@/components/HostnameForm"

function App() {
  return (
    <div className="mx-auto min-h-svh max-w-3xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">EC-PKI-Lab</h1>
          <p className="text-sm text-muted-foreground">
            Web console over the vmkit / configgen / isokit deployment API.
          </p>
        </div>
        <HealthBadge />
      </header>

      <main className="space-y-6">
        <HostnameForm />
      </main>
    </div>
  )
}

export default App
