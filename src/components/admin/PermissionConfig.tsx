import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  Check,
  CheckSquare,
  Square,
  Lock,
  Sparkles,
  Info,
  Save,
  X,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { RolePermissionItem } from '../../types';
import { ALL_MENU_KEYS, ALL_ACTION_KEYS } from '../../mock/initialData';

interface PermissionConfigProps {
  roles: RolePermissionItem[];
  onUpdateRole: (updatedRole: RolePermissionItem) => void;
  onAddRole: (newRole: RolePermissionItem) => void;
  onDeleteRole: (roleId: string) => void;
}

export const PermissionConfig: React.FC<PermissionConfigProps> = ({
  roles,
  onUpdateRole,
  onAddRole,
  onDeleteRole,
}) => {
  const [editingRole, setEditingRole] = useState<RolePermissionItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    code: string;
    description: string;
    menuPermissions: string[];
    actionPermissions: string[];
    isPreset: boolean;
    userCount: number;
  }>({
    id: '',
    name: '',
    code: '',
    description: '',
    menuPermissions: [],
    actionPermissions: [],
    isPreset: false,
    userCount: 1,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = (role: RolePermissionItem) => {
    setIsCreating(false);
    setEditingRole(role);
    setFormData({
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description,
      menuPermissions: [...role.menuPermissions],
      actionPermissions: [...role.actionPermissions],
      isPreset: role.isPreset,
      userCount: role.userCount,
    });
  };

  const handleOpenCreate = () => {
    setIsCreating(true);
    const newId = `ROLE-0${roles.length + 1}`;
    const initialRole: RolePermissionItem = {
      id: newId,
      name: '',
      code: '',
      description: '',
      menuPermissions: ['workbench', 'orders', 'messages', 'profile'],
      actionPermissions: ['create_commission'],
      isPreset: false,
      userCount: 0,
      updatedAt: new Date().toISOString(),
    };
    setEditingRole(initialRole);
    setFormData({
      id: newId,
      name: '',
      code: '',
      description: '',
      menuPermissions: ['workbench', 'orders', 'messages', 'profile'],
      actionPermissions: ['create_commission'],
      isPreset: false,
      userCount: 0,
    });
  };

  const toggleMenu = (menuId: string) => {
    setFormData((prev) => {
      const exists = prev.menuPermissions.includes(menuId);
      return {
        ...prev,
        menuPermissions: exists
          ? prev.menuPermissions.filter((m) => m !== menuId)
          : [...prev.menuPermissions, menuId],
      };
    });
  };

  const toggleAction = (actionId: string) => {
    setFormData((prev) => {
      const exists = prev.actionPermissions.includes(actionId);
      return {
        ...prev,
        actionPermissions: exists
          ? prev.actionPermissions.filter((a) => a !== actionId)
          : [...prev.actionPermissions, actionId],
      };
    });
  };

  const handleSelectAllMenus = () => {
    if (formData.menuPermissions.length === ALL_MENU_KEYS.length) {
      setFormData((prev) => ({ ...prev, menuPermissions: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        menuPermissions: ALL_MENU_KEYS.map((m) => m.id),
      }));
    }
  };

  const handleSelectAllActions = () => {
    if (formData.actionPermissions.length === ALL_ACTION_KEYS.length) {
      setFormData((prev) => ({ ...prev, actionPermissions: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        actionPermissions: ALL_ACTION_KEYS.map((a) => a.id),
      }));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('请输入角色名称');
      return;
    }
    const finalRole: RolePermissionItem = {
      id: formData.id,
      name: formData.name,
      code: formData.code || `role_${Date.now()}`,
      description: formData.description,
      menuPermissions: formData.menuPermissions,
      actionPermissions: formData.actionPermissions,
      isPreset: formData.isPreset,
      userCount: formData.userCount,
      updatedAt: '刚刚 (即时生效)',
    };

    if (isCreating) {
      onAddRole(finalRole);
      showToast(`角色「${finalRole.name}」创建成功，权限配置已即时生效`);
    } else {
      onUpdateRole(finalRole);
      showToast(`角色「${finalRole.name}」配置已更新，即时生效（无需重新登录）`);
    }

    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                权限配置 (PC 端 · 3.3.6.1)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                管理系统角色及其权限矩阵。支持配置菜单权限与操作权限，前后端双控鉴权，修改后即时生效无需重新登录。
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>权限修改即时生效，可通过右上角角色切换器实时验证</span>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            新建角色
          </button>
        </div>
      </div>

      {/* Role List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">系统角色列表与权限分配</h2>
          <span className="text-xs text-slate-400">共 {roles.length} 个角色定义</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">角色名称</th>
                <th className="py-3 px-4">角色标识</th>
                <th className="py-3 px-4">系统属性</th>
                <th className="py-3 px-4">绑定用户数</th>
                <th className="py-3 px-6">已授权菜单 ({ALL_MENU_KEYS.length})</th>
                <th className="py-3 px-6">已授权操作 ({ALL_ACTION_KEYS.length})</th>
                <th className="py-3 px-4">最后更新</th>
                <th className="py-3 px-6 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {roles.map((role) => {
                return (
                  <tr key={role.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                        <span>{role.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5 truncate max-w-xs">
                        {role.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px]">
                        {role.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {role.isPreset ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Lock className="w-3 h-3" />
                          系统预置
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          自定义
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {role.userCount} 人
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${(role.menuPermissions.length / ALL_MENU_KEYS.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-600">
                          {role.menuPermissions.length}/{ALL_MENU_KEYS.length}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{
                              width: `${(role.actionPermissions.length / ALL_ACTION_KEYS.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-600">
                          {role.actionPermissions.length}/{ALL_ACTION_KEYS.length}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {role.updatedAt}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(role)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          配置权限
                        </button>
                        {!role.isPreset && (
                          <button
                            onClick={() => {
                              if (confirm(`确认删除角色「${role.name}」吗？`)) {
                                onDeleteRole(role.id);
                                showToast(`角色「${role.name}」已删除`);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="删除自定义角色"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Architecture Documentation Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-200 p-5 rounded-xl border border-slate-700/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-semibold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>规范要求：前后端双控鉴权机制说明</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">
            ① <strong>前端控制</strong>：基于角色权限字典，利用组件显隐/禁用样式动态渲染左侧菜单栏及按钮。<br />
            ② <strong>后端鉴权</strong>：每个微服务接口（Spring/Node）均声明所需权限点做接口拦截与数据隔离。修改保存后即时生效，无需重登。
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded">
            RBAC + API Token 同步生效
          </span>
        </div>
      </div>

      {/* Role Permission Edit Modal (Matching Screenshot 图 61) */}
      {editingRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isCreating ? '新建角色' : `角色·权限编辑 (${editingRole.name})`}
                </h3>
              </div>
              <button
                onClick={() => setEditingRole(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    角色名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入角色名称 (如: 华北大区主管)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    角色标识 (Code)
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    disabled={formData.isPreset}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="如: regional_manager_north"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    角色职能描述
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="简要描述角色的业务职责与数据查看范围"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Section 1: 菜单权限 (Menu Permissions) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>(1) 菜单权限</span>
                      <span className="text-slate-400 font-normal">
                        - 控制角色可见的导航菜单 (前端按角色显示/隐藏)
                      </span>
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllMenus}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {formData.menuPermissions.length === ALL_MENU_KEYS.length ? '取消全选' : '全部勾选'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {ALL_MENU_KEYS.map((menu) => {
                    const isChecked = formData.menuPermissions.includes(menu.id);
                    return (
                      <label
                        key={menu.id}
                        onClick={() => toggleMenu(menu.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition ${
                          isChecked
                            ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{menu.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: 操作权限 (Action Permissions) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>(2) 操作权限</span>
                      <span className="text-slate-400 font-normal">
                        - 控制角色可执行的业务操作 (按钮级控制与API鉴权)
                      </span>
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllActions}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {formData.actionPermissions.length === ALL_ACTION_KEYS.length ? '取消全选' : '全部勾选'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {ALL_ACTION_KEYS.map((act) => {
                    const isChecked = formData.actionPermissions.includes(act.id);
                    return (
                      <label
                        key={act.id}
                        onClick={() => toggleAction(act.id)}
                        className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer select-none transition ${
                          isChecked
                            ? 'bg-purple-50/80 border-purple-300 text-purple-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border shrink-0 ${
                          isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{act.name}</div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{act.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-2xl">
              <span className="text-[11px] text-slate-500">
                保存后修改将通过事件广播立即生效，无需用户重新登录。
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition text-xs"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition active:scale-95 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  保存并即时生效
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
