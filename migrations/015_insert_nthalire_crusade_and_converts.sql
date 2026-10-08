-- Migration 015: Insert Nthalire Mega Salvation Crusade 2022 and 96 converts

-- 1. Create Nthalire Crusade event in crusades table
INSERT OR IGNORE INTO crusades (slug, title, location, date_range, status, description)
VALUES ('nthalire-2022', 'Nthalire Mega Salvation Crusade 2022', 'Nthalire, Chitipa, Malawi', 'Oct 7-9, 2022', 'past', 'Three days of open-air gospel outreach in Nthalire, Chitipa, followed up by local partner churches.');

-- 2. Insert Attendance Register Entry
INSERT INTO attendance_register (crusade_id, service_date, service_name, ministering_name, attendance_count, authorized_by)
VALUES ((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 200, 1);

-- 3. Sheet 1: 07-10-2022 Friday Night Service
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mastano Kanyimbu', '0884012983', 'CCAP', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Ronda Gauzi', NULL, NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Fynala Mshomsho', '0880054503', 'Assemblies of God', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Kaonga Phiri', '088982255', 'P.H.A', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Joel Kaonga', '0883788112', 'African', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'James Kaonga', '0880058398', 'CCAP', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Suleni M''yawa', '0882335128', 'Jordan', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tiwonge Mhango', NULL, 'CCAP', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Kissity Nyirongo', NULL, 'CCAP', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mark Kayira', '0889420939', 'African', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Winangos Mbale', '088650115', 'Seventh Day', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Sulen M''yawa', '0882335128', 'Jordan', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Patricia Choni', '0882520899', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Wezzie Mughogho', '0883293660', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mphatso Kawonga', NULL, 'Holy Cross', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Frolence Sichinga', '0887785210', 'P.H.A', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tiwonge Ng''ambi', '0881282554', 'African', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tundulechi Simwaka', NULL, 'CCAP', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Frank Kalulu', NULL, 'Seventh Day', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Taonga Simwaka', NULL, 'R.C', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Dola Chirwa', NULL, 'Seventh Day', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Bolani Mwandila', NULL, 'Church of Christ', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1);

-- 4. Sheet 2: 07-10-2022 Nthalire Converts
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mercy Ng''ambi', '0883069387', 'African', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Chisomo Nyirongo', NULL, 'African', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Blessings Kawonga', NULL, 'African', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Esther Mwandila', '0880758117', 'R.C', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Moffat Kawonga', NULL, 'CCAP', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Andulu Kawonga', NULL, 'R.C', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mosten Munyenyembe', '0999456415', NULL, '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mayeso Kawonga', NULL, 'African', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Junior Kawonga', NULL, NULL, '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Steve Kawonga', NULL, NULL, '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Maneno Msukwa', NULL, 'Pentecost', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Vin Phiri', '0883907079', NULL, '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Shelie Msango', '0885138245', 'CCAP', '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Blessings Kayila', '0882736202', NULL, '2022-10-07', 'Salvation Crusade', 'Evangelist Katete', 'pending', 1);

-- 5. Sheet 3: 07-10-2022 Friday Night Service Roster 2
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Clement Munyenyembe', '0884387915', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Madalitso', '0884899076', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Eliow Chilenga', '0889854621', 'CCAP', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Kelvin Kaonga', '08862277', 'African', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tawonga Kayila', NULL, NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mr Munyenyembe', '0999456415', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mathews Mlambo', '099967975', 'PHA', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Enoch Chilenga', '0888562439', 'African', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Lawrence Kaonga', '0880042238', 'Roman Catholic', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Junior Letison', '0887501435', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mercy Kalua', '0885297435', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Wongani Kelvin', '0883069407', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Vitumbiko Donald', '0997675782', 'Roman Catholic', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Happy Mtambo', '0884029066', 'African', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Sarai Msisya', '088612842', NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Fumbanani Kawonga', '0881877486', 'Assemblies of God', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'V.H Wchiy - Robert Kaonga', '0880094698', 'African Church', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Wezzi Mughogho', '0883293660', 'Baptist', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tazirwa Kawonga', '0886526898', 'A.S', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Joyce Chunda', NULL, 'African Church', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Jack Kawonga', NULL, NULL, '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Haward Kawonga', NULL, 'Catholic', '2022-10-07', 'Friday Night Service', 'Evangelist Katete', 'pending', 1);

-- 6. Sheet 4: 08-10-2022 Saturday Service Page 1
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Timale Mtambo', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Rhoda Labi', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mebu Mtambo', NULL, 'Chipangano', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Idah Chunga', NULL, 'AIC', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Romas Kaonga', NULL, 'Assemblies of God', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Aginess Mtambo', NULL, 'African', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Distance Srliwonde', NULL, 'CCAP', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Florence Sichinga', NULL, 'Pentecost', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Sewelani Msiska', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Princess Ng''ambi', '0881392692', 'Assemblies of God', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tiwonge Muhango', NULL, 'CCAP', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Gift Msiska', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mercy Kumwenda', NULL, 'CCAP', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Olive Nyirongo', '0883134475', 'CCAP', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Anita Chavula', '0887058516', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Dosha Msango', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Makhumbo Kawonga', '0888283535', 'AF', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Benaideter Mughogho', NULL, 'Roman Catholic', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Gome Mughogho', '0881123702', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tiyowochi Ngulube', '0880092926', 'African', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Victoria Mthali', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Kelifa Kawonga', '0881441408', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Bittons Simwinga', '0888014277', 'CCAP', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Upendo Mzumala', '0883069721', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Evern Chilembo', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Tamika Siwale', NULL, 'African', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Liny Mkandawire', '0889854069', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Linda Kaluwa', NULL, 'African', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Mphatso Kawonga', '0880113081', 'Heaven Embassy', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 1);

-- 7. Sheet 5: 08-10-2022 Saturday Service Page 2
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, follow_up_notes, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Froless Sichinga', NULL, 'Pentecost Church', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Ivy Mkandawire', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Olisa Mbale', '0883602144', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Queen Ngambi', NULL, NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'John Mwale', '0999421139', 'CCAP', '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Kumbukani Kaluwa', '0882285003', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Lishita Mwandira', '09984125752', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1),
((SELECT id FROM crusades WHERE slug = 'nthalire-2022'), 'Matrida Nyondo', '0882810811', NULL, '2022-10-08', 'Saturday Service', 'Evangelist Katete', 'pending', 'Local AG Contact: Pastor Phiri (0881645598 / 0998403665)', 1);
