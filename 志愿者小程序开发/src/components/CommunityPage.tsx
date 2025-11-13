import { ChevronLeft, Search, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'following'>('discover');

  const posts = [
    {
      id: 1,
      author: {
        name: '李华',
        avatar: '李',
        role: '资深志愿者'
      },
      content: '今天参加了社区环保活动，和大家一起清理公园，虽然累但很有成就感！希望更多人能加入我们，一起保护环境 🌱',
      images: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'],
      likes: 24,
      comments: 8,
      time: '2小时前',
      liked: false
    },
    {
      id: 2,
      author: {
        name: '王小明',
        avatar: '王',
        role: '新人志愿者'
      },
      content: '第一次参加志愿活动，在图书馆帮忙整理书籍。遇到了很多热心的志愿者前辈，学到了很多！',
      images: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'
      ],
      likes: 18,
      comments: 5,
      time: '5小时前',
      liked: true
    },
    {
      id: 3,
      author: {
        name: '张敏',
        avatar: '张',
        role: '活动组织者'
      },
      content: '本周六的敬老院慰问活动报名已满！感谢大家的积极参与，我们会继续组织更多有意义的活动 ❤️',
      images: [],
      likes: 32,
      comments: 12,
      time: '8小时前',
      liked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3 border-b">
          <button onClick={() => onNavigate('home')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg flex-1">志愿者社区</h1>
          <button>
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'discover' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            发现
            {activeTab === 'discover' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'following' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            关注
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="divide-y">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                  {post.author.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{post.author.name}</span>
                    <span className="text-xs text-gray-500">{post.author.role}</span>
                  </div>
                  <div className="text-xs text-gray-400">{post.time}</div>
                </div>
              </div>
              <button>
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <p className="mb-3 leading-relaxed">{post.content}</p>

            {/* Images */}
            {post.images.length > 0 && (
              <div className={`mb-3 grid gap-2 ${
                post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}>
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className={`rounded-lg overflow-hidden ${
                      post.images.length === 1 ? 'aspect-video' : 'aspect-square'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2">
              <button
                className={`flex items-center gap-1 text-sm ${
                  post.liked ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500">
                <Share2 className="w-5 h-5" />
                <span>分享</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl">
        +
      </button>
    </div>
  );
}
