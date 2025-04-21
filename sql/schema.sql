-- ===============================
-- USERS TABLE
-- ===============================

CREATE TABLE [users] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [email] NVARCHAR(254) NOT NULL UNIQUE,
    [password] NVARCHAR(255) NOT NULL,
    [full_name] NVARCHAR(100) NOT NULL,
    [role] NVARCHAR(20) NOT NULL,
    [created_at] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
    [updated_at] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT chk_user_role CHECK ([role] IN ('candidate', 'recruiter', 'admin'))
);
ALTER TABLE users
ADD CONSTRAINT DF_users_role DEFAULT 'candidate' FOR role;


-- ===============================
-- ASSESSMENT TABLE
-- ===============================
CREATE TABLE [Assessment] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [score] INT NOT NULL,
    [assessment_date] DATETIME2(7) NOT NULL,
    [status] NVARCHAR(50) NOT NULL,
    [user_id] INT NOT NULL,
    FOREIGN KEY ([user_id]) REFERENCES [users]([id])
);

-- ===============================
-- RESPONSES TABLE
-- ===============================
CREATE TABLE [Responses] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [assessment_id] INT NOT NULL,
    [question_id] INT NOT NULL,
    [response] NVARCHAR(MAX) NOT NULL,
    [created_at] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
    FOREIGN KEY ([assessment_id]) REFERENCES [Assessment]([id]),
    FOREIGN KEY ([question_id]) REFERENCES [Questions]([id])
);

-- ===============================
-- MODULES TABLE
-- ===============================
CREATE TABLE [Modules] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [module_name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(MAX) NULL
);

-- ===============================
-- QUESTIONS TABLE
-- ===============================
CREATE TABLE [Questions] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [module_id] INT NOT NULL,
    [question_text] NVARCHAR(MAX) NOT NULL,
    [options] NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY ([module_id]) REFERENCES [Modules]([id])
);

-- ===============================
-- RESULTS TABLE
-- ===============================
CREATE TABLE [results] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [assessment_id] INT NOT NULL,
    [personality_type] NVARCHAR(50) NOT NULL,
    [details] NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY ([assessment_id]) REFERENCES [Assessment]([id])
);

-- ===============================
-- FEEDBACK TABLE
-- ===============================
CREATE TABLE [Feedback] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [assessment_id] INT NOT NULL,
    [rating] NVARCHAR(50) NOT NULL,
    [feedback_text] NVARCHAR(MAX) NULL,
    [created_at] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
    FOREIGN KEY ([assessment_id]) REFERENCES [Assessment]([id])
);

-- ===============================
-- FAQS TABLE
-- ===============================
CREATE TABLE [FAQs] (
    [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [question] NVARCHAR(MAX) NOT NULL,
    [answer] NVARCHAR(MAX) NOT NULL,
    [category] NVARCHAR(100) NULL,
    [created_at] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
);

--Trigger
CREATE TRIGGER trg_users_update
ON [users]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [users]
    SET updated_at = SYSDATETIME()
    FROM [users] u
    INNER JOIN inserted i ON u.id = i.id;
END;
