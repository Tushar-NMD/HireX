import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBackground from '../components/PageBackground';
import { 
  FaRocket, FaUsers, FaClock 
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { Briefcase, Target, Eye, Zap } from 'lucide-react';

const About = () => {
  const values = [];

  const stats = [
    { icon: FaUsers, value: '2M+', label: 'Active Users' },
    { icon: Briefcase, value: '50K+', label: 'Job Listings' },
    { icon: FaRocket, value: '100K+', label: 'Success Stories' },
    { icon: Target, value: '95%', label: 'Success Rate' }
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
    <PageBackground>
      <Navbar variant="floating" />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 home-glass px-6 py-3 rounded-full mb-6 animate-fade-in">
            <HiSparkles className="w-5 h-5 text-amber-400" />
            <span className="font-medium text-zinc-300">About JobPortal</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in animation-delay-200 tracking-tight">
            Connecting Talent with
            <span className="home-gold-text"> Opportunity</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8 animate-fade-in animation-delay-400 leading-relaxed">
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
                className="home-glass rounded-3xl p-8 text-center hover:border-amber-500/20 hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-400/20">
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="home-glass-strong rounded-3xl p-10 hover:border-amber-500/25 transition-all duration-300 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-2xl flex items-center justify-center mb-6 border border-amber-400/20">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-zinc-400 leading-relaxed">
                To empower individuals and organizations by creating meaningful connections between talent and opportunity. 
                We strive to make the job search process transparent, efficient, and accessible to everyone, regardless of 
                their background or location.
              </p>
            </div>

            <div className="home-glass-strong rounded-3xl p-10 hover:border-amber-500/25 transition-all duration-300 animate-fade-in animation-delay-200">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-2xl flex items-center justify-center mb-6 border border-amber-400/20">
                <Eye className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-zinc-400 leading-relaxed">
                To become the world's most trusted and innovative job platform, where every person can discover their 
                potential and every company can find the perfect talent. We envision a future where career opportunities 
                are limitless and accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      {values.length > 0 && (
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 home-glass px-6 py-3 rounded-full mb-6">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="font-medium text-zinc-300">Our Core Values</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Drives Us</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Our values guide everything we do and shape the way we serve our community
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="home-glass rounded-3xl p-8 hover:border-amber-500/20 hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-2xl flex items-center justify-center mb-6 border border-amber-400/20">
                    <value.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 home-glass px-6 py-3 rounded-full mb-6">
              <FaClock className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-zinc-300">Our Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="home-gold-text">Milestones</span>
            </h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex gap-8 items-start animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="shrink-0 w-24 text-right">
                  <div className="text-3xl font-bold home-gold-text">
                    {milestone.year}
                  </div>
                </div>
                <div className="shrink-0 w-4 h-4 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full mt-2 border border-amber-400/30"></div>
                <div className="flex-1 home-glass rounded-2xl p-6 hover:border-amber-500/20 transition-all">
                  <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                  <p className="text-zinc-400">{milestone.description}</p>
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
            <div className="inline-flex items-center space-x-2 home-glass px-6 py-3 rounded-full mb-6">
              <FaUsers className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-zinc-300">Meet Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Leadership Team</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Passionate professionals dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="home-glass rounded-3xl overflow-hidden hover:border-amber-500/20 hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden border-b border-white/10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 opacity-90"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-amber-400 font-medium mb-3">{member.role}</p>
                  <p className="text-zinc-500 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="home-glass-strong rounded-3xl p-12 text-center border border-amber-500/15">
            <FaRocket className="w-16 h-16 mx-auto mb-6 text-amber-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="home-gold-text">Get Started</span>?
            </h2>
            <p className="text-xl mb-8 text-zinc-400">
              Join thousands of job seekers and employers who trust JobPortal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-black rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all hover:scale-105 border border-amber-400/30"
              >
                Get Started Free
              </a>
              <a
                href="/auth"
                className="px-8 py-4 bg-transparent border border-white/20 text-zinc-200 rounded-xl font-semibold hover:bg-white/5 hover:border-amber-500/30 hover:text-white transition-all hover:scale-105"
              >
                Post a Job
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </PageBackground>
  );
};

export default About;
