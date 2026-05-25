import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Link as LinkIcon, 
  FileText,
  Github,
  Linkedin,
  Globe,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ApplicationFormProps {
  onSubmit: (data: any) => void;
}

export default function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    role: 'Frontend Engineer',
    experience: '',
    education: '',
    portfolio: '',
    github: '',
    linkedin: '',
    resume: null as File | null,
    coverLetter: ''
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else onSubmit(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Application Form</h2>
            <p className="text-slate-400 mt-1 font-medium">Step {step} of {totalSteps}: {
              step === 1 ? 'Personal Information' : 
              step === 2 ? 'Professional Details' : 
              'Links & Documents'
            }</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-indigo-500/20">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-10 border-white/[0.05]">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="First Name" 
                icon={<User className="w-4 h-4" />} 
                placeholder="John"
                value={formData.firstName}
                onChange={(v) => setFormData({...formData, firstName: v})}
              />
              <FormInput 
                label="Last Name" 
                icon={<User className="w-4 h-4" />} 
                placeholder="Doe"
                value={formData.lastName}
                onChange={(v) => setFormData({...formData, lastName: v})}
              />
              <FormInput 
                label="Email Address" 
                icon={<Mail className="w-4 h-4" />} 
                placeholder="john@example.com"
                type="email"
                value={formData.email}
                onChange={(v) => setFormData({...formData, email: v})}
              />
              <FormInput 
                label="Phone Number" 
                icon={<Phone className="w-4 h-4" />} 
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(v) => setFormData({...formData, phone: v})}
              />
              <div className="md:col-span-2">
                <FormInput 
                  label="Location" 
                  icon={<MapPin className="w-4 h-4" />} 
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(v) => setFormData({...formData, location: v})}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect 
                  label="Applying for Role" 
                  icon={<Briefcase className="w-4 h-4" />}
                  options={['Frontend Engineer', 'Backend Engineer', 'Fullstack Engineer', 'UI/UX Designer', 'Product Manager']}
                  value={formData.role}
                  onChange={(v) => setFormData({...formData, role: v})}
                />
                <FormSelect 
                  label="Years of Experience" 
                  icon={<Clock className="w-4 h-4" />}
                  options={['Entry Level', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years']}
                  value={formData.experience}
                  onChange={(v) => setFormData({...formData, experience: v})}
                />
              </div>
              <FormInput 
                label="Highest Education" 
                icon={<GraduationCap className="w-4 h-4" />} 
                placeholder="B.S. in Computer Science"
                value={formData.education}
                onChange={(v) => setFormData({...formData, education: v})}
              />
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Cover Letter (Optional)</label>
                <textarea 
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium min-h-[150px]"
                  placeholder="Tell us why you're a great fit..."
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="Portfolio URL" 
                  icon={<Globe className="w-4 h-4" />} 
                  placeholder="https://portfolio.com"
                  value={formData.portfolio}
                  onChange={(v) => setFormData({...formData, portfolio: v})}
                />
                <FormInput 
                  label="LinkedIn Profile" 
                  icon={<Linkedin className="w-4 h-4" />} 
                  placeholder="linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(v) => setFormData({...formData, linkedin: v})}
                />
                <div className="md:col-span-2">
                  <FormInput 
                    label="GitHub Profile" 
                    icon={<Github className="w-4 h-4" />} 
                    placeholder="github.com/username"
                    value={formData.github}
                    onChange={(v) => setFormData({...formData, github: v})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Resume / CV</label>
                <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center hover:border-indigo-500/40 transition-colors cursor-pointer group bg-white/[0.01]">
                  <input type="file" className="hidden" id="resume-upload" onChange={(e) => setFormData({...formData, resume: e.target.files?.[0] || null})} />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-white font-bold">{formData.resume ? formData.resume.name : 'Click to upload your resume'}</p>
                    <p className="text-slate-500 text-sm mt-1">PDF, DOCX up to 10MB</p>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-8 border-t border-white/[0.05]">
            <button
              onClick={handleBack}
              className={cn(
                "px-8 py-4 rounded-2xl font-bold text-sm transition-all",
                step === 1 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-10 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-3 group"
            >
              {step === totalSteps ? 'Submit Application' : 'Continue'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FormInput({ label, icon, placeholder, type = "text", value, onChange }: { label: string, icon: React.ReactNode, placeholder: string, type?: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
          {icon}
        </div>
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] py-4 pl-12 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function FormSelect({ label, icon, options, value, onChange }: { label: string, icon: React.ReactNode, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
          {icon}
        </div>
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] py-4 pl-12 pr-6 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium"
        >
          {options.map(opt => <option key={opt} value={opt} className="bg-[#0a0a0a]">{opt}</option>)}
        </select>
      </div>
    </div>
  );
}
