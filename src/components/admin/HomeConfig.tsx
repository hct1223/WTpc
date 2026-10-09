import React, { useState } from 'react';
import {
  LayoutGrid,
  Eye,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Monitor,
  Flame,
  Zap,
  Tag,
  Save,
  RotateCcw,
  Sliders,
  Calendar,
  Layers,
  Thermometer,
  ShieldCheck,
  Cpu,
  FlaskConical,
  PlusCircle,
} from 'lucide-react';
import { HomeSectionConfig } from '../../types';

interface HomeConfigProps {
  sections: HomeSectionConfig[];
  onUpdateSections: (sections: HomeSectionConfig[]) => void;
  onPreviewClient: () => void;
}

export const HomeConfig: React.FC<HomeConfigProps> = ({
  sections,
  onUpdateSections,
  onPreviewClient,
}) => {
  const [localSections, setLocalSections] = useState<HomeSectionConfig[]>(
    JSON.parse(JSON.stringify(sections))
  );
  const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Toggle enable
  const handleToggleEnable = (id: string) => {
    setLocalSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Move up/down
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localSections.length) return;

    const updated = [...localSections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign order
    const normalized = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setLocalSections(normalized);
  };

  // Update banner fields
  const handleBannerChange = (field: string, value: string) => {
    setLocalSections((prev) =>
      prev.map((s) =>
        s.code === 'banner'
          ? {
              ...s,
              config: {
                ...s.config,
                [field]: value,
              },
            }
          : s
      )
    );
  };

  // Update recommendation item
  const handleRecItemChange = (recId: string, field: string, value: string) => {
    setLocalSections((prev) =>
      prev.map((s) => {
        if (s.code !== 'recommendations' || !s.config.items) return s;
        return {
          ...s,
          config: {
            ...s.config,
            items: s.config.items.map((item) =>
              item.id === recId ? { ...item, [field]: value } : item
            ),
          },
        };
      })
    );
  };

  // Preset scenarios
  const applyPresetScenario = (mode: 'promo' | 'activity' | 'default') => {
    let updated = [...localSections];
    if (mode === 'promo') {
      // Prioritize Banner, ensure enabled
      updated = updated.map((s) => {
        if (s.code === 'banner') {
          return {
            ...s,
            enabled: true,
            order: 1,
            config: {
              ...s.config,
              bannerBadge: '★ 2026长期合作特惠推广季',
              bannerTitle: '长协客户快速下单 (绿色特快通道)',
              bannerSubtitle: '签约企业享专项折扣与72小时极速出具初检报告特权',
            },
          };
        }
        if (s.code === 'categories') return { ...s, order: 2 };
        if (s.code === 'recommendations') return { ...s, order: 3 };
        return s;
      });
      showToast('已切换至「推广期模式」：置顶长协Banner并强化专属折扣标识');
    } else if (mode === 'activity') {
      // Prioritize Recommendations, place banner second
      const rec = updated.find((s) => s.code === 'recommendations');
      const cat = updated.find((s) => s.code === 'categories');
      const ban = updated.find((s) => s.code === 'banner');
      if (rec && cat && ban) {
        rec.order = 1;
        cat.order = 2;
        ban.order = 3;
        updated = [rec, cat, ban];
      }
      showToast('已切换至「活动期模式」：置顶热门推荐4列卡片网格');
    } else {
      // Default
      const ban = updated.find((s) => s.code === 'banner');
      const cat = updated.find((s) => s.code === 'categories');
      const rec = updated.find((s) => s.code === 'recommendations');
      if (ban && cat && rec) {
        ban.order = 1;
        cat.order = 2;
        rec.order = 3;
        updated = [ban, cat, rec];
      }
      showToast('已恢复为「标准模式」');
    }
    setLocalSections(updated);
  };

  // Save changes
  const handleSaveAll = () => {
    onUpdateSections(localSections);
    showToast('首页业务配置已保存！客户端（PC 端 + 小程序端）已即时生效同步');
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Thermometer':
        return <Thermometer className="w-5 h-5 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-500" />;
      default:
        return <PlusCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                首页业务配置 (宣传页配置 · 3.3.6.2)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                用于配置客户端首页展示的板块内容（长协快速下单 Banner、分类浏览 3×2、热门推荐 4 列网格）。支持启用/禁用、拖拽排序与实时双端生效。
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onPreviewClient}
            className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            进入客户 PC 端预览
          </button>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            发布并即时更新
          </button>
        </div>
      </div>

      {/* Scenario Presets Bar */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>业务场景一键配置策略：</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => applyPresetScenario('promo')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-amber-400 hover:text-amber-700 font-medium transition"
          >
            🔥 推广期 (置顶长协Banner)
          </button>
          <button
            onClick={() => applyPresetScenario('activity')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-blue-400 hover:text-blue-700 font-medium transition"
          >
            ⚡ 活动期 (置顶热门推荐4列卡片)
          </button>
          <button
            onClick={() => applyPresetScenario('default')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
          >
            标准常态化配置
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Controls, Right Real-Time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Section Configuration Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>首页展示板块排序与内容控制 (自上而下展示)</span>
            <span className="text-[11px] text-slate-400 font-normal">
              使用上下箭头调整顺序
            </span>
          </div>

          {localSections
            .sort((a, b) => a.order - b.order)
            .map((section, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === localSections.length - 1;

              return (
                <div
                  key={section.id}
                  className={`bg-white rounded-xl border transition shadow-xs ${
                    section.enabled
                      ? 'border-slate-200'
                      : 'border-dashed border-slate-300 opacity-60 bg-slate-50/50'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={isFirst}
                          onClick={() => handleMoveOrder(idx, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="上移"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isLast}
                          onClick={() => handleMoveOrder(idx, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="下移"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {section.name}
                          </h3>
                          {section.enabled ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              展示中
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                              已隐藏禁用
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    {/* Enable Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={() => handleToggleEnable(section.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Section Specific Details (When Enabled) */}
                  {section.enabled && (
                    <div className="p-4 bg-slate-50/50 space-y-3 text-xs">
                      {/* Banner Config */}
                      {section.code === 'banner' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              Banner 标题
                            </label>
                            <input
                              type="text"
                              value={section.config.bannerTitle || ''}
                              onChange={(e) => handleBannerChange('bannerTitle', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              活动副标题 / 描述
                            </label>
                            <input
                              type="text"
                              value={section.config.bannerSubtitle || ''}
                              onChange={(e) =>
                                handleBannerChange('bannerSubtitle', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              推广标签角标
                            </label>
                            <input
                              type="text"
                              value={section.config.bannerBadge || ''}
                              onChange={(e) => handleBannerChange('bannerBadge', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              按钮引导文案
                            </label>
                            <input
                              type="text"
                              value={section.config.bannerButtonText || ''}
                              onChange={(e) =>
                                handleBannerChange('bannerButtonText', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Categories 3x2 Grid Config */}
                      {section.code === 'categories' && (
                        <div>
                          <div className="text-[11px] text-slate-500 mb-2 font-medium">
                            分类宫格项目配置 (3×2 宫格，共 6 项)：
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {section.config.items?.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2"
                              >
                                {getCategoryIcon(item.icon)}
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-800 truncate">
                                    {item.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {item.standard}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations 4-Col Grid Config */}
                      {section.code === 'recommendations' && (
                        <div>
                          <div className="text-[11px] text-slate-500 mb-2 font-medium">
                            热门推荐卡片编辑 (4 列卡片网格)：
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {section.config.items?.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) =>
                                      handleRecItemChange(item.id, 'title', e.target.value)
                                    }
                                    className="font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs w-28"
                                  />
                                  <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.2 rounded font-medium">
                                    {item.tag}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <input
                                    type="text"
                                    value={item.standard || ''}
                                    onChange={(e) =>
                                      handleRecItemChange(item.id, 'standard', e.target.value)
                                    }
                                    placeholder="测试标准号"
                                    className="text-slate-500 text-[10px] border-b border-transparent hover:border-slate-300 focus:outline-none w-24"
                                  />
                                  <input
                                    type="text"
                                    value={item.price || ''}
                                    onChange={(e) =>
                                      handleRecItemChange(item.id, 'price', e.target.value)
                                    }
                                    placeholder="价格"
                                    className="text-amber-600 font-bold text-[10px] text-right border-b border-transparent hover:border-slate-300 focus:outline-none w-20"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Right: Live Dual-End Preview Pane (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-3">
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold">客户端实时预览 (即时生效)</span>
              </div>
              {/* PC / Mobile Toggle */}
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setPreviewMode('pc')}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                    previewMode === 'pc' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  PC端
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                    previewMode === 'mobile'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  小程序
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="mt-3 bg-slate-100 rounded-xl p-3 text-slate-800 max-h-[550px] overflow-y-auto space-y-3 border border-slate-200">
              {/* Mock Header in Preview */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-blue-600 rounded text-[9px] text-white flex items-center justify-center">
                    赛
                  </div>
                  <span>云上赛宝 · 客户侧首页</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {previewMode === 'pc' ? '1280px 宽屏排版' : '375px 小程序竖屏'}
                </div>
              </div>

              {/* Dynamic Render according to current localSections order & enabled */}
              {localSections
                .filter((s) => s.enabled)
                .sort((a, b) => a.order - b.order)
                .map((sec) => {
                  if (sec.code === 'banner') {
                    return (
                      <div
                        key={sec.id}
                        className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xs relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            {sec.config.bannerBadge && (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-medium tracking-wide mb-1">
                                {sec.config.bannerBadge}
                              </span>
                            )}
                            <h4 className="text-xs font-bold leading-tight">
                              {sec.config.bannerTitle || '长协客户快速下单'}
                            </h4>
                            <p className="text-[10px] text-amber-100 mt-0.5 line-clamp-1">
                              {sec.config.bannerSubtitle}
                            </p>
                          </div>
                          <button className="shrink-0 ml-2 px-2.5 py-1 bg-white text-orange-600 font-bold text-[10px] rounded-md shadow-xs">
                            {sec.config.bannerButtonText || '立即下单'}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (sec.code === 'categories') {
                    return (
                      <div key={sec.id} className="bg-white p-3 rounded-xl border border-slate-200">
                        <div className="text-[11px] font-bold text-slate-800 mb-2 flex items-center gap-1">
                          <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                          <span>分类浏览 (3×2 宫格)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {sec.config.items?.map((cat) => (
                            <div
                              key={cat.id}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center hover:bg-blue-50 transition"
                            >
                              <div className="flex justify-center mb-1">
                                {getCategoryIcon(cat.icon)}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-800 truncate">
                                {cat.title}
                              </div>
                              <div className="text-[9px] text-slate-400 truncate">
                                {cat.standard}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sec.code === 'recommendations') {
                    return (
                      <div key={sec.id} className="bg-white p-3 rounded-xl border border-slate-200">
                        <div className="text-[11px] font-bold text-slate-800 mb-2 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-red-500" />
                          <span>热门推荐 (4 列卡片网格)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {sec.config.items?.map((rec) => (
                            <div
                              key={rec.id}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-300 transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-900 truncate">
                                  {rec.title}
                                </span>
                                <span className="text-[8px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-bold">
                                  {rec.tag}
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-400 truncate mt-0.5">
                                {rec.standard}
                              </div>
                              <div className="text-[10px] font-bold text-amber-600 mt-1">
                                {rec.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

              {localSections.filter((s) => s.enabled).length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  当前所有首页板块均已禁用，客户端将展示空白提示
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-3 text-center">
              按终端类型返回不同布局参数，首页板块内容由后台统一管理、双端生效。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
