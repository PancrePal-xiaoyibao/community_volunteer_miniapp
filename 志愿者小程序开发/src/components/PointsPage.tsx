import { ChevronLeft, Award, Gift, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PointsPageProps {
  onNavigate: (page: string) => void;
}

type TabType = 'records' | 'rewards';

export function PointsPage({ onNavigate }: PointsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('records');

  const pointsRecords = [
    {
      id: 1,
      activity: '敬老院慰问活动',
      points: 15,
      date: '2025-11-10',
      type: 'earned'
    },
    {
      id: 2,
      activity: '社区环保活动',
      points: 10,
      date: '2025-11-05',
      type: 'earned'
    },
    {
      id: 3,
      activity: '兑换志愿者T恤',
      points: -20,
      date: '2025-11-01',
      type: 'spent'
    },
    {
      id: 4,
      activity: '图书馆志愿服务',
      points: 8,
      date: '2025-10-28',
      type: 'earned'
    }
  ];

  const rewards = [
    {
      id: 1,
      name: '志愿者T恤',
      points: 20,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
    },
    {
      id: 2,
      name: '环保水杯',
      points: 30,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8'
    },
    {
      id: 3,
      name: '志愿者徽章',
      points: 15,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401'
    },
    {
      id: 4,
      name: '活动优先权',
      points: 50,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => onNavigate('home')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg">积分中心</h1>
        </div>

        {/* Points Summary */}
        <div className="px-4 pb-8 pt-4">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">我的积分</div>
            <div className="text-5xl mb-6">42</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl mb-1">67</div>
                <div className="text-xs opacity-90">累计获得</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl mb-1">25</div>
                <div className="text-xs opacity-90">已使用</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl mb-1">12</div>
                <div className="text-xs opacity-90">本月获得</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'records' ? 'text-orange-600' : 'text-gray-600'
            }`}
          >
            积分记录
            {activeTab === 'records' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'rewards' ? 'text-orange-600' : 'text-gray-600'
            }`}
          >
            积分兑换
            {activeTab === 'rewards' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'records' ? (
        <div className="p-4">
          {pointsRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg p-4 mb-3 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  record.type === 'earned' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  {record.type === 'earned' ? (
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Gift className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <div className="mb-1">{record.activity}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {record.date}
                  </div>
                </div>
              </div>
              <div className={`text-lg ${
                record.type === 'earned' ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {record.points > 0 ? '+' : ''}{record.points}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm mb-2">{reward.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-orange-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">{reward.points}</span>
                    </div>
                    <span className="text-xs text-gray-500">库存: {reward.stock}</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg text-sm">
                    立即兑换
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
