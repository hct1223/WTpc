import React, { useState } from 'react';
import {
  Users2,
  Database,
  FileCheck2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Tag,
  Building,
  Phone,
  User,
  ArrowRightLeft,
  ShieldAlert,
  Info,
  Calendar,
  Sparkles,
  ExternalLink,
  Edit2,
  UserCheck,
} from 'lucide-react';
import {
  SaibaoClientRecord,
  IntegratedPlatformClientRecord,
  ClientClaimApplication,
  RoleKey,
} from '../../types';

interface ClientDatabaseProps {
  currentRole: RoleKey;
  saibaoClients: SaibaoClientRecord[];
  integratedClients: IntegratedPlatformClientRecord[];
  claims: ClientClaimApplication[];
  onAddSaibaoClient: (client: SaibaoClientRecord) => void;
  onUpdateSaibaoClient: (client: SaibaoClientRecord) => void;
  onApplyClaim: (clientId: string, reason: string) => { success: boolean; message: string };
  onReviewClaim: (claimId: string, approved: boolean, reason?: string) => void;
  onAddIntegratedAlias: (standardName: string, newAlias: string) => void;
}

export const ClientDatabase: React.FC<ClientDatabaseProps> = ({
  currentRole,
  saibaoClients,
  integratedClients,
  claims,
  onAddSaibaoClient,
  onUpdateSaibaoClient,
  onApplyClaim,
  onReviewClaim,
  onAddIntegratedAlias,
}) => {
  const [activeTab, setActiveTab] = useState<'saibao' | 'claims' | 'integrated'>('saibao');
  const [searchKw, setSearchKw] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState<SaibaoClientRecord | null>(null);
  const [claimReasonInput, setClaimReasonInput] = useState('');

  // Reassign Sales Manager Modal
  const [reassignClient, setReassignClient] = useState<SaibaoClientRecord | null>(null);
  const [newSalesName, setNewSalesName] = useState('张三');
  const [showMonthNotice, setShowMonthNotice] = useState(true);

  // New Client Form
  const [newClientName, setNewClientName] = useState('');
  const [newAliases, setNewAliases] = useState<string[]>([]);
  const [aliasInput, setAliasInput] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newRegion, setNewRegion] = useState<'华南区' | '华东区' | '华北区' | '西南区'>('华东区');
  const [newSalesManager, setNewSalesManager] = useState('张三');

  // Name check tool state (for Integrated Platform)
  const [testCheckName, setTestCheckName] = useState('苏州XX');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [newAliasForTarget, setNewAliasForTarget] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Add alias in create form
  const handleAddAlias = () => {
    if (!aliasInput.trim()) return;
    if (newAliases.length >= 5) {
      alert('客户简称最多支持 5 个标签');
      return;
    }
    if (newAliases.includes(aliasInput.trim())) return;
    setNewAliases([...newAliases, aliasInput.trim()]);
    setAliasInput('');
  };

  // Handle create client
  const handleCreateClientSubmit = () => {
    if (!newClientName.trim()) {
      alert('请输入客户标准名称');
      return;
    }
    // Check duplicate
    const existing = saibaoClients.find(
      (c) => c.name.toLowerCase() === newClientName.trim().toLowerCase()
    );
    if (existing) {
      alert(`客户「${newClientName}」已存在于客户库（编号：${existing.clientNo}），请勿重复建档！`);
      return;
    }

    const newRecord: SaibaoClientRecord = {
      id: `C-${Date.now()}`,
      clientNo: `CUST-2026-0${100 + saibaoClients.length + 1}`,
      name: newClientName.trim(),
      aliases: newAliases,
      contactPerson: newContactPerson || '业务对接人',
      contactPhone: newContactPhone || '138-0000-0000',
      region: newRegion,
      salesManagerId: 'U-003',
      salesManagerName: newSalesManager,
      salesManagerPhone: '138-0000-0000',
      status: 'formal',
      createdAt: new Date().toLocaleDateString('zh-CN'),
    };

    onAddSaibaoClient(newRecord);
    setShowCreateModal(false);
    showToast(`客户「${newRecord.name}」已成功建档并绑定对接经理`);
    // Reset
    setNewClientName('');
    setNewAliases([]);
    setNewContactPerson('');
    setNewContactPhone('');
  };

  // Handle reassign manager with 1-month notice prompt (Section 3.3.6.4 & 1.1.5)
  const handleConfirmReassign = () => {
    if (!reassignClient) return;

    const prevManager = reassignClient.salesManagerName;
    const updated: SaibaoClientRecord = {
      ...reassignClient,
      salesManagerName: newSalesName,
      salesManagerId: 'U-003',
      changeHistory: [
        ...(reassignClient.changeHistory || []),
        {
          date: new Date().toLocaleDateString('zh-CN'),
          prevManager: prevManager,
          newManager: newSalesName,
          notifyMonthNotice: showMonthNotice,
          operator: currentRole === 'regional_manager' ? '周主管(区域经理)' : '管理员',
        },
      ],
    };

    onUpdateSaibaoClient(updated);
    setReassignClient(null);
    showToast(
      `已将「${reassignClient.name}」对接经理更新为【${newSalesName}】。${
        showMonthNotice
          ? '已开启1个月过渡提示：客户端搜索时将提示「原销售 ' +
            prevManager +
            ' 已替换对接人为 ' +
            newSalesName +
            '」'
          : '未开启1个月变更提示'
      }`
    );
  };

  // Handle Sales Claim
  const handleApplyClaimSubmit = () => {
    if (!showClaimModal) return;
    const result = onApplyClaim(showClaimModal.id, claimReasonInput);
    setShowClaimModal(null);
    setClaimReasonInput('');
    showToast(result.message);
  };

  // Handle test check for Integrated platform (Section 3.3.5.2)
  const runNameCheck = () => {
    const val = testCheckName.trim();
    if (!val) return;

    // Check if hits standard name or alias
    const exact = integratedClients.find(
      (c) =>
        c.standardName.toLowerCase() === val.toLowerCase() ||
        c.aliases.some((a) => a.toLowerCase() === val.toLowerCase())
    );

    if (exact) {
      setCheckResult({
        hit: true,
        matchType: exact.standardName === val ? '标准名称直接命中' : '别名命中',
        record: exact,
        candidates: [],
      });
    } else {
      // Find up to 3 similar
      const candidates = integratedClients
        .filter((c) => c.standardName.includes(val) || val.includes(c.standardName.slice(0, 4)))
        .slice(0, 3);
      setCheckResult({
        hit: false,
        matchType: '未命中标准名称库 (需要规范化核对)',
        record: null,
        candidates: candidates.length > 0 ? candidates : integratedClients.slice(0, 3),
      });
    }
  };

  // Filter saibao clients
  const filteredSaibaoClients = saibaoClients.filter((c) => {
    const matchesKw =
      !searchKw ||
      c.name.includes(searchKw) ||
      c.clientNo.includes(searchKw) ||
      c.aliases.some((a) => a.includes(searchKw)) ||
      c.contactPerson.includes(searchKw);
    const matchesRegion = regionFilter === 'all' || c.region === regionFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesKw && matchesRegion && matchesStatus;
  });

  const pendingClaimsCount = claims.filter((c) => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner explaining the Two-Database System Architecture */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Users2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  客户库双库维护与对接管理 (3.3.6.4 & 3.3.4.5)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  系统采用双客户库架构：① 云上赛宝客户库（销售对接关系库）与 ② 所综合平台客户库（下单标准名称库）。
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              新建客户档案 (防重校验)
            </button>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 mt-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('saibao')}
            className={`pb-3 flex items-center gap-2 transition border-b-2 -mb-[2px] ${
              activeTab === 'saibao'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>云上赛宝客户库 (销售对接关系库)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px]">
              {saibaoClients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-3 flex items-center gap-2 transition border-b-2 -mb-[2px] ${
              activeTab === 'claims'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>客户认领审批流 (区域经理专属)</span>
            {pendingClaimsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white font-mono text-[10px]">
                {pendingClaimsCount} 待审
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('integrated')}
            className={`pb-3 flex items-center gap-2 transition border-b-2 -mb-[2px] ${
              activeTab === 'integrated'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>所综合平台客户库 (下单名称规范库)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px]">
              名称校验与自动取号
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: 云上赛宝客户库 */}
      {activeTab === 'saibao' && (
        <div className="space-y-4">
          {/* Rules Banner (Section 3.3.6.4 / 1.1.5) */}
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>入库口径与业务规则说明：</strong><br />
              1. 销售在快速发送委托中的「自动建档」仅生成待审核记录，不等同于正式入库；需经「认领申请 → 系统查重 → 区域经理审批」通过后正式入库并建立销售绑定。<br />
              2. 变更对接经理后一个月内，客户端匹配/搜索时将展示「原销售 XXX 已替换对接人为 XXX」，系统默认将对接人指向新销售，并保留原销售电话供联系历史事项。
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  placeholder="搜索客户名称、编号、简称标签或联系人..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">片区:</span>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                >
                  <option value="all">全部片区</option>
                  <option value="华东区">华东区</option>
                  <option value="华南区">华南区</option>
                  <option value="华北区">华北区</option>
                  <option value="西南区">西南区</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">入库状态:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                >
                  <option value="all">全部状态</option>
                  <option value="formal">已正式入库</option>
                  <option value="pending_audit">自动建档待审核</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">客户编号</th>
                    <th className="py-3 px-5">客户标准名称</th>
                    <th className="py-3 px-4">客户简称标签 (最多5个)</th>
                    <th className="py-3 px-4">联系人与电话</th>
                    <th className="py-3 px-3">所属片区</th>
                    <th className="py-3 px-4">对接销售经理</th>
                    <th className="py-3 px-3">入库状态</th>
                    <th className="py-3 px-5 text-right">操作与协同</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSaibaoClients.map((client) => {
                    const isPending = client.status === 'pending_audit';
                    return (
                      <tr key={client.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                          {client.clientNo}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-blue-600" />
                            <span>{client.name}</span>
                          </div>
                          {client.changeHistory && client.changeHistory.length > 0 && (
                            <div className="mt-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                              <span>变更过度期：原对接人 {client.changeHistory[0].prevManager}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {client.aliases.map((alias, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200"
                              >
                                {alias}
                              </span>
                            ))}
                            {client.aliases.length === 0 && (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{client.contactPerson}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {client.contactPhone}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {client.region}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          {client.salesManagerName ? (
                            <div className="flex items-center gap-1.5 text-slate-900">
                              <User className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{client.salesManagerName}</span>
                            </div>
                          ) : (
                            <span className="text-red-500 font-bold text-[11px]">
                              暂无 (待认领)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          {isPending ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              待认领审核
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              已正式入库
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Reassign Sales Manager Button (Regional manager / admin) */}
                            {(currentRole === 'regional_manager' || currentRole === 'admin') && (
                              <button
                                onClick={() => {
                                  setReassignClient(client);
                                  setNewSalesName('李四');
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition"
                                title="调整销售经理并设置1个月提示"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                更换对接人
                              </button>
                            )}

                            {/* Sales Claim Button */}
                            {currentRole === 'sales_manager' && isPending && (
                              <button
                                onClick={() => {
                                  setShowClaimModal(client);
                                  setClaimReasonInput(`申请认领该优质客户，已对接试验需求`);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"
                              >
                                申请认领
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 区域经理客户认领审批流 */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-900 flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">区域经理专属：销售认领申请审批与一键入库</h3>
              <p className="mt-1 leading-relaxed">
                销售发现未对接客户后提交认领申请。系统已自动查重：若已有对接人则直接打回（不进审批）；本列表均为无对接经理申请。
                区域经理审批通过后，系统<strong>「一键设置对接经理」</strong>并将该客户正式转为入库客户，审批不通过则打回并通知销售。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">认领申请单待办</h3>
              <span className="text-xs text-slate-400">共 {claims.length} 条申请记录</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {claims.map((claim) => (
                <div key={claim.id} className="p-5 hover:bg-slate-50 transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 font-bold">{claim.claimNo}</span>
                      <h4 className="text-sm font-bold text-slate-900">{claim.clientName}</h4>
                      <div className="flex items-center gap-1">
                        {claim.clientAliases.map((a, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      {claim.status === 'pending' ? (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[11px]">
                          待区域经理审批
                        </span>
                      ) : claim.status === 'approved' ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[11px]">
                          已审批通过 (已一键绑定入库)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full font-bold text-[11px]">
                          已打回驳回
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400">申请销售:</span>{' '}
                      <span className="font-semibold text-slate-800">
                        {claim.salesName} ({claim.salesPhone})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">所属团队/区域:</span>{' '}
                      <span className="text-slate-800">{claim.salesRegion}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">提交时间:</span>{' '}
                      <span className="text-slate-800">{claim.appliedAt}</span>
                    </div>
                    <div className="md:col-span-3">
                      <span className="text-slate-400">申请认领理由:</span>{' '}
                      <span className="text-slate-700 font-medium">{claim.reason}</span>
                    </div>
                  </div>

                  {claim.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => {
                          const r = prompt('请输入打回原因', '已有同事在跟进中，或不符合片区拓客分配');
                          if (r) {
                            onReviewClaim(claim.id, false, r);
                            showToast('已打回该认领申请，结果已推向销售待办');
                          }
                        }}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition"
                      >
                        打回驳回
                      </button>
                      <button
                        onClick={() => {
                          onReviewClaim(claim.id, true);
                          showToast('一键设置对接经理成功！客户已正式入库并建立销售绑定');
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        审批通过并一键设置对接经理
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 所综合平台客户库 (下单名称库) */}
      {activeTab === 'integrated' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
            <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">所综合平台客户库 (下单标准名称与取号规范)</h3>
              <p className="mt-1 leading-relaxed">
                下单用的标准名称库，由客服在名称核对环节维护（新增客户 / 补充简称），服务于名称规范判断与自动取号。
                客户委托书中的企业名称命中标准名称或简称即判定规范；未命中时系统推荐 3 条相近名称，并支持「在此客户下新建简称」直接补充入库！
              </p>
            </div>
          </div>

          {/* Real-Time Name Check Simulator (Section 3.3.5.2 图 60) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  名称规范判断模拟器 (客服端 3.3.5.2 核心算法)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                实时校验客户输入名称是否符合取号规范
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={testCheckName}
                onChange={(e) => setTestCheckName(e.target.value)}
                placeholder="输入待核对的企业名称 (如: 苏州XX, 航科, 某某微电子)..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={runNameCheck}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition active:scale-95"
              >
                执行规范判断
              </button>
            </div>

            {/* Check Results Display */}
            {checkResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-3 ${
                  checkResult.hit
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {checkResult.hit ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="font-bold text-sm text-slate-900">
                      判定结果：{checkResult.matchType}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      checkResult.hit
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {checkResult.hit ? '合规 · 允许直接取号' : '未命中 · 需客服核对/补充简称'}
                  </span>
                </div>

                {checkResult.hit && checkResult.record && (
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 text-slate-700 space-y-1">
                    <div>
                      <strong>标准名称:</strong> {checkResult.record.standardName}
                    </div>
                    <div>
                      <strong>统一社会信用代码:</strong> {checkResult.record.creditCode}
                    </div>
                    <div>
                      <strong>已登记简称:</strong> {checkResult.record.aliases.join(', ')}
                    </div>
                  </div>
                )}

                {!checkResult.hit && (
                  <div className="space-y-2">
                    <p className="text-slate-700 font-medium">
                      未能直接命中标准库。系统根据算法智能匹配相近客户名称（最多 3 条）：
                    </p>
                    <div className="space-y-2">
                      {checkResult.candidates.map((cand: IntegratedPlatformClientRecord) => (
                        <div
                          key={cand.id}
                          className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{cand.standardName}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              信用代码: {cand.creditCode} | 已有简称: {cand.aliases.join(', ')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`补充别名「${testCheckName}」`}
                              value={newAliasForTarget}
                              onChange={(e) => setNewAliasForTarget(e.target.value)}
                              className="px-2 py-1 border border-slate-200 rounded text-xs w-36"
                            />
                            <button
                              onClick={() => {
                                const a = newAliasForTarget || testCheckName;
                                onAddIntegratedAlias(cand.standardName, a);
                                setNewAliasForTarget('');
                                runNameCheck();
                                showToast(`已在「${cand.standardName}」下新增别名标签「${a}」`);
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold whitespace-nowrap"
                            >
                              在此客户下新建简称
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Standard Names Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">所综合标准企业名称列表</h3>
              <span className="text-xs text-slate-400">共 {integratedClients.length} 家标准入库企业</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">企业标准名称</th>
                  <th className="py-3 px-4">统一社会信用代码</th>
                  <th className="py-3 px-5">已关联简称/别名库 (回传索引)</th>
                  <th className="py-3 px-4">核验客服</th>
                  <th className="py-3 px-4">最后更新</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {integratedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {client.standardName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {client.creditCode}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-wrap gap-1">
                        {client.aliases.map((al, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]"
                          >
                            {al}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{client.verifiedBy}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {client.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Create New Client (Section 3.3.4.5 图 58) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                新增客户档案 (自动生成编号与查重)
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  客户标准全称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="请输入工商标准客户全称 (保存时自动查重)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  客户简称 (最多 5 个标签，进入经理匹配别名索引)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAlias();
                      }
                    }}
                    placeholder="输入简称按回车添加"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddAlias}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                  >
                    + 添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {newAliases.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] flex items-center gap-1"
                    >
                      {a}
                      <button
                        onClick={() => setNewAliases(newAliases.filter((_, idx) => idx !== i))}
                        className="text-blue-400 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {newAliases.length === 0 && (
                    <span className="text-slate-400 text-[10px]">尚未添加简称标签</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">联系人姓名</label>
                  <input
                    type="text"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    placeholder="如: 李工"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">联系电话</label>
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="如: 138-0000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">所属片区</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                  >
                    <option value="华东区">华东区</option>
                    <option value="华南区">华南区</option>
                    <option value="华北区">华北区</option>
                    <option value="西南区">西南区</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    指定对接销售经理
                  </label>
                  <select
                    value={newSalesManager}
                    onChange={(e) => setNewSalesManager(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                  >
                    <option value="张三">张三 (华东区)</option>
                    <option value="李四">李四 (华北区)</option>
                    <option value="王五">王五 (华南区)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                onClick={handleCreateClientSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                保存建档
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Reassign Manager with 1-Month Notice Prompt (Section 3.3.6.4 & 1.1.5) */}
      {reassignClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                更换客户对接经理 (业务变更与提示防呆)
              </h3>
              <button onClick={() => setReassignClient(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500">目标客户:</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{reassignClient.name}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  当前对接人：<strong>{reassignClient.salesManagerName || '暂无'}</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  新对接销售经理
                </label>
                <select
                  value={newSalesName}
                  onChange={(e) => setNewSalesName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="张三">张三 (华东业务部)</option>
                  <option value="李四">李四 (华北业务部)</option>
                  <option value="王五">王五 (华南大区)</option>
                  <option value="赵小刚">赵小刚 (西南业务部)</option>
                </select>
              </div>

              {/* Requirement: 3.3.6.4 / 1.1.5 提示在一个月内展示该提示 */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>规范防呆：客户端 1 个月过渡提示设置</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  客户对接经理发生变更后一个月内，客户端在原企业匹配/搜索时将显示：
                  <span className="font-semibold block bg-amber-100/80 p-1.5 rounded mt-1">
                    「原销售 {reassignClient.salesManagerName} 已替换对接人为 {newSalesName}」
                  </span>
                  系统默认将对接人指向新销售，同时保留原销售联系方式供电话联系。
                </p>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMonthNotice}
                    onChange={(e) => setShowMonthNotice(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-800">
                    在一个月内开启此过渡提示 (推荐开启)
                  </span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setReassignClient(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReassign}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                确认变更并生效
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Sales Claim Submission (Section 3.3.6.4) */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                提交客户认领申请 (推送区域经理审批)
              </h3>
              <button onClick={() => setShowClaimModal(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500">申请认领客户:</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{showClaimModal.name}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  编号：{showClaimModal.clientNo} | 片区：{showClaimModal.region}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  认领理由与业务跟进计划 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={claimReasonInput}
                  onChange={(e) => setClaimReasonInput(e.target.value)}
                  placeholder="说明接洽渊源、合作项目需求等，提交后将推向区域经理审批..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <p className="text-[11px] text-slate-400">
                系统将自动核验是否已有对接人；无对接人将推送区域经理审批；审核通过后一键生效。
              </p>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowClaimModal(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs"
              >
                取消
              </button>
              <button
                onClick={handleApplyClaimSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                提交认领申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
