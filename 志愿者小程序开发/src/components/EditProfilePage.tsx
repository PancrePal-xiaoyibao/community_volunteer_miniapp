import { ChevronLeft, MoreHorizontal, Minus, Target, Edit } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface EditProfilePageProps {
  onNavigate: (page: string) => void;
}

export function EditProfilePage({ onNavigate }: EditProfilePageProps) {
  const [profile, setProfile] = useState({
    name: '秦晓强',
    username: '晨曦~淼MBA2020Bexctlive',
    intro: '',
    gender: '男',
    interests: '读书 跑步',
    email: 'qinxiaoqiang@gmail.com',
    city: '中国 / 青市 / 上海市',
    occupation: '职业信息'
  });

  const friends = [
    {
      id: 1,
      name: '朱光红',
      tag: '专业硕士星耀MBA1994兴盛旺班',
      impression: '充美，大气，说留鹅到，有清有义，见难耐，真正想当、真正起来，真正起床，人缘好，诚信平静'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('profile')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg">名片</h1>
        </div>
        <div className="flex items-center gap-3">
          <MoreHorizontal className="w-5 h-5" />
          <Minus className="w-5 h-5" />
          <Target className="w-5 h-5" />
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
          alt="个人封面"
          className="w-full h-64 object-cover"
        />
        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-xl mb-1">{profile.name}</h2>
            <div className="text-sm text-gray-500">{profile.username}</div>
          </div>
          <button className="px-4 py-1 border border-gray-300 rounded text-sm flex items-center gap-1">
            <Edit className="w-4 h-4" />
            编辑
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded">志愿者</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">工上海市</span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white mt-4">
        <FormSection title="个人简介">
          <input
            type="text"
            value={profile.intro}
            placeholder="添加个人简介"
            className="w-full px-4 py-3 border-b outline-none"
            onChange={(e) => setProfile({ ...profile, intro: e.target.value })}
          />
        </FormSection>

        <FormSection title="性别">
          <div className="px-4 py-3 border-b">{profile.gender}</div>
        </FormSection>

        <FormSection title="兴趣爱好">
          <div className="px-4 py-3 border-b">{profile.interests}</div>
        </FormSection>

        <FormSection title="邮箱">
          <div className="px-4 py-3 border-b">{profile.email}</div>
        </FormSection>

        <FormSection title="常住城市">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <span>{profile.city}</span>
            <span className="text-blue-500 text-sm">职业信息</span>
          </div>
        </FormSection>
      </div>

      {/* Career Info */}
      <div className="bg-white mt-4 px-4 py-4">
        <div className="text-center text-gray-500 text-sm py-8 border border-dashed rounded-lg">
          添加职业信息，获取你的资源
          <div className="mt-2">
            <button className="px-4 py-2 border rounded text-sm">马上填写</button>
          </div>
        </div>
      </div>

      {/* Friends Impression */}
      <div className="bg-white mt-4 mb-6">
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <h3>朋友印象(1)</h3>
          <button className="text-blue-500 text-sm">管理</button>
        </div>
        
        {friends.map((friend) => (
          <div key={friend.id} className="px-4 py-4 border-b last:border-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white">
                朱
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span>{friend.name}</span>
                  <span className="text-xs text-gray-500">{friend.tag}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{friend.impression}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

function FormSection({ title, children }: FormSectionProps) {
  return (
    <div>
      <div className="px-4 py-2 bg-gray-50">
        <span className="text-xs text-gray-600">{title}</span>
      </div>
      {children}
    </div>
  );
}
