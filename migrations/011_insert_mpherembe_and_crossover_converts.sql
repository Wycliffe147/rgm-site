-- Migration 011: Insert Mpherembe converts, Door-to-Door outreach contacts, and Crossover 2023 page 2

-- Attendance Register
INSERT INTO attendance_register (service_date, service_name, ministering_name, attendance_count, authorized_by)
VALUES ('2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 234, 1);

INSERT INTO attendance_register (service_date, service_name, ministering_name, attendance_count, authorized_by)
VALUES ('2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 484, 1);

-- Sheet 1: 2023-12-31 Crossover Service (Page 2)
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
('Chikondi Malonje', NULL, 'Cross Life', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Ireen Chipeta', NULL, 'CCAP', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Kanani', NULL, 'CCAP', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Mephas Mwandira', NULL, NULL, '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Beston Chirwa', '0987603594', 'Assemblies', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Chawanangwa', NULL, 'R.C', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Vitumbiko Phiri', NULL, 'A.F.C', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Salome', NULL, 'Chipangano', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1),
('Malita', NULL, 'A.F.C', '2023-12-31', 'Crossover Service', 'RGM', 'pending', 1);

-- Sheet 2: 2025-10-31 Friday Service (Mpherembe)
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
('Joseph Muula', '0884643305', 'E.C.G', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Alick Munthali', NULL, NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Gift Phiri', '098251767', 'C.C.A.P', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Greshan Kamlenzo', '0792343869', 'Roman C', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Kaswaka Ngwira', '0956399793', 'N.A.C', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Lackson Godwe', NULL, 'Roman C', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Greshan Mseteka', '0992343669', 'Roman C', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Masa Muulla', '0988241681', 'C.S.P', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Witeness Chiumia', '0887471492', 'New Apostolic', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Gomezgani Honde', NULL, NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Tenala Mthali', NULL, NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Kettle Makamu', '0883171029', NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Kwima Honde', NULL, NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Flora Nyirenda', '0884643305', 'New Apostolic', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Madalitso Chaula', '0880605652', 'C.C.A.P', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Marcheal Chaula', '0987551316', 'Chipangano', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Stanley Zgambo', '0982077572', NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Fwasani Gama', NULL, 'C.C.A.P', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Kaluwaka Ngwira', '0986399793', 'New Apostolic', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Delic Manda', '0888630361', 'New Apostolic', '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Matthew Muulla', '0988241581', NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1),
('Alick Mthine', NULL, NULL, '2025-10-31', 'Friday Service - Mpherembe', 'Apst Kawonga', 'pending', 1);

-- Sheet 3: 2025-11-01 Weekend Service (Mpherembe)
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
('Ephan Phiri', '0981746156', 'Cross Adaryas', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Chaney Nthala', '0998487700', 'C.C.A.P', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Patricia Jere', '0991770757', 'C.C.A.P', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Lichiya Mbulo', NULL, 'C.C.A.P', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Thozite Kumwenda', '0998553415', 'Holy Cross', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Watness Honde', '0894182180', 'Holy Cross', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Marck Ng''ombi', '0998429921', 'Roman C', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Steven Malukani', '0981746152', 'S.R.C', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Chancy Zimba', '0994446161', 'Roman C', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Fwasani Gama', NULL, 'C.C.A.P', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Lilian Gochwe', '0894463280', 'C.C.A.P', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Charity Simukonda', '0998870433', 'C.C.A.P', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Christina', NULL, NULL, '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('Mphatso Kumwenda', NULL, 'Last Church', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1),
('John Phiri', '0980304906', 'Roman Catholic', '2025-11-01', 'Weekend Service - Mpherembe', 'Mc Kawonga', 'pending', 1);

-- Sheet 4: Door-to-Door Street Evangelism 1 (Mpherembe)
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, follow_up_notes, updated_by) VALUES
('Ellen Chilongo', '0887551304', 'SDA', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Magret Nguluwe', '0997376374', 'Catholic', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Ireen Thera', '0899735995', 'CCAP', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Vianna Jere', '0988306763', 'CCAP', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Selina Nguluwe', '0885109570', 'Lutheran', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Masando Jere', '0888510952', 'Lutheran', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Nyamwila S', NULL, 'Catholic', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Dorothy Kumwenda', NULL, NULL, '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Winnie Nankakat', '0882111828', 'Assemblies', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Sibongile Kalanga', '0883229138', 'CCAP', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1),
('Wina', NULL, 'CCAP', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Majority said they have received Christ several times', 1);

-- Sheet 5: Door-to-Door Street Evangelism 2 (Mpherembe)
INSERT INTO converts (name, phone, church, service_date, service_name, ministering_name, follow_up_status, follow_up_notes, updated_by) VALUES
('Yalida Christopher', '0983935009', 'New Apostolic', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Fear of unknown amongst majority', 1),
('Malia Sichali', '0883110224', 'Church of Christ', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Fear of unknown amongst majority', 1),
('Calorini Msowoya', '0984456703', 'CCAP', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Fear of unknown amongst majority', 1),
('Tizie Mvula', '0885249516', 'African', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Fear of unknown amongst majority', 1),
('Irine Chilongo', '0992585176', 'CCAP', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Fear of unknown amongst majority', 1),
('Elizah Phiri', '0995100405', 'Assemblies', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Fear of unknown amongst majority', 1),
('Ruth John', '0983358337', 'Living Waters', '2025-11-01', 'Door-to-Door Evangelism', 'Mpherembe Team', 'pending', 'Door-to-Door Visit — Fear of unknown amongst majority', 1);
