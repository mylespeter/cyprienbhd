

// 'use client'

// import { createContext, useContext, useState, ReactNode } from 'react'

// export type Language = 'fr' | 'en' | 'zh'

// interface Translations {
//   nav: {
//     home: string
//     about: string
//     services: string
//     gallery: string
//     documents: string
//     contact: string
//     quoteBtn: string
//     location: string
//   }
//   hero: {
//     badge: string
//     title1: string
//     title2: string
//     title3: string
//     title4: string
//     description: string
//     highlights: string[]
//     servicesBtn: string
//     contactBtn: string
//     projectsDone: string
//     yearsExp: string
//     stats: string[]
//   }
//   about: {
//     title: string
//     description: string
//     items: string[]
//   }
//   services: {
//     title: string
//     subtitle: string
//     list: {
//       title: string
//       desc: string
//     }[]
//   }
//   gallery: {
//     title: string
//     subtitle: string
//     categories: string[]
//     noImages: string
//   }
//   documents: {
//     title: string
//     subtitle: string
//     searchPlaceholder: string
//     categories: string[]
//     noDocuments: string
//   }
//   stats: {
//     badge: string
//     title: string
//     list: {
//       label: string
//       desc: string
//     }[]
//     bottomText: string
//   }
// }

// const translationsData: Record<Language, Translations> = {
//   fr: {
//     nav: {
//       home: 'Accueil',
//       about: 'À Propos',
//       services: 'Services',
//       gallery: 'Galerie',
//       documents: 'Documents',
//       contact: 'Contact',
//       quoteBtn: 'Devis',
//       location: 'Lubumbashi, Haut-Katanga, RDC',
//     },
//     hero: {
//       badge: 'Basé à Lubumbashi, RDC',
//       title1: "L'Excellence en",
//       title2: 'Ingénierie',
//       title3: 'pour les Mines &',
//       title4: 'les Infrastructures',
//       description: 'Génie civil, expertise géotechnique et services industriels livrés selon les normes internationales à travers la République Démocratique du Congo.',
//       highlights: ['Ingénieurs Qualifiés', 'Sécurité ', 'Qualité Garantie'],
//       servicesBtn: 'Nos Services',
//       contactBtn: 'Contactez-Nous',
//       projectsDone: 'Projets Réalisés',
//       yearsExp: "Ans d'Exp.",
//       stats: ["Ans d'Expérience", 'Projets Réalisés', "Membres d'Équipe", 'Satisfaction'],
//     },
//     about: {
//       title: 'À Propos de SYLWAK INVESTMENT',
//       description: 'Fondée en 2023 à Lubumbashi, SYLWAK INVESTMENT SARL fournit des services de génie civil, des services miniers et des solutions industrielles de haute qualité à travers la République Démocratique du Congo.',
//       items: [
//         'Ingénieurs et personnel technique expérimentés',
//         'Normes de qualité internationales',
//         'Équipements et technologie modernes',
//         'Approche sécurité avant tout',
//         'Livraison des projets dans les délais',
//       ],
//     },
//     services: {
//       title: 'Nos Services',
//       subtitle: 'Services complets d\'ingénierie et industriels pour les projets miniers et d\'infrastructure.',
//       list: [
//         { title: 'Génie Civil', desc: 'Solutions complètes d\'infrastructure et structurelles' },
//         { title: 'Construction Routière', desc: 'Routes, pistes minières, revêtement en asphalte' },
//         { title: 'Services Miniers', desc: 'Préparation de site et installations de support' },
//         { title: 'Laboratoire Géotechnique', desc: 'Tests de sol et analyse des matériaux' },
//         { title: 'Services Industriels', desc: 'Nettoyage, maintenance, support technique' },
//         { title: 'Électricité', desc: 'Éclairage de site et systèmes électriques' },
//         { title: 'Fourniture de Matériaux', desc: 'Matériaux de construction et équipements' },
//         { title: 'Transport', desc: 'Location de camions, bus, logistique' },
//       ],
//     },
//     gallery: {
//       title: 'Nos Réalisations',
//       subtitle: 'Découvrez nos projets réalisés à travers la RDC.',
//       categories: ['Tout', 'Construction', 'Minier', 'Électricité', 'Industriel', 'Laboratoire'],
//       noImages: 'Aucune image dans cette catégorie',
//     },
//     documents: {
//       title: 'Documents & Certifications',
//       subtitle: 'Téléchargez nos documents d\'entreprise, certifications et capacités techniques.',
//       searchPlaceholder: 'Rechercher des documents...',
//       categories: ['Tout', 'Entreprise', 'Légal', 'Qualité', 'Sécurité', 'Technique'],
//       noDocuments: 'Aucun document trouvé',
//     },
//     stats: {
//       badge: 'En Chiffres',
//       title: 'Notre Parcours',
//       list: [
//         { label: "Ans d'Expérience", desc: 'Au service depuis 2023' },
//         { label: 'Projets Réalisés', desc: 'À travers la RDC' },
//         { label: "Membres d'Équipe", desc: 'Personnel qualifié' },
//         { label: 'Clients Satisfaits', desc: 'Partenaires de confiance' },
//       ],
//       bottomText: 'Toujours plus fort chaque année avec un engagement envers l\'excellence',
//     },
//   },
//   en: {
//     nav: {
//       home: 'Home',
//       about: 'About',
//       services: 'Services',
//       gallery: 'Gallery',
//       documents: 'Documents',
//       contact: 'Contact',
//       quoteBtn: 'Get a Quote',
//       location: 'Lubumbashi, Haut-Katanga, DRC',
//     },
//     hero: {
//       badge: 'Based in Lubumbashi, DRC',
//       title1: 'Engineering',
//       title2: 'Excellence',
//       title3: 'for Mining &',
//       title4: 'Infrastructure',
//       description: 'Civil engineering, geotechnical expertise, and industrial services delivered with international standards across the Democratic Republic of Congo.',
//       highlights: ['Qualified Engineers', 'Safety First', 'Quality Assured'],
//       servicesBtn: 'Our Services',
//       contactBtn: 'Contact Us',
//       projectsDone: 'Projects Done',
//       yearsExp: 'Years Exp.',
//       stats: ['Years Experience', 'Projects Done', 'Team Members', 'Satisfaction'],
//     },
//     about: {
//       title: 'About SYLWAK INVESTMENT',
//       description: 'Founded in 2023 in Lubumbashi, SYLWAK INVESTMENT SARL delivers high-quality civil engineering, mining services, and industrial solutions across the Democratic Republic of Congo.',
//       items: [
//         'Experienced engineers and technical staff',
//         'International quality standards',
//         'Modern equipment and technology',
//         'Safety-first approach',
//         'On-time project delivery',
//       ],
//     },
//     services: {
//       title: 'Our Services',
//       subtitle: 'Comprehensive engineering and industrial services for mining and infrastructure projects.',
//       list: [
//         { title: 'Civil Engineering', desc: 'Complete infrastructure and structural solutions' },
//         { title: 'Road Construction', desc: 'Highways, mining roads, asphalt paving' },
//         { title: 'Mining Services', desc: 'Site preparation and support facilities' },
//         { title: 'Geotechnical Lab', desc: 'Soil testing and material analysis' },
//         { title: 'Industrial Services', desc: 'Cleaning, maintenance, technical support' },
//         { title: 'Electrical', desc: 'Site lighting and power systems' },
//         { title: 'Materials Supply', desc: 'Construction materials and equipment' },
//         { title: 'Transport', desc: 'Truck rental, bus services, logistics' },
//       ],
//     },
//     gallery: {
//       title: 'Our Realizations',
//       subtitle: 'Discover our completed projects across the DRC.',
//       categories: ['All', 'Construction', 'Mining', 'Electrical', 'Industrial', 'Laboratory'],
//       noImages: 'No images in this category',
//     },
//     documents: {
//       title: 'Documents & Certifications',
//       subtitle: 'Download our company documents, certifications, and technical capabilities.',
//       searchPlaceholder: 'Search documents...',
//       categories: ['All', 'Company', 'Legal', 'Quality', 'Safety', 'Technical'],
//       noDocuments: 'No documents found',
//     },
//     stats: {
//       badge: 'By the Numbers',
//       title: 'Our Track Record',
//       list: [
//         { label: 'Years Experience', desc: 'Serving since 2023' },
//         { label: 'Projects Done', desc: 'Across DRC' },
//         { label: 'Team Members', desc: 'Qualified staff' },
//         { label: 'Happy Clients', desc: 'Trusted partners' },
//       ],
//       bottomText: 'Growing stronger every year with commitment to excellence',
//     },
//   },
//   zh: {
//     nav: {
//       home: '首页',
//       about: '关于我们',
//       services: '服务',
//       gallery: '画廊',
//       documents: '文件',
//       contact: '联系我们',
//       quoteBtn: '获取报价',
//       location: '刚果民主共和国，上加丹加省，卢本巴希',
//     },
//     hero: {
//       badge: '位于刚果民主共和国卢本巴希',
//       title1: '矿业与基础设施',
//       title2: '工程',
//       title3: '卓越',
//       title4: '',
//       description: '在刚果民主共和国全境提供符合国际标准的土木工程、岩土工程专业知识和工业服务。',
//       highlights: ['资质工程师', '安全第一', '质量保证'],
//       servicesBtn: '我们的服务',
//       contactBtn: '联系我们',
//       projectsDone: '已完成项目',
//       yearsExp: '年经验',
//       stats: ['年经验', '已完成项目', '团队成员', '客户满意度'],
//     },
//     about: {
//       title: '关于 SYLWAK INVESTMENT',
//       description: 'SYLWAK INVESTMENT SARL 于2023年在卢本巴希成立，在刚果民主共和国全境提供高质量的土木工程、采矿服务和工业解决方案。',
//       items: [
//         '经验丰富的工程师和技术人员',
//         '国际质量标准',
//         '现代化设备与技术',
//         '安全第一的方针',
//         '按时交付项目',
//       ],
//     },
//     services: {
//       title: '我们的服务',
//       subtitle: '为采矿和基础设施项目提供全面的工程和工业服务。',
//       list: [
//         { title: '土木工程', desc: '完整的基础设施和结构解决方案' },
//         { title: '道路建设', desc: '公路、矿区道路、沥青铺设' },
//         { title: '采矿服务', desc: '场地准备和支持设施' },
//         { title: '岩土实验室', desc: '土壤测试和材料分析' },
//         { title: '工业服务', desc: '清洁、维护、技术支持' },
//         { title: '电气工程', desc: '现场照明和电力系统' },
//         { title: '材料供应', desc: '建筑材料和设备' },
//         { title: '运输', desc: '卡车租赁、巴士服务、物流' },
//       ],
//     },
//     gallery: {
//       title: '我们的成就',
//       subtitle: '探索我们在刚果民主共和国各地完成的项目。',
//       categories: ['全部', '建筑', '采矿', '电气', '工业', '实验室'],
//       noImages: '此类别中没有图片',
//     },
//     documents: {
//       title: '文件与认证',
//       subtitle: '下载我们的公司文件、认证和技术能力资料。',
//       searchPlaceholder: '搜索文件...',
//       categories: ['全部', '公司', '法律', '质量', '安全', '技术'],
//       noDocuments: '未找到文件',
//     },
//     stats: {
//       badge: '数据概览',
//       title: '我们的业绩',
//       list: [
//         { label: '年经验', desc: '自2023年起服务' },
//         { label: '已完成项目', desc: '遍布刚果民主共和国' },
//         { label: '团队成员', desc: '资质人员' },
//         { label: '满意客户', desc: '值得信赖的合作伙伴' },
//       ],
//       bottomText: '以卓越为承诺，每年不断壮大',
//     },
//   },
// }

// interface LanguageContextType {
//   language: Language
//   setLanguage: (lang: Language) => void
//   t: Translations
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguage] = useState<Language>('fr')

//   const value = {
//     language,
//     setLanguage,
//     t: translationsData[language],
//   }

//   return (
//     <LanguageContext.Provider value={value}>
//       {children}
//     </LanguageContext.Provider>
//   )
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext)
//   if (context === undefined) {
//     throw new Error('useLanguage must be used within a LanguageProvider')
//   }
//   return context
// }

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'fr' | 'en' | 'zh'

interface Translations {
  nav: {
    home: string
    about: string
    services: string
    gallery: string
    documents: string
    contact: string
    quoteBtn: string
    location: string
  }
  hero: {
    badge: string
    title1: string
    title2: string
    title3: string
    title4: string
    description: string
    highlights: string[]
    servicesBtn: string
    contactBtn: string
    projectsDone: string
    yearsExp: string
    stats: string[]
  }
  about: {
    title: string
    description: string
    items: string[]
  }
  services: {
    title: string
    subtitle: string
    list: {
      title: string
      desc: string
    }[]
  }
  gallery: {
    title: string
    subtitle: string
    categories: string[]
    noImages: string
  }
  documents: {
    title: string
    subtitle: string
    searchPlaceholder: string
    categories: string[]
    noDocuments: string
  }
  stats: {
    badge: string
    title: string
    list: {
      label: string
      desc: string
    }[]
    bottomText: string
  }
  partners: {
    title: string
    subtitle: string
  }
}

const translationsData: Record<Language, Translations> = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À Propos',
      services: 'Services',
      gallery: 'Galerie',
      documents: 'Documents',
      contact: 'Contact',
      quoteBtn: 'Devis',
      location: 'Lubumbashi, Haut-Katanga, RDC',
    },
    hero: {
      badge: 'Basé à Lubumbashi, RDC',
      title1: "L'Excellence en",
      title2: 'Ingénierie',
      title3: 'pour les Mines &',
      title4: 'les Infrastructures',
      description: 'Génie civil, expertise géotechnique et services industriels livrés selon les normes internationales à travers la République Démocratique du Congo.',
      highlights: ['Ingénieurs Qualifiés', 'Sécurité ', 'Qualité Garantie'],
      servicesBtn: 'Nos Services',
      contactBtn: 'Contactez-Nous',
      projectsDone: 'Projets Réalisés',
      yearsExp: "Ans d'Exp.",
      stats: ["Ans d'Expérience", 'Projets Réalisés', "Membres d'Équipe", 'Satisfaction'],
    },
    about: {
      title: 'À Propos de SYLWAK INVESTMENT',
      description: 'Fondée en 2023 à Lubumbashi, SYLWAK INVESTMENT SARL fournit des services de génie civil, des services miniers et des solutions industrielles de haute qualité à travers la République Démocratique du Congo.',
      items: [
        'Ingénieurs et personnel technique expérimentés',
        'Normes de qualité internationales',
        'Équipements et technologie modernes',
        'Approche sécurité avant tout',
        'Livraison des projets dans les délais',
      ],
    },
    services: {
      title: 'Nos Services',
      subtitle: 'Services complets d\'ingénierie et industriels pour les projets miniers et d\'infrastructure.',
      list: [
        { title: 'Génie Civil', desc: 'Solutions complètes d\'infrastructure et structurelles' },
        { title: 'Construction Routière', desc: 'Routes, pistes minières, revêtement en asphalte' },
        { title: 'Services Miniers', desc: 'Préparation de site et installations de support' },
        { title: 'Laboratoire Géotechnique', desc: 'Tests de sol et analyse des matériaux' },
        { title: 'Services Industriels', desc: 'Nettoyage, maintenance, support technique' },
        { title: 'Électricité', desc: 'Éclairage de site et systèmes électriques' },
        { title: 'Fourniture de Matériaux', desc: 'Matériaux de construction et équipements' },
        { title: 'Transport', desc: 'Location de camions, bus, logistique' },
      ],
    },
    gallery: {
      title: 'Nos Réalisations',
      subtitle: 'Découvrez nos projets réalisés à travers la RDC.',
      categories: ['Tout', 'Construction', 'Minier', 'Électricité', 'Industriel', 'Laboratoire'],
      noImages: 'Aucune image dans cette catégorie',
    },
    documents: {
      title: 'Documents & Certifications',
      subtitle: 'Téléchargez nos documents d\'entreprise, certifications et capacités techniques.',
      searchPlaceholder: 'Rechercher des documents...',
      categories: ['Tout', 'Entreprise', 'Légal', 'Qualité', 'Sécurité', 'Technique'],
      noDocuments: 'Aucun document trouvé',
    },
    stats: {
      badge: 'En Chiffres',
      title: 'Notre Parcours',
      list: [
        { label: "Ans d'Expérience", desc: 'Au service depuis 2023' },
        { label: 'Projets Réalisés', desc: 'À travers la RDC' },
        { label: "Membres d'Équipe", desc: 'Personnel qualifié' },
        { label: 'Clients Satisfaits', desc: 'Partenaires de confiance' },
      ],
      bottomText: 'Toujours plus fort chaque année avec un engagement envers l\'excellence',
    },
    partners: {
      title: 'Ils nous font confiance',
      subtitle: 'Nos partenaires de confiance',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      gallery: 'Gallery',
      documents: 'Documents',
      contact: 'Contact',
      quoteBtn: 'Get a Quote',
      location: 'Lubumbashi, Haut-Katanga, DRC',
    },
    hero: {
      badge: 'Based in Lubumbashi, DRC',
      title1: 'Engineering',
      title2: 'Excellence',
      title3: 'for Mining &',
      title4: 'Infrastructure',
      description: 'Civil engineering, geotechnical expertise, and industrial services delivered with international standards across the Democratic Republic of Congo.',
      highlights: ['Qualified Engineers', 'Safety First', 'Quality Assured'],
      servicesBtn: 'Our Services',
      contactBtn: 'Contact Us',
      projectsDone: 'Projects Done',
      yearsExp: 'Years Exp.',
      stats: ['Years Experience', 'Projects Done', 'Team Members', 'Satisfaction'],
    },
    about: {
      title: 'About SYLWAK INVESTMENT',
      description: 'Founded in 2023 in Lubumbashi, SYLWAK INVESTMENT SARL delivers high-quality civil engineering, mining services, and industrial solutions across the Democratic Republic of Congo.',
      items: [
        'Experienced engineers and technical staff',
        'International quality standards',
        'Modern equipment and technology',
        'Safety-first approach',
        'On-time project delivery',
      ],
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive engineering and industrial services for mining and infrastructure projects.',
      list: [
        { title: 'Civil Engineering', desc: 'Complete infrastructure and structural solutions' },
        { title: 'Road Construction', desc: 'Highways, mining roads, asphalt paving' },
        { title: 'Mining Services', desc: 'Site preparation and support facilities' },
        { title: 'Geotechnical Lab', desc: 'Soil testing and material analysis' },
        { title: 'Industrial Services', desc: 'Cleaning, maintenance, technical support' },
        { title: 'Electrical', desc: 'Site lighting and power systems' },
        { title: 'Materials Supply', desc: 'Construction materials and equipment' },
        { title: 'Transport', desc: 'Truck rental, bus services, logistics' },
      ],
    },
    gallery: {
      title: 'Our Realizations',
      subtitle: 'Discover our completed projects across the DRC.',
      categories: ['All', 'Construction', 'Mining', 'Electrical', 'Industrial', 'Laboratory'],
      noImages: 'No images in this category',
    },
    documents: {
      title: 'Documents & Certifications',
      subtitle: 'Download our company documents, certifications, and technical capabilities.',
      searchPlaceholder: 'Search documents...',
      categories: ['All', 'Company', 'Legal', 'Quality', 'Safety', 'Technical'],
      noDocuments: 'No documents found',
    },
    stats: {
      badge: 'By the Numbers',
      title: 'Our Track Record',
      list: [
        { label: 'Years Experience', desc: 'Serving since 2023' },
        { label: 'Projects Done', desc: 'Across DRC' },
        { label: 'Team Members', desc: 'Qualified staff' },
        { label: 'Happy Clients', desc: 'Trusted partners' },
      ],
      bottomText: 'Growing stronger every year with commitment to excellence',
    },
    partners: {
      title: 'They trust us',
      subtitle: 'Our trusted partners',
    },
  },
  zh: {
    nav: {
      home: '首页',
      about: '关于我们',
      services: '服务',
      gallery: '画廊',
      documents: '文件',
      contact: '联系我们',
      quoteBtn: '获取报价',
      location: '刚果民主共和国，上加丹加省，卢本巴希',
    },
    hero: {
      badge: '位于刚果民主共和国卢本巴希',
      title1: '矿业与基础设施',
      title2: '工程',
      title3: '卓越',
      title4: '',
      description: '在刚果民主共和国全境提供符合国际标准的土木工程、岩土工程专业知识和工业服务。',
      highlights: ['资质工程师', '安全第一', '质量保证'],
      servicesBtn: '我们的服务',
      contactBtn: '联系我们',
      projectsDone: '已完成项目',
      yearsExp: '年经验',
      stats: ['年经验', '已完成项目', '团队成员', '客户满意度'],
    },
    about: {
      title: '关于 SYLWAK INVESTMENT',
      description: 'SYLWAK INVESTMENT SARL 于2023年在卢本巴希成立，在刚果民主共和国全境提供高质量的土木工程、采矿服务和工业解决方案。',
      items: [
        '经验丰富的工程师和技术人员',
        '国际质量标准',
        '现代化设备与技术',
        '安全第一的方针',
        '按时交付项目',
      ],
    },
    services: {
      title: '我们的服务',
      subtitle: '为采矿和基础设施项目提供全面的工程和工业服务。',
      list: [
        { title: '土木工程', desc: '完整的基础设施和结构解决方案' },
        { title: '道路建设', desc: '公路、矿区道路、沥青铺设' },
        { title: '采矿服务', desc: '场地准备和支持设施' },
        { title: '岩土实验室', desc: '土壤测试和材料分析' },
        { title: '工业服务', desc: '清洁、维护、技术支持' },
        { title: '电气工程', desc: '现场照明和电力系统' },
        { title: '材料供应', desc: '建筑材料和设备' },
        { title: '运输', desc: '卡车租赁、巴士服务、物流' },
      ],
    },
    gallery: {
      title: '我们的成就',
      subtitle: '探索我们在刚果民主共和国各地完成的项目。',
      categories: ['全部', '建筑', '采矿', '电气', '工业', '实验室'],
      noImages: '此类别中没有图片',
    },
    documents: {
      title: '文件与认证',
      subtitle: '下载我们的公司文件、认证和技术能力资料。',
      searchPlaceholder: '搜索文件...',
      categories: ['全部', '公司', '法律', '质量', '安全', '技术'],
      noDocuments: '未找到文件',
    },
    stats: {
      badge: '数据概览',
      title: '我们的业绩',
      list: [
        { label: '年经验', desc: '自2023年起服务' },
        { label: '已完成项目', desc: '遍布刚果民主共和国' },
        { label: '团队成员', desc: '资质人员' },
        { label: '满意客户', desc: '值得信赖的合作伙伴' },
      ],
      bottomText: '以卓越为承诺，每年不断壮大',
    },
    partners: {
      title: '他们信任我们',
      subtitle: '我们值得信赖的合作伙伴',
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr')

  const value = {
    language,
    setLanguage,
    t: translationsData[language],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}