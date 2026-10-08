-- Migration 016: Insert Mzuzu Stadium Mega Salvation Crusade 2024 and 66 converts

-- 1. Create Mzuzu Stadium Crusade event in crusades table
INSERT OR IGNORE INTO crusades (slug, title, location, date_range, status, description)
VALUES ('mzuzu-stadium-2024', 'Mzuzu Stadium Mega Salvation Crusade 2024', 'Mzuzu Stadium, Mzuzu, Malawi', 'May 31 - Jun 2, 2024', 'past', 'Three days of evangelistic outreach at Mzuzu Stadium, followed up by local partner churches.');

-- 2. Insert Attendance Register Entries
INSERT INTO attendance_register (crusade_id, service_date, service_name, ministering_name, attendance_count, authorized_by) VALUES
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 180, 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 173, 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 81, 1);

-- 3. Sheet 1 & 2: 01-06-2024 Saturday Evening Service
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'S. Thambo', '0999779580', 'CCAP', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Esther Gama', '0881525163', 'Roman Catholic', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Teleza Phiri', '0881289211', 'Roman Catholic', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Mack Kawanga', NULL, 'Bible Believer', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Gift Phiri', NULL, 'Assemblies of God', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Huludo Steven', '0995088071', 'Bible Believer', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Vitumbiko Mkandawire', '0995804682', 'Cross Life', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Joice Ndovie', '09913541293', 'Glory to Jesus', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Godfully Myumpa', '0888384747', 'Roman Catholic', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Kettilina Chilambo', '0889610295', NULL, '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Alefa Phiri', NULL, 'ZCC', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Chali Phiri', '0880298061', 'CCAP', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Estere Nkhata', NULL, 'APC', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Estery Mbewe', '0880298061', 'CCAP', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Victoria Mthali', '0880298061', 'CCAP', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Yness Kanyasko', NULL, 'Last Church', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Tryness Banda', NULL, 'God Presence', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Martha Chaba', '0885719571', 'Gods Tabernacle', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Ethel Tembo', NULL, 'New Apostolic', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Rose Kaunda', NULL, 'New Apostolic', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Agness Banda', NULL, 'Assemblies of God', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Modester Lungu', '0881386783', 'Baptist Church', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Mwai Banda', '0985702217', 'Church of Christ', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Vitu Mkandawire', '0985004682', 'Cross Life', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Margret Msofi', NULL, 'Seventh Day', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Pemphero Nkhoma', '0989755636', 'Bible Believer', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Asa Nguluwe', '0880550802', 'Ziyon', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Estere Phiri', NULL, 'Assemblies of God', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Veronica Jere', '0991748553', 'Baptist Church', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Leah Manda', NULL, 'Baptist Church', '2024-06-01', 'Saturday Evening Service', 'Evangelist Chitipula', 'pending', 1);

-- 4. Sheet 3: 02-06-2024 Sunday Morning Service
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Promise Chikakula', '0984902802', 'Assemblies of God', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Shantel Nyirenda', '0885547719', 'CCAP', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Abraham Kawonga', '0995894224', 'Assemblies', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Loveness Mtambo', '0889600963', 'CCAP', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Mwayi Moyo', '0997736238', 'CCAP', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Lukaus Phiri', '1883588699', 'Good News', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Mwai Banda', '0955102210', 'Church of Christ', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Rocent Chaba', '0988143579', 'Giving Grace Salvation', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Anna Phiri', '0984156070', 'CCAP', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Lizzie Kalikwati', '0998300050', 'CCAP', '2024-06-02', 'Sunday Morning Service', 'Senior Kawonga', 'pending', 1);

-- 5. Sheet 4 & 5: 31-05-2024 Friday Evening Service
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Esther Nyirenda', '0992341515', 'CCAP', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Lose Kaunda', '0882613156', 'New Apostolic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Lucy Chekweza', '098191580', 'CCAP', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Lenson Mhango', '0996640781', 'CCAP', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Mr Shawa', '0885453516', 'New Apostolic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Mark Songob Banda', '0992318667', 'Word Alive', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Yamikani Nkhoma', '0997477921', 'Word Alive', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Lose Kaunda', '0852613156', 'New Apostolic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Joyce Mhone', '0996421838', 'Seventh Day', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Maria Banda', '0992530180', 'Good News', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Eveless Chirwa', '0949981916', 'Roman Catholic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Alice Phiri', NULL, 'Baptist', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Eliza Luwanda', '0883454799', 'Glob Church', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Lyton Nkhoma', '088486667', 'Baptist', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Chikondi Mlenga', '0985004683', 'Cross Life', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Modester Mlenga', '0985004683', 'Chipangano', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Cucess Chipwa', '0949981916', 'Roman Catholic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Oxenji Chipeta', '0853454799', 'Good News', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Brave Musali', '09833146092', 'New Apostolic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Foston Singini', '0989111607', 'New Apostolic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Dano Kamwera', '0881234367', 'Roman Catholic', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Thelus Phiri', '0883588699', 'Chipangano', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Cecelia Mkandawire', NULL, 'Chipangano', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Trone Mkandawire', NULL, 'Chipangano', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Alice Phiri', NULL, 'Baptist Church', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'mzuzu-stadium-2024'), 'Chriss Mkandawire', NULL, 'Chipangano', '2024-05-31', 'Friday Evening Service', 'RGM / Evangelist Chitipula', 'pending', 1);
