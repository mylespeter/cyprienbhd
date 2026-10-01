

// components/Partners.jsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'

interface Partner {
  id?: number
  name: string
  logo: string
  website?: string
  created_at?: string
}

export default function Partners() {
  const { t } = useLanguage()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      
      if (data && data.length > 0) {
        setPartners(data)
      } else {
        // Partners par défaut
        setPartners([
          { id: 1, name: 'Bureau Veritas', logo: '/partners/bureau-veritas.png', website: 'https://www.bureauveritas.com' },
          { id: 2, name: 'SGS', logo: '/partners/sgs.png', website: 'https://www.sgs.com' },
          { id: 3, name: 'ALS', logo: '/partners/als.png', website: 'https://www.alsglobal.com' },
          { id: 4, name: 'Intertek', logo: '/partners/intertek.png', website: 'https://www.intertek.com' },
          { id: 5, name: 'Eurofins', logo: '/partners/eurofins.png', website: 'https://www.eurofins.com' },
          { id: 6, name: 'TÜV SÜD', logo: '/partners/tuv-sud.png', website: 'https://www.tuvsud.com' },
        ])
      }
    } catch (error) {
      console.error('Error loading partners:', error)
    } finally {
      setLoading(false)
    }
  }

  // Doubler les partenaires pour un défilement infini fluide
  const duplicatedPartners = [...partners, ...partners, ...partners]

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 rounded-full border-gray-200 border-t-[#ff6b00] animate-spin"></div>
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) return null

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b] mb-2">
            {t.partners?.title || 'Ils nous font confiance'}
          </h2>
          <p className="text-gray-600 text-sm">
            {t.partners?.subtitle || 'Nos partenaires de confiance'}
          </p>
        </motion.div>

        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Infinite sliding container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-12 items-center"
              animate={{
                x: ['0%', '-50%']
              }}
              transition={{
                duration: 25,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{
                width: 'fit-content',
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex flex-col items-center flex-shrink-0 group min-w-[120px]"
                >
                  {/* Wrapper with conditional link */}
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-24 h-24  rounded-full  flex items-center justify-center p-4 group-hover:bg-white transition-all duration-300 hover:scale-110 cursor-pointer"
                      title={`Visiter le site de ${partner.name}`}
                    >
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full object-contain hover:grayscale-s  transition-all duration-300"
                          onError={(e) => {
                            // Fallback si l'image ne charge pas
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              const fallback = document.createElement('span')
                              fallback.className = 'text-2xl font-bold text-[#1a3a6b]'
                              fallback.textContent = partner.name.charAt(0)
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      ) : (
                        <span className="text-2xl font-bold text-[#1a3a6b]">
                          {partner.name.charAt(0)}
                        </span>
                      )}
                    </a>
                  ) : (
                    <div className="w-24 h-24  rounded-full  flex items-center justify-center p-4 group-hover:bg-white transition-all duration-300">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full object-contain hover:grayscale-  transition-all duration-300"
                          onError={(e) => {
                            // Fallback si l'image ne charge pas
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              const fallback = document.createElement('span')
                              fallback.className = 'text-2xl font-bold text-[#1a3a6b]'
                              fallback.textContent = partner.name.charAt(0)
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      ) : (
                        <span className="text-2xl font-bold text-[#1a3a6b]">
                          {partner.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Partner name with optional link */}
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-gray-700 mt-2 text-center whitespace-nowrap group-hover:text-[#ff6b00] transition-colors hover:underline"
                    >
                      {partner.name}
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-gray-700 mt-2 text-center whitespace-nowrap group-hover:text-[#ff6b00] transition-colors">
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}