import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Server,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Stamp,
  Tag,
  ExternalLink,
  ShieldCheck,
  Building,
  Key,
} from 'lucide-react';
import { CommissionOrder } from '../../types';

interface IntegrationCenterProps {
  orders: CommissionOrder[];
}

export const IntegrationCenter: React.FC<IntegrationCenterProps> = ({ orders }) => {
  const [testingSync, setTestingSync] = useState(false);
  const [syncedMsg, setSyncedMsg] = useState<string | null>(null);

  const handleSimulateSync = () => {
    setTestingSync(true);
    setTimeout(() => {
      setTestingSync(false);
      setSyncedMsg('已成功与所综合服务平台与 LIMS 适配层同步 6 条委托数据状态！');
      setTimeout(() => setSyncedMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {syncedMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncedMsg}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                跨系统调度与集成总线 (3.3.5 & 3.3.7)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                云上赛宝不重写核心能力，通过集成适配层打通所综合服务平台与 LIMS 系统的审核、取号、复审、进度、报告与财务状态。
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulateSync}
          disabled={testingSync}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testingSync ? 'animate-spin' : ''}`} />
          {testingSync ? '正在同步跨系统数据...' : '执行三方系统数据对齐'}
        </button>
      </div>

      {/* Three Connected System Cards (Section 3.3.7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 蓝信工作台 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">1. 蓝信工作台 (SSO与待办)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            与蓝信实现单点登录（SSO），销售免登进入；蓝信消息通道实时推送待办提醒，与客户小程序待办互斥同步。
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>SSO 会话状态:</span>
            <span className="font-mono text-emerald-600 font-bold">在线 (OAuth2.0 Token)</span>
          </div>
        </div>

        {/* Card 2: 所综合服务平台 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">2. 所综合服务平台 (取号与名称)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            客服名称规范判断、补填取号字段、自动取号生成流程号（如 FX0426-23267）及业务章电子审批流。
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>自动取号服务:</span>
            <span className="font-mono text-blue-600 font-bold">接口健康 (延迟 42ms)</span>
          </div>
        </div>

        {/* Card 3: LIMS 实验室信息管理系统 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">3. LIMS 系统 (样品与检验)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            主动按委托编号获取委托书、样品核对与签收、技术组复审、检测数据回传与委托变更发起。
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>LIMS 数据适配层:</span>
            <span className="font-mono text-purple-600 font-bold">双向回传队列监听中</span>
          </div>
        </div>
      </div>

      {/* Integration Monitoring Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            委托单跨系统回传状态流水 (取号 / 样品 / 财务 / 报告)
          </h3>
          <span className="text-xs text-slate-400">实时监听</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">赛宝委托单号</th>
              <th className="py-3 px-4">所综合流程号 (取号)</th>
              <th className="py-3 px-4">客户企业名称</th>
              <th className="py-3 px-3">样品签收状态</th>
              <th className="py-3 px-4">财务状态 (开票/到账)</th>
              <th className="py-3 px-4">报告生成状态</th>
              <th className="py-3 px-4">三方系统同步</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  {ord.orderNo}
                </td>
                <td className="py-3 px-4 font-mono">
                  {ord.flowNo ? (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {ord.flowNo}
                    </span>
                  ) : (
                    <span className="text-slate-400">待客服取号</span>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">
                  {ord.clientName}
                </td>
                <td className="py-3 px-3">
                  {ord.statusCode >= 5 ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      已签收入库
                    </span>
                  ) : (
                    <span className="text-slate-400">待寄样/待签收</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                      ord.financial?.isBilled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {ord.financial?.isBilled ? '已开票' : '未开票'}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                      ord.financial?.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {ord.financial?.isPaid ? '已到账' : '未到账'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {ord.reports && ord.reports.length > 0 ? (
                    <span className="text-indigo-600 font-medium">
                      {ord.reports[0].fileName}
                    </span>
                  ) : (
                    <span className="text-slate-400">检测进行中</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    数据已对齐
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
