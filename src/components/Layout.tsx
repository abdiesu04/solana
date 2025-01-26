import Head from 'next/head';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Solana Token Explorer</title>
        <meta name="description" content="Explore Solana tokens" />
      </Head>
      <div className="min-h-screen bg-gray-950">
        {children}
      </div>
    </>
  );
} 