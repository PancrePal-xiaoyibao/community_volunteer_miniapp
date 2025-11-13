import {
  ChevronRight,
  MoreHorizontal,
  Minus,
  Target,
  QrCode,
  CreditCard,
  Image as ImageIcon,
  Star,
  HandHeart,
  ThumbsUp,
  HelpCircle,
  UserPlus,
  Phone,
  Shield,
  FileText,
  Bell,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import projectLogo from "figma:asset/8adc9dda725be56736a75ca81db49fc45ffa3b38.png";
import communityLogo from "figma:asset/ef7272ddce0b5e0fc7e81fe09ca4be46c507a9ce.png";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg">我的</h1>
        <div className="flex items-center gap-3">
          <MoreHorizontal className="w-5 h-5" />
          <Minus className="w-5 h-5" />
          <Target className="w-5 h-5" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 pt-4 mb-4">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Card Background */}
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758599668429-121d54188b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwZ3JvdXAlMjBzbWlsaW5nfGVufDF8fHx8MTc2MzAwNzMwNXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="志愿者合影"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-600/80" />

            {/* Card Content */}
            <div className="absolute inset-0 p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={communityLogo}
                      alt="小X宝社区"
                      className="w-10 h-10 bg-white rounded-lg p-1"
                    />
                    <img
                      src={projectLogo}
                      alt="小胰宝项目"
                      className="w-10 h-10 bg-white rounded-lg p-1"
                    />
                  </div>
                  <div className="text-sm opacity-90 mb-1">
                    小X宝肿瘤/罕见病AI公益社区
                  </div>
                  <div className="text-2xl">Alumni</div>
                </div>
                <button
                  onClick={() => onNavigate("editProfile")}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs"
                >
                  个人主页
                </button>
              </div>

              <div className="mt-auto">
                <div className="text-sm opacity-90 mb-1">
                  小胰宝 · 编号 0018
                </div>
                <div className="text-xs opacity-75">
                  ID:0018
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white grid grid-cols-4 divide-x border-t">
            <button
              onClick={() => onNavigate("points")}
              className="py-3 text-center"
            >
              <div className="text-xl">42</div>
              <div className="text-xs text-gray-500 mt-1">
                可用积分
              </div>
            </button>
            <button className="py-3 text-center">
              <div className="text-xl">10</div>
              <div className="text-xs text-gray-500 mt-1">
                好友
              </div>
            </button>
            <button className="py-3 text-center relative">
              <div className="text-xl">81</div>
              <div className="text-xs text-gray-500 mt-1">
                荣誉分
              </div>
              <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="py-3 text-center relative">
              <div className="text-xl text-red-500">15</div>
              <div className="text-xs text-gray-500 mt-1">
                消息
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Section 1 */}
      <div className="mb-4">
        <div className="bg-white">
          <MenuItem
            icon={QrCode}
            text="签到码"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Menu Section 2 */}
      <div className="mb-4">
        <div className="bg-white">
          <MenuItem
            icon={ImageIcon}
            text="我的名片"
            onClick={() => {}}
          />
          <MenuItem
            icon={Star}
            text="我的活动/权益"
            onClick={() => onNavigate("activity")}
          />
          <MenuItem
            icon={HandHeart}
            text="我的互助"
            onClick={() => {}}
          />
          <MenuItem
            icon={ThumbsUp}
            text="我的推荐"
            onClick={() => {}}
          />
          <MenuItem
            icon={HelpCircle}
            text="我的助理"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Menu Section 3 */}
      <div className="mb-4">
        <div className="bg-white">
          <MenuItem
            icon={UserPlus}
            text="邀请好友"
            onClick={() => {}}
          />
          <MenuItem
            icon={Phone}
            text="联系我们"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Menu Section 4 */}
      <div className="mb-4">
        <div className="bg-white">
          <MenuItem
            icon={Shield}
            text="隐私设置"
            onClick={() => {}}
          />
          <MenuItem
            icon={FileText}
            text="用户隐私条款"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: any;
  text: string;
  onClick: () => void;
  badge?: number;
}

function MenuItem({
  icon: Icon,
  text,
  onClick,
  badge,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <span>{text}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
}