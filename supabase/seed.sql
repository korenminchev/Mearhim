insert into listings (id, name, phone, city, capacity, description, active, pinned)
values 
(0, 'Chris', '0548329553', 'Tel Aviv', 5, 'A lovely place in Tel Aviv', True, False),
(1, 'Chris', '0548329553', 'Tel Aviv', 5, 'A lovely place in Tel Aviv', True, False),
(2, 'Alex', '0548501795', 'Rishon', 7, 'A lovely place in Rishon', True, False),
(3, 'Sam', '0543933914', 'Jerusalem', 7, 'A lovely place in Jerusalem', True, False),
(4, 'Koren', '0544140729', 'Beersheba', 2, 'A lovely place in Beersheba', True, False),
(5, 'Jamie', '0546526978', 'Jerusalem', 3, 'A lovely place in Jerusalem', False, False),
(6, 'Koren', '0548329553', 'Beersheba', 10, 'A lovely place in Beersheba', True, False),
(7, 'Casey', '0549786029', 'Holon', 7, 'A lovely place in Holon', False, False),
(8, 'Morgan', '0548923903', 'Netanya', 3, 'A lovely place in Netanya', False, False),
(9, 'Taylor', '0545620236', 'Holon', 1, 'A lovely place in Holon', False, False),
(10, 'Alex', '0544846531', 'Jerusalem', 5, 'A lovely place in Jerusalem', False, False),
(11, 'Taylor', '0548737345', 'Tel Aviv', 2, 'A lovely place in Tel Aviv', False, False),
(12, 'Taylor', '0543298251', 'Haifa', 8, 'A lovely place in Haifa', True, True),
(13, 'Casey', '0548947868', 'Haifa', 10, 'A lovely place in Haifa', False, False),
(14, 'Sam', '0545666877', 'Haifa', 10, 'A lovely place in Haifa', False, False),
(15, 'Jessie', '0548365768', 'Eilat', 2, 'A lovely place in Eilat', True, False),
(16, 'Alex', '0549384776', 'Haifa', 1, 'A lovely place in Haifa', False, False),
(17, 'Morgan', '0543871205', 'Rishon', 8, 'A lovely place in Rishon', False, False),
(18, 'Chris', '0543637952', 'Eilat', 10, 'A lovely place in Eilat', True, False),
(19, 'Jessie', '0549648366', 'Nahariya', 7, 'A lovely place in Nahariya', False, False),
(20, 'Jamie', '0541570845', 'Ashdod', 4, 'A lovely place in Ashdod', False, False);

SELECT setval('listings_id_seq'::regclass, (SELECT MAX(id) FROM listings)+1);
