ALTER TABLE login
MODIFY (password varchar2(10) NOT NULL);
ALTER TABLE login
ADD user_type varchar2(30);

ALTER TABLE Owner
MODIFY (Owner_email varchar2(100) NOT NULL);

ALTER TABLE Supplier
MODIFY (Supplier_email varchar2(100) NOT NULL);

ALTER TABLE Product
MODIFY (Product_type DEFAULT 'Medicine');
ALTER TABLE Product
MODIFY (Product_name varchar2(50) NOT NULL);

ALTER TABLE Bill
MODIFY (Bill_Status DEFAULT 0);

ALTER TABLE Doctor
MODIFY (Doctor_email varchar2(100) NOT NULL);

ALTER TABLE Pharmacy
MODIFY (Pharmacy_email varchar2(100) NOT NULL);
ALTER TABLE Pharmacy
MODIFY (Pharmacy_name varchar2(50) NOT NULL);

ALTER TABLE Patient
MODIFY (Patient_email varchar2(100) NOT NULL);

ALTER TABLE Employee
MODIFY (Employee_salary DEFAULT 5000.00);
ALTER TABLE Employee
MODIFY (Employee_email varchar2(100) NOT NULL);

ALTER TABLE Phone
MODIFY (user_id varchar2(20) NOT NULL);

ALTER TABLE Doctor ADD specialization varchar2(50);

ALTER TABLE Consults ADD serial varchar2(50);

