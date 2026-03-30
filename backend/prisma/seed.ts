import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.alert.createMany({
    data: [
      {
        type: 'Phishing',
        title: 'Fake Bank Verification Links',
        description: 'Scammers are sending SMS messages claiming your bank account is suspended pending KYC verification.',
        severity: 'high',
      },
      {
        type: 'UPI Fraud',
        title: 'QR Code Payment Scam',
        description: 'Fraudsters asking sellers to scan QR codes on online marketplaces under the guise of receiving payments.',
        severity: 'critical',
      },
      {
        type: 'Identity Theft',
        title: 'Social Media Impersonation',
        description: 'Cloned profiles messaging friends and family asking for urgent financial help due to a fake medical emergency.',
        severity: 'medium',
      }
    ]
  });
  console.log('Seeded database with initial alerts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
