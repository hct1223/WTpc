import React, { useState } from 'react';
import {
  ArrowLeft,
  Building,
  User,
  Phone,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Stamp,
  Download,
  AlertTriangle,
  History,
  ShieldCheck,
  Calendar,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { CommissionOrder } from '../../types';

interface CommissionDetailProps {
  order: CommissionOrder;
  onBack: () => void;
  onConfirmPushToService: (orderId: string) => void;
  onRejectOrder: (orderId: string, reasons: string[], primaryReason: string) => void;
  onSaveAgentEdit: (
    orderId: string,
    updatedFields: { sampleName: string; sampleQuantity: number; price: number; remarks: string }
  ) => void;
  onOpenSplitTasks: (order: CommissionOrder) => void;
}

export const CommissionDetail: React.FC<CommissionDetailProps> = ({
  order,
  onBack,
  onConfirmPushToService,
  onRejectOrder,
  onSaveAgentEdit,
  onOpenSplitTasks,
}) => {
  const [isAgentEditing, setIsAgentEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit fields
  const [editSampleName, setEditSampleName] = useState(order.sampleName);
  const [editSampleQuantity, setEditSampleQuantity] = useState(order.sampleQuantity);
  const [editPrice, setEditPrice] = useState(order.price);
  const [editRemarks, setEditRemarks] = useState('客户电话沟通要求增加样品抽检数量');

  // Reject Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([
    '样品信息不完整或缺少检测标准',
  ]);
  const [primaryReason, setPrimaryReason] = useState<string>(
    '样品信息不完整或缺少检测标准'
  );

  // Stamp Approval Modal (Section 1.1.5 / 3.3.4.3 / 3.3.7.2)
  const [showStampModal, setShowStampModal] = useState(false);
  const [stampStep, setStampStep] = useState<'form' | 'timeline' | 'download'>('form');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleRejectReason = (r: string) => {
    if (selectedReasons.includes(r)) {
      if (selectedReasons.length === 1) return; // Keep at least one
      setSelectedReasons(selectedReasons.filter((item) => item !== r));
      if (primaryReason === r) {
        setPrimaryReason(selectedReasons[0]);
      }
    } else {
      setSelectedReasons([...selectedReasons, r]);
    }
  };

  const handleConfirmReject = () => {
    onRejectOrder(order.id, selectedReasons, primaryReason);
    setShowRejectModal(false);
    showToast('已打回该委托单，打回原因已同步通知客户');
  };

  const handleSaveEdit = () => {
    onSaveAgentEdit(order.id, {
      sampleName: editSampleName,
      sampleQuantity: editSampleQuantity,
      price: editPrice,
      remarks: editRemarks,
    });
    setIsAgentEditing(false);
    showToast('代客户修改已保存，修改字段与前后值已记录版本差异');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Breadcrumb & Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          返回待办工作台
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStampModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold transition"
          >
            <Stamp className="w-3.5 h-3.5" />
            获取盖章版本 (审批流)
          </button>
          <button
            onClick={() => onOpenSplitTasks(order)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            任务中心拆分与推送 →
          </button>
        </div>
      </div>

      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 font-mono">{order.orderNo}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            委托单确认详情 · 销售核对与客服协同 · 左右双栏联动处理
          </p>
        </div>

        {isAgentEditing && (
          <div className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-xs font-bold animate-pulse">
            ★ 正在处于代客户修改模式 (将留存版本差异)
          </div>
        )}
      </div>

      {/* Main Two-Column Layout (Matching Screenshot 图 56) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Read-Only Info Tables (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: 客户信息 (含客户简称标签) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>客户企业信息与联系人</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">客户单位名称:</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{order.clientName}</div>
              </div>
              <div>
                <span className="text-slate-400">客户编号:</span>
                <div className="font-mono text-slate-700 mt-0.5">{order.clientNo}</div>
              </div>
              <div>
                <span className="text-slate-400">客户简称标签 (别名库):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {order.clientAliases.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400">联系人与电话:</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {order.contactName} ({order.contactPhone})
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 委托基本信息 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>委托检测项目信息</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">项目名称:</span>
                <div className="font-bold text-slate-900 mt-0.5">{order.projectName}</div>
              </div>
              <div>
                <span className="text-slate-400">所属片区 / 负责销售:</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {order.salesRegion} / {order.assignedTo}
                </div>
              </div>
              <div>
                <span className="text-slate-400">预计费用金额:</span>
                {isAgentEditing ? (
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-2 py-1 mt-1 bg-amber-50 border border-amber-300 rounded font-bold text-emerald-700 text-xs"
                  />
                ) : (
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    ¥{order.price.toLocaleString()}
                  </div>
                )}
              </div>
              <div>
                <span className="text-slate-400">报告输出份数:</span>
                <div className="text-slate-700 mt-0.5">中文 2 份 + 电子版 PDF</div>
              </div>
            </div>
          </div>

          {/* Card 3: 样品信息表格 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                送检样品清单
              </h3>
              {isAgentEditing && (
                <span className="text-[11px] text-amber-700 font-semibold">
                  可直接在表格中调整样品信息
                </span>
              )}
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">样品名称</th>
                  <th className="py-2.5 px-4">型号规格</th>
                  <th className="py-2.5 px-3">送检数量</th>
                  <th className="py-2.5 px-4">批号/编号</th>
                  <th className="py-2.5 px-4">样品处理方式</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {isAgentEditing ? (
                      <input
                        type="text"
                        value={editSampleName}
                        onChange={(e) => setEditSampleName(e.target.value)}
                        className="px-2 py-1 bg-amber-50 border border-amber-300 rounded text-xs w-full font-bold"
                      />
                    ) : (
                      order.sampleName
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono">{order.sampleModel}</td>
                  <td className="py-3 px-3 font-semibold">
                    {isAgentEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editSampleQuantity}
                          onChange={(e) => setEditSampleQuantity(Number(e.target.value))}
                          className="w-16 px-1.5 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-bold"
                        />
                        <span>{order.sampleUnit}</span>
                      </div>
                    ) : (
                      `${order.sampleQuantity} ${order.sampleUnit}`
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">B20240418</td>
                  <td className="py-3 px-4">客户自取 / 留样备查</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 4: 版本区别记录 (Section 3.3.4.3 图 56 "代客户修改进入编辑模式，保存时记录修改字段前后值") */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <History className="w-4 h-4 text-purple-600" />
              <span>版本修改留痕记录 (前后值对比)</span>
            </h3>

            <div className="space-y-2 text-xs">
              {order.versionHistory && order.versionHistory.length > 0 ? (
                order.versionHistory.map((vh, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-800">{vh.version}</span>
                      <span className="font-mono text-[11px]">{vh.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      操作人：<span className="font-medium text-slate-800">{vh.author}</span>
                    </div>
                    <div className="mt-1.5 p-2 bg-white rounded border border-slate-200 text-slate-700 leading-relaxed text-[11px] font-mono">
                      {vh.diff}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-center py-4">
                  初版提交，暂无版本修改记录
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Operation Card & Timeline (4 Cols) */}
        <div className="lg:col-span-4 space-y-5 sticky top-20">
          {/* Card 1: 操作卡片 (三个核心按钮) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              销售核对操作中心
            </h3>

            {!isAgentEditing ? (
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    onConfirmPushToService(order.id);
                    showToast('委托核对确认通过！已推送至综合平台客服待办');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition active:scale-98"
                >
                  <CheckCircle className="w-4 h-4" />
                  确认委托推送客服
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold text-xs transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    打回修改
                  </button>

                  <button
                    onClick={() => setIsAgentEditing(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-semibold text-xs transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    代客户修改
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                <div className="text-[11px] text-amber-900 font-semibold">
                  修改说明 (记录到版本历史):
                </div>
                <input
                  type="text"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-xs"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAgentEditing(false)}
                    className="flex-1 py-1.5 border border-slate-300 bg-white text-slate-700 rounded text-xs"
                  >
                    取消编辑
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs shadow-xs flex items-center justify-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存版本留痕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: 订单进度卡片 (当前状态、创建时间、提交时间、处理计时) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>流转节点与处理计时</span>
            </h3>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>当前节点:</span>
                <span className="font-bold text-blue-700">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span>创建时间:</span>
                <span className="font-mono">{order.submittedAt}</span>
              </div>
              <div className="flex justify-between">
                <span>客户提交时间:</span>
                <span className="font-mono">{order.updatedAt}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-900">
                <span className="font-semibold">当前处理时长计时:</span>
                <span className="font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  2小时 17分
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: 打回修改弹窗 (Section 3.3.4.4 PC端支持多选打回原因并指定主原因) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                打回客户修改 (多选原因与主原因指定)
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-red-50 text-red-900 rounded-lg border border-red-200">
                按规范设计：PC 端支持多选打回原因（后端按数组存储），并指定一条作为主原因展示在提醒通知标题中。
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">
                  选择打回原因 (多选):
                </label>
                <div className="space-y-2">
                  {[
                    '样品信息不完整或缺少检测标准',
                    '企业开票信息与营业执照标准名称不符',
                    '特殊试验环境工况参数未予明确',
                    '未上传样品外观或针脚引脚高清图',
                    '检测报告语言或资质盖章要求填写有误',
                  ].map((reason) => {
                    const isChecked = selectedReasons.includes(reason);
                    return (
                      <div
                        key={reason}
                        onClick={() => handleToggleRejectReason(reason)}
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                          isChecked
                            ? 'bg-red-50/70 border-red-300 text-red-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-red-600"
                          />
                          <span>{reason}</span>
                        </div>
                        {isChecked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryReason(reason);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              primaryReason === reason
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {primaryReason === reason ? '★ 主原因' : '设为主原因'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
              >
                确认打回客户
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 获取盖章版本弹窗 (Section 1.1.5 / 3.3.4.4 / 3.3.7.2 业务章盖章审批流) */}
      {showStampModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stamp className="w-4 h-4 text-purple-600" />
                获取盖章版本 (院综合平台业务章盖章审批流)
              </h3>
              <button onClick={() => setShowStampModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                依据 3.3.7.2 规范：销售发起获取盖章版本后，审批需求推送至院综合平台的业务章盖章审批流（区域经理审批 + 客服确认），办结后返回盖章版本文件至云上赛宝供导出。
              </p>

              {/* Workflow timeline */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800">盖章审批流时间线：</div>
                <div className="space-y-3 text-[11px]">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>1. 销售经理 (张三) 发起盖章申请</span>
                    <span className="text-slate-400 font-normal ml-auto">已完成</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>2. 区域经理 (周主管) 审批同意</span>
                    <span className="text-slate-400 font-normal ml-auto">已通过</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-blue-700 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">
                      ●
                    </span>
                    <span>3. 院综合平台业务章电子用印签批</span>
                    <span className="text-slate-400 font-normal ml-auto">已办结返回</span>
                  </div>
                </div>
              </div>

              {/* Ready file card */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-purple-900">
                    电子五所委托单_加盖业务公章版_{order.orderNo}.pdf
                  </div>
                  <div className="text-[10px] text-purple-700 mt-0.5">
                    已加盖五所公章 | 认证防伪数字水印 | 2.8 MB
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('已开始下载加盖业务章委托单 PDF 文件');
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  导出文件
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowStampModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
