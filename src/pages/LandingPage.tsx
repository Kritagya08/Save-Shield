import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Wifi, WifiOff, Bluetooth, MapPin, AlertTriangle, Clock, Users, Zap, ChevronDown, Activity, Phone } from 'lucide-react';

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 font-sans selection:bg-teal-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-md border-b border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                SAVE SHIELD
              </span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
              <Link to="/demo" className="text-slate-300 hover:text-white transition-colors">Demo</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-surface-950 to-surface-950 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="inline-flex items-center space-x-2 bg-surface-800/50 rounded-full px-4 py-1.5 mb-8 border border-surface-700">
                <span className="flex h-2 w-2 rounded-full bg-teal-500"></span>
                <span className="text-sm font-medium text-slate-300">Next-Gen Emergency Safety System</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            >
              Emergency protection that keeps working when <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">connectivity doesn't.</span>
            </motion.h1>
            
            <motion.p 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
              className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed"
            >
              An online and offline emergency safety system using intelligent risk assessment, GPS tracking, and decentralized Bluetooth relay networking.
            </motion.p>
            
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:-translate-y-1">
                Get Started Free
              </Link>
              <Link to="/demo" className="w-full sm:w-auto px-8 py-4 bg-surface-800 hover:bg-surface-700 text-white border border-surface-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>View Live Demo</span>
              </Link>
            </motion.div>
          </div>
          
          {/* Animated Visual Flow */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 p-1 rounded-2xl bg-gradient-to-b from-surface-700 to-surface-900 border border-surface-800 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
            
            <div className="bg-surface-900 rounded-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Online Flow */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center text-green-400">
                    <Wifi className="w-6 h-6 mr-2" /> Online Mode
                  </h3>
                  <div className="flex flex-col space-y-4">
                    <div className="bg-surface-800 p-4 rounded-lg flex items-center justify-between border border-surface-700">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500/20 p-2 rounded-full text-blue-400"><Users className="w-5 h-5" /></div>
                        <span className="font-medium">User Device</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-1 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"
                      />
                    </div>
                    <div className="bg-surface-800 p-4 rounded-lg flex items-center justify-between border border-surface-700">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500/20 p-2 rounded-full text-green-400"><Wifi className="w-5 h-5" /></div>
                        <span className="font-medium">Direct Internet</span>
                      </div>
                      <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">FAST</span>
                    </div>
                    <div className="flex justify-center">
                      <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                        className="w-1 h-8 bg-gradient-to-b from-green-500 to-red-500 rounded-full"
                      />
                    </div>
                    <div className="bg-red-900/20 p-4 rounded-lg flex items-center justify-between border border-red-900/50">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-500/20 p-2 rounded-full text-red-400"><AlertTriangle className="w-5 h-5" /></div>
                        <span className="font-medium text-red-200">Emergency Services</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Offline Flow */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center text-amber-400">
                    <WifiOff className="w-6 h-6 mr-2" /> Offline Mode
                  </h3>
                  <div className="flex flex-col space-y-4">
                    <div className="bg-surface-800 p-4 rounded-lg flex items-center justify-between border border-surface-700">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500/20 p-2 rounded-full text-blue-400"><Users className="w-5 h-5" /></div>
                        <span className="font-medium">User Device</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-1 h-8 bg-gradient-to-b from-blue-500 to-amber-500 rounded-full border-l-2 border-dashed border-amber-500 bg-transparent"
                      />
                    </div>
                    <div className="bg-surface-800 p-4 rounded-lg flex items-center justify-between border border-surface-700">
                      <div className="flex items-center space-x-3">
                        <div className="bg-amber-500/20 p-2 rounded-full text-amber-400"><Bluetooth className="w-5 h-5" /></div>
                        <span className="font-medium">Bluetooth Relay Mesh</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded">MULTI-HOP</span>
                    </div>
                    <div className="flex justify-center">
                      <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                        className="w-1 h-8 bg-gradient-to-b from-amber-500 to-red-500 rounded-full border-l-2 border-dashed border-red-500 bg-transparent"
                      />
                    </div>
                    <div className="bg-red-900/20 p-4 rounded-lg flex items-center justify-between border border-red-900/50">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-500/20 p-2 rounded-full text-red-400"><AlertTriangle className="w-5 h-5" /></div>
                        <span className="font-medium text-red-200">Emergency Services</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-24 bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The critical flaw in traditional safety apps</h2>
              <p className="text-lg text-slate-400 mb-6">
                Most personal safety applications rely entirely on an active cellular or Wi-Fi connection. When you're in a dead zone, basement, or during network outages, these apps become completely useless precisely when you need them most.
              </p>
              <div className="flex items-center space-x-4 text-red-400 bg-red-950/30 p-4 rounded-lg border border-red-900/50">
                <WifiOff className="w-8 h-8 flex-shrink-0" />
                <span>Standard apps fail silently when connection drops.</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="bg-surface-800 p-8 rounded-2xl border border-surface-700 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Dual-Mode Solution</h2>
              <p className="text-lg text-slate-400 mb-8">
                Save Shield automatically detects network availability. If internet is lost, it instantly switches to a peer-to-peer Bluetooth Low Energy (BLE) mesh network, relaying your SOS through nearby devices until it reaches a gateway with an internet connection.
              </p>
              <ul className="space-y-4">
                {[
                  "Zero user intervention required",
                  "Encrypted payload transmission",
                  "Multi-hop relay capability",
                  "Battery optimized protocol"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-300">
                    <div className="bg-teal-500/20 p-1 rounded-full text-teal-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Protection</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">Everything you need to stay safe in unpredictable situations.</p>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: <WifiOff />, title: "Offline SOS", desc: "Trigger alerts even without internet using Bluetooth relay.", color: "text-red-400", bg: "bg-red-400/10" },
              { icon: <Bluetooth />, title: "Relay Mesh", desc: "Devices form a temporary network to pass messages to safety.", color: "text-blue-400", bg: "bg-blue-400/10" },
              { icon: <MapPin />, title: "Live GPS Tracking", desc: "Real-time location sharing with emergency contacts.", color: "text-teal-400", bg: "bg-teal-400/10" },
              { icon: <Activity />, title: "AI Risk Assessment", desc: "Analyzes location, time, and environment for potential threats.", color: "text-purple-400", bg: "bg-purple-400/10" },
              { icon: <Users />, title: "Safe Circle", desc: "Instantly notify your trusted contacts with one tap.", color: "text-green-400", bg: "bg-green-400/10" },
              { icon: <Clock />, title: "Emergency Timeline", desc: "Immutable log of events, locations, and sensor data.", color: "text-amber-400", bg: "bg-amber-400/10" }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn} className="bg-surface-900 border border-surface-800 p-8 rounded-2xl hover:border-surface-600 transition-colors">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-7 h-7" })}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Risk Assessment Visual */}
      <section className="py-24 bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Threat Detection</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">Our system evaluates multiple data points to assess risk levels continuously.</p>
          </div>
          
          <div className="bg-surface-950 rounded-2xl border border-surface-800 p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-300 border-b border-surface-800 pb-2">Inputs</h3>
                <div className="space-y-4">
                  <div className="bg-surface-900 p-3 rounded-lg border border-surface-700 flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-slate-400" /> <span>Time of Day</span>
                  </div>
                  <div className="bg-surface-900 p-3 rounded-lg border border-surface-700 flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-400" /> <span>Location Crime Rate</span>
                  </div>
                  <div className="bg-surface-900 p-3 rounded-lg border border-surface-700 flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-slate-400" /> <span>Movement Patterns</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center py-8 md:py-0">
                <div className="w-full flex justify-center space-x-2">
                  <div className="h-0.5 w-1/3 bg-blue-500/50 mt-4"></div>
                  <Activity className="w-10 h-10 text-blue-400 animate-pulse" />
                  <div className="h-0.5 w-1/3 bg-blue-500/50 mt-4"></div>
                </div>
                <span className="mt-4 text-sm font-medium text-blue-400 bg-blue-950 px-3 py-1 rounded-full">Rules Engine</span>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-300 border-b border-surface-800 pb-2">Outputs</h3>
                <div className="space-y-4">
                  <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50 flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span>Low Risk (0-30)</span>
                  </div>
                  <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-900/50 flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div> <span>Moderate (31-70)</span>
                  </div>
                  <div className="bg-red-950/30 p-3 rounded-lg border border-red-900/50 flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div> <span>High Risk (71-100)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to upgrade your personal safety?</h2>
          <p className="text-xl text-slate-300 mb-10">Join Save Shield today and ensure you're never truly disconnected from help.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Create Free Account
            </Link>
            <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-surface-800 hover:bg-surface-700 text-white rounded-xl font-bold text-lg transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-950 py-12 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-bold text-slate-300">Save Shield</span>
          </div>
          <div className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Save Shield. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
