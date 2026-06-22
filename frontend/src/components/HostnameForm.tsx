import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError, generateHostname, type Platform } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** Form over POST /generate/hostname — renders the first-boot hostname script. */
export function HostnameForm() {
  const [platform, setPlatform] = useState<Platform>("linux")
  const [hostname, setHostname] = useState("")

  const mutation = useMutation({
    mutationFn: generateHostname,
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? `${err.status}: ${err.message}` : String(err),
      ),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hostname script</CardTitle>
        <CardDescription>
          POST <code>/generate/hostname</code> → first-boot hostname script.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="grid gap-4 sm:grid-cols-[180px_1fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate({ platform, hostname })
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="hn-platform">Platform</Label>
            <Select
              value={platform}
              onValueChange={(v) => setPlatform(v as Platform)}
            >
              <SelectTrigger id="hn-platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linux">linux</SelectItem>
                <SelectItem value="windows">windows</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hn-hostname">Hostname</Label>
            <Input
              id="hn-hostname"
              placeholder="web01"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Generating…" : "Generate"}
          </Button>
        </form>

        {mutation.data && (
          <pre className="max-h-80 overflow-auto rounded-md bg-muted p-4 text-left text-xs">
            <code>{mutation.data}</code>
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
