
'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const links = ['home', 'about', 'services', 'gallery', 'documents', 'contact']

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('#home')
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = links.map(l => `#${l}`)
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.querySelector(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveLink(sections[i])
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    setIsOpen(false)
    setActiveLink(href)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white py-4 border-b border-gray-100'
    }`}>
      
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <button onClick={() => scrollTo('#home')} className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/sylwaklogo.png" alt="Logo" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="text-left">
            <span className="text-xl font-bold text-[#1a3a6b] block leading-tight">
              SYLWAK
            </span>
            <span className="text-[10px] text-gray-400 tracking-wider">
              INVESTMENT SARL
            </span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(`#${link}`)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeLink === `#${link}`
                  ? 'text-[#ff6b00] bg-orange-50'
                  : 'text-gray-600 hover:text-[#ff6b00] hover:bg-gray-50'
              }`}
            >
              {t.nav[link as keyof typeof t.nav]}
              {activeLink === `#${link}` && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#ff6b00] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Bouton langue */}
          <div className="flex gap-1 border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                language === 'fr'
                  ? 'bg-[#1a3a6b] text-white'
                  : 'text-gray-500 hover:text-[#1a3a6b]'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                language === 'en'
                  ? 'bg-[#1a3a6b] text-white'
                  : 'text-gray-500 hover:text-[#1a3a6b]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                language === 'zh'
                  ? 'bg-[#1a3a6b] text-white'
                  : 'text-gray-500 hover:text-[#1a3a6b]'
              }`}
            >
              中文
            </button>
          </div>

          <a 
            href="tel:+243997760063" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff6b00] transition-colors font-medium"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#1a3a6b]" />
            </div>
            +243 997 760 063
          </a>
          
          <button 
            onClick={() => scrollTo('#contact')}
            className="bg-[#ff6b00] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all shadow-md shadow-[#ff6b00]/20 hover:shadow-lg"
          >
            {t.nav.quoteBtn}
          </button>
        </div>

        {/* Mobile button */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Bouton langue mobile */}
          <div className="flex gap-1 border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                language === 'fr'
                  ? 'bg-[#1a3a6b] text-white'
                  : 'text-gray-500'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                language === 'en'
                  ? 'bg-[#1a3a6b] text-white'
                  : 'text-gray-500'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                language === 'zh'
                  ? 'bg-[#1a3a6b] text-white'
                  : 'text-gray-500'
              }`}
            >
              中文
            </button>
          </div>
          
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-xl">
          <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(`#${link}`)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeLink === `#${link}`
                    ? 'text-[#ff6b00] bg-orange-50'
                    : 'text-gray-700 hover:text-[#ff6b00] hover:bg-gray-50'
                }`}
              >
                {t.nav[link as keyof typeof t.nav]}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t space-y-3">
              <a 
                href="tel:+243997760063" 
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1a3a6b] text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                <Phone className="w-4 h-4" />
                +243 997 760 063
              </a>
              
              <button 
                onClick={() => scrollTo('#contact')}
                className="w-full px-4 py-3 bg-[#ff6b00] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                {t.nav.quoteBtn}
              </button>
            </div>

            <div className="pt-4 text-center text-sm text-gray-400 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              {t.nav.location}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}