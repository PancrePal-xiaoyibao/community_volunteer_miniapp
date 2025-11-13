-- 种子数据，用于测试环境
BEGIN;

-- 插入测试志愿者数据
INSERT INTO volunteers (auth_user_id, nickname, phone, location, volunteer_since, industry_tags, skills) VALUES
('11111111-1111-1111-1111-111111111111', '测试志愿者1', '13800138001', '北京', 2023, '["医疗机构-医生", "AI公益组织"]', '["义诊", "无障碍测试"]'),
('22222222-2222-2222-2222-222222222222', '测试志愿者2', '13800138002', '上海', 2022, '["教育机构-教师"]', '["教学辅导", "心理支持"]'),
('33333333-3333-3333-3333-333333333333', '测试志愿者3', '13800138003', '广州', 2024, '["环保组织"]', '["环保宣传", "垃圾分类"]');

-- 插入测试活动数据
INSERT INTO activities (title, description, start_time, end_time, location, creator_id) VALUES
('社区义诊活动', '为社区居民提供免费健康咨询和简单医疗服务', '2025-11-15 09:00:00', '2025-11-15 17:00:00', '北京市朝阳区社区中心', 
 (SELECT id FROM volunteers WHERE nickname = '测试志愿者1')),
('环保志愿者培训', '培训环保知识，提升环保意识', '2025-11-20 14:00:00', '2025-11-20 16:00:00', '上海市黄浦区环保局', 
 (SELECT id FROM volunteers WHERE nickname = '测试志愿者3'));

-- 插入测试任务数据
INSERT INTO tasks (title, description, requirements, creator_id, contact_info) VALUES
('AI数据标注助手', '帮助标注AI训练数据，支持公益项目', '熟悉计算机操作，有耐心', 
 (SELECT id FROM volunteers WHERE nickname = '测试志愿者1'), '13800138001'),
('线上教学辅导', '为贫困地区学生提供线上辅导', '有教学经验，沟通能力强', 
 (SELECT id FROM volunteers WHERE nickname = '测试志愿者2'), '13800138002');

COMMIT;