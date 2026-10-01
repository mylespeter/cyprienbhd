// app/services/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Building2, Route as Road, HardHat, FlaskConical, 
  Wrench, Zap, Package, Truck, ArrowLeft, CheckCircle,
  Image as ImageIcon, X, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin
} from 'lucide-react'

const iconMap = {
  'Building2': Building2,
  'Road': Road,
  'HardHat': HardHat,
  'FlaskConical': FlaskConical,
  'Wrench': Wrench,
  'Zap': Zap,
  'Package': Package,
  'Truck': Truck,
  'default': Wrench
}

export default function ServiceDetailPage() {
  const { id } = useParams()
  const { language, t } = useLanguage()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    loadService()
  }, [id])

  const loadService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          translations:service_translations(*),
          images:service_images(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      
      // Parser les features JSONB
      const parsedService = {
        ...data,
        translations: data.translations.map(trans => ({
          ...trans,
          features: typeof trans.features === 'string' 
            ? JSON.parse(trans.features) 
            : trans.features || []
        })),
        images: data.images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      }
      
      setService(parsedService)
    } catch (error) {
      console.error('Error loading service:', error)
      setService(null)
    } finally {
      setLoading(false)
    }
  }

  // Obtenir la traduction dans la langue actuelle
  const getCurrentTranslation = () => {
    if (!service) return null
    const translation = service.translations.find(trans => trans.language === language)
    return translation || service.translations[0]
  }

  // Obtenir l'alt text d'une image dans la langue actuelle
  const getImageAlt = (image) => {
    if (!image) return ''
    switch(language) {
      case 'en': return image.alt_text_en || image.alt_text_fr || ''
      case 'zh': return image.alt_text_zh || image.alt_text_fr || ''
      default: return image.alt_text_fr || ''
    }
  }

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || iconMap['default']
    return <IconComponent className="w-16 h-16" />
  }

  const openLightbox = (index) => {
    setCurrentImageIndex(index)
    setSelectedImage(service.images[index].image_url)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = (e) => {
    e.stopPropagation()
    const nextIndex = (currentImageIndex + 1) % service.images.length
    setCurrentImageIndex(nextIndex)
    setSelectedImage(service.images[nextIndex].image_url)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    const prevIndex = (currentImageIndex - 1 + service.images.length) % service.images.length
    setCurrentImageIndex(prevIndex)
    setSelectedImage(service.images[prevIndex].image_url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full border-t-[#ff6b00] animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'fr' ? 'Chargement...' : language === 'en' ? 'Loading...' : '加载中...'}</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'fr' ? 'Service non trouvé' : language === 'en' ? 'Service not found' : '未找到服务'}
          </h2>
          <Link 
            href="/#services"
            className="inline-flex items-center gap-2 bg-[#ff6b00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'fr' ? 'Retour aux services' : language === 'en' ? 'Back to services' : '返回服务'}
          </Link>
        </div>
      </div>
    )
  }

  const translation = getCurrentTranslation()
  if (!translation) return null

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a3a6b] via-[#1a3a6b] to-[#0f2440] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff6b00] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff6b00] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <Link 
            href="/#services"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#ff6b00] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="border-b border-transparent group-hover:border-[#ff6b00] transition-all">
              {language === 'fr' ? 'Retour aux services' : language === 'en' ? 'Back to services' : '返回服务'}
            </span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <motion.div 
                className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#ff6b00] border border-white/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {getIcon(service.icon)}
              </motion.div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {translation.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                  {translation.description}
                </p>
                {service.category && (
                  <span className="inline-block mt-6 bg-[#ff6b00]/20 backdrop-blur-sm text-[#ff6b00] px-6 py-2 rounded-full text-sm font-semibold border border-[#ff6b00]/30">
                    {service.category}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Description détaillée */}
      {translation.detailed_description && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-[#ff6b00]"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b]">
                  {language === 'fr' ? 'Description détaillée' : language === 'en' ? 'Detailed Description' : '详细描述'}
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700 leading-relaxed text-lg bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-200">
                {translation.detailed_description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Caractéristiques */}
      {translation.features && translation.features.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-[#ff6b00]"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b]">
                  {language === 'fr' ? 'Caractéristiques principales' : language === 'en' ? 'Key Features' : '主要特点'}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {translation.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-200 hover:border-[#ff6b00] hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 bg-[#ff6b00]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff6b00] group-hover:text-white transition-all">
                      <CheckCircle className="w-5 h-5 text-[#ff6b00] group-hover:text-white" />
                    </div>
                    <span className="text-gray-800 font-medium text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Galerie d'images */}
      {service.images && service.images.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-[#ff6b00]"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b]">
                  {language === 'fr' ? 'Galerie du service' : language === 'en' ? 'Service Gallery' : '服务图库'}
                </h2>
                <span className="text-gray-400 text-lg">({service.images.length} {language === 'fr' ? 'images' : language === 'en' ? 'images' : '图片'})</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {service.images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={image.image_url}
                      alt={getImageAlt(image)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="absolute top-6 left-6 text-white/80 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {service.images.length}
          </div>
          
          {service.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 md:left-8 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm group"
              >
                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 md:right-8 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm group"
              >
                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}
          
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt={getImageAlt(service.images[currentImageIndex])}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a3a6b] via-[#1a3a6b] to-[#0f2440] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6b00] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff6b00] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === 'fr' ? 'Intéressé par ce service ?' : language === 'en' ? 'Interested in this service?' : '对此服务感兴趣？'}
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {language === 'fr' ? 'Contactez-nous dès aujourd\'hui pour discuter de votre projet et obtenir un devis personnalisé.' : 
               language === 'en' ? 'Contact us today to discuss your project and get a personalized quote.' : 
               '立即联系我们讨论您的项目并获取个性化报价。'}
            </p>
            
            <Link
              href="/#contact"
              className="group bg-[#ff6b00] text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-2 text-lg"
            >
              <Mail className="w-5 h-5" />
              {language === 'fr' ? 'Demander un devis' : language === 'en' ? 'Request a Quote' : '请求报价'}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}