CREATE TYPE addr as OBJECT (
Road_no varchar2(10),
City varchar2(20),
House_no varchar2(10),
District varchar2(20)
);
--age addr select kore execute korish (Allah knows why, amake jigaish na), then baki shob select kore execute korish
create table login(
login_ID varchar2(15)primary key,
password varchar2(10)
);

create table owner(
owner_ID varchar2(15) primary key,
owner_name varchar2(50),
owner_email varchar2(50)
);

insert into owner values('Owner_01','Nafis Ahmed','smnafisofficial@gmail.com');
insert into owner values('Owner_02','Nafees Kaiser','oyonafees2001@gmail.com');
insert into owner values('Owner_03','Shahabuddin Akhon','shavoddin54@gmail.com');
insert into owner values('Owner_04','Tahsina Rahman','mayome0703@yahoo.com');
insert into owner values('Owner_05','Rafsan Jain','rafsanprove@gmail.com');

create table Supplier (
Supplier_ID varchar2(15) primary key,
Supplier_name varchar2(50),
Supplier_email varchar2(20),
Supplier_address addr
);

CREATE TABLE Product (
    Product_ID varchar2(15) PRIMARY KEY,
    Product_name varchar2(50),
    Product_type varchar2(50),
    Product_price number(10, 2)
);

create table Bill (
Bill_ID varchar2(15) primary key,
Bill_Price number(10,2),
Bill_Status number(1)
);

CREATE TABLE Schedule (
  Schedule_ID varchar2(15) primary key,
  Start_time date not null,
  End_time  date not null,
  Shift varchar2(20)
);

create or replace view Schedule_view as
    select Schedule_ID,to_char(start_time,'hh24:mi:ss') "start_time",to_char(end_time,'hh24:mi:ss') "end_time",shift
    from Schedule;

create table Doctor (
Doctor_ID varchar2(15) primary key,
Doctor_name varchar2(50),
Doctor_email varchar2(20),
Doctor_address addr,
Doctor_qualification varchar2(20),
Doctor_hospital varchar2(50)
);

create table has (
has_id varchar2(15),
consult_day date,
doctor_id varchar2(15),
schedule_id varchar(15),
CONSTRAINT fk_schedule_Schedule_ID FOREIGN KEY (Schedule_ID) REFERENCES Schedule(schedule_ID) ON DELETE CASCADE,
CONSTRAINT fk_Doctor_Doctor_ID FOREIGN KEY (doctor_ID) REFERENCES doctor(doctor_ID) ON DELETE CASCADE
);

CREATE TABLE Order_History (
    order_id varchar2(15) primary key,
    order_date date,
    quantity number(10),
    Product_ID varchar2(20),
    Bill_ID varchar2(20),
    CONSTRAINT fk_Product_ID FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    CONSTRAINT fk_Bill_ID FOREIGN KEY (Bill_ID) REFERENCES Bill(Bill_ID) ON DELETE CASCADE
);

CREATE TABLE Pharmacy (
  Pharmacy_ID varchar2(15) PRIMARY KEY,
  Pharmacy_name varchar2(50),
  Pharmacy_email varchar2(20),
  Pharmacy_address addr,
  overall_rating varchar2(10),
  owner_ID varchar2(15),
  Doctor_ID varchar2(15),
  order_id varchar2(20),
  CONSTRAINT fk_owner_ID FOREIGN KEY (owner_ID) REFERENCES Owner(owner_ID) ON DELETE CASCADE,
  CONSTRAINT fk_Doctor_ID FOREIGN KEY (Doctor_ID) REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE,
  CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES Order_History(order_id) ON DELETE CASCADE
);

CREATE TABLE Patient (
  Patient_ID varchar2(15) PRIMARY KEY,
  Patient_name varchar2(50),
  Patient_email varchar2(20),
  Patient_address addr,
  Patient_dob date,
  order_id varchar2(20),
  CONSTRAINT fk_order_history_order_id FOREIGN KEY (order_id) REFERENCES Order_History(order_id) ON DELETE CASCADE
);

create or replace view patient_view as
    select patient_id,patient_name,patient_email,
    p.Patient_address.Road_no as Road_no,
    p.Patient_address.City as City,
    p.patient_address.house_no as House_no,
    p.Patient_address.District as District,
    patient_dob,floor(months_between(sysdate, patient_dob)/12) as patient_age,order_id 
    from patient p natural join order_history;

CREATE TABLE Employee (
  Employee_ID varchar2(15) primary key,
  Employee_name varchar2(50),
  Employee_email varchar2(20),
  Employee_address addr,
  Employee_dob date,
  Employee_salary number(10,2),
  Pharmacy_ID varchar2(15),
  CONSTRAINT fk_Pharmacy_ID FOREIGN KEY (Pharmacy_ID) REFERENCES Pharmacy(Pharmacy_ID) ON DELETE CASCADE
);

create or replace view employee_view as
   select employee_id,employee_name,employee_email,
   e.employee_address.road_no as Road_no,
   e.employee_address.city as City,
   e.employee_address.house_no as House_no,
   e.employee_address.district as District,
   employee_dob,floor(months_between(sysdate, employee_dob)/12) as employee_age,employee_salary,pharmacy_id
   from employee e natural join pharmacy;

CREATE TABLE consults (
  consult_id varchar2(15) primary key,
  patient_id varchar2(15),
  doctor_id varchar2(15),
  CONSTRAINT fk_Consults_Doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_ID) ON DELETE CASCADE,
  CONSTRAINT fk_Consults_Patient FOREIGN KEY (patient_id) REFERENCES patient(patient_ID) ON DELETE CASCADE
);

CREATE TABLE Give (
  give_id varchar2(15) primary key,
  patient_id varchar2(15),
  pharmacy_id varchar2(15),
  give_date date,
  description varchar2(100),
  rating varchar2(10),
  CONSTRAINT fk_give_pharmacy_id FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(pharmacy_ID) ON DELETE CASCADE,
  CONSTRAINT fk_give_Patient_id FOREIGN KEY (patient_id) REFERENCES patient(patient_ID) ON DELETE CASCADE
);

CREATE TABLE Supply (
Supply_ID varchar2(15) primary key,
Supply_date date,
Supply_quantity number(10),
Supplier_ID varchar2(15),
Product_ID varchar2(15),
CONSTRAINT fk_Supply_Supplier_ID FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID) ON DELETE CASCADE,
CONSTRAINT fk_Supply_Product_ID FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

create table Stores (
Store_id varchar2(15) primary key,
product_id varchar2(15),
pharmacy_id varchar2(15),
Manufactured_Date date,
Expired_Date date,
CONSTRAINT fk_pharmacy_pharmacy_id FOREIGN KEY (Pharmacy_id) REFERENCES pharmacy(pharmacy_id) ON DELETE CASCADE,
CONSTRAINT fk_product_product_ID FOREIGN KEY (product_ID) REFERENCES Product(product_ID) ON DELETE CASCADE
);

CREATE TABLE Phone (
  phone_no varchar2(14) PRIMARY KEY,
  user_id varchar2(20),
  CONSTRAINT fk_Phone_Pharmacy FOREIGN KEY (user_id) REFERENCES Pharmacy(Pharmacy_ID) ON DELETE CASCADE,
  CONSTRAINT fk_Phone_Patient FOREIGN KEY (user_id) REFERENCES Patient(Patient_ID) ON DELETE CASCADE,
  CONSTRAINT fk_Phone_Employee FOREIGN KEY (user_id) REFERENCES Employee(Employee_ID) ON DELETE CASCADE,
  CONSTRAINT fk_Phone_Supplier FOREIGN KEY (user_id) REFERENCES Supplier(Supplier_ID) ON DELETE CASCADE,
  CONSTRAINT fk_Phone_Doctor FOREIGN KEY (user_id) REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE
);

