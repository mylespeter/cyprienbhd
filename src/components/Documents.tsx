

// // components/Documents.jsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Folder, Download, Search, Filter, FileText } from 'lucide-react'
// import { useLanguage } from '@/context/LanguageContext'
// import { supabase } from '@/lib/supabase'

// // Mapping des catégories FR/EN/ZH vers les catégories internes
// const categoryMap: Record<string, string> = {
//   'Tout': 'All',
//   'All': 'All',
//   '全部': 'All',
//   'Entreprise': 'Company',
//   'Company': 'Company',
//   '公司': 'Company',
//   'Légal': 'Legal',
//   'Legal': 'Legal',
//   '法律': 'Legal',
//   'Qualité': 'Quality',
//   'Quality': 'Quality',
//   '质量': 'Quality',
//   'Sécurité': 'Safety',
//   'Safety': 'Safety',
//   '安全': 'Safety',
//   'Technique': 'Technical',
//   'Technical': 'Technical',
//   '技术': 'Technical',
// }

// export default function Documents() {
//   const { t, language } = useLanguage()
//   const [search, setSearch] = useState('')
//   const [activeCategory, setActiveCategory] = useState(t.documents.categories[0])
//   const [documents, setDocuments] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   // Charger les documents depuis Supabase
//   useEffect(() => {
//     loadDocuments()
//   }, [])

//   const loadDocuments = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('documents')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) throw error
//       setDocuments(data || [])
//     } catch (error) {
//       console.error('Error loading documents:', error)
//       // Fallback aux documents par défaut
//       setDocuments([
//         // { id: 1, name: 'Company Profile 2024', type: 'PDF', size: '2.4 MB', category: 'Company', date: '2024-01-15' },
//         // { id: 2, name: 'RCCM Registration', type: 'PDF', size: '1.1 MB', category: 'Legal', date: '2023-06-20' },
//         // { id: 3, name: 'Tax Identification Number', type: 'PDF', size: '0.8 MB', category: 'Legal', date: '2023-06-20' },
//         // { id: 4, name: 'Quality Policy Statement', type: 'PDF', size: '1.5 MB', category: 'Quality', date: '2024-02-10' },
//         // { id: 5, name: 'Safety Manual', type: 'PDF', size: '3.2 MB', category: 'Safety', date: '2024-03-01' },
//         // { id: 6, name: 'Civil Engineering Capabilities', type: 'PDF', size: '4.1 MB', category: 'Technical', date: '2024-01-20' },
//         // { id: 7, name: 'Geotechnical Lab Certifications', type: 'PDF', size: '2.8 MB', category: 'Technical', date: '2024-02-15' },
//         // { id: 8, name: 'Project Portfolio 2023-2024', type: 'PDF', size: '5.6 MB', category: 'Company', date: '2024-04-01' },
//         // { id: 9, name: 'Insurance Certificate', type: 'PDF', size: '0.9 MB', category: 'Legal', date: '2024-01-05' },
//         // { id: 10, name: 'Environmental Policy', type: 'PDF', size: '1.8 MB', category: 'Quality', date: '2024-03-10' },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Réinitialiser la catégorie active quand la langue change
//   useEffect(() => {
//     setActiveCategory(t.documents.categories[0])
//   }, [language, t.documents.categories])

//   // Vérifier si la catégorie active est "Tout" ou "All" ou "全部"
//   const isAllCategory = activeCategory === t.documents.categories[0]

//   const filteredDocs = documents.filter((doc) => {
//     const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase())
//     const matchCategory = isAllCategory || doc.category === categoryMap[activeCategory]
//     return matchSearch && matchCategory
//   })

//   const formatDate = (dateString: string) => {
//     if (!dateString) return ''
//     const locale = language === 'fr' ? 'fr-FR' : language === 'zh' ? 'zh-CN' : 'en-US'
//     return new Date(dateString).toLocaleDateString(locale)
//   }

//   const getLocalizedText = () => {
//     const translations = {
//       fr: {
//         download: 'Télécharger',
//         loading: 'Chargement...',
//         type: 'Type',
//         size: 'Taille',
//         date: 'Date'
//       },
//       en: {
//         download: 'Download',
//         loading: 'Loading...',
//         type: 'Type',
//         size: 'Size',
//         date: 'Date'
//       },
//       zh: {
//         download: '下载',
//         loading: '加载中...',
//         type: '类型',
//         size: '大小',
//         date: '日期'
//       }
//     }
//     return translations[language]
//   }

//   const loc = getLocalizedText()

//   return (
//     <section id="documents" className="py-20 bg-white">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           key={language}
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4 text-center">
//             {t.documents.title}
//           </h2>
//           <p className="text-gray-600 text-lg mb-12 text-center max-w-2xl mx-auto">
//             {t.documents.subtitle}
//           </p>
//         </motion.div>

//         {/* Search & Filters */}
//         <div className="max-w-4xl mx-auto mb-12">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder={t.documents.searchPlaceholder}
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:outline-none focus:border-[#ff6b00] text-lg"
//               />
//             </div>
//             <div className="relative">
//               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <select
//                 value={activeCategory}
//                 onChange={(e) => setActiveCategory(e.target.value)}
//                 className="pl-12 pr-8 py-4 border-2 border-gray-200 focus:outline-none focus:border-[#ff6b00] appearance-none bg-white text-lg cursor-pointer"
//               >
//                 {t.documents.categories.map((cat: string) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Loader */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <div className="w-12 h-12 border-4 border-gray-200 border-t-[#ff6b00] animate-spin mb-4"></div>
//             <p className="text-gray-500">{loc.loading}</p>
//           </div>
//         ) : (
//           <>
//             {/* Documents Grid */}
//             <motion.div
//               layout
//               className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
//             >
//               {filteredDocs.map((doc, index) => (
//                 <motion.div
//                   key={doc.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.05 }}
//                   className="group relative bg-white border-2 border-gray-200 hover:border-[#ff6b00] hover:shadow-xl transition-all duration-300 p-8 flex flex-col"
//                 >
//                   {/* Folder Icon */}
//                   <div className="mb-6 flex justify-center">
//                     <div className="relative">
//                       <Folder className="w-20 h-20 text-[#ff6b00] group-hover:scale-110 transition-transform duration-300" />
//                       <FileText className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//                     </div>
//                   </div>

//                   {/* Document Info */}
//                   <div className="flex-1 text-center mb-6">
//                     <h3 className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#ff6b00] transition-colors mb-3 line-clamp-2">
//                       {doc.name}
//                     </h3>
                    
//                     <div className="flex flex-wrap justify-center gap-2 text-sm">
//                       <span className="bg-red-100 text-red-700 px-3 py-1 font-medium">
//                         {doc.type}
//                       </span>
//                       <span className="bg-gray-100 text-gray-700 px-3 py-1">
//                         {doc.size}
//                       </span>
//                       <span className="bg-gray-100 text-gray-700 px-3 py-1">
//                         {formatDate(doc.created_at || doc.date)}
//                       </span>
//                     </div>

//                     {doc.category && (
//                       <div className="mt-3">
//                         <span className="text-xs text-gray-500 uppercase tracking-wider">
//                           {doc.category}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Download Button */}
//                   <a
//                     href={doc.file_url || `#`}
//                     download
//                     className="w-full flex items-center justify-center space-x-2 bg-[#ff6b00] text-white py-3 px-6 hover:bg-[#cc5500] transition-colors font-medium group/download"
//                   >
//                     <Download className="w-5 h-5 group-hover/download:translate-y-0.5 transition-transform" />
//                     <span>{loc.download}</span>
//                   </a>

//                   {/* Hover Overlay */}
//                   <div className="absolute inset-0 border-l-4 border-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Empty state */}
//             {filteredDocs.length === 0 && (
//               <div className="text-center py-16 text-gray-500">
//                 <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//                 <p className="text-lg">{t.documents.noDocuments}</p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   )
// }


// components/Documents.jsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Folder, Search, Filter, FileText, Eye, X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'

// Mapping des catégories FR/EN/ZH vers les catégories internes
const categoryMap: Record<string, string> = {
  'Tout': 'All',
  'All': 'All',
  '全部': 'All',
  'Entreprise': 'Company',
  'Company': 'Company',
  '公司': 'Company',
  'Légal': 'Legal',
  'Legal': 'Legal',
  '法律': 'Legal',
  'Qualité': 'Quality',
  'Quality': 'Quality',
  '质量': 'Quality',
  'Sécurité': 'Safety',
  'Safety': 'Safety',
  '安全': 'Safety',
  'Technique': 'Technical',
  'Technical': 'Technical',
  '技术': 'Technical',
}

export default function Documents() {
  const { t, language } = useLanguage()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(t.documents.categories[0])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string } | null>(null)
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false)

  // Charger les documents depuis Supabase
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error loading documents:', error)
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  // Réinitialiser la catégorie active quand la langue change
  useEffect(() => {
    setActiveCategory(t.documents.categories[0])
  }, [language, t.documents.categories])

  // Vérifier si la catégorie active est "Tout" ou "All" ou "全部"
  const isAllCategory = activeCategory === t.documents.categories[0]

  const filteredDocs = documents.filter((doc) => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = isAllCategory || doc.category === categoryMap[activeCategory]
    return matchSearch && matchCategory
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const locale = language === 'fr' ? 'fr-FR' : language === 'zh' ? 'zh-CN' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale)
  }

  const handlePreview = (doc: any) => {
    const fileUrl = doc.file_url || '#'
    if (fileUrl && fileUrl !== '#') {
      setPreviewDoc({ url: fileUrl, name: doc.name })
      setIsPreviewLoaded(false)
    }
  }

  const handleOpenInBrowser = () => {
    if (previewDoc) {
      window.open(previewDoc.url, '_blank')
    }
  }

  const closePreview = () => {
    setPreviewDoc(null)
    setIsPreviewLoaded(false)
  }

  const getLocalizedText = () => {
    const translations = {
      fr: {
        preview: 'Prévisualiser',
        loading: 'Chargement...',
        type: 'Type',
        size: 'Taille',
        date: 'Date',
        openInBrowser: 'Ouvrir dans le navigateur',
        closePreview: 'Fermer la prévisualisation',
        previewTitle: 'Prévisualisation du document',
        loadingDocument: 'Chargement du document',
        pleaseWait: 'Veuillez patienter...',
        browserViewer: "Le document s'ouvre dans la visionneuse PDF de votre navigateur"
      },
      en: {
        preview: 'Preview',
        loading: 'Loading...',
        type: 'Type',
        size: 'Size',
        date: 'Date',
        openInBrowser: 'Open in browser',
        closePreview: 'Close preview',
        previewTitle: 'Document preview',
        loadingDocument: 'Loading document',
        pleaseWait: 'Please wait...',
        browserViewer: 'The document opens in your browser PDF viewer'
      },
      zh: {
        preview: '预览',
        loading: '加载中...',
        type: '类型',
        size: '大小',
        date: '日期',
        openInBrowser: '在浏览器中打开',
        closePreview: '关闭预览',
        previewTitle: '文档预览',
        loadingDocument: '文档加载中',
        pleaseWait: '请稍候...',
        browserViewer: '文档在浏览器PDF查看器中打开'
      }
    }
    return translations[language]
  }

  const loc = getLocalizedText()

  return (
    <section id="documents" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          key={language}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4 text-center">
            {t.documents.title}
          </h2>
          <p className="text-gray-600 text-lg mb-12 text-center max-w-2xl mx-auto">
            {t.documents.subtitle}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.documents.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:outline-none focus:border-[#ff6b00] text-lg"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="pl-12 pr-8 py-4 border-2 border-gray-200 focus:outline-none focus:border-[#ff6b00] appearance-none bg-white text-lg cursor-pointer"
              >
                {t.documents.categories.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#ff6b00] animate-spin mb-4"></div>
            <p className="text-gray-500">{loc.loading}</p>
          </div>
        ) : (
          <>
            {/* Documents Grid */}
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white border-2 border-gray-200 hover:border-[#ff6b00] hover:shadow-xl transition-all duration-300 p-8 flex flex-col"
                >
                  {/* Folder Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <Folder className="w-20 h-20 text-[#ff6b00] group-hover:scale-110 transition-transform duration-300" />
                      <FileText className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Document Info */}
                  <div className="flex-1 text-center mb-6">
                    <h3 className="text-lg font-bold text-[#1a3a6b] group-hover:text-[#ff6b00] transition-colors mb-3 line-clamp-2">
                      {doc.name}
                    </h3>
                    
                    <div className="flex flex-wrap justify-center gap-2 text-sm">
                      <span className="bg-red-100 text-red-700 px-3 py-1 font-medium">
                        {doc.type || 'PDF'}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1">
                        {doc.size || 'N/A'}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1">
                        {formatDate(doc.created_at || doc.date)}
                      </span>
                    </div>

                    {doc.category && (
                      <div className="mt-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                          {doc.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Preview Button */}
                  <button
                    onClick={() => handlePreview(doc)}
                    disabled={!doc.file_url || doc.file_url === '#'}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-6 transition-colors font-medium group/preview ${
                      doc.file_url && doc.file_url !== '#'
                        ? 'bg-[#ff6b00] text-white hover:bg-[#cc5500]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Eye className="w-5 h-5 group-hover/preview:scale-110 transition-transform" />
                    <span>{loc.preview}</span>
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 border-l-4 border-[#ff6b00] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty state */}
            {filteredDocs.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">{t.documents.noDocuments}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* PDF Preview Modal intégré directement */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {previewDoc.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {loc.previewTitle}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton pour ouvrir dans le navigateur */}
                <button
                  onClick={handleOpenInBrowser}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title={loc.openInBrowser}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="hidden sm:inline">{loc.openInBrowser}</span>
                </button>
                
                {/* Bouton de fermeture */}
                <button
                  onClick={closePreview}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                  title={loc.closePreview}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content - iframe pour le PDF */}
            <div className="flex-1 overflow-hidden relative">
              <iframe
                src={previewDoc.url}
                className="w-full h-full border-0"
                onLoad={() => setIsPreviewLoaded(true)}
                title={`Prévisualisation de ${previewDoc.name}`}
              />
              
              {!isPreviewLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <div className="text-center">
                    <p className="text-gray-700 font-medium">{loc.loadingDocument}</p>
                    <p className="text-gray-500 text-sm">{loc.pleaseWait}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-center text-sm text-gray-600">
                <p>{loc.browserViewer}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}