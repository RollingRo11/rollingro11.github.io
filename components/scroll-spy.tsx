"use client"

import { useEffect } from "react"

export default function ScrollSpy() {
  useEffect(() => {
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-link")

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset to trigger slightly before reaching section

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove("active-section")
            if (link.getAttribute("data-section") === sectionId) {
              link.classList.add("active-section")
            }
          })
        }
      })
    }

    window.addEventListener("scroll", handleScroll)

    // Initial check on page load
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return null
}
