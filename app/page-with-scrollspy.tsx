import Link from "next/link"
import ScrollSpy from "@/components/scroll-spy"

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left sidebar navigation */}
      <nav className="w-full lg:w-64 lg:fixed lg:h-screen p-6 lg:border-r">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">Portfolio</h1>
          <div className="hidden lg:flex flex-col space-y-4 text-sm">
            <Link href="#about" className="hover:text-gray-500 nav-link" data-section="about">
              About
            </Link>
            <Link href="#research" className="hover:text-gray-500 nav-link" data-section="research">
              Research
            </Link>
            <Link href="#projects" className="hover:text-gray-500 nav-link" data-section="projects">
              Projects
            </Link>
            <Link href="#publications" className="hover:text-gray-500 nav-link" data-section="publications">
              Publications
            </Link>
            <Link href="#talks" className="hover:text-gray-500 nav-link" data-section="talks">
              Talks & Interviews
            </Link>
            <Link href="#contact" className="hover:text-gray-500 nav-link" data-section="contact">
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex lg:hidden space-x-4 overflow-x-auto pb-4 text-sm">
          <Link href="#about" className="whitespace-nowrap hover:text-gray-500">
            About
          </Link>
          <Link href="#research" className="whitespace-nowrap hover:text-gray-500">
            Research
          </Link>
          <Link href="#projects" className="whitespace-nowrap hover:text-gray-500">
            Projects
          </Link>
          <Link href="#publications" className="whitespace-nowrap hover:text-gray-500">
            Publications
          </Link>
          <Link href="#talks" className="whitespace-nowrap hover:text-gray-500">
            Talks
          </Link>
          <Link href="#contact" className="whitespace-nowrap hover:text-gray-500">
            Contact
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-10 lg:ml-64">
        {/* ScrollSpy component to track active section */}
        <ScrollSpy />

        {/* Rest of the content sections remain the same as in page.tsx */}
        {/* ... */}
      </main>
    </div>
  )
}
