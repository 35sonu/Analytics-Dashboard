import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface RealInvoiceData {
  _id: string;
  name: string;
  status: string;
  createdAt: { $date: string };
  extractedData: {
    llmData: {
      invoice?: {
        value: {
          invoiceId?: { value: string };
          invoiceDate?: { value: string };
          deliveryDate?: { value: string };
        };
      };
      vendor?: {
        value: {
          vendorName?: { value: string };
          vendorAddress?: { value: string };
          vendorTaxId?: { value: string };
        };
      };
      customer?: {
        value: {
          customerName?: { value: string };
          customerAddress?: { value: string };
        };
      };
      summary?: {
        value: {
          invoiceTotal?: { value: number };
          subTotal?: { value: number };
          totalTax?: { value: number };
        };
      };
      payment?: {
        value: {
          dueDate?: { value: string };
        };
      };
      lineItems?: Array<{
        value: {
          description?: { value: string };
          quantity?: { value: number };
          unitPrice?: { value: number };
          total?: { value: number };
        };
      }>;
    };
  };
}

async function main() {
  console.log('🌱 Starting database seed...');

  const dataPath = path.join(process.cwd(), '../../data/Analytics_Test_Data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.log('❌ Analytics_Test_Data.json not found!');
    console.log('Using sample data instead...');
    await seedSampleData();
    return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const realData: RealInvoiceData[] = JSON.parse(rawData);
  
  console.log(`📄 Found ${realData.length} invoices in data file`);

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.customer.deleteMany();

  const vendorMap = new Map<string, string>();
  const customerMap = new Map<string, string>();

  let processedCount = 0;

  for (const doc of realData) {
    try {
      const llmData = doc.extractedData?.llmData;
      if (!llmData) continue;

      // Extract vendor
      const vendorName = llmData.vendor?.value?.vendorName?.value || 'Unknown Vendor';
      let vendorId = vendorMap.get(vendorName);
      
      if (!vendorId) {
        const vendor = await prisma.vendor.create({
          data: {
            name: vendorName,
            address: llmData.vendor?.value?.vendorAddress?.value,
            email: null,
            phone: llmData.vendor?.value?.vendorTaxId?.value,
          },
        });
        vendorId = vendor.id;
        if (vendorId) {
          vendorMap.set(vendorName, vendorId);
        }
      }

      // Extract customer
      const customerName = llmData.customer?.value?.customerName?.value;
      let customerId: string | undefined;
      
      if (customerName) {
        customerId = customerMap.get(customerName);
        if (!customerId) {
          const customer = await prisma.customer.create({
            data: {
              name: customerName,
              address: llmData.customer?.value?.customerAddress?.value,
              email: null,
              phone: null,
            },
          });
          customerId = customer.id;
          if (customerId) {
            customerMap.set(customerName, customerId);
          }
        }
      }

      // Extract invoice details
      const invoiceNumber = llmData.invoice?.value?.invoiceId?.value || doc._id.substring(0, 8);
      const invoiceDate = llmData.invoice?.value?.invoiceDate?.value 
        ? new Date(llmData.invoice.value.invoiceDate.value)
        : new Date(doc.createdAt.$date);
      const dueDate = llmData.payment?.value?.dueDate?.value
        ? new Date(llmData.payment.value.dueDate.value)
        : null;
      const totalAmount = Math.abs(llmData.summary?.value?.invoiceTotal?.value || 0);
      
      // Determine status
      let status = 'pending';
      if (doc.status === 'processed') {
        status = Math.random() > 0.5 ? 'paid' : 'pending';
      }

      // Determine category
      const categories = ['Software', 'Hardware', 'Services', 'Supplies', 'Utilities', 'Marketing'];
      const category = categories[Math.floor(Math.random() * categories.length)];

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${invoiceNumber}`,
          invoiceDate,
          dueDate,
          totalAmount,
          status,
          category,
          vendorId,
          customerId,
          lineItems: llmData.lineItems?.length
            ? {
                create: llmData.lineItems.map((item) => ({
                  description: item.value?.description?.value || 'Item',
                  quantity: Math.abs(item.value?.quantity?.value || 1),
                  unitPrice: Math.abs(item.value?.unitPrice?.value || 0),
                  amount: Math.abs(item.value?.total?.value || 0),
                  category,
                })),
              }
            : {
                create: [
                  {
                    description: 'Service',
                    quantity: 1,
                    unitPrice: totalAmount,
                    amount: totalAmount,
                    category,
                  },
                ],
              },
          payments:
            status === 'paid'
              ? {
                  create: [
                    {
                      paymentDate: new Date(),
                      amount: totalAmount,
                      paymentMethod: 'Bank Transfer',
                      reference: `PAY-${invoiceNumber}`,
                    },
                  ],
                }
              : undefined,
        },
      });

      processedCount++;
    } catch (error) {
      console.error(`Error processing invoice ${doc._id}:`, error);
    }
  }

  console.log(`✅ Created ${vendorMap.size} vendors and ${customerMap.size} customers`);
  console.log(`✅ Created ${processedCount} invoices with line items and payments`);
  console.log('🎉 Seed completed successfully!');
}

async function seedSampleData() {
  // Sample data generation code (existing implementation)
  console.log('Generating sample data...');
  // ... existing sample data code ...
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
