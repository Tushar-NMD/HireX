import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaRocket, FaUsers, FaHandshake, FaLightbulb, FaHeart, FaGlobe, 
  FaAward, FaChartLine, FaShieldAlt, FaClock 
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { Briefcase, Target, Eye, Zap } from 'lucide-react';

const About = () => {
  const values = [
   
  ];

  const stats = [
    { icon: FaUsers, value: '2M+', label: 'Active Users', color: 'from-blue-500 to-blue-600' },
    { icon: Briefcase, value: '50K+', label: 'Job Listings', color: 'from-purple-500 to-purple-600' },
    { icon: FaAward, value: '100K+', label: 'Success Stories', color: 'from-pink-500 to-pink-600' },
    { icon: FaChartLine, value: '95%', label: 'Success Rate', color: 'from-green-500 to-green-600' }
  ];

  const team = [
    {
      name: 'Brow Chow',
      role: 'CEO & Founder',
      image: 'https://content.fortune.com/wp-content/uploads/2020/02/CNV.03.20.Satya-Nadella.jpg',
      description: '15+ years in HR technology'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://image.cnbcfm.com/api/v1/image/107159502-1669885244931-gettyimages-1240321951-JJ_DUATO.jpeg?v=1669885448&w=1920&h=1080',
      description: 'Tech innovator and AI expert'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: 'https://cdn.wccftech.com/wp-content/uploads/2023/06/AMD-Instinct-MI300-Exascale-APUs-1456x971.jpeg',
      description: 'Operations excellence leader'
    },
    {
      name: 'Sundar Pichaie',
      role: 'Google ka CEO',
      image: 'https://wallpapers.com/images/hd/alphabet-and-google-ceo-sundar-pichai-6zumwocpxk6igpxi.jpg',
      description: 'Growth and brand strategist'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a vision to revolutionize job search' },
    { year: '2021', title: '1M Users', description: 'Reached our first million users milestone' },
    { year: '2022', title: 'Global Expansion', description: 'Expanded to 50+ countries worldwide' },
    { year: '2023', title: 'AI Integration', description: 'Launched AI-powered job matching' },
    { year: '2024', title: 'Industry Leader', description: 'Became the #1 job portal platform' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6 animate-fade-in">
            <HiSparkles className="w-5 h-5" />
            <span className="font-medium">About JobPortal</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in animation-delay-200">
            Connecting Talent with
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Opportunity</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in animation-delay-400">
            We're on a mission to make job searching and hiring easier, faster, and more effective for everyone. 
            Join millions who trust JobPortal to find their dream careers.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To empower individuals and organizations by creating meaningful connections between talent and opportunity. 
                We strive to make the job search process transparent, efficient, and accessible to everyone, regardless of 
                their background or location.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 animate-fade-in animation-delay-200">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the world's most trusted and innovative job platform, where every person can discover their 
                potential and every company can find the perfect talent. We envision a future where career opportunities 
                are limitless and accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-6">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Our Core Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our values guide everything we do and shape the way we serve our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-6">
              <FaClock className="w-5 h-5" />
              <span className="font-medium">Our Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Milestones</h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex gap-8 items-start animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2"></div>
                <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6">
              <FaUsers className="w-5 h-5" />
              <span className="font-medium">Meet Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-center text-white">
            <FaRocket className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of job seekers and employers who trust JobPortal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105"
              >
                Get Started Free
              </a>
              <a
                href="/auth"
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/30 transition-all hover:scale-105"
              >
                Post a Job
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
