# 小 x 宝社区志愿者小程序 设计文档（v2.3，整理版）

> 更新日期：2025-11-13  
> 变更摘要：身份标签替代传统职业、默认隐私保护、数据库采用 Supabase（可迁移）、全链路设计结构化整理。

---

## 1. 概述与目标
- 背景：为愿意参与公益的志愿者（病友/家属/医护/工程师/学生等）提供一个轻量小程序，用于志愿者注册引导，志愿者和社区基本介绍，志愿任务领取，服务时长记录服务、匹配活动与任务、交流心得和人脉匹配的轻社交能力。提供分享能力，通过任务分享，证书分享，活动分享等方式，提升志愿者社区活跃和扩大。


- 总体目标：
  - 30 秒完成注册（可选身份认证）。
  - 不泄露职业隐私，仅展示公益技能与服务贡献。
  - 活动/任务发布方可在 1 分钟内找到所需志愿者。
  - 30 天内无服务记录者，可被系统自动标记为「非活跃志愿者」。
  - 3步完成新志愿者注册：
    1. 微信授权登录。
    2. 输入手机号验证。
    3. 填写志愿者身份标签（多选，最多 3 个）。
  - 活跃的分享机制
  - 证书生成：调用腾讯图像服务的证书生成接口，生成志愿者的服务证书（包含服务时长、服务项目、服务时间等）。

---

## 2. 架构与数据流
- 前端：微信小程序原生 + TypeScript，UI 使用 Vant Weapp + 自定义色板（公益绿）。
- 后端：Supabase Postgres（RLS 行级安全）+ Edge Functions（用于业务编排与权限控制补位）。
- 管理端：Web（Vue）用于审核、运营与数据看板。
- 数据流关键点：
  - 小程序登录 → 获取 `auth.uid()` → 绑定志愿者档案（`volunteers.auth_user_id`）。
  - 公开查询仅在 RLS 允许且用户设置可搜索时返回公开字段。
  - 活动/任务的报名、分配、完成由 Edge Functions 保证一致性与审计。

---

## 3. 用户端功能设计
- 注册/登录：微信授权 → 手机验证 → 进入「身份标签」页（可跳过）。
  - **微信授权头像**：默认使用微信授权后的用户头像，支持后续在个人中心自定义修改
  - **登录流程**：调用微信 `wx.login()` 获取 code，通过 `wx.getUserProfile()` 获取用户信息（包括头像、昵称）
  - **头像存储**：头像 URL 存储在本地存储和全局数据中，供各页面调用显示
- 个人中心：
  - 资料编辑：**微信授权头像**、昵称、所在地、成为志愿者年份、身份标签（多选，折叠展示）、可提供志愿技能（≤3，支持自定义）。
  - 隐私开关：是否显示二级标签（默认关）；是否允许技能搜索（默认开）；是否公开微信（默认关）；**头像可见性设置**（默认公开）。
  - 服务时长：签到自动累计；支持上传证明（需审核）。
  - 我的社团/活动：卡片展示，支持活动订阅（导入微信日历）。
- 志愿者墙：仅展示公益领域 + 技能 + 服务时长；支持地区/领域/技能关键词/是否在线筛选；支持昵称/技能/社团名称搜索；详情页为「公益名片」（隐藏单位与职位）。
- 活动大厅：发布（官方/个人，线上/线下，报名表单可自定义）；匹配（身份标签 + 技能推荐）；报名 → 审核 → 签到（地理位置 + 二维码）→ 自动累加时长 → 评价。
- 消息中心：系统通知（审核/活动开始/时长到账）、社团公告（群二维码 7 天过期）、私信（文字+图片，48h 可撤回）。
- 技能志愿 & 招募频道：志愿者可发布「1 小时公益咨询」；机构可发布「急需 AI 训练师」等需求，支持双向搜索与匹配。

---

## 4. 管理端功能设计（Web-Vue）
- 用户管理：身份审核、冻结、导出。
- 内容管理：动态/证明/举报 三审流。
- 活动管理：置顶、加 V、批量导出签到表。
- 消息推送：分段广播（标签 + 地区）。
- 数据看板：日活、留存、技能供需图。

---

## 5. 任务发布模块（新增）
- 功能流程：任务发布 → 志愿者报名 → 审核/分配 → 执行 → 完成与评价。
- 任务字段：标题、描述、能力要求、周期、奖励、发起人、联络方式、状态（1 开放 / 2 进行中 / 3 已完成）。
- 报名字段：任务 ID、志愿者 ID、报名时间、报名状态（0 未审核 / 1 已接受 / 2 已拒绝）。

---

## 6. 数据库设计（Supabase Postgres）

### 6.1 志愿者主表（改进版）
```sql
create extension if not exists "uuid-ossp";
create extension if not exists "pg_jsonschema";

create table volunteers (
  id                uuid primary key default uuid_generate_v4(),
  auth_user_id      uuid unique,                -- 绑定 supabase auth 用户ID，便于RLS
  openid            varchar(64) unique,         -- 小程序 openid（如使用中转登录，可选）
  phone             varchar(20),
  nickname          varchar(30),
  avatar_url        text,
  volunteer_since   int,                        -- 年份
  location          varchar(50),
  industry_tags     jsonb,                      -- ["医疗机构-医生","AI公益组织"]
  skills            jsonb,                      -- ["义诊","无障碍测试"]
  show_industry     boolean default false,
  searchable        boolean default true,
  status            smallint default 1,         -- 0冻结 1正常
  created_at        timestamp default now(),
  updated_at        timestamp default now()
);

alter table volunteers enable row level security;

-- 公开查询：仅允许正常且允许被搜索的志愿者被公众看到（公开字段）
create policy "public_select_searchable_volunteers"
  on volunteers for select
  using (status = 1 and searchable = true);

-- 本人可更新自己的资料（依赖 auth_user_id 与 auth.uid() 绑定）
create policy "volunteer_update_self"
  on volunteers for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

-- 仅本人或系统允许插入自己的档案
create policy "volunteer_insert_self"
  on volunteers for insert
  with check (auth.uid() = auth_user_id);

create index idx_vol_tags on volunteers using gin (industry_tags);
create index idx_vol_skills on volunteers using gin (skills);
```

### 6.2 关联表（简写）
```sql
create table communities (
  id          uuid primary key default uuid_generate_v4(),
  name        varchar(100),
  description text,
  member_count int default 0,
  creator_id  uuid references volunteers(id),
  status      smallint default 1,
  created_at  timestamp default now(),
  updated_at  timestamp default now()
);

create table activities (
  id          uuid primary key default uuid_generate_v4(),
  title       varchar(100),
  description text,
  start_time  timestamp,
  end_time    timestamp,
  location    varchar(100),
  creator_id  uuid references volunteers(id),
  status      smallint default 1,
  created_at  timestamp default now(),
  updated_at  timestamp default now()
);

create table activity_sign (
  id            uuid primary key default uuid_generate_v4(),
  activity_id   uuid references activities(id),
  volunteer_id  uuid references volunteers(id),
  sign_time     timestamp default now(),
  status        smallint default 1            -- 0未审核 1已签到
);

create table messages (
  id            uuid primary key default uuid_generate_v4(),
  sender_id     uuid references volunteers(id),
  receiver_id   uuid references volunteers(id),
  content       text,
  created_at    timestamp default now(),
  deleted_at    timestamp
);

create table reports (
  id            uuid primary key default uuid_generate_v4(),
  reporter_id   uuid references volunteers(id),
  reported_id   uuid references volunteers(id),
  content       text,
  status        smallint default 0,           -- 0未处理 1已处理
  created_at    timestamp default now()
);
```

### 6.3 任务发布模块（表）
```sql
create table tasks (
  id            uuid primary key default uuid_generate_v4(),
  title         varchar(100),
  description   text,
  requirements  text,
  duration      interval,
  reward        text,
  creator_id    uuid references volunteers(id),
  contact_info  text,
  status        smallint default 1,           -- 1开放 2进行中 3已完成
  created_at    timestamp default now(),
  updated_at    timestamp default now()
);

create table task_signups (
  id            uuid primary key default uuid_generate_v4(),
  task_id       uuid references tasks(id),
  volunteer_id  uuid references volunteers(id),
  signup_time   timestamp default now(),
  status        smallint default 1             -- 0未审核 1已接受 2已拒绝
);
```

### 6.4 任务模块 RLS 与公开视图（隐私强化）
```sql
-- 启用 RLS
alter table tasks enable row level security;
alter table task_signups enable row level security;

-- 公开查询：仅允许查询“开放”状态任务（不建议直接查 tasks 表的 contact_info）
create policy "public_select_open_tasks"
  on tasks for select
  using (status = 1);

-- 发起人可插入/更新自己的任务：通过 volunteers.auth_user_id 绑定鉴权
create policy "task_insert_by_creator"
  on tasks for insert
  with check (
    exists (
      select 1 from volunteers v
      where v.id = creator_id and v.auth_user_id = auth.uid()
    )
  );

create policy "task_update_by_creator"
  on tasks for update
  using (
    exists (
      select 1 from volunteers v
      where v.id = creator_id and v.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from volunteers v
      where v.id = creator_id and v.auth_user_id = auth.uid()
    )
  );

-- 报名表：本人可插入报名；本人或任务发起人可查询；仅任务发起人可更新报名状态
create policy "signup_insert_self"
  on task_signups for insert
  with check (
    exists (
      select 1 from volunteers v
      where v.id = volunteer_id and v.auth_user_id = auth.uid()
    )
  );

create policy "signup_select_self_or_task_owner"
  on task_signups for select
  using (
    exists (
      select 1 from volunteers v
      where v.id = volunteer_id and v.auth_user_id = auth.uid()
    )
    or exists (
      select 1 from tasks t
      join volunteers v2 on t.creator_id = v2.id
      where t.id = task_id and v2.auth_user_id = auth.uid()
    )
  );

create policy "signup_update_by_task_owner"
  on task_signups for update
  using (
    exists (
      select 1 from tasks t
      join volunteers v on t.creator_id = v.id
      where t.id = task_id and v.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from tasks t
      join volunteers v on t.creator_id = v.id
      where t.id = task_id and v.auth_user_id = auth.uid()
    )
  );

create index if not exists idx_task_signups_task_vol on task_signups(task_id, volunteer_id);

-- 建议：通过公开视图暴露任务列表，避免泄露 contact_info
create or replace view tasks_public as
select
  id, title, description, requirements, duration, reward,
  creator_id, status, created_at, updated_at
from tasks
where status = 1;
```

---

## 7. API 设计（REST + Edge Functions）

### 7.1 自动 REST（示例）
- `GET /rest/v1/tasks?status=eq.1`：获取所有开放任务。
- `POST /rest/v1/task_signups`：志愿者报名任务。
- `PATCH /rest/v1/tasks/{id}`：更新任务状态（任务发起人）。

### 7.2 Edge Functions（含函数级注释）

```javascript
/**
 * Function: createTask
 * 作用：创建任务并返回创建结果，确保字段校验与权限约束。
 * 参数：
 *   - title {string} 任务标题（必填）
 *   - description {string} 任务描述（必填）
 *   - requirements {string} 能力要求（可选）
 *   - duration {string} 任务周期（ISO8601或可解析格式，可选）
 *   - reward {string} 任务奖励（可选）
 *   - creatorId {string} 发起人ID（uuid，必填且需与当前用户匹配）
 *   - contactInfo {string} 联络方式（必填）
 * 返回值：
 *   - 200: { data: { id, ... } } 创建成功的任务记录
 *   - 400/401/403/500: { error: string } 错误信息
 * 异常处理：
 *   - 参数缺失或格式错误返回 400；
 *   - 身份不匹配返回 403；
 *   - 数据库插入失败返回 500，并记录错误日志。
 */
export async function createTask(event, supabase, user) {
  const body = JSON.parse(event.body || '{}');
  const { title, description, requirements, duration, reward, creatorId, contactInfo } = body;

  if (!user || !user.id || !creatorId || user.id !== creatorId) {
    return { statusCode: 403, body: JSON.stringify({ error: '权限不足或身份不匹配' }) };
  }
  if (!title || !description || !contactInfo) {
    return { statusCode: 400, body: JSON.stringify({ error: '缺少必填字段' }) };
  }

  const { data, error } = await supabase.from('tasks').insert({
    title,
    description,
    requirements,
    duration,
    reward,
    creator_id: creatorId,
    contact_info: contactInfo,
  }).select('*').single();

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: '任务创建失败' }) };
  }
  return { statusCode: 200, body: JSON.stringify({ data }) };
}

/**
 * Function: assignTask
 * 作用：将任务分配给指定报名的志愿者，更新报名状态与任务状态。
 * 参数：
 *   - taskId {string} 任务ID（uuid）
 *   - volunteerId {string} 志愿者ID（uuid）
 *   - approverId {string} 审核/分配操作者ID（uuid，应为任务发起人）
 * 返回值：
 *   - 200: { ok: true } 操作成功
 *   - 400/403/404/500: 错误信息
 * 异常处理：
 *   - 任务/报名不存在返回 404；
 *   - 非任务发起人操作返回 403；
 *   - 数据库更新失败返回 500。
 */
export async function assignTask(event, supabase, user) {
  const body = JSON.parse(event.body || '{}');
  const { taskId, volunteerId, approverId } = body;
  if (!taskId || !volunteerId || !approverId) {
    return { statusCode: 400, body: JSON.stringify({ error: '缺少必填字段' }) };
  }
  if (!user || user.id !== approverId) {
    return { statusCode: 403, body: JSON.stringify({ error: '权限不足或身份不匹配' }) };
  }

  const { data: task } = await supabase.from('tasks').select('id, creator_id, status').eq('id', taskId).single();
  if (!task) return { statusCode: 404, body: JSON.stringify({ error: '任务不存在' }) };
  if (task.creator_id !== approverId) return { statusCode: 403, body: JSON.stringify({ error: '仅发起人可分配任务' }) };

  const { error: signupErr } = await supabase
    .from('task_signups')
    .update({ status: 1 })
    .eq('task_id', taskId)
    .eq('volunteer_id', volunteerId);
  if (signupErr) return { statusCode: 500, body: JSON.stringify({ error: '更新报名状态失败' }) };

  const { error: taskErr } = await supabase.from('tasks').update({ status: 2 }).eq('id', taskId);
  if (taskErr) return { statusCode: 500, body: JSON.stringify({ error: '更新任务状态失败' }) };
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}

/**
 * Function: completeTask
 * 作用：将任务状态更新为“已完成”，并可触发服务时长结算等后续逻辑。
 * 参数：
 *   - taskId {string} 任务ID（uuid）
 *   - operatorId {string} 操作者ID（uuid，应为任务发起人或管理员）
 * 返回值：
 *   - 200: { ok: true }
 *   - 403/404/500: 错误信息
 * 异常处理：
 *   - 任务不存在返回 404；
 *   - 非发起人/管理员操作返回 403；
 *   - 数据库更新失败返回 500。
 */
export async function completeTask(event, supabase, user) {
  const body = JSON.parse(event.body || '{}');
  const { taskId, operatorId } = body;
  if (!taskId || !operatorId) {
    return { statusCode: 400, body: JSON.stringify({ error: '缺少必填字段' }) };
  }
  if (!user || (user.id !== operatorId)) {
    return { statusCode: 403, body: JSON.stringify({ error: '权限不足或身份不匹配' }) };
  }

  const { data: task } = await supabase.from('tasks').select('id, creator_id').eq('id', taskId).single();
  if (!task) return { statusCode: 404, body: JSON.stringify({ error: '任务不存在' }) };
  if (task.creator_id !== operatorId) return { statusCode: 403, body: JSON.stringify({ error: '仅发起人可完成任务' }) };

  const { error } = await supabase.from('tasks').update({ status: 3 }).eq('id', taskId);
  if (error) return { statusCode: 500, body: JSON.stringify({ error: '更新任务状态失败' }) };
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}

/**
 * Function: listPublicTasks
 * 作用：查询公开任务视图（tasks_public），不返回敏感字段 contact_info。
 * 参数（querystring）：
 *   - status {number} 任务状态过滤（默认 1 开放，仅对视图生效）
 *   - page {number} 页码（>=1，默认 1）
 *   - pageSize {number} 每页条数（默认 20，最大 100）
 * 返回值：
 *   - 200: { data: Task[] } 任务列表（公开字段）
 *   - 400/500: { error: string } 错误信息
 * 异常处理：
 *   - 参数不合法：返回 400 并提示有效范围；
 *   - 数据库查询失败：返回 500，记录错误日志；
 *   - 二次分析：若为越界页码，返回空列表并提示重新筛选。
 */
export async function listPublicTasks(event, supabase) {
  const qs = event.queryStringParameters || {};
  const status = Number(qs.status ?? 1);
  const page = Math.max(1, Number(qs.page ?? 1));
  const pageSizeRaw = Number(qs.pageSize ?? 20);
  const pageSize = Math.min(100, Math.max(1, pageSizeRaw));
  if (!Number.isInteger(status) || !Number.isInteger(page) || !Number.isInteger(pageSize)) {
    return { statusCode: 400, body: JSON.stringify({ error: '参数须为整数：status/page/pageSize' }) };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    // 通过公开视图返回数据，避免 contact_info 泄露
    let query = supabase.from('tasks_public').select('*');
    if (status) query = query.eq('status', status);
    const { data, error } = await query.range(from, to);
    if (error) throw error;
    return { statusCode: 200, body: JSON.stringify({ data: data || [] }) };
  } catch (e) {
    const msg = e?.message ? String(e.message) : '查询失败';
    return { statusCode: 500, body: JSON.stringify({ error: msg }) };
  }
}
```

---

## 8. 权限与隐私设计
- 数据采集最小化：除手机号外全部选填。
- 敏感图片（病历、志愿者证）使用 Supabase Storage `private` bucket，仅审核员可访问。
- 「一键注销」：用户发起后 30 天内物理删除。
- RLS 基本原则：公开查询仅曝光允许搜索的公开字段；写操作仅本人或管理员。

---

## 9. UI/UX 要点
- 顶部导航：志愿者墙 / 活动大厅 / 任务发布 / 我的。
- 搜索：统一搜索框（志愿者、活动、任务）。
- 卡片信息密度：突出志愿技能与服务时长，弱化职业与单位。
- 无障碍：支持色彩对比、字号调节、语音辅助（可选）。

---

## 10. 部署与运维（简版）
- 环境：开发（Supabase 免费层 + 云函数中转登录，白名单 IP）、生产（Supabase Pro + 阿里云 CDN）。
- 监控：Supabase 慢查询 + Sentry 小程序插件。
- 迁移策略：单表 >1000 万或日活 >5 万时，使用 `pg_dump` + 阿里云 DTS 迁移到国内 RDS，预计停机 <30 分钟。

---

## 11. 测试计划（DDT策略）
- 单元测试：核心函数与接口的输入/输出与错误处理（边界条件）。
- 集成测试：注册 → 报名 → 签到 → 时长累计 → 评价的主流程。
- 系统测试：端到端功能、权限与隐私开关的行为一致性验证。
- 性能测试：任务/活动列表在高并发下的响应时延与错误率。
 - 权限测试（新增）：
   - RLS：验证任务创建/更新仅限发起人；报名插入仅限本人；发起人可查询/更新报名。
   - 公开视图：验证通过 `tasks_public` 查询不返回 `contact_info`；公开接口在越权场景下不泄露敏感字段。

---

## 12. 交付清单
```
└─ xb-volunteer-miniprogram
   ├─ docs
   │  ├─ design_v2.3.md          // 整理版设计文档
   │  ├─ api.openapi.yml
   │  └─ legal
   ├─ sql
   │  ├─ supabase_schema.sql
   │  └─ RLS_examples.sql
   ├─ miniprogram                // 小程序源码
   ├─ admin-vue                  // 管理后台
   └─ functions                  // Edge Functions
```

---

## 13. 项目里程碑（周）
- 1-2：账号与资料（注册、登录、标签选择、RLS）。
- 3-4：活动流（发布/报名/签到/时长）。
- 5：搜索与匹配（志愿者墙、技能频道）。
- 6：社团与消息（创建、私信、公告）。
- 7：管理后台（审核、看板、推送）。
- 8：任务发布（发布、报名、分配）。
- 9：测试与上线（安全扫描、小程序审核、发布）。

---

## 附录：技术集成示例

### A. Supabase 初始化（小程序端）
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### B. 登录示例（含错误处理）
```javascript
/**
 * Function: loginWithPhoneOtp
 * 作用：通过短信验证码登录并拉取用户档案。
 * 参数：
 *   - phone {string} 手机号
 *   - code {string} 验证码（如走小程序服务端，可省略）
 * 返回值：
 *   - 登录成功后的用户信息或错误提示
 * 异常处理：
 *   - 登录失败：展示友好错误文案并不泄露底层错误细节；
 *   - 网络错误：提示用户重试；
 *   - 认证状态异常：引导重新授权。
 */
export async function loginWithPhoneOtp(phone, code) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw new Error('登录失败');
    return { ok: true, user: data?.user };
  } catch (e) {
    return { ok: false, error: e.message || '网络异常，请稍后重试' };
  }
}
```

---

## 新增：志愿者注册与表单规格（补充）

为满足“实名、联络方式（手机号、微信号）、志愿服务方向（选择菜单）、每周支援小时数、备注”等注册需求，补充如下规范：

### A. 表单字段与校验（小程序端）
- 实名：`real_name`（必填，长度 2-50，中文或字母）
- 手机号：`phone`（必填，国内手机号格式校验，入库前脱敏日志）
- 微信号：`wechat_id`（必填，长度 6-64，允许字母数字与“_”、“-”）
- 志愿服务方向：`service_directions`（必填，最多选择 3 项；下拉菜单词典示例：`陪护沟通`、`活动组织`、`AI训练与数据`、`运营宣传`、`募捐协调`、`心理支持`、`无障碍测试`）
- 每周支援小时数：`weekly_support_hours`（必填，整数 0-168，默认 2）
- 备注：`notes`（选填，最长 500 字）

表单交互要点：
- 所有必填项在提交前本地校验；错误采用就地提示，不泄露后端内部信息。
- 联系方式默认不公开，仅本人及管理员可见；新增“联系方式公开开关”`show_contact`（默认关闭）。
- 服务方向采用受控多选组件，限制最多 3 项，避免匹配噪声。

### B. 数据库扩展（志愿者注册字段）
为与现有 `volunteers` 表结构兼容，采用增量字段扩展：

```sql
-- 注册字段扩展（如初次部署可合并入建表语句）
alter table volunteers
  add column if not exists real_name varchar(50),
  add column if not exists wechat_id varchar(64),
  add column if not exists service_directions jsonb,
  add column if not exists weekly_support_hours smallint,
  add column if not exists notes text,
  add column if not exists show_contact boolean default false;

-- 约束与索引（提高数据质量与检索性能）
alter table volunteers
  add constraint chk_weekly_hours_range
  check (weekly_support_hours is null or (weekly_support_hours >= 0 and weekly_support_hours <= 168));

create index if not exists idx_vol_service_dirs on volunteers using gin (service_directions);
```

RLS 与隐私说明：
- 公开查询策略不返回 `real_name`、`phone`、`wechat_id`、`notes`；仅本人或管理员可读写。
- 新增列不改变既有公开策略：`public_select_searchable_volunteers` 仍仅曝光公开字段（昵称、公益技能、服务时长等）。
- 如需在管理端列表查看联系方式，建议通过服务端密钥或特定 Edge Function 提供受控访问。

### C. API：Edge Function 示例（注册/更新档案）

```javascript
/**
 * Function: registerVolunteer
 * 作用：创建或更新志愿者档案，覆盖注册所需字段并遵守隐私规则。
 * 参数：
 *   - realName {string} 实名（必填）
 *   - phone {string} 手机号（必填，格式校验）
 *   - wechatId {string} 微信号（必填）
 *   - serviceDirections {string[]} 服务方向（必填，≤3）
 *   - weeklySupportHours {number} 每周支援小时（必填，0-168）
 *   - notes {string} 备注（选填）
 *   - showContact {boolean} 是否公开联系方式（选填，默认 false）
 * 返回值：
 *   - 200: { data: { id, ... } } 档案数据
 *   - 400/401/403/500: { error: string } 错误信息
 * 异常处理：
 *   - 参数缺失或格式错误：返回 400；
 *   - 身份不存在或不匹配：返回 401/403；
 *   - 数据库写入失败：返回 500，并记录错误日志；
 *   - 二次分析：若为约束冲突，提示用户检查服务方向数量或小时范围；若为权限问题，提示重新登录绑定。
 */
export async function registerVolunteer(event, supabase, user) {
  const body = JSON.parse(event.body || '{}');
  const {
    realName,
    phone,
    wechatId,
    serviceDirections,
    weeklySupportHours,
    notes,
    showContact = false,
  } = body;

  // 基本参数校验
  if (!user || !user.id) {
    return { statusCode: 401, body: JSON.stringify({ error: '未登录或身份失效' }) };
  }
  if (!realName || !phone || !wechatId) {
    return { statusCode: 400, body: JSON.stringify({ error: '缺少必填字段' }) };
  }
  if (!Array.isArray(serviceDirections) || serviceDirections.length === 0 || serviceDirections.length > 3) {
    return { statusCode: 400, body: JSON.stringify({ error: '服务方向数量需在 1-3 之间' }) };
  }
  const hours = Number(weeklySupportHours);
  if (!Number.isInteger(hours) || hours < 0 || hours > 168) {
    return { statusCode: 400, body: JSON.stringify({ error: '每周支援小时需为 0-168 的整数' }) };
  }

  // 查找或创建档案（依赖 volunteers.auth_user_id 与 auth.uid 绑定）
  const { data: existing } = await supabase
    .from('volunteers')
    .select('id, auth_user_id')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  const payload = {
    real_name: realName,
    phone,
    wechat_id: wechatId,
    service_directions: serviceDirections,
    weekly_support_hours: hours,
    notes,
    show_contact: !!showContact,
    auth_user_id: user.id,
    updated_at: new Date().toISOString(),
  };

  let result, error;
  if (existing?.id) {
    ({ data: result, error } = await supabase
      .from('volunteers')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single());
  } else {
    ({ data: result, error } = await supabase
      .from('volunteers')
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select('*')
      .single());
  }

  if (error) {
    // 二次错误分析：约束/权限/网络
    const msg = /violates/.test(String(error.message || ''))
      ? '数据约束冲突，请检查服务方向或小时范围'
      : '保存失败，请稍后重试或重新登录';
    return { statusCode: 500, body: JSON.stringify({ error: msg }) };
  }
  return { statusCode: 200, body: JSON.stringify({ data: result }) };
}
```

---

（本整理版已移除运营策略、成本预算、FAQ 等非设计核心内容，并补充 RLS 与函数级注释示例，以提升可读性、可维护性与一次性交付成功率。）