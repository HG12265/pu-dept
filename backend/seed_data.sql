CREATE DATABASE IF NOT EXISTS periyar_univ;
USE periyar_univ;

-- Table check (optional if Base.metadata.create_all is run)
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    banner_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dept_id INT NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    order_index INT DEFAULT 0,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS department_nav_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dept_id INT NOT NULL,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Seed Data for Biochemistry
INSERT INTO departments (name, slug, title, banner_image) 
VALUES ('Biochemistry', 'biochemistry', 'DEPARTMENT OF BIOCHEMISTRY', '/logo.JPG')
ON DUPLICATE KEY UPDATE name=VALUES(name);

SELECT id INTO @dept_id FROM departments WHERE slug = 'biochemistry' LIMIT 1;

-- Clean existing links/sections to avoid duplicates on re-run
DELETE FROM department_nav_links WHERE dept_id = @dept_id;
DELETE FROM department_sections WHERE dept_id = @dept_id;

-- Insert navigation links
INSERT INTO department_nav_links (dept_id, label, url, order_index) VALUES 
(@dept_id, 'Home', '#home', 1),
(@dept_id, 'Programmes Offered', '#Programmes', 2),
(@dept_id, 'Syllabus', '#Syllabus', 3),
(@dept_id, 'Faculty', '#Faculty', 4),
(@dept_id, 'Activities', '#Activities', 5),
(@dept_id, 'Facilities', '#Facilities', 6),
(@dept_id, 'Funded Projects', '#Projects', 7),
(@dept_id, 'PDF', '#PDF', 8),
(@dept_id, 'Alumni', '#Alumni', 9),
(@dept_id, 'Contact', '#Contact', 10);

-- Insert sections
INSERT INTO department_sections (dept_id, section_title, content, order_index) VALUES 
(@dept_id, 'ABOUT THE DEPARTMENT', 'The department of Biochemistry was established in the year 2005. The main objective of the department is to inculcate the basic concepts and applications of Biochemistry and thrive in the field of research and development. The department is known for its commitment to the development of the students into well-rounded individuals who can take on leadership role in Industry, Academic or Government.', 1),
(@dept_id, 'VISION', 'To be recognized as a center for advanced study in Biochemistry that provides an atmosphere to excel in Biochemistry skills through teaching and research process', 2),
(@dept_id, 'MISSION', '<ul><li>To impart scientific knowledge to the professional and personal growth of students and scholars.</li><li>To translate our discoveries and inventions into meaningful applications for health care and Industry.</li></ul>', 3);

-- Seed Data for Botany
INSERT INTO departments (name, slug, title, banner_image) 
VALUES ('Botany', 'botany', 'DEPARTMENT OF BOTANY', '/logo.JPG')
ON DUPLICATE KEY UPDATE name=VALUES(name);

SELECT id INTO @bot_id FROM departments WHERE slug = 'botany' LIMIT 1;

DELETE FROM department_nav_links WHERE dept_id = @bot_id;
DELETE FROM department_sections WHERE dept_id = @bot_id;

INSERT INTO department_nav_links (dept_id, label, url, order_index) VALUES 
(@bot_id, 'Home', '#home', 1),
(@bot_id, 'Programmes Offered', '#Programmes', 2),
(@bot_id, 'Syllabus', '#Syllabus', 3),
(@bot_id, 'Faculty', '#Faculty', 4),
(@bot_id, 'Activities', '#Activities', 5),
(@bot_id, 'Facilities', '#Facilities', 6),
(@bot_id, 'Funded Project', '#Project', 7),
(@bot_id, 'Alumni', '#Alumni', 8),
(@bot_id, 'Contact', '#Contact', 9);

INSERT INTO department_sections (dept_id, section_title, content, order_index) VALUES 
(@bot_id, 'ABOUT THE DEPARTMENT', 'The Department of Botany was established in the year 2011. The department is being blooming in to making wisdom. Our mission is to discover, maintain, and transmit knowledge concerning basic plant biology and provide leadership in the biological sciences.', 1),
(@bot_id, 'RESOURCES FOR TEACHING AND RESEARCH', 'The department has separate class and laboratory facilities for teaching and research programmes. PG and research laboratories are established.', 2),
(@bot_id, 'RESEARCH PROGRAMME', 'The department of Botany is attempting to contribute solutions to the problems through its broad based and innovative research.', 3),
(@bot_id, 'VISION', 'To equip our students to meet the empowering education through biological innovations', 4),
(@bot_id, 'MISSION', '<ol><li>Discover, maintain and transmit the knowledge concerning basic plant biology.</li><li>Advance, integrate, evaluate and communicate knowledge of plant sciences.</li><li>Seek out, anticipate and lead in addressing the agriculture, ecological and environmental needs.</li></ol>', 5);
