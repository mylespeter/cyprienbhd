

// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Upload, Trash2, Edit, Image as ImageIcon, Users, LayoutGrid, 
  LogOut, FileText, File, Building2, Route as Road, HardHat, 
  FlaskConical, Wrench, Zap, Package, Truck, Plus, 
  Handshake, CheckCircle, Globe, Save, X, ArrowLeft,
  Monitor, Camera
} from 'lucide-react'

// ==================== TYPES ====================

type User = {
  id: number
  username: string
  email: string
  genre: string
  telephone: string
  created_at: string
  updated_at: string
}

type GalleryImage = {
  id: number
  title: string
  title_fr?: string
  title_en?: string
  title_zh?: string
  description: string
  description_fr?: string
  description_en?: string
  description_zh?: string
  category: string
  category_fr?: string
  category_en?: string
  category_zh?: string
  image_url: string
  created_at: string
  updated_at: string
}

type Document = {
  id: number
  name: string
  type: string
  size: string
  category: string
  file_url: string
  created_at: string
  updated_at: string
}

type ServiceImage = {
  id?: number
  service_id?: number
  image_url: string
  alt_text_fr?: string
  alt_text_en?: string
  alt_text_zh?: string
  sort_order?: number
}

type ServiceTranslation = {
  id?: number
  service_id?: number
  language: string
  title: string
  description: string
  detailed_description?: string
  features?: string[]
}

type Service = {
  id?: number
  icon: string
  category: string
  translations: ServiceTranslation[]
  images: ServiceImage[]
  created_at?: string
}

type Partner = {
  id?: number
  name: string
  logo: string
  website?: string
  created_at?: string
}

type SiteImage = {
  id?: number
  section: string
  image_key: string
  image_url: string
  alt_text_fr?: string
  alt_text_en?: string
  alt_text_zh?: string
}

type Language = 'fr' | 'en' | 'zh'

type TabType = 'users' | 'gallery' | 'documents' | 'services' | 'partners' | 'site-images'

// ==================== CONSTANTES ====================

const GALLERY_CATEGORIES = ['Construction', 'Mining', 'Industrial', 'Electrical', 'Laboratory']
const DOCUMENT_CATEGORIES = ['Company', 'Legal', 'Quality', 'Safety', 'Technical']
const SERVICE_ICONS = ['Building2', 'Road', 'HardHat', 'FlaskConical', 'Wrench', 'Zap', 'Package', 'Truck']
const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' }
]

const SITE_IMAGE_SECTIONS = [
  {
    section: 'hero',
    label: 'Hero (Page d\'accueil)',
    icon: Monitor,
    images: [
      { key: 'hero_main', label: 'Image principale (haut gauche)', defaultUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=600&fit=crop' },
      { key: 'hero_secondary', label: 'Image secondaire (bas droite)', defaultUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&h=500&fit=crop' },
      { key: 'hero_tertiary', label: 'Image tertiaire (centre droite)', defaultUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop' }
    ]
  },
  {
    section: 'about',
    label: 'À Propos',
    icon: Users,
    images: [
      { key: 'about_main', label: 'Image principale', defaultUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800' }
    ]
  }
]

const iconMap: Record<string, any> = {
  'Building2': Building2,
  'Road': Road,
  'HardHat': HardHat,
  'FlaskConical': FlaskConical,
  'Wrench': Wrench,
  'Zap': Zap,
  'Package': Package,
  'Truck': Truck,
}

// ==================== COMPOSANT PRINCIPAL ====================

export default function AdminPage() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as TabType) || 'users'
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [users, setUsers] = useState<User[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [siteImages, setSiteImages] = useState<SiteImage[]>([])
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)
  
  // Gallery form state
  const [uploading, setUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [title, setTitle] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleZh, setTitleZh] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionZh, setDescriptionZh] = useState('')
  const [category, setCategory] = useState('Construction')
  const [categoryEn, setCategoryEn] = useState('Construction')
  const [categoryZh, setCategoryZh] = useState('Construction')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
  // Document form state
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [docName, setDocName] = useState('')
  const [docCategory, setDocCategory] = useState('Company')
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null)

  // Services form state
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceFormData, setServiceFormData] = useState<Service>({
    icon: 'Wrench',
    category: '',
    translations: [
      { language: 'fr', title: '', description: '', detailed_description: '', features: [] },
      { language: 'en', title: '', description: '', detailed_description: '', features: [] },
      { language: 'zh', title: '', description: '', detailed_description: '', features: [] }
    ],
    images: []
  })
  const [activeLanguage, setActiveLanguage] = useState<Language>('fr')
  const [newFeature, setNewFeature] = useState('')
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([])

  // Partners form state
  const [uploadingPartner, setUploadingPartner] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [partnerName, setPartnerName] = useState('')
  const [partnerWebsite, setPartnerWebsite] = useState('')
  const [selectedPartnerLogo, setSelectedPartnerLogo] = useState<File | null>(null)
  const [partnerLogoPreview, setPartnerLogoPreview] = useState<string>('')

  // Site images state
  const [editingSiteImage, setEditingSiteImage] = useState<SiteImage | null>(null)
  const [siteImageFormData, setSiteImageFormData] = useState<SiteImage>({
    section: 'hero',
    image_key: '',
    image_url: '',
    alt_text_fr: '',
    alt_text_en: '',
    alt_text_zh: ''
  })
  const [uploadingSiteImage, setUploadingSiteImage] = useState(false)
  const [siteImagePreview, setSiteImagePreview] = useState('')

  const router = useRouter()

  // ==================== EFFECTS ====================

  useEffect(() => {
    const adminSession = document.cookie.includes('admin-session=authenticated')
    const storedAdmin = localStorage.getItem('admin-user')
    
    if (!adminSession || !storedAdmin) {
      router.push('/admin/login')
      return
    }

    setAdminUser(JSON.parse(storedAdmin))
    loadData()
  }, [router])

  useEffect(() => {
    if (activeTab) {
      router.push(`/admin?tab=${activeTab}`, { scroll: false })
    }
  }, [activeTab])

  // ==================== DATA LOADING ====================

  const loadData = async () => {
    setLoading(true)
    await Promise.all([
      loadUsers(), 
      loadGallery(), 
      loadDocuments(), 
      loadServices(),
      loadPartners(),
      loadSiteImages()
    ])
    setLoading(false)
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setGalleryImages(data || [])
    } catch (error) {
      console.error('Error loading gallery:', error)
    }
  }

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
    }
  }

  const loadServices = async () => {
    try {
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
        const parsedServices: Service[] = (servicesData as any[]).map((service): Service => ({
          ...service,
          translations: (service.translations as any[]).map((trans): ServiceTranslation => ({
            ...trans,
            features: typeof trans.features === 'string' 
              ? JSON.parse(trans.features) 
              : trans.features || []
          })),
          images: (service.images as ServiceImage[]).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        }))
        setServices(parsedServices)
      }
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      if (data) setPartners(data)
    } catch (error) {
      console.error('Error loading partners:', error)
    }
  }

  const loadSiteImages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('section', { ascending: true })
      if (error) throw error
      setSiteImages(data || [])
    } catch (error) {
      console.error('Error loading site images:', error)
    }
  }

  // ==================== AUTH ====================

  const handleLogout = () => {
    document.cookie = 'admin-session=; path=/; max-age=0'
    localStorage.removeItem('admin-user')
    router.push('/admin/login')
  }

  // ==================== USERS HANDLERS ====================

  const deleteUser = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId)
      if (error) throw error
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  // ==================== GALLERY HANDLERS ====================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const resetGalleryForm = () => {
    setTitle('')
    setTitleEn('')
    setTitleZh('')
    setDescription('')
    setDescriptionEn('')
    setDescriptionZh('')
    setCategory('Construction')
    setCategoryEn('Construction')
    setCategoryZh('Construction')
    setSelectedFile(null)
    setPreviewUrl('')
    setEditingImage(null)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile && !editingImage) {
      alert('Veuillez sélectionner une image')
      return
    }

    setUploading(true)
    try {
      let imageUrl = editingImage?.image_url || ''

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, selectedFile)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName)
        imageUrl = publicUrl

        if (editingImage?.image_url) {
          const oldFileName = editingImage.image_url.split('/').pop()
          if (oldFileName) {
            await supabase.storage.from('gallery').remove([oldFileName])
          }
        }
      }

      const imageData = {
        title: title,
        title_fr: title,
        title_en: titleEn || title,
        title_zh: titleZh || title,
        description: description,
        description_fr: description,
        description_en: descriptionEn || description,
        description_zh: descriptionZh || description,
        category: category,
        category_fr: category,
        category_en: categoryEn || category,
        category_zh: categoryZh || category,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      }

      if (editingImage) {
        const { error } = await supabase
          .from('gallery_images')
          .update(imageData)
          .eq('id', editingImage.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('gallery_images')
          .insert([imageData])
        if (error) throw error
      }

      resetGalleryForm()
      loadGallery()
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (image: GalleryImage) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return
    try {
      const fileName = image.image_url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName])
      }
      const { error } = await supabase.from('gallery_images').delete().eq('id', image.id)
      if (error) throw error
      setGalleryImages(galleryImages.filter(img => img.id !== image.id))
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const editImage = (image: GalleryImage) => {
    setEditingImage(image)
    setTitle(image.title_fr || image.title)
    setTitleEn(image.title_en || '')
    setTitleZh(image.title_zh || '')
    setDescription(image.description_fr || image.description || '')
    setDescriptionEn(image.description_en || '')
    setDescriptionZh(image.description_zh || '')
    setCategory(image.category_fr || image.category)
    setCategoryEn(image.category_en || '')
    setCategoryZh(image.category_zh || '')
    setPreviewUrl(image.image_url)
    setSelectedFile(null)
  }

  // ==================== DOCUMENT HANDLERS ====================

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedDocFile(file)
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const resetDocumentForm = () => {
    setDocName('')
    setDocCategory('Company')
    setSelectedDocFile(null)
    setEditingDocument(null)
  }

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDocFile && !editingDocument) {
      alert('Veuillez sélectionner un fichier')
      return
    }

    setUploadingDoc(true)
    try {
      let fileUrl = editingDocument?.file_url || ''
      let fileType = editingDocument?.type || ''
      let fileSize = editingDocument?.size || ''

      if (selectedDocFile) {
        const fileExt = selectedDocFile.name.split('.').pop()?.toUpperCase() || 'FILE'
        const fileName = `${Date.now()}-${selectedDocFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, selectedDocFile)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName)
        fileUrl = publicUrl
        fileType = fileExt
        fileSize = formatFileSize(selectedDocFile.size)

        if (editingDocument?.file_url) {
          const oldFileName = editingDocument.file_url.split('/').pop()
          if (oldFileName) {
            await supabase.storage.from('documents').remove([oldFileName])
          }
        }
      }

      if (editingDocument) {
        const { error } = await supabase
          .from('documents')
          .update({ name: docName, category: docCategory, type: fileType, size: fileSize, file_url: fileUrl, updated_at: new Date().toISOString() })
          .eq('id', editingDocument.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('documents')
          .insert([{ name: docName, category: docCategory, type: fileType, size: fileSize, file_url: fileUrl }])
        if (error) throw error
      }

      resetDocumentForm()
      loadDocuments()
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Erreur lors de l\'upload du document')
    } finally {
      setUploadingDoc(false)
    }
  }

  const deleteDocument = async (document: Document) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return
    try {
      const fileName = document.file_url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('documents').remove([fileName])
      }
      const { error } = await supabase.from('documents').delete().eq('id', document.id)
      if (error) throw error
      setDocuments(documents.filter(doc => doc.id !== document.id))
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const editDocument = (document: Document) => {
    setEditingDocument(document)
    setDocName(document.name)
    setDocCategory(document.category)
    setSelectedDocFile(null)
  }

  // ==================== SERVICES HANDLERS ====================

  const uploadServiceImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `service-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('services-images')
      .upload(fileName, file)
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('services-images')
      .getPublicUrl(fileName)
    return publicUrl
  }

  const getTranslation = (language: Language): ServiceTranslation => {
    const source = editingService || serviceFormData
    return source.translations.find(t => t.language === language) || 
      { language, title: '', description: '', detailed_description: '', features: [] }
  }

  const updateTranslation = (language: Language, field: string, value: any) => {
    if (editingService) {
      const newTranslations = editingService.translations.map(t => 
        t.language === language ? { ...t, [field]: value } : t
      )
      setEditingService({ ...editingService, translations: newTranslations })
    } else {
      const newTranslations = serviceFormData.translations.map(t => 
        t.language === language ? { ...t, [field]: value } : t
      )
      setServiceFormData({ ...serviceFormData, translations: newTranslations })
    }
  }

  const addFeature = (language: Language) => {
    if (!newFeature.trim()) return
    const translation = getTranslation(language)
    const features = [...(translation.features || []), newFeature.trim()]
    updateTranslation(language, 'features', features)
    setNewFeature('')
  }

  const removeFeature = (language: Language, index: number) => {
    const translation = getTranslation(language)
    const features = translation.features?.filter((_, i) => i !== index) || []
    updateTranslation(language, 'features', features)
  }

  const resetServiceForm = () => {
    setServiceFormData({
      icon: 'Wrench',
      category: '',
      translations: [
        { language: 'fr', title: '', description: '', detailed_description: '', features: [] },
        { language: 'en', title: '', description: '', detailed_description: '', features: [] },
        { language: 'zh', title: '', description: '', detailed_description: '', features: [] }
      ],
      images: []
    })
    setEditingService(null)
    setNewFeature('')
    setServiceImages([])
    setActiveLanguage('fr')
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const serviceData = {
        icon: editingService ? editingService.icon : serviceFormData.icon,
        category: editingService ? editingService.category : serviceFormData.category
      }

      let serviceId: number | undefined = editingService?.id

      if (editingService?.id) {
        const { error: serviceError } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)
        if (serviceError) throw serviceError

        for (const translation of editingService.translations) {
          if (translation.id) {
            const { error: transError } = await supabase
              .from('service_translations')
              .update({
                title: translation.title,
                description: translation.description,
                detailed_description: translation.detailed_description,
                features: JSON.stringify(translation.features || [])
              })
              .eq('id', translation.id)
            if (transError) throw transError
          } else {
            const { error: insertError } = await supabase
              .from('service_translations')
              .insert([{
                service_id: editingService.id,
                language: translation.language,
                title: translation.title,
                description: translation.description,
                detailed_description: translation.detailed_description,
                features: JSON.stringify(translation.features || [])
              }])
            if (insertError) throw insertError
          }
        }
        serviceId = editingService.id
      } else {
        const { data: newService, error: serviceError } = await supabase
          .from('services')
          .insert([serviceData])
          .select()
        if (serviceError) throw serviceError
        serviceId = newService[0].id

        for (const translation of serviceFormData.translations) {
          const { error: transError } = await supabase
            .from('service_translations')
            .insert([{
              service_id: serviceId,
              language: translation.language,
              title: translation.title,
              description: translation.description,
              detailed_description: translation.detailed_description,
              features: JSON.stringify(translation.features || [])
            }])
          if (transError) throw transError
        }
      }

      const currentImages = editingService ? editingService.images : serviceImages
      const existingImages = editingService?.images || []
      
      for (const img of existingImages) {
        if (!currentImages.find(i => i.id === img.id)) {
          const fileName = img.image_url.split('/').pop()
          if (fileName) {
            await supabase.storage.from('services-images').remove([fileName])
          }
          if (img.id) {
            await supabase.from('service_images').delete().eq('id', img.id)
          }
        }
      }

      for (let i = 0; i < currentImages.length; i++) {
        const img = currentImages[i]
        if (img.id) {
          await supabase
            .from('service_images')
            .update({ 
              sort_order: i,
              alt_text_fr: img.alt_text_fr,
              alt_text_en: img.alt_text_en,
              alt_text_zh: img.alt_text_zh
            })
            .eq('id', img.id)
        } else {
          await supabase
            .from('service_images')
            .insert([{
              service_id: serviceId,
              image_url: img.image_url,
              alt_text_fr: img.alt_text_fr,
              alt_text_en: img.alt_text_en,
              alt_text_zh: img.alt_text_zh,
              sort_order: i
            }])
        }
      }

      resetServiceForm()
      loadServices()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Erreur lors de la sauvegarde du service')
    }
  }

  const deleteService = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return
    try {
      const service = services.find(s => s.id === id)
      if (service?.images) {
        for (let image of service.images) {
          const fileName = image.image_url.split('/').pop()
          if (fileName) {
            await supabase.storage.from('services-images').remove([fileName])
          }
        }
      }
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setServices(services.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const editService = (service: Service) => {
    setEditingService(service)
    setServiceImages(service.images)
  }

  // ==================== PARTNERS HANDLERS ====================

  const handlePartnerLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPartnerLogo(file)
      setPartnerLogoPreview(URL.createObjectURL(file))
    }
  }

  const resetPartnerForm = () => {
    setPartnerName('')
    setPartnerWebsite('')
    setSelectedPartnerLogo(null)
    setPartnerLogoPreview('')
    setEditingPartner(null)
  }

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPartnerLogo && !editingPartner) {
      alert('Veuillez sélectionner un logo')
      return
    }

    setUploadingPartner(true)
    try {
      let logoUrl = editingPartner?.logo || ''

      if (selectedPartnerLogo) {
        const fileExt = selectedPartnerLogo.name.split('.').pop()
        const fileName = `partner-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('partners')
          .upload(fileName, selectedPartnerLogo)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('partners')
          .getPublicUrl(fileName)
        logoUrl = publicUrl

        if (editingPartner?.logo) {
          const oldFileName = editingPartner.logo.split('/').pop()
          if (oldFileName) {
            await supabase.storage.from('partners').remove([oldFileName])
          }
        }
      }

      if (editingPartner?.id) {
        const { error } = await supabase
          .from('partners')
          .update({ name: partnerName, website: partnerWebsite || null, logo: logoUrl, updated_at: new Date().toISOString() })
          .eq('id', editingPartner.id)
        if (error) throw error
        setPartners(partners.map(p => 
          p.id === editingPartner.id ? { ...p, name: partnerName, website: partnerWebsite, logo: logoUrl } : p
        ))
      } else {
        const { data, error } = await supabase
          .from('partners')
          .insert([{ name: partnerName, website: partnerWebsite || null, logo: logoUrl }])
          .select()
        if (error) throw error
        if (data) setPartners([...partners, data[0]])
      }

      resetPartnerForm()
    } catch (error) {
      console.error('Error saving partner:', error)
      alert('Erreur lors de la sauvegarde du partenaire')
    } finally {
      setUploadingPartner(false)
    }
  }

  const deletePartner = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return
    try {
      const partner = partners.find(p => p.id === id)
      if (partner?.logo) {
        const fileName = partner.logo.split('/').pop()
        if (fileName) {
          await supabase.storage.from('partners').remove([fileName])
        }
      }
      const { error } = await supabase.from('partners').delete().eq('id', id)
      if (error) throw error
      setPartners(partners.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting partner:', error)
    }
  }

  const editPartner = (partner: Partner) => {
    setEditingPartner(partner)
    setPartnerName(partner.name)
    setPartnerWebsite(partner.website || '')
    setPartnerLogoPreview(partner.logo)
    setSelectedPartnerLogo(null)
  }

  // ==================== SITE IMAGES HANDLERS ====================

  const uploadSiteImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `site-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('site-images')
      .upload(fileName, file)
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(fileName)
    return publicUrl
  }

  const handleSiteImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSiteImagePreview(URL.createObjectURL(file))
      setUploadingSiteImage(true)
      try {
        const imageUrl = await uploadSiteImage(file)
        setSiteImageFormData({ ...siteImageFormData, image_url: imageUrl })
      } catch (error) {
        console.error('Error uploading site image:', error)
        alert('Erreur lors de l\'upload de l\'image')
      } finally {
        setUploadingSiteImage(false)
      }
    }
  }

  const resetSiteImageForm = () => {
    setSiteImageFormData({
      section: 'hero',
      image_key: '',
      image_url: '',
      alt_text_fr: '',
      alt_text_en: '',
      alt_text_zh: ''
    })
    setEditingSiteImage(null)
    setSiteImagePreview('')
  }

  const handleSiteImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!siteImageFormData.image_url) {
      alert('Veuillez sélectionner une image')
      return
    }

    try {
      if (editingSiteImage?.id) {
        const { error } = await supabase
          .from('site_images')
          .update({
            image_url: siteImageFormData.image_url,
            alt_text_fr: siteImageFormData.alt_text_fr,
            alt_text_en: siteImageFormData.alt_text_en,
            alt_text_zh: siteImageFormData.alt_text_zh,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSiteImage.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('site_images')
          .insert([{
            section: siteImageFormData.section,
            image_key: siteImageFormData.image_key,
            image_url: siteImageFormData.image_url,
            alt_text_fr: siteImageFormData.alt_text_fr,
            alt_text_en: siteImageFormData.alt_text_en,
            alt_text_zh: siteImageFormData.alt_text_zh
          }])
        if (error) throw error
      }

      resetSiteImageForm()
      loadSiteImages()
    } catch (error) {
      console.error('Error saving site image:', error)
      alert('Erreur lors de la sauvegarde de l\'image')
    }
  }

  const deleteSiteImage = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser cette image ?')) return
    try {
      const image = siteImages.find(img => img.id === id)
      if (image?.image_url) {
        const fileName = image.image_url.split('/').pop()
        if (fileName) {
          await supabase.storage.from('site-images').remove([fileName])
        }
      }
      const { error } = await supabase.from('site_images').delete().eq('id', id)
      if (error) throw error
      setSiteImages(siteImages.filter(img => img.id !== id))
    } catch (error) {
      console.error('Error deleting site image:', error)
    }
  }

  const editSiteImage = (image: SiteImage) => {
    setEditingSiteImage(image)
    setSiteImageFormData({
      section: image.section,
      image_key: image.image_key,
      image_url: image.image_url,
      alt_text_fr: image.alt_text_fr || '',
      alt_text_en: image.alt_text_en || '',
      alt_text_zh: image.alt_text_zh || ''
    })
    setSiteImagePreview(image.image_url)
  }

  const getSiteImageForSection = (section: string, key: string): SiteImage | undefined => {
    return siteImages.find(img => img.section === section && img.image_key === key)
  }

  // ==================== UTILS ====================

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || iconMap['Wrench']
    return <IconComponent className="w-6 h-6" />
  }

  const tabs = [
    { id: 'users' as TabType, icon: Users, label: 'Utilisateurs' },
    { id: 'site-images' as TabType, icon: Camera, label: 'Images du site' },
    { id: 'services' as TabType, icon: Building2, label: 'Services' },
    { id: 'partners' as TabType, icon: Handshake, label: 'Partenaires' },
    { id: 'gallery' as TabType, icon: LayoutGrid, label: 'Galerie' },
    { id: 'documents' as TabType, icon: FileText, label: 'Documents' }
  ]

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1a3a6b] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#ff6b00] animate-pulse" />
            <h1 className="text-lg font-bold text-white tracking-wide uppercase">Administration</h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-white/80 font-medium">{adminUser?.username}</span>
            <button onClick={handleLogout} className="text-white/80 hover:text-[#ff6b00] transition-colors flex items-center gap-2 text-sm font-medium">
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-semibold uppercase tracking-wide transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#ff6b00] text-[#1a3a6b] bg-white'
                      : 'border-transparent text-gray-500 hover:text-[#1a3a6b]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 border-l-4 border-[#ff6b00] p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">Total Utilisateurs</p>
                <p className="text-4xl font-bold text-[#1a3a6b]">{users.length}</p>
              </div>
              <div className="bg-gray-50 border-l-4 border-[#ff6b00] p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">Hommes</p>
                <p className="text-4xl font-bold text-[#1a3a6b]">{users.filter(u => u.genre === 'M').length}</p>
              </div>
              <div className="bg-gray-50 border-l-4 border-[#ff6b00] p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">Femmes</p>
                <p className="text-4xl font-bold text-[#1a3a6b]">{users.filter(u => u.genre === 'F').length}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase tracking-wide">Liste des Utilisateurs</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#1a3a6b] uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#1a3a6b] uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#1a3a6b] uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#1a3a6b] uppercase">Genre</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#1a3a6b] uppercase">Téléphone</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#1a3a6b] uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-[#1a3a6b] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">{user.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#1a3a6b]">{user.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 text-xs font-semibold uppercase ${user.genre === 'M' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-pink-50 text-pink-700 border border-pink-200'}`}>
                            {user.genre === 'M' ? 'Homme' : 'Femme'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.telephone || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4 text-sm">
                          <button onClick={() => deleteUser(user.id)} disabled={user.username === 'admin'} className="text-red-600 hover:text-red-800 font-semibold text-xs uppercase disabled:opacity-30">
                            {user.username === 'admin' ? 'Admin' : 'Supprimer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SITE IMAGES TAB ==================== */}
        {activeTab === 'site-images' && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase tracking-wide">
                  {editingSiteImage ? 'Modifier l\'image' : 'Ajouter/Modifier une image du site'}
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSiteImageSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Section</label>
                      <select
                        value={siteImageFormData.section}
                        onChange={(e) => setSiteImageFormData({...siteImageFormData, section: e.target.value})}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]"
                        disabled={!!editingSiteImage}
                      >
                        <option value="hero">Hero (Page d'accueil)</option>
                        <option value="about">À Propos</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Emplacement</label>
                      <select
                        value={siteImageFormData.image_key}
                        onChange={(e) => setSiteImageFormData({...siteImageFormData, image_key: e.target.value})}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]"
                        disabled={!!editingSiteImage}
                      >
                        <option value="">Sélectionner un emplacement</option>
                        {siteImageFormData.section === 'hero' && (
                          <>
                            <option value="hero_main">Image principale (haut gauche)</option>
                            <option value="hero_secondary">Image secondaire (bas droite)</option>
                            <option value="hero_tertiary">Image tertiaire (centre droite)</option>
                          </>
                        )}
                        {siteImageFormData.section === 'about' && (
                          <option value="about_main">Image principale</option>
                        )}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Image</label>
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#ff6b00] transition-colors cursor-pointer bg-gray-50 rounded-lg">
                      <input type="file" accept="image/*" onChange={handleSiteImageSelect} className="hidden" id="site-image-upload" />
                      <label htmlFor="site-image-upload" className="cursor-pointer">
                        {uploadingSiteImage ? (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ff6b00] animate-spin rounded-full mb-3"></div>
                            <span className="text-sm text-gray-600">Upload en cours...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <span className="text-sm text-gray-600 font-medium">Cliquez pour sélectionner une image</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  {siteImagePreview && (
                    <div className="border-4 border-white shadow-lg overflow-hidden rounded-lg">
                      <img src={siteImagePreview} alt="Preview" className="w-full h-64 object-cover" />
                    </div>
                  )}
                  
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-[#1a3a6b] mb-3">Textes alternatifs (SEO)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">🇫🇷 Français</label>
                        <input type="text" value={siteImageFormData.alt_text_fr || ''}
                          onChange={(e) => setSiteImageFormData({...siteImageFormData, alt_text_fr: e.target.value})}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#ff6b00]" placeholder="Texte alternatif FR" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">🇬🇧 English</label>
                        <input type="text" value={siteImageFormData.alt_text_en || ''}
                          onChange={(e) => setSiteImageFormData({...siteImageFormData, alt_text_en: e.target.value})}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#ff6b00]" placeholder="Alt text EN" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">🇨🇳 中文</label>
                        <input type="text" value={siteImageFormData.alt_text_zh || ''}
                          onChange={(e) => setSiteImageFormData({...siteImageFormData, alt_text_zh: e.target.value})}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#ff6b00]" placeholder="替代文本 ZH" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={uploadingSiteImage || !siteImageFormData.image_url || !siteImageFormData.image_key}
                      className="bg-[#ff6b00] text-white px-8 py-3 font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 uppercase tracking-wide text-sm rounded-lg">
                      <Save className="w-4 h-4" />
                      <span>{editingSiteImage ? 'Mettre à jour' : 'Enregistrer'}</span>
                    </button>
                    {editingSiteImage && (
                      <button type="button" onClick={resetSiteImageForm}
                        className="border-2 border-[#1a3a6b] text-[#1a3a6b] px-8 py-3 font-semibold hover:bg-[#1a3a6b] hover:text-white transition-all uppercase tracking-wide text-sm rounded-lg">
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase tracking-wide">Images actuelles du site</h2>
              </div>
              <div className="p-6">
                {SITE_IMAGE_SECTIONS.map((section) => {
                  const SectionIcon = section.icon
                  return (
                    <div key={section.section} className="mb-8 last:mb-0">
                      <div className="flex items-center gap-3 mb-4">
                        <SectionIcon className="w-5 h-5 text-[#ff6b00]" />
                        <h3 className="text-lg font-bold text-[#1a3a6b]">{section.label}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.images.map((imageConfig) => {
                          const existingImage = getSiteImageForSection(section.section, imageConfig.key)
                          return (
                            <div key={imageConfig.key} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#ff6b00] transition-all">
                              <div className="aspect-video bg-gray-100 overflow-hidden">
                                <img src={existingImage?.image_url || imageConfig.defaultUrl} alt={imageConfig.label} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-[#1a3a6b] text-sm mb-2">{imageConfig.label}</h4>
                                {existingImage ? (
                                  <div className="space-y-2">
                                    <div className="flex gap-1">
                                      {existingImage.alt_text_fr && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">FR</span>}
                                      {existingImage.alt_text_en && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">EN</span>}
                                      {existingImage.alt_text_zh && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">ZH</span>}
                                    </div>
                                    <div className="flex gap-2">
                                      <button onClick={() => editSiteImage(existingImage)} className="flex-1 bg-[#1a3a6b] text-white px-3 py-2 text-xs font-semibold hover:bg-[#1a3a6b]/90 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                                        <Edit className="w-3 h-3" /> Modifier
                                      </button>
                                      <button onClick={() => existingImage.id && deleteSiteImage(existingImage.id)} className="flex-1 bg-red-50 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-100 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                                        <Trash2 className="w-3 h-3" /> Réinitialiser
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-500">Image par défaut</p>
                                    <button onClick={() => {
                                      setEditingSiteImage(null)
                                      setSiteImageFormData({ section: section.section, image_key: imageConfig.key, image_url: '', alt_text_fr: '', alt_text_en: '', alt_text_zh: '' })
                                      setSiteImagePreview('')
                                      window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }} className="w-full bg-[#ff6b00] text-white px-3 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                                      <Plus className="w-3 h-3" /> Personnaliser
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SERVICES TAB ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase tracking-wide">
                  {editingService ? 'Modifier le service' : 'Ajouter un nouveau service'}
                </h2>
                {editingService && (
                  <button onClick={resetServiceForm} className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /><span className="text-sm">Annuler</span>
                  </button>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex gap-2 mb-6 p-2 bg-gray-50 rounded-lg">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => setActiveLanguage(lang.code)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeLanguage === lang.code ? 'bg-[#1a3a6b] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}>
                      <span>{lang.flag}</span><span>{lang.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleServiceSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Catégorie</label>
                      <input type="text" value={editingService ? editingService.category : serviceFormData.category}
                        onChange={(e) => editingService ? setEditingService({...editingService, category: e.target.value}) : setServiceFormData({...serviceFormData, category: e.target.value})}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors" placeholder="Ex: Civil, Construction, Mining..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Icône</label>
                      <select value={editingService ? editingService.icon : serviceFormData.icon}
                        onChange={(e) => editingService ? setEditingService({...editingService, icon: e.target.value}) : setServiceFormData({...serviceFormData, icon: e.target.value})}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors">
                        {SERVICE_ICONS.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-[#ff6b00]" />
                      <h3 className="text-lg font-bold text-[#1a3a6b]">
                        Traduction {LANGUAGES.find(l => l.code === activeLanguage)?.flag} {LANGUAGES.find(l => l.code === activeLanguage)?.label}
                      </h3>
                    </div>
                    {(() => {
                      const translation = getTranslation(activeLanguage)
                      return (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
                            <input type="text" value={translation.title} onChange={(e) => updateTranslation(activeLanguage, 'title', e.target.value)}
                              className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors" required />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description courte</label>
                            <textarea value={translation.description} onChange={(e) => updateTranslation(activeLanguage, 'description', e.target.value)} rows={3}
                              className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors resize-none" required />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description détaillée</label>
                            <textarea value={translation.detailed_description || ''} onChange={(e) => updateTranslation(activeLanguage, 'detailed_description', e.target.value)} rows={6}
                              className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00] transition-colors resize-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Caractéristiques</label>
                            <div className="flex gap-2 mb-3">
                              <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
                                className="flex-1 border-2 border-gray-200 px-4 py-2 focus:outline-none focus:border-[#ff6b00]"
                                placeholder={`Ajouter une caractéristique en ${LANGUAGES.find(l => l.code === activeLanguage)?.label}...`}
                                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(activeLanguage) }}} />
                              <button type="button" onClick={() => addFeature(activeLanguage)} className="bg-[#ff6b00] text-white px-4 py-2 hover:bg-orange-600 transition-colors">
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="space-y-2">
                              {(getTranslation(activeLanguage).features || []).map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-200 rounded">
                                  <CheckCircle className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
                                  <span className="flex-1 text-sm">{feature}</span>
                                  <button type="button" onClick={() => removeFeature(activeLanguage, index)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Images du service</label>
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#ff6b00] transition-colors cursor-pointer bg-gray-50 rounded-lg">
                      <input type="file" accept="image/*" multiple
                        onChange={async (e) => {
                          const files = e.target.files
                          if (!files) return
                          for (let file of Array.from(files)) {
                            try {
                              const imageUrl = await uploadServiceImage(file)
                              const newImage: ServiceImage = { image_url: imageUrl, alt_text_fr: '', alt_text_en: '', alt_text_zh: '', sort_order: serviceImages.length }
                              setServiceImages([...serviceImages, newImage])
                              if (editingService) setEditingService({...editingService, images: [...editingService.images, newImage]})
                            } catch (error) { console.error('Error uploading image:', error); alert('Erreur lors de l\'upload de l\'image') }
                          }
                        }}
                        className="hidden" id="service-images-upload" />
                      <label htmlFor="service-images-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <span className="text-sm text-gray-600 font-medium">Cliquez pour ajouter des images</span>
                      </label>
                    </div>
                    {serviceImages.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                        {serviceImages.map((image, index) => (
                          <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                            <img src={image.image_url} alt="" className="w-full h-24 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button type="button" onClick={() => {
                                const newImages = serviceImages.filter((_, i) => i !== index)
                                setServiceImages(newImages)
                                if (editingService) setEditingService({...editingService, images: newImages})
                              }} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <div className="p-2 bg-gray-50 space-y-1">
                              <input type="text" placeholder="Alt FR" value={image.alt_text_fr || ''} onChange={(e) => {
                                const newImages = [...serviceImages]; newImages[index] = { ...newImages[index], alt_text_fr: e.target.value }
                                setServiceImages(newImages); if (editingService) setEditingService({...editingService, images: newImages})
                              }} className="w-full text-xs border px-2 py-1 rounded" />
                              <input type="text" placeholder="Alt EN" value={image.alt_text_en || ''} onChange={(e) => {
                                const newImages = [...serviceImages]; newImages[index] = { ...newImages[index], alt_text_en: e.target.value }
                                setServiceImages(newImages); if (editingService) setEditingService({...editingService, images: newImages})
                              }} className="w-full text-xs border px-2 py-1 rounded" />
                              <input type="text" placeholder="Alt ZH" value={image.alt_text_zh || ''} onChange={(e) => {
                                const newImages = [...serviceImages]; newImages[index] = { ...newImages[index], alt_text_zh: e.target.value }
                                setServiceImages(newImages); if (editingService) setEditingService({...editingService, images: newImages})
                              }} className="w-full text-xs border px-2 py-1 rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-[#ff6b00] text-white px-8 py-3 font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg uppercase tracking-wide text-sm rounded-lg">
                      <Save className="w-4 h-4" /><span>{editingService ? 'Mettre à jour' : 'Ajouter'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase tracking-wide">Services disponibles</h2>
                <span className="text-sm font-semibold text-[#ff6b00]">{services.length} service{services.length > 1 ? 's' : ''}</span>
              </div>
              {loading ? (
                <div className="p-12 text-center"><div className="w-8 h-8 border-4 border-gray-200 border-t-[#ff6b00] animate-spin mx-auto"></div></div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => {
                      const frTranslation = service.translations.find(t => t.language === 'fr')
                      return (
                        <div key={service.id} className="group border-2 border-gray-200 hover:border-[#ff6b00] transition-all bg-white hover:shadow-lg p-5 rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#ff6b00]/10 flex items-center justify-center flex-shrink-0 text-[#ff6b00] rounded-lg">{getIcon(service.icon)}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[#1a3a6b]">{frTranslation?.title || 'Sans titre'}</h4>
                              <div className="flex gap-1 mt-1">
                                {service.translations.map(t => (
                                  <span key={t.language} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{LANGUAGES.find(l => l.code === t.language)?.flag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{frTranslation?.description}</p>
                          {service.images.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {service.images.slice(0, 3).map((img, i) => <img key={i} src={img.image_url} alt="" className="w-8 h-8 object-cover rounded" />)}
                              {service.images.length > 3 && <span className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">+{service.images.length - 3}</span>}
                            </div>
                          )}
                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                            <button onClick={() => editService(service)} className="flex-1 bg-[#1a3a6b] text-white px-3 py-2 text-xs font-semibold hover:bg-[#1a3a6b]/90 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                              <Edit className="w-3 h-3" /> Modifier
                            </button>
                            <button onClick={() => service.id && deleteService(service.id)} className="flex-1 bg-red-50 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-100 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                              <Trash2 className="w-3 h-3" /> Supprimer
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {services.length === 0 && (
                    <div className="text-center py-16">
                      <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-semibold uppercase">Aucun service</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== PARTNERS TAB ==================== */}
        {activeTab === 'partners' && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase tracking-wide">
                  {editingPartner ? 'Modifier le partenaire' : 'Ajouter un nouveau partenaire'}
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handlePartnerSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Nom</label>
                      <input type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Site web</label>
                      <input type="url" value={partnerWebsite} onChange={(e) => setPartnerWebsite(e.target.value)}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]" placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Logo</label>
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#ff6b00] transition-colors cursor-pointer bg-gray-50 rounded-lg">
                      <input type="file" accept="image/*" onChange={handlePartnerLogoSelect} className="hidden" id="partner-logo-upload" />
                      <label htmlFor="partner-logo-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <span className="text-sm text-gray-600">{selectedPartnerLogo ? selectedPartnerLogo.name : 'Sélectionner un logo'}</span>
                      </label>
                    </div>
                  </div>
                  {partnerLogoPreview && (
                    <div className="border-4 border-white shadow-lg overflow-hidden w-32 h-32 mx-auto rounded-lg">
                      <img src={partnerLogoPreview} alt="Logo preview" className="w-full h-full object-contain bg-white p-2" />
                    </div>
                  )}
                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={uploadingPartner}
                      className="bg-[#ff6b00] text-white px-8 py-3 font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 uppercase tracking-wide text-sm rounded-lg">
                      <Upload className="w-4 h-4" /><span>{uploadingPartner ? 'Envoi...' : editingPartner ? 'Mettre à jour' : 'Ajouter'}</span>
                    </button>
                    {editingPartner && (
                      <button type="button" onClick={resetPartnerForm}
                        className="border-2 border-[#1a3a6b] text-[#1a3a6b] px-8 py-3 font-semibold hover:bg-[#1a3a6b] hover:text-white transition-all uppercase tracking-wide text-sm rounded-lg">Annuler</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase">Partenaires</h2>
                <span className="text-sm font-semibold text-[#ff6b00]">{partners.length} partenaire{partners.length > 1 ? 's' : ''}</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {partners.map((partner) => (
                    <div key={partner.id} className="group border-2 border-gray-200 hover:border-[#ff6b00] transition-all bg-white hover:shadow-lg p-6 text-center rounded-lg">
                      <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center p-4 mb-4">
                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <h4 className="font-bold text-[#1a3a6b] text-sm">{partner.name}</h4>
                      {partner.website && <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Visiter</a>}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button onClick={() => editPartner(partner)} className="flex-1 bg-[#1a3a6b] text-white px-3 py-2 text-xs font-semibold hover:bg-[#1a3a6b]/90 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                          <Edit className="w-3 h-3" /> Modifier
                        </button>
                        <button onClick={() => partner.id && deletePartner(partner.id)} className="flex-1 bg-red-50 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-100 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                          <Trash2 className="w-3 h-3" /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {partners.length === 0 && (
                  <div className="text-center py-16">
                    <Handshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold uppercase">Aucun partenaire</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== GALLERY TAB (avec traductions) ==================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase">
                  {editingImage ? 'Modifier l\'image' : 'Ajouter une nouvelle image'}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="flex gap-2 mb-6 p-2 bg-gray-50 rounded-lg">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => setActiveLanguage(lang.code)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeLanguage === lang.code ? 'bg-[#1a3a6b] text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}>
                      <span>{lang.flag}</span><span>{lang.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">
                        Titre ({LANGUAGES.find(l => l.code === activeLanguage)?.flag})
                      </label>
                      <input type="text" 
                        value={activeLanguage === 'fr' ? title : activeLanguage === 'en' ? titleEn : titleZh} 
                        onChange={(e) => {
                          if (activeLanguage === 'fr') setTitle(e.target.value)
                          else if (activeLanguage === 'en') setTitleEn(e.target.value)
                          else setTitleZh(e.target.value)
                        }}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">
                        Catégorie ({LANGUAGES.find(l => l.code === activeLanguage)?.flag})
                      </label>
                      <select 
                        value={activeLanguage === 'fr' ? category : activeLanguage === 'en' ? categoryEn : categoryZh} 
                        onChange={(e) => {
                          if (activeLanguage === 'fr') setCategory(e.target.value)
                          else if (activeLanguage === 'en') setCategoryEn(e.target.value)
                          else setCategoryZh(e.target.value)
                        }}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]">
                        {GALLERY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">
                      Description ({LANGUAGES.find(l => l.code === activeLanguage)?.flag})
                    </label>
                    <textarea 
                      value={activeLanguage === 'fr' ? description : activeLanguage === 'en' ? descriptionEn : descriptionZh} 
                      onChange={(e) => {
                        if (activeLanguage === 'fr') setDescription(e.target.value)
                        else if (activeLanguage === 'en') setDescriptionEn(e.target.value)
                        else setDescriptionZh(e.target.value)
                      }}
                      rows={3}
                      className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00] resize-none" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Image</label>
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#ff6b00] transition-colors cursor-pointer bg-gray-50 rounded-lg">
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <span className="text-sm text-gray-600">{selectedFile ? selectedFile.name : 'Sélectionner une image'}</span>
                      </label>
                    </div>
                  </div>
                  
                  {previewUrl && (
                    <div className="border-4 border-white shadow-lg overflow-hidden rounded-lg">
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={uploading}
                      className="bg-[#ff6b00] text-white px-8 py-3 font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 uppercase tracking-wide text-sm rounded-lg">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Envoi...' : editingImage ? 'Mettre à jour' : 'Publier'}</span>
                    </button>
                    {editingImage && (
                      <button type="button" onClick={resetGalleryForm}
                        className="border-2 border-[#1a3a6b] text-[#1a3a6b] px-8 py-3 font-semibold hover:bg-[#1a3a6b] hover:text-white transition-all uppercase tracking-wide text-sm rounded-lg">Annuler</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase">Images de la galerie</h2>
                <span className="text-sm font-semibold text-[#ff6b00]">{galleryImages.length} image{galleryImages.length > 1 ? 's' : ''}</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="group border-2 border-gray-200 hover:border-[#ff6b00] transition-all overflow-hidden bg-white hover:shadow-lg rounded-lg">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={image.image_url} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-[#1a3a6b]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <button onClick={() => editImage(image)} className="bg-white text-[#1a3a6b] p-3 hover:bg-[#ff6b00] hover:text-white transition-all shadow-lg rounded-lg"><Edit className="w-5 h-5" /></button>
                          <button onClick={() => deleteImage(image)} className="bg-white text-red-600 p-3 hover:bg-red-600 hover:text-white transition-all shadow-lg rounded-lg"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </div>
                      <div className="p-5">
                        <span className="inline-block bg-[#ff6b00]/10 text-[#ff6b00] text-xs font-bold uppercase tracking-wider px-3 py-1 mb-3 rounded">
                          {image.category_fr || image.category}
                        </span>
                        <h3 className="text-base font-bold text-[#1a3a6b] mb-2">{image.title_fr || image.title}</h3>
                        <div className="flex gap-1 mb-2">
                          {image.title_fr && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">FR ✓</span>}
                          {image.title_en && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">EN ✓</span>}
                          {image.title_zh && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">ZH ✓</span>}
                        </div>
                        {(image.description_fr || image.description) && (
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{image.description_fr || image.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {galleryImages.length === 0 && (
                  <div className="text-center py-16">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold uppercase">Aucune image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== DOCUMENTS TAB ==================== */}
        {activeTab === 'documents' && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase">{editingDocument ? 'Modifier le document' : 'Ajouter un nouveau document'}</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleDocumentUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Nom</label>
                      <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Catégorie</label>
                      <select value={docCategory} onChange={(e) => setDocCategory(e.target.value)}
                        className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#ff6b00]">
                        {DOCUMENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3a6b] uppercase mb-2">Fichier (PDF, DOC, DOCX, XLS, XLSX)</label>
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#ff6b00] transition-colors cursor-pointer bg-gray-50 rounded-lg">
                      <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleDocFileSelect} className="hidden" id="doc-file-upload" />
                      <label htmlFor="doc-file-upload" className="cursor-pointer">
                        <File className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <span className="text-sm text-gray-600">{selectedDocFile ? selectedDocFile.name : 'Sélectionner un document'}</span>
                        {selectedDocFile && <span className="block text-xs text-gray-400 mt-1">{formatFileSize(selectedDocFile.size)}</span>}
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={uploadingDoc}
                      className="bg-[#ff6b00] text-white px-8 py-3 font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 uppercase tracking-wide text-sm rounded-lg">
                      <Upload className="w-4 h-4" /><span>{uploadingDoc ? 'Envoi...' : editingDocument ? 'Mettre à jour' : 'Publier'}</span>
                    </button>
                    {editingDocument && (
                      <button type="button" onClick={resetDocumentForm}
                        className="border-2 border-[#1a3a6b] text-[#1a3a6b] px-8 py-3 font-semibold hover:bg-[#1a3a6b] hover:text-white transition-all uppercase tracking-wide text-sm rounded-lg">Annuler</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#1a3a6b] uppercase">Documents disponibles</h2>
                <span className="text-sm font-semibold text-[#ff6b00]">{documents.length} document{documents.length > 1 ? 's' : ''}</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="group border-2 border-gray-200 hover:border-[#ff6b00] transition-all bg-white hover:shadow-lg p-5 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-50 flex items-center justify-center flex-shrink-0 rounded-lg">
                          <FileText className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#1a3a6b] text-sm truncate">{doc.name}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 px-2 py-0.5 font-medium rounded">{doc.type}</span>
                            <span className="text-xs text-gray-500">{doc.size}</span>
                          </div>
                          <span className="inline-block bg-[#ff6b00]/10 text-[#ff6b00] text-xs font-bold uppercase px-2 py-0.5 mt-2 rounded">{doc.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button onClick={() => editDocument(doc)} className="flex-1 bg-[#1a3a6b] text-white px-3 py-2 text-xs font-semibold hover:bg-[#1a3a6b]/90 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                          <Edit className="w-3 h-3" /> Modifier
                        </button>
                        <button onClick={() => deleteDocument(doc)} className="flex-1 bg-red-50 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-100 transition-colors uppercase flex items-center justify-center gap-1 rounded">
                          <Trash2 className="w-3 h-3" /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {documents.length === 0 && (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold uppercase">Aucun document</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}