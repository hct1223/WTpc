export type RoleKey = 'admin' | 'regional_manager' | 'sales_manager' | 'customer_service' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  employeeNo: string;
  unit: string;
  department: string;
  region: '华南区' | '华东区' | '华北区' | '西南区';
  role: RoleKey;
  roleName: string;
  avatar: string;
  phone: string;
}

export interface RolePermissionItem {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  isPreset: boolean;
  menuPermissions: string[];
  actionPermissions: string[];
  updatedAt: string;
}

export interface HomeSectionConfig {
  id: string;
  code: 'banner' | 'categories' | 'recommendations';
  name: string;
  enabled: boolean;
  order: number;
  description: string;
  config: {
    bannerTitle?: string;
    bannerSubtitle?: string;
    bannerButtonText?: string;
    bannerBadge?: string;
    bannerBgGradient?: string;
    promoEndDate?: string;
    items?: Array<{
      id: string;
      title: string;
      standard?: string;
      price?: string;
      icon?: string;
      tag?: string;
      enabled: boolean;
    }>;
  };
}

export interface SaibaoClientRecord {
  id: string;
  clientNo: string;
  name: string;
  aliases: string[]; // max 5 aliases
  contactPerson: string;
  contactPhone: string;
  region: '华南区' | '华东区' | '华北区' | '西南区';
  salesManagerId: string;
  salesManagerName: string;
  salesManagerPhone: string;
  status: 'formal' | 'pending_audit'; // formal = 已正式入库, pending_audit = 自动建档待审核
  createdAt: string;
  changeHistory?: Array<{
    date: string;
    prevManager: string;
    newManager: string;
    notifyMonthNotice: boolean;
    operator: string;
  }>;
}

export interface IntegratedPlatformClientRecord {
  id: string;
  standardName: string;
  aliases: string[];
  creditCode: string;
  isCompliant: boolean;
  verifiedBy: string;
  updatedAt: string;
}

export interface ClientClaimApplication {
  id: string;
  claimNo: string;
  clientId: string;
  clientName: string;
  clientAliases: string[];
  salesId: string;
  salesName: string;
  salesRegion: string;
  salesPhone: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewerName?: string;
}

export interface CommissionOrder {
  id: string;
  orderNo: string;
  clientName: string;
  clientNo: string;
  clientAliases: string[];
  contactName: string;
  contactPhone: string;
  projectName: string;
  sampleName: string;
  sampleModel: string;
  sampleQuantity: number;
  sampleUnit: string;
  price: number;
  type: 'commission' | 'modification' | 'consultation' | 'draft';
  status:
    | '1.待销售确认'
    | '2.销售已核对'
    | '3.待客服审核'
    | '4.已自动取号'
    | '5.样品已签收'
    | '6.检测中'
    | '7.技术组复审'
    | '8.已出报告'
    | '9.已商务闭环'
    | '打回修改';
  statusCode: number;
  flowNo?: string; // e.g. FX0426-23267
  assignedTo: string;
  salesRegion: string;
  isRegionalManagerTask?: boolean;
  submittedAt: string;
  updatedAt: string;
  expressStatus?: {
    trackingNo: string;
    sender: string;
    receiver: string;
    status: string;
  };
  reports?: Array<{
    id: string;
    fileName: string;
    code: string;
    size: string;
    date: string;
  }>;
  financial?: {
    isBilled: boolean;
    isPaid: boolean;
    contractStatus: '已签订' | '待回传' | '审核中';
  };
  versionHistory?: Array<{
    version: string;
    date: string;
    author: string;
    diff: string;
  }>;
  splitTasks?: {
    testingCenter?: { pushed: boolean; date?: string; cnas: boolean; cma: boolean; quote: number };
    dataCenter?: { pushed: boolean; date?: string; cnas: boolean; cma: boolean; quote: number };
    analysisCenter?: { pushed: boolean; date?: string; cnas: boolean; cma: boolean; quote: number };
  };
}

export interface SystemNotification {
  id: string;
  title: string;
  content: string;
  type: 'order' | 'claim' | 'system' | 'message';
  date: string;
  read: boolean;
}
