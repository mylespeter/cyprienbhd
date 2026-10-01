
// // components/Contact.jsx (mettre à jour la fonction handleSubmit)
// 'use client'

// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { Phone, Mail, MapPin, Clock, Send, ArrowRight, CheckCircle, type LucideIcon } from 'lucide-react'
// import { useLanguage } from '@/context/LanguageContext'

// interface FormData {
//   name: string
//   email: string
//   phone: string
//   message: string
// }

// interface ContactInfo {
//   icon: LucideIcon
//   title: string
//   details: string[]
//   color: string
//   links?: boolean
// }

// export default function Contact() {
//   const { t, language } = useLanguage()
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     phone: '',
//     message: ''
//   })
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
//   const [error, setError] = useState<string>('')

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value } as FormData)
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError('')
    
//     try {
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setIsSubmitted(true)
//         setFormData({ name: '', email: '', phone: '', message: '' })
//         setTimeout(() => setIsSubmitted(false), 5000)
//       } else {
//         setError(data.error || 'Une erreur est survenue')
//       }
//     } catch (err) {
//       console.error('Erreur:', err)
//       setError(language === 'fr' 
//         ? 'Erreur de connexion. Veuillez réessayer.' 
//         : 'Connection error. Please try again.'
//       )
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const contactInfo = [
//     {
//       icon: MapPin,
//       title: language === 'fr' ? 'Adresse' : 'Address',
//       details: ['1176 Mukoj Avenue, Kalubwe', 'Lubumbashi, Haut-Katanga, RDC'],
//       color: 'from-blue-600 to-blue-700'
//     },
//     {
//       icon: Phone,
//       title: language === 'fr' ? 'Téléphone' : 'Phone',
//       details: ['+243 997 760 063', '+243 811 832 687'],
//       color: 'from-orange-500 to-orange-600',
//       links: true
//     },
//     {
//       icon: Mail,
//       title: 'Email',
//       details: ['sylwak.africa1@gmail.com', 'yumbawakumwanza@gmail.com'],
//       color: 'from-green-600 to-green-700',
//       links: true
//     },
//     {
//       icon: Clock,
//       title: language === 'fr' ? 'Heures de Travail' : 'Working Hours',
//       details: language === 'fr' 
//         ? ['Lun - Sam: 8:00 - 17:00', 'Dimanche: Fermé']
//         : ['Mon - Sat: 8:00 - 17:00', 'Sunday: Closed'],
//       color: 'from-purple-600 to-purple-700'
//     }
//   ]

//   return (
//     <section id="contact" className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `linear-gradient(#1a3a6b 1px, transparent 1px), linear-gradient(90deg, #1a3a6b 1px, transparent 1px)`,
//           backgroundSize: '60px 60px'
//         }} />
//       </div>

//       <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//           key={language}
//         >
//           <span className="text-[#ff6b00] font-semibold text-sm tracking-widest uppercase mb-4 block">
//             {language === 'fr' ? 'Contactez-Nous' : 'Get In Touch'}
//           </span>
//           <h2 className="text-4xl md:text-5xl font-bold text-[#1a3a6b] mb-6">
//             {language === 'fr' ? 'Travaillons Ensemble' : "Let's Work Together"}
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-[#ff6b00] to-orange-400 mx-auto mb-6" />
//           <p className="text-gray-600 max-w-2xl mx-auto text-lg">
//             {language === 'fr' 
//               ? "Vous avez un projet en tête ? Nous aimerions en entendre parler. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais."
//               : "Have a project in mind? We'd love to hear about it. Send us a message and we'll respond as soon as possible."
//             }
//           </p>
//         </motion.div>

//         <div className="grid lg:grid-cols-5 gap-8">
//           {/* Contact Info */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="lg:col-span-2 space-y-4"
//           >
//             {contactInfo.map((info, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="group relative bg-white border-l-4 border-[#ff6b00] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//               >
//                 <div className="p-6">
//                   <div className="flex items-start gap-4">
//                     <div className={`w-12 h-12 bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                       <info.icon className="w-5 h-5 text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-bold text-[#1a3a6b] mb-2 text-lg">{info.title}</h3>
//                       {info.details.map((detail, idx) => (
//                         info.links ? (
//                           <a
//                             key={idx}
//                             href={info.title === 'Phone' || info.title === 'Téléphone' ? `tel:${detail.replace(/\s/g, '')}` : `mailto:${detail}`}
//                             className="text-gray-600 hover:text-[#ff6b00] transition-colors block text-sm"
//                           >
//                             {detail}
//                           </a>
//                         ) : (
//                           <p key={idx} className="text-gray-600 text-sm">{detail}</p>
//                         )
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Formulaire */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="lg:col-span-3"
//           >
//             <div className="bg-white shadow-2xl border-t-4 border-[#ff6b00]">
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold text-[#1a3a6b] mb-8 flex items-center gap-3">
//                   <Send className="w-6 h-6 text-[#ff6b00]" />
//                   {language === 'fr' ? 'Envoyez-nous un Message' : 'Send Us a Message'}
//                 </h3>

//                 {isSubmitted ? (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="text-center py-12"
//                   >
//                     <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                     <h4 className="text-xl font-semibold text-[#1a3a6b] mb-2">
//                       {language === 'fr' ? 'Message Envoyé avec Succès !' : 'Message Sent Successfully!'}
//                     </h4>
//                     <p className="text-gray-600">
//                       {language === 'fr' ? 'Nous vous répondrons dans les 24 heures.' : "We'll get back to you within 24 hours."}
//                     </p>
//                   </motion.div>
//                 ) : (
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {error && (
//                       <div className="bg-red-50 border-l-4 border-red-500 p-4">
//                         <p className="text-red-700 text-sm">{error}</p>
//                       </div>
//                     )}
                    
//                     <div className="grid sm:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           {language === 'fr' ? 'Nom Complet *' : 'Full Name *'}
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none"
//                           placeholder={language === 'fr' ? 'Jean Dupont' : 'John Doe'}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Email *
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleChange}
//                           required
//                           className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none"
//                           placeholder="jean@example.com"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         {language === 'fr' ? 'Téléphone' : 'Phone'}
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none"
//                         placeholder="+243 XXX XXX XXX"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         {language === 'fr' ? 'Message *' : 'Message *'}
//                       </label>
//                       <textarea
//                         name="message"
//                         value={formData.message}
//                         onChange={handleChange}
//                         rows={5}
//                         required
//                         className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none resize-none"
//                         placeholder={language === 'fr' ? 'Parlez-nous de votre projet...' : 'Tell us about your project...'}
//                       />
//                     </div>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="w-full bg-[#ff6b00] text-white py-4 font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <motion.div
//                             animate={{ rotate: 360 }}
//                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                             className="w-5 h-5 border-2 rounded-full border-white border-t-transparent"
//                           />
//                           {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
//                         </>
//                       ) : (
//                         <>
//                           {language === 'fr' ? 'Envoyer le Message' : 'Send Message'}
//                           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                         </>
//                       )}
//                     </button>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, ArrowRight, CheckCircle, type LucideIcon } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface ContactInfo {
  icon: LucideIcon
  title: string
  details: string[]
  color: string
  links?: boolean
}

export default function Contact() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value } as FormData)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        setError(data.error || 'Une erreur est survenue')
      }
    } catch (err) {
      console.error('Erreur:', err)
      setError(
        language === 'fr' 
          ? 'Erreur de connexion. Veuillez réessayer.' 
          : language === 'zh'
          ? '连接错误。请重试。'
          : 'Connection error. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLocalizedContactInfo = (): ContactInfo[] => {
    const translations = {
      fr: {
        address: 'Adresse',
        phone: 'Téléphone',
        workingHours: 'Heures de Travail',
        weekdays: 'Lun - Sam: 8:00 - 17:00',
        sunday: 'Dimanche: Fermé'
      },
      en: {
        address: 'Address',
        phone: 'Phone',
        workingHours: 'Working Hours',
        weekdays: 'Mon - Sat: 8:00 - 17:00',
        sunday: 'Sunday: Closed'
      },
      zh: {
        address: '地址',
        phone: '电话',
        workingHours: '工作时间',
        weekdays: '周一至周六: 8:00 - 17:00',
        sunday: '周日: 休息'
      }
    }

    const loc = translations[language]

    return [
      {
        icon: MapPin,
        title: loc.address,
        details: ['1176 Mukoj Avenue, Kalubwe', 'Lubumbashi, Haut-Katanga, RDC'],
        color: 'from-blue-600 to-blue-700'
      },
      {
        icon: Phone,
        title: loc.phone,
        details: ['+243 997 760 063', '+243 811 832 687'],
        color: 'from-orange-500 to-orange-600',
        links: true
      },
      {
        icon: Mail,
        title: 'Email',
        details: ['sylwak.africa1@gmail.com', 'yumbawakumwanza@gmail.com'],
        color: 'from-green-600 to-green-700',
        links: true
      },
      {
        icon: Clock,
        title: loc.workingHours,
        details: [loc.weekdays, loc.sunday],
        color: 'from-purple-600 to-purple-700'
      }
    ]
  }

  const contactInfo = getLocalizedContactInfo()

  const getLocalizedText = () => {
    const translations = {
      fr: {
        badge: 'Contactez-Nous',
        title: 'Travaillons Ensemble',
        description: "Vous avez un projet en tête ? Nous aimerions en entendre parler. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.",
        formTitle: 'Envoyez-nous un Message',
        successTitle: 'Message Envoyé avec Succès !',
        successDesc: 'Nous vous répondrons dans les 24 heures.',
        nameLabel: 'Nom Complet *',
        namePlaceholder: 'Jean Dupont',
        emailLabel: 'Email *',
        emailPlaceholder: 'jean@example.com',
        phoneLabel: 'Téléphone',
        phonePlaceholder: '+243 XXX XXX XXX',
        messageLabel: 'Message *',
        messagePlaceholder: 'Parlez-nous de votre projet...',
        sending: 'Envoi en cours...',
        sendBtn: 'Envoyer le Message'
      },
      en: {
        badge: 'Get In Touch',
        title: "Let's Work Together",
        description: "Have a project in mind? We'd love to hear about it. Send us a message and we'll respond as soon as possible.",
        formTitle: 'Send Us a Message',
        successTitle: 'Message Sent Successfully!',
        successDesc: "We'll get back to you within 24 hours.",
        nameLabel: 'Full Name *',
        namePlaceholder: 'John Doe',
        emailLabel: 'Email *',
        emailPlaceholder: 'john@example.com',
        phoneLabel: 'Phone',
        phonePlaceholder: '+243 XXX XXX XXX',
        messageLabel: 'Message *',
        messagePlaceholder: 'Tell us about your project...',
        sending: 'Sending...',
        sendBtn: 'Send Message'
      },
      zh: {
        badge: '联系我们',
        title: '让我们一起合作',
        description: '有项目想法？我们很乐意听取。发送消息给我们，我们会尽快回复。',
        formTitle: '发送消息给我们',
        successTitle: '消息发送成功！',
        successDesc: '我们将在24小时内回复您。',
        nameLabel: '姓名 *',
        namePlaceholder: '张三',
        emailLabel: '邮箱 *',
        emailPlaceholder: 'zhangsan@example.com',
        phoneLabel: '电话',
        phonePlaceholder: '+243 XXX XXX XXX',
        messageLabel: '留言 *',
        messagePlaceholder: '请告诉我们您的项目...',
        sending: '发送中...',
        sendBtn: '发送消息'
      }
    }

    return translations[language]
  }

  const loc = getLocalizedText()

  return (
    <section id="contact" className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#1a3a6b 1px, transparent 1px), linear-gradient(90deg, #1a3a6b 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          key={language}
        >
          <span className="text-[#ff6b00] font-semibold text-sm tracking-widest uppercase mb-4 block">
            {loc.badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a3a6b] mb-6">
            {loc.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#ff6b00] to-orange-400 mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {loc.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white border-l-4 border-[#ff6b00] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <info.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1a3a6b] mb-2 text-lg">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        info.links ? (
                          <a
                            key={idx}
                            href={info.title === 'Phone' || info.title === 'Téléphone' || info.title === '电话' ? `tel:${detail.replace(/\s/g, '')}` : `mailto:${detail}`}
                            className="text-gray-600 hover:text-[#ff6b00] transition-colors block text-sm"
                          >
                            {detail}
                          </a>
                        ) : (
                          <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="bg-white shadow-2xl border-t-4 border-[#ff6b00]">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#1a3a6b] mb-8 flex items-center gap-3">
                  <Send className="w-6 h-6 text-[#ff6b00]" />
                  {loc.formTitle}
                </h3>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-[#1a3a6b] mb-2">
                      {loc.successTitle}
                    </h4>
                    <p className="text-gray-600">
                      {loc.successDesc}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {loc.nameLabel}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none"
                          placeholder={loc.namePlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {loc.emailLabel}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none"
                          placeholder={loc.emailPlaceholder}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {loc.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none"
                        placeholder={loc.phonePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {loc.messageLabel}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#ff6b00] focus:bg-white transition-all outline-none resize-none"
                        placeholder={loc.messagePlaceholder}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#ff6b00] text-white py-4 font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 rounded-full border-white border-t-transparent"
                          />
                          {loc.sending}
                        </>
                      ) : (
                        <>
                          {loc.sendBtn}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}