import { ChevronLeft, Calendar, MapPin, Users, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface ActivityPageProps {
  onNavigate: (page: string) => void;
}

type TabType = 'ongoing' | 'completed' | 'registered';

export function ActivityPage({ onNavigate }: ActivityPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ongoing');

  const activities = {
    ongoing: [
      {
        id: 1,
        title: '社区环保活动',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
        location: '市中心公园',
        time: '2025-11-20 09:00',
        participants: 25,
        maxParticipants: 30,
        points: 10,
        status: '进行中'
      },
      {
        id: 2,
        title: '图书馆志愿服务',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
        location: '市图书馆',
        time: '2025-11-25 10:00',
        participants: 20,
        maxParticipants: 25,
        points: 8,
        status: '进行中'
      }
    ],
    completed: [
      {
        id: 3,
        title: '敬老院慰问活动',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a',
        location: '阳光敬老院',
        time: '2025-11-10 14:00',
        participants: 15,
        maxParticipants: 15,
        points: 15,
        status: '已完成',
        earnedPoints: 15
      }
    ],
    registered: [
      {
        id: 4,
        title: '青少年教育支持',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
        location: '希望小学',
        time: '2025-12-01 09:00',
        participants: 18,
        maxParticipants: 20,
        points: 12,
        status: '已报名'
      }
    ]
  };

  const currentActivities = activities[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg">我的活动</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-14 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'ongoing' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            进行中
            {activeTab === 'ongoing' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'completed' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            已完成
            {activeTab === 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'registered' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            已报名
            {activeTab === 'registered' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-4 space-y-4">
        {currentActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Activity Image */}
            <div className="relative h-48">
              <ImageWithFallback
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {activity.status}
              </div>
            </div>

            {/* Activity Info */}
            <div className="p-4">
              <h3 className="text-lg mb-3">{activity.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{activity.participants}/{activity.maxParticipants} 人</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1 text-orange-600">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">
                    {activity.earnedPoints ? `已获得 ${activity.earnedPoints}` : activity.points} 积分
                  </span>
                </div>
                
                {activeTab === 'ongoing' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    签到
                  </button>
                )}
                {activeTab === 'completed' && (
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    查看证书
                  </button>
                )}
                {activeTab === 'registered' && (
                  <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm">
                    取消报名
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {currentActivities.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>暂无活动</p>
          </div>
        )}
      </div>
    </div>
  );
}
