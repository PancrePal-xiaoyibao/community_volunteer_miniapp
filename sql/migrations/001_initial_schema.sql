-- 初始数据库迁移脚本
-- 运行时间：项目初始化时

BEGIN;

-- 1. 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_jsonschema";

-- 2. 创建所有表（与 schema.sql 相同）
-- 这里省略表创建语句，实际使用时引用 schema.sql

-- 3. 创建初始数据（可选）
-- INSERT INTO volunteers (auth_user_id, nickname, location, volunteer_since) 
-- VALUES ('00000000-0000-0000-0000-000000000000', '系统管理员', '北京', 2023);

COMMIT;