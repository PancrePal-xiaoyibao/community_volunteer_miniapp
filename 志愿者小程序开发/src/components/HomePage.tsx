import { Search, MoreHorizontal, Minus, Target, Flag, Users as UsersIcon, Gift, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    { id: 1, title: '欢迎回家' },
    { id: 2, title: '志愿者活动' },
    { id: 3, title: '社区服务' }
  ];

  const activities = [
    {
      id: 1,
      title: '蓝马甲x复旦肿瘤医院患教服务',
      location: '社群在线',
      time: '2025-11-20 09:00',
      participants: 25,
      points: 10
    },
    {
      id: 2,
      title: '安宁疗护心理工作坊',
      location: '线上会议',
      time: '2025-11-22 14:00',
      participants: 15,
      points: 15
    },
    {
      id: 3,
      title: '小雪宝志愿服务',
      location: '社区开发项目',
      time: '2025-11-25 10:00',
      participants: 20,
      points: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg">小X宝社区志愿者平台</h1>
        <div className="flex items-center gap-3">
          <MoreHorizontal className="w-5 h-5" />
          <Minus className="w-5 h-5" />
          <Target className="w-5 h-5" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-blue-500 px-4 py-4">
        <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索志愿者/项目/活动"
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="bg-blue-500 px-4 pb-4">
        <div className="relative rounded-xl overflow-hidden">
          <div className="aspect-[16/9] bg-gray-200">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a"
              alt="志愿者活动"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Carousel Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 pt-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-400 rounded-xl p-4 text-white">
            <div className="flex flex-col items-center justify-center text-center">
              <Flag className="w-12 h-12 opacity-90 mb-2" />
              <div className="text-sm opacity-90">活动招募</div>
              <div className="text-3xl mt-1">16</div>
            </div>
          </div>
          <div className="bg-blue-500 rounded-xl p-4 text-white">
            <div className="flex flex-col items-center justify-center text-center">
              <UsersIcon className="w-12 h-12 opacity-90 mb-2" />
              <div className="text-sm opacity-90">家园人数</div>
              <div className="text-3xl mt-1">278</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Icons */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4">
          <div className="grid grid-cols-5 gap-4">
            <button onClick={() => onNavigate('points')} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Gift className="w-7 h-7" />
              </div>
              <span className="text-xs text-center">积分贡献</span>
            </button>
            <button onClick={() => onNavigate('community')} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <UsersIcon className="w-7 h-7" />
              </div>
              <span className="text-xs text-center">伙伴你好！</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <span className="text-lg">40</span>
              </div>
              <span className="text-xs text-center">“两岁“纪念</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Gift className="w-7 h-7" />
              </div>
              <span className="text-xs text-center">培训宝库</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <MessageCircle className="w-7 h-7" />
              </div>
              <span className="text-xs text-center">感谢墙</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collaboration Notice */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-gray-100 rounded">合作</div>
            <div className="flex-1">
              <div className="text-sm">微光成炬，Siliconflow加入社区</div>
              <div className="text-xs text-gray-500 mt-1">8天前</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
        <button
          onClick={() => onNavigate('community')}
          className="w-14 h-14 bg-blue-500 rounded-full shadow-lg flex flex-col items-center justify-center text-white hover:bg-blue-600 transition-colors"
        >
          <span className="text-xl">荐</span>
        </button>
        <button
          className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg flex flex-col items-center justify-center text-white hover:from-purple-600 hover:to-purple-700 transition-colors"
        >
          <span className="text-xs">AI</span>
          <span className="text-xs">助手</span>
        </button>
      </div>

      {/* Latest Activities */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-blue-500">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-1 h-4 bg-blue-600" />
              <span>最新资讯</span>
            </div>
          </div>
          
          <div className="divide-y">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="flex-1">{activity.title}</h3>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    {activity.points}积分
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{activity.location}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <span className="text-xs text-gray-500">{activity.participants}人已报名</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}