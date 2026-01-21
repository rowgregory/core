import React, { FC } from 'react'
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  AlertCircle,
  CheckCircle,
  MapPin,
  FileText,
  Calendar,
  Globe,
  Layers,
  Target,
  Award,
  Lightbulb,
  SquaresIntersect,
  BookUser,
  Projector,
  FileQuestion,
  Podcast
} from 'lucide-react'
import { Switch } from '@/app/components/ui/Switch'
import { Input } from '@/app/components/ui/Input'
import { formatDateLong } from '@/app/lib/utils/date/formatDate'
import MemberStatusBadge from '@/app/components/member/MemberStatusBadge'
import { Textarea } from '@/app/components/ui/TextArea'
import { IBeaconForm } from '@/types/forms'
import TagSelector from '../common/TagSelector'
import ObjectArraySelector from '../common/ObjectArraySelector'
import { useAppDispatch } from '@/app/lib/redux/store'
import Collage from '../beacon/Collage'
import SingleImageUploader from '../common/SingleImageUploader'

const PREDEFINED_INTERESTS = [
  // Business & Industries
  'Real Estate',
  'Technology',
  'Healthcare',
  'Finance',
  'Marketing',
  'Sales',
  'Construction',
  'Legal Services',
  'Accounting',
  'Insurance',
  'Consulting',
  'Education',
  'Retail',
  'Manufacturing',
  'Transportation',
  'Logistics',
  'Food & Beverage',
  'Hospitality',
  'Tourism',
  'Automotive',
  'Aviation',
  'Aerospace',
  'Pharmaceuticals',
  'Biotechnology',
  'Medical Devices',

  // Professional Services
  'Human Resources',
  'Project Management',
  'Business Development',
  'Operations',
  'Supply Chain',
  'Quality Assurance',
  'Customer Service',
  'Executive Leadership',
  'Entrepreneurship',
  'Franchising',
  'Startups',
  'Venture Capital',

  // Technology & Digital
  'Software Development',
  'Cybersecurity',
  'Data Analytics',
  'Cloud Computing',
  'Artificial Intelligence',
  'Machine Learning',
  'Blockchain',
  'Mobile Apps',
  'Web Development',
  'E-commerce',
  'Digital Marketing',
  'Social Media',
  'SEO/SEM',
  'UX/UI Design',
  'Game Development',
  'IT Support',

  // Finance & Investment
  'Banking',
  'Investment',
  'Wealth Management',
  'Financial Planning',
  'Stock Trading',
  'Cryptocurrency',
  'Private Equity',
  'Hedge Funds',
  'Mergers & Acquisitions',
  'Tax Strategy',
  'Estate Planning',

  // Creative & Media
  'Photography',
  'Videography',
  'Graphic Design',
  'Web Design',
  'Interior Design',
  'Fashion Design',
  'Architecture',
  'Fine Arts',
  'Music',
  'Film & Video',
  'Writing & Publishing',
  'Journalism',
  'Broadcasting',
  'Advertising',
  'Content Creation',
  'Animation',
  'Podcasting',

  // Health & Wellness
  'Fitness',
  'Nutrition',
  'Mental Health',
  'Yoga',
  'Meditation',
  'Life Coaching',
  'Personal Training',
  'Physical Therapy',
  'Chiropractic',
  'Alternative Medicine',
  'Wellness Coaching',
  'Health Tech',

  // Entertainment & Recreation
  'Sports',
  'Gaming',
  'Travel',
  'Outdoor Recreation',
  'Event Planning',
  'Concert Production',
  'Theater',
  'Dance',
  'Comedy',
  'Museums & Galleries',

  // Non-Profit & Social Impact
  'Non-Profit Management',
  'Fundraising',
  'Community Development',
  'Social Work',
  'Environmental Conservation',
  'Sustainability',
  'Renewable Energy',
  'Social Entrepreneurship',
  'Advocacy',
  'Charity Work',

  // Government & Public Sector
  'Government',
  'Public Administration',
  'Policy Development',
  'Urban Planning',
  'Emergency Services',
  'Military',
  'Diplomacy',
  'Public Safety',

  // Agriculture & Natural Resources
  'Agriculture',
  'Farming',
  'Forestry',
  'Fishing',
  'Mining',
  'Sustainable Farming',
  'Organic Farming',
  'Agribusiness',

  // Energy & Utilities
  'Oil & Gas',
  'Renewable Energy',
  'Solar Energy',
  'Wind Energy',
  'Utilities',
  'Nuclear Energy',
  'Energy Trading',

  // Communications
  'Telecommunications',
  'Public Relations',
  'Corporate Communications',
  'Crisis Management',
  'Brand Management',
  'Media Relations',

  // Other
  'Research & Development',
  'Academic Research',
  'Engineering',
  'Science',
  'Laboratory Work',
  'Quality Control',
  'Regulatory Compliance',
  'Import/Export',
  'International Trade',
  'Translation Services'
]

const skillTags = [
  // Programming Languages
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Ruby',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'C++',
  'R',
  'Scala',
  'Perl',

  // Frontend
  'React',
  'Vue.js',
  'Angular',
  'Next.js',
  'Svelte',
  'HTML/CSS',
  'Tailwind CSS',
  'Bootstrap',
  'jQuery',
  'Redux',
  'Material UI',
  'Webpack',
  'Sass/SCSS',

  // Backend
  'Node.js',
  'Express',
  'Django',
  'Flask',
  'Spring Boot',
  'Laravel',
  'Ruby on Rails',
  'FastAPI',
  'ASP.NET',
  'GraphQL',
  'REST APIs',
  'Microservices',

  // Databases
  'SQL',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Firebase',
  'DynamoDB',
  'Elasticsearch',
  'SQLite',
  'Oracle',
  'Cassandra',

  // Cloud & DevOps
  'AWS',
  'Azure',
  'Google Cloud',
  'Docker',
  'Kubernetes',
  'CI/CD',
  'Jenkins',
  'Terraform',
  'Ansible',
  'GitLab',
  'GitHub Actions',
  'Heroku',
  'Vercel',
  'Netlify',

  // Data & AI
  'Data Analysis',
  'Machine Learning',
  'AI/ML',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',
  'Pandas',
  'NumPy',
  'Scikit-learn',
  'NLP',
  'Computer Vision',
  'Data Visualization',
  'Power BI',
  'Tableau',
  'SQL Analytics',

  // Business & Management
  'Project Management',
  'Agile',
  'Scrum',
  'Product Management',
  'Business Analysis',
  'Strategic Planning',
  'Stakeholder Management',
  'Budget Management',
  'Risk Management',

  // Soft Skills
  'Leadership',
  'Team Management',
  'Communication',
  'Public Speaking',
  'Negotiation',
  'Problem Solving',
  'Critical Thinking',
  'Time Management',
  'Mentoring',
  'Conflict Resolution',

  // Marketing & Sales
  'Digital Marketing',
  'SEO',
  'Content Marketing',
  'Social Media Marketing',
  'Email Marketing',
  'Google Analytics',
  'PPC',
  'Brand Strategy',
  'Sales',
  'CRM',
  'Copywriting',

  // Design
  'UI/UX Design',
  'Figma',
  'Adobe XD',
  'Sketch',
  'Photoshop',
  'Illustrator',
  'InDesign',
  'Prototyping',
  'Wireframing',
  'User Research',
  'Graphic Design',
  'Motion Graphics',

  // Other Technical
  'Git',
  'Linux',
  'Cybersecurity',
  'Blockchain',
  'IoT',
  'Mobile Development',
  'Testing/QA',
  'API Development',
  'System Architecture',
  'Networking'
]

const learningGoalTags = [
  // Technology & Development
  'Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'Web Development',
  'Mobile Development',
  'Blockchain',
  'DevOps',
  'Data Science',
  'Full Stack Development',
  'API Development',
  'Database Management',
  'System Architecture',

  // Programming Languages
  'Python',
  'JavaScript',
  'Java',
  'C++',
  'Go',
  'Rust',
  'TypeScript',
  'SQL',

  // Business & Management
  'Product Management',
  'Project Management',
  'Business Strategy',
  'Entrepreneurship',
  'Financial Management',
  'Operations Management',
  'Change Management',
  'Risk Management',
  'Agile Methodologies',
  'Six Sigma',
  'Lean Principles',

  // Design & Creative
  'UX/UI Design',
  'Graphic Design',
  'Video Editing',
  '3D Modeling',
  'Animation',
  'Photography',
  'Content Creation',
  'Brand Design',
  'User Research',

  // Marketing & Sales
  'Digital Marketing',
  'SEO',
  'Social Media Marketing',
  'Content Marketing',
  'Email Marketing',
  'Sales Skills',
  'Copywriting',
  'Market Research',
  'Brand Strategy',

  // Data & Analytics
  'Data Analysis',
  'Data Visualization',
  'Business Intelligence',
  'Statistical Analysis',
  'Excel Advanced',
  'Power BI',
  'Tableau',
  'Google Analytics',

  // Soft Skills & Leadership
  'Leadership Skills',
  'Public Speaking',
  'Communication Skills',
  'Negotiation',
  'Emotional Intelligence',
  'Team Building',
  'Conflict Resolution',
  'Time Management',
  'Critical Thinking',
  'Problem Solving',
  'Decision Making',
  'Mentoring & Coaching',

  // Languages
  'Spanish',
  'Mandarin Chinese',
  'French',
  'German',
  'Japanese',
  'Arabic',
  'Portuguese',
  'Korean',
  'Italian',
  'Russian',

  // Finance & Accounting
  'Accounting Principles',
  'Financial Analysis',
  'Investment Strategies',
  'Tax Planning',
  'QuickBooks',
  'Excel for Finance',
  'Corporate Finance',

  // Health & Wellness
  'Nutrition',
  'Fitness Training',
  'Yoga Instruction',
  'Mental Health Awareness',
  'Mindfulness',
  'Stress Management',

  // Other Professional Skills
  'Writing Skills',
  'Legal Knowledge',
  'Human Resources',
  'Supply Chain Management',
  'Customer Service Excellence',
  'Networking Skills',
  'Personal Branding'
]

const BeaconForm: FC<IBeaconForm> = ({ inputs, errors, handleInput, isEditing, handleToggle }) => {
  const dispatch = useAppDispatch()

  return (
    <div className="py-6 sm:p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Treasure Quest</h3>

        <p className="text-sm text-gray-400 leading-relaxed">
          Let your crew know what kind of referral you&apos;re actively seeking this week. This helps other members
          identify opportunities that match your current business needs.
        </p>

        <Input
          label="Weekly Treasure Wishlist"
          icon={<MapPin />}
          name="weeklyTreasureWishlist"
          value={inputs.weeklyTreasureWishlist || ''}
          onChange={handleInput}
          disabled={!isEditing}
          placeholder="What kind of treasure map are you seeking this week?"
          error={errors.weeklyTreasureWishlist}
        />
      </div>
      <div className="mt-8 pb-10 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Professional Vision</h3>
        <Input
          label="Professional Goal"
          icon={<Target />}
          name="goal"
          value={inputs.goal || ''}
          onChange={handleInput}
          placeholder="What's your main professional objective?"
          disabled={!isEditing}
        />
      </div>

      <div className="mt-8 pb-10 grid lg:grid-cols-2 gap-8 border-b border-gray-700/50">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          <Input
            label="Full Name"
            icon={<User />}
            name="name"
            value={inputs.name || ''}
            onChange={handleInput}
            disabled={!isEditing}
            placeholder="Enter your full name"
            error={errors.name}
          />
          <Input
            label="Email Address"
            icon={<Mail />}
            type="email"
            name="email"
            value={inputs.email || ''}
            onChange={handleInput}
            disabled={!isEditing}
            placeholder="Enter your email"
            error={errors.email}
          />
          <Input
            label="Phone Number"
            icon={<Phone />}
            type="tel"
            name="phone"
            value={inputs.phone || ''}
            onChange={handleInput}
            disabled={!isEditing}
            placeholder="+1 (555) 123-4567"
            error={errors.phone}
          />
          <Input
            label="Years in Business"
            icon={<Calendar />}
            name="yearsInBusiness"
            value={inputs.yearsInBusiness || ''}
            onChange={handleInput}
            disabled={!isEditing}
            placeholder="e.g., 5 years"
            error={errors.yearsInBusiness}
          />
        </div>
        {/* Professional Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4 opacity-0">Professional Information</h3>
          <Input
            label="Company"
            icon={<Building />}
            name="company"
            value={inputs.company || ''}
            onChange={handleInput}
            disabled={!isEditing}
            placeholder="Enter your company"
            error={errors.company}
          />
          <Input
            label="Website"
            icon={<Globe />}
            type="url"
            name="website"
            value={inputs.website || ''}
            onChange={handleInput}
            disabled={!isEditing}
            placeholder="e.g., https://sqysh.io"
            error={errors.website}
          />
          <Input
            label="Industry"
            icon={<Briefcase />}
            name="industry"
            value={inputs.industry || ''}
            onChange={handleInput}
            disabled={true}
            placeholder="Enter your industry"
            error={errors.industry}
          />

          <Input
            label="Business License Number"
            icon={<Layers />}
            name="businessLicenseNumber"
            value={inputs.businessLicenseNumber || ''}
            onChange={handleInput}
            disabled={!isEditing}
            placeholder="e.g., BL-2025-1847392"
            error={errors.businessLicenseNumber}
          />
        </div>
      </div>

      {/* Media & Images */}
      <div className="mt-8 pb-10 grid lg:grid-cols-2 gap-8 border-b border-gray-700/50">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Media & Images</h3>
          <SingleImageUploader
            label="Cover Image"
            inputs={inputs}
            handleInput={handleInput}
            isEditing={isEditing}
            coverImageName="coverImage"
            coverImageFilenameName="coverImageFilename"
            placeholder="Upload your cover image"
          />
        </div>
      </div>
      <div className="mt-8 pb-10 grid lg:grid-cols-2 gap-8 border-b border-gray-700/50">
        {/* Social Media Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-6">Social Media & Online Presence</h3>
          <Input
            label="LinkedIn Profile"
            icon={<Globe />}
            name="linkedInUrl"
            value={inputs.linkedInUrl || ''}
            onChange={handleInput}
            placeholder="https://linkedin.com/in/yourprofile"
            disabled={!isEditing}
          />

          <Input
            label="Facebook Profile"
            icon={<Globe />}
            name="facebookUrl"
            value={inputs.facebookUrl || ''}
            onChange={handleInput}
            placeholder="https://facebook.com/yourprofile"
            disabled={!isEditing}
          />

          <Input
            label="YouTube Channel"
            icon={<Globe />}
            name="youtubeUrl"
            value={inputs.youtubeUrl || ''}
            onChange={handleInput}
            placeholder="https://youtube.com/@yourchannel"
            disabled={!isEditing}
          />

          <Input
            label="X (Twitter) Profile"
            icon={<Globe />}
            name="xUrl"
            value={inputs.xUrl || ''}
            onChange={handleInput}
            placeholder="https://x.com/yourusername"
            disabled={!isEditing}
          />

          <Input
            label="Threads Profile"
            icon={<Globe />}
            name="threadsUrl"
            value={inputs.threadsUrl || ''}
            onChange={handleInput}
            placeholder="https://threads.net/@yourusername"
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Bio Section - Full Width */}
      <div className="mt-8 pb-10 space-y-4 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white">About You</h3>
        <Textarea
          label="Professional Bio"
          icon={<FileText />}
          name="bio"
          value={inputs.bio || ''}
          onChange={handleInput}
          disabled={!isEditing}
          placeholder="Tell us about yourself, your experience, and what you're looking to achieve..."
          rows={4}
          maxLength={500}
          error={errors.bio}
        />
      </div>

      {/* Skills & Expertise */}
      <div className="mt-8 pb-10 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Skills & Professional Development</h3>
        <div className="grid gap-6">
          <TagSelector
            inputs={inputs}
            label="Skills"
            icon={<Award className="w-4 h-4 text-cyan-400" />}
            name="skills"
            tags={skillTags}
            isEditing={isEditing}
          />
          <ObjectArraySelector
            inputs={inputs}
            label="Career Achievements"
            icon={<Award />}
            name="careerAchievements"
            items={inputs.careerAchievements || []}
            disabled={!isEditing}
            fields={[
              {
                name: 'title',
                label: 'Achievement Title',
                placeholder: 'e.g., Employee of the Year, Led successful product launch...',
                type: 'text'
              },
              {
                name: 'year',
                label: 'Year',
                placeholder: 'e.g., 2024',
                type: 'text'
              }
            ]}
            dispatch={dispatch}
          />
          <TagSelector
            inputs={inputs}
            label="Learning Goals"
            icon={<Lightbulb className="w-4 h-4 text-cyan-400" />}
            name="learningGoals"
            tags={learningGoalTags}
            isEditing={isEditing}
          />

          <TagSelector
            inputs={inputs}
            label="Interests"
            icon={<SquaresIntersect className="w-4 h-4 text-cyan-400" />}
            name="interests"
            tags={PREDEFINED_INTERESTS}
            isEditing={isEditing}
          />
        </div>
      </div>

      {/* Services & Professional Network */}
      <div className="mt-8 pb-10 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Services & Professional Network</h3>
        <div className="grid gap-6">
          <ObjectArraySelector
            inputs={inputs}
            label="Services Offered"
            icon={<Briefcase />}
            name="servicesOffered"
            items={inputs.servicesOffered || []}
            disabled={!isEditing}
            fields={[
              {
                name: 'name',
                label: 'Service Name',
                placeholder: '',
                type: 'text'
              },
              {
                name: 'description',
                label: 'Description',
                placeholder: '',
                type: 'textarea'
              }
            ]}
            dispatch={dispatch}
          />
          <ObjectArraySelector
            inputs={inputs}
            label="Professional Associations"
            icon={<Briefcase />}
            name="professionalAssociations"
            items={inputs.professionalAssociations || []}
            disabled={!isEditing}
            fields={[
              {
                name: 'name',
                label: 'Association Name',
                placeholder: 'e.g. Boys & Girls Club of Lynn',
                type: 'text'
              },
              {
                name: 'role',
                label: 'Role',
                placeholder: '',
                type: 'text'
              }
            ]}
            dispatch={dispatch}
          />
          <ObjectArraySelector
            inputs={inputs}
            label="Professional Books"
            icon={<BookUser />}
            name="professionalBooks"
            items={inputs.professionalBooks || []}
            disabled={!isEditing}
            fields={[
              {
                name: 'title',
                label: 'Book Title',
                placeholder: 'e.g. Learn How to Sqysh',
                type: 'text'
              },
              {
                name: 'author',
                label: 'Author',
                placeholder: 'e.g. Sqysh',
                type: 'text'
              }
            ]}
            dispatch={dispatch}
          />
        </div>
      </div>

      {/* Projects & Expertise Sharing */}
      <div className="mt-8 pb-10 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Projects & Expertise Sharing</h3>
        <div className="grid gap-6">
          <ObjectArraySelector
            inputs={inputs}
            label="Side Projects"
            icon={<Projector />}
            name="sideProjects"
            items={inputs.sideProjects || []}
            disabled={!isEditing}
            fields={[
              {
                name: 'name',
                label: 'Project Name',
                placeholder: '',
                type: 'text'
              },
              {
                name: 'details',
                label: 'Details',
                placeholder: '',
                type: 'textarea'
              }
            ]}
            dispatch={dispatch}
          />
          <ObjectArraySelector
            inputs={inputs}
            label="Ask Me About"
            icon={<FileQuestion />}
            name="askMeAbout"
            items={inputs.askMeAbout || []}
            disabled={!isEditing}
            fields={[
              {
                name: 'topic',
                label: 'Topic',
                placeholder: '',
                type: 'text'
              }
            ]}
            dispatch={dispatch}
          />
        </div>
      </div>

      <Collage isEditing={isEditing} initialImages={inputs?.collage} />

      <div className="mt-8 pb-10 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-6">Content & Communication</h3>
        <div className="grid gap-6">
          <ObjectArraySelector
            inputs={inputs}
            label="Podcasts"
            icon={<Podcast />}
            name="podcasts"
            items={inputs.podcasts || []}
            disabled={!isEditing}
            fields={[
              {
                name: 'name',
                label: 'Podcast Name',
                placeholder: '',
                type: 'text'
              },
              {
                name: 'details',
                label: 'Details',
                placeholder: '',
                type: 'textarea'
              },
              {
                name: 'externalLink',
                label: 'External Link',
                placeholder: '',
                type: 'text'
              }
            ]}
            dispatch={dispatch}
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="mt-8 p-6 bg-gray-800/20 rounded-xl border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <Switch
            name="isPublic"
            label="Make profile public"
            checked={inputs.isPublic}
            onChange={handleToggle}
            disabled={!isEditing}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Public profiles are visible to other chapter members and can be found in networking searches.
        </p>
      </div>

      {/* Profile Completeness Status */}
      {inputs.meta.profileCompleteness && (
        <div
          className={`mt-8 p-6 rounded-xl border ${
            inputs.meta.profileCompleteness.isComplete
              ? 'bg-green-500/5 border-green-500/20'
              : 'bg-orange-500/5 border-orange-500/20'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${
                inputs.meta.profileCompleteness.isComplete ? 'bg-green-500/10' : 'bg-orange-500/10'
              }`}
            >
              {inputs.meta.profileCompleteness.isComplete ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-400" />
              )}
            </div>
            <div>
              <h3
                className={`text-sm font-semibold ${
                  inputs.meta.profileCompleteness.isComplete ? 'text-green-300' : 'text-orange-300'
                }`}
              >
                Profile {inputs.meta.profileCompleteness.isComplete ? 'Complete' : 'Incomplete'}
              </h3>
              {inputs.meta.profileCompleteness.isComplete ? (
                <p className="text-xs text-gray-400 mt-1">Your profile is complete and visible to other members.</p>
              ) : (
                <div className="mt-1">
                  <p className="text-xs text-gray-400">
                    Complete these fields: {inputs.meta.profileCompleteness.missingFields.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Membership Information */}
      <div className="mt-8 p-6 bg-blue-500/5 rounded-xl border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">Membership Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Member Since:</span>
            <span className="text-white ml-2">{formatDateLong(inputs.joinedAt)}</span>
          </div>
          <div>
            <span className="text-gray-400">Membership Status:</span>
            <span className="ml-2">
              <MemberStatusBadge status={inputs.membershipStatus} isExpiring={inputs.isExpiringSoon} />
            </span>
          </div>
          <div>
            <span className="text-gray-400">Chapter:</span>
            <span className="text-white ml-2">{inputs.chapter.name}</span>
          </div>
          <div>
            <span className="text-gray-400">Days as Member:</span>
            <span className="text-white ml-2">{inputs.membershipDays} days</span>
          </div>
          <div>
            <span className="text-gray-400">Renewal Date:</span>
            <span className="text-white ml-2">{formatDateLong(inputs.expiresAt)}</span>
          </div>
          <div>
            <span className="text-gray-400">Last Login:</span>
            <span className="text-white ml-2">{inputs.lastLoginAt ? formatDateLong(inputs.lastLoginAt) : 'Never'}</span>
          </div>
        </div>

        {inputs.isExpiringSoon && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">Membership Expiring Soon</span>
            </div>
            <p className="text-orange-200 text-xs mt-1">
              Your membership expires on {formatDateLong(inputs.expiresAt)}. Please renew to continue accessing member
              benefits.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BeaconForm
