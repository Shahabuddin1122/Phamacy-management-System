ALTER TABLE login
MODIFY (password varchar2(10) NOT NULL);
ALTER TABLE login
ADD user_type varchar2(30);

ALTER TABLE Owner
MODIFY (Owner_email varchar2(100) NOT NULL);
ALTER TABLE Owner
ADD CONSTRAINT unique_Owner_email UNIQUE (Owner_email);

ALTER TABLE Supplier
MODIFY (Supplier_email varchar2(100) NOT NULL);
ALTER TABLE Supplier
ADD CONSTRAINT unique_Supplier_email UNIQUE (Supplier_email);

ALTER TABLE Product
MODIFY (Product_type DEFAULT 'Medicine');
ALTER TABLE Product
MODIFY (Product_name varchar2(50) NOT NULL);
alter table product
add Product_quantity number(10);
ALTER TABLE product
DROP COLUMN Product_quantity;

ALTER TABLE Bill
MODIFY (Bill_Status DEFAULT 0);

ALTER TABLE Doctor
MODIFY (Doctor_email varchar2(100) NOT NULL);
ALTER TABLE Doctor
ADD CONSTRAINT unique_Doctor_email UNIQUE (Doctor_email);
ALTER TABLE Doctor
ADD specialization varchar2(50);

ALTER TABLE Pharmacy
MODIFY (Pharmacy_email varchar2(100) NOT NULL);
ALTER TABLE Pharmacy
MODIFY (Pharmacy_name varchar2(50) NOT NULL);
ALTER TABLE Pharmacy
ADD CONSTRAINT unique_Pharmacy_email UNIQUE (Pharmacy_email);

ALTER TABLE Patient
MODIFY (Patient_email varchar2(100) NOT NULL);
ALTER TABLE Patient
ADD CONSTRAINT unique_Patient_email UNIQUE (Patient_email);

ALTER TABLE Employee
MODIFY (Employee_salary DEFAULT 5000.00);
ALTER TABLE Employee
MODIFY (Employee_email varchar2(100) NOT NULL);
ALTER TABLE Employee
ADD CONSTRAINT unique_Employee_email UNIQUE (Employee_email);

ALTER TABLE Phone
MODIFY (user_id varchar2(20) NOT NULL);

ALTER TABLE stores
ADD store_quantity number;