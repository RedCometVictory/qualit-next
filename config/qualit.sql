-- create database then select it in psql terminal...
-- apply middleware right after the creation of the database
-- takes time to create db and uuid-oosp
-- \c <database> name to select database to work with
-- \l list all databases
-- \dt show all tables in current selected database
-- \d <table name> show details of columns that make up a table, must first select a database

-- UPDATE HISTORY:
-- Created new images table in order to keep data independent of products table and order_items table. This way images can be updated or deleted independently via Admin and are also safe from deletion if the Admin decides to delete a product from the porduct table or if a customer deletes and order (and subsequent order_items)) containing such image. This way the image is preserved for other customers' order histories (in the best possible manner I can think of).

-- can be skipped if db already created via heroku cli
-- NOTE: this command may take a while to complete
-- CREATE DATABASE blazr_gear;
-- CREATE DATABASE blazr_gear_ver_02;

-- Check the syntax of a query, if passed returns: DO:
-- DO $SYNTAX_CHECK$ BEGIN RETURN;
-- query goes here
-- END; $SYNTAX_CHECK$;

-- DO $SYNTAX_CHECK$ BEGIN RETURN;
-- CREATE TABLE shipping_addresses(
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   address VARCHAR(255) NOT NULL,
--   city VARCHAR(255) NOT NULL,
--   postal_code VARCHAR(255) NOT NULL,
--   country VARCHAR(255) NOT NULL,
--   order_id UUID,
--   user_id UUID,
--   FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- END; $SYNTAX_CHECK$;

-- EXAMPLE ADMIN QUERY
-- insert into carts (id, user_id, created_at) values ('9ca31730-462c-405e-ba55-81e01b21e613', '99504ea2-dc96-4761-b79d-d237c6872cea', '2022-05-25 05:33:21.444885');
-- INSERT INTO users (f_name, l_name, username, user_email, user_password, user_avatar, user_avatar_filename, admin) VALUES (first, here, HauseMaster, thehausewins@mail.com, , , , true);
-- https://www.youtube.com/watch?v=YPX6cZrl-Ag
-- https://www.youtube.com/watch?v=5jUU5TrMru8
-- ALTER TABLE table_name
-- ADD COLUMN new_column_name data_type constraint;

-- altering table columns, making them NOT NULL
-- ALTER TABLE cart_items ALTER COLUMN cart_id SET NOT NULL, ALTER COLUMN product_id SET NOT NULL;
-- altering table columns, making them UNIQUE
-- ALTER TABLE table_name ADD UNIQUE (col_id, col_item);

-- users: admin, project_manager, developer, submitter

-- migrate heroku db to bit.io
-- pg_dump --no-privileges --format p --file blazrgear_heroku_archive \ postgres://xnqooisbrqwcik:16c88b32590a83f77277c8954c53847ec4db48542d9abdea4e7a2ecee6def06e@ec2-3-228-235-79.compute-1.amazonaws.com:5432/d1q5ebhhjluul6

-- ########################################
-- ########################################
-- ########################################
-- create database in psql terminal, it may take some time, once created select the database. Once connected - create the extension next. Then following that create the tables.
CREATE DATABASE qualit_bug_tracker;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE projects(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(360) NOT NULL,
  description TEXT NOT NULL,
  github_url TEXT,
  site_url TEXT,
  -- owner is admin / submitter (user_id)
  owner UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE users(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  f_name VARCHAR(60) NOT NULL,
  l_name VARCHAR(60) NOT NULL,
  username VARCHAR(120) NOT NULL UNIQUE,
  email VARCHAR(60) NOT NULL UNIQUE,
  password VARCHAR(660) NOT NULL,
  -- ['Admin', 'Developer', 'Submitter', 'Project Manager', 'Banned', 'Deleted']
  role VARCHAR(120) NOT NULL DEFAULT 'Developer',
  -- user_avatar VARCHAR(300),
  -- user_avatar_filename VARCHAR(600),
  -- refresh_token TEXT,
  -- treat status as 'active' or 'deleted' if false
  -- status BOOLEAN DEFAULT true NOT NULL,
  -- may not need project_id for this table as members relation between users and projects table would offer more sense in structure
  project_id UUID,
  FOREIGN KEY(project_id) REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- members assigned, reassigned, or for some other reason - removed
-- currently a member of a project, if membership is revoked entry / removed from project, this member entry is not deleted, just status is changed in order to keep project history
CREATE TABLE members(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- active BOOLEAN DEFAULT true NOT NULL,
  -- ['assigned','reassigned','removed']
  status VARCHAR(120),
  user_id UUID,
  project_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(project_id) REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE tickets(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(120),
  description TEXT,
  -- alter table tickets alter notes type text[] using array[notes];
  notes TEXT ARRAY DEFAULT NULL,
  -- ['New','Open','On Hold','In Progress','Closed','Unconfirmed']
  status VARCHAR(100) NOT NULL DEFAULT 'New',
  -- ['Urgent','High','Medium','Low','None']
  priority VARCHAR(100) NOT NULL,
  -- ['Bug','Breaking Change','Discussion','Error','Enhancement','Feature Request','Needs Investigation','Question','Release','Regression','Security','Misc']
  type VARCHAR(100) NOT NULL,
  -- user id of submitter
  submitter UUID,
  deadline TIMESTAMP DEFAULT NULL,
  -- id of user ticket is assigned to
  user_id UUID,
  project_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(project_id) REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

-- user_id of user who made note
CREATE TABLE ticket_notes(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note TEXT DEFAULT NULL,
  user_id UUID,
  ticket_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(ticket_id) REFERENCES tickets(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

-- create projects table first
-- ALTER TABLE "messages" ALTER COLUMN message DROP NOT NULL;
CREATE TABLE messages(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT,
  -- notes TEXT,
  user_id UUID NOT NULL, -- who created the msg
  ticket_id UUID, -- not needed for notifs
  -- upload_id UUID,
  -- notification_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(ticket_id) REFERENCES tickets(id),
  -- FOREIGN KEY(upload_id) REFERENCES uploads(id),
  -- FOREIGN KEY(notification_id) REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

-- attach to message table, user_id attached to user who receives the notif
CREATE TABLE notifications(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- ['read', 'unread']
  status VARCHAR(100),
  read_at TIMESTAMP DEFAULT NULL,
  user_id UUID,
  -- ticket id may be nullable or not necessary
  -- ticket_id UUID,
  message_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  -- FOREIGN KEY(ticket_id) REFERENCES tickets(id),
  FOREIGN KEY(message_id) REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE histories(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- priority level at the time of change
  old_value VARCHAR(100) NOT NULL,
  new_value VARCHAR(100) NOT NULL,
  date_changed TIMESTAMP DEFAULT NULL,
  -- record who made the update
  user_id UUID,
  ticket_id UUID,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

-- ALTER TABLE images DROP CONSTRAINT files_id_fkey;

CREATE TABLE uploads(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_url VARCHAR(320) NOT NULL,
  file_name VARCHAR(320) NOT NULL,
  file_mimetype VARCHAR(200),
  message_id UUID,
  FOREIGN KEY (message_id) REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- --------------------------------------------------
-- trello boards
CREATE TABLE boards(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(320),
  background_image VARCHAR(320),
  -- array of users assigned to board,
  -- may not utilize
  users TEXT [],
  -- created by refers to userId, who owns the board
  user_id UUID,
  FOREIGN KEY (user_id) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE columns(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(320),
  sequence INTEGER,
  -- use board id fkey to get board_name column belongs to,
  board_id UUID,
  user_id UUID,
  FOREIGN KEY (board_id) REFERENCES boards(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE cards(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(320),
  description TEXT,
  priority VARCHAR(100),
  type VARCHAR(100),
  sequence INTEGER,
  board_id UUID,
  column_id UUID,
  user_id UUID,
  FOREIGN KEY (board_id) REFERENCES boards(id),
  FOREIGN KEY (column_id) REFERENCES columns(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);