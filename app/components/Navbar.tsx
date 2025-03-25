import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg p-4 rounded-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold">Storybook AI</h1>
      <div className="space-x-4">
        <Link href="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
        <Link href="/story" className="text-blue-500 hover:underline">Generate Story</Link>
        <Link href="/profile" className="text-blue-500 hover:underline">Profile</Link>
        <Link href="/auth/login" className="text-red-500 hover:underline">Logout</Link>
      </div>
    </nav>
  );
}
