

// 'use client'

// import { motion } from 'framer-motion'
// import { CheckCircle } from 'lucide-react'
// import { useLanguage } from '@/context/LanguageContext'

// export default function About() {
//   const { t } = useLanguage()

//   return (
//     <section id="about" className="section">
//       <div className="container">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-6">
//               {t.about.title}
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {t.about.description}
//             </p>
//             <div className="space-y-3">
//               {t.about.items.map((item, i) => (
//                 <div key={i} className="flex items-center space-x-3">
//                   <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
//                   <span className="text-gray-700">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="bg-gray-200 rounded-xl h-80 md:h-96 overflow-hidden"
//           >
//             <div 
//               className="w-full h-full bg-cover bg-center"
//               style={{
//                 backgroundImage: "url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800')"
//               }}
//             />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }

// components/About.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'

type SiteImage = {
  id: number
  section: string
  image_key: string
  image_url: string
  alt_text_fr: string
  alt_text_en: string
  alt_text_zh: string
}

export default function About() {
  const { t, language } = useLanguage()
  const [aboutImage, setAboutImage] = useState<SiteImage | null>(null)

  useEffect(() => {
    loadAboutImage()
  }, [])

  const loadAboutImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', 'about')
        .eq('image_key', 'about_main')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data) setAboutImage(data)
    } catch (error) {
      console.error('Error loading about image:', error)
    }
  }

  const getImageUrl = (): string => {
    return aboutImage?.image_url || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'
  }

  const getImageAlt = (): string => {
    if (!aboutImage) return 'About us'
    switch(language) {
      case 'en': return aboutImage.alt_text_en || aboutImage.alt_text_fr || 'About us'
      case 'zh': return aboutImage.alt_text_zh || aboutImage.alt_text_fr || '关于我们'
      default: return aboutImage.alt_text_fr || 'À propos de nous'
    }
  }

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-6">
              {t.about.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {t.about.description}
            </p>
            <div className="space-y-3">
              {t.about.items.map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-200 rounded-xl h-80 md:h-96 overflow-hidden"
          >
            <img 
              src={getImageUrl()}
              alt={getImageAlt()}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}