
// 'use client'

// import { motion } from 'framer-motion'
// import CountUp from 'react-countup'
// import { Building2, Briefcase, Users, Smile } from 'lucide-react'

// const stats = [
//   { 
//     value: 3, 
//     label: 'Years Experience', 
//     icon: Building2,
//     desc: 'Serving since 2023'
//   },
//   { 
//     value: 50, 
//     label: 'Projects Done', 
//     icon: Briefcase,
//     desc: 'Across DRC'
//   },
//   { 
//     value: 150, 
//     label: 'Team Members', 
//     icon: Users,
//     desc: 'Qualified staff'
//   },
//   { 
//     value: 30, 
//     label: 'Happy Clients', 
//     icon: Smile,
//     desc: 'Trusted partners'
//   },
// ]

// export default function Stats() {
//   return (
//     <section className="relative py-20 bg-[#1a3a6b] overflow-hidden">
//       {/* Formes décoratives */}
//       <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff6b00]/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/3 blur-3xl translate-x-1/2 translate-y-1/2" />
      
//       {/* Ligne décorative en haut */}
//       <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6b00]/30 to-transparent" />

//       <div className="relative max-w-7xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <span className="text-[#ff6b00] text-sm font-semibold tracking-wider uppercase">
//             By the Numbers
//           </span>
//           <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
//             Our Track Record
//           </h2>
//         </motion.div>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               className="group"
//             >
//               <div className="bg-white/5 backdrop-blur-sm border-l-4 border-[#ff6b00] p-8 text-center hover:bg-white/10 transition-all duration-300">
//                 {/* Icône */}
//                 <div className="w-14 h-14 bg-[#ff6b00]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#ff6b00]/20 transition-colors">
//                   <stat.icon className="w-7 h-7 text-[#ff6b00]" />
//                 </div>

//                 {/* Chiffre */}
//                 <div className="text-5xl md:text-6xl font-bold text-white mb-2">
//                   <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyOnce />
//                   <span className="text-[#ff6b00]">+</span>
//                 </div>

//                 {/* Label */}
//                 <div className="text-white font-semibold mb-1">{stat.label}</div>
//                 <div className="text-blue-200/60 text-sm">{stat.desc}</div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Texte en bas */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.8 }}
//           className="text-center text-blue-200/60 text-sm mt-10"
//         >
//           Growing stronger every year with commitment to excellence
//         </motion.p>
//       </div>
//     </section>
//   )
// }

'use client'

import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { Building2, Briefcase, Users, Smile } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const icons = [Building2, Briefcase, Users, Smile]
const values = [3, 50, 150, 30]

export default function Stats() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 bg-[#1a3a6b] overflow-hidden">
      {/* Formes décoratives */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff6b00]/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/3 blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Ligne décorative en haut */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6b00]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#ff6b00] text-sm font-semibold tracking-wider uppercase">
            {t.stats.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            {t.stats.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {t.stats.list.map((stat, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm border-l-4 border-[#ff6b00] p-8 text-center hover:bg-white/10 transition-all duration-300">
                  {/* Icône */}
                  <div className="w-14 h-14 bg-[#ff6b00]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#ff6b00]/20 transition-colors">
                    <Icon className="w-7 h-7 text-[#ff6b00]" />
                  </div>

                  {/* Chiffre */}
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                    <CountUp end={values[i]} duration={2.5} enableScrollSpy scrollSpyOnce />
                    <span className="text-[#ff6b00]">+</span>
                  </div>

                  {/* Label */}
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-blue-200/60 text-sm">{stat.desc}</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Texte en bas */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-blue-200/60 text-sm mt-10"
        >
          {t.stats.bottomText}
        </motion.p>
      </div>
    </section>
  )
}