-- 小x宝志愿者小程序数据库 Schema
-- 创建时间：2025-11-13

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_jsonschema";

-- 志愿者主表
CREATE TABLE volunteers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id      UUID UNIQUE,                -- 绑定 supabase auth 用户ID
  openid            VARCHAR(64) UNIQUE,          -- 小程序 openid
  phone             VARCHAR(20),
  nickname          VARCHAR(30),
  avatar_url        TEXT,
  volunteer_since   INTEGER,                     -- 成为志愿者年份
  location          VARCHAR(50),
  industry_tags     JSONB,                       -- 身份标签数组
  skills            JSONB,                       -- 技能数组
  show_industry     BOOLEAN DEFAULT FALSE,      -- 是否显示二级标签
  searchable        BOOLEAN DEFAULT TRUE,        -- 是否允许搜索
  status            SMALLINT DEFAULT 1,          -- 0冻结 1正常
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- 活动表
CREATE TABLE activities (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(100),
  description TEXT,
  start_time  TIMESTAMP,
  end_time    TIMESTAMP,
  location    VARCHAR(100),
  creator_id  UUID REFERENCES volunteers(id),
  status      SMALLINT DEFAULT 1,          -- 0关闭 1正常 2已结束
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- 活动签到表
CREATE TABLE activity_sign (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id   UUID REFERENCES activities(id),
  volunteer_id  UUID REFERENCES volunteers(id),
  sign_time     TIMESTAMP DEFAULT NOW(),
  status        SMALLINT DEFAULT 1            -- 0未审核 1已签到
);

-- 任务表
CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         VARCHAR(100),
  description   TEXT,
  requirements  TEXT,
  duration      INTERVAL,
  reward        TEXT,
  creator_id    UUID REFERENCES volunteers(id),
  contact_info  TEXT,
  status        SMALLINT DEFAULT 1,           -- 1开放 2进行中 3已完成
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- 任务报名表
CREATE TABLE task_signups (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id       UUID REFERENCES tasks(id),
  volunteer_id  UUID REFERENCES volunteers(id),
  signup_time   TIMESTAMP DEFAULT NOW(),
  status        SMALLINT DEFAULT 0             -- 0未审核 1已接受 2已拒绝
);

-- 消息表
CREATE TABLE messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id     UUID REFERENCES volunteers(id),
  receiver_id   UUID REFERENCES volunteers(id),
  content       TEXT,
  created_at    TIMESTAMP DEFAULT NOW(),
  deleted_at    TIMESTAMP
);

-- 社团表
CREATE TABLE communities (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100),
  description TEXT,
  member_count INTEGER DEFAULT 0,
  creator_id  UUID REFERENCES volunteers(id),
  status      SMALLINT DEFAULT 1,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- 举报表
CREATE TABLE reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id   UUID REFERENCES volunteers(id),
  reported_id   UUID REFERENCES volunteers(id),
  content       TEXT,
  status        SMALLINT DEFAULT 0,           -- 0未处理 1已处理
  created_at    TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_vol_auth_user ON volunteers(auth_user_id);
CREATE INDEX idx_vol_openid ON volunteers(openid);
CREATE INDEX idx_vol_tags ON volunteers USING GIN (industry_tags);
CREATE INDEX idx_vol_skills ON volunteers USING GIN (skills);
CREATE INDEX idx_vol_location ON volunteers(location);
CREATE INDEX idx_vol_status ON volunteers(status);

CREATE INDEX idx_activity_creator ON activities(creator_id);
CREATE INDEX idx_activity_status ON activities(status);
CREATE INDEX idx_activity_time ON activities(start_time, end_time);

CREATE INDEX idx_sign_activity ON activity_sign(activity_id);
CREATE INDEX idx_sign_volunteer ON activity_sign(volunteer_id);

CREATE INDEX idx_task_creator ON tasks(creator_id);
CREATE INDEX idx_task_status ON tasks(status);

CREATE INDEX idx_signup_task ON task_signups(task_id);
CREATE INDEX idx_signup_volunteer ON task_signups(volunteer_id);

CREATE INDEX idx_msg_sender ON messages(sender_id);
CREATE INDEX idx_msg_receiver ON messages(receiver_id);
CREATE INDEX idx_msg_created ON messages(created_at);

-- 启用行级安全策略
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_sign ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 公开查询策略：仅允许查询正常且可搜索的志愿者
CREATE POLICY "public_select_searchable_volunteers" ON volunteers
  FOR SELECT USING (status = 1 AND searchable = true);

-- 本人更新策略
CREATE POLICY "volunteer_update_self" ON volunteers
  FOR UPDATE USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- 本人插入策略
CREATE POLICY "volunteer_insert_self" ON volunteers
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- 活动公开查询策略
CREATE POLICY "public_select_activities" ON activities
  FOR SELECT USING (status = 1);

-- 任务公开查询策略
CREATE POLICY "public_select_tasks" ON tasks
  FOR SELECT USING (status = 1);

-- 注意：实际部署时需要根据具体需求添加更多安全策略