import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, FileText, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { SystemNotification } from '../../types';

interface MessagesCenterProps {
  notifications: SystemNotification[];
  onMarkAllRead: () => void;
  onMarkSingleRead: (id: string) => void;
  onNavigateToWorkbench: () => void;
}

export const MessagesCenter: React.FC<MessagesCenterProps> = ({
  notifications,
  onMarkAllRead,
  onMarkSingleRead,
  onNavigateToWorkbench,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayList =
    activeTab === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                消息中心 (PC 端 · 3.3.3.5)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                与手机端共用消息中心接口，展示客服消息与系统通知。铃铛红点、左侧菜单红点、消息页未读数三处计数保持一致，已读双端同步。
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              全部标记为已读
            </button>
          )}
        </div>
      </div>

      {/* Message Filter Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部消息 ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              未读提醒 ({unreadCount})
            </button>
          </div>
        </div>

        {/* Message Items */}
        <div className="divide-y divide-slate-100 text-xs">
          {displayList.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkSingleRead(notif.id)}
              className={`p-5 flex items-start gap-4 transition hover:bg-slate-50 cursor-pointer ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'order'
                    ? 'bg-blue-100 text-blue-700'
                    : notif.type === 'claim'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {notif.type === 'order' ? (
                  <FileText className="w-4 h-4" />
                ) : notif.type === 'claim' ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{notif.title}</span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{notif.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{notif.content}</p>
              </div>
            </div>
          ))}

          {displayList.length === 0 && (
            <div className="text-center py-12 text-slate-400">暂无相关消息</div>
          )}
        </div>
      </div>
    </div>
  );
};
