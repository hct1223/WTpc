import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  Search,
  Filter,
  ArrowRightLeft,
  ChevronRight,
  AlertCircle,
  Split,
  Eye,
  Send,
  HelpCircle,
  Tag,
  Building,
  User,
  Zap,
} from 'lucide-react';
import { CommissionOrder, RoleKey } from '../../types';

interface SalesWorkbenchProps {
  orders: CommissionOrder[];
  currentRole: RoleKey;
  onSelectOrder: (order: CommissionOrder) => void;
  onOpenSplitTasks: (order: CommissionOrder) => void;
  onTransferOrder: (orderId: string, targetSales: string, note: string) => void;
  onOpenQuickDispatch: (mode: 'quick' | 'proxy' | 'internal') => void;
}

export const SalesWorkbench: React.FC<SalesWorkbenchProps> = ({
  orders,
  currentRole,
  onSelectOrder,
  onOpenSplitTasks,
  onTransferOrder,
  onOpenQuickDispatch,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'commission' | 'modification' | 'consultation' | 'draft'>('all');
  const [searchKw, setSearchKw] = useState('');

  // Transfer modal
  const [transferTargetOrder, setTransferTargetOrder] = useState<CommissionOrder | null>(null);
  const [targetSalesPerson, setTargetSalesPerson] = useState('李四');
  const [transferNote, setTransferNote] = useState('');

  // Filter orders according to role and tab
  const filteredOrders = orders.filter((ord) => {
    // Permission filter: Consultation regional manager row only visible to regional_manager & admin
    if (ord.isRegionalManagerTask && currentRole !== 'regional_manager' && currentRole !== 'admin') {
      return false;
    }

    if (activeTab !== 'all' && ord.type !== activeTab) {
      return false;
    }

    if (searchKw) {
      const match =
        ord.orderNo.toLowerCase().includes(searchKw.toLowerCase()) ||
        ord.clientName.toLowerCase().includes(searchKw.toLowerCase()) ||
        ord.projectName.toLowerCase().includes(searchKw.toLowerCase()) ||
        ord.sampleName.toLowerCase().includes(searchKw.toLowerCase());
      if (!match) return false;
    }

    return true;
  });

  const handleConfirmTransfer = () => {
    if (!transferTargetOrder) return;
    onTransferOrder(transferTargetOrder.id, targetSalesPerson, transferNote);
    setTransferTargetOrder(null);
    setTransferNote('');
  };

  const getTypeBadge = (type: CommissionOrder['type']) => {
    switch (type) {
      case 'commission':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            委托单
          </span>
        );
      case 'modification':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            修改申请
          </span>
        );
      case 'consultation':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            咨询单
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            草稿
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    if (status.includes('1.待销售确认')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
          1.待销售确认
        </span>
      );
    }
    if (status.includes('2.销售已核对')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
          2.销售已核对
        </span>
      );
    }
    if (status.includes('4.已自动取号')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
          4.已自动取号
        </span>
      );
    }
    if (status.includes('6.检测中')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
          6.检测中
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Summary Cards (Section 3.3.4.2 图 55) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">待处理委托</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">7</div>
            <div className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-medium">
              <span>需尽快核对/确认</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">待跟进单据</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">3</div>
            <div className="text-[11px] text-amber-600 mt-1">含1单跨区域咨询</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">保存草稿</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">2</div>
            <div className="text-[11px] text-slate-400 mt-1">双端草稿互通互联</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">本月委托业绩</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">¥86,500</div>
            <div className="text-[11px] text-emerald-600 mt-1">环比上月 +18.4%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部待办 (7)
            </button>
            <button
              onClick={() => setActiveTab('commission')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'commission'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              委托单 (4)
            </button>
            <button
              onClick={() => setActiveTab('modification')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'modification'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              修改申请 (1)
            </button>
            <button
              onClick={() => setActiveTab('consultation')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'consultation'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              咨询单 (1)
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'draft'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              草稿 (1)
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              placeholder="搜索单号、客户企业或项目..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Region Notice Banner (Section 3.3.4.2) */}
        {currentRole === 'regional_manager' && (
          <div className="px-4 py-2 bg-purple-50/70 border-b border-purple-200 text-purple-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              <span>
                <strong>区域经理权限：</strong>包含「区域经理分配咨询」行权限及委托单转派授权
              </span>
            </span>
            <span className="text-[10px] text-purple-700 font-mono">
              后端权限过滤已激活
            </span>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">单号与类型</th>
                <th className="py-3 px-5">委托客户企业</th>
                <th className="py-3 px-4">检测项目与样品</th>
                <th className="py-3 px-3">金额/费用</th>
                <th className="py-3 px-4">当前流转节点</th>
                <th className="py-3 px-3">对接人</th>
                <th className="py-3 px-5 text-right">操作与协同</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.map((ord) => {
                return (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{ord.orderNo}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        {getTypeBadge(ord.type)}
                        {ord.flowNo && (
                          <span className="font-mono text-[10px] text-slate-400">
                            {ord.flowNo}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{ord.clientName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        联系人: {ord.contactName} ({ord.contactPhone})
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{ord.projectName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        样品: {ord.sampleName} · {ord.sampleQuantity}{ord.sampleUnit} ({ord.sampleModel})
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {ord.price > 0 ? (
                        <span className="text-emerald-700">¥{ord.price.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-400">待核报价</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(ord.status)}
                      <div className="text-[10px] text-slate-400 mt-1">
                        提交: {ord.submittedAt}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 text-slate-800">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{ord.assignedTo}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{ord.salesRegion}</div>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Process / Details button */}
                        <button
                          onClick={() => onSelectOrder(ord)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition active:scale-95 shadow-2xs"
                        >
                          立即处理
                        </button>

                        {/* Task center split button */}
                        <button
                          onClick={() => onOpenSplitTasks(ord)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                          title="任务中心拆分与推送"
                        >
                          <Split className="w-3.5 h-3.5" />
                        </button>

                        {/* Transfer button (3.3.4.2 转派) */}
                        <button
                          onClick={() => setTransferTargetOrder(ord)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                          title="转派委托单 (防呆弹窗二次确认与留痕)"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Order Modal (Section 3.3.4.2 转派留痕) */}
      {transferTargetOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                委托单转派 (防呆二次确认与留痕)
              </h3>
              <button onClick={() => setTransferTargetOrder(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-400">待转派委托单:</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {transferTargetOrder.orderNo} - {transferTargetOrder.clientName}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  当前负责人：{transferTargetOrder.assignedTo}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  转派目标销售经理 <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetSalesPerson}
                  onChange={(e) => setTargetSalesPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="张三">张三 (华东业务组)</option>
                  <option value="李四">李四 (华北业务组)</option>
                  <option value="王五">王五 (华南大区)</option>
                  <option value="赵小刚">赵小刚 (西南组)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  转派原因与备注 (强制留痕)
                </label>
                <textarea
                  rows={3}
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="请输入转派说明，将同步写入蓝信工作台分配日志..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 text-[11px]">
                提示：转派后该委托单待办将从您当前的待办列表移除，并向接收人推送蓝信即时待办提醒。
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setTransferTargetOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                onClick={handleConfirmTransfer}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                确认转派并留痕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
