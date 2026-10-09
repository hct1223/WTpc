import React, { useState } from 'react';
import {
  Search,
  Zap,
  Flame,
  LayoutGrid,
  Building,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Truck,
  Download,
  DollarSign,
  ShieldCheck,
  Thermometer,
  Cpu,
  FlaskConical,
  ExternalLink,
  ArrowRight,
  Package,
} from 'lucide-react';
import { HomeSectionConfig, CommissionOrder, SaibaoClientRecord } from '../../types';

interface ClientPortalPreviewProps {
  homeSections: HomeSectionConfig[];
  orders: CommissionOrder[];
  clients: SaibaoClientRecord[];
  onOpenOrderForm: () => void;
}

export const ClientPortalPreview: React.FC<ClientPortalPreviewProps> = ({
  homeSections,
  orders,
  clients,
  onOpenOrderForm,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'form' | 'orders' | 'agreement'>('home');
  const [selectedOrder, setSelectedOrder] = useState<CommissionOrder>(orders[0]);

  // Client order form state (3.3.3.2 单页四分区 + 蒙版引导)
  const [clientInputName, setClientInputName] = useState('苏州XX科技');
  const [matchedManager, setMatchedManager] = useState<{
    name: string;
    phone: string;
    confirmed: boolean;
    notice?: string;
  } | null>(null);

  // Notice accordion
  const [noticeExpanded, setNoticeExpanded] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Express tab in order details
  const [expressTab, setExpressTab] = useState<'send' | 'receive'>('send');

  // Match manager logic
  const handleMatchManager = () => {
    const val = clientInputName.trim().toLowerCase();
    const matched = clients.find(
      (c) =>
        c.name.toLowerCase().includes(val) ||
        c.aliases.some((a) => a.toLowerCase().includes(val))
    );

    if (matched) {
      const notice =
        matched.changeHistory && matched.changeHistory[0]?.notifyMonthNotice
          ? `原销售 ${matched.changeHistory[0].prevManager} 已替换对接人为 ${matched.salesManagerName}（可电话联系原销售对接历史事项）`
          : undefined;

      setMatchedManager({
        name: matched.salesManagerName || '张三 (默认分配)',
        phone: matched.salesManagerPhone || '138-0000-0000',
        confirmed: false,
        notice,
      });
    } else {
      setMatchedManager({
        name: '张三 (系统智能就近分配)',
        phone: '138-0000-0000',
        confirmed: false,
      });
    }
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Thermometer':
        return <Thermometer className="w-6 h-6 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-500" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-purple-500" />;
      default:
        return <Package className="w-6 h-6 text-slate-400" />;
    }
  };

  // 13 workflow nodes for Multi-center parallel progress (Section 3.3.3.3)
  const workflowNodes = [
    '客户填写',
    '销售核对',
    '客服审核',
    '核对样品',
    '技术复审',
    '进样分发',
    '环境检测',
    '数据分析',
    '复测校核',
    '报告编制',
    '主审签发',
    '电子用印',
    '商务闭环',
  ];

  return (
    <div className="space-y-6">
      {/* Client Preview Navigation Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
            客
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                客户 PC 端全流程沉浸式体验 (3.3.3)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                已实时同步管理后台首页配置
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              与小程序端共用同一套后端接口、委托书 Schema 与草稿数据
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            首页与板块
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            委托书 (四分区+蒙版)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            订单详情 (多中心13节点)
          </button>
          <button
            onClick={() => setActiveTab('agreement')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'agreement'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            长协快速下单
          </button>
        </div>
      </div>

      {/* 1. 客户首页 (3.3.3.1 图 48) */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Top Search Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">您好，李工</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                欢迎使用工业和信息化部电子第五研究所 · 云上赛宝委托下单平台
              </p>
            </div>
            <div className="w-full md:w-96 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索检测标准 (如 GB/T 2423)、试验项目或芯片样品..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dynamic Sections Rendered according to Admin Config (order & enabled) */}
          {homeSections
            .filter((s) => s.enabled)
            .sort((a, b) => a.order - b.order)
            .map((section) => {
              if (section.code === 'banner') {
                return (
                  <div
                    key={section.id}
                    className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
                  >
                    <div className="space-y-1 z-10">
                      {section.config.bannerBadge && (
                        <span className="inline-block px-2 py-0.5 rounded bg-black/20 text-xs font-semibold tracking-wide">
                          {section.config.bannerBadge}
                        </span>
                      )}
                      <h3 className="text-xl font-bold tracking-tight">
                        {section.config.bannerTitle || '长协客户快速下单'}
                      </h3>
                      <p className="text-xs text-amber-100 max-w-xl leading-relaxed">
                        {section.config.bannerSubtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('agreement')}
                      className="z-10 px-6 py-2.5 bg-white text-orange-600 font-bold text-xs rounded-xl hover:bg-amber-50 transition shadow-sm whitespace-nowrap active:scale-95"
                    >
                      {section.config.bannerButtonText || '立即下单 →'}
                    </button>
                  </div>
                );
              }

              if (section.code === 'categories') {
                return (
                  <div key={section.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-blue-600" />
                        <span>检测业务分类浏览 (3×2 宫格)</span>
                      </h3>
                      <span className="text-xs text-slate-400">点击进入专业试验室</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {section.config.items?.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActiveTab('form')}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer transition flex items-center gap-3.5 group"
                        >
                          <div className="p-2.5 bg-white rounded-lg shadow-2xs group-hover:scale-105 transition">
                            {getCategoryIcon(item.icon)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 truncate">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {item.standard}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (section.code === 'recommendations') {
                return (
                  <div key={section.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-red-500" />
                        <span>热门推荐项目 (4 列卡片网格)</span>
                      </h3>
                      <span className="text-xs text-slate-400">电子元器件与整机高频试验</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {section.config.items?.map((rec) => (
                        <div
                          key={rec.id}
                          onClick={() => setActiveTab('form')}
                          className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition space-y-3 bg-white group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600">
                                {rec.title}
                              </span>
                              <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.2 rounded font-bold border border-red-200">
                                {rec.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                              依据标准：{rec.standard}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-600">{rec.price}</span>
                            <span className="text-[11px] text-blue-600 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                              立即委托 <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}
        </div>
      )}

      {/* 2. 委托书填写：单页四分区 + 蒙版引导 (3.3.3.2 图 49) */}
      {activeTab === 'form' && (
        <div className="space-y-6">
          {/* Top Blue Card: 销售经理对接 (3.3.3.2) */}
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900">
                  引导能力 1：销售经理对接 (输入企业标准名称匹配)
                </h3>
              </div>
              <span className="text-xs text-blue-700">
                未确认经理前表单覆盖灰色蒙版不可填写
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={clientInputName}
                onChange={(e) => setClientInputName(e.target.value)}
                placeholder="请输入您的企业标准全称 (如: 苏州XX科技有限公司)..."
                className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleMatchManager}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                智能匹配对接经理
              </button>
            </div>

            {/* Matched Manager Prompt */}
            {matchedManager && (
              <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>匹配对接销售经理：{matchedManager.name} ({matchedManager.phone})</span>
                  </div>
                  {matchedManager.notice && (
                    <div className="text-[11px] text-amber-700 font-medium">
                      ★ 提示：{matchedManager.notice}
                    </div>
                  )}
                </div>

                <button
                  disabled={matchedManager.confirmed}
                  onClick={() =>
                    setMatchedManager({ ...matchedManager, confirmed: true })
                  }
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    matchedManager.confirmed
                      ? 'bg-slate-100 text-slate-500 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {matchedManager.confirmed ? '✓ 经理已确认 (蒙版已自动解除)' : '确认对接经理 (解除蒙版)'}
                </button>
              </div>
            )}
          </div>

          {/* Yellow Card: 委托须知可折叠 (3.3.3.2) */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
            <div
              onClick={() => setNoticeExpanded(!noticeExpanded)}
              className="flex items-center justify-between cursor-pointer select-none font-bold text-amber-900"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>引导能力 2：委托须知条款 (可折叠展示全部条款)</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-amber-700">
                <span>{noticeExpanded ? '收起条款' : '展开条款'}</span>
                {noticeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </div>

            {noticeExpanded && (
              <div className="text-[11px] text-amber-800 leading-relaxed space-y-1.5 pt-1 border-t border-amber-200/60">
                <p>1. 委托方应提供真实、有效、具有代表性的样品，并对其知识产权及合规性承担法律责任。</p>
                <p>2. 电子五所检验检测均严格遵循 CNAS / CMA 国家计量认证要求与既定标准规程。</p>
                <p>3. 样品检验结束后，若无特别说明，将在报告出具后 30 日内进行留样归档或依约返还。</p>
              </div>
            )}

            <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-amber-950 font-bold cursor-pointer select-none">
                我已仔细阅读并同意以上全部条款 (勾选后方可提交)
              </label>
            </div>
          </div>

          {/* Form Area with Gray Mask & 4 Partitions (3.3.3.2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 9 Cols: 4 Partitions with Gray Mask if manager not confirmed */}
            <div className="lg:col-span-9 relative">
              {(!matchedManager || !matchedManager.confirmed) && (
                <div className="absolute inset-0 z-20 bg-slate-100/75 backdrop-blur-[1px] rounded-2xl flex items-center justify-center p-6 text-center select-none">
                  <div className="p-5 bg-white rounded-xl shadow-lg border border-slate-300 max-w-md">
                    <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-bold text-slate-900 text-sm">表单受蒙版保护已锁定</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      请先在上方浅蓝色卡片中输入企业名称并「确认对接经理」，经理匹配成功后蒙版将自动解除！
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`space-y-6 ${
                  !matchedManager || !matchedManager.confirmed
                    ? 'filter blur-[0.5px] pointer-events-none'
                    : ''
                }`}
              >
                {/* 分区 1: 委托信息 */}
                <div id="part1" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    分区一：委托单位与商务信息
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">委托单位名称</label>
                      <input
                        type="text"
                        defaultValue="苏州XX科技有限公司"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">委托单号</label>
                      <input
                        type="text"
                        defaultValue="WT20261009-088"
                        disabled
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 分区 2: 样品信息 */}
                <div id="part2" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    分区二：送检样品信息
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">样品名称</label>
                      <input
                        type="text"
                        defaultValue="车载主控PCB板"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">规格型号</label>
                      <input
                        type="text"
                        defaultValue="PCB-2024-A"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">样品数量</label>
                      <input
                        type="number"
                        defaultValue={3}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 分区 3: 样品处理要求 */}
                <div id="part3" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    分区三：样品处理要求
                  </h4>
                  <div className="text-xs text-slate-700 flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="sampleHandle" defaultChecked className="text-blue-600" />
                      <span>试验后寄回委托方 (运费到付)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="sampleHandle" className="text-blue-600" />
                      <span>由检测机构留样归档销毁</span>
                    </label>
                  </div>
                </div>

                {/* 分区 4: 报告输出与商务要求 */}
                <div id="part4" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    分区四：报告输出与资质印章
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">资质盖章需求</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                        <option>加盖 CNAS + CMA 双章 (默认)</option>
                        <option>仅出具五所内部试验报告</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">发票类型</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900">
                        <option>增值税专用发票 (13%)</option>
                        <option>增值税普通发票</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom Submit */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    disabled={!agreedTerms}
                    onClick={() => {
                      alert('委托书已提交！已推向销售经理张三进行核对');
                      setActiveTab('orders');
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
                  >
                    提交委托申请 →
                  </button>
                </div>
              </div>
            </div>

            {/* Right 3 Cols: 问题点清单 (3.3.3.2 引导能力 3) */}
            <div className="lg:col-span-3 sticky top-20 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-3">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                引导能力 3：问题点清单
              </div>
              <p className="text-[11px] text-slate-400">实时显示待处理必填项，点击定位：</p>
              <div className="space-y-2">
                <a
                  href="#part1"
                  className="block p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium"
                >
                  ✓ 分区一：企业名称已填报
                </a>
                <a
                  href="#part2"
                  className="block p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium"
                >
                  ✓ 分区二：样品数量已核对
                </a>
                <a
                  href="#part3"
                  className="block p-2 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-medium"
                >
                  ● 分区三：寄件地址待确认
                </a>
                <div
                  className={`p-2 rounded-lg text-[11px] font-medium ${
                    agreedTerms ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {agreedTerms ? '✓ 委托须知已勾选' : '✕ 待勾选委托须知条款'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 订单详情与多中心并行进度 (3.3.3.3 图 50 & 51) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: 多中心并行进度 13个节点条 (3.3.3.3) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card: 多中心并行进度 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      多中心并行进度 (分析中心、检测中心、数据中心)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      细化为13个节点横向节点条，当前节点高亮，不涉及中心灰显禁用
                    </p>
                  </div>
                  <span className="font-mono text-xs text-blue-600 font-bold">
                    {selectedOrder.orderNo}
                  </span>
                </div>

                {/* 3 Parallel Center Progress Lines */}
                <div className="space-y-4 text-xs">
                  {/* Center 1: 检测中心 (主节点) */}
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                    <div className="font-bold text-blue-900 flex items-center justify-between">
                      <span>检测中心 (环境与可靠性大楼)</span>
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                        当前进行至：节点 6. 环境检测
                      </span>
                    </div>
                    {/* 13 Nodes Mini-Bar */}
                    <div className="grid grid-cols-13 gap-1 text-[9px] text-center font-mono py-1">
                      {workflowNodes.map((node, i) => {
                        const isDone = i < 6;
                        const isCurrent = i === 6;
                        return (
                          <div
                            key={i}
                            title={`${i + 1}. ${node}`}
                            className={`py-1 rounded truncate px-0.5 ${
                              isCurrent
                                ? 'bg-blue-600 text-white font-bold animate-pulse'
                                : isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Center 2: 数据中心 */}
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
                    <div className="font-bold text-indigo-900 flex items-center justify-between">
                      <span>数据中心 (可靠性寿命外推建模)</span>
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-bold">
                        当前进行至：节点 7. 数据分析
                      </span>
                    </div>
                    <div className="grid grid-cols-13 gap-1 text-[9px] text-center font-mono py-1">
                      {workflowNodes.map((node, i) => {
                        const isDone = i < 7;
                        const isCurrent = i === 7;
                        return (
                          <div
                            key={i}
                            className={`py-1 rounded truncate px-0.5 ${
                              isCurrent
                                ? 'bg-indigo-600 text-white font-bold animate-pulse'
                                : isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Center 3: 分析中心 (当前不涉及，整行灰显禁用 3.3.3.3 规范) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 opacity-60 space-y-2">
                    <div className="font-bold text-slate-500 flex items-center justify-between">
                      <span>分析中心 (芯片切片微观分析)</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                        本单不涉及分析中心 (已灰显禁用)
                      </span>
                    </div>
                    <div className="grid grid-cols-13 gap-1 text-[9px] text-center font-mono py-1 opacity-40">
                      {workflowNodes.map((node, i) => (
                        <div key={i} className="py-1 rounded bg-slate-200 text-slate-500">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Basic Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                  订单基本信息
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">单号:</span> {selectedOrder.orderNo}
                  </div>
                  <div>
                    <span className="text-slate-400">委托单位:</span> {selectedOrder.clientName}
                  </div>
                  <div>
                    <span className="text-slate-400">试验项目:</span> {selectedOrder.projectName}
                  </div>
                  <div>
                    <span className="text-slate-400">金额:</span> ¥{selectedOrder.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: 快递信息、报告文件、财务信息 (3.3.3.3) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Card 1: 快递信息 (寄件/收件 Tab) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>快递物流动态</span>
                  </span>
                  <div className="flex bg-slate-100 rounded p-0.5 text-[10px]">
                    <button
                      onClick={() => setExpressTab('send')}
                      className={`px-2 py-0.5 rounded ${
                        expressTab === 'send' ? 'bg-white font-bold text-blue-600 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      寄件轨迹
                    </button>
                    <button
                      onClick={() => setExpressTab('receive')}
                      className={`px-2 py-0.5 rounded ${
                        expressTab === 'receive' ? 'bg-white font-bold text-blue-600 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      样品返还
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-mono text-slate-900 font-bold">顺丰特快: SF1234567890</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    已送达电子五所收样中心 1号智能柜，签收人：客服小刘
                  </div>
                </div>
              </div>

              {/* Card 2: 报告文件下载 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>电子检测报告 (可下载)</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-purple-900 text-[11px]">
                      检测报告_R2026-0076.pdf
                    </div>
                    <div className="text-[10px] text-purple-700">带国家认证电子防伪章</div>
                  </div>
                  <button
                    onClick={() => alert('已开始下载电子版试验检测报告 PDF')}
                    className="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 3: 财务状态 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>财务与合同状态 (只读回传)</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">发票状态:</span>
                    <span className="font-semibold text-slate-700">增值税专票 · 待开具</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">到账情况:</span>
                    <span className="font-semibold text-emerald-600">已全款到账 (¥5,800)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">框架合同:</span>
                    <span className="font-semibold text-blue-600">HT-2026-SZ008 (生效中)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 长协快速下单 (3.3.3.4 图 52) */}
      {activeTab === 'agreement' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>长协客户快速下单 (3.3.3.4 表格框架项目)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              以表格形式展示框架项目，点击创建带协议标记的草稿直达委托书填写，跳过经理匹配和委托须知环节；协议到期项目置灰并提示转普通委托。
            </p>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">框架项目名称</th>
                <th className="py-3 px-4">检测标准</th>
                <th className="py-3 px-3">协议优惠价</th>
                <th className="py-3 px-3">有效期至</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">高温老化试验 (长协专享)</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">GB/T 2423.2</td>
                <td className="py-3.5 px-3 font-bold text-amber-600">¥1,200/次 (原价¥1,500)</td>
                <td className="py-3.5 px-3 font-mono">2026-12-31</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      alert('已创建带长协协议标记的委托草稿，已跳过经理匹配和委托须知直达填报！');
                      setActiveTab('form');
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    快速下单 →
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">温度循环与热冲击测试</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">GB/T 2423.22</td>
                <td className="py-3.5 px-3 font-bold text-amber-600">¥1,800/次 (原价¥2,200)</td>
                <td className="py-3.5 px-3 font-mono">2026-12-31</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      alert('已创建带长协协议标记的委托草稿，直达委托书！');
                      setActiveTab('form');
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    快速下单 →
                  </button>
                </td>
              </tr>
              <tr className="bg-slate-50 opacity-60">
                <td className="py-3.5 px-4 text-slate-500 font-medium">芯片微裂纹探伤 (已逾期)</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">MIL-STD-883</td>
                <td className="py-3.5 px-3 text-slate-400">¥3,500/次</td>
                <td className="py-3.5 px-3 font-mono text-red-500">2026-06-30 (已过期)</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => alert('该长协协议已到期，请转入普通委托流程下单。')}
                    className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
                  >
                    协议到期 (转普通委托)
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
