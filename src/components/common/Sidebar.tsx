import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Send,
  Zap,
  Users2,
  FileCheck2,
  Database,
  SlidersHorizontal,
  LayoutGrid,
  Bell,
  UserCircle2,
  Layers,
  ArrowRightLeft,
  ChevronRight,
} from 'lucide-react';
import { RoleKey, RolePermissionItem } from '../../types';

interface SidebarProps {
  activeMenu: string;
  onSelectMenu: (menuKey: string) => void;
  currentRole: RoleKey;
  rolesConfig: RolePermissionItem[];
  pendingTaskCount: number;
  unreadMessageCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  currentRole,
  rolesConfig,
  pendingTaskCount,
  unreadMessageCount,
}) => {
  // Find current role permissions
  const currentRoleConfig = rolesConfig.find((r) => r.code === currentRole);
  const allowedMenus = currentRoleConfig
    ? currentRoleConfig.menuPermissions
    : ['workbench', 'orders', 'messages', 'profile'];

  // All menu definitions
  const allMenuItems = [
    {
      group: '业务主流程',
      items: [
        {
          id: 'workbench',
          name: currentRole === 'client' ? '系统首页' : '工作台 / 待办',
          icon: LayoutDashboard,
          badge: currentRole !== 'client' && pendingTaskCount > 0 ? pendingTaskCount : undefined,
        },
        {
          id: 'orders',
          name: currentRole === 'client' ? '我的订单' : '订单管理',
          icon: ClipboardList,
        },
        {
          id: 'dispatch',
          name: '发送委托',
          icon: Send,
          desc: '极简/代填/补下',
        },
        {
          id: 'agreement_order',
          name: '长协快速下单',
          icon: Zap,
          desc: '框架协议直达',
        },
      ],
    },
    {
      group: '数据与关系',
      items: [
        {
          id: 'clients',
          name: '客户管理 (赛宝库)',
          icon: Users2,
          desc: '对接关系与别名',
        },
        {
          id: 'claim_approval',
          name: '客户认领审批',
          icon: FileCheck2,
          badge: currentRole === 'regional_manager' || currentRole === 'admin' ? 1 : undefined,
          desc: '区域经理审批流',
        },
        {
          id: 'integrated_clients',
          name: '所综合名称库',
          icon: Database,
          desc: '标准名与取号规范',
        },
      ],
    },
    {
      group: '系统配置与调度',
      items: [
        {
          id: 'permission_config',
          name: '权限配置',
          icon: SlidersHorizontal,
          desc: '角色与菜单操作点',
        },
        {
          id: 'home_config',
          name: '首页业务配置',
          icon: LayoutGrid,
          desc: '宣传板块/Banner/推荐',
        },
        {
          id: 'integration_hub',
          name: '跨系统调度中心',
          icon: ArrowRightLeft,
          desc: '所平台与LIMS回传',
        },
      ],
    },
    {
      group: '公共与服务',
      items: [
        {
          id: 'messages',
          name: '消息中心',
          icon: Bell,
          badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
        },
        {
          id: 'profile',
          name: '个人中心',
          icon: UserCircle2,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800 select-none">
      {/* Current Role Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">当前鉴权状态</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            前后端双控
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs font-semibold text-white tracking-wide">
            {currentRoleConfig?.name || '当前角色'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({allowedMenus.length} 个功能已授权)
          </span>
        </div>
      </div>

      {/* Navigation Menus */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {allMenuItems.map((group) => {
          // Filter visible items based on permissions
          const visibleItems = group.items.filter((item) =>
            allowedMenus.includes(item.id)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.group}>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <div className="text-left truncate">
                          <div>{item.name}</div>
                          {item.desc && !isActive && (
                            <div className="text-[10px] text-slate-400 truncate">
                              {item.desc}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                              isActive
                                ? 'bg-white text-blue-600'
                                : 'bg-red-500 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Specs */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span>系统接口与状态</span>
          <span className="text-emerald-400 font-mono">LIMS/所平台 OK</span>
        </div>
        <p className="leading-tight">
          草稿与委托书双端互通 · 权限修改即时生效
        </p>
      </div>
    </aside>
  );
};
