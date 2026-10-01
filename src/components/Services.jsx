

// // // components/Services.jsx
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { motion } from 'framer-motion'
// // import { useLanguage } from '@/context/LanguageContext'
// // import { supabase } from '@/lib/supabase'
// // import { 
// //   Building2,Route as Road, HardHat, FlaskConical, 
// //   Wrench, Zap, Package, Truck, Plus, Trash2, Edit3
// // } from 'lucide-react'

// // interface Service {
// //   id?: number
// //   title: string
// //   description: string
// //   icon: string
// //   category: string
// //   created_at?: string
// // }

// // // Mapping des icônes Lucide
// // const iconMap: Record<string, any> = {
// //   'Building2': Building2,
// //   'Road': Road,
// //   'HardHat': HardHat,
// //   'FlaskConical': FlaskConical,
// //   'Wrench': Wrench,
// //   'Zap': Zap,
// //   'Package': Package,
// //   'Truck': Truck,
// //   'default': Wrench
// // }

// // export default function Services() {
// //   const { t } = useLanguage()
// //   const [services, setServices] = useState<Service[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [isAdmin, setIsAdmin] = useState(false)
// //   const [editingService, setEditingService] = useState<Service | null>(null)
// //   const [showForm, setShowForm] = useState(false)
// //   const [formData, setFormData] = useState<Service>({
// //     title: '',
// //     description: '',
// //     icon: 'Wrench',
// //     category: 'Civil'
// //   })

// //   // Vérifier si l'utilisateur est admin
// //   useEffect(() => {
// //     checkAdmin()
// //     loadServices()
// //   }, [])

// //   const checkAdmin = async () => {
// //     const { data: { session } } = await supabase.auth.getSession()
// //     setIsAdmin(!!session)
// //   }

// //   const loadServices = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('services')
// //         .select('*')
// //         .order('created_at', { ascending: true })

// //       if (error) throw error
      
// //       if (data && data.length > 0) {
// //         setServices(data)
// //       } else {
// //         // Services par défaut
// //         setServices([
// //           { id: 1, title: 'Génie Civil', description: 'Solutions complètes d\'infrastructure et structurelles', icon: 'Building2', category: 'Civil' },
// //           { id: 2, title: 'Construction Routière', description: 'Routes, pistes minières, revêtement en asphalte', icon: 'Road', category: 'Construction' },
// //           { id: 3, title: 'Services Miniers', description: 'Préparation de site et installations de support', icon: 'HardHat', category: 'Mining' },
// //           { id: 4, title: 'Laboratoire Géotechnique', description: 'Tests de sol et analyse des matériaux', icon: 'FlaskConical', category: 'Laboratory' },
// //           { id: 5, title: 'Services Industriels', description: 'Nettoyage, maintenance, support technique', icon: 'Wrench', category: 'Industrial' },
// //           { id: 6, title: 'Électricité', description: 'Éclairage de site et systèmes électriques', icon: 'Zap', category: 'Electrical' },
// //           { id: 7, title: 'Fourniture de Matériaux', description: 'Matériaux de construction et équipements', icon: 'Package', category: 'Supply' },
// //           { id: 8, title: 'Transport', description: 'Location de camions, bus, logistique', icon: 'Truck', category: 'Transport' },
// //         ])
// //       }
// //     } catch (error) {
// //       console.error('Error loading services:', error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // Ajouter un service
// //   const handleAddService = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     try {
// //       const { data, error } = await supabase
// //         .from('services')
// //         .insert([formData])
// //         .select()

// //       if (error) throw error
      
// //       if (data) {
// //         setServices([...services, data[0]])
// //         setShowForm(false)
// //         setFormData({ title: '', description: '', icon: 'Wrench', category: 'Civil' })
// //       }
// //     } catch (error) {
// //       console.error('Error adding service:', error)
// //       alert('Erreur lors de l\'ajout du service')
// //     }
// //   }

// //   // Mettre à jour un service
// //   const handleUpdateService = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     if (!editingService?.id) return

// //     try {
// //       const { error } = await supabase
// //         .from('services')
// //         .update({
// //           title: editingService.title,
// //           description: editingService.description,
// //           icon: editingService.icon,
// //           category: editingService.category
// //         })
// //         .eq('id', editingService.id)

// //       if (error) throw error

// //       setServices(services.map(s => 
// //         s.id === editingService.id ? editingService : s
// //       ))
// //       setEditingService(null)
// //     } catch (error) {
// //       console.error('Error updating service:', error)
// //       alert('Erreur lors de la mise à jour du service')
// //     }
// //   }

// //   // Supprimer un service
// //   const handleDeleteService = async (id: number) => {
// //     if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return

// //     try {
// //       const { error } = await supabase
// //         .from('services')
// //         .delete()
// //         .eq('id', id)

// //       if (error) throw error

// //       setServices(services.filter(s => s.id !== id))
// //     } catch (error) {
// //       console.error('Error deleting service:', error)
// //       alert('Erreur lors de la suppression du service')
// //     }
// //   }

// //   const getIcon = (iconName: string) => {
// //     const IconComponent = iconMap[iconName] || iconMap['default']
// //     return <IconComponent className="w-10 h-10" />
// //   }

// //   return (
// //     <section id="services" className="py-20 bg-white">
// //       <div className="max-w-6xl mx-auto px-4">
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           whileInView={{ opacity: 1, y: 0 }}
// //           viewport={{ once: true }}
// //         >
// //           <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4 text-center">
// //             {t.services.title}
// //           </h2>
// //           <p className="text-gray-600 text-lg mb-12 text-center max-w-2xl mx-auto">
// //             {t.services.subtitle}
// //           </p>
// //         </motion.div>

// //         {/* Bouton Admin */}
// //         {isAdmin && (
// //           <div className="flex justify-end mb-6">
// //             <button
// //               onClick={() => {
// //                 setEditingService(null)
// //                 setShowForm(!showForm)
// //               }}
// //               className="flex items-center gap-2 bg-[#1a3a6b] text-white px-4 py-2 hover:bg-blue-800 transition-colors"
// //             >
// //               <Plus className="w-5 h-5" />
// //               Ajouter un service
// //             </button>
// //           </div>
// //         )}

// //         {/* Formulaire Admin */}
// //         {isAdmin && (showForm || editingService) && (
// //           <motion.div
// //             initial={{ opacity: 0, height: 0 }}
// //             animate={{ opacity: 1, height: 'auto' }}
// //             className="mb-8 bg-gray-50 border-2 border-[#ff6b00] p-6"
// //           >
// //             <h3 className="text-xl font-bold text-[#1a3a6b] mb-4">
// //               {editingService ? 'Modifier le service' : 'Nouveau service'}
// //             </h3>
// //             <form onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-4">
// //               <div className="grid md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
// //                   <input
// //                     type="text"
// //                     value={editingService ? editingService.title : formData.title}
// //                     onChange={(e) => editingService 
// //                       ? setEditingService({...editingService, title: e.target.value})
// //                       : setFormData({...formData, title: e.target.value})
// //                     }
// //                     required
// //                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
// //                   <select
// //                     value={editingService ? editingService.icon : formData.icon}
// //                     onChange={(e) => editingService
// //                       ? setEditingService({...editingService, icon: e.target.value})
// //                       : setFormData({...formData, icon: e.target.value})
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
// //                   >
// //                     <option value="Building2">Bâtiment</option>
// //                     <option value="Road">Route</option>
// //                     <option value="HardHat">Casque</option>
// //                     <option value="FlaskConical">Laboratoire</option>
// //                     <option value="Wrench">Clé</option>
// //                     <option value="Zap">Électricité</option>
// //                     <option value="Package">Paquet</option>
// //                     <option value="Truck">Camion</option>
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
// //                   <input
// //                     type="text"
// //                     value={editingService ? editingService.category : formData.category}
// //                     onChange={(e) => editingService
// //                       ? setEditingService({...editingService, category: e.target.value})
// //                       : setFormData({...formData, category: e.target.value})
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
// //                   />
// //                 </div>
// //                 <div className="md:col-span-2">
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
// //                   <textarea
// //                     value={editingService ? editingService.description : formData.description}
// //                     onChange={(e) => editingService
// //                       ? setEditingService({...editingService, description: e.target.value})
// //                       : setFormData({...formData, description: e.target.value})
// //                     }
// //                     required
// //                     rows={3}
// //                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
// //                   />
// //                 </div>
// //               </div>
// //               <div className="flex gap-3">
// //                 <button
// //                   type="submit"
// //                   className="bg-[#ff6b00] text-white px-6 py-2 hover:bg-orange-600 transition-colors"
// //                 >
// //                   {editingService ? 'Mettre à jour' : 'Ajouter'}
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setShowForm(false)
// //                     setEditingService(null)
// //                   }}
// //                   className="bg-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-400 transition-colors"
// //                 >
// //                   Annuler
// //                 </button>
// //               </div>
// //             </form>
// //           </motion.div>
// //         )}

// //         {/* Loader */}
// //         {loading ? (
// //           <div className="flex justify-center py-16">
// //             <div className="w-12 h-12 border-4 rounded-full border-gray-200 border-t-[#ff6b00] animate-spin"></div>
// //           </div>
// //         ) : (
// //           /* Services Grid */
// //           <motion.div
// //             layout
// //             className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
// //           >
// //             {services.map((service, index) => (
// //               <motion.div
// //                 key={service.id}
// //                 initial={{ opacity: 0, y: 20 }}
// //                 whileInView={{ opacity: 1, y: 0 }}
// //                 viewport={{ once: true }}
// //                 transition={{ delay: index * 0.1 }}
// //                 className="group relative bg-white border-2 border-gray-200 hover:border-[#ff6b00] hover:shadow-xl transition-all duration-300 p-6"
// //               >
// //                 {/* Admin Actions */}
// //                 {isAdmin && (
// //                   <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
// //                     <button
// //                       onClick={() => {
// //                         setEditingService(service)
// //                         setShowForm(false)
// //                       }}
// //                       className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                       title="Modifier"
// //                     >
// //                       <Edit3 className="w-4 h-4" />
// //                     </button>
// //                     <button
// //                       onClick={() => service.id && handleDeleteService(service.id)}
// //                       className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
// //                       title="Supprimer"
// //                     >
// //                       <Trash2 className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 )}

// //                 {/* Icon */}
// //                 <div className="mb-4 text-[#ff6b00] group-hover:scale-110 transition-transform duration-300">
// //                   {getIcon(service.icon)}
// //                 </div>

// //                 {/* Content */}
// //                 <h3 className="text-lg font-bold text-[#1a3a6b] mb-2 group-hover:text-[#ff6b00] transition-colors">
// //                   {service.title}
// //                 </h3>
// //                 <p className="text-gray-600 text-sm">
// //                   {service.description}
// //                 </p>

// //                 {/* Category Badge */}
// //                 {service.category && (
// //                   <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-600 px-2 py-1">
// //                     {service.category}
// //                   </span>
// //                 )}

// //                 {/* Hover indicator */}
// //                 <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#ff6b00] group-hover:w-full transition-all duration-300" />
// //               </motion.div>
// //             ))}
// //           </motion.div>
// //         )}
// //       </div>
// //     </section>
// //   )
// // }

// // components/Services.jsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { useLanguage } from '@/context/LanguageContext'
// import { supabase } from '@/lib/supabase'
// import Link from 'next/link'
// import { 
//   Building2, Route as Road, HardHat, FlaskConical, 
//   Wrench, Zap, Package, Truck, Plus, Trash2, Edit3
// } from 'lucide-react'

// interface Service {
//   id?: number
//   title: string
//   description: string
//   icon: string
//   category: string
//   detailed_description?: string
//   features?: string[]
//   images?: string[]
//   main_image?: string
//   created_at?: string
// }

// // Mapping des icônes Lucide
// const iconMap: Record<string, any> = {
//   'Building2': Building2,
//   'Road': Road,
//   'HardHat': HardHat,
//   'FlaskConical': FlaskConical,
//   'Wrench': Wrench,
//   'Zap': Zap,
//   'Package': Package,
//   'Truck': Truck,
//   'default': Wrench
// }

// export default function Services() {
//   const { t } = useLanguage()
//   const [services, setServices] = useState<Service[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [editingService, setEditingService] = useState<Service | null>(null)
//   const [showForm, setShowForm] = useState(false)
//   const [formData, setFormData] = useState<Service>({
//     title: '',
//     description: '',
//     icon: 'Wrench',
//     category: 'Civil',
//     detailed_description: '',
//     features: [],
//     images: []
//   })
//   const [newFeature, setNewFeature] = useState('')

//   // Vérifier si l'utilisateur est admin
//   useEffect(() => {
//     checkAdmin()
//     loadServices()
//   }, [])

//   const checkAdmin = async () => {
//     const { data: { session } } = await supabase.auth.getSession()
//     setIsAdmin(!!session)
//   }

//   const loadServices = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('services')
//         .select('*')
//         .order('created_at', { ascending: true })

//       if (error) throw error
      
//       if (data && data.length > 0) {
//         // Parser les champs JSONB
//         const parsedData = data.map(service => ({
//           ...service,
//           features: typeof service.features === 'string' 
//             ? JSON.parse(service.features) 
//             : service.features || [],
//           images: typeof service.images === 'string' 
//             ? JSON.parse(service.images) 
//             : service.images || []
//         }))
//         setServices(parsedData)
//       } else {
//         // Services par défaut
//         setServices([
//           { id: 1, title: 'Génie Civil', description: 'Solutions complètes d\'infrastructure et structurelles', icon: 'Building2', category: 'Civil', features: [], images: [] },
//           { id: 2, title: 'Construction Routière', description: 'Routes, pistes minières, revêtement en asphalte', icon: 'Road', category: 'Construction', features: [], images: [] },
//           { id: 3, title: 'Services Miniers', description: 'Préparation de site et installations de support', icon: 'HardHat', category: 'Mining', features: [], images: [] },
//           { id: 4, title: 'Laboratoire Géotechnique', description: 'Tests de sol et analyse des matériaux', icon: 'FlaskConical', category: 'Laboratory', features: [], images: [] },
//           { id: 5, title: 'Services Industriels', description: 'Nettoyage, maintenance, support technique', icon: 'Wrench', category: 'Industrial', features: [], images: [] },
//           { id: 6, title: 'Électricité', description: 'Éclairage de site et systèmes électriques', icon: 'Zap', category: 'Electrical', features: [], images: [] },
//           { id: 7, title: 'Fourniture de Matériaux', description: 'Matériaux de construction et équipements', icon: 'Package', category: 'Supply', features: [], images: [] },
//           { id: 8, title: 'Transport', description: 'Location de camions, bus, logistique', icon: 'Truck', category: 'Transport', features: [], images: [] },
//         ])
//       }
//     } catch (error) {
//       console.error('Error loading services:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Upload d'images pour les services
//   const uploadServiceImage = async (file: File): Promise<string> => {
//     const fileExt = file.name.split('.').pop()
//     const fileName = `service-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
//     const { data, error } = await supabase.storage
//       .from('services-images')
//       .upload(fileName, file)
    
//     if (error) throw error
    
//     const { data: { publicUrl } } = supabase.storage
//       .from('services-images')
//       .getPublicUrl(fileName)
    
//     return publicUrl
//   }

//   // Ajouter un service
//   const handleAddService = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const { data, error } = await supabase
//         .from('services')
//         .insert([{
//           ...formData,
//           features: JSON.stringify(formData.features || []),
//           images: JSON.stringify(formData.images || [])
//         }])
//         .select()

//       if (error) throw error
      
//       if (data) {
//         const newService = {
//           ...data[0],
//           features: formData.features || [],
//           images: formData.images || []
//         }
//         setServices([...services, newService])
//         setShowForm(false)
//         setFormData({ 
//           title: '', 
//           description: '', 
//           icon: 'Wrench', 
//           category: 'Civil',
//           detailed_description: '',
//           features: [],
//           images: []
//         })
//         setNewFeature('')
//       }
//     } catch (error) {
//       console.error('Error adding service:', error)
//       alert('Erreur lors de l\'ajout du service')
//     }
//   }

//   // Mettre à jour un service
//   const handleUpdateService = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!editingService?.id) return

//     try {
//       const { error } = await supabase
//         .from('services')
//         .update({
//           title: editingService.title,
//           description: editingService.description,
//           icon: editingService.icon,
//           category: editingService.category,
//           detailed_description: editingService.detailed_description,
//           features: JSON.stringify(editingService.features || []),
//           images: JSON.stringify(editingService.images || []),
//           main_image: editingService.main_image
//         })
//         .eq('id', editingService.id)

//       if (error) throw error

//       setServices(services.map(s => 
//         s.id === editingService.id ? editingService : s
//       ))
//       setEditingService(null)
//       setNewFeature('')
//     } catch (error) {
//       console.error('Error updating service:', error)
//       alert('Erreur lors de la mise à jour du service')
//     }
//   }

//   // Supprimer un service
//   const handleDeleteService = async (id: number) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return

//     try {
//       // Supprimer les images associées du bucket
//       const service = services.find(s => s.id === id)
//       if (service?.images) {
//         for (let imageUrl of service.images) {
//           const fileName = imageUrl.split('/').pop()
//           if (fileName) {
//             await supabase.storage
//               .from('services-images')
//               .remove([fileName])
//           }
//         }
//       }

//       const { error } = await supabase
//         .from('services')
//         .delete()
//         .eq('id', id)

//       if (error) throw error

//       setServices(services.filter(s => s.id !== id))
//     } catch (error) {
//       console.error('Error deleting service:', error)
//       alert('Erreur lors de la suppression du service')
//     }
//   }

//   const getIcon = (iconName: string) => {
//     const IconComponent = iconMap[iconName] || iconMap['default']
//     return <IconComponent className="w-10 h-10" />
//   }

//   return (
//     <section id="services" className="py-20 bg-white">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4 text-center">
//             {t.services.title}
//           </h2>
//           <p className="text-gray-600 text-lg mb-12 text-center max-w-2xl mx-auto">
//             {t.services.subtitle}
//           </p>
//         </motion.div>

//         {/* Bouton Admin */}
//         {isAdmin && (
//           <div className="flex justify-end mb-6">
//             <button
//               onClick={() => {
//                 setEditingService(null)
//                 setShowForm(!showForm)
//                 setFormData({ 
//                   title: '', 
//                   description: '', 
//                   icon: 'Wrench', 
//                   category: 'Civil',
//                   detailed_description: '',
//                   features: [],
//                   images: []
//                 })
//                 setNewFeature('')
//               }}
//               className="flex items-center gap-2 bg-[#1a3a6b] text-white px-4 py-2 hover:bg-blue-800 transition-colors"
//             >
//               <Plus className="w-5 h-5" />
//               Ajouter un service
//             </button>
//           </div>
//         )}

//         {/* Formulaire Admin */}
//         {isAdmin && (showForm || editingService) && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             className="mb-8 bg-gray-50 border-2 border-[#ff6b00] p-6"
//           >
//             <h3 className="text-xl font-bold text-[#1a3a6b] mb-4">
//               {editingService ? 'Modifier le service' : 'Nouveau service'}
//             </h3>
//             <form onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
//                   <input
//                     type="text"
//                     value={editingService ? editingService.title : formData.title}
//                     onChange={(e) => editingService 
//                       ? setEditingService({...editingService, title: e.target.value})
//                       : setFormData({...formData, title: e.target.value})
//                     }
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
//                   <select
//                     value={editingService ? editingService.icon : formData.icon}
//                     onChange={(e) => editingService
//                       ? setEditingService({...editingService, icon: e.target.value})
//                       : setFormData({...formData, icon: e.target.value})
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
//                   >
//                     <option value="Building2">Bâtiment</option>
//                     <option value="Road">Route</option>
//                     <option value="HardHat">Casque</option>
//                     <option value="FlaskConical">Laboratoire</option>
//                     <option value="Wrench">Clé</option>
//                     <option value="Zap">Électricité</option>
//                     <option value="Package">Paquet</option>
//                     <option value="Truck">Camion</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
//                   <input
//                     type="text"
//                     value={editingService ? editingService.category : formData.category}
//                     onChange={(e) => editingService
//                       ? setEditingService({...editingService, category: e.target.value})
//                       : setFormData({...formData, category: e.target.value})
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
//                   <textarea
//                     value={editingService ? editingService.description : formData.description}
//                     onChange={(e) => editingService
//                       ? setEditingService({...editingService, description: e.target.value})
//                       : setFormData({...formData, description: e.target.value})
//                     }
//                     required
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
//                   <textarea
//                     value={editingService ? (editingService.detailed_description || '') : (formData.detailed_description || '')}
//                     onChange={(e) => editingService
//                       ? setEditingService({...editingService, detailed_description: e.target.value})
//                       : setFormData({...formData, detailed_description: e.target.value})
//                     }
//                     rows={6}
//                     className="w-full px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Caractéristiques</label>
//                   <div className="flex gap-2 mb-2">
//                     <input
//                       type="text"
//                       value={newFeature}
//                       onChange={(e) => setNewFeature(e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 focus:border-[#ff6b00] outline-none"
//                       placeholder="Ajouter une caractéristique..."
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault()
//                           if (newFeature.trim()) {
//                             const features = editingService 
//                               ? [...(editingService.features || []), newFeature.trim()]
//                               : [...(formData.features || []), newFeature.trim()]
                            
//                             if (editingService) {
//                               setEditingService({...editingService, features})
//                             } else {
//                               setFormData({...formData, features})
//                             }
//                             setNewFeature('')
//                           }
//                         }
//                       }}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         if (newFeature.trim()) {
//                           const features = editingService 
//                             ? [...(editingService.features || []), newFeature.trim()]
//                             : [...(formData.features || []), newFeature.trim()]
                          
//                           if (editingService) {
//                             setEditingService({...editingService, features})
//                           } else {
//                             setFormData({...formData, features})
//                           }
//                           setNewFeature('')
//                         }
//                       }}
//                       className="bg-[#ff6b00] text-white px-4 py-2 hover:bg-orange-600"
//                     >
//                       <Plus className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {(editingService ? (editingService.features || []) : (formData.features || [])).map((feature, index) => (
//                       <div key={index} className="flex items-center gap-2 bg-white p-2 border">
//                         <span className="flex-1 text-sm">{feature}</span>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const features = editingService 
//                               ? editingService.features?.filter((_, i) => i !== index)
//                               : formData.features?.filter((_, i) => i !== index)
                            
//                             if (editingService) {
//                               setEditingService({...editingService, features})
//                             } else {
//                               setFormData({...formData, features})
//                             }
//                           }}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Images du service</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={async (e) => {
//                       const files = e.target.files
//                       if (!files) return
                      
//                       for (let file of Array.from(files)) {
//                         try {
//                           const imageUrl = await uploadServiceImage(file)
//                           const images = editingService 
//                             ? [...(editingService.images || []), imageUrl]
//                             : [...(formData.images || []), imageUrl]
                          
//                           if (editingService) {
//                             setEditingService({...editingService, images})
//                           } else {
//                             setFormData({...formData, images})
//                           }
//                         } catch (error) {
//                           console.error('Error uploading image:', error)
//                           alert('Erreur lors de l\'upload de l\'image')
//                         }
//                       }
//                     }}
//                     className="w-full text-sm"
//                   />
//                   <div className="grid grid-cols-4 gap-2 mt-2">
//                     {(editingService ? (editingService.images || []) : (formData.images || [])).map((image, index) => (
//                       <div key={index} className="relative group">
//                         <img src={image} alt={`Service ${index + 1}`} className="w-full h-20 object-cover" />
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const images = editingService 
//                               ? editingService.images?.filter((_, i) => i !== index)
//                               : formData.images?.filter((_, i) => i !== index)
                            
//                             if (editingService) {
//                               setEditingService({...editingService, images})
//                             } else {
//                               setFormData({...formData, images})
//                             }
//                           }}
//                           className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   className="bg-[#ff6b00] text-white px-6 py-2 hover:bg-orange-600 transition-colors"
//                 >
//                   {editingService ? 'Mettre à jour' : 'Ajouter'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false)
//                     setEditingService(null)
//                     setNewFeature('')
//                   }}
//                   className="bg-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-400 transition-colors"
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         )}

//         {/* Loader */}
//         {loading ? (
//           <div className="flex justify-center py-16">
//             <div className="w-12 h-12 border-4 rounded-full border-gray-200 border-t-[#ff6b00] animate-spin"></div>
//           </div>
//         ) : (
//           /* Services Grid */
//           <motion.div
//             layout
//             className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
//           >
//             {services.map((service, index) => (
//               <Link href={`/services/${service.id}`} key={service.id}>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1 }}
//                   className="group relative bg-white border-2 border-gray-200 hover:border-[#ff6b00] hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
//                 >
//                   {/* Admin Actions */}
//                   {isAdmin && (
//                     <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           setEditingService(service)
//                           setShowForm(false)
//                         }}
//                         className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                         title="Modifier"
//                       >
//                         <Edit3 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           service.id && handleDeleteService(service.id)
//                         }}
//                         className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
//                         title="Supprimer"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   )}

//                   {/* Icon */}
//                   <div className="mb-4 text-[#ff6b00] group-hover:scale-110 transition-transform duration-300">
//                     {getIcon(service.icon)}
//                   </div>

//                   {/* Content */}
//                   <h3 className="text-lg font-bold text-[#1a3a6b] mb-2 group-hover:text-[#ff6b00] transition-colors">
//                     {service.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm">
//                     {service.description}
//                   </p>

//                   {/* Category Badge */}
//                   {service.category && (
//                     <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-600 px-2 py-1">
//                       {service.category}
//                     </span>
//                   )}

//                   {/* Hover indicator */}
//                   <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#ff6b00] group-hover:w-full transition-all duration-300" />
//                 </motion.div>
//               </Link>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   )
// }

// components/Services.jsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Building2, Route as Road, HardHat, FlaskConical, 
  Wrench, Zap, Package, Truck, Edit3
} from 'lucide-react'

// Mapping des icônes Lucide
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

export default function Services() {
  const { t, language } = useLanguage()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    checkAdmin()
    loadServices()
  }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsAdmin(!!session)
  }

  const loadServices = async () => {
    try {
      // Charger les services avec leurs traductions et images
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          translations:service_translations(*),
          images:service_images(*)
        `)
        .order('created_at', { ascending: true })

      if (servicesError) throw servicesError
      
      if (servicesData && servicesData.length > 0) {
        // Parser les features JSONB dans les traductions
        const parsedServices = servicesData.map(service => ({
          ...service,
          translations: service.translations.map(trans => ({
            ...trans,
            features: typeof trans.features === 'string' 
              ? JSON.parse(trans.features) 
              : trans.features || []
          })),
          images: service.images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        }))
        setServices(parsedServices)
      }
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtenir la traduction dans la langue actuelle
  const getTranslation = (service) => {
    const translation = service.translations.find(trans => trans.language === language)
    return translation || service.translations[0] || { title: '', description: '' }
  }

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || iconMap['default']
    return <IconComponent className="w-10 h-10" />
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a6b] mb-4 text-center">
            {t.services.title}
          </h2>
          <p className="text-gray-600 text-lg mb-12 text-center max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>

        {/* Bouton Admin */}
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <Link
              href="/admin?tab=services"
              className="flex items-center gap-2 bg-[#1a3a6b] text-white px-4 py-2 hover:bg-blue-800 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
              Gérer les services
            </Link>
          </div>
        )}

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 rounded-full border-gray-200 border-t-[#ff6b00] animate-spin"></div>
          </div>
        ) : (
          /* Services Grid */
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => {
              const translation = getTranslation(service)
              return (
                <Link href={`/services/${service.id}`} key={service.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white border-2 border-gray-200 hover:border-[#ff6b00] hover:shadow-xl transition-all duration-300 p-6 cursor-pointer h-full"
                  >
                    {/* Icon */}
                    <div className="mb-4 text-[#ff6b00] group-hover:scale-110 transition-transform duration-300">
                      {getIcon(service.icon)}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-[#1a3a6b] mb-2 group-hover:text-[#ff6b00] transition-colors">
                      {translation.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {translation.description}
                    </p>

                    {/* Category Badge */}
                    {service.category && (
                      <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-600 px-2 py-1">
                        {service.category}
                      </span>
                    )}

                    {/* Images preview */}
                    {service.images && service.images.length > 0 && (
                      <div className="flex gap-1 mt-3">
                        {service.images.slice(0, 3).map((img, i) => (
                          <img 
                            key={i} 
                            src={img.image_url} 
                            alt=""
                            className="w-8 h-8 object-cover rounded opacity-60"
                          />
                        ))}
                      </div>
                    )}

                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#ff6b00] group-hover:w-full transition-all duration-300" />
                  </motion.div>
                </Link>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}