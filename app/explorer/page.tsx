import BlockchainExplorer from "@/components/blockchain-explorer"

export default function ExplorerPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Blockchain Explorer</h1>
      <BlockchainExplorer />
    </div>
  )
}
