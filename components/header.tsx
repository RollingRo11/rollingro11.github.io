import Link from "next/link"

export default function Header() {
  return (
    <header className="flex items-center justify-between p-6 border-b">
      <div className="text-2xl font-bold">Portfolio</div>
      <nav className="hidden md:flex space-x-6">
        <Link href="#about" className="text-sm hover:text-gray-500">
          About
        </Link>
        <Link href="#research" className="text-sm hover:text-gray-500">
          Research
        </Link>
        <Link href="#projects" className="text-sm hover:text-gray-500">
          Projects
        </Link>
        <Link href="#publications" className="text-sm hover:text-gray-500">
          Publications
        </Link>
        <Link href="#talks" className="text-sm hover:text-gray-500">
          Talks
        </Link>
        <Link href="#contact" className="text-sm hover:text-gray-500">
          Contact
        </Link>
      </nav>
    </header>
  )
}
