--Owner
insert into owner values('Owner_01','Nafis Ahmed','smnafisofficial@gmail.com');
insert into owner values('Owner_02','Nafees Kaiser','oyonafees2001@gmail.com');
insert into owner values('Owner_03','Shahabuddin Akhon','shavoddin54@gmail.com');
insert into owner values('Owner_04','Tahsina Rahman','mayome0703@yahoo.com');
insert into owner values('Owner_05','Rafsan Jain','rafsanprove@gmail.com');
--supplier
INSERT INTO Supplier VALUES('Sup_00001', 'Ahamed Abdullah', 'abdullah@gmail.com', addr('12', 'Mirpur', '21/C', 'Dhaka'));
INSERT INTO Supplier VALUES('Sup_00002', 'Abrar Mahir Esam', 'abrar4k@gmail.com', addr('11', 'Ramnar', '19/A', 'Dhaka'));
INSERT INTO Supplier VALUES('Sup_00003', 'Sabbir Mushfique', 'drug@yahoo.com', addr('08', 'Uttara', '56/B', 'Dhaka'));
INSERT INTO Supplier VALUES('Sup_00004', 'Mazuun Khan', 'marijuana@yahoo.com', addr('07', 'Savar', '41/M', 'Dhaka'));
INSERT INTO Supplier VALUES('Sup_00005', 'Jawadur Rahman', 'civitdrug@gmail.com', addr('21', 'Dhanmondi', '33/E', 'Dhaka'));
--product
INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Pro_00001', 'Flexi', 'Medicine', 50.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Pro_00002', 'Adovas', 'Medicine', 80.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Pro_00003', 'Napa', 'Medicine', 10.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Pro_00004', 'Diaper', 'Childcare', 330.00);

INSERT INTO Product (Product_ID, Product_name, Product_type, Product_price)
VALUES ('Pro_00005', 'Chocolate', 'Food', 120.00);
--bill
INSERT INTO BILL VALUES('Bil_00001',900.00,0);
INSERT INTO BILL VALUES('Bil_00002',500.00,0);
INSERT INTO BILL VALUES('Bil_00003',400.00,0);
INSERT INTO BILL VALUES('Bil_00004',600.00,1);
INSERT INTO BILL VALUES('Bil_00005',800.00,1);
--schedule
insert into Schedule values('Sch_00001',to_date('10:00:00', 'HH24:MI:SS'), to_date('12:00:00', 'HH24:MI:SS'), 'Morning Shift');
insert into Schedule values('Sch_00002',to_date('16:00:00', 'HH24:MI:SS'), to_date('18:00:00', 'HH24:MI:SS'), 'Afternoon Shift');
insert into Schedule values('Sch_00003',to_date('18:00:00', 'HH24:MI:SS'), to_date('20:00:00', 'HH24:MI:SS'), 'Evening Shift');
insert into Schedule values('Sch_00004',to_date('21:00:00', 'HH24:MI:SS'), to_date('23:00:00', 'HH24:MI:SS'), 'Night Shift');
--doctor
insert into doctor values('Doc_00001','Akhon','akhon@gmail.com',addr('15','Banasri','13/F','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doc_00002','Nafis','nafis@gmail.com',addr('16','Mirpur','10','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doc_00003','Mayome','mayome@gmail.com',addr('17','Mirpur','12','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doc_00004','Rafsan','rahsan@gmail.com',addr('18','Mirpur','02','Dhaka'),'MBBS','Apollo');
insert into doctor values('Doc_00005','Nizam','nizam221@gmail.com',addr('12','Banani','05','Dhaka'),'MBBS','Apollo');
--Has
insert into Has values('Has_00001','Wednesday','Doc_00001','Sch_00001');
insert into Has values('Has_00002','Thursday','Doc_00002','Sch_00004');
insert into Has values('Has_00003','Monday','Doc_00003','Sch_00003');
insert into Has values('Has_00004','Sunday','Doc_00004','Sch_00001');
--pharmacy
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID)
VALUES ('Pha_00001', 'Mayer Dua Pharmacy', 'mayerdua@gmail.com', addr('01','Mirpur','19/A','Dhaka'), '5', 'Owner_01', 'Doc_00001');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID)
VALUES ('Pha_00002', 'Lazpharma', 'lazpharma@gmail.com', addr('10','Mirpur','12/P','Dhaka'), '5', 'Owner_02', 'Doc_00002');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID)
VALUES ('Pha_00003', 'Tamanna Pharmacy', 'tamanna71@gmail.com', addr('04','Dhanmondi','13/F','Dhaka'), '4', 'Owner_03', 'Doc_00003');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID)
VALUES ('Pha_00004', 'Mayome Pharmacy', 'mayome@yahoo.com', addr('03','Shantinagar','11/E','Dhaka'), '5', 'Owner_04', 'Doc_00004');
INSERT INTO Pharmacy (Pharmacy_ID, Pharmacy_name, Pharmacy_email, Pharmacy_address, overall_rating, owner_ID, Doctor_ID)
VALUES ('Pha_00005', 'Allah-r Daan Pharmacy', 'allahrdaan@gmail.com', addr('23','Uttara','10/K','Dhaka'), '3', 'Owner_05', 'Doc_00005');
--patient
insert into Patient values('Pat_00001','Provee','pro56@gmail.com',addr('10','Dhaka','1203','Dhaka'),to_date('23/12/1992','DD/MM/YYYY'));
insert into Patient values('Pat_00002','Kaiser','kaiser@gmail.com',addr('12','Dhaka','13/A','Dhaka'),to_date('07/06/2000','DD/MM/YYYY'));
insert into Patient values('Pat_00003','Hridoy','hridoy123@gmail.com',addr('14','Dhaka','32/C','Dhaka'),to_date('27/09/1995','DD/MM/YYYY'));
insert into Patient values('Pat_00004','Tahsin','tahsin47@gmail.com',addr('8','Dhaka','16','Dhaka'),to_date('16/08/1989','DD/MM/YYYY'));
insert into Patient values('Pat_00005','Mayo','mayo1122@gmail.com',addr('17','Dhaka','115','Dhaka'),to_date('07/03/2001','DD/MM/YYYY'));
--employee
INSERT INTO EMPLOYEE VALUES('Emp_00001','John Doe','johndoe@gmail.com',addr('05','Mirpur','01','Dhaka'),to_date('01/01/1990','dd/mm/yyyy'),20000,'Pha_00001','Emp_00002');
INSERT INTO EMPLOYEE VALUES('Emp_00002','Kevin Smith','kevinsmith@gmail.com',addr('20','Uttara','02','Dhaka'),to_date('02/05/1990','dd/mm/yyyy'),20000,'Pha_00001','Emp_00005');
INSERT INTO EMPLOYEE VALUES('Emp_00003','Taposh Ghosh','taposh@gmail.com',addr('25','Mirpur','01','Dhaka'),to_date('05/01/1990','dd/mm/yyyy'),10000,'Pha_00002','');
INSERT INTO EMPLOYEE VALUES('Emp_00004','Nazrul Islam','nazrul@gmail.com',addr('45','Shamoli','22','Dhaka'),to_date('02/11/1992','dd/mm/yyyy'),15000,'Pha_00003','');
INSERT INTO EMPLOYEE VALUES('Emp_00005','Abadur Rahman','adadure@gmail.com',addr('15','Mohammadpur','09','Dhaka'),to_date('01/09/1980','dd/mm/yyyy'),20000,'Pha_00001','');
--consults
INSERT INTO CONSULTS VALUES('Con_00001','Pat_00001','Doc_00001');
INSERT INTO CONSULTS VALUES('Con_00002','Pat_00002','Doc_00001');
INSERT INTO CONSULTS VALUES('Con_00003','Pat_00003','Doc_00002');
INSERT INTO CONSULTS VALUES('Con_00004','Pat_00004','Doc_00004');
INSERT INTO CONSULTS VALUES('Con_00005','Pat_00005','Doc_00003');
--give
insert into Give values('Giv_00001','Pat_00001','Pha_00001',TO_DATE('01/01/2021','dd/mm/yyyy'),'Medication experts dispensing health and care, promoting safe drug use and better well-being for all','4');
insert into Give values('Giv_00002','Pat_00002','Pha_00005',TO_DATE('07/05/2023','dd/mm/yyyy'),'','3');
insert into Give values('Giv_00003','Pat_00003','Pha_00004',TO_DATE('12/04/2023','dd/mm/yyyy'),'Dispensing health, empowering wellness.','2');
insert into Give values('Giv_00004','Pat_00004','Pha_00002',TO_DATE('24/02/2022','dd/mm/yyyy'),'Medicine haven, fostering wellness.','4');
insert into Give values('Giv_00005','Pat_00005','Pha_00003',TO_DATE('30/09/2022','dd/mm/yyyy'),'Caring for health, one prescription at a time.','5');
--supply
insert into Supply values('Supply_00001',TO_DATE('21/02/2023','dd/mm/yyyy'),5,'Sup_00002','Pro_00004');
insert into Supply values('Supply_00002',TO_DATE('05/10/2022','dd/mm/yyyy'),4,'Sup_00002','Pro_00002');
insert into Supply values('Supply_00003',TO_DATE('12/01/2022','dd/mm/yyyy'),2,'Sup_00005','Pro_00005');
insert into Supply values('Supply_00004',TO_DATE('30/04/2022','dd/mm/yyyy'),1,'Sup_00004','Pro_00003');
insert into Supply values('Supply_00005',TO_DATE('30/09/2022','dd/mm/yyyy'),3,'Sup_00003','Pro_00001');
insert into Supply values('Supply_00006',TO_DATE('10/03/2022','dd/mm/yyyy'),5,'Sup_00002','Pro_00002');
insert into Supply values('Supply_00007',TO_DATE('30/09/2022','dd/mm/yyyy'),3,'Sup_00002','Pro_00005');
insert into Supply values('Supply_00008',TO_DATE('01/01/2023','dd/mm/yyyy'),5,'Sup_00001','Pro_00004');
insert into Supply values('Supply_00009',TO_DATE('28/02/2022','dd/mm/yyyy'),5,'Sup_00004','Pro_00001');
insert into Supply values('Supply_00010',TO_DATE('20/04/2022','dd/mm/yyyy'),2,'Sup_00005','Pro_00003');
--stores
insert into stores values('Sto_00001','Pro_00002','Pha_00003',TO_DATE('30/09/2022','dd/mm/yyyy'),TO_DATE('30/09/2024','dd/mm/yyyy'));
insert into stores values('Sto_00002','Pro_00005','Pha_00003',TO_DATE('01/12/2021','dd/mm/yyyy'),TO_DATE('04/10/2023','dd/mm/yyyy'));
insert into stores values('Sto_00003','Pro_00002','Pha_00004',TO_DATE('02/02/2022','dd/mm/yyyy'),TO_DATE('01/01/2023','dd/mm/yyyy'));
insert into stores values('Sto_00004','Pro_00003','Pha_00001',TO_DATE('27/02/2023','dd/mm/yyyy'),TO_DATE('12/03/2024','dd/mm/yyyy'));
insert into stores values('Sto_00005','Pro_00001','Pha_00002',TO_DATE('02/09/2022','dd/mm/yyyy'),TO_DATE('23/02/2023','dd/mm/yyyy'));
insert into stores values('Sto_00006','Pro_00005','Pha_00003',TO_DATE('30/01/2022','dd/mm/yyyy'),TO_DATE('20/09/2023','dd/mm/yyyy'));
insert into stores values('Sto_00009','Pro_00003','Pha_00003',TO_DATE('11/04/2022','dd/mm/yyyy'),TO_DATE('28/02/2023','dd/mm/yyyy'));
insert into stores values('Sto_00010','Pro_00001','Pha_00005',TO_DATE('24/02/2022','dd/mm/yyyy'),TO_DATE('12/12/2024','dd/mm/yyyy'));
--order_history
INSERT INTO Order_History VALUES ('Order_001',to_date('05/06/2023','dd/mm/yyyy'), 10, 'Pro_00001', 'Bil_00001','Pha_00001','Pat_00001');
INSERT INTO Order_History VALUES ('Order_002',to_date('04/06/2023','dd/mm/yyyy'), 2, 'Pro_00002', 'Bil_00002','Pha_00002','Pat_00002');
INSERT INTO Order_History VALUES ('Order_003',to_date('05/04/2023','dd/mm/yyyy'), 7, 'Pro_00001', 'Bil_00005','Pha_00003','Pat_00003');
INSERT INTO Order_History VALUES ('Order_004',to_date('01/01/2023','dd/mm/yyyy'), 3, 'Pro_00003', 'Bil_00003','Pha_00004','Pat_00004');
INSERT INTO Order_History VALUES ('Order_005',to_date('12/12/2022','dd/mm/yyyy'), 1, 'Pro_00005', 'Bil_00004','Pha_00005','Pat_00005');
--phone

insert into phone values ('+8801521713595','Owner_01');
insert into phone values ('+8801521713534','Owner_02');
insert into phone values ('+8801521713123','Owner_03');
insert into phone values ('+8801521713098','Owner_04');
insert into phone values ('+8801521713531','Owner_05');
insert into phone values ('+8801521713534','Doc_00001');
insert into phone values ('+8801789713534','Doc_00002');
insert into phone values ('+8801821713534','Doc_00003');
insert into phone values ('+8801989713534','Doc_00004');
insert into phone values ('+8801821713830','Doc_00005');
insert into phone values ('+8801521713554','Pat_00001');
insert into phone values ('+8801389713534','Pat_00002');
insert into phone values ('+8801521713121','Pat_00003');
insert into phone values ('+8801389713232','Pat_00004');
insert into phone values ('+8801921713554','Pat_00005');
insert into phone values ('+8801521722222','Emp_00001');
insert into phone values ('+8801389711111','Emp_00002');
insert into phone values ('+8801521722122','Emp_00003');
insert into phone values ('+8801389711131','Emp_00004');
insert into phone values ('+8801521722332','Emp_00005');
insert into phone values ('+8801521711234','Pha_00001');
insert into phone values ('+8801389709876','Pha_00002');
insert into phone values ('+8801521716634','Pha_00003');
insert into phone values ('+8801389124576','Pha_00004');
insert into phone values ('+8801521717934','Pha_00005');
insert into phone values ('+8801522442343','Sup_00001');
insert into phone values ('+8801389725876','Sup_00002');
insert into phone values ('+8801343241444','Sup_00003');
insert into phone values ('+8801712479829','Sup_00004');
insert into phone values ('+8801735311234','Sup_00005');