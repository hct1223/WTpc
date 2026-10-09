/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  RoleKey,
  UserProfile as IUserProfile,
  RolePermissionItem,
  HomeSectionConfig,
  SaibaoClientRecord,
  IntegratedPlatformClientRecord,
  ClientClaimApplication,
  CommissionOrder,
  SystemNotification,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_ROLES,
  INITIAL_HOME_SECTIONS,
  INITIAL_SAIBAO_CLIENTS,
  INITIAL_INTEGRATED_CLIENTS,
  INITIAL_CLAIM_APPLICATIONS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from './mock/initialData';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PermissionConfig } from './components/admin/PermissionConfig';
import { HomeConfig } from './components/admin/HomeConfig';
import { ClientDatabase } from './components/admin/ClientDatabase';
import { SalesWorkbench } from './components/sales/SalesWorkbench';
import { CommissionDetail } from './components/sales/CommissionDetail';
import { TaskCenterSplit } from './components/sales/TaskCenterSplit';
import { DispatchCommission } from './components/sales/DispatchCommission';
import { IntegrationCenter } from './components/integration/IntegrationCenter';
import { UserProfile } from './components/profile/UserProfile';
import { ClientPortalPreview } from './components/client/ClientPortalPreview';
import { MessagesCenter } from './components/messages/MessagesCenter';

export default function App() {
  // Current user & role state
  const [currentRole, setCurrentRole] = useState<RoleKey>('admin');
  const currentUser = INITIAL_USERS[currentRole];

  // Active Menu
  const [activeMenu, setActiveMenu] = useState<string>('workbench');

  // Master Data States
  const [roles, setRoles] = useState<RolePermissionItem[]>(INITIAL_ROLES);
  const [homeSections, setHomeSections] = useState<HomeSectionConfig[]>(INITIAL_HOME_SECTIONS);
  const [saibaoClients, setSaibaoClients] = useState<SaibaoClientRecord[]>(INITIAL_SAIBAO_CLIENTS);
  const [integratedClients, setIntegratedClients] = useState<IntegratedPlatformClientRecord[]>(
    INITIAL_INTEGRATED_CLIENTS
  );
  const [claims, setClaims] = useState<ClientClaimApplication[]>(INITIAL_CLAIM_APPLICATIONS);
  const [orders, setOrders] = useState<CommissionOrder[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Sub-navigation view states
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<CommissionOrder | null>(null);
  const [selectedSplitOrder, setSelectedSplitOrder] = useState<CommissionOrder | null>(null);
  const [quickDispatchMode, setQuickDispatchMode] = useState<'quick' | 'proxy' | 'internal' | null>(
    null
  );

  // Red dot badges
  const pendingTaskCount = orders.filter((o) => o.statusCode <= 2).length;
  const unreadMessageCount = notifications.filter((n) => !n.read).length;

  // Handle Role Change
  const handleRoleChange = (newRole: RoleKey) => {
    setCurrentRole(newRole);
    // Reset any deep sub-page
    setSelectedOrderDetail(null);
    setSelectedSplitOrder(null);
    setQuickDispatchMode(null);

    // Auto set appropriate default menu based on permissions
    const targetRoleCfg = roles.find((r) => r.code === newRole);
    if (targetRoleCfg && !targetRoleCfg.menuPermissions.includes(activeMenu)) {
      setActiveMenu(targetRoleCfg.menuPermissions[0] || 'workbench');
    }
  };

  // Add/Update Roles in PermissionConfig
  const handleUpdateRole = (updatedRole: RolePermissionItem) => {
    setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  const handleAddRole = (newRole: RolePermissionItem) => {
    setRoles((prev) => [...prev, newRole]);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  // Add/Update Saibao Client
  const handleAddSaibaoClient = (client: SaibaoClientRecord) => {
    setSaibaoClients((prev) => [client, ...prev]);
  };

  const handleUpdateSaibaoClient = (client: SaibaoClientRecord) => {
    setSaibaoClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
  };

  // Add alias in integrated platform
  const handleAddIntegratedAlias = (standardName: string, newAlias: string) => {
    setIntegratedClients((prev) =>
      prev.map((c) =>
        c.standardName === standardName && !c.aliases.includes(newAlias)
          ? { ...c, aliases: [...c.aliases, newAlias], updatedAt: '刚刚' }
          : c
      )
    );
  };

  // Apply claim logic
  const handleApplyClaim = (clientId: string, reason: string) => {
    const targetClient = saibaoClients.find((c) => c.id === clientId);
    if (!targetClient) return { success: false, message: '未找到对应客户' };

    // Duplicate check: if already has manager, reject immediately
    if (targetClient.salesManagerName && targetClient.salesManagerName !== '暂无（待认领）') {
      return {
        success: false,
        message: `打回申请：客户库中该客户已有对接经理（${targetClient.salesManagerName}），按系统规范直接打回！`,
      };
    }

    const newClaim: ClientClaimApplication = {
      id: `CLM-${Date.now()}`,
      claimNo: `CLM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0${claims.length + 1}`,
      clientId: targetClient.id,
      clientName: targetClient.name,
      clientAliases: targetClient.aliases,
      salesId: currentUser.id,
      salesName: currentUser.name,
      salesRegion: currentUser.region,
      salesPhone: currentUser.phone,
      reason: reason || '日常拓客接洽',
      status: 'pending',
      appliedAt: '刚刚',
    };

    setClaims((prev) => [newClaim, ...prev]);
    return {
      success: true,
      message: '系统核验无对接人，已推送区域经理审批！',
    };
  };

  // Review claim logic (by Regional Manager)
  const handleReviewClaim = (claimId: string, approved: boolean, rejectionReason?: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    if (approved) {
      // Approve and update client in saibao clients
      setSaibaoClients((prev) =>
        prev.map((c) =>
          c.id === claim.clientId
            ? {
                ...c,
                salesManagerId: claim.salesId,
                salesManagerName: claim.salesName,
                salesManagerPhone: claim.salesPhone,
                status: 'formal',
              }
            : c
        )
      );
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: 'approved',
                reviewedAt: '刚刚',
                reviewerName: currentUser.name,
              }
            : c
        )
      );
      // Push notification
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          title: '认领申请已审批通过',
          content: `区域经理已同意您对「${claim.clientName}」的认领申请，已一键设置为对接经理！`,
          type: 'claim',
          date: '刚刚',
          read: false,
        },
        ...prev,
      ]);
    } else {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: 'rejected',
                rejectionReason: rejectionReason || '未通过区域经理审核',
                reviewedAt: '刚刚',
                reviewerName: currentUser.name,
              }
            : c
        )
      );
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          title: '认领申请已被打回',
          content: `您对「${claim.clientName}」的认领申请未通过审批，原因：${rejectionReason || '不符合分配要求'}`,
          type: 'claim',
          date: '刚刚',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  // Order Operations
  const handleConfirmPushToService = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: '3.待客服审核',
              statusCode: 3,
              updatedAt: '刚刚',
            }
          : o
      )
    );
    setSelectedOrderDetail(null);
  };

  const handleRejectOrder = (orderId: string, reasons: string[], primaryReason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: '打回修改',
              statusCode: 0,
              updatedAt: '刚刚',
              versionHistory: [
                ...(o.versionHistory || []),
                {
                  version: `打回记录 (${reasons.length}项原因)`,
                  date: '刚刚',
                  author: currentUser.name,
                  diff: `主原因：${primaryReason}；附加原因：${reasons.join('、')}`,
                },
              ],
            }
          : o
      )
    );
    setSelectedOrderDetail(null);
  };

  const handleSaveAgentEdit = (
    orderId: string,
    updated: { sampleName: string; sampleQuantity: number; price: number; remarks: string }
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const diffText = `[代客修改] 样品名称: ${o.sampleName} -> ${updated.sampleName}; 数量: ${o.sampleQuantity} -> ${updated.sampleQuantity}; 金额: ¥${o.price} -> ¥${updated.price}; 备注: ${updated.remarks}`;
        return {
          ...o,
          sampleName: updated.sampleName,
          sampleQuantity: updated.sampleQuantity,
          price: updated.price,
          versionHistory: [
            ...(o.versionHistory || []),
            {
              version: `v${(o.versionHistory?.length || 1) + 1}.0 (代客修改)`,
              date: '刚刚',
              author: `${currentUser.name} (销售代改)`,
              diff: diffText,
            },
          ],
        };
      })
    );
  };

  const handleTransferOrder = (orderId: string, targetSales: string, note: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedTo: targetSales,
              versionHistory: [
                ...(o.versionHistory || []),
                {
                  version: '转派留痕记录',
                  date: '刚刚',
                  author: currentUser.name,
                  diff: `从 ${o.assignedTo} 转派至 ${targetSales}，原因：${note || '业务分工调整'}`,
                },
              ],
            }
          : o
      )
    );
  };

  const handleAddOrder = (newOrder: CommissionOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Notification read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* 1. Header (Unified Single Entry & Role Switcher) */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        notifications={notifications}
        activeMenu={activeMenu}
        onNavigate={(menu) => {
          setSelectedOrderDetail(null);
          setSelectedSplitOrder(null);
          setQuickDispatchMode(null);
          setActiveMenu(menu);
        }}
        onOpenQuickDispatch={(mode) => {
          setSelectedOrderDetail(null);
          setSelectedSplitOrder(null);
          setQuickDispatchMode(mode);
          setActiveMenu('dispatch');
        }}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 2. Sidebar Navigation (Role-filtered) */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={(menuKey) => {
            setSelectedOrderDetail(null);
            setSelectedSplitOrder(null);
            setQuickDispatchMode(null);
            setActiveMenu(menuKey);
          }}
          currentRole={currentRole}
          rolesConfig={roles}
          pendingTaskCount={pendingTaskCount}
          unreadMessageCount={unreadMessageCount}
        />

        {/* 3. Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* Sub-view: Commission Order Detail */}
          {selectedOrderDetail ? (
            <CommissionDetail
              order={selectedOrderDetail}
              onBack={() => setSelectedOrderDetail(null)}
              onConfirmPushToService={handleConfirmPushToService}
              onRejectOrder={handleRejectOrder}
              onSaveAgentEdit={handleSaveAgentEdit}
              onOpenSplitTasks={(ord) => {
                setSelectedOrderDetail(null);
                setSelectedSplitOrder(ord);
              }}
            />
          ) : selectedSplitOrder ? (
            /* Sub-view: Task Center Split */
            <TaskCenterSplit
              order={selectedSplitOrder}
              onBack={() => {
                setSelectedSplitOrder(null);
                setSelectedOrderDetail(selectedSplitOrder);
              }}
              onFinishSplit={() => {
                setSelectedSplitOrder(null);
                setActiveMenu('workbench');
              }}
            />
          ) : (
            /* Main Menu Components */
            <>
              {/* Client Portal Preview / Client Role */}
              {currentRole === 'client' && (
                <ClientPortalPreview
                  homeSections={homeSections}
                  orders={orders}
                  clients={saibaoClients}
                  onOpenOrderForm={() => {}}
                />
              )}

              {/* Workbench / Orders (for non-client roles) */}
              {currentRole !== 'client' && (activeMenu === 'workbench' || activeMenu === 'orders') && (
                <SalesWorkbench
                  orders={orders}
                  currentRole={currentRole}
                  onSelectOrder={(ord) => setSelectedOrderDetail(ord)}
                  onOpenSplitTasks={(ord) => setSelectedSplitOrder(ord)}
                  onTransferOrder={handleTransferOrder}
                  onOpenQuickDispatch={(mode) => {
                    setQuickDispatchMode(mode);
                    setActiveMenu('dispatch');
                  }}
                />
              )}

              {/* Dispatch Commission (3 Modes: Quick, Proxy, Internal) */}
              {activeMenu === 'dispatch' && (
                <DispatchCommission
                  saibaoClients={saibaoClients}
                  initialMode={quickDispatchMode || 'quick'}
                  onOrderCreated={(newOrd) => handleAddOrder(newOrd)}
                  onOpenSplitTasks={(newOrd) => setSelectedSplitOrder(newOrd)}
                />
              )}

              {/* Agreement Order Entrance */}
              {activeMenu === 'agreement_order' && (
                <ClientPortalPreview
                  homeSections={homeSections}
                  orders={orders}
                  clients={saibaoClients}
                  onOpenOrderForm={() => {}}
                />
              )}

              {/* Permission Config (PC 端 · 3.3.6.1) */}
              {activeMenu === 'permission_config' && (
                <PermissionConfig
                  roles={roles}
                  onUpdateRole={handleUpdateRole}
                  onAddRole={handleAddRole}
                  onDeleteRole={handleDeleteRole}
                />
              )}

              {/* Home Section Config (PC 端 · 3.3.6.2) */}
              {activeMenu === 'home_config' && (
                <HomeConfig
                  sections={homeSections}
                  onUpdateSections={(updated) => setHomeSections(updated)}
                  onPreviewClient={() => setCurrentRole('client')}
                />
              )}

              {/* Dual Client Databases & Claim Workflow (PC 端 · 3.3.6.4 & 3.3.4.5) */}
              {(activeMenu === 'clients' ||
                activeMenu === 'claim_approval' ||
                activeMenu === 'integrated_clients') && (
                <ClientDatabase
                  currentRole={currentRole}
                  saibaoClients={saibaoClients}
                  integratedClients={integratedClients}
                  claims={claims}
                  onAddSaibaoClient={handleAddSaibaoClient}
                  onUpdateSaibaoClient={handleUpdateSaibaoClient}
                  onApplyClaim={handleApplyClaim}
                  onReviewClaim={handleReviewClaim}
                  onAddIntegratedAlias={handleAddIntegratedAlias}
                />
              )}

              {/* 3-Way Integration Hub (所综合平台与 LIMS 系统 · 3.3.5 & 3.3.7) */}
              {activeMenu === 'integration_hub' && (
                <IntegrationCenter orders={orders} />
              )}

              {/* Messages Center (3.3.3.5) */}
              {activeMenu === 'messages' && (
                <MessagesCenter
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllRead}
                  onMarkSingleRead={handleMarkSingleRead}
                  onNavigateToWorkbench={() => setActiveMenu('workbench')}
                />
              )}

              {/* User Profile (3.3.6.3) */}
              {activeMenu === 'profile' && (
                <UserProfile
                  user={currentUser}
                  orders={orders}
                  onNavigate={(menu) => setActiveMenu(menu)}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
