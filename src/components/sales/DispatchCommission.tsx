import React, { useState } from 'react';
import {
  Zap,
  FileEdit,
  FilePlus2,
  Phone,
  Building,
  Link2,
  CheckCircle2,
  Copy,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SaibaoClientRecord } from '../../types';

interface DispatchCommissionProps {
  saibaoClients: SaibaoClientRecord[];
  initialMode?: 'quick' | 'proxy' | 'internal';
  onOrderCreated: (newOrder: any) => void;
  onOpenSplitTasks: (order: any) => void;
}

export const DispatchCommission: React.FC<DispatchCommissionProps> = ({
  saibaoClients,
  initialMode = 'quick',
  onOrderCreated,
  onOpenSplitTasks,
}) => {
  const [currentMode, setCurrentMode] = useState<'quick' | 'proxy' | 'internal'>(initialMode);

  // Quick Dispatch Form State
  const [quickPhone, setQuickPhone] = useState('13800000000');
  const [quickClientName, setQuickClientName] = useState('苏州XX科技有限公司');
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    token: string;
    expiresAt: string;
    isAutoArchived: boolean;
  } | null>(null);

  // Proxy Dispatch Form State (单页四分区 + 顶部绿色客户确认卡片 + 蒙版)
  const [selectedProxyClient, setSelectedProxyClient] = useState<SaibaoClientRecord>(
    saibaoClients[0]
  );
  const [isClientConfirmed, setIsClientConfirmed] = useState(false);
  const [proxyProjectName, setProxyProjectName] = useState('车载芯片高温高湿及振动综合试验');
  const [proxySampleName, setProxySampleName] = useState('汽车BCM车身控制器芯片');
  const [proxyQuantity, setProxyQuantity] = useState(3);
  const [proxyPrice, setProxyPrice] = useState(5800);

  // Internal Dispatch Form State
  const [internalProject, setInternalProject] = useState('工信部重大专项元器件摸底复测');
  const [internalSample, setInternalSample] = useState('宇航级DSP处理芯片');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Generate Quick Dispatch Link (Section 3.3.4.1)
  const handleGenerateQuickLink = () => {
    if (!quickPhone.trim() || !quickClientName.trim()) {
      alert('请填写客户手机号和标准客户全称');
      return;
    }

    const matched = saibaoClients.find(
      (c) =>
        c.name.toLowerCase() === quickClientName.trim().toLowerCase() ||
        c.contactPhone === quickPhone.trim()
    );

    const token = `tok_${Math.random().toString(36).substring(2, 10)}`;
    const linkUrl = `https://saibao.casic.cn/order/commission?token=${token}&sales=U-003`;

    setGeneratedLink({
      url: linkUrl,
      token,
      expiresAt: '24小时内有效 (一次性token)',
      isAutoArchived: !matched,
    });

    showToast(
      matched
        ? '已匹配到已有客户档案并生成专属绑定链接！'
        : '未匹配到现有客户档案，系统已生成待审核客户记录 (自动建档待认领入库)'
    );
  };

  // Submit Proxy Form to Client
  const handleSendProxyToClient = () => {
    if (!isClientConfirmed) {
      alert('请先确认顶部客户信息！');
      return;
    }
    const newOrd = {
      id: `ORD-${Date.now()}`,
      orderNo: `WT20261009-0${Math.floor(Math.random() * 90 + 10)}`,
      clientName: selectedProxyClient.name,
      clientNo: selectedProxyClient.clientNo,
      clientAliases: selectedProxyClient.aliases,
      contactName: selectedProxyClient.contactPerson,
      contactPhone: selectedProxyClient.contactPhone,
      projectName: proxyProjectName,
      sampleName: proxySampleName,
      sampleModel: 'PROXY-MOD-01',
      sampleQuantity: proxyQuantity,
      sampleUnit: '件',
      price: proxyPrice,
      type: 'commission',
      status: '1.待销售确认',
      statusCode: 1,
      assignedTo: '张三',
      salesRegion: selectedProxyClient.region,
      submittedAt: '刚刚',
      updatedAt: '刚刚',
    };
    onOrderCreated(newOrd);
    showToast(`代填委托单 ${newOrd.orderNo} 已生成，并推向客户蓝信确认！`);
  };

  // Submit Internal Order (direct to Task Center)
  const handleInternalSubmit = () => {
    const newOrd = {
      id: `ORD-${Date.now()}`,
      orderNo: `WT20261009-INT${Math.floor(Math.random() * 90 + 10)}`,
      clientName: '五所内部重大攻关试验专项',
      clientNo: 'INT-SAIBAO-01',
      clientAliases: ['五所内部', '专项组'],
      contactName: '张三',
      contactPhone: '138-0000-0000',
      projectName: internalProject,
      sampleName: internalSample,
      sampleModel: 'DSP-MIL-88',
      sampleQuantity: 2,
      sampleUnit: '套',
      price: 8800,
      type: 'commission',
      status: '2.销售已核对',
      statusCode: 2,
      assignedTo: '张三',
      salesRegion: '华东区',
      submittedAt: '刚刚',
      updatedAt: '刚刚',
    };
    onOrderCreated(newOrd);
    onOpenSplitTasks(newOrd);
    showToast(`内部补下委托已生成，跳过客户确认，直汇任务中心拆分！`);
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

      {/* Header Tabs (3 Modes Matching 3.3.4.1 图 54) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              发送委托 (销售 PC 端三种发起模式 · 3.3.4.1)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              提供「快速发送委托」、「代填委托」和「内部补下委托」三个入口卡片，与蓝信手机端发起模式全面对齐。
            </p>
          </div>
        </div>

        {/* 3 Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Card 1: 快速发送委托 */}
          <div
            onClick={() => setCurrentMode('quick')}
            className={`p-5 rounded-xl border cursor-pointer transition select-none ${
              currentMode === 'quick'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                极简推荐
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">快速发送委托</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              仅需客户手机号和标准客户全称，生成带一次性 token 链接，客户打开后自填并自动绑定销售。
            </p>
          </div>

          {/* Card 2: 代填委托 */}
          <div
            onClick={() => setCurrentMode('proxy')}
            className={`p-5 rounded-xl border cursor-pointer transition select-none ${
              currentMode === 'proxy'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileEdit className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                四分区代填
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">代填委托</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              单页四分区设计，顶部绿色客户确认卡片，确认客户后移除蒙版代客填报，最后推向客户确认。
            </p>
          </div>

          {/* Card 3: 内部补下委托 */}
          <div
            onClick={() => setCurrentMode('internal')}
            className={`p-5 rounded-xl border cursor-pointer transition select-none ${
              currentMode === 'internal'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <FilePlus2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                内部直接拆分
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">内部补下委托</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              销售个人填写、个人核对后直接汇入任务中心拆分，下单前不经客户审核，极速直通实验室。
            </p>
          </div>
        </div>
      </div>

      {/* MODE 1: 快速发送委托 (Section 3.3.4.1) */}
      {currentMode === 'quick' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>快速发送委托 (PC 极简模式)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              仅需两个字段即可生成专属委托链接。未匹配到已有客户档案时只生成待审核的客户记录（自动建档不等于入库）。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                客户手机号码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  placeholder="请输入客户对接人手机号"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                标准客户名称 (提醒销售填写工商标准全称) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickClientName}
                  onChange={(e) => setQuickClientName(e.target.value)}
                  placeholder="如: 苏州XX科技有限公司 (请填写标准全称)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              链接将通过蓝信工作台消息通道发送（短信自动兜底），客户打开进入委托书并自动绑定当前销售。
            </span>
            <button
              onClick={handleGenerateQuickLink}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
            >
              生成一次性委托链接 →
            </button>
          </div>

          {/* Generated Link Card */}
          {generatedLink && (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>专属委托链接已生成 (带一次性Token与有效期)</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                  {generatedLink.expiresAt}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-blue-200 font-mono text-[11px] text-slate-800">
                <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate flex-1">{generatedLink.url}</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(generatedLink.url);
                    showToast('委托链接已复制至剪贴板');
                  }}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 text-xs flex items-center gap-1 font-sans"
                >
                  <Copy className="w-3.5 h-3.5" />
                  复制
                </button>
              </div>

              {generatedLink.isAutoArchived && (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    提示：该客户为全新企业，系统已生成待审核客户记录，需经「认领申请 → 区域经理审批」后正式入库。
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: 代填委托 (Section 3.3.4.1 单页四分区 + 顶部绿色客户确认卡片 + 蒙版) */}
      {currentMode === 'proxy' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-emerald-600" />
              <span>代填委托 (单页四分区 + 客户确认蒙版引导)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              顶部绿色客户确认卡片，销售确认客户信息后解除灰色蒙版方可填写，发送前再次校验客户确认状态。
            </p>
          </div>

          {/* Top Green Client Confirmation Card (Section 3.3.4.1 图 54) */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-emerald-900">
                  {selectedProxyClient.name}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                  {selectedProxyClient.clientNo}
                </span>
              </div>
              <div className="text-[11px] text-emerald-800 flex flex-wrap gap-3">
                <span>联系人: {selectedProxyClient.contactPerson}</span>
                <span>电话: {selectedProxyClient.contactPhone}</span>
                <span>简称标签: {selectedProxyClient.aliases.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                disabled={isClientConfirmed}
                value={selectedProxyClient.id}
                onChange={(e) => {
                  const target = saibaoClients.find((c) => c.id === e.target.value);
                  if (target) setSelectedProxyClient(target);
                }}
                className="px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-900 text-xs focus:outline-none disabled:opacity-50"
              >
                {saibaoClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    切换客户: {c.name}
                  </option>
                ))}
              </select>

              <button
                disabled={isClientConfirmed}
                onClick={() => {
                  setIsClientConfirmed(true);
                  showToast('客户信息已确认，表单蒙版已解除！');
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  isClientConfirmed
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {isClientConfirmed ? '✓ 客户已确认 (蒙版已解除)' : '确认客户信息 (解除蒙版)'}
              </button>
            </div>
          </div>

          {/* Form Area with Gray Mask if not confirmed */}
          <div className="relative">
            {!isClientConfirmed && (
              <div className="absolute inset-0 z-20 bg-slate-100/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center p-6 text-center select-none">
                <div className="p-4 bg-white rounded-xl shadow-lg border border-slate-300 max-w-sm">
                  <UserCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="font-bold text-slate-900 text-sm">表单区域已蒙版锁定</div>
                  <p className="text-xs text-slate-500 mt-1">
                    请先在上方绿色卡片核对客户名称与简称，点击「确认客户信息」后解除蒙版填写委托。
                  </p>
                </div>
              </div>
            )}

            <div
              className={`p-5 rounded-xl border border-slate-200 space-y-4 text-xs transition ${
                !isClientConfirmed ? 'filter blur-[0.5px] pointer-events-none' : 'bg-white'
              }`}
            >
              <div className="font-bold text-slate-800 text-sm">单页四分区委托表单 (代填)</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">委托项目名称</label>
                  <input
                    type="text"
                    value={proxyProjectName}
                    onChange={(e) => setProxyProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">送检样品名称</label>
                  <input
                    type="text"
                    value={proxySampleName}
                    onChange={(e) => setProxySampleName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">样品数量</label>
                  <input
                    type="number"
                    value={proxyQuantity}
                    onChange={(e) => setProxyQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">预估费用金额 (元)</label>
                  <input
                    type="number"
                    value={proxyPrice}
                    onChange={(e) => setProxyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  disabled={!isClientConfirmed}
                  onClick={handleSendProxyToClient}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
                >
                  发送给客户确认 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: 内部补下委托 (Section 3.3.4.1 下单前不经客户，直汇任务中心拆分) */}
      {currentMode === 'internal' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FilePlus2 className="w-4 h-4 text-indigo-600" />
              <span>内部补下委托 (直接汇入任务中心拆分)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              销售个人填写、个人核对后直接汇入任务中心拆分，下单之前不经客户，下单之后流程与其他委托一致。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">内部专项项目名称</label>
              <input
                type="text"
                value={internalProject}
                onChange={(e) => setInternalProject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">摸底样品名称</label>
              <input
                type="text"
                value={internalSample}
                onChange={(e) => setInternalSample(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 text-xs">
            内部补下完成后，系统将立即跳转至「任务中心拆分」页面，您可以直接向检测中心、数据中心、分析中心进行独立下单推送。
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleInternalSubmit}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95"
            >
              内部核对完成 · 直汇任务中心拆分 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
