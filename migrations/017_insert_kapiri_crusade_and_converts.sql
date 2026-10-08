-- Migration 017: Insert Kapiri Mega Salvation Crusade 2023 and 144 converts/participants

-- 1. Create Kapiri Crusade event in crusades table
INSERT OR IGNORE INTO crusades (slug, title, location, date_range, status, description)
VALUES ('kapiri-2023', 'Kapiri Mega Salvation Crusade 2023', 'Kapiri, Malawi', 'Oct 13-14, 2023', 'past', 'Open-air salvation crusade and church leaders seminar in Kapiri.');

-- 2. Insert Attendance Register Entries
INSERT INTO attendance_register (crusade_id, service_date, service_name, ministering_name, attendance_count, authorized_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), '2023-10-13', 'Night Service', 'Papa Kawonga', 700, 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 24, 1);

-- 3. Sheet 1: Kapiri Roster Rows 67-89
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Khirise Musa', NULL, 'Islam', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Teleza Phiri', NULL, 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Hawa Adam', NULL, 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Sekerani Wiliam', '0989611322', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Linda Davide', NULL, 'M.A.G', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Kasim Phiri', '0999113884', 'Anglican', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'AGness Mavuto', NULL, 'Assemblies of God', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Dyton Kampango', '0994759293', 'African', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Oliver Patricle', '0981453546', 'Roman Catholic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Blessing Peleka', '0999786105', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Esau Ichoma', '0999086454', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mphaso Alex', '0991424757', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rodrice Kasalika', '0995050992', 'Roman Catholic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Kelvin Mwale', '0983088123', 'C.F.N', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Goshen Domy', '0992583626', 'Classmatic Church', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Catherine Felex', '0989846628', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Malifa Jonotani', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Tamala Mihali', '0993038742', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Lucia Mayamiko', '0982102121', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mary Majomeka', '0994284295', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mositeni Awum', '0995470228', 'Africa', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Welson Changata', '0991898150', 'Mpinga wa Yesu', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1);

-- 4. Sheet 2: Kapiri Roster Rows 46-67
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Sinoria Besten', '0998702113', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Thomas Frack', '0993467621', 'Holy Cross', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Colings Chiteza', '09808157850', 'Roma', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Benjamin Zakaliya', '0991303595', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Yoheme Chisale', '0993350487', 'African', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mavuto Patric', '0993395531', 'Assemblies of God', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mackfish Phalura', '0990643722', 'Apostolic Faith Mission', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'William Mwambiri', '0998445193', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Chaza Banda', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Chikayiko Benjamine', '088335479', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Chikondi Maziko', '0994697693', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Afraid Matope', '0883381543', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Bley Afraid Matope', '0883381543', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Evas Binda', '0993288112', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Damial Sosola', NULL, 'New Hope', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Philip Donekis', NULL, 'Roma Catholic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Ellem Longwe', NULL, 'Asset M.A.G', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Chione Thomasi', NULL, 'Roma', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Joice Chisale', NULL, 'Appostolic Faith', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Fannie Makesiwelu', NULL, 'Angrican', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Menelly Mekelan', '0980932229', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Brian Chisamba', '0992078593', 'M.A.G', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1);

-- 5. Sheet 3: Kapiri Roster Rows 90-101
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Vifcines Mvobera', NULL, 'Islam', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rodireck Kasalita', '0995050992', 'Catholic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Jowina Kayani', NULL, 'New Apostolic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Trizer Foster', '0980978870', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Abia Makwinja', NULL, 'M.A.G', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Lozana Nyirongo', '0992741643', 'M.A.G', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Sikauti Nyemba', NULL, 'Spirit Power', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Odala Mekelani', '0994002660', 'Pentecost Holiday', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Relicea Dilimon', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Dorofe Sankhani', '0988231542', 'Last', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mercy Menad', NULL, 'African', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mussa Amidu', NULL, 'Muslim', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1);

-- 6. Sheet 4: Kapiri Roster Rows 102-110
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Agness Banda', NULL, 'Assemblies of God', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Akimu Chingwamba', '0997645344', 'S.T.B.C', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Esther Jackson', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Anerit Kalolo', '0986455133', 'New Hope', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Alice Arinuta', NULL, 'J.S.M', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Anness Nchuma', '0983104482', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Lameck Mwangozga', NULL, 'Anglican', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Bituro Luka', NULL, 'Mpingowayesu', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Fatuma Yusufu', NULL, 'Synagogue', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1);

-- 7. Sheet 5: 13-10-2023 Night Service Rows 1-15
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Madalitso Chiyembekezo', '0993048742', 'CCAP', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Dan Sarva', '0988035479', 'Living Water', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mazengera Chitape', '0989054964', 'P.T.C', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Samuel Jenet', NULL, 'Wa Yesu', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rose Nyirongo', NULL, 'Assemblies of God', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mai Planep', NULL, 'Anglican', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Dynoble Samagila', NULL, 'Seventh Day', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Catheline Banda', NULL, 'Assemblies of God', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mrs N''gambi', '0991904467', NULL, '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Kenani Henply', NULL, NULL, '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Kingstone Mavuto', '099191808', 'Love of God', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Edifa Phiri', NULL, NULL, '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mai Lazi Banda', '0993358187', 'Anglican', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Khrilise Banda', NULL, 'New Paper', '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Josephy Steven', NULL, NULL, '2023-10-13', 'Night Service', 'Papa Kawonga', 'pending', 1);

-- 8. Sheet 6: Kapiri Roster Rows 23-45
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Felix Banda', '0992340133', 'Apostolic Faith M.C', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Lyce Banda', '0990706209', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Roseria Nyirongo', '0992741643', 'Assemblies', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Enelesi Kanjira', NULL, 'Roma', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rameck Rupiya', '0998344205', 'Roma', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mai Chiyembekezo', NULL, 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mawusi Yusufu', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Grolia Kalilu', '0996127035', 'Anglican', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Odetar Portiphar', NULL, 'African', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Ndaderanji Banda', NULL, 'Anglican', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Sinalo Mwali', '0999006774', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Lackson Peterson Banda', '0999635619', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Boston Kapungwe', NULL, 'African Int Church', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Titonia Rodrick', '0995050992', 'Catholic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Glory Phalula', '0995018898', 'Roma', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rholide Bisan', '09906632222', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rinly Philimon', '0987069030', 'African Int Church', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Esther Chikumba', NULL, 'Assemblies', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Monicca Lunson', '0986444898', 'Mboni', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Agness Tsifiyano', '0993964503', 'Mboni New Apostolic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Tinly Phiri', '0981882712', 'Assemblies of God', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Lyson Mavuto', '099433034', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1);

-- 9. Sheet 7: Kapiri Roster Rows 1-22
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rodah Shadrick', NULL, 'Assemblies', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rose Khoviwa', '0980911890', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Steve Kalilombe', '0999053995', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Esnat Makwiti', NULL, 'Assemblies', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Happines Sipriyano', NULL, 'New Apostolic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Bread Arnord', NULL, 'Anglican', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Manuel Lufeyo', NULL, 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Juliet Holes', NULL, 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Amos Chiyembekezo', NULL, 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Dorothey Sakhali', NULL, 'Last Church', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Lise Laboti', '0982515372', 'CCAP', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Mwayi Jasi', '0993994286', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rogesi Black', '0990526214', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Josoti Mlembora', '0990003896', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Margerit Chikze', '0991333877', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Enda Kapamba', '0981005118', NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Maria Damiyano', NULL, 'Catholic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Chrispine Luwicy', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Martha', '099461503', 'Holiness', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pelina Samayele', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Ruth Yosefe Kamphala', '0991101594', 'Catholic', '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Edwin K. Masanga', NULL, NULL, '2023-10-13', 'Kapiri Crusade', 'Evangelist Katete', 'pending', 1);

-- 10. Sheet 8: 14-10-2023 Kapiri Crusade Leaders Seminar
INSERT INTO converts (crusade_id, name, phone, church, service_date, service_name, ministering_name, follow_up_status, follow_up_notes, updated_by) VALUES
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pastor J. Katsala', '0999189373', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Apostle H. Chibweza', '0999686579', 'Flaming Shrub', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pastor TK Mlombwa', '0990663828', 'Life Changer', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pastor Macfish Phalura', '0990643722', 'Apostolic Church', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Felix Banda', '0990643722', 'Apostolic Church', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Frank Chirwa', '0992340133', NULL, '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pastor Madalitso', '098931492', 'Youth Chair MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Elder Joseph Luba', '0992478776', NULL, '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pastor Melison Joseph', '0998854052', NULL, '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pastor Austin Phiri', '0997927268', NULL, '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pst George Missi', '098809145', NULL, '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pst Befina Muyaba', '0992971187', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Esinat Sikauti (Elder)', '0980978998', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Christine Kabwila', '0999425357', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Aness Yamikani', '0996361625', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Hope Gilesi', '0981498260', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Eliza Them', '0994999839', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Christina Maganizo', '0980743955', 'New Hope', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Matamando', NULL, 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Rufina Chiture Geisi', '0999368710', NULL, '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Chipiliro Robert', '0991485780', 'MAG', '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1),
((SELECT id FROM crusades WHERE slug = 'kapiri-2023'), 'Pastor H. Chinzama', NULL, NULL, '2023-10-14', 'Leaders Seminar', 'Pst Sheke', 'pending', 'Leaders Seminar Participant', 1);
