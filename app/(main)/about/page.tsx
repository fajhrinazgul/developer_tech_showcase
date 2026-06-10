'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import { Mail, MapPin, Terminal } from 'lucide-react'

export default function AboutPage() {
  const skills = [
    'React',
    'Next.js',
    'Django',
    'PostgreSQL',
    'TailwindCSS',
    'TypeScript',
    'Docker',
    'Git',
  ]

  return (
    <main className="container mx-auto py-12 px-4 max-w-3xl font-mono">
      {/* About Section */}
      <div className="mb-12">
        <h2 className="text-emerald-500 flex items-center gap-2 text-sm mb-6">
          <Terminal size={16} /> whoami
        </h2>

        <div className="space-y-6 text-zinc-300">
          <p className="text-lg leading-relaxed">
            Hi, I'm{' '}
            <span className="text-emerald-400 font-bold">Fajri Fath</span>. A
            full-stack developer who loves building digital tools that
            prioritize performance and user experience.
          </p>
          <p className="leading-relaxed">
            Currently focused on building scalable web applications using the T3
            Stack (TypeScript, Tailwind, tRPC) and Python ecosystems. I spend
            most of my time optimizing backend performance or fine-tuning UI
            components.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-zinc-500 text-xs uppercase mb-4">Tech Stack</h3>
          <div className="flex gap-2 flex-wrap">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-zinc-800 text-emerald-400 border-emerald-900/50"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="border-t border-zinc-800 pt-12">
        <h2 className="text-emerald-500 flex items-center gap-2 text-sm mb-8">
          <Terminal size={16} /> connect --social
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ContactCard
            icon={<Mail size={20} />}
            label="Email"
            value="fathfajhri40@gmail.com"
            href="mailto:fathfajhri40@gmail.com"
          />
          <ContactCard
            icon={<IconBrandGithub size={20} />}
            label="GitHub"
            value="@fajhrinazgul"
            href="https://github.com/fajhrinazgul"
          />
          <ContactCard
            icon={<IconBrandLinkedin size={20} />}
            label="LinkedIn"
            value="in/fajrifath"
            href="https://www.linkedin.com/in/fajri-fath-b81631273/"
          />
          <ContactCard
            icon={<MapPin size={20} />}
            label="Location"
            value="Padang, ID"
            href="#"
          />
        </div>
      </div>
    </main>
  )
}

function ContactCard({ icon, label, value, href }: any) {
  return (
    <a
      href={href}
      target={href !== '#' ? '_blank' : undefined}
      className="block group"
    >
      <Card className="bg-zinc-950 border-zinc-800 p-4 transition-all hover:border-emerald-900 hover:bg-zinc-900">
        <div className="flex items-center gap-4 text-zinc-400 group-hover:text-emerald-400">
          {icon}
          <div>
            <p className="text-[10px] uppercase text-zinc-600">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        </div>
      </Card>
    </a>
  )
}
