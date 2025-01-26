import TokenGrid from '../components/TokenGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Solana Token Explorer
        </h1>
        <TokenGrid />
      </div>
    </main>
  );
} 