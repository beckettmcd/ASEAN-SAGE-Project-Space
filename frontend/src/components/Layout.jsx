import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Target, 
  DollarSign, 
  AlertTriangle, 
  Database,
  LogOut,
  Menu,
  X,
  Globe,
  Calendar
} from 'lucide-react';
import { useState } from 'react';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationGroups = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, iconColor: 'text-blue-600' },
        { name: 'SAGE Master Calendar', href: '/calendar', icon: Calendar, iconColor: 'text-violet-600' }
      ]
    },
    {
      label: 'PROJECT MANAGEMENT',
      items: [
        { name: 'ToRs', href: '/tors', icon: FileText, iconColor: 'text-purple-600' },
        { name: 'Assignments', href: '/assignments', icon: Users, iconColor: 'text-indigo-600' },
        { name: 'Donor Projects', href: '/donor-projects', icon: Globe, iconColor: 'text-teal-600' }
      ]
    },
    {
      label: 'PERFORMANCE',
      items: [
        { name: 'Indicators & Results', href: '/indicators', icon: Target, iconColor: 'text-green-600' },
        { name: 'Budgets', href: '/budgets', icon: DollarSign, iconColor: 'text-amber-600' }
      ]
    },
    {
      label: 'RISK & QUALITY',
      items: [
        { name: 'Risks & Issues', href: '/risks', icon: AlertTriangle, iconColor: 'text-red-600' },
        { name: 'Evidence', href: '/evidence', icon: Database, iconColor: 'text-cyan-600' }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
              >
                {sidebarOpen ? <X size={24} className="transition-transform duration-200 hover:rotate-90" /> : <Menu size={24} className="transition-transform duration-200 hover:scale-110" />}
              </button>
              
              {/* Partner Logos */}
              <div className="flex items-center space-x-3 ml-4">
                {/* UKAID Logo */}
                <div className="flex items-center">
                  <img 
                    src="/assets/UKAID.png" 
                    alt="UK Aid from the British people" 
                    className="h-9 w-auto object-contain"
                  />
                </div>
                
                {/* SAGE Logo */}
                <div className="flex items-center">
                  <img 
                    src="/assets/SAGE-Logo.png" 
                    alt="SAGE Programme" 
                    className="h-9 w-auto object-contain"
                  />
                </div>
                
                {/* DAI Logo */}
                <div className="flex items-center">
                  <img 
                    src="/assets/dai-logo.png" 
                    alt="DAI" 
                    className="h-5 w-auto object-contain"
                  />
                </div>
                
                {/* Separator */}
                <div className="h-7 w-px bg-gray-300"></div>
                
                {/* SAGE TA Tracker Title */}
                <h1 className="text-xl font-bold text-primary-700 hidden sm:block">
                  SAGE TA Tracker
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-gradient-to-b from-white to-gray-50 shadow-lg border-r border-gray-200 min-h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col relative">
            {/* Sidebar Header */}
            <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Navigation</h2>
            </div>

            {/* Navigation Groups - Scrollable */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" style={{ paddingBottom: '80px' }}>
              {navigationGroups.map((group, groupIndex) => (
                <div 
                  key={group.label} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${groupIndex * 50}ms` }}
                >
                  {/* Section Label */}
                  <h3 className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  
                  {/* Section Items */}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.href || 
                        (item.href !== '/' && location.pathname.startsWith(item.href));
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`
                            relative group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                            ${isActive
                              ? 'bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                        >
                          {/* Left accent bar for active item */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-r-full"></div>
                          )}
                          
                          {/* Icon with background */}
                          <div className={`
                            mr-3 flex-shrink-0 p-1.5 rounded-lg transition-all duration-200
                            ${isActive 
                              ? 'bg-white shadow-sm' 
                              : 'bg-gray-50 group-hover:bg-white group-hover:shadow-sm'
                            }
                          `}>
                            <Icon
                              className={`
                                h-4 w-4 transition-all duration-200 group-hover:scale-110
                                ${isActive ? item.iconColor : 'text-gray-400 group-hover:' + item.iconColor}
                              `}
                            />
                          </div>
                          
                          {/* Item text */}
                          <span className={`flex-1 ${isActive ? 'font-semibold' : ''}`}>
                            {item.name}
                          </span>
                          
                          {/* Active indicator arrow */}
                          {isActive && (
                            <div className="ml-auto text-primary-600 animate-fade-in">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-gray-200 bg-gradient-to-t from-gray-50 to-white backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user?.role}</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-3">
          {children}
        </main>
      </div>
    </div>
  );
};

