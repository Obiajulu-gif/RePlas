import { redirect } from "next/navigation"

export default function ProducerDashboardPage() {
  // Redirect to QR generator for now
  redirect("/producer/qr-generator")
}
