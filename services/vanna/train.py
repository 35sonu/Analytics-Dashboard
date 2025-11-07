"""
Training script for Vanna AI
This script trains the Vanna model on your database schema
"""
import os
from dotenv import load_dotenv
from vanna.groq import Groq
from vanna.vannadb import VannaDB_VectorStore

load_dotenv()

class MyVanna(VannaDB_VectorStore, Groq):
    def __init__(self, config=None):
        VannaDB_VectorStore.__init__(self, config=config)
        Groq.__init__(self, config=config)

def train_vanna():
    vanna_config = {
        'api_key': os.getenv('GROQ_API_KEY'),
        'model': os.getenv('MODEL_NAME', 'mixtral-8x7b-32768'),
    }

    vn = MyVanna(config=vanna_config)
    database_url = os.getenv('DATABASE_URL')
    vn.connect_to_postgres(url=database_url)

    # Train on DDL
    ddl_statements = [
        """
        CREATE TABLE Vendor (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            address TEXT
        );
        """,
        """
        CREATE TABLE Customer (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            address TEXT
        );
        """,
        """
        CREATE TABLE Invoice (
            id TEXT PRIMARY KEY,
            invoiceNumber TEXT UNIQUE NOT NULL,
            vendorId TEXT NOT NULL REFERENCES Vendor(id),
            customerId TEXT REFERENCES Customer(id),
            invoiceDate TIMESTAMP NOT NULL,
            dueDate TIMESTAMP,
            totalAmount FLOAT NOT NULL,
            status TEXT DEFAULT 'pending',
            category TEXT,
            description TEXT
        );
        """,
        """
        CREATE TABLE LineItem (
            id TEXT PRIMARY KEY,
            invoiceId TEXT NOT NULL REFERENCES Invoice(id),
            description TEXT NOT NULL,
            quantity FLOAT NOT NULL,
            unitPrice FLOAT NOT NULL,
            amount FLOAT NOT NULL,
            category TEXT
        );
        """,
        """
        CREATE TABLE Payment (
            id TEXT PRIMARY KEY,
            invoiceId TEXT NOT NULL REFERENCES Invoice(id),
            paymentDate TIMESTAMP NOT NULL,
            amount FLOAT NOT NULL,
            paymentMethod TEXT,
            reference TEXT
        );
        """
    ]

    for ddl in ddl_statements:
        vn.train(ddl=ddl)
        print(f"Trained on DDL: {ddl[:50]}...")

   
    documentation = [
        "The Invoice table contains all invoice records with vendor and customer information.",
        "Total spend can be calculated by summing totalAmount from the Invoice table.",
        "To find top vendors, group by vendorId and sum totalAmount.",
        "Invoice status can be: paid, pending, overdue, or partial.",
        "Line items are individual products or services within an invoice.",
        "Payments track all payments made against invoices.",
        "Categories include: Software, Hardware, Services, Supplies, Utilities, Marketing.",
        "YTD (Year To Date) means from January 1st of the current year until today.",
        "Overdue invoices have dueDate less than current date and status not 'paid'.",
    ]

    for doc in documentation:
        vn.train(documentation=doc)
        print(f"Trained on documentation: {doc}")

    print("\n✅ Training completed successfully!")

if __name__ == "__main__":
    train_vanna()
