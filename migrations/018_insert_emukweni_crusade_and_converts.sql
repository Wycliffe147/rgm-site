-- Migration 018: Insert Emukweni Mega Salvation Crusade 2023 and 121 converts/contacts

-- 1. Create Emukweni Crusade event in crusades table
INSERT OR IGNORE INTO crusades (slug, title, location, date_range, status, description)
VALUES ('emukweni-2023', 'Emukweni Mega Salvation Crusade 2023', 'Emukweni, Mzimba, Malawi', 'Jun 2-3, 2023', 'past', 'Gospel outreach and door-to-door evangelism in Emukweni, Mzimba.');

-- 2. Insert Attendance Register Entry
INSERT INTO attendance_register (crusade_id, service_date, service_name, ministering_name, attendance_count, authorized_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), '2023-06-02', 'Evening Service', 'Kawonga', 515, 1);

-- 3. Sheet 1: Door-to-Door Evangelism (22 contacts) - 03/06/2023 1:00 PM
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Kondwani Mbewe', NULL, 'Yehova Sunday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Tchalosi Mtape', NULL, 'Church of Christ', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Blessings Mhone', NULL, 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Latio Mhone', '0997163615', 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Kondwani Nyasulu', '0889393235', 'Emanuel Church', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Henile Phiri', '0888798458', 'CCAP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Blessings Kawonga', '0889526594', 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Wongani Halawa', '0889554667', 'PAOG', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Moses Sikuese', '0981112056', 'PAOG', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Simon Godfule', NULL, 'Catholic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Luth Kawonga', NULL, 'Roma', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Pilirani Mbewe', NULL, 'Roma', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Acuim Gondwe', NULL, 'Assemblies', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Vitumbiko Gondwe', NULL, 'Assemblies', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mecy Mlaradzi', '0997760532', 'CCAP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Beauty Sichimba', NULL, 'Holiness', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Ackim Mhanga', '0882648448', 'Zione', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Joyele Sichimba', NULL, 'Lutheran', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Edwile Vinkhumbo', NULL, 'ACG', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Bright Banda', NULL, 'Roma Catholica', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Joseph Gama', NULL, 'Roma', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Gizo Soko', NULL, 'New Apostolic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Good function (Crusade)', 'pending', 1);

-- 4. Sheet 2: Door-to-Door Evangelism (23 contacts) - 03/06/2023 11:04 AM
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Amayi Longwe', NULL, 'Zione', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Alinafe Mkonongo', '0886443919', 'Assemblies of God', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Precious Mkonongo', '0994555733', 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Victor Chavula', '0885143832', 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Towela Mvula', '0882147836', 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Propher Mvula', NULL, 'New Apostolic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Joyful Mkandawiri', '0983739502', 'Charismatic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Fwasane Halawila', '0983739502', 'CCP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mery Ngondwe', '0990898382', 'Assemblies of God', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Scora Mgemezury', '0990898382', 'Chipangano', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mable Mawawa', '0990898382', 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Maifa Singini', '0990898382', 'Assemblies of God', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Rajas Mkandawire', '0990898382', 'Assemblies of God', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Jolie Msowoya', '0990898382', 'Assemblies of God', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Jofryb Msowoya', '0990898382', 'Assemblies of God', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Christopher Banda', '098619169', 'CCP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Ester Mhango', NULL, 'CCP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mphatso Lungu', '0886485434', 'Divine', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Chawanangwa Banda', '0886485434', 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Naomi Banda', '0886485434', 'CCP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Sipiwe', '0886485434', 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Chricy Msowoya', '0886485434', 'CCP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Frank Khonje', '0886485434', 'Holy Hope Family', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1);

-- 5. Sheet 3: Door-to-Door Evangelism (13 contacts) - 03/06/2023 Morning
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Joniyas Kumwenda', NULL, 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Tapiya Vinkhumbo', '0980233530', 'Divine', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Magret Phiri', NULL, 'Divine', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Amos Mkandawire', NULL, 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Christina Muthali', '09986587376', 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Revison Msowoya', NULL, 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Suzen Nkhoma', '0993950544', 'Mboni za Yehova', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Pilirani Mbewe', NULL, 'R.C.', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Anastazia Mtetwa', NULL, 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'William Kumwenda', NULL, 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Shadreck Tchongwe', NULL, 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Esawy Davite', '0990102262', 'Living Waters', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Vic Ngoma', NULL, 'C.C.A.P', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1);

-- 6. Sheet 4: Door-to-Door Evangelism (8 contacts) - 03/06/2023 Morning
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Ajabu Nkosi', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Yohane Moyo', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Wongani Nyasulu', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Laston Shawa', '0881968413', NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade - Mr Laston Shawa was on his way to suicide', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Tryness Milazi', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Fred Nthala', '0881774155', NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Efrida Nkilikano', NULL, 'Church of Christ', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Alex Chilolo', NULL, 'CCAP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1);

-- 7. Sheet 5: Door-to-Door Evangelism (5 contacts) - 03/06/2023 12:35 PM
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Wise Lungu', NULL, 'Church of Christ', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Gracethosi', NULL, 'Church of Christ', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Enewood Chinura', NULL, 'Good News', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Maggie Chawa', '0882355898', 'Roman Catholic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Braight Mvula', NULL, 'Seventhday', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1);

-- 8. Sheet 6: Door-to-Door Evangelism (7 contacts) - 03/06/2023 11:00 AM
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Charity Msowoya', NULL, 'CCAP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Shildah Mtonga', '0996913103', 'Divine', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'John Phiri', NULL, 'Manuel', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade (Home side Chawinga)', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Shadrech Mtsheika', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Menson Nkhoma', '0881653720', 'Lutheran', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Edward Mhango', '0884616248', 'New Apostolic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Tungi nass Msiska', NULL, 'Baptist', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, 'Crusade', 'pending', 1);

-- 9. Sheet 7: New Converts Register (21 converts) - 02/06/2023 Evening Service
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Lughano Mkonongo', '0999200925', 'Assemblies', '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Emmily Phiri', '0998822167', 'Assemblies', '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Israel Phiri', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Ireen Nyasulu', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Dorine Mfune', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Issabella Mhango', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Anastazia Mpesa', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Kisito Phiri', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Cecilia Banda', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Veronica Chavula', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Welings Chavula', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Edwin Chilolo', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Alinaphy Sikwese', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Wondwani Bota', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Yasimin Sitambuli', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Khritse Ngulube', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Vayliet Mwenepumbo', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Lusako Kayange', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Coveness Mumba', NULL, NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Chifundo Mukolongo', '0992024192', NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Peter Mkandawire', '0992024192', NULL, '2023-06-02', 'Evening Service', 'Kawonga', 'Emukweni Crusade', 'pending', 1);

-- 10. Sheet 8: Door-to-Door Evangelism (22 contacts) - 03/06/2023 1:00 PM
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_notes, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Fume Mvula', '0987612889', 'Roman Catholic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Tiwonge Phiri', NULL, 'CCAP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Lucy Mhango', NULL, 'Roman Catholic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Malita Lusani', NULL, 'Joy Assembly', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Zime Laurence', NULL, 'Holy Palace Church', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Famwell Nyirenda', NULL, 'New Apostolic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Aginess Muzumala', '0883632410', NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mr Chawa', '0881182192', 'Emmanuel Church', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Yamikani Khumbo', NULL, 'Emmanuel Church', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Gershom Tembwe Mhango', NULL, 'CCAP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'James Davie', NULL, 'Seventh Day', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mrs Nyakanyaso', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mrs Manda', '0987612666', 'African', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Julient Kanyika', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Bertha Chirwa', '09963541185', 'New Apostolic', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mery Mithi', NULL, 'Emmanuel Church', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mrs Twela', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Tsiesivyo', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mrs Nachitsale', '0985302731', 'Seventh Day', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Mrs Kachigwe', NULL, 'CCAP', '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Elisha', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'emukweni-2023'), 'Sislia', NULL, NULL, '2023-06-03', 'Door to Door Evangelism (Emukweni)', NULL, '31 people Crusade', 'pending', 1);
