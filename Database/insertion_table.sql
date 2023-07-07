--owner insertion:
--(Nafis Ahmed)
insert into owner values('Owner_01','Nafis Ahmed','smnafisofficial@gmail.com');
insert into owner values('Owner_02','Nafees Kaiser','oyonafees2001@gmail.com');
insert into owner values('Owner_03','Shahabuddin Akhon','shavoddin54@gmail.com');
insert into owner values('Owner_04','Tahsina Rahman','mayome0703@yahoo.com');
insert into owner values('Owner_05','Rafsan Jain','rafsanprove@gmail.com');

--supplier insertion
--(SK Provee)
INSERT INTO Supplier VALUES('Supplier_001', 'Ahamed Abdullah', 'abdullah@gmail.com', addr('12', 'Mirpur', '21/C', 'Dhaka'));
INSERT INTO Supplier VALUES('Supplier_002', 'Abrar Mahir Esam', 'abrar4k@gmail.com', addr('11', 'Ramnar', '19/A', 'Dhaka'));
INSERT INTO Supplier VALUES('Supplier_003', 'Sabbir Mushfique', 'drug@yahoo.com', addr('08', 'Uttara', '56/B', 'Dhaka'));
INSERT INTO Supplier VALUES('Supplier_004', 'Mazuun Khan', 'marijuana@yahoo.com', addr('07', 'Savar', '41/M', 'Dhaka'));
INSERT INTO Supplier VALUES('Supplier_005', 'Jawadur Rahman', 'civitdrug@gmail.com', addr('21', 'Dhanmondi', '33/E', 'Dhaka'));

--product insertion
--(SK Provee)
INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Product_001', 'Flexi', 'Medicine', 50.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Product_002', 'Adovas', 'Medicine', 80.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Product_003', 'Napa', 'Medicine', 10.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Product_004', 'Diaper', 'Childcare', 330.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Product_005', 'Chocolate', 'Food', 120.00);

--bill insertion
--(SK Provee)
INSERT INTO BILL VALUES('Bill_001',900.00,0);
INSERT INTO BILL VALUES('Bill_002',500.00,0);
INSERT INTO BILL VALUES('Bill_003',400.00,0);
INSERT INTO BILL VALUES('Bill_004',600.00,1);
INSERT INTO BILL VALUES('Bill_005',800.00,1);

--schedule insertion
--(Tahsina Rahman)
insert into Schedule values('Schedule_001',to_date('10:00:00', 'HH24:MI:SS'), to_date('12:00:00', 'HH24:MI:SS'), 'Morning Shift');
insert into Schedule values('Schedule_002',to_date('16:00:00', 'HH24:MI:SS'), to_date('18:00:00', 'HH24:MI:SS'), 'Afternoon Shift');
insert into Schedule values('Schedule_003',to_date('18:00:00', 'HH24:MI:SS'), to_date('20:00:00', 'HH24:MI:SS'), 'Evening Shift');
insert into Schedule values('Schedule_004',to_date('21:00:00', 'HH24:MI:SS'), to_date('23:00:00', 'HH24:MI:SS'), 'Night Shift');

--doctor insertion:
--(Nafees Kaiser)
insert into doctor values('Doctor_001','Akhon','akhon@gmail.com',addr('15','Banasri','13/F','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doctor_002','Nafis','nafis@gmail.com',addr('16','Mirpur','10','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doctor_003','Mayome','mayome@gmail.com',addr('17','Mirpur','12','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doctor_004','Rafsan','rahsan@gmail.com',addr('18','Mirpur','02','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doctor_005','Nizam','nizam221@gmail.com',addr('12','Banani','05','Dhaka'),'MBBS','Apollo');

--has insertion
--(Tahsina Rahman)
insert into Has values('Has_001','Wednesday','Doctor_001','Schedule_001');
insert into Has values('Has_002','Thursday','Doctor_002','Schedule_004');
insert into Has values('Has_003','Monday','Doctor_003','Schedule_003');
insert into Has values('Has_004','Sunday','Doctor_004','Schedule_001');

--order_history insertion
--(Nafis Ahmed)
INSERT INTO Order_History (order_id, order_date, quantity, Product_ID, Bill_ID)
VALUES ('Order_001',to_date('05/06/2023','dd/mm/yyyy'), 10, 'Product_001', 'Bill_001');
INSERT INTO Order_History (order_id, order_date, quantity, Product_ID, Bill_ID)
VALUES ('Order_002',to_date('04/06/2023','dd/mm/yyyy'), 2, 'Product_002', 'Bill_002');
INSERT INTO Order_History (order_id, order_date, quantity, Product_ID, Bill_ID)
VALUES ('Order_003',to_date('05/04/2023','dd/mm/yyyy'), 7, 'Product_001', 'Bill_005');
INSERT INTO Order_History (order_id, order_date, quantity, Product_ID, Bill_ID)
VALUES ('Order_004',to_date('01/01/2023','dd/mm/yyyy'), 3, 'Product_003', 'Bill_003');
INSERT INTO Order_History (order_id, order_date, quantity, Product_ID, Bill_ID)
VALUES ('Order_005',to_date('12/12/2022','dd/mm/yyyy'), 1, 'Product_005', 'Bill_004');

--pharmacy insertion
--(Nafis Ahmed)
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID, order_id)
VALUES ('Pharmacy_001', 'Mayer Dua Pharmacy', 'mayerdua@gmail.com', addr('01','Mirpur','19/A','Dhaka'), '5', 'Owner_01', 'Doctor_001', 'Order_001');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID, order_id)
VALUES ('Pharmacy_002', 'Lazpharma', 'lazpharma@gmail.com', addr('10','Mirpur','12/P','Dhaka'), '5', 'Owner_02', 'Doctor_002', 'Order_002');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID, order_id)
VALUES ('Pharmacy_003', 'Tamanna Pharmacy', 'tamanna71@gmail.com', addr('04','Dhanmondi','13/F','Dhaka'), '4', 'Owner_03', 'Doctor_003', 'Order_003');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID, order_id)
VALUES ('Pharmacy_004', 'Mayome Pharmacy', 'mayome@yahoo.com', addr('03','Shantinagar','11/E','Dhaka'), '5', 'Owner_04', 'Doctor_004', 'Order_004');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID, order_id)
VALUES ('Pharmacy_005', 'Allah-r Daan Pharmacy', 'allahrdaan@gmail.com', addr('23','Uttara','10/K','Dhaka'), '3', 'Owner_05', 'Doctor_005', 'Order_005');

--patient insertion
--(Tahsina Rahman)
insert into Patient values('Patient_001','Provee','pro56@gmail.com',addr('10','Dhaka','1203','Dhaka'),to_date('23/12/1992','DD/MM/YYYY'),'Order_003');
insert into Patient values('Patient_002','Kaiser','kaiser@gmail.com',addr('12','Dhaka','13/A','Dhaka'),to_date('07/06/2000','DD/MM/YYYY'),'Order_001');
insert into Patient values('Patient_003','Hridoy','hridoy123@gmail.com',addr('14','Dhaka','32/C','Dhaka'),to_date('27/09/1995','DD/MM/YYYY'),'Order_002');
insert into Patient values('Patient_004','Tahsin','tahsin47@gmail.com',addr('8','Dhaka','16','Dhaka'),to_date('16/08/1989','DD/MM/YYYY'),'Order_005');
insert into Patient values('Patient_005','Mayo','mayo1122@gmail.com',addr('17','Dhaka','115','Dhaka'),to_date('07/03/2001','DD/MM/YYYY'),'Order_004');

--employye insertion
--(Nafees Kaiser)
INSERT INTO EMPLOYEE VALUES('Employee_001','John Doe','johndoe@gmail.com',addr('05','Mirpur','01','Dhaka'),to_date('01/01/1990','dd/mm/yyyy'),20000,'Pharmacy_001');
INSERT INTO EMPLOYEE VALUES('Employee_002','Kevin Smith','kevinsmith@gmail.com',addr('20','Uttara','02','Dhaka'),to_date('02/05/1990','dd/mm/yyyy'),20000,'Pharmacy_001');
INSERT INTO EMPLOYEE VALUES('Employee_003','Taposh Ghosh','taposh@gmail.com',addr('25','Mirpur','01','Dhaka'),to_date('05/01/1990','dd/mm/yyyy'),10000,'Pharmacy_002');
INSERT INTO EMPLOYEE VALUES('Employee_004','Nazrul Islam','nazrul@gmail.com',addr('45','Shamoli','22','Dhaka'),to_date('02/11/1992','dd/mm/yyyy'),15000,'Pharmacy_003');
INSERT INTO EMPLOYEE VALUES('Employee_005','Abadur Rahman','adadure@gmail.com',addr('15','Mohammadpur','09','Dhaka'),to_date('01/09/1980','dd/mm/yyyy'),20000,'Pharmacy_001');

--consults insertion
--(Nafees Kaiser)
INSERT INTO CONSULTS VALUES('Consults_001','Patient_001','Doctor_001');
INSERT INTO CONSULTS VALUES('Consults_002','Patient_002','Doctor_001');
INSERT INTO CONSULTS VALUES('Consults_003','Patient_003','Doctor_002');
INSERT INTO CONSULTS VALUES('Consults_004','Patient_004','Doctor_004');
INSERT INTO CONSULTS VALUES('Consults_005','Patient_005','Doctor_003');

--give insertion
--(Shahabuddin Akhon)
insert into Give values('Give_001','Patient_001','Pharmacy_001',TO_DATE('01/01/2021','dd/mm/yyyy'),'Medication experts dispensing health and care, promoting safe drug use and better well-being for all','4');
insert into Give values('Give_002','Patient_002','Pharmacy_005',TO_DATE('07/05/2023','dd/mm/yyyy'),'','3');
insert into Give values('Give_003','Patient_003','Pharmacy_004',TO_DATE('12/04/2023','dd/mm/yyyy'),'Dispensing health, empowering wellness.','2');
insert into Give values('Give_004','Patient_004','Pharmacy_002',TO_DATE('24/02/2022','dd/mm/yyyy'),'Medicine haven, fostering wellness.','4');
insert into Give values('Give_005','Patient_005','Pharmacy_003',TO_DATE('30/09/2022','dd/mm/yyyy'),'Caring for health, one prescription at a time.','5');

--stores insertion
--(Shahabuddin Akhon)
insert into stores values('Stores_001','Product_002','Pharmacy_003',TO_DATE('30/09/2022','dd/mm/yyyy'),TO_DATE('30/09/2024','dd/mm/yyyy'));
insert into stores values('Stores_002','Product_005','Pharmacy_003',TO_DATE('01/12/2021','dd/mm/yyyy'),TO_DATE('04/10/2023','dd/mm/yyyy'));
insert into stores values('Stores_003','Product_002','Pharmacy_004',TO_DATE('02/02/2022','dd/mm/yyyy'),TO_DATE('01/01/2023','dd/mm/yyyy'));
insert into stores values('Stores_004','Product_003','Pharmacy_001',TO_DATE('27/02/2023','dd/mm/yyyy'),TO_DATE('12/03/2024','dd/mm/yyyy'));
insert into stores values('Stores_005','Product_001','Pharmacy_002',TO_DATE('02/09/2022','dd/mm/yyyy'),TO_DATE('23/02/2023','dd/mm/yyyy'));
insert into stores values('Stores_006','Product_005','Pharmacy_003',TO_DATE('30/01/2022','dd/mm/yyyy'),TO_DATE('20/09/2023','dd/mm/yyyy'));
insert into stores values('Stores_007','Product_004','Pharmacy_001',TO_DATE('20/12/2022','dd/mm/yyyy'),TO_DATE('30/09/2024','dd/mm/yyyy'));
insert into stores values('Stores_008','Product_004','Pharmacy_003',TO_DATE('10/11/2022','dd/mm/yyyy'),TO_DATE('10/11/2024','dd/mm/yyyy'));
insert into stores values('Stores_009','Product_003','Pharmacy_003',TO_DATE('11/04/2022','dd/mm/yyyy'),TO_DATE('28/02/2023','dd/mm/yyyy'));
insert into stores values('Stores_010','Product_001','Pharmacy_005',TO_DATE('24/02/2022','dd/mm/yyyy'),TO_DATE('12/12/2024','dd/mm/yyyy'));

--supply insertion
--(Shahabuddin Akhon)
insert into Supply values('Supply_001',TO_DATE('21/02/2023','dd/mm/yyyy'),5,'Supplier_002','Product_004');
insert into Supply values('Supply_002',TO_DATE('05/10/2022','dd/mm/yyyy'),4,'Supplier_002','Product_002');
insert into Supply values('Supply_003',TO_DATE('12/01/2022','dd/mm/yyyy'),2,'Supplier_005','Product_005');
insert into Supply values('Supply_004',TO_DATE('30/04/2022','dd/mm/yyyy'),1,'Supplier_004','Product_003');
insert into Supply values('Supply_005',TO_DATE('30/09/2022','dd/mm/yyyy'),3,'Supplier_003','Product_001');
insert into Supply values('Supply_006',TO_DATE('10/03/2022','dd/mm/yyyy'),5,'Supplier_002','Product_002');
insert into Supply values('Supply_007',TO_DATE('30/09/2022','dd/mm/yyyy'),3,'Supplier_002','Product_005');
insert into Supply values('Supply_008',TO_DATE('01/01/2023','dd/mm/yyyy'),5,'Supplier_001','Product_004');
insert into Supply values('Supply_009',TO_DATE('28/02/2022','dd/mm/yyyy'),5,'Supplier_004','Product_001');
insert into Supply values('Supply_010',TO_DATE('20/04/2022','dd/mm/yyyy'),2,'Supplier_005','Product_003');




-- select doctor_id,doctor_name,doctor_email,
-- d.doctor_address.road_no as Road_no,
-- d.doctor_address.house_no as House_no,
-- d.doctor_address.city as City,
-- d.doctor_address.district as District,
-- doctor_qualification,doctor_hospital
-- from doctor d;