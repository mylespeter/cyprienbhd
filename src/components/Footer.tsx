

// 'use client'

// import { useLanguage } from '@/context/LanguageContext'

// export default function Footer() {
//   const { language } = useLanguage()

//   const getLocalizedContent = () => {
//     const translations = {
//       fr: {
//         tagline: 'Génie Civil • Services Miniers • Solutions Industrielles',
//         copyright: `© ${new Date().getFullYear()} SYLWAK INVESTMENT SARL. Tous droits réservés.`
//       },
//       en: {
//         tagline: 'Civil Engineering • Mining Services • Industrial Solutions',
//         copyright: `© ${new Date().getFullYear()} SYLWAK INVESTMENT SARL. All rights reserved.`
//       },
//       zh: {
//         tagline: '土木工程 • 采矿服务 • 工业解决方案',
//         copyright: `© ${new Date().getFullYear()} SYLWAK INVESTMENT SARL. 保留所有权利。`
//       }
//     }

//     return translations[language as keyof typeof translations] || translations.fr
//   }

//   const content = getLocalizedContent()

//   return (
//     <footer className="bg-[#04152e] text-white py-8">
//       <div className="max-w-6xl mx-auto px-4 text-center">
//         <h3 className="text-xl font-bold mb-2">SYLWAK INVESTMENT SARL</h3>
//         <p className="text-blue-200 text-sm mb-4">
//           {content.tagline}
//         </p>
//         <p className="text-blue-300 text-sm">
//           {content.copyright}
//         </p>
//       </div>
//     </footer>
//   )
// }

'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'
import { useRef, useCallback } from 'react'

export default function Footer() {
  const { language } = useLanguage()
  const router = useRouter()
  const clickCount = useRef(0)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getLocalizedContent = () => {
    const translations = {
      fr: {
        tagline: 'Génie Civil • Services Miniers • Solutions Industrielles',
        copyright: `© ${new Date().getFullYear()} SYLWAK INVESTMENT SARL. Tous droits réservés.`
      },
      en: {
        tagline: 'Civil Engineering • Mining Services • Industrial Solutions',
        copyright: `© ${new Date().getFullYear()} SYLWAK INVESTMENT SARL. All rights reserved.`
      },
      zh: {
        tagline: '土木工程 • 采矿服务 • 工业解决方案',
        copyright: `© ${new Date().getFullYear()} SYLWAK INVESTMENT SARL. 保留所有权利。`
      }
    }

    return translations[language as keyof typeof translations] || translations.fr
  }

  const content = getLocalizedContent()

  const handleTitleClick = useCallback(() => {
    clickCount.current += 1
    
    // Réinitialiser le timer à chaque clic
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
    }
    
    // Si on atteint 4 clics, rediriger vers /admin
    if (clickCount.current >= 4) {
      clickCount.current = 0
      router.push('/admin')
      return
    }
    
    // Réinitialiser le compteur après 2 secondes d'inactivité
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 2000)
  }, [router])

  return (
    <footer className="bg-[#04152e] text-white py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 
          className="text-xl font-bold mb-2 cursor-pointer select-none"
          onClick={handleTitleClick}
        >
          SYLWAK INVESTMENT SARL
        </h3>
        <p className="text-blue-200 text-sm mb-4">
          {content.tagline}
        </p>
        <p className="text-blue-300 text-sm">
          {content.copyright}
        </p>
      </div>
    </footer>
  )
}