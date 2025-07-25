import React from 'react';
import { Lightbulb, Database, Brain, Code2, BarChart3, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Bulb AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-Powered
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Data Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform raw data into actionable insights with intelligent automation. Generate SQL and Python code, 
              detect quality issues, and create stunning visualizations—all from a single, intuitive interface.
            </p>
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              Bulb AI combines the power of contextual artificial intelligence with enterprise-grade data processing 
              to help analysts, data scientists, and business users work faster and smarter than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                Start Analyzing Data <ArrowRight className="inline ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
            
            {/* Visual Placeholder */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-5xl mx-auto">
              <div className="text-gray-400 text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                [Interactive Dashboard Preview - Showing dual SQL/Python output with live charts]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligence That Understands Your Intent
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop wrestling with complex queries and data quality issues. Bulb AI's contextual intelligence 
              anticipates your needs and delivers clean, actionable results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Data Preview & Profiling</h3>
              <p className="text-gray-600">
                Instantly understand your data structure with AI-powered profiling that identifies patterns, 
                anomalies, and relationships across your datasets.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                [Image: Data profiling dashboard with statistics and quality scores]
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dual-Code Generation</h3>
              <p className="text-gray-600">
                Get both SQL and Python code for every analysis. Switch between languages seamlessly 
                or use both to validate results and enhance reproducibility.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                [Image: Side-by-side SQL and Python code editor with syntax highlighting]
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Driven Data Quality Intelligence</h3>
              <p className="text-gray-600">
                Automatically detect inconsistencies, missing values, and outliers. Get AI-suggested fixes 
                that maintain data integrity while improving accuracy.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                [Image: Data quality report with AI recommendations and fix suggestions]
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Universal Database Support</h3>
              <p className="text-gray-600">
                Connect to PostgreSQL, MySQL, SQLite, and SQL Server with the same intuitive interface. 
                Handle multi-format data and complex joins across tables effortlessly.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                [Image: Database connection interface showing multiple supported systems]
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Visualizations</h3>
              <p className="text-gray-600">
                Create publication-ready charts with Plotly.js integration. Export visualizations and 
                queries for presentations, reports, or further analysis.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                [Image: Interactive chart gallery with export options]
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Context-Aware Query Generation</h3>
              <p className="text-gray-600">
                Natural language processing that understands your business context. Ask questions in plain English 
                and get optimized queries that reflect your intent.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                [Image: Natural language query input with generated SQL output]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Bulb AI Different */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built Different, Built Better
            </h2>
            <p className="text-xl text-gray-600">
              Why teams choose Bulb AI over traditional analytics tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contextual AI Understanding</h3>
                    <p className="text-gray-600">
                      Unlike generic AI tools, Bulb AI learns your data patterns and business logic, 
                      delivering increasingly accurate insights over time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                    <Code2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dual-Output Architecture</h3>
                    <p className="text-gray-600">
                      The only platform that generates both SQL and Python code simultaneously, 
                      giving you flexibility and validation in one workflow.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Scales With Your Growth</h3>
                    <p className="text-gray-600">
                      Start with small datasets and scale to enterprise workloads. Future-ready architecture 
                      with planned Azure Cloud migration ensures you're never limited.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-gray-400 text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                [Image: Split-screen showing simple query input transforming into complex analysis with charts]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonial / Use Case */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl text-white">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl mb-6 leading-relaxed">
              "Bulb AI transformed our monthly reporting process from 3 days to 3 hours. The dual-code output 
              let us validate results across our SQL Server and Python analytics pipeline, giving us confidence 
              in our insights while dramatically reducing manual work."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">SM</span>
              </div>
              <div className="text-left">
                <p className="font-semibold">Sarah Martinez</p>
                <p className="text-blue-100">Senior Data Analyst, TechFlow Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Data Workflow?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join data teams already saving hours every week with intelligent automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Start Your Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Lightbulb className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold text-white">Bulb AI</span>
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Bulb AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;