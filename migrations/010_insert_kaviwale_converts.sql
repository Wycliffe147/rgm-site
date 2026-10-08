-- Migration 010: Insert Kaviwale (Mzuzu) converts and attendance records

-- Session 1 Attendance: 2022-04-03 Pre-Easter Sunday Service
INSERT INTO attendance_register (service_date, service_name, ministering_name, attendance_count, authorized_by)
VALUES ('2022-04-03', 'Sunday', 'Evangelist Mchenga', 59, 1);

-- Session 3 Attendance: 2022-12-31 Crossover Night
INSERT INTO attendance_register (service_date, service_name, ministering_name, attendance_count, authorized_by)
VALUES ('2022-12-31', 'Crossover Night', 'Evangelist Ketete', 600, 1);

-- Session 4 Attendance: 2023-12-31 Crossover Service
INSERT INTO attendance_register (service_date, service_name, ministering_name, attendance_count, authorized_by)
VALUES ('2023-12-31', 'Crossover Service', 'RGM', 180, 1);

-- Converts Roster Inserts

-- Session 1: 2022-04-03 Pre-Easter Sunday Service
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
('Agness Chawa', NULL, 'New Apostolic', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Lincy Kamanga', NULL, 'Chipangano', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Mercy Nyirenda', '0990050779', 'Church of Christ', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Flora Banda', NULL, 'Chipangano', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Witness Simkonda', NULL, 'New Apostolic', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Mrs Malasu', NULL, 'New Apostolic', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Mrs Kajado', NULL, NULL, '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Jenifa Chitete', NULL, 'God''s Tabernacle', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Angella Banda', NULL, 'New Apostolic', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Mai Banda', NULL, 'Baptist', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Thoko Banda', NULL, NULL, '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1),
('Mrs Saka', NULL, 'Christian Love', '2022-04-03', 'Sunday', 'Evangelist Mchenga', 'pending', 1);

-- Session 2: 2022-04-03 Pre-Easter Special Service
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
('Esnat Simbeye', NULL, 'Last', '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Blessings Mulowoka', '0995118117', NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Maria Banda', '0881635673', NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Charity', NULL, NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Thoko', NULL, NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Wezi', NULL, NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Cathren', NULL, NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Nyabanda', NULL, NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1),
('Abraham', NULL, NULL, '2022-04-03', 'Pre-Easter Special Service', 'Evangelist Mchenga', 'pending', 1);

-- Session 3: 2022-12-31 Crossover Night
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
('Tamaliyapo Manda', '0994354492', 'Seventh Day Church', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Ida Nkhoma', '0995088071', 'Bible Believer', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Devis Mtonga', '0881007014', 'CCAP', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Martha Longwe', '0995596305', 'SDA', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Fanny', '0992049083', NULL, '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Paul Mkandawire', '0997783287', 'African Church', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Faith Nyirongo', NULL, 'Cross Life Church', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Atupele Mlinda', '0993509298', 'Good News Revival', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Wezzie Siwamba', '0995885004', 'Fountain of Faith', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Loyce Ndovie', '0991351293', 'Glory To Jesus', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Steria Simbeye', '0884558839', 'R.C', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Annie Nyirongo', '0986601888', 'Cross Life Church', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Judith Mkandawire', '0984456355', 'R.C', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Yamikani Kaluka', NULL, 'CCAP', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Eliza Ngulube', NULL, 'R.C', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Estere Ngulube', NULL, 'R.C', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Mery Moses', '0991029297', 'God''s Tabernacle G.T.M', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Rose Nyondo', '0987355778', 'Good News Revival', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Arphaxad Mlinda', '0990390699', 'Good News Revival', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Loveness', '0885435838', 'CCAP', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('M. Ketembo', '0995467525', 'PIM', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1),
('Given Grace Mwangomale', '0993509298', 'Good News Revival', '2022-12-31', 'Crossover Night', 'Evangelist Ketete', 'pending', 1);

-- Session 4: 2023-12-31 Crossover Service
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
('Martin', NULL, 'Roman Catholic', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Eda Nguluwe', NULL, 'Roman Catholic', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Joice Singini', NULL, 'CCAP', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Esnat Gumba', NULL, 'Chipangano', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Alan Msowoya', NULL, 'New Apostolic', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Osman Nyula', NULL, 'CCAP', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Chisomo Chawambo', NULL, 'Seventh Day', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Jason Phiri', NULL, 'Chipangano', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Martin Mwara', NULL, NULL, '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Fishan Chilambo', NULL, 'Assemblies', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Eliza Ngulube', NULL, 'Roma', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Martha Shaba', '0995080491', 'God', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Oliver Jere', NULL, 'Synod CCAP', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Annie Kalonje', NULL, NULL, '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Ruth Sapawoso', NULL, 'Assemblies', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Bridget Simwaka', NULL, 'Roma Catholic', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Grace Mwagomba', NULL, 'Good News', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Celina Phiri', NULL, 'Last Church', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Glory Kalanga', NULL, 'R.C', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Reith Sapawo', NULL, 'Assemblies', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Harrison Lungu', NULL, 'CCAP', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Wezzie Phiri', NULL, 'African Church', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1);
