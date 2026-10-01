

// // components/Gallery.jsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Navigation, Pagination, Autoplay } from 'swiper/modules'
// import { X } from 'lucide-react'
// import { useLanguage } from '@/context/LanguageContext'
// import { supabase } from '@/lib/supabase'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// // Mapping des catégories : FR/EN -> catégorie interne
// const categoryMap = {
//   'Tout': 'All',
//   'All': 'All',
//   'Construction': 'Construction',
//   'Minier': 'Mining',
//   'Mining': 'Mining',
//   'Électricité': 'Electrical',
//   'Electrical': 'Electrical',
//   'Industriel': 'Industrial',
//   'Industrial': 'Industrial',
//   'Laboratoire': 'Laboratory',
//   'Laboratory': 'Laboratory',
// }

// export default function Gallery() {
//   const { t, language } = useLanguage()
//   const [activeCategory, setActiveCategory] = useState(t.gallery.categories[0])
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [swiperKey, setSwiperKey] = useState(0)
//   const [images, setImages] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Charger les images depuis Supabase
//   useEffect(() => {
//     loadImages()
//   }, [])

//   const loadImages = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('gallery_images')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) throw error
//       setImages(data || [])
//     } catch (error) {
//       console.error('Error loading gallery images:', error)
//       setImages([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Réinitialiser la catégorie active et forcer le re-render du Swiper quand la langue change
//   useEffect(() => {
//     setActiveCategory(t.gallery.categories[0])
//     setSwiperKey(prev => prev + 1)
//   }, [language, t.gallery.categories])

//   // Vérifier si la catégorie active est "Tout" ou "All"
//   const isAllCategory = activeCategory === t.gallery.categories[0]

//   const filteredImages = isAllCategory
//     ? images 
//     : images.filter(img => img.category === categoryMap[activeCategory])

//   return (
//     <section id="gallery" className="py-20 bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           key={language}
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4 text-center">
//             {t.gallery.title}
//           </h2>
//           <p className="text-gray-600 text-lg mb-12 text-center max-w-2xl mx-auto">
//             {t.gallery.subtitle}
//           </p>
//         </motion.div>

//         {/* Filtres */}
//         <div className="flex flex-wrap justify-center gap-2 mb-10">
//           {t.gallery.categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               className={`px-5 py-2 text-sm font-medium transition-all border-l-4 ${
//                 activeCategory === cat
//                   ? 'bg-[#ff6b00] text-white border-[#cc5500] shadow-lg'
//                   : 'bg-white text-gray-600 hover:bg-gray-100 border-transparent'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Loader */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00]"></div>
//           </div>
//         ) : (
//           /* Carousel */
//           <>
//             {filteredImages.length > 0 ? (
//               <Swiper
//                 key={swiperKey}
//                 modules={[Navigation, Pagination, Autoplay]}
//                 spaceBetween={30}
//                 slidesPerView={1}
//                 breakpoints={{
//                   640: { slidesPerView: 2, spaceBetween: 20 },
//                   1024: { slidesPerView: 3, spaceBetween: 30 },
//                 }}
//                 navigation={true}
//                 pagination={{ clickable: true }}
//                 autoplay={{ delay: 4000, disableOnInteraction: false }}
//                 loop={filteredImages.length > 3}
//                 className="!pb-14"
//               >
//                 {filteredImages.map((image) => (
//                   <SwiperSlide key={`${language}-${image.id}`}>
//                     <div 
//                       className="group relative aspect-[4/3] overflow-hidden shadow-lg cursor-pointer border-l-4 border-[#ff6b00]"
//                       onClick={() => setSelectedImage(image.image_url)}
//                     >
//                       <img 
//                         src={image.image_url} 
//                         alt={image.title}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
//                       <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
//                         <span className="text-xs bg-[#ff6b00] px-3 py-1">
//                           {image.category}
//                         </span>
//                         <h3 className="text-lg font-bold mt-2">{image.title}</h3>
//                         {image.description && (
//                           <p className="text-sm text-gray-200">{image.description}</p>
//                         )}
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             ) : (
//               <div className="text-center py-12 text-gray-500 border-l-4 border-[#ff6b00] bg-white">
//                 {t.gallery.noImages}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Lightbox */}
//       {selectedImage && (
//         <div 
//           className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
//           onClick={() => setSelectedImage(null)}
//         >
//           <button 
//             onClick={() => setSelectedImage(null)}
//             className="absolute top-4 right-4 text-white hover:text-[#ff6b00] z-10 transition-colors"
//           >
//             <X className="w-8 h-8" />
//           </button>
//           <img 
//             src={selectedImage} 
//             alt="Preview" 
//             className="max-w-full max-h-[90vh] object-contain border-l-4 border-[#ff6b00]"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </section>
//   )
// }
// components/Gallery.jsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Mapping des catégories : FR/EN/ZH -> catégorie interne
const categoryMap = {
  'Tout': 'All',
  'All': 'All',
  '全部': 'All',
  'Construction': 'Construction',
  '建筑': 'Construction',
  'Minier': 'Mining',
  'Mining': 'Mining',
  '采矿': 'Mining',
  'Électricité': 'Electrical',
  'Electrical': 'Electrical',
  '电气': 'Electrical',
  'Industriel': 'Industrial',
  'Industrial': 'Industrial',
  '工业': 'Industrial',
  'Laboratoire': 'Laboratory',
  'Laboratory': 'Laboratory',
  '实验室': 'Laboratory',
}

export default function Gallery() {
  const { t, language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState(t.gallery.categories[0])
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageData, setSelectedImageData] = useState(null)
  const [swiperKey, setSwiperKey] = useState(0)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  // Charger les images depuis Supabase
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error loading gallery images:', error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  // Réinitialiser la catégorie active quand la langue change
  useEffect(() => {
    setActiveCategory(t.gallery.categories[0])
    setSwiperKey(prev => prev + 1)
  }, [language, t.gallery.categories])

  // Obtenir le titre traduit
  const getTranslatedTitle = (image) => {
    switch(language) {
      case 'en': return image.title_en || image.title_fr || image.title
      case 'zh': return image.title_zh || image.title_fr || image.title
      default: return image.title_fr || image.title
    }
  }

  // Obtenir la description traduite
  const getTranslatedDescription = (image) => {
    switch(language) {
      case 'en': return image.description_en || image.description_fr || image.description || ''
      case 'zh': return image.description_zh || image.description_fr || image.description || ''
      default: return image.description_fr || image.description || ''
    }
  }

  // Obtenir la catégorie traduite
  const getTranslatedCategory = (image) => {
    switch(language) {
      case 'en': return image.category_en || image.category_fr || image.category
      case 'zh': return image.category_zh || image.category_fr || image.category
      default: return image.category_fr || image.category
    }
  }

  // Vérifier si la catégorie active est "Tout" ou "All" ou "全部"
  const isAllCategory = activeCategory === t.gallery.categories[0]

  const filteredImages = isAllCategory
    ? images 
    : images.filter(img => {
        const internalCategory = categoryMap[activeCategory]
        return img.category === internalCategory
      })

  // Ouvrir la lightbox
  const openLightbox = (image) => {
    setSelectedImage(image.image_url)
    setSelectedImageData(image)
  }

  // Fermer la lightbox
  const closeLightbox = () => {
    setSelectedImage(null)
    setSelectedImageData(null)
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          key={language}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4 text-center">
            {t.gallery.title}
          </h2>
          <p className="text-gray-600 text-lg mb-12 text-center max-w-2xl mx-auto">
            {t.gallery.subtitle}
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {t.gallery.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-medium transition-all border-l-4 ${
                activeCategory === cat
                  ? 'bg-[#ff6b00] text-white border-[#cc5500] shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00]"></div>
          </div>
        ) : (
          /* Carousel */
          <>
            {filteredImages.length > 0 ? (
              <Swiper
                key={swiperKey}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={filteredImages.length > 3}
                className="!pb-14"
              >
                {filteredImages.map((image) => (
                  <SwiperSlide key={`${language}-${image.id}`}>
                    <div 
                      className="group relative aspect-[4/3] overflow-hidden shadow-lg cursor-pointer border-l-4 border-[#ff6b00]"
                      onClick={() => openLightbox(image)}
                    >
                      <img 
                        src={image.image_url} 
                        alt={getTranslatedTitle(image)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-xs bg-[#ff6b00] px-3 py-1">
                          {getTranslatedCategory(image)}
                        </span>
                        <h3 className="text-lg font-bold mt-2">
                          {getTranslatedTitle(image)}
                        </h3>
                        {getTranslatedDescription(image) && (
                          <p className="text-sm text-gray-200">
                            {getTranslatedDescription(image)}
                          </p>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-12 text-gray-500 border-l-4 border-[#ff6b00] bg-white">
                {t.gallery.noImages}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-[#ff6b00] z-10 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <img 
            src={selectedImage} 
            alt={selectedImageData ? getTranslatedTitle(selectedImageData) : 'Preview'} 
            className="max-w-full max-h-[75vh] object-contain border-l-4 border-[#ff6b00] mb-6"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Informations de l'image dans la lightbox */}
          {selectedImageData && (
            <div 
              className="max-w-2xl text-center text-white px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="inline-block text-xs bg-[#ff6b00] px-3 py-1 mb-3">
                {getTranslatedCategory(selectedImageData)}
              </span>
              <h3 className="text-xl font-bold mb-2">
                {getTranslatedTitle(selectedImageData)}
              </h3>
              {getTranslatedDescription(selectedImageData) && (
                <p className="text-gray-300 text-sm">
                  {getTranslatedDescription(selectedImageData)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}