import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  Briefcase,
  Headphones,
  User,
  Bell,
  Search,
  Zap,
  FileEdit,
  FilePlus2,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { RoleKey, UserProfile, SystemNotification } from '../../types';

interface HeaderProps {
  currentRole: RoleKey;
  onRoleChange: (role: RoleKey) => void;
  currentUser: UserProfile;
  notifications: SystemNotification[];
  onOpenQuickDispatch: (mode: 'quick' | 'proxy' | 'internal') => void;
  onNavigate: (menuKey: string) => void;
  activeMenu: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  notifications,
  onOpenQuickDispatch,
  onNavigate,
  activeMenu,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleConfigs: Record<
    RoleKey,
    { label: string; tag: string; icon: React.ReactNode; color: string; desc: string }
  > = {
    admin: {
      label: '超级管理员',
      tag: '后台全权',
      icon: <Shield className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: '管理权限配置、首页业务配置、双客户库及系统调度',
    },
    regional_manager: {
      label: '区域经理',
      tag: '华东片区主管',
      icon: <UserCheck className="w-4 h-4 text-indigo-600" />,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      desc: '负责客户认领审批、客户经理变更分配、片区咨询分流',
    },
    sales_manager: {
      label: '销售经理',
      tag: '业务前线',
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: '待办处理、快速发送委托、代填委托、任务拆分与认领申请',
    },
    customer_service: {
      label: '客服专员',
      tag: '所综合 / LIMS',
      icon: <Headphones className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: '名称规范判断、补填取号、自动取号、样品签收审核',
    },
    client: {
      label: '客户代表',
      tag: '企业用户端',
      icon: <User className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: '客户端首页、四分区委托书填报、多中心进度查询、长协下单',
    },
  };

  const handleSelectRole = (r: RoleKey) => {
    onRoleChange(r);
    setRoleMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-200">
            <span className="text-sm tracking-tighter">云赛</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-base tracking-tight">
                云上赛宝
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {currentRole === 'client'
                  ? '客户 PC 端'
                  : currentRole === 'customer_service'
                  ? '客服 · 所综合/LIMS'
                  : '业务与管理后台'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              电子五所委托下单业务协同与综合管理平台
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索委托单号 (如 WT2026...)、客户企业名称或试验标准..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Dispatch Buttons for Sales/Admin */}
          {(currentRole === 'sales_manager' || currentRole === 'admin') && (
            <div className="hidden lg:flex items-center gap-1.5 pr-2 border-r border-slate-200">
              <button
                onClick={() => onOpenQuickDispatch('quick')}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition active:scale-95"
                title="快速发送委托：仅输入手机号和企业名即可生成委托链接"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                快速发送委托
              </button>
              <button
                onClick={() => onOpenQuickDispatch('proxy')}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 font-medium rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition active:scale-95"
                title="代填委托：单页四分区代客填报"
              >
                <FileEdit className="w-3.5 h-3.5 text-slate-500" />
                代填委托
              </button>
              <button
                onClick={() => onOpenQuickDispatch('internal')}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 font-medium rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition active:scale-95"
                title="内部补下委托：内部直接汇入任务中心拆分"
              >
                <FilePlus2 className="w-3.5 h-3.5 text-slate-500" />
                内部补下
              </button>
            </div>
          )}

          {/* Notifications with Bell & Badge */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="待办与通知提醒"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">通知与待办动态</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                        {unreadCount} 条待处理
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('messages');
                      setNotifDropdownOpen(false);
                    }}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    查看全部
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-2.5 hover:bg-slate-50 transition cursor-pointer ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                      onClick={() => {
                        onNavigate('workbench');
                        setNotifDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unified Role Switcher (Section 1.1.1 & 1.1.2) */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition shadow-xs ${roleConfigs[currentRole].color}`}
              title="单一入口统一角色切换器"
            >
              {roleConfigs[currentRole].icon}
              <span className="font-semibold">{roleConfigs[currentRole].label}</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">
                ({roleConfigs[currentRole].tag})
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3.5 py-1.5 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    切换当前身份权限 (单一入口演示)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    根据文档设计，系统根据后端鉴权动态适配可见菜单与操作按钮
                  </p>
                </div>
                <div className="py-1">
                  {(Object.keys(roleConfigs) as RoleKey[]).map((rKey) => {
                    const cfg = roleConfigs[rKey];
                    const isSelected = rKey === currentRole;
                    return (
                      <button
                        key={rKey}
                        onClick={() => handleSelectRole(rKey)}
                        className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition ${
                          isSelected ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5">{cfg.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">{cfg.label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
                              {cfg.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                            {cfg.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition ${
              activeMenu === 'profile' ? 'bg-slate-100 ring-1 ring-slate-300' : ''
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="text-left hidden xl:block">
              <div className="text-xs font-medium text-slate-800 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {currentUser.region}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
