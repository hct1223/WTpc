import React from 'react';
import {
  UserCircle2,
  Building,
  Shield,
  Phone,
  BarChart3,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  LayoutGrid,
  FileText,
} from 'lucide-react';
import { UserProfile as IUserProfile, CommissionOrder } from '../../types';

interface UserProfileProps {
  user: IUserProfile;
  orders: CommissionOrder[];
  onNavigate: (menuKey: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, orders, onNavigate }) => {
  // Statistics strictly based on specification:
  // "统计口径固定：进行中=未商务闭环、已完成=商务闭环"
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === '9.已商务闭环').length;
  const inProgressOrders = totalOrders - completedOrders;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <UserCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">个人中心 (PC 端 · 3.3.6.3)</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              展示当前登录用户的基本身份信息、商务闭环订单统计数据及常用快捷功能菜单入口。
            </p>
          </div>
        </div>
      </div>

      {/* User Basic Info Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {user.roleName}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 font-mono">
                {user.employeeNo}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap gap-4">
              <span>所属机构：{user.unit}</span>
              <span>负责部门：{user.department}</span>
              <span>业务片区：{user.region}</span>
              <span>联系电话：{user.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Statistics - Fixed Business Scope (进行中=未商务闭环、已完成=商务闭环) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>委托订单统计数据看板 (固定统计口径)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              统计口径定义：进行中 = 未商务闭环 (包含检测、审核、开票中)，已完成 = 商务闭环 (全款结清与报告交付)
            </p>
          </div>
          <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            统计实时计算
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">总委托订单数</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
              {totalOrders}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">包含所有流转中与历史单据</div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>进行中委托数量 (未商务闭环)</span>
            </div>
            <div className="text-3xl font-extrabold text-amber-900 mt-1 font-mono">
              {inProgressOrders}
            </div>
            <div className="text-[11px] text-amber-700 mt-1">待销售确认、检测或财务流程中</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>已完成委托数量 (已商务闭环)</span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
              {completedOrders}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1">资金已到账、发票已开具、报告交付完毕</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Menu Entrances */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">快捷功能菜单入口</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => onNavigate('workbench')}
            className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition"
          >
            <div className="font-semibold text-slate-800">工作台 / 待办列表</div>
            <div className="text-[11px] text-slate-400 mt-0.5">查看7单待处理委托</div>
          </button>
          <button
            onClick={() => onNavigate('permission_config')}
            className="p-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition"
          >
            <div className="font-semibold text-slate-800">权限配置管理</div>
            <div className="text-[11px] text-slate-400 mt-0.5">角色与菜单操作点</div>
          </button>
          <button
            onClick={() => onNavigate('home_config')}
            className="p-3 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-left transition"
          >
            <div className="font-semibold text-slate-800">首页业务宣传配置</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Banner与分类推荐管理</div>
          </button>
          <button
            onClick={() => onNavigate('clients')}
            className="p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition"
          >
            <div className="font-semibold text-slate-800">客户关系与别名库</div>
            <div className="text-[11px] text-slate-400 mt-0.5">双客户库与认领审批</div>
          </button>
        </div>
      </div>
    </div>
  );
};
