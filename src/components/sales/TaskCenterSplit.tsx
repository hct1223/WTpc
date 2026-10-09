import React, { useState } from 'react';
import {
  ArrowLeft,
  Split,
  Building2,
  CheckCircle2,
  Send,
  AlertCircle,
  FileCheck,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react';
import { CommissionOrder } from '../../types';

interface TaskCenterSplitProps {
  order: CommissionOrder;
  onBack: () => void;
  onFinishSplit: () => void;
}

export const TaskCenterSplit: React.FC<TaskCenterSplitProps> = ({
  order,
  onBack,
  onFinishSplit,
}) => {
  // Push status for 3 centers
  const [centersStatus, setCentersStatus] = useState({
    testing: {
      pushed: order.splitTasks?.testingCenter?.pushed || false,
      quote: order.splitTasks?.testingCenter?.quote || 3200,
      cnas: order.splitTasks?.testingCenter?.cnas ?? true,
      cma: order.splitTasks?.testingCenter?.cma ?? true,
      csTarget: '客服小刘 (队列待办: 2单)',
    },
    data: {
      pushed: order.splitTasks?.dataCenter?.pushed || false,
      quote: order.splitTasks?.dataCenter?.quote || 1200,
      cnas: order.splitTasks?.dataCenter?.cnas ?? false,
      cma: order.splitTasks?.dataCenter?.cma ?? true,
      csTarget: '客服主管林芳 (队列待办: 0单)',
    },
    analysis: {
      pushed: order.splitTasks?.analysisCenter?.pushed || false,
      quote: order.splitTasks?.analysisCenter?.quote || 1400,
      cnas: order.splitTasks?.analysisCenter?.cnas ?? true,
      cma: order.splitTasks?.analysisCenter?.cma ?? false,
      csTarget: '元财院客服组 (队列待办: 3单)',
    },
  });

  // Modal for pushing a specific center
  const [activeCenterModal, setActiveCenterModal] = useState<
    'testing' | 'data' | 'analysis' | null
  >(null);
  const [tempQuote, setTempQuote] = useState(3200);
  const [tempCnas, setTempCnas] = useState(true);
  const [tempCma, setTempCma] = useState(true);
  const [tempCs, setTempCs] = useState('客服小刘 (队列待办: 2单)');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenPushModal = (centerKey: 'testing' | 'data' | 'analysis') => {
    setActiveCenterModal(centerKey);
    setTempQuote(centersStatus[centerKey].quote);
    setTempCnas(centersStatus[centerKey].cnas);
    setTempCma(centersStatus[centerKey].cma);
    setTempCs(centersStatus[centerKey].csTarget);
  };

  const handleConfirmPushCenter = () => {
    if (!activeCenterModal) return;
    setCentersStatus((prev) => ({
      ...prev,
      [activeCenterModal]: {
        pushed: true,
        quote: tempQuote,
        cnas: tempCnas,
        cma: tempCma,
        csTarget: tempCs,
      },
    }));
    setActiveCenterModal(null);
    showToast(`该中心任务已推送！包含CNAS/CMA资质设置并已进入客服处理队列`);
  };

  const allCompleted =
    centersStatus.testing.pushed &&
    centersStatus.data.pushed &&
    centersStatus.analysis.pushed;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          返回委托详情
        </button>

        <button
          disabled={!allCompleted}
          onClick={onFinishSplit}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition ${
            allCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-bounce'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          全部中心推送完成 · 确认办结
        </button>
      </div>

      {/* Title & Info Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              任务中心拆分与补充信息 (3.3.4.4)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              由各个院提供业务和中心的映射表，云上赛宝系统自动做任务拆分。横向卡片展示检测中心、数据中心、分析中心，独立补充资质与推送。
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
          <div>
            委托单号：<strong>{order.orderNo}</strong> | 客户：
            <strong>{order.clientName}</strong> | 样品：
            <strong>{order.sampleName}</strong> ({order.sampleQuantity} {order.sampleUnit})
          </div>
          <div className="font-semibold text-blue-800">
            {allCompleted ? '🎉 3个中心均已推送完成' : '待完成中心推送'}
          </div>
        </div>
      </div>

      {/* 3 Horizontal Wide Cards (Matching Screenshot 图 57) */}
      <div className="space-y-4">
        {/* Card 1: 检测中心 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">检测中心 (试验大楼 2号实验室)</h3>
                {centersStatus.testing.pushed ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    已推送客服待办
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    未推送
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  <strong>包含试验项目：</strong>车载高温高湿老化试验、静电放电抗扰度 (GB/T 2423.2)
                </div>
                <div className="text-slate-400 text-[11px] flex gap-4">
                  <span>预计工作量：3人天</span>
                  <span>送检样品数：2块</span>
                  <span>报告份数：正本1份</span>
                  <span>核算金额：¥{centersStatus.testing.quote}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenPushModal('testing')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition shadow-xs ${
                  centersStatus.testing.pushed
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                }`}
              >
                {centersStatus.testing.pushed ? '重新配置推送' : '下单推送 →'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: 数据中心 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">数据中心 (元器件可靠性大数据所)</h3>
                {centersStatus.data.pushed ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    已推送客服待办
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    未推送
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  <strong>包含试验项目：</strong>高加速寿命试验HALT数据建模与失效率寿命外推预测
                </div>
                <div className="text-slate-400 text-[11px] flex gap-4">
                  <span>预计工作量：1人天</span>
                  <span>送检样品数：1套数据源</span>
                  <span>报告份数：数据看板电子归档</span>
                  <span>核算金额：¥{centersStatus.data.quote}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenPushModal('data')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition shadow-xs ${
                  centersStatus.data.pushed
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                }`}
              >
                {centersStatus.data.pushed ? '重新配置推送' : '下单推送 →'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: 分析中心 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">分析中心 (芯片微观失效分析试验室)</h3>
                {centersStatus.analysis.pushed ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    已推送客服待办
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    未推送
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  <strong>包含试验项目：</strong>金相切片分析、微裂纹扫描电镜SEM观测
                </div>
                <div className="text-slate-400 text-[11px] flex gap-4">
                  <span>预计工作量：2人天</span>
                  <span>送检样品数：1件切片样件</span>
                  <span>报告份数：正本1份</span>
                  <span>核算金额：¥{centersStatus.analysis.quote}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenPushModal('analysis')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition shadow-xs ${
                  centersStatus.analysis.pushed
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                }`}
              >
                {centersStatus.analysis.pushed ? '重新配置推送' : '下单推送 →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Push Dialog (Section 3.3.4.4 "补充信息弹窗: 补充报价金额、是否盖 CNAS、是否盖 CMA 章，选择推送客服并显示队列单数；取号字段已改由客服补填，销售端不再填写") */}
      {activeCenterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                推送补充信息弹窗 (3.3.4.4 标准规范)
              </h3>
              <button onClick={() => setActiveCenterModal(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                规范要求：取号字段已改由综合平台客服补填（销售端不再填写），此处仅补充金额、印章资质及指定客服。
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  补充报价金额 (元) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={tempQuote}
                  onChange={(e) => setTempQuote(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* CNAS & CMA Checkboxes */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempCnas}
                    onChange={(e) => setTempCnas(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-bold text-slate-800">是否加盖 CNAS 章</div>
                    <div className="text-[10px] text-slate-400">国家认可委员会资质</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempCma}
                    onChange={(e) => setTempCma(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <div>
                    <div className="font-bold text-slate-800">是否加盖 CMA 章</div>
                    <div className="text-[10px] text-slate-400">检验检测机构资质认定</div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  选择推送客服队列 (实时显示待办单数) <span className="text-red-500">*</span>
                </label>
                <select
                  value={tempCs}
                  onChange={(e) => setTempCs(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="客服小刘 (队列待办: 2单)">
                    客服小刘 (元财院客服组 · 队列待办: 2单)
                  </option>
                  <option value="客服主管林芳 (队列待办: 0单)">
                    客服主管林芳 (综合平台业务组 · 队列待办: 0单)
                  </option>
                  <option value="客服陈晨 (队列待办: 4单)">
                    客服陈晨 (LIMS对接专班 · 队列待办: 4单)
                  </option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setActiveCenterModal(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                onClick={handleConfirmPushCenter}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                确认推送该中心
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
